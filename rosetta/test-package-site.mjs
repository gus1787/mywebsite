#!/usr/bin/env node
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve } from 'node:path';
const run = promisify(execFile);
const root = resolve(new URL('..', import.meta.url).pathname);
const temp = await mkdtemp('/tmp/rosetta-package-'); const out = join(temp, 'site');
try { await run(process.execPath, [join(root, 'rosetta/package-site.mjs'), `--out=${out}`], { cwd: root }); const manifest = JSON.parse(await readFile(join(out, 'rosetta-manifest.json'), 'utf8')); const redirects = await readFile(join(out, '_redirects'), 'utf8'); const home = await readFile(join(out, 'index.html'), 'utf8');
  if (!home.includes('href="/reel-recall/"') || !home.includes('Open app')) throw new Error('homepage overlay links are missing');
  if (!(await readFile(join(out, 'reel-recall/index.html'), 'utf8')).includes('id="root"')) throw new Error('Reel Recall dist was not installed');
  for (const path of ['', '/solo', '/rush', '/account', '/friends', '/auth', '/finish']) if (!redirects.includes(`/reel-recall${path} `)) throw new Error(`missing redirect for ${path}`);
  for (const path of ['solo', 'rush', 'account', 'friends', 'auth', 'finish']) await readFile(join(out, `reel-recall/${path}/index.html`));
  await readFile(join(out, 'reel-recall/auth/finish/index.html'));
  if (redirects.includes(' 200')) throw new Error('invalid Pages rewrite remains');
  if (!(await readFile(join(out, '_headers'), 'utf8')).includes('/pet-portrait/config.js')) throw new Error('Pet scoped headers missing');
  if (manifest.wrangler !== '4.129.0' || !manifest.sourceSha || !manifest.reelRecallSource || manifest.files.length < 10) throw new Error('manifest is incomplete');
  if (manifest.files.some(({ path }) => path === 'CNAME' || path.endsWith('.docx') || path.startsWith('.') || path.startsWith('rosetta/'))) throw new Error('forbidden files leaked into package');
  for (const preserved of ['pet-portrait/index.html', 'retention/index.html', 'registry/index.html']) await readFile(join(out, preserved)); console.log('rosetta package test passed');
  const petFiles = await (await import('node:fs/promises')).readdir(join(out, 'pet-portrait')); if (petFiles.sort().join(',') !== 'app.css,app.js,config.js,index.html,legal.css,privacy,support') throw new Error('Pet Portrait copied files exceed allowlist');
} finally { await rm(temp, { recursive: true, force: true }); }
