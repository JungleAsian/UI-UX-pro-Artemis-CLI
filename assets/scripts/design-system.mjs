#!/usr/bin/env node
import fs from 'node:fs';

const input = process.argv.slice(2).join(' ').trim() || 'general web app';
const rulesPath = new URL('../data/design-rules.json', import.meta.url);
const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

function inferType(text) {
  const t = text.toLowerCase();
  if (/shop|store|commerce|checkout|product/.test(t)) return 'ecommerce';
  if (/bank|finance|fintech|payment|wallet/.test(t)) return 'fintech';
  if (/blog|media|article|story|content/.test(t)) return 'content';
  if (/dashboard|admin|saas|crm|analytics/.test(t)) return 'saas';
  return 'saas';
}

const type = inferType(input);
const profile = rules.productTypes[type];
const output = `# Design System Draft\n\nProduct brief: ${input}\n\n## Product type\n${type}\n\n## Goals\n${profile.goals.map(x => `- ${x}`).join('\n')}\n\n## Recommended patterns\n${profile.patterns.map(x => `- ${x}`).join('\n')}\n\n## Tokens\n- Spacing: 4px base, 8px layout rhythm\n- Radius: small 6px, medium 12px, large 20px\n- Typography: system sans-serif by default; define display, heading, body, label\n- States: default, hover, focus-visible, disabled, loading, error\n\n## Accessibility\n${rules.principles.map(x => `- ${x}`).join('\n')}\n`;

console.log(output);
