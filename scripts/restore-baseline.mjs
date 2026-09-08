// Reproduce the verified production artifact from its Git build despite mixed
// Windows line endings. Every output is checked against the live-verified hash.
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { hash, baselineSha } from './build-v1.mjs';
const output=process.env.LANDING_BASELINE_DIR;
assert.ok(output && resolve(output).toLowerCase().startsWith('d:\\codex-runs\\'));
const manifest=JSON.parse(await readFile(new URL('../docs/v1-20260908/release-manifest.json',import.meta.url),'utf8'));
assert.equal(manifest.baselineSha,baselineSha);
for(const [path,expected] of Object.entries(manifest.rootFiles)){
 const file=join(output,path),bytes=await readFile(file);
 if(hash(bytes)===expected)continue;
 assert.match(path,/\.(?:html|css|js|svg|txt)$/,'Never normalize binary media');
 const lf=bytes.toString('utf8').replaceAll('\r\n','\n');
 const matching=[Buffer.from(lf),Buffer.from(lf.replaceAll('\n','\r\n'))].find(candidate=>hash(candidate)===expected);
 assert.ok(matching,`Baseline content differs, not just line endings: ${path}`);
 await writeFile(file,matching);
}
console.log('PASS reconstructed every baseline public file to its verified live hash');
