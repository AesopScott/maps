# Project Foundation

## Kickoff

M0 Project Foundation for `mindshare`, the parent organization for projects under the Mindshare umbrella.

## Project

- Name: mindshare
- Owner: Scott
- Repository: C:\Users\scott\Code\mindshare
- Date: 2026-06-19
- Project type: Parent organization multi-agent project
- Primary customer or operator: Scott
- Desired outcome: Oversee all projects underneath the Mindshare umbrella through a consistent MAPS memory and skill-output structure.

## M0 Preflight Decisions

| Decision | Answer | Confirmed by | Notes |
|---|---|---|---|
| RAG exists? | Yes | Scott | Obsidian itself is the RAG store for now. |
| Notes location | G:\My Drive\Mindshare | Scott | Current `mindshare` project root. |
| Notes access method | filesystem | Scott | Google Drive-backed Obsidian vault. |
| Additional notes locations | None yet | Scott | Not needed for M0. |
| RAG provider/location/index | Obsidian at G:\My Drive\Mindshare | Scott | No separate vector index configured yet. |
| RAG access method | filesystem | Scott | Markdown-first access. |
| Additional RAG/index locations | None yet | Scott | Future explicit indexes can be added later. |
| Canonical store policy | Obsidian is canonical for project-authored notes, durable memory, and RAG. `.maps` is automation state. | Scott | Standard project writes go to the project folder; MAPS-specific writes go to `maps-runs`. |
| Memory root | G:\My Drive\Mindshare | Scott | No separate `memory` folder for now. Durable memory files live at the top level. |
| Memory access method | filesystem | Scott | Markdown files in Obsidian. |
| Sources root | G:\My Drive\Mindshare | Scott | Source material is not separately managed yet. |
| Sources access method | filesystem | Scott | Capture sources in ordinary Obsidian notes until a source workflow is defined. |
| Reuse remembered defaults? | No prior defaults existed | Codex | Fresh project preferences were created. |
| Project identity and type | `mindshare`, parent organization multi-agent project | Scott | Not a downstream product org using MAPS. |
| Project intent | Oversee all projects underneath the Mindshare umbrella | Scott | Parent project control layer. |
| Primary customer/operator | Scott | Scott | Solo operator for now. |
| Update global living template? | Yes | Scott | Future projects should use G:\My Drive\Mindshare\[project]. |

## Customer Story

- As a: Scott, operating the Mindshare parent project
- I need: a durable, Obsidian-centered way to organize MAPS work across all child projects
- So I can: keep project context, skill outputs, memory, and retrieval aligned across the Mindshare umbrella.

## Current Workflow

- Current process: Scott uses Obsidian as the working knowledge base and durable project memory. MAPS skills are invoked from Codex against project repositories.
- Pain points: The default MAPS scaffold assumes separate `notes`, `sources`, and `memory` folders, but Scott wants Obsidian to be the canonical project store with standard project writes in the project folder and MAPS-specific writes in `maps-runs`.
- Workarounds: Record the desired Obsidian contract explicitly in this foundation and in `.maps/foundation-preferences.json`; use `maps-runs` for MAPS-specific outputs and helper-maintained skill notes.
- Evidence: M0 preflight conversation with Scott on 2026-06-19.

## EventStorming Lite

| Domain event | Trigger or command | Actor | Policy or rule | System/data touched | Pain point | Question |
|---|---|---|---|---|---|---|
| Mindshare foundation is created | `/foundation` | Scott, Codex | Ask one question at a time; do not infer foundation defaults without confirmed answers | Codex repo, Obsidian vault | Existing skill wording asks about defaults too early | Should the skill permanently remove the defaults question? |
| MAPS skill run completes | `/shape`, `/define-agent`, etc. | Scott, Codex | Write MAPS-specific output, run summary, and helper-maintained skill note into `maps-runs` | G:\My Drive\Mindshare\maps-runs | Older foundation wording referenced top-level skill folders | Which stale references still need cleanup? |
| Child project is added | New project under Mindshare | Scott | Future projects should write to G:\My Drive\Mindshare\[project] | Obsidian vault, global foundation preferences | Placeholder behavior is policy, not native helper behavior yet | How should `[project]` be resolved automatically? |
| Project context is queried | Scott asks what is known | Scott, Codex | Answer from Obsidian/MAPS memory where appropriate | Obsidian notes, `.maps` state | RAG is Obsidian, not a separate index yet | What retrieval/indexing tool should eventually sit on top of Obsidian? |

## Service Blueprint Lite

| Customer/operator action | Visible agent/system action | Backstage process | Supporting system/data | Evidence/source | Failure point |
|---|---|---|---|---|---|
| Scott invokes a MAPS phase | Codex asks focused preflight questions one at a time | Skill reads project preferences and writes phase output | `.maps/foundation-preferences.json`, Obsidian `maps-runs` folder | M0 conversation | Skill asks abstract defaults questions instead of concrete location questions |
| Scott confirms project memory layout | Codex records Obsidian as canonical | Preferences and foundation contract are updated | G:\My Drive\Mindshare, project foundation file | M0 conversation | Helper scripts assume `notes/sources/memory` scaffold |
| A future project starts | Codex proposes G:\My Drive\Mindshare\[project] as project root | Global foundation preferences are read | C:\Users\scott\.codex\maps\foundation-preferences.json | Scott's clarification | Placeholder may need custom skill support |
| A phase output is completed | Output appears in `maps-runs` | Optional RAG manifest records changed notes | Obsidian, `.maps/rag-updates.json` | This foundation run | Obsidian RAG has no separate reindex mechanism yet |

## Product Intent

- Project purpose: Oversee all projects underneath the Mindshare umbrella.
- User value: Scott gets a consistent project-control layer for MAPS work and project memory.
- Business or mission value: Mindshare can accumulate durable operating context across many projects without scattering phase outputs and decisions.
- Why agents are appropriate: MAPS work involves repeated research, design, build, evaluation, observation, and improvement loops that agents can perform and document consistently.
- Why multiple agents may be needed: The parent project may eventually coordinate distinct roles for project intake, memory maintenance, planning, evaluation, deployment, and review across child projects.

## Scaffold

Create or confirm:

```text
.maps/
  foundation-preferences.json
  rag-updates.json
G:\My Drive\Mindshare\
  maps-runs/
  project-context.md
  glossary.md
  entity-map.md
```

For future projects, use:

```text
G:\My Drive\Mindshare\[project]\
  maps-runs/
```

## Remembered Foundation Preferences

- Preference source: project
- Notes root: G:\My Drive\Mindshare
- Notes access method: filesystem
- Additional notes locations:
- Sources root: G:\My Drive\Mindshare
- Sources access method: filesystem
- Memory root: G:\My Drive\Mindshare
- Memory access method: filesystem
- RAG provider: Obsidian
- RAG location: G:\My Drive\Mindshare
- RAG index path:
- RAG access method: filesystem
- Additional RAG locations:
- Canonical store policy: Obsidian vault at G:\My Drive\Mindshare is canonical for project-authored notes, durable memory, and RAG. Standard project writes should go to the project folder. MAPS-specific phase outputs, run summaries, and helper-maintained skill notes should go to `G:\My Drive\Mindshare\maps-runs`. MAPS project state in `.maps` is automation state. Source material is not separately managed yet; capture it in ordinary Obsidian notes unless a later source workflow is defined.
- Global default used?: no
- Updated `.maps/foundation-preferences.json`?: yes

## Persistent Memory Contract

| Store | Type | Location | Purpose | Update trigger | Update method | Sync rule | Canonical? | Do not write |
|---|---|---|---|---|---|---|---|---|
| Obsidian project root | Markdown vault | G:\My Drive\Mindshare | Canonical project-authored notes, durable memory, and RAG for `mindshare`. | Any stable project fact, decision, ordinary project note, or retrieval-worthy update. | Create or edit Markdown in the project folder. | Treat `.maps` as automation metadata derived from or pointing back to Obsidian. | Yes | Secrets, unsupported claims, noisy raw logs, or MAPS-specific run artifacts. |
| MAPS runs | Markdown folder | G:\My Drive\Mindshare\maps-runs | MAPS-specific phase outputs, run summaries, and helper-maintained skill notes. | Completion of a MAPS skill phase or MAPS-specific durable output. | Write or append the artifact and run summary in `maps-runs`. | Helper-maintained notes and RAG manifests should point back to `maps-runs`. | Yes for MAPS phase outputs and summaries | Mixed-project notes or unrelated scratch work. |
| Project context | Markdown memory | G:\My Drive\Mindshare\project-context.md | Stable facts about Mindshare, its purpose, structure, and operating context. | Durable project context changes. | Append or revise concise Markdown entries. | Keep aligned with foundation and later phase outputs. | Yes | Temporary brainstorms. |
| Glossary | Markdown memory | G:\My Drive\Mindshare\glossary.md | Shared terms and definitions. | New stable term or changed definition. | Add or update definitions. | Keep terms consistent across skill outputs. | Yes | Ambiguous terms without context. |
| Entity map | Markdown memory | G:\My Drive\Mindshare\entity-map.md | People, projects, systems, and relationships under Mindshare. | New child project, stakeholder, tool, or relationship. | Add concise entity entries and links. | Keep synced with child-project foundations. | Yes | Private personal data beyond project needs. |
| Source material | Ordinary Obsidian notes for now | G:\My Drive\Mindshare | Raw evidence, docs, transcripts, screenshots, or links when they matter. | A source becomes important to project reasoning. | Capture it where it naturally belongs in Obsidian. Define a dedicated source workflow later if needed. | Cite or link source notes from phase outputs. | Yes when captured and cited | Unapproved private material or uncited dumps. |
| RAG | Obsidian | G:\My Drive\Mindshare | Queryable project knowledge. | New or changed approved notes or memory. | Use Obsidian as retrieval corpus; future indexes should derive from it. | Derived indexes must point back to Obsidian notes. | Yes for current retrieval corpus | Separate stale indexes without provenance. |
| MAPS state | JSON state | .maps/foundation-preferences.json | Remembered scaffold and memory routing for future skill runs. | Foundation configuration changes. | Structured JSON update. | Reflect important choices in this document and global defaults when approved. | Yes for automation defaults | Long prose or source evidence. |
| RAG update manifest | JSON state | .maps/rag-updates.json | Append-only record of MAPS outputs needing retrieval awareness. | New or changed MAPS phase output. | Append a structured entry. | Future indexing automation may consume it. | No, derived from canonical stores | Long prose or raw evidence. |

## MAPS Skill Run Log

| Timestamp | Skill | Phase | Output | Memory updates | Notes |
|---|---|---|---|---|---|
| 2026-06-19T02:10:00+00:00 | /foundation | M0 | project-foundation.md; G:\My Drive\Mindshare\foundation\foundation.md | Created project foundation, project preferences, global defaults, Obsidian skill folders, and initial memory contract | Helper apply had a Windows backslash escaping issue; Markdown artifacts were written directly. |
| 2026-06-19T02:36:49+00:00 | /role | Role | roles/agentic-systems-program-manager/role-agent.md | Created Agentic Systems Program Manager role contract and workflow; added AGENTS.md automatic activation hook; mirrored role artifacts to G:\My Drive\Mindshare\role\agentic-systems-program-manager. | Role implemented as workflow owner with advisory auto-trigger for MAPS pipeline and skill-development prompts. |
| 2026-06-19T03:03:34+00:00 | /role | Role | roles/agentic-systems-program-manager/role-agent.md | Added Matt as the friendly/manual invocation name for the Agentic Systems Program Manager role; synced local and Obsidian role artifacts. | Manual call names now include Matt, ask Matt, Matt's review, ASPM review, and Agentic Systems Program Manager review. |
| 2026-06-19T03:15:08+00:00 | /shape | M1 | G:\My Drive\Mindshare\maps-runs\system-shape.md | Created M1 system shape; moved MAPS-specific output to `maps-runs`; updated G:\My Drive\Mindshare\project-context.md and G:\My Drive\Mindshare\entity-map.md; helper updated maps-runs shape note and .maps rag manifest. | M1 selected Multi-Agent / MAPS with flexible staged authority and Matt's accepted failure/escalation baseline. |
| 2026-06-19T03:18:20+00:00 | /foundation | M0 | C:\Users\scott\Code\mindshare\project-foundation.md | Corrected standard project vs MAPS-specific write routing; updated project and global foundation preferences; moved M1 shape artifact to maps-runs. | Scott clarified the canonical routing split after M1 shape. |
## Evidence Index

| Evidence | Source | What it supports | Confidence |
|---|---|---|---|
| Scott named the project `mindshare` and owner Scott | M0 preflight conversation | Project identity | High |
| Scott described the project as a parent org multi-agent project | M0 preflight conversation | Project type | High |
| Scott said the purpose is to oversee all projects underneath the Mindshare umbrella | M0 preflight conversation | Project intent | High |
| Scott said the primary customer/operator is likely just Scott | M0 preflight conversation | Primary operator | High |
| Scott identified Obsidian at G:\My Drive\Mindshare as notes, memory, and RAG | M0 preflight conversation | Memory/RAG architecture | High |
| Scott clarified future projects should write to a `[project]` folder | M0 preflight conversation | Global default pattern | High |

## Source Inventory

| Source | Type | Location | Owner | RAG ready? | Notes |
|---|---|---|---|---|---|
| M0 preflight conversation | Conversation | Current Codex thread | Scott | Yes | Primary evidence for this foundation. |
| Obsidian vault | Markdown filesystem | G:\My Drive\Mindshare | Scott | Yes | Canonical project store. |
| Project preferences | JSON | .maps/foundation-preferences.json | Scott | Yes for automation | Project-local routing. |
| Global preferences | JSON | C:\Users\scott\.codex\maps\foundation-preferences.json | Scott | Yes for automation | Future project pattern. |

## Assumptions

| Assumption | Why it matters | How to test | Status |
|---|---|---|---|
| Obsidian can serve as RAG without a separate index for now | Determines whether additional vector/index setup is needed | Ask retrieval questions against Obsidian-backed memory | Accepted for M0 |
| MAPS-specific writes belong in `maps-runs`; standard project writes belong in the project folder | Determines phase-output routing | Run the next MAPS skill and inspect output placement | Accepted after M1 correction |
| Source material does not need a dedicated folder yet | Avoids imposing structure Scott has not chosen | Revisit when source volume becomes painful | Open |
| Future projects should use G:\My Drive\Mindshare\[project] | Establishes global default pattern | Start the next project foundation and confirm route | Accepted for M0 |

## Decisions

| Decision | Rationale | Date | Owner |
|---|---|---|---|
| Use Obsidian at G:\My Drive\Mindshare as canonical for `mindshare` | Scott already treats Obsidian as notes, memory, and RAG | 2026-06-19 | Scott |
| Use `maps-runs` for MAPS-specific writes | Scott clarified that standard project writes go to the project folder and MAPS-specific writes go to `maps-runs` | 2026-06-19 | Scott |
| Do not create separate `notes`, `sources`, or `memory` folders for `mindshare` | Scott wants everything in the top-level project folder | 2026-06-19 | Scott |
| Use G:\My Drive\Mindshare\[project] for future projects | Keeps child projects separated under the Mindshare umbrella | 2026-06-19 | Scott |
| Promote this layout to global defaults | Scott explicitly approved reuse for future `/foundation` runs | 2026-06-19 | Scott |

## Open Questions

- Should the Foundation skill be updated so it asks concrete location questions instead of asking whether to use defaults?
- Which generated artifacts or templates still need routing review after the `maps-runs` correction?
- When source material becomes important, should it get its own Obsidian convention or remain ordinary linked notes?
- Should a separate vector index eventually be created from Obsidian, or is Obsidian-native retrieval enough?
- What child projects currently belong under the Mindshare umbrella?

## RAG Readiness

- Source types to index: Obsidian Markdown notes, MAPS phase outputs under `maps-runs`, project-context.md, glossary.md, entity-map.md, and later source notes when defined.
- Required metadata: project name, skill slug, phase, owner, date, source/evidence links, canonical path.
- Privacy or access limits: do not write secrets, raw private data, or uncited dumps into shared retrieval notes.
- Citation requirements: phase outputs should link back to source notes or name the conversation/source that supports claims.
- Freshness rules: update memory when durable facts change; treat `.maps/rag-updates.json` as a reindex/awareness manifest.
- Exclusions: temporary scratch notes, noisy logs, unrelated project material, and separate stale indexes without provenance.

## Next Path

- Scope First: Useful if the next step is cataloging all Mindshare child projects and deciding what the parent org must coordinate.
- Single-Agent / APS: Too narrow for the stated parent-org oversight purpose.
- Multi-Agent / MAPS: Best fit because the umbrella may require distinct project intake, memory maintenance, planning, evaluation, deployment, observation, and improvement responsibilities.
- Recommendation: Multi-Agent / MAPS, with an M1 Scope/Shape pass next to identify child projects, workflows, roles, memory boundaries, and coordination needs.

## M1 Handoff Questions

- What projects currently live under the Mindshare umbrella?
- What does "oversee" mean operationally: planning, status, memory, review, resource allocation, execution, or all of these?
- Which project events should the parent org remember?
- Which child-project artifacts should roll up into Mindshare memory?
- Which roles need separate tools, permissions, or memory?
- What source material already exists outside Obsidian and should be imported?
- What can run in parallel across child projects?
- What failure modes would require escalation to Scott?
