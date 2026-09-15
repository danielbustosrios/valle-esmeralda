import React,{useEffect,useState} from 'react';
import {STUDENT_COURSES} from '../game/authSession.js';
import {isSupabaseReady,loginStudent,loginStudentCode,registerStudent,sendRecovery,updatePassword} from '../game/supabaseAuth.js';
import {isValidAccessCode,normalizeAccessCode} from '../game/accessCode.js';

const TITLES={code:['ACCESO DE ESTUDIANTES','Escribe tu código'],login:['ACCESO DEL DOCENTE','Administrar el valle'],register:['NUEVO EXPLORADOR','Crea tu perfil'],recover:['RECUPERAR ACCESO','Volver al camino'],reset:['NUEVA CONTRASEÑA','Recupera tu camino']};

export default function AuthScreen({onAuthenticated,recovering=false,onRecovered}){
  const [mode,setMode]=useState(recovering?'reset':'code');
  const [form,setForm]=useState({code:'',firstName:'',lastName:'',course:'',email:'',password:'',confirm:'',remember:true});
  const [error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
  const [kicker,title]=TITLES[mode];
  useEffect(()=>{document.title='Valle Esmeralda · Acceso';},[]);
  useEffect(()=>{if(recovering)setMode('reset');},[recovering]);
  const update=event=>setForm(current=>({...current,[event.target.name]:event.target.name==='code'?normalizeAccessCode(event.target.value):event.target.type==='checkbox'?event.target.checked:event.target.value}));
  const changeMode=next=>{setMode(next);setError('');setNotice('');};
  const submit=async event=>{
    event.preventDefault();setError('');setNotice('');
    if(mode==='code'&&!isValidAccessCode(form.code)){setError('El código debe tener exactamente 6 números.');return;}
    if(!['code','reset'].includes(mode)&&!/^\S+@\S+\.\S+$/.test(form.email)){setError('Escribe un correo válido.');return;}
    if(!['code','recover'].includes(mode)&&form.password.length<6){setError('La contraseña debe tener al menos 6 caracteres.');return;}
    if(mode==='reset'&&form.password!==form.confirm){setError('Las contraseñas no coinciden.');return;}
    if(mode==='register'&&!form.firstName.trim()){setError('Escribe tu nombre.');return;}
    if(mode==='register'&&!form.lastName.trim()){setError('Escribe tu apellido.');return;}
    if(mode==='register'&&!STUDENT_COURSES.includes(form.course)){setError('Selecciona tu curso.');return;}
    if(mode==='register'&&form.password!==form.confirm){setError('Las contraseñas no coinciden.');return;}
    setBusy(true);
    try{
      if(mode==='code'){
        onAuthenticated(await loginStudentCode(form.code));return;
      }
      if(mode==='recover'){
        await sendRecovery(form.email);setNotice('Te enviamos un enlace para crear una nueva contraseña. Revisa también la carpeta de correo no deseado.');return;
      }
      if(mode==='reset'){
        await updatePassword(form.password);setNotice('Tu contraseña fue actualizada. Ya puedes continuar.');onRecovered?.();return;
      }
      if(mode==='register'){
        const result=await registerStudent(form);
        if(result.needsConfirmation){setNotice('Cuenta creada. Revisa tu correo y pulsa el enlace de confirmación antes de ingresar.');return;}
        onAuthenticated(result.appUser);return;
      }
      onAuthenticated(await loginStudent(form));
    }catch(problem){setError(problem.message);}finally{setBusy(false);}
  };
  return <main className="auth-page">
    <section className="auth-visual" aria-label="El mundo fantástico de Valle Esmeralda">
      <img className="auth-landscape" src="./art/world-map-clean.webp" alt="Islas, cascadas y caminos de Valle Esmeralda"/><div className="auth-visual-shade"/>
      <a className="auth-brand" href="?">VALLE <strong>ESMERALDA</strong><small>UNA AVENTURA POR DESCUBRIR</small></a>
      <div className="auth-story"><img src="./art/hero-dodge-game.webp" alt="Protagonista de Valle Esmeralda"/><div><small>TU CAMINO COMIENZA AQUÍ</small><h1>Explora. Razona.<br/>Supera el desafío.</h1><p>Cada mundo pondrá a prueba una forma diferente de pensar.</p></div></div>
    </section>
    <section className="auth-panel"><div className="auth-card"><div className="auth-mobile-brand">VALLE <b>ESMERALDA</b></div><small>{kicker}</small><h2>{title}</h2>
      <p className="auth-intro">{mode==='code'?'Usa el código personal entregado por el profe Dani B. Tu avance quedará guardado.':mode==='login'?'Ingresa con la cuenta administrativa.':mode==='register'?'Crea la identidad que usarás durante la aventura.':'Indica el correo asociado a tu perfil.'}</p>
      <form onSubmit={submit}>
        {mode==='code'&&<label>Código personal<input name="code" value={form.code} onChange={update} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" maxLength="6" placeholder="000000" aria-label="Código personal de seis números"/></label>}
        {mode==='register'&&<><div className="auth-name-row"><label>Nombre<input name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" placeholder="Nombre"/></label><label>Apellido<input name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" placeholder="Apellido"/></label></div><label>Curso<select name="course" value={form.course} onChange={update}><option value="">Selecciona tu curso</option>{STUDENT_COURSES.map(course=><option key={course} value={course}>{course}</option>)}</select></label></>}
        {!['code','reset'].includes(mode)&&<label>Correo electrónico<input name="email" value={form.email} onChange={update} type="email" inputMode="email" autoComplete="email" placeholder="nombre@correo.com"/></label>}
        {!['code','recover'].includes(mode)&&<label>{mode==='reset'?'Nueva contraseña':'Contraseña'}<input name="password" value={form.password} onChange={update} type="password" autoComplete={mode==='login'?'current-password':'new-password'} placeholder="Mínimo 6 caracteres"/></label>}
        {(mode==='register'||mode==='reset')&&<label>Confirmar contraseña<input name="confirm" value={form.confirm} onChange={update} type="password" autoComplete="new-password" placeholder="Repite la contraseña"/></label>}
        {error&&<strong className="auth-error" role="alert">{error}</strong>}{notice&&<div className="auth-notice" role="status">✦ {notice}</div>}<button className="auth-submit" disabled={busy||!isSupabaseReady}>{busy?'CONECTANDO…':mode==='code'?'ENTRAR A LA AVENTURA →':mode==='login'?'ENTRAR COMO ADMINISTRADOR →':mode==='register'?'CREAR PERFIL →':mode==='reset'?'GUARDAR CONTRASEÑA →':'ENVIAR ENLACE →'}</button>
      </form>
      {mode!=='reset'&&<div className="auth-switches">{mode!=='code'&&<button onClick={()=>changeMode('code')}>Ingresar con código</button>}{mode==='code'&&<button onClick={()=>changeMode('login')}>Acceso del administrador</button>}{mode==='login'&&<button onClick={()=>changeMode('recover')}>Olvidé mi contraseña</button>}</div>}
      {!isSupabaseReady&&<p className="auth-preview-note"><b>CONEXIÓN PENDIENTE</b> El sistema de usuarios no pudo iniciarse. Recarga la página o avisa al docente.</p>}
    </div></section>
  </main>;
}
