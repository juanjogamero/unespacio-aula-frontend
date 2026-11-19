import {execFileSync} from 'node:child_process';
import {mkdirSync,cpSync,copyFileSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),out=join(root,'dist'),preview=process.argv.includes('--preview');
rmSync(out,{recursive:true,force:true});mkdirSync(join(out,'assets','js'),{recursive:true});mkdirSync(join(out,'assets','css'),{recursive:true});
execFileSync('tsc',['-p','tsconfig.json'],{cwd:root,stdio:'inherit'});
copyFileSync(join(root,'src','styles.css'),join(out,'assets','css','styles.css'));
copyFileSync(join(root,'public','index.html'),join(out,'index.html'));
copyFileSync(join(root,'public','favicon.svg'),join(out,'favicon.svg'));
if(preview)copyFileSync(join(root,'public','preview.html'),join(out,'preview.html'));
else rmSync(join(out,'assets','js','core','preview.js'),{force:true});
// CSP funciona sin inline scripts, estilos o orígenes externos. El VPS debe añadir también cabeceras HTTP.
console.log(`Build correcto: ${out} (${preview?'vista previa local':'producción sin vista previa'})`);
