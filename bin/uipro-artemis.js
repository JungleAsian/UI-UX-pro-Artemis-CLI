#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const SUPPORTED = new Map([
  ['claude', { dir: ['.claude', 'skills', 'ui-ux-artemis'], skill: true }],
  ['cursor', { dir: ['.cursor', 'rules'], ruleFile: 'ui-ux-artemis.mdc' }],
  ['windsurf', { dir: ['.windsurf', 'rules'], ruleFile: 'ui-ux-artemis.md' }],
  ['copilot', { dir: ['.github', 'prompts'], commandFile: 'ui-ux-artemis.prompt.md' }],
  ['codex', { dir: ['.codex'], ruleFile: 'ui-ux-artemis.md' }],
  ['gemini', { dir: ['.gemini'], ruleFile: 'ui-ux-artemis.md' }],
  ['opencode', { dir: ['.opencode'], ruleFile: 'ui-ux-artemis.md' }]
]);

function printHelp() {
  console.log(`uipro-artemis 0.1.0\n\nUsage:\n  uipro-artemis init --ai <assistant|all> [--global] [--force] [--dry-run]\n  uipro-artemis uninstall --ai <assistant|all> [--global] [--dry-run]\n  uipro-artemis doctor\n  uipro-artemis list\n\nSupported assistants:\n  ${[...SUPPORTED.keys()].join(', ')}, all\n\nSecurity posture:\n  - offline-first\n  - no telemetry\n  - no postinstall scripts\n  - no shell execution\n  - no remote downloads\n`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = { command, ai: undefined, global: false, force: false, dryRun: false };
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === '--ai' || arg === '-a') flags.ai = rest[++i];
    else if (arg === '--global' || arg === '-g') flags.global = true;
    else if (arg === '--force' || arg === '-f') flags.force = true;
    else if (arg === '--dry-run') flags.dryRun = true;
    else if (arg === '--help' || arg === '-h') flags.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return flags;
}

function targetBase(ai, isGlobal) {
  if (!isGlobal) return process.cwd();
  const home = os.homedir();
  switch (ai) {
    case 'claude': return home;
    case 'cursor': return home;
    default: return path.join(home, '.config');
  }
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function readTemplate(name) {
  return fs.readFile(path.join(root, 'templates', name), 'utf8');
}

async function copyDir(src, dest, dryRun) {
  if (dryRun) return;
  await fs.mkdir(dest, { recursive: true });
  await fs.cp(src, dest, { recursive: true, force: true });
}

async function writeFileSafe(file, content, { force, dryRun }) {
  if (!force && await exists(file)) throw new Error(`Refusing to overwrite existing file: ${file}. Use --force to overwrite.`);
  if (dryRun) return;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
}

function asRuleFile(skillText) {
  return `# UI/UX Artemis Rules\n\n${skillText.replace(/^---[\s\S]*?---\n/, '')}`;
}

async function installOne(ai, flags) {
  const config = SUPPORTED.get(ai);
  if (!config) throw new Error(`Unsupported assistant: ${ai}`);
  const base = targetBase(ai, flags.global);
  const dir = path.join(base, ...config.dir);
  const skill = await readTemplate('SKILL.md');
  const command = await readTemplate('COMMAND.md');

  if (flags.dryRun) console.log(`[dry-run] install ${ai} -> ${dir}`);

  if (config.skill) {
    await writeFileSafe(path.join(dir, 'SKILL.md'), skill, flags);
    await writeFileSafe(path.join(dir, 'COMMAND.md'), command, flags);
    await copyDir(path.join(root, 'assets'), path.join(dir, 'assets'), flags.dryRun);
  } else if (config.commandFile) {
    await writeFileSafe(path.join(dir, config.commandFile), command + '\n\n' + asRuleFile(skill), flags);
  } else {
    await writeFileSafe(path.join(dir, config.ruleFile), asRuleFile(skill), flags);
  }
  console.log(`Installed ${ai} UI/UX Artemis support at ${dir}`);
}

async function uninstallOne(ai, flags) {
  const config = SUPPORTED.get(ai);
  if (!config) throw new Error(`Unsupported assistant: ${ai}`);
  const base = targetBase(ai, flags.global);
  const dir = path.join(base, ...config.dir);
  const file = config.skill ? dir : path.join(dir, config.ruleFile || config.commandFile);
  if (flags.dryRun) {
    console.log(`[dry-run] remove ${file}`);
    return;
  }
  await fs.rm(file, { recursive: true, force: true });
  console.log(`Removed ${ai} UI/UX Artemis support from ${file}`);
}

async function doctor() {
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  console.log('uipro-artemis doctor');
  console.log(`Node: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);
  console.log(`Package: ${pkg.name}@${pkg.version}`);
  console.log(`Dependencies: ${Object.keys(pkg.dependencies || {}).length}`);
  console.log('Network: not used');
  console.log('Telemetry: disabled / not implemented');
  console.log('Postinstall hooks: none');
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  if (!flags.command || flags.help) return printHelp();
  if (flags.command === 'list') {
    console.log([...SUPPORTED.keys()].join('\n'));
    return;
  }
  if (flags.command === 'doctor') return doctor();
  if (!['init', 'uninstall'].includes(flags.command)) throw new Error(`Unknown command: ${flags.command}`);
  if (!flags.ai) throw new Error('Missing --ai <assistant|all>');
  const targets = flags.ai === 'all' ? [...SUPPORTED.keys()] : [flags.ai];
  for (const ai of targets) {
    if (flags.command === 'init') await installOne(ai, flags);
    else await uninstallOne(ai, flags);
  }
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
