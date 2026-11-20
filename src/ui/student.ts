import type {Assignment,Lesson,Material,Snapshot} from '../core/types.js';
import {h,eDate,eTime,assignmentState} from './helpers.js';
import {icon} from './icons.js';
import {calendarWidget,calendarPage} from './calendar.js';

const anchor=(label:string,path:string,cls='study-inline-link')=>`<a class="${cls}" href="#${path}">${h(label)} ${icon('right',16)}</a>`;
const dateLabel=(iso:string)=>h(eDate(iso));
const subjectColor=(name:string,index=0)=>/mate|f[ií]sica|qu[ií]mica|tecnol/i.test(name)?'math':/ingl|lengua|franc|idioma/i.test(name)?'language':index%2?'language':'science';
const studentSubject=(s:Snapshot)=>s.students.find(st=>st.id===s.session.userId);
const upcoming=(s:Snapshot)=>s.lessons.filter(l=>new Date(l.end).getTime()>=Date.now()).sort((a,b)=>a.start.localeCompare(b.start));
const stateOf=(s:Snapshot,x:Assignment)=>assignmentState(s,x,s.session.userId);
const subjects=(s:Snapshot)=>studentSubject(s)?.subjects||[...new Set([...s.assignments.map(x=>x.subject||''),...s.materials.map(m=>m.subject||'')].filter(Boolean))];
const materiaUrl=(sub:string)=>`/materias?materia=${encodeURIComponent(sub)}`;
const metadata=(a:Assignment)=>`<span>${icon('calendar',14)} Entrega ${dateLabel(a.dueDate)}</span>`;

function studyArtwork(){return `<svg class="study-artwork" viewBox="0 0 370 275" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <circle cx="182" cy="136" r="111" fill="#284B75"/><circle cx="182" cy="136" r="92" stroke="#7694BC" stroke-opacity=".28" stroke-width="1.5"/>
 <path d="M66 193L169 218L308 189L205 165L66 193Z" fill="#091D36" fill-opacity=".35"/>
 <path d="M81 81C119 73 151 76 184 89V202C149 188 117 182 81 188V81Z" fill="#EAF4FF"/>
 <path d="M184 89C223 76 260 73 292 82V187C249 181 214 190 184 202V89Z" fill="#FFF9EC"/>
 <path d="M184 92V204" stroke="#95A9C5" stroke-width="3"/>
 <path d="M100 111C129 106 151 110 164 114M100 129C126 124 148 128 164 133M100 147C126 144 148 148 164 152M100 165C129 160 148 166 164 170" stroke="#B5CEE9" stroke-width="5" stroke-linecap="round"/>
 <path d="M205 110C226 103 255 100 270 101M205 132C231 123 254 121 270 121M205 153C226 146 248 144 270 144" stroke="#D8D7CF" stroke-width="5" stroke-linecap="round"/>
 <path d="M265 70L286 32L301 41L279 79L265 88V70Z" fill="#FFB087"/><path d="M286 32L301 41L308 28C311 20 299 13 294 19L286 32Z" fill="#FAE8B2"/><path d="M265 88L279 79L265 70V88Z" fill="#203A5A"/>
 <path d="M54 64L73 44M305 208L324 226M124 33L126 14" stroke="#90D6D0" stroke-width="4" stroke-linecap="round"/>
 <circle cx="310" cy="118" r="5" fill="#FFA87A"/><circle cx="62" cy="154" r="5" fill="#8FDCD8"/>
 </svg>`;}

function taskItem(s:Snapshot,a:Assignment,index:number){
 const state=stateOf(s,a);const status=state==='Pendiente'?'pending':state==='Entregada'?'delivered':'graded';
 return `<a class="study-task-item ${status}" href="#/actividades/${h(a.id)}">
 <span class="study-task-index" aria-hidden="true">${String(index+1).padStart(2,'0')}</span>
 <span class="study-task-main"><span class="study-task-subject">${h(a.subject||'Actividad')}</span><strong>${h(a.title)}</strong><small>${metadata(a)}</small></span>
 <span class="study-status ${status}">${status==='pending'?'Por entregar':state}</span><span class="study-task-arrow">${icon('right',18)}</span>
 </a>`;
}
function lessonItem(l:Lesson){const date=new Date(l.start);return `<li class="study-lesson-item"><span class="study-lesson-date"><b>${h(String(date.getDate()).padStart(2,'0'))}</b><small>${h(date.toLocaleDateString('es-ES',{month:'short'}))}</small></span><div class="study-lesson-body"><strong>${h(l.subject)}</strong><span>${h(eTime(l.start))} · ${h(eDate(l.start,true))}</span></div><span class="study-lesson-dot" aria-hidden="true"></span></li>`;}
/** Sesiones del alumno en formato de agenda de trabajo, con enlace real a la agenda. */
function railLessonItem(l:Lesson,index:number){
 const when=new Date(l.start);
 const day=when.toLocaleDateString('es-ES',{weekday:'short'}).replace('.','');
 return `<li class="study-util-session${index===0?' is-next':''}"><a class="study-util-session-link" href="#/agenda" aria-label="${h(l.subject)}, ${h(eDate(l.start,true))}, ${h(eTime(l.start))}"><time class="study-util-date" datetime="${h(l.start)}"><strong>${h(String(when.getDate()).padStart(2,'0'))}</strong><small>${h(when.toLocaleDateString('es-ES',{month:'short'}).replace('.',''))}</small></time><span class="study-util-session-info"><strong>${h(l.subject)}</strong><small>${h(day)} · ${h(eTime(l.start))}–${h(eTime(l.end))}</small></span><span class="study-util-session-arrow">${icon('right',16)}</span></a></li>`;
}
/** La etiqueta se deriva del recurso; no simula archivos ni permite abrir recursos sin permiso. */
function materialType(m:Material){
 if(m.kind==='link')return 'ENLACE';
 if(m.kind==='text')return 'APUNTE';
 const ext=m.fileName?.split('.').at(-1)?.toUpperCase();
 return ['PDF','DOCX','TXT','JPG','JPEG','PNG','WEBP'].includes(ext||'')?ext!:'ARCHIVO';
}
function materialRailItem(m:Material){
 return `<button type="button" data-action="material" data-id="${h(m.id)}" class="study-util-resource"><span class="study-util-resource-symbol">${icon(m.kind==='link'?'link':m.kind==='file'?'file':'book',19)}</span><span class="study-util-resource-copy"><strong>${h(m.title)}</strong><span><small>${h(m.subject||'Material')}</small><em aria-hidden="true">·</em><small class="study-util-type">${h(materialType(m))}</small></span></span><span class="study-util-resource-arrow">${icon('right',15)}</span></button>`;
}
function subjectItem(s:Snapshot,subject:string,index:number){
 const materialCount=s.materials.filter(m=>m.subject===subject).length;
 const taskCount=s.assignments.filter(a=>a.subject===subject).length;
 return `<a href="#${materiaUrl(subject)}" class="study-subject-item ${subjectColor(subject,index)}"><span class="study-subject-serial">0${index+1} / ASIGNATURA</span><div class="study-subject-main"><span class="study-subject-symbol">${icon(subjectColor(subject,index)==='math'?'layers':'book',26)}</span><strong>${h(subject)}</strong></div><span class="study-subject-description">${materialCount} ${materialCount===1?'material':'materiales'} · ${taskCount} ${taskCount===1?'actividad':'actividades'} <span class="study-subject-arrow">${icon('right',18)}</span></span></a>`;
}
export function studentHome(s:Snapshot):string{
 const firstName=s.session.name.split(' ')[0];const student=studentSubject(s);
 const tasks=[...s.assignments].sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
 const pending=tasks.filter(a=>stateOf(s,a)==='Pendiente');const lessons=upcoming(s);
 const focus=pending[0],soon=lessons[0];
 const focusTitle=focus?focus.title:soon?`Tu próxima clase de ${soon.subject}`:'Tu espacio está al día';
 const focusSub=focus?`${focus.subject||'Tu materia'} · Entrega ${eDate(focus.dueDate)}`:soon?`${eDate(soon.start)} · ${eTime(soon.start)}`:'Explora tus materias y los próximos contenidos';
 const focusRoute=focus?`/actividades/${encodeURIComponent(focus.id)}`:'/agenda';
 return `<div class="study-home"><header class="study-home-header"><div><span class="study-overline">MI APRENDIZAJE <span class="study-overline-rule"></span> ${h(student?.level||'')}</span><h1>Hola, ${h(firstName)}<span class="study-wave">.</span></h1><p>Un lugar para estudiar a tu ritmo y saber qué viene después.</p></div><div class="study-home-date">${icon('calendar',17)}<span>${h(new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}))}</span></div></header>
 <section class="study-feature" aria-labelledby="study-feature-title"><div class="study-feature-content"><span class="study-feature-kicker"><span class="study-live-dot" aria-hidden="true"></span> TU SIGUIENTE PASO</span><h2 id="study-feature-title">${h(focusTitle)}</h2><p>${h(focusSub)}</p><a class="study-feature-cta" href="#${focusRoute}">${focus?'Continuar actividad':soon?'Ver mi agenda':'Explorar mis clases'} ${icon('arrow',18)}</a></div><div class="study-feature-visual">${studyArtwork()}<div class="study-art-caption"><span>APRENDER ES AVANZAR</span><span>UNESPACIO AULA</span></div></div></section>
 <div class="study-main-grid"><div class="study-main-column"><section class="study-section" aria-labelledby="study-tasks-title"><div class="study-section-heading"><div><span class="study-overline">LO IMPORTANTE AHORA</span><h2 id="study-tasks-title">Tus actividades <span class="study-heading-count">${pending.length} pendientes</span></h2></div>${anchor('Todas mis tareas','/tareas')}</div><div class="study-task-list">${tasks.length?tasks.slice(0,4).map((a,i)=>taskItem(s,a,i)).join(''):`<div class="study-zero">${icon('check',22)}<div><strong>Todo al día</strong><p>No tienes actividades asignadas por ahora.</p></div></div>`}</div></section>
 <section class="study-section study-subjects-section" aria-labelledby="study-subject-title"><div class="study-section-heading"><div><span class="study-overline">TUS ESPACIOS</span><h2 id="study-subject-title">Mis materias</h2></div>${anchor('Ver materias','/materias')}</div><div class="study-subject-grid">${subjects(s).map((sub,i)=>subjectItem(s,sub,i)).join('')||'<div class="study-zero">Tus materias aparecerán aquí.</div>'}</div></section></div>
 <aside class="study-side-column" aria-label="Agenda y materiales de clase">
 ${calendarWidget(s,true)}
 <section class="study-util-block study-util-library" aria-labelledby="study-materials-title"><div class="study-util-head"><div><span class="study-overline">TUS RECURSOS</span><h2 id="study-materials-title">Material de clase</h2></div><span class="study-util-counter" aria-label="${s.materials.length} materiales disponibles">${s.materials.length}</span></div><p class="study-util-subtitle">Documentos, enlaces y apuntes de tus profesores.</p><div class="study-util-resources">${s.materials.length?s.materials.slice(0,3).map(materialRailItem).join(''):'<p class="study-util-empty">Tus materiales estarán disponibles aquí.</p>'}</div>${anchor('Ver todas mis materias','/materias','study-util-footer')}</section>
 </aside></div></div>`;
}
export function studentTasksPage(s:Snapshot):string{
 const sorted=[...s.assignments].sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
 const pending=sorted.filter(a=>stateOf(s,a)==='Pendiente');const done=sorted.filter(a=>stateOf(s,a)!=='Pendiente');
 return `<div class="study-home study-subpage"><header class="study-home-header"><div><span class="study-overline">MI ACTIVIDAD</span><h1>Mis tareas<span class="study-wave">.</span></h1><p>Lo que tienes por hacer y todo lo que ya has entregado.</p></div>${anchor('Volver al inicio','/inicio')}</header><div class="study-subpage-layout"><div><section class="study-section"><div class="study-section-heading"><div><span class="study-overline">POR HACER</span><h2>Para entregar <span class="study-heading-count">${pending.length}</span></h2></div></div><div class="study-task-list">${pending.length?pending.map((a,i)=>taskItem(s,a,i)).join(''):`<div class="study-zero">${icon('check',22)}<div><strong>¡Todo al día!</strong><p>No tienes tareas sin entregar.</p></div></div>`}</div></section><section class="study-section"><div class="study-section-heading"><div><span class="study-overline">HISTORIAL</span><h2>Entregadas y corregidas</h2></div></div><div class="study-task-list">${done.length?done.map((a,i)=>taskItem(s,a,i)).join(''):'<p class="study-muted">Aquí aparecerán tus entregas.</p>'}</div></section></div><aside class="study-sidebar-note"><span class="study-overline">TU ORGANIZACIÓN</span><h3>Todo en orden, sin perder el hilo.</h3><p>Abre una tarea para leer las instrucciones, adjuntar una respuesta o consultar la devolución de tu profesor.</p>${anchor('Consultar agenda','/agenda')}</aside></div></div>`;
}
export function studentSubjectsPage(s:Snapshot,selected=''):string{
 const list=subjects(s);const valid=list.includes(selected)?selected:'';
 const mats=valid?s.materials.filter(m=>m.subject===valid):[];
 const tasks=valid?s.assignments.filter(a=>a.subject===valid):[];
 const lessons=valid?s.lessons.filter(l=>l.subject===valid):[];
 return `<div class="study-home study-subpage"><header class="study-home-header"><div><span class="study-overline">TU APRENDIZAJE</span><h1>${valid?h(valid):'Mis materias'}<span class="study-wave">.</span></h1><p>${valid?'Consulta los recursos, tareas y clases de esta materia.':'Elige una asignatura para continuar aprendiendo.'}</p></div>${valid?anchor('Todas mis materias','/materias'):anchor('Ir al inicio','/inicio')}</header>${!valid?`<div class="study-subject-grid study-subject-overview">${list.map((sub,i)=>subjectItem(s,sub,i)).join('')||'<div class="study-zero">Todavía no tienes materias asignadas.</div>'}</div>`:
 `<div class="study-subpage-layout"><div><section class="study-section"><div class="study-section-heading"><div><span class="study-overline">CONTENIDO DE LA MATERIA</span><h2>Materiales</h2></div></div><div class="study-resource-collection">${mats.length?mats.map(m=>`<button type="button" class="study-resource-row" data-action="material" data-id="${h(m.id)}"><span class="study-resource-mark">${icon(m.kind==='link'?'link':m.kind==='file'?'file':'book',23)}</span><span><strong>${h(m.title)}</strong><small>${h(m.description||'Material de estudio')}</small></span>${icon('right',18)}</button>`).join(''):`<div class="study-zero">Sin materiales publicados todavía.</div>`}</div></section><section class="study-section"><div class="study-section-heading"><div><span class="study-overline">TRABAJO DEL CURSO</span><h2>Actividades</h2></div></div><div class="study-task-list">${tasks.length?tasks.map((a,i)=>taskItem(s,a,i)).join(''):'<div class="study-zero">No hay actividades en esta materia.</div>'}</div></section></div><aside class="study-sidebar-note"><span class="study-overline">PRÓXIMAS SESIONES</span><h3>${h(valid)}</h3><ol class="study-lesson-list">${lessons.length?[...lessons].sort((a,b)=>a.start.localeCompare(b.start)).slice(0,4).map(lessonItem).join(''):'<li class="study-rail-empty">No hay clases programadas.</li>'}</ol>${anchor('Ver agenda','/agenda')}</aside></div>`}</div>`;
}
export function studentAgendaPage(s:Snapshot):string{return calendarPage(s);}
