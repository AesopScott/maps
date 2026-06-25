param(
    [string]$LocalClientRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$OutputRoot = ""
)

$ErrorActionPreference = "Stop"

if (-not $OutputRoot) {
    $localAppData = [Environment]::GetFolderPath("LocalApplicationData")
    $OutputRoot = Join-Path $localAppData "MindShareCentral\graphify-corpus"
}

$repoRoot = (Resolve-Path (Join-Path $LocalClientRoot "..")).Path
$outputPath = Join-Path $OutputRoot "local-client"

if (Test-Path -LiteralPath $OutputRoot) {
    Remove-Item -LiteralPath $OutputRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $outputPath -Force | Out-Null

function Copy-IfPresent {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$Destination
    )

    if (-not (Test-Path -LiteralPath $Source)) {
        return
    }

    $destinationParent = Split-Path -Parent $Destination
    New-Item -ItemType Directory -Path $destinationParent -Force | Out-Null
    Copy-Item -LiteralPath $Source -Destination $Destination -Force
}

function Copy-TreeFiles {
    param(
        [Parameter(Mandatory = $true)][string]$SourceRoot,
        [Parameter(Mandatory = $true)][string]$DestinationRoot,
        [Parameter(Mandatory = $true)][string[]]$Include
    )

    if (-not (Test-Path -LiteralPath $SourceRoot)) {
        return
    }

    $resolvedSourceRoot = (Resolve-Path -LiteralPath $SourceRoot).Path
    $allowedExtensions = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($pattern in $Include) {
        if ($pattern.StartsWith("*.")) {
            [void]$allowedExtensions.Add($pattern.Substring(1))
        }
    }

    Get-ChildItem -LiteralPath $resolvedSourceRoot -Recurse -File |
        Where-Object {
            $allowedExtensions.Contains($_.Extension) -and
            $_.FullName -notmatch "\\node_modules\\" -and
            $_.FullName -notmatch "\\app-content\\" -and
            $_.FullName -notmatch "\\graphify-out\\" -and
            $_.FullName -notmatch "\\graphify-corpus\\" -and
            $_.FullName -notmatch "\\assets\\"
        } |
        ForEach-Object {
            $relative = $_.FullName.Substring($resolvedSourceRoot.Length).TrimStart("\", "/")
            Copy-IfPresent -Source $_.FullName -Destination (Join-Path $DestinationRoot $relative)
        }
}

$rootFiles = @(
    "main.js",
    "preload.js",
    "mindshare-local-client.js",
    "mindshare-local-bridge-server.js",
    "package.json"
)

foreach ($file in $rootFiles) {
    Copy-IfPresent -Source (Join-Path $LocalClientRoot $file) -Destination (Join-Path $outputPath $file)
}

Copy-TreeFiles -SourceRoot (Join-Path $LocalClientRoot "scripts") -DestinationRoot (Join-Path $outputPath "scripts") -Include @("*.ps1", "*.js", "*.json")
Copy-TreeFiles -SourceRoot (Join-Path $LocalClientRoot "chrome-extension") -DestinationRoot (Join-Path $outputPath "chrome-extension") -Include @("*.js", "*.json", "*.css")
Copy-TreeFiles -SourceRoot (Join-Path $LocalClientRoot "native-host") -DestinationRoot (Join-Path $outputPath "native-host") -Include @("*.js", "*.json", "*.ps1")
Copy-TreeFiles -SourceRoot (Join-Path $repoRoot "public") -DestinationRoot (Join-Path $OutputRoot "public") -Include @("*.js", "*.json", "*.css")

$fileCount = (Get-ChildItem -LiteralPath $OutputRoot -Recurse -File | Measure-Object).Count
Write-Output "Graphify corpus ready: $OutputRoot"
Write-Output "Files copied: $fileCount"
