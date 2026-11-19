import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root=resolve(import.meta.dirname,'..');
execFileSync('node', ['scripts/build.mjs','--preview'], {cwd:root,stdio:'inherit'});
const path=join(root,'dist','preview.html');
let html=readFileSync(path,'utf8');
html=html.replaceAll('href="/favicon.svg"','href="./favicon.svg"')
  .replaceAll('href="/assets/css/styles.css"','href="./assets/css/styles.css"')
  .replaceAll('src="/assets/js/main.js"','src="./assets/js/main.js"');
writeFileSync(path,html);
writeFileSync(join(root,'dist','index.html'),`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url=./preview.html"><title>Unespacio Aula · Vista previa</title></head><body><p>Abriendo la vista previa de Unespacio Aula. <a href="./preview.html">Acceder</a></p></body></html>`);
console.log('Vista previa estática preparada para la ruta de proyecto de GitHub Pages.');
