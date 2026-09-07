import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fetchChecked = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
};
await mkdir(join(root, 'css/fonts'), { recursive: true });
let css = await (await fetchChecked('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600;700&display=swap', {
  headers: { 'User-Agent': 'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36' }
})).text();
for (const url of new Set([...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)\s]+/g)].map(m => m[0]))) {
  const name = new URL(url).pathname.split('/').at(-1);
  await writeFile(join(root, 'css/fonts', name), Buffer.from(await (await fetchChecked(url)).arrayBuffer()));
  css = css.replaceAll(url, `fonts/${name}`);
}
await writeFile(join(root, 'css/fonts.css'), css);
await writeFile(join(root, 'css/aos.css'), await (await fetchChecked('https://unpkg.com/aos@2.3.1/dist/aos.css')).text());
await writeFile(join(root, 'css/fonts/OFL.txt'), await (await fetchChecked('https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/OFL.txt')).text());
await writeFile(join(root, 'css/AOS-LICENSE.txt'), await (await fetchChecked('https://unpkg.com/aos@2.3.1/LICENSE')).text());
console.log('Vendored source font/CSS dependencies with licenses. No runtime external fetches.');
