const { app, BrowserWindow, dialog, ipcMain, Menu, clipboard, shell } = require('electron');
const { spawn } = require('node:child_process');
const path = require('node:path');
const {
  connectCodex,
  connectClaude,
  listSessions,
  loadRoleContext,
  runTessLevel4Automation,
  runVikAutomation,
  sendCodexMessage,
  sendClaudeMessage,
  listConfigurationFiles,
  openConfigurationFile
} = require('./mindshare-local-client');

const bundledPublicRoot = path.join(__dirname, 'app-content', 'mindshare', 'public');
const devPublicRoot = path.join(__dirname, '..', 'public');
const TESS_LEVEL4_INTERVAL_MS = 30 * 60 * 1000;
const VIK_AUTOMATION_INTERVAL_MS = 30 * 60 * 1000;
let tessLevel4Timer = null;
let vikAutomationTimer = null;
let configurationFileCache = null;
let configurationFileCachePromise = null;

function runPowerShell(script, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-Command', script], {
      windowsHide: true
    });
    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill();
      resolve({ ok: false, stdout, stderr: stderr || 'PowerShell shortcut process timed out.' });
    }, timeoutMs);
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timeout);
      resolve({ ok: false, stdout, stderr: error.message || String(error) });
    });
    child.on('close', (code) => {
      clearTimeout(timeout);
      resolve({ ok: code === 0, code, stdout, stderr });
    });
  });
}

async function refreshConfigurationFileCache() {
  configurationFileCachePromise = listConfigurationFiles()
    .then((payload) => {
      configurationFileCache = {
        ...payload,
        cachedAt: new Date().toISOString()
      };
      return configurationFileCache;
    })
    .catch((error) => {
      configurationFileCache = {
        ok: false,
        error: error.message || String(error),
        groups: [],
        totals: { groups: 0, files: 0 },
        cachedAt: new Date().toISOString()
      };
      return configurationFileCache;
    })
    .finally(() => {
      configurationFileCachePromise = null;
    });
  return configurationFileCachePromise;
}

async function getConfigurationFiles() {
  if (configurationFileCache) {
    refreshConfigurationFileCache();
    return configurationFileCache;
  }
  if (configurationFileCachePromise) {
    return configurationFileCachePromise;
  }
  return refreshConfigurationFileCache();
}

function clearAutomationTimer(role) {
  if (role === 'tess' && tessLevel4Timer) {
    clearInterval(tessLevel4Timer);
    tessLevel4Timer = null;
  }
  if (role === 'vik' && vikAutomationTimer) {
    clearInterval(vikAutomationTimer);
    vikAutomationTimer = null;
  }
}

function startAutomationTimer(role) {
  if (role === 'tess' && !tessLevel4Timer) {
    tessLevel4Timer = setInterval(() => {
      runTessLevel4Automation({ mode: 'scheduled' }).catch((error) => {
        console.warn('Tess Level 4 automation scheduled run failed.', error);
      });
    }, TESS_LEVEL4_INTERVAL_MS);
  }
  if (role === 'vik' && !vikAutomationTimer) {
    vikAutomationTimer = setInterval(() => {
      runVikAutomation({ mode: 'scheduled' }).catch((error) => {
        console.warn('Vik automation scheduled run failed.', error);
      });
    }, VIK_AUTOMATION_INTERVAL_MS);
  }
}

async function runAutomationNow(role) {
  if (role === 'tess') return runTessLevel4Automation({ mode: 'manual' });
  if (role === 'vik') return runVikAutomation({ mode: 'manual' });
  return { ok: false, error: `No automation runner is registered for ${role}.` };
}

async function triggerWindowsVoiceShortcut() {
  if (process.platform !== 'win32') {
    return { ok: false, error: 'The microphone shortcut is currently wired for Windows only.' };
  }
  const script = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class KeyboardInput {
  [StructLayout(LayoutKind.Sequential)]
  public struct INPUT {
    public UInt32 type;
    public KEYBDINPUT ki;
  }
  [StructLayout(LayoutKind.Sequential)]
  public struct KEYBDINPUT {
    public UInt16 wVk;
    public UInt16 wScan;
    public UInt32 dwFlags;
    public UInt32 time;
    public UIntPtr dwExtraInfo;
  }
  [DllImport("user32.dll")]
  public static extern UInt32 SendInput(UInt32 nInputs, INPUT[] pInputs, Int32 cbSize);
}
"@
$INPUT_KEYBOARD = 1
$KEYUP = 0x0002
$keys = @(0x11, 0x5B, 0x20, 0x20, 0x5B, 0x11)
$flags = @(0, 0, 0, $KEYUP, $KEYUP, $KEYUP)
$inputs = New-Object 'KeyboardInput+INPUT[]' $keys.Length
for ($i = 0; $i -lt $keys.Length; $i++) {
  $inputs[$i].type = $INPUT_KEYBOARD
  $inputs[$i].ki.wVk = [UInt16]$keys[$i]
  $inputs[$i].ki.wScan = 0
  $inputs[$i].ki.dwFlags = [UInt32]$flags[$i]
  $inputs[$i].ki.time = 0
  $inputs[$i].ki.dwExtraInfo = [UIntPtr]::Zero
}
$sent = [KeyboardInput]::SendInput([UInt32]$inputs.Length, $inputs, [Runtime.InteropServices.Marshal]::SizeOf([KeyboardInput+INPUT]))
if ($sent -ne $inputs.Length) {
  throw "SendInput sent $sent of $($inputs.Length) keyboard events."
}
Write-Output "sent=$sent"
`;
  const result = await runPowerShell(script);
  if (!result.ok) {
    return { ok: false, error: (result.stderr || result.stdout || 'Windows SendInput failed.').trim() };
  }
  return { ok: true, message: (result.stdout || '').trim() || 'Shortcut sent.' };
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    }
  });

  window.maximize();
  const publicRoot = require('node:fs').existsSync(path.join(bundledPublicRoot, 'index.html'))
    ? bundledPublicRoot
    : devPublicRoot;
  window.loadFile(path.join(publicRoot, 'index.html'));
  window.webContents.on('render-process-gone', (_event, details) => {
    console.error('MindShare renderer process exited.', details);
  });
  window.webContents.on('unresponsive', () => {
    console.error('MindShare renderer became unresponsive.');
  });
  window.webContents.on('responsive', () => {
    console.warn('MindShare renderer became responsive again.');
  });
  window.webContents.on('before-input-event', (event, input) => {
    const key = String(input.key || '').toLowerCase();
    const isRefresh = key === 'f5' || (key === 'r' && (input.control || input.meta));
    if (isRefresh) {
      event.preventDefault();
      window.webContents.reloadIgnoringCache();
    }
  });
}

function installApplicationMenu() {
  const template = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Refresh Interface',
          accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
          click: (_menuItem, browserWindow) => {
            browserWindow?.webContents.reloadIgnoringCache();
          }
        },
        {
          label: 'Refresh Interface',
          accelerator: 'F5',
          visible: false,
          click: (_menuItem, browserWindow) => {
            browserWindow?.webContents.reloadIgnoringCache();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'selectAll' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.handle('mindshare:codex-connect', async (_event, payload) => connectCodex(payload));
ipcMain.handle('mindshare:claude-connect', async (_event, payload) => connectClaude(payload));
ipcMain.handle('mindshare:sessions', async () => listSessions());
ipcMain.handle('mindshare:role-context', async (_event, payload) => loadRoleContext(payload));
ipcMain.handle('mindshare:tess-level4-automation', async (_event, payload) => runTessLevel4Automation(payload));
ipcMain.handle('mindshare:vik-automation', async (_event, payload) => runVikAutomation(payload));
ipcMain.handle('mindshare:automation-control', async (_event, payload = {}) => {
  const role = String(payload.role || '').toLowerCase();
  const action = String(payload.action || '').toLowerCase();
  if (!['tess', 'vik'].includes(role)) return { ok: false, error: `No automation timer is registered for ${role || 'that role'}.` };
  if (action === 'run') return { ok: true, action, role, result: await runAutomationNow(role) };
  if (action === 'pause') {
    clearAutomationTimer(role);
    return { ok: true, action, role, timerActive: false };
  }
  if (action === 'stop') {
    clearAutomationTimer(role);
    return { ok: true, action, role, timerActive: false };
  }
  if (action === 'resume') {
    startAutomationTimer(role);
    return { ok: true, action, role, timerActive: true };
  }
  return { ok: false, error: `Unsupported automation action: ${action || 'none'}.` };
});
ipcMain.handle('mindshare:codex-message', async (_event, payload) => sendCodexMessage(payload));
ipcMain.handle('mindshare:claude-message', async (_event, payload) => sendClaudeMessage(payload));
ipcMain.handle('mindshare:configuration-files', async () => getConfigurationFiles());
ipcMain.handle('mindshare:open-configuration-file', async (_event, payload) => openConfigurationFile(payload));
ipcMain.handle('mindshare:microphone-shortcut', async () => triggerWindowsVoiceShortcut());
ipcMain.handle('mindshare:choose-files', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Attach files',
    properties: ['openFile', 'multiSelections']
  });
  if (result.canceled) {
    return { ok: true, files: [] };
  }
  return {
    ok: true,
    files: result.filePaths.map((filePath) => ({
      path: filePath,
      name: path.basename(filePath)
    }))
  };
});
ipcMain.handle('mindshare:choose-image-files', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Choose source images',
    defaultPath: path.join(process.env.USERPROFILE || process.env.HOME || '', 'Pictures'),
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled) {
    return { ok: true, files: [] };
  }
  return {
    ok: true,
    files: result.filePaths.map((filePath) => ({
      path: filePath,
      name: path.basename(filePath)
    }))
  };
});
ipcMain.handle('mindshare:copy-text', async (_event, payload = {}) => {
  clipboard.writeText(String(payload.text || ''));
  return { ok: true };
});
ipcMain.handle('mindshare:show-file', async (_event, payload = {}) => {
  const filePath = String(payload.path || '');
  if (!filePath) return { ok: false, error: 'No file path provided.' };
  shell.showItemInFolder(filePath);
  return { ok: true };
});

app.whenReady().then(() => {
  app.on('child-process-gone', (_event, details) => {
    console.error('MindShare child process exited.', details);
  });
  installApplicationMenu();
  refreshConfigurationFileCache();
  createWindow();
  runTessLevel4Automation({ mode: 'scheduled' }).catch((error) => {
    console.warn('Tess Level 4 automation startup run failed.', error);
  });
  startAutomationTimer('tess');
  runVikAutomation({ mode: 'scheduled' }).catch((error) => {
    console.warn('Vik automation startup run failed.', error);
  });
  startAutomationTimer('vik');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    clearAutomationTimer('tess');
    clearAutomationTimer('vik');
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
