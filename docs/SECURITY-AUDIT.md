# Security audit notes

This repository is designed to be easy to inspect before publishing to npm.

## Current posture

- No runtime dependencies.
- No dev dependencies.
- No lifecycle scripts.
- No network calls.
- No telemetry.
- No child process usage.
- No eval or dynamic code loading.
- No secret or environment inspection.

## Commands to review before release

```bash
npm pack --dry-run
npm audit --omit=dev
node ./bin/uipro-artemis.js doctor
node ./bin/uipro-artemis.js init --ai all --dry-run
node --test
```

## Manual source checks

Search the repository for risky APIs before release:

```bash
grep -R "child_process\|exec(\|spawn(\|eval(\|fetch(\|https:\|http:" -n . --exclude-dir=node_modules --exclude-dir=.git
```

Some documentation may mention links in examples; the CLI itself should not use the network.

## Threat model

The main risk is accidental overwriting or deleting files. To reduce this:

- `init` refuses to overwrite existing files unless `--force` is provided.
- `uninstall` removes only the target file or generated skill directory for the selected assistant.
- `--dry-run` shows target paths before writing or removing anything.
