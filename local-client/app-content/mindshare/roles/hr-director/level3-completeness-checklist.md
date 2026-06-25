# Level 3 Completeness Checklist

Owner: Cole / HR Director
Status: active checklist
Canonical source: `C:\Users\scott\Code\mindshare\roles\hr-director\level3-completeness-checklist.md`

## Purpose

This checklist defines what must exist before a Mindshare team member is considered Level 3 Staff complete.

Level 3 Staff is not an autonomy level. It is the final non-autonomous operating stage: the person can work as an internal role with loaded role context, but has no autonomous runtime, no production access, no Git/release authority, no external communication, no spending authority, no secrets access, and no authority expansion.

## Required Local Role Files

Cole must confirm or create these files in the local role root:

- `name.md`
- `personality.md`
- `WhoAmI.md`
- `gate-blocks.md`
- `role-agent.md`
- `memory.md`
- `workflow.md`
- `Autonomy.md`
- `state.json`

Cole may create missing files only when the content is clearly template-derived and does not change role authority, lifecycle, autonomy, production, Git/release, external communication, spending, secrets, or another owner's substantive role decisions.

## Who Am I Requirements

`WhoAmI.md` must include an `Autonomy Context` section with:

- current autonomy level and operating stage
- active autonomy capability summary, or "none active"
- lower-level context the role must keep in mind
- Level 4, Level 5, and Level 6 capability placeholders or approved definitions
- canonical `Autonomy.md` source path
- reminder that the card gives awareness, not authority

## Autonomy File Requirements

Every Level 3 Staff role must have an `Autonomy.md` file, even when no autonomy is active.

At Level 3, `Autonomy.md` must say:

- current autonomy level is Level 3 Staff
- Level 3 is not autonomous
- Level 4 scoped autonomy is undefined until Tess builds and Scott reviews it
- Level 5 policy autonomy is undefined until Tess builds and Scott reviews it
- Level 6 native autonomy is undefined or deferred unless Scott explicitly asks for it
- no authority is granted by the presence of the file

## Completion Gates

Cole records Level 3 completion only when:

- the role has a local role root
- all required files exist
- `WhoAmI.md` includes Autonomy Context
- `Autonomy.md` exists and does not grant active autonomy unless separately approved
- `state.json` records current stage and authority boundary
- the recruiting pipeline or roster records the person as Level 3 Staff or higher
- any remaining substantive role-definition gaps are routed to the correct owner

## Correction Routing

- Missing structural file: Cole
- Role lifecycle or hire record: Ana
- Autonomy capability definition or promotion review: Tess and Scott
- Architecture/control-plane implication: Vik
- Release/Git durability: Reid
- Public website publication: Liz when public website is in scope
- Final approval or authority expansion: Scott or Rae

## Boundary

This checklist does not approve promotion above Level 3, autonomy, runtime activation, production, Git/release, external communication, spending, secrets, gate edits, or authority expansion.

## Changelog

| Date | Change | Owner |
| --- | --- | --- |
| 2026-06-25 | Created Level 3 completeness checklist and made `Autonomy.md` part of Level 3 baseline completeness. | Tess |
