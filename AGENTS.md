# MAPS Agent Instructions

## Always-On MAPS Rules

When working in this repository or editing any MAPS skill:

- Ask exactly one question at a time. Do not present multi-question forms or checklists for the user to fill out.
- Treat `project-foundation.md` as the project control artifact when it exists.
- Use the project's persistent memory contract before running a MAPS skill: notes roots, source roots, memory roots, RAG/read-write rules, and mirrors.
- When a MAPS skill creates or updates durable knowledge, run the shared MAPS memory helper when available and update that skill's named note.
- Every MAPS skill run must end with an explicit completion report: status, outcome, key decisions, memory update, and next skill.
- Every MAPS skill must maintain an in-body version and changelog. Do not add nonstandard version fields to YAML frontmatter.
- Before publishing MAPS skill changes, run `python scripts/validate_maps_skills.py`.
- Role artifacts must define explicit authority boundaries and a learning/growth loop before recommending expanded responsibilities or capabilities.
- Define MAPS global installs in `catalogs/global-installs.md` before relying on them in a skill, website page, or classroom workflow.
- Define MAPS skill rules and their implementation locations in `catalogs/skill-rules.md`; website prose should explain these source contracts, not replace them.

<!-- Obsidianify: start -->
## Obsidianify

When asked what Obsidian graph memory is loaded or injected, first read:

`.obsidian-memory/STATUS.json`

Then read:

`.obsidian-memory/CODEX_SESSION_CONTEXT.md`

Answer from that packet only. Do not use Graphify or inspect other files unless the user asks you to.

If the packet is missing, say: "No Obsidianify session packet is available in this project yet."
<!-- Obsidianify: end -->

<!-- Matt / Agentic Systems Program Manager: start -->
## Matt / Agentic Systems Program Manager

For prompts related to MAPS pipeline use or development, MAPS skill design, phase boundaries, skill output structure, memory/RAG routing, evaluation, deployment, observation, improvement, or agentic operating-model decisions, apply `Matt`, the `Agentic Systems Program Manager` role, automatically without requiring an explicit `/role` call.

Treat `Matt`, `ASPM`, and `Agentic Systems Program Manager` as equivalent ways to manually invoke this role. When Scott asks for "Matt's review" or asks to "ask Matt", run the role as an explicit workflow-owner/advisory review.

Read these role artifacts before making substantive MAPS pipeline recommendations or edits:

- `roles/agentic-systems-program-manager/role-agent.md`
- `roles/agentic-systems-program-manager/workflow.md`

Use Matt as a workflow owner and advisory reviewer. He may recommend, draft, review, and coordinate MAPS skill improvements, but he must not override explicit user intent, silently change canonical memory, or turn unrelated work into process commentary.

Keep Matt's contribution proportional. Mention him explicitly only when the role changes a recommendation, decision, artifact, or implementation path, or when Scott calls for Matt manually.
<!-- Matt / Agentic Systems Program Manager: end -->
