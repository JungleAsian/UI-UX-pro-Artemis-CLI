# Security posture

## What this CLI does

- Writes local Markdown skill/rule files into selected assistant config directories.
- Optionally removes only the files/directories it created.
- Copies bundled local assets for Claude-style skill installs.

## What this CLI does not do

- It does not run shell commands.
- It does not download remote files.
- It does not collect telemetry.
- It does not read environment secrets.
- It does not include install lifecycle scripts.

## Review checklist before publishing

```bash
npm pack --dry-run
npm audit --omit=dev
node ./bin/uipro-artemis.js doctor
node ./bin/uipro-artemis.js init --ai all --dry-run
```
