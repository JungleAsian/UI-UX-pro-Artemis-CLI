# Architecture

UI UX Pro Artemis CLI is a small offline-first Node.js CLI that installs UI/UX guidance files into AI coding assistant configuration folders.

## Design goals

- Keep the installer boring and auditable.
- Avoid lifecycle scripts such as `postinstall` and `preinstall`.
- Avoid remote downloads, telemetry, eval, child processes, and shell execution.
- Keep generated files human-readable Markdown.
- Make uninstall safe by removing only paths created by this CLI.

## Runtime model

```text
user command
  -> parse flags
  -> resolve assistant target
  -> read bundled template files
  -> write files into local project or config path
```

The CLI does not connect to the network. All templates and data are bundled inside the package.

## Supported assistant targets

| Target | Local install path |
| --- | --- |
| Claude | `.claude/skills/ui-ux-artemis/` |
| Cursor | `.cursor/rules/ui-ux-artemis.mdc` |
| Windsurf | `.windsurf/rules/ui-ux-artemis.md` |
| GitHub Copilot | `.github/prompts/ui-ux-artemis.prompt.md` |
| Codex | `.codex/ui-ux-artemis.md` |
| Gemini | `.gemini/ui-ux-artemis.md` |
| OpenCode | `.opencode/ui-ux-artemis.md` |

## File layout

```text
bin/uipro-artemis.js          CLI entrypoint
templates/SKILL.md            assistant skill/rule template
templates/COMMAND.md          reusable command prompt template
assets/data/design-rules.json original lightweight UX rules
assets/scripts/design-system.mjs offline helper script
docs/                         documentation
```

## Clean-room boundary

This project is an original implementation of an installer pattern. It does not copy proprietary database entries, wording, or implementation from any upstream UI/UX package.
