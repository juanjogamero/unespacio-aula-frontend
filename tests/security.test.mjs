import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=(p)=>readFileSync(new URL(p,root),'utf8');
test('Producción no contiene un selector de perfiles demo',()=>{assert.doesNotMatch(read('public/index.html'),/preview\.html|set-role|Cambiar perfil/);});
test('No se persisten fichas ni respuestas en localStorage',()=>{for(const p of ['src/core/preview.ts','src/core/http.ts','src/ui/app.ts']) assert.doesNotMatch(read(p),/localStorage|sessionStorage/);});
test('El contrato HTTP no envía credenciales cross-origin',()=>{assert.match(read('src/core/http.ts'),/credentials:'same-origin'/);assert.match(read('src/core/http.ts'),/X-CSRF-Token/);});
test('La vista previa no entra en la compilación de producción',()=>{assert.doesNotMatch(read('scripts/build.mjs').split("if(preview)")[0],/copyFileSync\(join\(root,'public','preview.html'/);});
test('El servidor local emite cabeceras CSP y anti MIME sniffing',()=>{assert.match(read('scripts/serve.mjs'),/Content-Security-Policy/);assert.match(read('scripts/serve.mjs'),/nosniff/);});
test('Los datos de profesores y alumnos se escapan en el DOM',async()=>{
 const sec=await import('../dist/assets/js/core/security.js');
 assert.equal(sec.escapeHtml('<img src=x onerror=alert(1)>'),'&lt;img src=x onerror=alert(1)&gt;');
 assert.equal(sec.escapeHtml('" & \' < >'),'&quot; &amp; &#39; &lt; &gt;');
});
test('Se bloquean enlaces ejecutables y puntuaciones fuera de rango',async()=>{
 const sec=await import('../dist/assets/js/core/security.js');
 assert.equal(sec.safeExternalUrl('javascript:alert(1)'),null);
 assert.equal(sec.safeExternalUrl('data:text/html,test'),null);
 assert.ok(sec.safeExternalUrl('https://example.org/material'));
 assert.throws(()=>sec.clampScore(11));
 assert.equal(sec.clampScore(8.56),8.6);
});
test('Producción no expone archivos de vista previa',()=>{
 assert.equal(existsSync(new URL('../dist/preview.html',import.meta.url)),false);
 assert.equal(existsSync(new URL('../dist/assets/js/core/preview.js',import.meta.url)),false);
});
