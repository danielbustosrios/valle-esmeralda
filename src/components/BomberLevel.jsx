import React,{useEffect,useRef,useState} from 'react';
import HubLinks from './HubLinks.jsx';
import {recordGameError} from '../game/progressTracking.js';

const W=13,H=9,START={x:1,y:1},EXIT={x:11,y:7};
const cellId=(x,y)=>`${x},${y}`;
const isSolid=(x,y)=>x===0||y===0||x===W-1||y===H-1||(x%2===0&&y%2===0);
const rows=(...values)=>values;
const LEVEL_CONFIGS={
 52:{key:{x:9,y:1},crystal:{x:5,y:3},plates:[{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:9,y:4},{id:'b',x:3,y:6}],bricks:rows([3,1],[5,1],[7,1],[9,1],[3,3],[5,3],[7,3],[9,3],[11,3],[1,5],[3,5],[5,5],[7,5],[9,5],[11,5],[3,7],[5,7],[7,7]),blastRange:2,fuse:1700,enemySpeed:680},
 53:{key:{x:7,y:1},crystal:{x:11,y:3},plates:[{x:5,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:5,y:4},{id:'b',x:9,y:2}],bricks:rows([3,1],[5,1],[7,1],[9,1],[3,3],[5,3],[7,3],[9,3],[11,3],[1,5],[3,5],[5,5],[7,5],[9,5],[11,5],[3,7],[5,7]),blastRange:2,fuse:1600,enemySpeed:610},
 54:{key:{x:7,y:1},crystal:{x:3,y:7},plates:[{x:5,y:6},{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:5,y:4},{id:'b',x:9,y:4}],bricks:rows([3,1],[5,1],[7,1],[9,1],[3,3],[5,3],[7,3],[9,3],[11,3],[1,5],[3,5],[5,5],[7,5],[9,5],[11,5],[3,7],[5,7],[7,7]),blastRange:2,fuse:1500,enemySpeed:540},
 55:{key:{x:11,y:3},crystal:{x:3,y:5},plates:[{x:7,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:7,y:4},{id:'b',x:3,y:2},{id:'c',x:9,y:2}],bricks:rows([3,1],[5,1],[7,1],[9,1],[3,3],[5,3],[7,3],[9,3],[11,3],[3,5],[5,5],[7,5],[9,5],[11,5],[3,7],[5,7],[7,7],[9,7]),blastRange:3,fuse:1350,enemySpeed:450},
 56:{key:{x:9,y:1},crystal:{x:7,y:7},plates:[{x:5,y:6},{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:5,y:4},{id:'b',x:9,y:4},{id:'c',x:3,y:6}],bricks:rows([3,1],[5,1],[7,1],[9,1],[3,3],[5,3],[7,3],[9,3],[11,3],[3,5],[5,5],[7,5],[9,5],[11,5],[3,7],[5,7],[7,7],[9,7]),blastRange:3,fuse:1150,enemySpeed:360},
 57:{key:{x:11,y:3},crystal:{x:5,y:7},plates:[{x:3,y:6},{x:7,y:6},{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:3,y:4},{id:'b',x:7,y:4},{id:'c',x:9,y:4}],bricks:rows([3,1],[5,1],[7,1],[9,1],[3,3],[5,3],[7,3],[9,3],[11,3],[3,5],[5,5],[7,5],[9,5],[11,5],[5,7],[7,7],[9,7]),blastRange:3,fuse:1250,enemySpeed:320},
 58:{key:{x:11,y:3},crystal:{x:5,y:7},plates:[{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:3,y:3},{id:'b',x:9,y:4}],kineticWalls:[[7,3],[9,5]],bricks:rows([3,1],[5,1],[7,1],[9,1],[11,3],[3,5],[5,5],[7,5],[11,5],[5,7],[7,7],[9,7]),blastRange:3,fuse:1250,enemySpeed:300,slideKick:true},
 59:{key:{x:11,y:3},crystal:{x:3,y:7},plates:[{x:5,y:6},{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:3,y:3},{id:'b',x:5,y:4},{id:'c',x:9,y:4}],kineticWalls:[[7,3],[5,5],[9,5]],bricks:rows([3,1],[5,1],[7,1],[9,1],[11,3],[3,5],[7,5],[11,5],[3,7],[5,7],[7,7],[9,7]),blastRange:3,fuse:1200,enemySpeed:270,slideKick:true},
 60:{key:{x:11,y:3},crystal:{x:5,y:7},plates:[{x:3,y:6},{x:7,y:6},{x:9,y:6}],gates:[{x:11,y:6}],metals:[{id:'a',x:3,y:3},{id:'b',x:3,y:4},{id:'c',x:7,y:4},{id:'d',x:9,y:4}],kineticWalls:[[7,3],[3,5],[7,5],[9,5]],bricks:rows([3,1],[5,1],[7,1],[9,1],[11,3],[5,5],[11,5],[5,7],[7,7],[9,7]),blastRange:3,fuse:1100,enemySpeed:230,slideKick:true,final:true}
};

export default function BomberLevel({level,onNext}){
 const cfg=LEVEL_CONFIGS[level.id]||LEVEL_CONFIGS[52],KEY=cfg.key,CRYSTAL=cfg.crystal;
 const blockCount=cfg.plates.length===1?'un bloque':cfg.plates.length===2?'dos bloques':'tres bloques';
 const initialMessage=cfg.slideKick?'Patea los bloques para lanzarlos y derribar las paredes agrietadas.':`Abre espacio y lleva ${blockCount} hasta ${cfg.plates.length===1?'la placa':'las placas'} doradas.`;
 const [player,setPlayer]=useState(START),playerRef=useRef(START);
 const [facing,setFacing]=useState(1),[bricks,setBricks]=useState(()=>new Set(cfg.bricks.map(([x,y])=>cellId(x,y))));
 const [bomb,setBomb]=useState(null),[flames,setFlames]=useState(new Set()),[hasKey,setHasKey]=useState(false);
 const [metals,setMetals]=useState(cfg.metals),metalRef=useRef(cfg.metals);
 const [kineticWalls,setKineticWalls]=useState(()=>new Set((cfg.kineticWalls||[]).map(([x,y])=>cellId(x,y)))),wallRef=useRef(kineticWalls);
 const [crystalCollected,setCrystalCollected]=useState(false),[kicking,setKicking]=useState(false);
 const [flyingMetal,setFlyingMetal]=useState(null),flyingRef=useRef(null),[kickImpact,setKickImpact]=useState(null);
 const [hint,setHint]=useState('');
 const [hearts,setHearts]=useState(1),[status,setStatus]=useState('play'),[message,setMessage]=useState(initialMessage);
 const [enemy,setEnemy]=useState({x:11,y:1,dir:1}),brickRef=useRef(bricks),bombRef=useRef(null);
 useEffect(()=>{brickRef.current=bricks},[bricks]);
 useEffect(()=>{metalRef.current=metals},[metals]);
 useEffect(()=>{wallRef.current=kineticWalls},[kineticWalls]);
 useEffect(()=>{playerRef.current=player},[player]);
 const plateFilled=plate=>metalRef.current.some(item=>item.x===plate.x&&item.y===plate.y);
 const plateIsActive=()=>cfg.plates.every(plateFilled);
 const isGate=(x,y)=>cfg.gates.some(gate=>gate.x===x&&gate.y===y);
 const isPlate=(x,y)=>cfg.plates.some(plate=>plate.x===x&&plate.y===y);
 const metalAt=(x,y)=>metalRef.current.find(item=>item.x===x&&item.y===y);
 const blocked=(x,y,ignoreMetal=false)=>isSolid(x,y)||brickRef.current.has(cellId(x,y))||wallRef.current.has(cellId(x,y))||(bombRef.current&&bombRef.current.x===x&&bombRef.current.y===y)||(!plateIsActive()&&isGate(x,y))||(!ignoreMetal&&Boolean(metalAt(x,y)));

 function save(){try{const key='valle-esmeralda-logic-progress',progress=JSON.parse(localStorage.getItem(key)||'{}');localStorage.setItem(key,JSON.stringify({...progress,[level.id]:{stars:3,crystal:crystalCollected?1:0,complete:true}}));}catch{}}
 function hurt(){recordGameError(level.id);setHearts(value=>{const next=value-1;if(next<=0)setStatus('lost');else{setPlayer(START);setMessage('¡Ay! Busca una ruta segura antes de acercarte.');}return Math.max(0,next);});}
 function move(dx,dy){
  if(status!=='play'||flyingRef.current)return;
  if(dx)setFacing(dx);
  const next={x:playerRef.current.x+dx,y:playerRef.current.y+dy};
  const metal=metalAt(next.x,next.y);
  if(metal){
   let beyond={x:next.x+dx,y:next.y+dy},impactWall=null;
   if(cfg.slideKick){
    let landing={...metal},probe={...beyond};
    while(true){
     const probeKey=cellId(probe.x,probe.y);
     if(wallRef.current.has(probeKey)){impactWall={...probe};break;}
     if(blocked(probe.x,probe.y))break;
     landing={...probe};
     if(isPlate(landing.x,landing.y))break;
     probe={x:probe.x+dx,y:probe.y+dy};
    }
    beyond=landing;
    if(beyond.x===metal.x&&beyond.y===metal.y&&!impactWall){setMessage('No hay impulso en esa dirección. Busca una línea libre.');return;}
   }else if(blocked(beyond.x,beyond.y)){
    setMessage('Ese bloque está atrapado. Rodéalo y patéalo desde otro lado.');
    return;
   }
   const moved=metalRef.current.map(item=>item.id===metal.id?{...item,...beyond}:item);
   metalRef.current=moved;setMetals(moved);setKicking(true);
   const kickTime=cfg.slideKick?650:420;flyingRef.current=metal.id;setFlyingMetal(metal.id);
   if(impactWall){
    const impactKey=cellId(impactWall.x,impactWall.y),remaining=new Set([...wallRef.current].filter(key=>key!==impactKey));
    wallRef.current=remaining;setKineticWalls(remaining);setKickImpact(impactWall);
    setTimeout(()=>setKickImpact(null),700);
   }
   setTimeout(()=>{setKicking(false);setFlyingMetal(null);flyingRef.current=null;},kickTime);
   const filledAfter=cfg.plates.filter(plate=>moved.some(item=>item.x===plate.x&&item.y===plate.y)).length;
   const fillsLastPlate=isPlate(beyond.x,beyond.y)&&filledAfter===cfg.plates.length;
   setMessage(impactWall?'¡PUM! El bloque volador derribó una pared agrietada.':fillsLastPlate?'¡Bien pensado! Todas las placas están activas y la barrera se abrió.':isPlate(beyond.x,beyond.y)?`¡${filledAfter}/${cfg.plates.length} placas activadas! Todavía falta peso.`:cfg.slideKick?'¡Patada larga! El bloque se deslizó hasta encontrar un obstáculo.':'¡Patada! El bloque metálico resiste las bombas; colócalo sobre una placa.');
  }else if(blocked(next.x,next.y)){
   if(isGate(next.x,next.y))setMessage(`La barrera necesita ${cfg.plates.length===1?'un peso':'todos los pesos'} sobre las placas doradas.`);
   return;
  }
  setPlayer(next);playerRef.current=next;
  const foundKey=cellId(next.x,next.y)===cellId(KEY.x,KEY.y)&&!brickRef.current.has(cellId(KEY.x,KEY.y));
  if(foundKey){setHasKey(true);setMessage('¡Llave encontrada! Falta abrir la barrera con un bloque.');}
  const foundCrystal=cellId(next.x,next.y)===cellId(CRYSTAL.x,CRYSTAL.y)&&!brickRef.current.has(cellId(CRYSTAL.x,CRYSTAL.y));
  if(foundCrystal&&!crystalCollected){setCrystalCollected(true);setMessage('¡Cristal secreto encontrado! La exploración tuvo premio.');}
  if(enemy&&next.x===enemy.x&&next.y===enemy.y)hurt();
  if(next.x===EXIT.x&&next.y===EXIT.y&&(hasKey||foundKey)&&plateIsActive()){setStatus('won');save();}
 }

 function detonate(placed){
  const blast=new Set([cellId(placed.x,placed.y)]),destroyed=new Set();
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   for(let step=1;step<=cfg.blastRange;step++){
    const x=placed.x+dx*step,y=placed.y+dy*step,key=cellId(x,y);
    if(isSolid(x,y))break;
    blast.add(key);
    if(metalAt(x,y)||wallRef.current.has(key)||(!plateIsActive()&&isGate(x,y)))break;
    if(brickRef.current.has(key)){destroyed.add(key);break;}
   }
  }
  setBricks(current=>new Set([...current].filter(key=>!destroyed.has(key))));
  setBomb(null);bombRef.current=null;setFlames(blast);
  setMessage(destroyed.size?'La explosión abrió un tramo. El metal quedó intacto.':'La explosión no alcanzó ningún ladrillo.');
  if(blast.has(cellId(playerRef.current.x,playerRef.current.y)))hurt();
  if(enemy&&blast.has(cellId(enemy.x,enemy.y))){setEnemy(null);setMessage('¡Bien pensado! La explosión alcanzó al guardián.');}
  setTimeout(()=>setFlames(new Set()),520);
 }

 function placeBomb(){
  if(status!=='play'||bombRef.current)return;
  const placed={...playerRef.current};bombRef.current=placed;setBomb(placed);
  setMessage('¡Bomba colocada! Sal de la cruz antes de que explote.');
  setTimeout(()=>detonate(placed),cfg.fuse);
 }

 function showHint(){
  if(cfg.slideKick&&kineticWalls.size){setHint('Alinéate con el bloque y la pared agrietada. Una patada lo lanza por toda la fila o columna.');return;}
  const waiting=metalRef.current.find(item=>cfg.plates.some(plate=>plate.x===item.x)&&item.y<6);
  if(waiting&&waiting.y===4&&brickRef.current.has(cellId(waiting.x,5)))setHint('Abre primero el ladrillo marrón que está debajo de uno de los bloques metálicos.');
  else if(!plateIsActive())setHint('Busca una placa vacía. Rodéala, colócate encima del bloque de su columna y pulsa ↓.');
  else if(!hasKey)setHint('La barrera ya puede abrirse. La llave está escondida en un ladrillo de la fila superior.');
  else setHint('Con la placa encendida y la llave recogida, entra al portal de la esquina inferior derecha.');
 }

 useEffect(()=>{
  const onKey=event=>{
   const commands={ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1]};
   const command=commands[event.key]||commands[event.key.toLowerCase()];
   if(command){event.preventDefault();move(...command);}
   if(event.key===' '||event.key==='Enter'){event.preventDefault();placeBomb();}
  };
  window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
 });

 useEffect(()=>{
  if(!enemy||status!=='play')return;
  const timer=setInterval(()=>setEnemy(current=>{
   if(!current)return null;
   let x=current.x+current.dir,dir=current.dir;
   if(blocked(x,current.y)){dir*=-1;x=current.x+dir;if(blocked(x,current.y))x=current.x;}
   return {...current,x,dir};
  }),cfg.enemySpeed);
  return()=>clearInterval(timer);
 },[enemy===null,status]);

 useEffect(()=>{if(enemy&&enemy.x===player.x&&enemy.y===player.y)hurt();},[enemy?.x,enemy?.y,player.x,player.y]);

 const cells=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)cells.push({x,y,key:cellId(x,y)});
 const pos=(x,y)=>({'--x':x,'--y':y});
 const activePlate=cfg.plates.every(plate=>metals.some(item=>item.x===plate.x&&item.y===plate.y));
 const openedBelow=cfg.slideKick?kineticWalls.size===0:cfg.metals.filter(item=>item.y===4).every(item=>!bricks.has(cellId(item.x,5)));
 return <main className={`bomber-page bomber-variant-${level.id}`}><header><a className="brand" href="?view=map"><span>VALLE</span> ESMERALDA<small>UNA AVENTURA POR DESCUBRIR</small></a><div className="chapter"><span>CAPÍTULO 10 · MISIÓN {level.id-51}/9</span><strong>{level.name}</strong></div><div className="inventory"><span>◆ <b>{hasKey?1:0}</b><small>/ 1 llave</small></span><span>◇ <b>{crystalCollected?1:0}</b><small>/ 1 cristal</small></span><span className="energy">{Array.from({length:1},(_,i)=>i<hearts?'♥':'♡').join(' ')}</span></div><HubLinks/></header>
  <section className="bomber-game"><div className="bomber-stage"><img src="./art/bomb-ruins.webp" alt="Patio fantástico de las Ruinas de la Pólvora"/><div className="bomb-board">{cells.map(cell=>isSolid(cell.x,cell.y)?<div className={`solid-block stone-${(cell.x+cell.y)%3}`} style={pos(cell.x,cell.y)} key={cell.key}/>:bricks.has(cell.key)?<div className={`breakable-brick brick-${(cell.x*2+cell.y)%3}`} style={pos(cell.x,cell.y)} key={cell.key}><i/><i/><i/></div>:null)}
   {cfg.plates.map((plate,index)=>{const filled=metals.some(item=>item.x===plate.x&&item.y===plate.y);return <div className={`pressure-plate ${filled?'active':''}`} style={pos(plate.x,plate.y)} key={`plate-${index}`}><span>{filled?'✦':'⌾'}</span></div>})}
   {cfg.gates.map((gate,index)=><div className={`energy-gate ${activePlate?'open':''}`} style={pos(gate.x,gate.y)} key={`gate-${index}`}><i/><i/><i/></div>)}
   {[...kineticWalls].map(key=>{const [x,y]=key.split(',').map(Number);return <div className="kinetic-wall" style={pos(x,y)} key={key}><i/><span>✹</span></div>})}
   {metals.map(item=><div className={`metal-block metal-${item.id}${flyingMetal===item.id?' flying':''}`} style={pos(item.x,item.y)} key={item.id}><span>✣</span></div>)}
   {kickImpact&&<div className="kick-impact" style={pos(kickImpact.x,kickImpact.y)}><b>¡PUM!</b><i>✦</i></div>}
   {!bricks.has(cellId(KEY.x,KEY.y))&&!hasKey&&<div className="hidden-key" style={pos(KEY.x,KEY.y)}>◆</div>}
   {!bricks.has(cellId(CRYSTAL.x,CRYSTAL.y))&&!crystalCollected&&<div className="secret-crystal" style={pos(CRYSTAL.x,CRYSTAL.y)}>♦</div>}
   <div className={`bomb-exit ${hasKey&&activePlate?'open':''}`} style={pos(EXIT.x,EXIT.y)}><span>{hasKey&&activePlate?'✦':'🔒'}</span></div>
   {bomb&&<div className="placed-bomb" style={pos(bomb.x,bomb.y)}><i/></div>}
   {[...flames].map(key=>{const [x,y]=key.split(',').map(Number);return <div className="blast-cell" style={pos(x,y)} key={key}>✦</div>})}
   {enemy&&<div className="bomb-enemy" style={pos(enemy.x,enemy.y)}>☠</div>}
   <div className={`bomb-hero ${kicking?'kicking':''}`} style={{...pos(player.x,player.y),'--face':facing}}><img src={status==='lost'?'./art/hero-hurt.webp':'./art/hero-dodge.webp'} alt="Protagonista"/></div>
  </div></div><div className="bomb-message"><strong>{activePlate?(hasKey?'RUTA COMPLETA':'BARRERA ABIERTA'):cfg.plates.length===1?'ACTIVA LA PLACA':'ACTIVA LAS PLACAS'}</strong><span>{message}</span></div>
  <div className="bomb-steps"><span className={openedBelow?'done':''}><b>1</b> {cfg.slideKick?'Derriba las paredes':'Abre debajo del metal'}</span><span className={activePlate?'done':''}><b>2</b> Activa {cfg.plates.length===1?'la placa':'las placas'}</span><span className={hasKey?'done':''}><b>3</b> Encuentra la llave</span><span className={crystalCollected?'done bonus':''}><b>◆</b> Cristal secreto</span></div>
  {hint&&<div className="bomb-hint"><b>PISTA</b><span>{hint}</span></div>}
  <div className="bomb-controls"><div className="bomb-pad"><button onPointerDown={()=>move(0,-1)}>▲</button><button onPointerDown={()=>move(-1,0)}>◀</button><button onPointerDown={()=>move(0,1)}>▼</button><button onPointerDown={()=>move(1,0)}>▶</button></div><button className="bomb-button" onClick={placeBomb} disabled={Boolean(bomb)||status!=='play'}><i/> PONER BOMBA</button><div className="bomb-rule"><b>{cfg.slideKick?'PATADA VOLADORA':cfg.final?'DESAFÍO FINAL':'ROMPE, RODEA Y PATEA'}</b><small>{cfg.slideKick?'Las bombas no rompen las paredes agrietadas: golpéalas con un bloque.':`Explosión de ${cfg.blastRange} casillas · ${cfg.plates.length} ${cfg.plates.length===1?'placa':'placas'} para abrir.`}</small></div></div>
  <div className="bomb-help"><button onClick={showHint}>💡 VER PISTA</button><button onClick={()=>location.reload()}>↻ REINICIAR TABLERO</button></div>
  {status==='won'&&<div className="victory"><div className="win-star">★★★</div><small>{cfg.final?'MUNDO COMPLETADO':'RUTA ABIERTA'}</small><h1>{cfg.final?'¡Dominaste el núcleo!':'¡Escapaste de la cámara!'}</h1><p>{cfg.final?'Las Ruinas de la Pólvora han quedado bajo control.':crystalCollected?'También encontraste el cristal secreto.':'Abriste el portal, pero quedó un cristal secreto por encontrar.'}</p><button onClick={onNext}>{cfg.final?'Volver al mapa':'Siguiente misión →'}</button></div>}{status==='lost'&&<div className="victory defeat"><div className="win-star">♡</div><small>ÚNICA VIDA PERDIDA</small><h1>La ruta te encerró</h1><p>Un solo golpe termina el intento. Deja una salida antes de colocar la bomba.</p><button onClick={()=>location.reload()}>Reintentar ↻</button></div>}
  </section><footer><div className="guide-icon">✦</div><p>Encuentra la llave, descubre el cristal y usa {cfg.plates.length===1?'un bloque':'los bloques'} para mantener abierta la barrera.</p><span>Flechas/WASD · Espacio: bomba</span></footer></main>;
}

