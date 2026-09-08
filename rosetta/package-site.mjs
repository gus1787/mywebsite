#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultOut = join(root, 'rosetta', 'generated');
const outArg = process.argv.find((arg) => arg.startsWith('--out='));
const out = resolve(outArg ? outArg.slice('--out='.length) : defaultOut);
const reelDist = resolve(process.env.ROSETTA_REEL_DIST || '/Users/gusphillips/Documents/ChatGPT/Test Project/cast-swipe-mvp/dist');
const petWebsite = resolve(process.env.ROSETTA_PET_WEBSITE || '/Users/gusphillips/Documents/ChatGPT/Test Project/website/pet-portrait');
const petFiles = ['index.html', 'app.css', 'app.js', 'config.js'];
const petLegalFiles = ['legal.css', 'privacy/index.html', 'support/index.html'];
const rollbackDeploymentId = process.env.ROSETTA_ROLLBACK_DEPLOYMENT_ID || '1ec62523-1da3-42e0-bb52-43c827583714';
const excluded = /^(?:CNAME|.*\.(?:md|markdown|docx|env|pem|key|p12|pfx|tfstate))$/i;
const forbiddenName = /(?:secret|credential|password|token|private[_-]?key)/i;
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const generatedRoot = resolve(root, 'rosetta/generated');
if (out === root || out === resolve(root, 'rosetta') || (out !== generatedRoot && !out.startsWith(generatedRoot + '/') && !out.startsWith('/tmp/rosetta-package-'))) throw new Error(`Refusing unsafe output path: ${out}`);
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root }).toString().split('\0').filter(Boolean).filter((path) => { const parts = path.split('/'); return !parts.some((part) => part.startsWith('.')) && !parts.includes('rosetta') && !parts.includes('docs') && !parts.includes('documentation') && !excluded.test(path) && !forbiddenName.test(path); });
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const path of tracked) { const target = join(out, path); await mkdir(dirname(target), { recursive: true }); await cp(join(root, path), target); }
await cp(join(root, 'rosetta/overlay/index.html'), join(out, 'index.html'));
await cp(join(root, 'rosetta/overlay/rosetta.css'), join(out, 'rosetta.css'));
await rm(join(out, 'reel-recall'), { recursive: true, force: true });
await mkdir(join(out, 'reel-recall', 'assets'), { recursive: true });
await cp(join(reelDist, 'index.html'), join(out, 'reel-recall', 'index.html'));
for (const file of (await readdir(join(reelDist, 'assets'))).filter((file) => /^(?:[^/]+\.(?:js|css|map|png|jpg|jpeg|svg|woff2?))$/i.test(file)).sort()) await cp(join(reelDist, 'assets', file), join(out, 'reel-recall/assets', file));
await rm(join(out, 'pet-portrait'), { recursive: true, force: true });
await mkdir(join(out, 'pet-portrait'), { recursive: true });
for (const file of [...petFiles, ...petLegalFiles]) { const target = join(out, 'pet-portrait', file); await mkdir(dirname(target), { recursive: true }); await cp(join(petWebsite, file), target); }
await cp(join(root, 'rosetta/_redirects'), join(out, '_redirects'));
await cp(join(root, 'rosetta/_headers'), join(out, '_headers'));
for (const route of ['solo', 'rush', 'account', 'friends', 'auth', 'finish']) { await mkdir(join(out, `reel-recall/${route}`), { recursive: true }); await cp(join(out, 'reel-recall/index.html'), join(out, `reel-recall/${route}/index.html`)); }
await mkdir(join(out, 'reel-recall/auth/finish'), { recursive: true });
await cp(join(out, 'reel-recall/index.html'), join(out, 'reel-recall/auth/finish/index.html'));
const files = [];
async function collect(dir) { for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) { const path = join(dir, entry.name); if (entry.isDirectory()) await collect(path); else { const bytes = await readFile(path); files.push({ path: relative(out, path).split('\\').join('/'), sha256: sha256(bytes), bytes: bytes.byteLength }); } } }
await collect(out);
const sourceSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root }).toString().trim();
const reelSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: resolve(reelDist, '..') }).toString().trim();
const petSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: resolve(petWebsite, '..', '..') }).toString().trim();
const petDirty = execFileSync('git', ['status', '--porcelain'], { cwd: resolve(petWebsite, '..', '..') }).toString().trim().length > 0;
const sourceDirty = execFileSync('git', ['status', '--porcelain'], { cwd: root }).toString().trim().length > 0;
const reelDirty = execFileSync('git', ['status', '--porcelain'], { cwd: resolve(reelDist, '..') }).toString().trim().length > 0;
const manifest = { schema: 1, product: 'rosetta', sourceRepository: 'gus1787/mywebsite', sourceSha, sourceDirty, reelRecallSource: reelSha, reelRecallSourceDirty: reelDirty, petPortraitSource: petSha, petPortraitSourceDirty: petDirty, petPortraitAllowlist: [...petFiles, ...petLegalFiles].map((file) => `pet-portrait/${file}`), wrangler: '4.129.0', rollbackDeploymentId, files };
await writeFile(join(out, 'rosetta-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Packaged ${files.length + 1} files into ${out}`);
