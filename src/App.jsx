import React,{useState,useRef,useEffect} from 'react';
import World from './components/World.jsx';
import LogicLevel from './components/LogicLevel.jsx';
import CoordinateLevel from './components/CoordinateLevel.jsx';
import CannonCoordinateLevel from './components/CannonCoordinateLevel.jsx';
import AdventureHub from './components/AdventureHub.jsx';
import MazeLevel from './components/MazeLevel.jsx';
import DarkBossLevel from './components/DarkBossLevel.jsx';
import WaveLevel from './components/WaveLevel.jsx';
import BomberLevel from './components/BomberLevel.jsx';
import IslandPuzzleLevel from './components/IslandPuzzleLevel.jsx';
import PythagoreanBossLevel from './components/PythagoreanBossLevel.jsx';
import {PilotAccessGate} from './components/PilotGates.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import HubLinks from './components/HubLinks.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import {hasPilotAccess,starterWorldsComplete} from './game/pilotAccess.js';
import {currentAppUser,onAuthChange,sessionToAppUser} from './game/supabaseAuth.js';
import {recordGameError,startProgressTracking} from './game/progressTracking.js';
import {installTouchNavigation} from './game/touchNavigation.js';
import {LEVEL,LEVELS,pointAt,trajectory,encounter,obstacleImpact,coefficients,hitsSegment,baseLevelId} from './game/trajectory.js';
import {rockHitsHero} from './game/dodge.js';
function Slider({id,label,min=0,max,value,disabled,onChange,left,right}){return <div className={`control ${id==='curvature'?'':id+'-control'}`}><div className="control-heading"><label htmlFor={id}>{label}</label></div><input id={id} type="range" min={min} max={max} value={value} disabled={disabled} onChange={e=>onChange(Number(e.target.value))} style={{'--fill':`${(value-min)/(max-min)*100}%`}}/><div className="range-labels"><span>{left}</span><span>{right}</span></div></div>}
const newDodgeState=()=>({x:600,vx:0,facing:1,runCycle:0,jump:0,vy:0,rocks:[],spawnIn:.7,elapsed:0,nextId:1,invulnerable:0});
export default function App(){
 const routeParams=new URLSearchParams(location.search),hubView=routeParams.get('view')||(!routeParams.has('level')?'map':null);
 const [authSession,setAuthSession]=useState(undefined),[recoveringPassword,setRecoveringPassword]=useState(false);
 useEffect(()=>{let active=true;const unsubscribe=onAuthChange(async(event,session)=>{if(!active)return;if(event==='PASSWORD_RECOVERY'){setRecoveringPassword(true);return;}if(event==='SIGNED_OUT'){setAuthSession(null);return;}if(session)setAuthSession(await sessionToAppUser(session));});currentAppUser().then(user=>{if(active)setAuthSession(user);}).catch(()=>{if(active)setAuthSession(null);});return()=>{active=false;unsubscribe();};},[]);
 useEffect(()=>authSession&&!authSession.isAdmin?startProgressTracking(authSession.id):undefined,[authSession?.id,authSession?.isAdmin]);
 const [pilotAccess,setPilotAccess]=useState(hasPilotAccess);
 useEffect(()=>{let equipped=[];try{equipped=JSON.parse(localStorage.getItem('valle-esmeralda-shop')||'{}').equipped||[];}catch{};['trail','cannon','frame'].forEach(id=>document.body.classList.toggle(`cosmetic-${id}`,equipped.includes(id)));},[]);
 useEffect(()=>installTouchNavigation(),[]);
 const [levelIndex,setLevelIndex]=useState(()=>Math.min(Math.max(Number(new URLSearchParams(location.search).get('level'))||1,1),LEVELS.length)-1),[height,setHeight]=useState(0),[direction,setDirection]=useState(0);
 const level=LEVELS[levelIndex];
 const stage=baseLevelId(level);
 const [curvature,setCurvature]=useState(level.initialCurvature),[phase,setPhase]=useState('aim'),[projectile,setProjectile]=useState(null),[attempts,setAttempts]=useState(0),[menu,setMenu]=useState(false);
 const [missMessage,setMissMessage]=useState('¡Casi! Prueba otro recorrido y vuelve a lanzar.');
 const [missFeedback,setMissFeedback]=useState(null),[defeated,setDefeated]=useState([]),[pending,setPending]=useState(null),[barrelUsed,setBarrelUsed]=useState(false);
 const [gateActive,setGateActive]=useState(false);
 const [explored,setExplored]=useState([]),[teacherDismissed,setTeacherDismissed]=useState(false);
 const [hearts,setHearts]=useState(2),[bossHits,setBossHits]=useState(0),[battleElapsed,setBattleElapsed]=useState(0);
 const dodgeMotion=useRef(newDodgeState()),moveKeys=useRef({left:false,right:false});
 const [dodgeView,setDodgeView]=useState(()=>({x:600,vx:0,facing:1,runCycle:0,jump:0,rocks:[],invulnerable:0,elapsed:0}));
 const playLevel=level;
 const teacher=(level.id===4||level.id===3&&explored.length===3&&attempts>=2)&&!teacherDismissed;
 const abc=coefficients(curvature,height,direction);
 const frame=useRef(0),pause=useRef(false);pause.current=menu;
 useEffect(()=>()=>cancelAnimationFrame(frame.current),[]);
 useEffect(()=>{if(!hubView&&authSession)document.title=`Valle Esmeralda · Nivel ${level.id}`;},[level.id,hubView,authSession]);
 const won=phase==='won',lost=phase==='lost',hit=phase==='hit',shooting=phase==='flying'||hit;
 useEffect(()=>{
  if(phase!=='hit'||!pending)return;
  let elapsed=0,last=null,id;
  const reactToHit=now=>{if(last!==null&&!pause.current)elapsed+=Math.min(now-last,40);last=now;
   if(elapsed>=1200){
    const next=[...new Set([...defeated,...pending.ids])];setDefeated(next);if(pending.chain)setBarrelUsed(true);setPending(null);setPhase(next.length===(level.enemies?.length||1)?'won':'aim');return;}
   id=requestAnimationFrame(reactToHit);
  };id=requestAnimationFrame(reactToHit);return()=>cancelAnimationFrame(id);
 },[phase,pending,level,defeated]);
 useEffect(()=>{
  if(!level.boss||won||lost||menu)return;
  let last=performance.now(),raf;
  const tick=now=>{
   const dt=Math.max(0,Math.min((now-last)/1000,.04));last=now;
   const state=dodgeMotion.current;
   state.elapsed+=dt;state.invulnerable=Math.max(0,state.invulnerable-dt);
   const direction=(moveKeys.current.right?1:0)-(moveKeys.current.left?1:0),targetV=direction*440;
   const acceleration=(direction?1750:2250)*dt,difference=targetV-state.vx;
   state.vx+=Math.sign(difference)*Math.min(Math.abs(difference),acceleration);
   if(direction)state.facing=direction;
   state.x+=state.vx*dt;if(state.x<95||state.x>1105){state.x=Math.max(95,Math.min(1105,state.x));state.vx=0;}
   state.runCycle+=Math.abs(state.vx)*dt/34;
   if(state.jump>0||state.vy>0){state.jump+=state.vy*dt;state.vy-=1250*dt;if(state.jump<=0){state.jump=0;state.vy=0;}}
   state.spawnIn-=dt;
   if(state.spawnIn<=0){
    const difficulty=Math.min(1,state.elapsed/level.survivalSeconds),finale=Math.max(0,Math.min(1,(state.elapsed-(level.survivalSeconds-10))/10));
    const createRock=x=>{const r=27+Math.random()*39,vy=175+difficulty*470+finale*270+Math.random()*95,vx=state.elapsed<7?0:(Math.random()-.5)*(55+difficulty*210+finale*170);return {id:state.nextId++,variant:Math.floor(Math.random()*4),x,y:-r-10,r,vx,vy,gravity:75+difficulty*125+finale*120,rotation:Math.random()*360,spin:(Math.random()-.5)*(150+difficulty*190+finale*140)};};
    const x=75+Math.random()*1050;state.rocks.push(createRock(x));
    if(finale>0&&Math.random()<.25+finale*.5){const otherX=x<600?Math.min(1125,x+260+Math.random()*430):Math.max(75,x-260-Math.random()*430);state.rocks.push(createRock(otherX));}
    state.spawnIn=Math.max(.15,Math.max(.18,1.18-state.elapsed*.025)*(0.78+Math.random()*.38)*(1-finale*.48));
   }
   let avoided=0,wasHit=false;
   for(const rock of state.rocks){rock.vy+=rock.gravity*dt;rock.x+=rock.vx*dt;if(rock.x<45||rock.x>1155){rock.x=Math.max(45,Math.min(1155,rock.x));rock.vx*=-.72;}rock.y+=rock.vy*dt;rock.rotation+=rock.spin*dt;if(rock.y-rock.r>650)avoided++;
    if(!wasHit&&state.invulnerable<=0&&rockHitsHero(rock,state)){wasHit=true;rock.y=800;}
   }
   state.rocks=state.rocks.filter(rock=>rock.y-rock.r<=650);
   if(avoided)setBossHits(value=>value+avoided);
   if(wasHit){recordGameError(level.id);state.invulnerable=1.25;setHearts(value=>{const next=value-1;if(next<=0)setPhase('lost');return Math.max(0,next);});}
   const shownSeconds=Math.min(level.survivalSeconds,Math.floor(state.elapsed));setBattleElapsed(shownSeconds);
   setDodgeView({x:state.x,vx:state.vx,facing:state.facing,runCycle:state.runCycle,jump:state.jump,rocks:state.rocks.map(rock=>({...rock})),invulnerable:state.invulnerable,elapsed:state.elapsed});
   if(state.elapsed>=level.survivalSeconds){setPhase('won');return;}
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
 },[level.boss,level.survivalSeconds,won,lost,menu]);
 function reset(nextIndex=levelIndex){cancelAnimationFrame(frame.current);setPhase('aim');setPending(null);setDefeated([]);setBarrelUsed(false);setGateActive(false);setMissFeedback(null);setProjectile(null);setAttempts(0);setLevelIndex(nextIndex);setHeight(0);setDirection(0);setCurvature(LEVELS[nextIndex].initialCurvature);setMenu(false);setExplored([]);setTeacherDismissed(false);setHearts(2);setBossHits(0);setBattleElapsed(0);dodgeMotion.current=newDodgeState();moveKeys.current={left:false,right:false};setDodgeView({x:600,vx:0,facing:1,runCycle:0,jump:0,rocks:[],invulnerable:0,elapsed:0});}
 function adjust(id,setter,value){setter(value);setExplored(v=>v.includes(id)?v:[...v,id]);setMissFeedback(null);if(phase==='miss')setPhase('aim');}
 function launch(){
  if(shooting||won||lost||menu||level.boss)return;setMissFeedback(null);setGateActive(false);setAttempts(n=>n+1);setPhase('flying');let elapsed=0,last=null,gatePassed=false,previous=pointAt(0,curvature,height,direction,playLevel);setProjectile(previous);
  const tick=now=>{if(last!==null&&!pause.current)elapsed+=Math.min(now-last,40);last=now;const t=Math.min(elapsed/playLevel.duration,1),p=pointAt(t,curvature,height,direction,playLevel);
   const impact=obstacleImpact(previous,p,playLevel.obstacle);
   if(impact){recordGameError(level.id);setMissMessage('¡La madera detuvo el disparo! Prueba un arco más alto.');setPhase('miss');setMissFeedback({...impact,id:now});setProjectile(null);return;}
   if(playLevel.gate&&!gatePassed&&hitsSegment(previous,p,playLevel.gate)){gatePassed=true;setGateActive(true);}
   const contact=encounter(previous,p,playLevel,defeated,barrelUsed);
   if(contact){if(playLevel.gate&&!gatePassed){recordGameError(level.id);setMissMessage('La diana final no cuenta todavía: primero atraviesa el aro luminoso.');setGateActive(false);setPhase('miss');setMissFeedback({...contact.point,id:now});setProjectile(null);return;}setPending(contact);setPhase('hit');setProjectile(null);return;}
   setProjectile(p);previous=p;if(t>=1||p.y>590){recordGameError(level.id);const targetT=(playLevel.target.x-playLevel.origin.x)/(850+direction*4);const above=pointAt(targetT,curvature,height,direction,playLevel).y<playLevel.target.y;setMissMessage(level.boss?'¡Fallaste! Ajusta rápido antes del próximo ataque.':playLevel.gate&&gatePassed?'¡Atravesaste el aro! Ajusta para que ese mismo disparo también golpee la diana final.':stage===1?(above?'Pasó por arriba. Prueba una curvatura más cerrada.':'Pasó por abajo. Prueba una curvatura más abierta.'):'¡Casi! Sigue el camino de luz y prueba otro recorrido.');setGateActive(false);setPhase('miss');setMissFeedback({...p,id:now});setProjectile(null);return;}
   frame.current=requestAnimationFrame(tick);
  };frame.current=requestAnimationFrame(tick);
 }
 const jump=()=>{if(level.boss&&!menu&&!won&&!lost&&dodgeMotion.current.jump<2)dodgeMotion.current.vy=620;};
 useEffect(()=>{const setKey=(e,down)=>{if(e.key==='Escape'&&down&&!e.repeat){setMenu(v=>!v);return;}if(!level.boss||menu||won||lost)return;const key=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' ','a','d','w'].includes(key))e.preventDefault();if(key==='arrowleft'||key==='a')moveKeys.current.left=down;if(key==='arrowright'||key==='d')moveKeys.current.right=down;if(down&&!e.repeat&&(key==='arrowup'||key==='w'||key===' '))jump();};const down=e=>setKey(e,true),up=e=>setKey(e,false);window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);moveKeys.current={left:false,right:false};};},[level.boss,menu,won,lost]);
 const disabled=shooting||won||lost||menu;
 const bossStars=won?1+(hearts>=2?1:0)+(bossHits>=20?1:0):0;
 useEffect(()=>{if(!won||level.id>11)return;try{const key='valle-esmeralda-logic-progress',current=JSON.parse(localStorage.getItem(key)||'{}'),earned=level.boss?bossStars:1,next={...current,[level.id]:{stars:Math.max(current[level.id]?.stars||0,earned),crystal:1}};localStorage.setItem(key,JSON.stringify(next));}catch{}},[won,level.id,bossStars]);
 const difficulty=battleElapsed<12?'SUAVE':battleElapsed<24?'RÁPIDO':battleElapsed<level.survivalSeconds-10?'EXTREMO':'AVALANCHA';
 if(authSession===undefined)return <main className="auth-loading" aria-live="polite"><span>◆</span><strong>ABRIENDO VALLE ESMERALDA…</strong></main>;
 if(!authSession||recoveringPassword)return <AuthScreen recovering={recoveringPassword} onRecovered={()=>setRecoveringPassword(false)} onAuthenticated={setAuthSession}/>;
 if(authSession.isAdmin)return <AdminDashboard user={authSession}/>;
 if(hubView==='map'||hubView==='shop'||hubView==='world')return <AdventureHub view={hubView} levels={LEVELS}/>;
 if(level.id>26&&(!pilotAccess||!starterWorldsComplete()))return <main className="pilot-locked-page"><PilotAccessGate requirementsMet={starterWorldsComplete()} onUnlocked={()=>setPilotAccess(true)}/></main>;
 if(level.darkBoss)return <DarkBossLevel level={level} onNext={()=>location.href='?view=map'}/>;
 if(level.wave)return <WaveLevel level={level} onNext={()=>levelIndex<LEVELS.length-1?reset(levelIndex+1):location.href='?view=map'}/>;
 if(level.bomber)return <BomberLevel key={level.id} level={level} onNext={()=>levelIndex<LEVELS.length-1?reset(levelIndex+1):location.href='?view=map'}/>;
 if(level.pythagoreanBoss)return <PythagoreanBossLevel key={level.id}/>;
 if(level.islandPuzzle)return <IslandPuzzleLevel key={level.id} level={level} onNext={()=>level.id<67?reset(levelIndex+1):location.href='?view=map'}/>;
 if(level.maze)return <MazeLevel level={level} levels={LEVELS} onNext={()=>level.id<40?reset(levelIndex+1):reset(levelIndex+1)}/>;
 return level.cannonCoordinate?<CannonCoordinateLevel level={level} levels={LEVELS} onSelectLevel={reset} onNext={()=>levelIndex<LEVELS.length-1?reset(levelIndex+1):reset(0)}/>:level.coordinate?<CoordinateLevel level={level} levels={LEVELS} onSelectLevel={reset} onNext={()=>levelIndex<LEVELS.length-1?reset(levelIndex+1):reset(0)}/>:level.logic?<LogicLevel level={level} levels={LEVELS} onSelectLevel={reset} onNext={()=>levelIndex<LEVELS.length-1?reset(levelIndex+1):reset(0)}/>:<main><header><a className="brand" href="?view=map" aria-label="Abrir mapa de mundos"><span>VALLE</span> ESMERALDA<small>UNA AVENTURA POR DESCUBRIR</small></a><div className="chapter"><span>CAPÍTULO 01</span><strong>{level.name}</strong></div><div className="inventory"><span title="Estrellas">★ <b>{level.boss?bossStars:won?1:0}</b><small>/ {level.boss?3:1}</small></span><span title="Cristales">◆ <b>{won?1:0}</b><small>/ 1</small></span><span className="energy" aria-label={`${hearts} corazones`}>{level.boss?Array.from({length:2},(_,i)=>i<hearts?'♥':'♡').join(' '):'♥ ♥ ♥'}</span></div><HubLinks/><button className="menu-button" onClick={()=>setMenu(true)} aria-label="Abrir menú">☰</button></header>
 <section className={`game${level.boss?' boss-level':''}`} aria-label={`Nivel ${level.id}`}><World level={playLevel} points={trajectory(curvature,height,playLevel,direction)} projectile={projectile} won={won} hit={hit} pending={pending} defeated={defeated} barrelUsed={barrelUsed} gateActive={gateActive} shooting={shooting} missFeedback={missFeedback} paused={menu} dodgeState={dodgeView} onReactionEnd={()=>setMissFeedback(null)}/><div className="level-tag"><span>VALLE ESMERALDA</span><strong>Nivel {level.id} <i>·</i> {level.name}</strong></div><div className="objective"><span className="diamond">◆</span><div><small>TU MISIÓN</small>{level.boss?`Resiste: ${Math.min(level.survivalSeconds,battleElapsed)} / ${level.survivalSeconds} s`:stage===3?`Saqueadores: ${defeated.length} / 2`:stage===4?'Activa la diana':level.gate?(won?'Secuencia: 2 / 2':gateActive?'Secuencia: 1 / 2':'Aro → Diana'):'Recupera el cristal'}</div></div><div className="bottom-shade"/>
 {stage>=4&&!level.boss&&<div className="formula-panel"><span>{level.previewFraction?'GUÍA: PRIMER TERCIO':stage===5?'PRUEBA DE PRECISIÓN':'EL LENGUAJE DEL CAÑÓN'}</span><strong>y = ax² + bx + c</strong><output aria-label="Ecuación del recorrido">y = {abc.a.toFixed(3)}x² + {abc.b.toFixed(2)}x + {abc.c.toFixed(3)}</output><small>{level.previewFraction?'La luz revela únicamente el primer tercio del recorrido.':'x: avance desde el cañón · y: altura respecto a la posición inicial del cañón'}</small></div>}
 {level.boss&&<div className={`boss-status difficulty-${difficulty.toLowerCase()}`} aria-label={`${Math.max(0,level.survivalSeconds-battleElapsed)} segundos restantes`}><span>{Math.max(0,level.survivalSeconds-battleElapsed)} s</span></div>}
 {level.boss?<div className="dodge-panel"><div><strong>RECORRE TODA LA PLATAFORMA</strong><small className="desktop-move-help">Mantén pulsado para correr · salta para esquivar</small><small className="touch-move-help">Desliza a los lados para correr · desliza hacia arriba para saltar</small></div><div className="movement"><button disabled={won||lost||menu} onPointerDown={()=>moveKeys.current.left=true} onPointerUp={()=>moveKeys.current.left=false} onPointerLeave={()=>moveKeys.current.left=false} onPointerCancel={()=>moveKeys.current.left=false} aria-label="Mover hacia atrás">◀ ATRÁS</button><button className="jump-button" disabled={won||lost||menu} onClick={jump} aria-label="Saltar">↑ SALTAR</button><button disabled={won||lost||menu} onPointerDown={()=>moveKeys.current.right=true} onPointerUp={()=>moveKeys.current.right=false} onPointerLeave={()=>moveKeys.current.right=false} onPointerCancel={()=>moveKeys.current.right=false} aria-label="Mover hacia adelante">ADELANTE ▶</button></div></div>:<div className="play-panel"><Slider id="curvature" label={stage>=4?"CURVATURA · a":"CURVATURA"} max={100} value={curvature} disabled={disabled} onChange={v=>adjust('curvature',setCurvature,v)} left="Más abierta" right="Más cerrada"/>
 {stage>=2&&<Slider id="height" label={stage>=4?"ALTURA DE SALIDA · c":"ALTURA"} max={40} value={height} disabled={disabled} onChange={v=>adjust('height',setHeight,v)} left="Más baja" right="Más alta"/>}
 {stage>=3&&<Slider id="direction" label={stage>=4?"DIRECCIÓN INICIAL · b":"DIRECCIÓN"} min={-40} max={40} value={direction} disabled={disabled} onChange={v=>adjust('direction',setDirection,v)} left={stage>=4?"Más horizontal":"Más vertical"} right={stage>=4?"Más ascendente":"Más horizontal"}/>} 
 <button className="launch" onClick={launch} disabled={disabled}><span>✦</span>{hit?(pending?.chain?'¡EN CADENA!':'¡IMPACTO!'):shooting?'EN EL AIRE…':'LANZAR'}<span>→</span></button></div>}
 {teacher&&!shooting&&!menu&&!won&&<aside className="teacher"><svg viewBox="965 765 109 120" role="img" aria-label="Profe Dani B"><image href="./art/approved-reference.webp" width="1536" height="1024"/></svg><div><strong>Profe Dani B</strong><p>{level.id===4?'Bienvenido a mi taller. Hoy cada letra tiene una tarea: a curva el recorrido, b cambia la inclinación inicial y c sube o baja el cañón completo. Ajusta la parábola y activa la diana.':'¡Ya controlas el recorrido! Esa curva se llama parábola. Prueba a alcanzar el barril: puede ayudarte con los dos Saqueadores.'}</p><button onClick={()=>setTeacherDismissed(true)}>¡Vamos!</button></div></aside>}
 {won&&<div className="victory" role="dialog" aria-modal="true" aria-labelledby="win-title"><div className="win-star">{level.boss?'★'.repeat(bossStars):'★'}</div><small>{level.boss?'CAPÍTULO COMPLETADO':'NIVEL COMPLETADO'}</small><h1 id="win-title">{level.boss?'¡Escapaste del derrumbe!':stage===5?'¡Precisión perfecta!':'¡El cristal es tuyo!'}</h1><p>{level.boss?`Resististe ${level.survivalSeconds} segundos, esquivaste ${bossHits} rocas y conservaste ${hearts} corazones.`:stage===5?'¡Atravesaste el aro y golpeaste la diana con el mismo disparo!':stage===4?'¡Diana activada! Ya has dado tus primeros pasos con a, b y c.':stage===3?'¡Los dos Saqueadores han sido derrotados!':'El valle vuelve a brillar. Buen disparo.'}</p><div className="rewards">★ {level.boss?bossStars:1} estrella{level.boss&&bossStars!==1?'s':''} <span>◆ 1 cristal</span></div><button autoFocus onClick={()=>levelIndex<LEVELS.length-1?reset(levelIndex+1):reset()}>{levelIndex<LEVELS.length-1?`Nivel ${level.id+1} →`:'Volver a esquivar ↻'}</button></div>}
 {lost&&<div className="victory defeat" role="dialog" aria-modal="true" aria-labelledby="defeat-title"><div className="win-star">♡</div><small>EL DERRUMBE CONTINÚA</small><h1 id="defeat-title">¡Vuelve a intentarlo!</h1><p>Corre por toda la plataforma y usa el salto para pasar por encima de las rocas.</p><button autoFocus onClick={()=>reset()}>Reintentar nivel ↻</button></div>}
 {menu&&<div className="modal-backdrop"><section className="menu-card" role="dialog" aria-modal="true" aria-labelledby="menu-title" onKeyDown={e=>{if(e.key==='Tab'){const buttons=e.currentTarget.querySelectorAll('button');if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons[buttons.length-1].focus();}else if(!e.shiftKey&&document.activeElement===buttons[buttons.length-1]){e.preventDefault();buttons[0].focus();}}}}><small>VALLE ESMERALDA</small><h2 id="menu-title">Una pequeña pausa</h2><p>Ajusta el recorrido y recupera el cristal. Puedes intentarlo cuantas veces quieras.</p><button autoFocus onClick={()=>setMenu(false)}>Continuar</button><button className="secondary" onClick={()=>reset()}>Reiniciar nivel</button>{LEVELS.map((l,i)=>i!==levelIndex&&<button className="secondary" key={l.id} onClick={()=>reset(i)}>Jugar Nivel {l.id}</button>)}</section></div>}
 </section><footer><div className="guide-icon">✧</div><p role="status" aria-live="polite">{won?'¡Bien hecho! Has completado el reto.':lost?'Las rocas te alcanzaron, pero puedes volver a intentarlo.':level.boss?'Corre libremente y salta: la lluvia será cada vez más intensa.':hit?(pending?.chain?'¡El barril ha activado una reacción en cadena!':stage>=4?'¡Diana activada! Buen trabajo.':'¡Le diste! El Saqueador no está nada contento.'):shooting?(level.gate&&gateActive?'¡Aro atravesado! Ahora debe llegar a la diana.':'¡Allá va! Sigue el camino de luz.'):phase==='miss'?missMessage:level.previewFraction?`Solo ves el primer tercio. ${stage===5?'Atraviesa el aro y alcanza la diana con el mismo disparo.':'Imagina cómo continúa la parábola.'}`:stage===5?'Haz que un solo disparo atraviese el aro y después golpee la diana.':stage===3?(defeated.length?'¡Uno menos! Busca al otro Saqueador.':'Dos Saqueadores, un barril… ¡Busca tu oportunidad!'):stage===4?'Prueba las tres letras y observa cómo cambia tu parábola.':stage===2?'Ajusta la altura y la curvatura para pasar sobre la madera.':'Ajusta la curvatura. Sigue la luz. Encuentra tu disparo.'}</p><span className="attempts">{level.boss?`${battleElapsed} s · ${bossHits} rocas esquivadas · ${difficulty}`:<>{attempts>0?`${attempts} disparo${attempts===1?'':'s'} · `:''}Intentos ilimitados <b>∞</b></>}</span></footer></main>
}










