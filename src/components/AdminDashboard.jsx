import React,{useEffect,useMemo,useState} from 'react';
import {signOut,supabaseClient} from '../game/supabaseAuth.js';

const TOTAL_LEVELS=68;
const COURSES=['Todos','10.1','10.2','10.3','10.4','11.1','11.2','11.3'];
const duration=value=>{const seconds=Math.max(0,Number(value||0)),hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60);return hours?`${hours} h ${minutes} min`:`${minutes} min`;};
const date=value=>value?new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'short',hour:'numeric',minute:'2-digit'}).format(new Date(value)):'Sin actividad';

export default function AdminDashboard({user}){
  const [students,setStudents]=useState([]),[course,setCourse]=useState('Todos'),[query,setQuery]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const load=async()=>{
    setLoading(true);setError('');
    const [profilesResult,progressResult]=await Promise.all([
      supabaseClient.from('profiles').select('id,first_name,last_name,course,created_at').neq('course','ADMIN'),
      supabaseClient.from('student_progress').select('user_id,completed_levels,stars,crystals,play_seconds,total_errors,updated_at')
    ]);
    if(profilesResult.error||progressResult.error){setError('No fue posible actualizar la información. Revisa la conexión e inténtalo de nuevo.');setLoading(false);return;}
    const progressByUser=new Map((progressResult.data||[]).map(item=>[item.user_id,item]));
    setStudents((profilesResult.data||[]).map(profile=>{const progress=progressByUser.get(profile.id)||{};const completed=progress.completed_levels?.length||0;return {...profile,...progress,completed,percent:Math.min(100,Math.round(completed/TOTAL_LEVELS*100))};}));setLoading(false);
  };
  useEffect(()=>{load();const timer=setInterval(load,30000);return()=>clearInterval(timer);},[]);
  const visible=useMemo(()=>students.filter(item=>(course==='Todos'||item.course===course)&&`${item.first_name} ${item.last_name}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>b.percent-a.percent||a.play_seconds-b.play_seconds||a.total_errors-b.total_errors),[students,course,query]);
  const totals=useMemo(()=>({students:students.length,completed:students.filter(item=>item.percent===100).length,average:students.length?Math.round(students.reduce((sum,item)=>sum+item.percent,0)/students.length):0,active:students.filter(item=>item.updated_at&&Date.now()-new Date(item.updated_at).getTime()<15*60*1000).length}),[students]);
  return <main className="admin-dashboard"><header className="admin-header"><a className="brand" href="?view=map"><span>VALLE</span> ESMERALDA<small>PANEL DEL DOCENTE</small></a><div><small>ADMINISTRADOR</small><strong>{user.name}</strong></div><button onClick={async()=>{await signOut();location.href='?';}}>CERRAR SESIÓN</button></header>
    <section className="admin-intro"><div><small>SEGUIMIENTO DE LA AVENTURA</small><h1>Progreso de los estudiantes</h1><p>La información se actualiza mientras cada estudiante juega con su cuenta.</p></div><button onClick={load} disabled={loading}>{loading?'ACTUALIZANDO…':'↻ ACTUALIZAR'}</button></section>
    <section className="admin-summary"><article><span>EXPLORADORES</span><strong>{totals.students}</strong><small>usuarios registrados</small></article><article><span>AVANCE PROMEDIO</span><strong>{totals.average}%</strong><small>de 68 niveles</small></article><article><span>JUEGO COMPLETO</span><strong>{totals.completed}</strong><small>estudiantes</small></article><article><span>ACTIVOS RECIENTES</span><strong>{totals.active}</strong><small>últimos 15 minutos</small></article></section>
    <section className="admin-roster"><div className="admin-tools"><div><small>CLASIFICACIÓN GENERAL</small><h2>Estudiantes</h2></div><label>Buscar<input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Nombre o apellido"/></label><label>Curso<select value={course} onChange={event=>setCourse(event.target.value)}>{COURSES.map(value=><option key={value}>{value}</option>)}</select></label></div>
      {error&&<p className="admin-error">{error}</p>}{!loading&&!error&&!visible.length&&<p className="admin-empty">Todavía no hay estudiantes en esta selección.</p>}
      {!!visible.length&&<div className="admin-table-wrap"><table><thead><tr><th>#</th><th>Estudiante</th><th>Curso</th><th>Avance</th><th>Tiempo</th><th>Errores</th><th>Última actividad</th></tr></thead><tbody>{visible.map((student,index)=><tr key={student.id}><td><b>{index+1}</b></td><td><strong>{student.first_name} {student.last_name}</strong><small>{student.completed} de {TOTAL_LEVELS} niveles</small></td><td><span className="course-chip">{student.course}</span></td><td><div className="student-progress"><span><b>{student.percent}%</b><i>{student.stars||0} ★ · {student.crystals||0} ◆</i></span><em><u style={{width:`${student.percent}%`}}/></em></div></td><td>{duration(student.play_seconds)}</td><td>{student.total_errors||0}</td><td>{date(student.updated_at)}</td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}

