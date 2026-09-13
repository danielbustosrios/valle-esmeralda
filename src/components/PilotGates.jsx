import React,{useEffect,useMemo,useRef,useState} from 'react';
import {clearLogicFailures,grantPilotAccess,verifyPilotCode} from '../game/pilotAccess.js';

const MEMORY_SEQUENCES=[['◆','▲','●','▲'],['●','◆','◆','▲'],['▲','●','◆','●'],['◆','●','▲','◆']];

export function PilotAccessGate({onUnlocked,embedded=false,requirementsMet=true}){
  const [code,setCode]=useState(''),[error,setError]=useState('');
  const submit=event=>{event?.preventDefault();if(!verifyPilotCode(code)){setError('El código no coincide. Pídeselo al docente y vuelve a intentarlo.');return;}grantPilotAccess();setError('');onUnlocked?.();};
  return <div className={embedded?'pilot-gate embedded':'pilot-gate'} role="dialog" aria-modal="true" aria-labelledby="pilot-gate-title"><div className="pilot-gate-card"><div className="pilot-lock">◆</div><small>ACCESO A LA PRUEBA PILOTO</small><h2 id="pilot-gate-title">{requirementsMet?'Los cuatro caminos están completos':'El camino todavía está cerrado'}</h2><p>{requirementsMet?'La siguiente región contiene niveles que todavía están en evaluación. Ingresa el código de cuatro dígitos entregado por el docente.':'Completa Valle Esmeralda, Puentes del Ingenio, Observatorio Cartesiano y Laberintos del Cielo antes de ingresar a la prueba piloto.'}</p>{requirementsMet&&<form onSubmit={submit}><label htmlFor="pilot-code">Código del docente</label><input id="pilot-code" value={code} onChange={event=>{setCode(event.target.value.replace(/\D/g,'').slice(0,4));setError('');}} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{4}" maxLength="4" placeholder="••••" aria-describedby={error?'pilot-code-error':undefined} autoFocus/><button disabled={code.length!==4}>DESBLOQUEAR CAMINO →</button></form>}{error&&<strong id="pilot-code-error" className="pilot-error" role="alert">{error}</strong>}<a href="?view=map">Volver al mapa</a></div></div>;
}

export function MemoryRecoveryGate({onRecovered}){
  const [challenge,setChallenge]=useState(()=>Math.floor(Math.random()*MEMORY_SEQUENCES.length));
  const [phase,setPhase]=useState('watch'),[message,setMessage]=useState('Observa y recuerda el orden.');
  const timer=useRef(0),answer=MEMORY_SEQUENCES[challenge];
  const options=useMemo(()=>[answer,MEMORY_SEQUENCES[(challenge+1)%MEMORY_SEQUENCES.length],MEMORY_SEQUENCES[(challenge+2)%MEMORY_SEQUENCES.length]].sort(()=>Math.random()-.5),[challenge]);
  useEffect(()=>{if(phase!=='watch')return;timer.current=setTimeout(()=>{setPhase('choose');setMessage('¿Cuál era la secuencia?');},2300);return()=>clearTimeout(timer.current);},[phase,challenge]);
  const choose=option=>{if(option===answer){clearLogicFailures();setMessage('¡Memoria recuperada! El puente vuelve a abrirse.');setPhase('success');timer.current=setTimeout(()=>onRecovered?.(),850);return;}setMessage('Esa no era. Mira una nueva secuencia.');setPhase('wrong');timer.current=setTimeout(()=>{setChallenge(current=>(current+1)%MEMORY_SEQUENCES.length);setPhase('watch');setMessage('Observa y recuerda el orden.');},950);};
  return <div className="memory-gate" role="dialog" aria-modal="true" aria-labelledby="memory-title"><section><small>PAUSA DE CONCENTRACIÓN</small><h2 id="memory-title">Recupera el paso al puente</h2><p>{message}</p>{phase==='watch'&&<div className="memory-sequence showing" aria-label={`Secuencia: ${answer.join(', ')}`}>{answer.map((symbol,index)=><b key={index}>{symbol}</b>)}</div>}{phase==='choose'&&<div className="memory-options">{options.map((option,index)=><button key={index} onClick={()=>choose(option)} aria-label={`Opción ${index+1}: ${option.join(', ')}`}>{option.map((symbol,item)=><b key={item}>{symbol}</b>)}</button>)}</div>}{phase==='wrong'&&<div className="memory-sequence hidden" aria-hidden="true">◆ ◆ ◆ ◆</div>}{phase==='success'&&<div className="memory-success">✓</div>}<em>Esta pausa aparece después de dos intentos fallidos.</em></section></div>;
}
