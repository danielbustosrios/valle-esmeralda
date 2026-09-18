import React,{useEffect,useMemo,useRef,useState} from 'react';
import {MemoryRecoveryGate,PilotAccessGate} from './PilotGates.jsx';
import {completionPercent,hasPilotAccess,requiresLogicRecovery} from '../game/pilotAccess.js';
import {signOut} from '../game/supabaseAuth.js';
import ScreenModeButton from './ScreenModeButton.jsx';
import StudentLeaderboard from './StudentLeaderboard.jsx';

const PROGRESS_KEY='valle-esmeralda-logic-progress',SHOP_KEY='valle-esmeralda-shop',MAP_POSITION_KEY='valle-esmeralda-map-position',MAP_SESSION_STARTED_KEY='valle-esmeralda-map-session-started',STARTER_CELEBRATION_KEY='valle-esmeralda-four-worlds-celebrated',WORLD_DISCOVERY_KEY='valle-esmeralda-seen-worlds',SHOP_DIALOGUE_DONE_KEY='valle-esmeralda-shop-dialogue-done';
const STARTER_WORLD_ENDS=[11,17,21,26];
const WORLDS=[
  {id:1,name:'Valle Esmeralda',subtitle:'El arte de la parábola',levels:[1,2,3,4,5,6,7,8,9,10,11],image:'./art/level-1.webp',position:{left:'19%',top:'65%'}},
  {id:2,name:'Puentes del Ingenio',subtitle:'Patrones y razonamiento',levels:[12,13,14,15,16,17],image:'./art/logic-bridge.webp',position:{left:'36%',top:'57%'}},
  {id:3,name:'Observatorio Cartesiano',subtitle:'Coordenadas y funciones',levels:[18,19,20,21],image:'./art/coordinate-observatory.webp',position:{left:'54%',top:'45%'}},
  {id:4,name:'Laberintos del Cielo',subtitle:'Orientación, memoria y estrategia',levels:[22,23,24,25,26],image:'./art/maze-world.webp',position:{left:'75%',top:'60%'}},
  {id:5,name:'Fortaleza de los Enigmas',subtitle:'Laberintos avanzados contrarreloj',levels:[27,28,29,30,31],image:'./art/maze-world-advanced.webp',position:{left:'87%',top:'33%'},requiresFour:true},
  {id:6,name:'Ciudadela Giratoria',subtitle:'Tiempo, giros y guardianes',levels:[32,33,34,35,36],image:'./art/maze-world-rotating.webp',position:{left:'71%',top:'20%'},unlockAfter:31},
  {id:7,name:'Galerías de la Penumbra',subtitle:'Memoria, luz y sombras en movimiento',levels:[37,38,39,40,41],image:'./art/maze-world-advanced.webp',position:{left:'57%',top:'33%'},unlockAfter:36},
  {id:8,name:'Rieles de la Recta',subtitle:'Pendiente, intersección y lanzamientos lineales',levels:[42,43,44,45,46],image:'./art/coordinate-observatory.webp',position:{left:'39%',top:'22%'},unlockAfter:41},
  {id:10,name:'Ruinas de la Pólvora',subtitle:'Rutas, explosiones y decisiones estratégicas',levels:[52,53,54,55,56,57,58,59,60],image:'./art/bomb-ruins.webp',position:{left:'12%',top:'43%'},unlockAfter:46},
  {id:11,name:'Archipiélago del Ingenio',subtitle:'Objetos, caminos y rompecabezas de acción',levels:[61,62,63,64,65,66,67],image:'./art/tropical-puzzle-room.webp',position:{left:'31%',top:'40%'},unlockAfter:60},
  {id:12,name:'Ruinas Pitagóricas',subtitle:'El desafío final del Coloso',levels:[68],image:'./art/pythagorean-ruins-concept.webp',position:{left:'50%',top:'17%'},unlockAfter:67}
];
const ITEMS=[
  {id:'outfit',name:'Capa esmeralda',description:'Un nuevo estilo para el protagonista durante la aventura.',cost:12,currency:'◆',icon:'🧥'},
  {id:'boots',name:'Botas del explorador',description:'Pasos y estela visual especiales al recorrer los mundos.',cost:150,currency:'●',icon:'🥾'},
  {id:'companion',name:'Compañero luminoso',description:'Una pequeña criatura que acompaña al protagonista.',cost:20,currency:'◆',icon:'✨'},
  {id:'hint',name:'Pista de Dani B',description:'Una orientación para un desafío, sin revelar la solución.',cost:6,currency:'◆',icon:'💡'},
  {id:'five',name:'Un 5,0 adicional',description:'Obtén una nota adicional de 5,0 en el periodo actual al completar todos los niveles propuestos.',icon:'🏅',academic:true,finalReward:true},
  {id:'half',name:'Regálale 0,5 a un compañero',description:'Permite entregar a un compañero una bonificación de 0,5 en una nota.',cost:300,currency:'●',icon:'+0,5',academic:true}
];
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
const applyCosmetics=equipped=>ITEMS.forEach(item=>document.body.classList.toggle(`cosmetic-${item.id}`,equipped.includes(item.id)));

const MAP_ROUTE=[
  {id:0,x:19,y:65,name:'Valle Esmeralda',href:'?view=world&world=1',links:[1]},
  {id:1,x:27,y:62,links:[0,2]},
  {id:2,x:36,y:57,name:'Puentes del Ingenio',href:'?view=world&world=2',links:[1,3,23]},
  {id:3,x:45,y:52,links:[2,4]},
  {id:4,x:54,y:45,name:'Observatorio Cartesiano',href:'?view=world&world=3',links:[3,5]},
  {id:5,x:65,y:51,links:[4,6]},
  {id:6,x:75,y:60,name:'Laberintos del Cielo',href:'?view=world&world=4',links:[5,7,24]},
  {id:7,x:82,y:48,requiresFour:true,gateway:true,links:[6,8]},
  {id:8,x:87,y:33,name:'Fortaleza de los Enigmas',href:'?view=world&world=5',requiresFour:true,gateway:true,links:[7,9]},
  {id:9,x:80,y:25,requiresFour:true,unlockAfter:31,links:[8,10]},
  {id:10,x:71,y:20,name:'Ciudadela Giratoria',href:'?view=world&world=6',requiresFour:true,unlockAfter:31,links:[9,11]},
  {id:11,x:64,y:27,requiresFour:true,unlockAfter:36,links:[10,12]},
  {id:12,x:57,y:33,name:'Galerías de la Penumbra',href:'?view=world&world=7',requiresFour:true,unlockAfter:36,links:[11,13]},
  {id:13,x:48,y:27,requiresFour:true,unlockAfter:41,links:[12,14]},
  {id:14,x:39,y:22,name:'Rieles de la Recta',href:'?view=world&world=8',requiresFour:true,unlockAfter:41,links:[13,15]},
  {id:15,x:25,y:20,requiresFour:true,unlockAfter:46,links:[14,16]},
  {id:16,x:12,y:25,name:'Islas de las Ondas',href:'?view=world&world=9',requiresFour:true,unlockAfter:46,links:[15,17]},
  {id:17,x:10,y:34,requiresFour:true,unlockAfter:46,links:[16,18]},
  {id:18,x:12,y:43,name:'Ruinas de la Pólvora',href:'?view=world&world=10',requiresFour:true,unlockAfter:46,links:[17,19]},
  {id:19,x:21,y:42,requiresFour:true,unlockAfter:60,links:[18,20]},
  {id:20,x:31,y:40,name:'Archipiélago del Ingenio',href:'?view=world&world=11',requiresFour:true,unlockAfter:60,links:[19,21]},
  {id:21,x:42,y:28,requiresFour:true,unlockAfter:67,links:[20,22]},
  {id:22,x:50,y:17,name:'Ruinas Pitagóricas',href:'?view=world&world=12',requiresFour:true,unlockAfter:67,links:[21]},
  {id:23,x:44,y:68,links:[2,24]},
  {id:24,x:53,y:78,name:'Tienda del Valle',href:'?view=shop',links:[23,6]}
];
const DIRECTION_VECTOR={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
const nodeUnlocked=(node,completed,fourComplete,pilotAccess)=>(!node.requiresFour||fourComplete&&pilotAccess)&&(!node.unlockAfter||completed.has(node.unlockAfter));

const unlockWorldForNode=node=>node.id<=8?5:node.id<=10?6:node.id<=12?7:node.id<=14?8:node.id<=18?10:node.id<=20?11:node.id<=22?12:null;

function MapRoutes({completed,fourComplete,pilotAccess,opening,revealingWorldId}){
  const edges=MAP_ROUTE.flatMap(node=>node.links.filter(id=>id>node.id).map(id=>[node,MAP_ROUTE[id]]));
  return <svg className={`map-routes${opening?' opening':''}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{edges.map(([from,to])=>{const open=nodeUnlocked(from,completed,fourComplete,pilotAccess)&&nodeUnlocked(to,completed,fourComplete,pilotAccess);if(!open)return null;const awakening=opening&&(from.gateway||to.gateway),revealing=revealingWorldId&&(unlockWorldForNode(from)===revealingWorldId||unlockWorldForNode(to)===revealingWorldId);return <g className={`open${awakening?' awakening':''}${revealing?' revealing':''}`} key={`${from.id}-${to.id}`}><line className="route-shadow" x1={from.x} y1={from.y} x2={to.x} y2={to.y}/><line className="route-path" x1={from.x} y1={from.y} x2={to.x} y2={to.y}/></g>;})}</svg>;
}

function MapTraveler({completed,fourComplete,pilotAccess,previewFinal=false}){
  const travelerRef=useRef(null);
  const [nodeId,setNodeId]=useState(()=>{if(previewFinal)return 20;try{if(sessionStorage.getItem(MAP_SESSION_STARTED_KEY)!=='true'){sessionStorage.setItem(MAP_SESSION_STARTED_KEY,'true');return 24;}}catch{}const saved=read(MAP_POSITION_KEY,{node:24});if(Number.isInteger(saved.node)&&MAP_ROUTE[saved.node]&&nodeUnlocked(MAP_ROUTE[saved.node],completed,fourComplete,pilotAccess))return saved.node;if(Number.isFinite(saved.x)&&Number.isFinite(saved.y))return MAP_ROUTE.filter(node=>nodeUnlocked(node,completed,fourComplete,pilotAccess)).reduce((best,node)=>Math.hypot(node.x-saved.x,node.y-saved.y)<best.distance?{id:node.id,distance:Math.hypot(node.x-saved.x,node.y-saved.y)}:best,{id:24,distance:Infinity}).id;return 24;});
  const [motion,setMotion]=useState({moving:false,facing:1});
  const node=MAP_ROUTE[nodeId],canEnter=nodeUnlocked(node,completed,fourComplete,pilotAccess);
  const destinationFor=direction=>{const vector=DIRECTION_VECTOR[direction];return node.links.map(id=>MAP_ROUTE[id]).filter(target=>nodeUnlocked(target,completed,fourComplete,pilotAccess)).map(target=>{const dx=target.x-node.x,dy=target.y-node.y,length=Math.hypot(dx,dy);return{target,score:(dx/length)*vector.x+(dy/length)*vector.y};}).sort((a,b)=>b.score-a.score)[0];};
  const canMove=direction=>!motion.moving&&destinationFor(direction)?.score>.28;
  const move=direction=>{if(!canMove(direction))return;const target=destinationFor(direction).target;setMotion({moving:true,facing:target.x===node.x?motion.facing:target.x>node.x?1:-1});setNodeId(target.id);setTimeout(()=>setMotion(current=>({...current,moving:false})),720);};
  useEffect(()=>{if(!previewFinal)localStorage.setItem(MAP_POSITION_KEY,JSON.stringify({node:nodeId}));},[nodeId,previewFinal]);
  useEffect(()=>{const canvas=travelerRef.current?.parentElement,viewport=canvas?.parentElement;if(!viewport?.classList.contains('map-scroll-viewport')||!matchMedia('(max-width: 700px)').matches)return;viewport.scrollTo({left:Math.max(0,canvas.scrollWidth*node.x/100-viewport.clientWidth/2),top:Math.max(0,canvas.scrollHeight*node.y/100-viewport.clientHeight/2),behavior:motion.moving?'smooth':'auto'});},[nodeId,motion.moving,node.x,node.y]);
  useEffect(()=>{
    const keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
    const down=event=>{const direction=keys[event.key];if(!direction||event.repeat)return;event.preventDefault();move(direction);};window.addEventListener('keydown',down);return()=>window.removeEventListener('keydown',down);
  });
  const entryReady=Boolean(node.href&&canEnter&&!motion.moving);
  return <><div ref={travelerRef} className={`map-traveler${motion.moving?' walking':''}`} style={{left:`${node.x}%`,top:`${node.y}%`}} aria-label="Protagonista recorriendo los caminos del mapa">{node.name&&<strong className="traveler-place">{node.name}</strong>}<span className="traveler-shadow"/><img src="./art/hero-dodge.webp" alt="" style={{'--facing':motion.facing}}/></div><div className="map-touch-controls" aria-label="Controles para seguir los caminos"><span className="map-control-hint">SIGUE LAS LÍNEAS</span><button aria-label="Tomar el camino hacia arriba" disabled={!canMove('up')} onClick={()=>move('up')}>▲</button><button aria-label="Tomar el camino hacia la izquierda" disabled={!canMove('left')} onClick={()=>move('left')}>◀</button><button className="enter-path" aria-label={entryReady?`Entrar a ${node.name}`:'Llega a un portal para entrar'} disabled={!entryReady} onClick={()=>{if(entryReady)location.href=node.href;}}>◆</button><button aria-label="Tomar el camino hacia la derecha" disabled={!canMove('right')} onClick={()=>move('right')}>▶</button><button aria-label="Tomar el camino hacia abajo" disabled={!canMove('down')} onClick={()=>move('down')}>▼</button>{entryReady&&<small className="enter-path-label">ENTRAR</small>}</div></>;
}

function ShopDialogue({lines,onComplete,onDismiss}){
  const [index,setIndex]=useState(0),[visible,setVisible]=useState('');
  const entry=lines[index],message=typeof entry==='string'?entry:entry.text,speaker=typeof entry==='string'?'PROFE DANI B':entry.speaker;
  useEffect(()=>{let cursor=0;setVisible('');const timer=setInterval(()=>{cursor+=1;setVisible(message.slice(0,cursor));if(cursor>=message.length)clearInterval(timer);},48);return()=>clearInterval(timer);},[message]);
  const finished=visible.length>=message.length&&index===lines.length-1;
  const advance=()=>{if(visible.length<message.length){setVisible(message);return;}if(index===lines.length-1){onComplete?.();return;}setVisible('');setIndex(current=>current+1);};
  return <div className={`shop-dialogue ${speaker==='PROTAGONISTA'?'hero-speaking':''}`}><button className="dialogue-close" onClick={onDismiss} aria-label="Cerrar conversación">×</button><div className="dialogue-speaker"><span>{speaker}</span><i>{index+1}/{lines.length}</i></div><p aria-live="polite">{visible}<span className="dialogue-cursor" aria-hidden="true">▌</span></p><button onClick={advance}>{visible.length<message.length?'MOSTRAR TODO':finished?'SALIR AL MAPA →':'SIGUIENTE →'}</button></div>;
}

export default function AdventureHub({view='map',levels,user}){
  const [progress,setProgress]=useState(()=>read(PROGRESS_KEY,{})),[shop,setShop]=useState(()=>read(SHOP_KEY,{owned:[],equipped:[]})),[shopDialogueDone,setShopDialogueDone]=useState(()=>read(SHOP_DIALOGUE_DONE_KEY,false));
  const [showRanking,setShowRanking]=useState(false);
  const [showFinalReward,setShowFinalReward]=useState(false);
  const pilotPrompted=useRef(false);
  const [showShopDialogue,setShowShopDialogue]=useState(()=>!shopDialogueDone),[dialogueRound,setDialogueRound]=useState(0);
  const previewFinal=new URLSearchParams(location.search).get('previewFinal')==='1';
  const [pilotAccess,setPilotAccess]=useState(()=>previewFinal||hasPilotAccess()),[showPilotGate,setShowPilotGate]=useState(false),[logicLocked,setLogicLocked]=useState(()=>requiresLogicRecovery());
  const crystals=Object.values(progress).reduce((sum,item)=>sum+(item?.crystal||0),0),stars=Object.values(progress).reduce((sum,item)=>sum+(item?.stars||0),0);
  const progressPercent=completionPercent(progress,levels.length);
  const balance=crystals;
  const completed=useMemo(()=>{const playable=new Set(levels.map(level=>level.id)),saved=Object.keys(progress).filter(id=>playable.has(Number(id))&&(progress[id]?.complete||progress[id]?.crystal)).map(Number);return new Set(previewFinal?levels.filter(level=>level.id!==68).map(level=>level.id):saved);},[progress,previewFinal,levels]);
  const allLevelsComplete=levels.every(level=>completed.has(level.id));
  const starterCompleted=STARTER_WORLD_ENDS.filter(id=>completed.has(id)).length,fourComplete=starterCompleted===STARTER_WORLD_ENDS.length;
  const [showMilestone,setShowMilestone]=useState(()=>view==='map'&&fourComplete&&!previewFinal&&!read(STARTER_CELEBRATION_KEY,false));
  const worldId=Number(new URLSearchParams(location.search).get('world'))||1,selectedWorld=WORLDS.find(world=>world.id===worldId)||WORLDS[0];
  const completedInWorld=world=>world.levels.filter(id=>completed.has(id)).length;
  const worldUnlocked=world=>world.id<=4||fourComplete&&pilotAccess&&(!world.unlockAfter||completed.has(world.unlockAfter));
  const unlockedWorlds=WORLDS.filter(world=>worldUnlocked(world));
  const nextUnseenWorld=()=>{const seen=new Set(read(WORLD_DISCOVERY_KEY,[1,2,3,4]));return unlockedWorlds.find(world=>world.id>4&&!seen.has(world.id))?.id||null;};
  const [revealingWorldId,setRevealingWorldId]=useState(()=>view==='map'&&!previewFinal&&!showMilestone?nextUnseenWorld():null);
  const nextLevelId=selectedWorld.levels.find(id=>!completed.has(id));
  const visibleWorldLevels=selectedWorld.levels.filter(id=>completed.has(id)||id===nextLevelId);
  useEffect(()=>applyCosmetics(shop.equipped),[shop]);
  useEffect(()=>{const refresh=()=>setProgress(read(PROGRESS_KEY,{}));window.addEventListener('valle-progress-changed',refresh);return()=>window.removeEventListener('valle-progress-changed',refresh);},[]);
  useEffect(()=>{if(view!=='map'||!fourComplete||pilotAccess||showMilestone||pilotPrompted.current)return;pilotPrompted.current=true;setShowPilotGate(true);},[view,fourComplete,pilotAccess,showMilestone]);
  useEffect(()=>{if(!revealingWorldId)return;const timer=setTimeout(()=>{const seen=new Set(read(WORLD_DISCOVERY_KEY,[1,2,3,4]));seen.add(revealingWorldId);localStorage.setItem(WORLD_DISCOVERY_KEY,JSON.stringify([...seen]));setRevealingWorldId(null);},2800);return()=>clearTimeout(timer);},[revealingWorldId]);
  useEffect(()=>{document.title=`Valle Esmeralda · ${view==='shop'?'Tienda':view==='world'?selectedWorld.name:'Mapa de mundos'}`;},[view,selectedWorld.name]);
  const title=view==='shop'?'Tienda del Valle':view==='world'?selectedWorld.name:'Mapa de los mundos';
  const userName=user?.name||[user?.firstName,user?.lastName].filter(Boolean).join(' ')||'Explorador del Valle';
  const teacherAdvice=completed.size<5?'Prueba primero una sola modificación y observa cómo cambia el recorrido. Así descubrirás qué control necesitas.':completed.size<12?'Antes de responder, busca qué cambia y qué se mantiene. Esa comparación suele revelar la regla.':'En una función, cada entrada debe conducir a una salida. Comprueba tus puntos antes de lanzar.';
  const starterAdvice=fourComplete?'¡Has superado los cuatro mundos iniciales! Demostraste control y experimentación, razonamiento lógico, dominio de coordenadas y funciones, y orientación estratégica. El camino hacia la Fortaleza de los Enigmas ya está abierto.':`Puedes comenzar por cualquiera de los cuatro mundos iniciales. Has superado ${starterCompleted} de 4; completa los cuatro para abrir el camino hacia las regiones siguientes.`;
  const closeMilestone=()=>{localStorage.setItem(STARTER_CELEBRATION_KEY,'true');pilotPrompted.current=true;setShowMilestone(false);setRevealingWorldId(nextUnseenWorld());if(!pilotAccess)setShowPilotGate(true);};
  const finishShopDialogue=()=>{localStorage.setItem(SHOP_DIALOGUE_DONE_KEY,'true');setShopDialogueDone(true);setShowShopDialogue(false);location.href='?view=map';};
  const reopenShopDialogue=()=>{setDialogueRound(round=>round+1);setShowShopDialogue(true);};
  const unlockPilot=()=>{setPilotAccess(true);setShowPilotGate(false);setRevealingWorldId(5);};
  const renderShopItem=item=>{const finalReward=item.finalReward,available=finalReward&&allLevelsComplete;return <article className={`shop-item ${item.id}${item.academic?' academic-reward':''}${available?' reward-unlocked':''}`} key={item.id}><div className="item-preview"><span>{item.icon}</span></div><small>{finalReward?(available?'RECOMPENSA DESBLOQUEADA':'RECOMPENSA FINAL'):'PRÓXIMAMENTE'}</small><h2>{item.name}</h2><p>{item.description}</p><div className="future-price"><span>{finalReward?`${completed.size}/${levels.length}`:`${item.currency} ${item.cost}`}</span><em>{finalReward?(available?'TODOS LOS NIVELES COMPLETADOS':`FALTAN ${Math.max(0,levels.length-completed.size)} NIVELES`):'AÚN NO DISPONIBLE'}</em></div><button disabled={!available} onClick={()=>available&&setShowFinalReward(true)}>{finalReward?(available?'MOSTRAR RECOMPENSA AL PROFE →':`COMPLETA LOS ${levels.length} NIVELES`):'PRÓXIMAMENTE · NO DISPONIBLE'}</button></article>;};
  return <main className="adventure-hub"><header><a className="brand" href="?view=map"><span>VALLE</span> ESMERALDA<small>UNA AVENTURA POR DESCUBRIR</small></a><div className="chapter"><span>CENTRO DE LA AVENTURA</span><strong>{title}</strong></div><div className="inventory"><span>★ <b>{stars}</b></span><span>◆ <b>{balance}</b><small> disponibles</small></span></div><div className="hub-user-badge" title={userName}><small>JUGANDO COMO</small><strong>{userName}</strong>{user?.course&&<span>Curso {user.course}</span>}</div></header>
    <nav className="hub-tabs"><a className={view==='map'||view==='world'?'active':''} href="?view=map">⌖ {view==='shop'?'VOLVER AL MAPA':'MAPA DE MUNDOS'}</a><ScreenModeButton/>{!user?.isGuest&&<button className="sign-out-button" aria-label="Salir del juego y cerrar sesión" onClick={async()=>{await signOut();location.href='?';}}>SALIR</button>}</nav>
    {view==='map'&&<div className="map-scroll-viewport"><section className={`world-map-screen overworld-screen${showMilestone?' path-opening':''}`} aria-label="Mapa fantástico de los mundos"><img className="overworld-art" src="./art/world-map-clean.webp" alt="Archipiélago fantástico con mundos conectados"/><div className="map-progress" aria-label={`Progreso total: ${progressPercent}%`}><small>AVANCE TOTAL</small><strong>{progressPercent}%</strong><span>{completed.size} de {levels.length} niveles</span><i><b style={{width:`${progressPercent}%`}}/></i></div><MapRoutes completed={completed} fourComplete={fourComplete} pilotAccess={pilotAccess} opening={showMilestone} revealingWorldId={revealingWorldId}/>{!fourComplete&&<div className="starter-gate" aria-label={`Camino cerrado. ${starterCompleted} de 4 mundos iniciales superados.`}><span>◆</span><small>{starterCompleted}/4</small></div>}{fourComplete&&!pilotAccess&&<button className="pilot-map-lock" onClick={()=>setShowPilotGate(true)} aria-label="Ingresar código del docente para abrir la prueba piloto"><span>◆</span><strong>PRUEBA PILOTO</strong><small>Código del docente</small></button>}{unlockedWorlds.map(world=><a href={`?view=world&world=${world.id}`} aria-label={`${world.name}. ${completedInWorld(world)} de ${world.levels.length} niveles completados. Toca para entrar.`} className={`map-location world-${world.id}${world.id<=4?' starter-world':''}${world.id===12?' final-world':''}${revealingWorldId===world.id?' world-revealing':''}`} style={world.position} key={world.id}><span className="location-pulse">◆</span>{world.id===12&&<em className="final-world-badge">MUNDO FINAL</em>}<strong>{world.name}</strong><small>{completedInWorld(world)} / {world.levels.length} completados · TOCA PARA ENTRAR</small></a>)}<div aria-label="Tienda del Valle. Llega con el protagonista para entrar." className="map-location map-store"><span className="location-pulse">◆</span><strong>Tienda del Valle</strong><small>Objetos y mejoras</small></div><MapTraveler completed={completed} fourComplete={fourComplete} pilotAccess={pilotAccess} previewFinal={previewFinal}/>{showMilestone&&<div className="starter-milestone" role="dialog" aria-modal="true" aria-labelledby="starter-win-title"><div className="milestone-rays"/><img src="./art/profe-dani-shop-v7.png" alt="Profe Dani B felicitando al protagonista"/><div><small>LOS CUATRO CAMINOS COMPLETADOS</small><h2 id="starter-win-title">¡El sendero se ha abierto!</h2><p>Hasta este momento has demostrado cuatro capacidades:</p><ol><li>Control y experimentación.</li><li>Razonamiento lógico.</li><li>Coordenadas y funciones.</li><li>Orientación y estrategia.</li></ol><strong>El portal de la prueba piloto ya puede activarse.</strong><button onClick={closeMilestone}>INGRESAR CÓDIGO →</button></div></div>}{showPilotGate&&<PilotAccessGate embedded onUnlocked={unlockPilot} onClose={()=>setShowPilotGate(false)}/>}</section></div>}
    {view==='world'&&(selectedWorld.id>4&&!pilotAccess?<PilotAccessGate onUnlocked={unlockPilot}/>:<section className="world-detail" style={{'--world-image':`url(${selectedWorld.image})`}}><div className="world-detail-copy"><a href="?view=map">← Volver al mapa</a><span>MUNDO {selectedWorld.id}</span><h1>{selectedWorld.name}</h1><p>{selectedWorld.subtitle}</p><strong>{completedInWorld(selectedWorld)} de {selectedWorld.levels.length} niveles completados</strong></div><div className="world-level-route">{visibleWorldLevels.map((id,index)=>{const info=levels.find(level=>level.id===id),isNext=id===nextLevelId;return <a href={`?level=${id}`} className={`${completed.has(id)?'complete':''}${isNext?' current':''}`} key={id}><i>{completed.has(id)?'★':'◆'}</i><b>{isNext?'Siguiente misión':`Nivel ${id}`}</b><span>{info?.name}</span>{index<visibleWorldLevels.length-1&&<em>→</em>}</a>})}</div><div className="world-detail-tip">La ruta revela un nuevo nivel cada vez que completas una misión.</div>{selectedWorld.id===2&&logicLocked&&<MemoryRecoveryGate onRecovered={()=>setLogicLocked(false)}/>}</section>)}
    {view==='shop'&&<section className="shop-screen scene-shop"><div className="shop-scene"><img src="./art/profe-dani-shop-v7.png" alt="Profe Dani B atendiendo su tienda detrás de un mostrador de madera"/><img className="shop-visiting-hero" src="./art/hero-dodge.webp" alt="El protagonista entrando a la tienda"/><div className="shop-scene-title"><small>TALLER Y TIENDA</small><strong>Profe Dani B</strong></div><div className="shop-user-card"><small>EXPLORADOR ACTUAL</small><strong>{userName}</strong>{user?.course&&<span>Curso {user.course}</span>}</div><div className="shop-scene-wallet"><small>TU BOLSA</small><strong>◆ {balance}</strong></div><div className="shop-scene-actions"><button className="shop-talk-button" onClick={reopenShopDialogue} disabled={showShopDialogue}><span>💬</span> {showShopDialogue?'CONVERSANDO':'HABLAR CON DANI B'}</button><button className="shop-ranking-button" disabled={user?.isGuest} onClick={()=>!user?.isGuest&&setShowRanking(true)}><span>🏆</span> {user?.isGuest?'RANKING PAUSADO':'RANKING'}</button></div><div className={`shop-starter-progress${fourComplete?' complete':''}`}><small>CUATRO CAMINOS</small><strong>{starterCompleted}/4</strong></div>{showShopDialogue&&<ShopDialogue key={dialogueRound} lines={[{speaker:'PROFE DANI B',text:starterAdvice},{speaker:'PROTAGONISTA',text:'Entonces puedo elegir por dónde comenzar, pero debo superar los cuatro caminos para continuar.'},{speaker:'PROFE DANI B',text:'Exactamente. Cada mundo entrena una capacidad diferente y todas serán necesarias más adelante.'},{speaker:'PROFE DANI B',text:teacherAdvice},{speaker:'PROFE DANI B',text:'Las mejoras de esta tienda pueden acompañarte, pero el verdadero avance lo consigues resolviendo los desafíos.'}]} onComplete={finishShopDialogue} onDismiss={()=>setShowShopDialogue(false)}/>}</div><header className="shop-catalog-title"><small>RECOMPENSAS DEL VALLE</small><h1>Canjea lo que conquistes en el Valle</h1><p>Los objetos y bonificaciones futuras continúan en preparación. La recompensa académica final se habilita al completar todos los niveles.</p></header><div className="shop-grid">{ITEMS.map(renderShopItem)}</div><p className="shop-note">La nota adicional de 5,0 requiere completar los {levels.length} niveles y presentarle la recompensa desbloqueada al docente.</p>{showFinalReward&&<div className="reward-proof-backdrop"><section className="reward-proof" role="dialog" aria-modal="true" aria-labelledby="reward-proof-title"><span>🏅</span><small>VALLE ESMERALDA · LOGRO FINAL</small><h2 id="reward-proof-title">¡Un 5,0 adicional desbloqueado!</h2><p><strong>{user?.name||'Estudiante'}</strong>{user?.course&&<> · Curso {user.course}</>}</p><p>Completó los {levels.length} niveles propuestos y obtuvo una nota adicional de <strong>5,0</strong> para el periodo actual.</p><button onClick={()=>setShowFinalReward(false)}>CERRAR</button></section></div>}{showRanking&&<StudentLeaderboard user={user} totalLevels={levels.length} onClose={()=>setShowRanking(false)}/>}</section>}
  </main>;
}

