import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const exec = promisify(execFile);
const cli = path.resolve('bin/uipro-artemis.js');

test('doctor runs without network or dependencies', async () => {
  const { stdout } = await exec(process.execPath, [cli, 'doctor']);
  assert.match(stdout, /uipro-artemis doctor/);
  assert.match(stdout, /Dependencies: 0/);
  assert.match(stdout, /Network: not used/);
});

test('list includes supported assistants', async () => {
  const { stdout } = await exec(process.execPath, [cli, 'list']);
  assert.match(stdout, /claude/);
  assert.match(stdout, /cursor/);
  assert.match(stdout, /gemini/);
});

test('dry-run init succeeds', async () => {
  const { stdout } = await exec(process.execPath, [cli, 'init', '--ai', 'all', '--dry-run']);
  assert.match(stdout, /\[dry-run\] install claude/);
  assert.match(stdout, /Installed opencode/);
});
