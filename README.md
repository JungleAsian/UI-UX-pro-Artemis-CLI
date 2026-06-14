# UI UX Pro Artemis CLI

Clean-room CLI for installing an original UI/UX assistant skill into frontend projects.

Artemis is intentionally conservative: it installs local Markdown guidance files for AI coding assistants without telemetry, lifecycle scripts, remote downloads, shell execution, or runtime dependencies.

## Why this exists

AI coding tools are good at producing frontend code, but they often skip the design reasoning step. Artemis adds a small, inspectable UI/UX layer that encourages assistants to plan design systems, accessibility, hierarchy, and component states before generating code.

## Security posture

- No telemetry
- No `postinstall` / `preinstall` scripts
- No shell execution
- No remote downloads
- No dependencies
- Offline-first templates
- Refuses to overwrite existing files unless `--force` is used

## Install locally for testing

```bash
npm install
node ./bin/uipro-artemis.js doctor
```

Or install globally from a local checkout:

```bash
npm install -g .
uipro-artemis doctor
```

## Usage

```bash
uipro-artemis init --ai claude
uipro-artemis init --ai cursor
uipro-artemis init --ai all --dry-run
uipro-artemis uninstall --ai claude
uipro-artemis list
uipro-artemis doctor
```

Supported assistants:

- `claude`
- `cursor`
- `windsurf`
- `copilot`
- `codex`
- `gemini`
- `opencode`

## Design-system helper

For Claude-style installs, a small offline helper is included:

```bash
node .claude/skills/ui-ux-artemis/assets/scripts/design-system.mjs "fintech dashboard"
```

## Documentation

- [Getting started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [AI assistant usage](docs/AI-ASSISTANTS.md)
- [Security audit notes](docs/SECURITY-AUDIT.md)
- [Security policy](SECURITY.md)

## Clean-room note

This project does not copy UI UX Pro Max content. It is a clean-room implementation of the installer idea and an original lightweight UI/UX skill template.
