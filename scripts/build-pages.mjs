import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
execFileSync(process.execPath,['scripts/build.mjs','--development'],{cwd:root,stdio:'inherit'});
const page=join(root,'dist','index.html');
const html=readFileSync(page,'utf8').replaceAll('href="/','href="/unespacio-aula-frontend/').replaceAll('src="/','src="/unespacio-aula-frontend/');
writeFileSync(page,html);writeFileSync(join(root,'dist','.nojekyll'),'');
console.log('Frontend de desarrollo listo para GitHub Pages.');
