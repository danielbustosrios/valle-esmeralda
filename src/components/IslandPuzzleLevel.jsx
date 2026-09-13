import React,{useEffect,useRef,useState} from 'react';
import HubLinks from './HubLinks.jsx';
import {recordGameError} from '../game/progressTracking.js';

import {CONFIGS,W,H,kickResult} from '../game/island.js';
const key=(x,y)=>`${x},${y}`;
const pos=(x,y)=>({'--x':x,'--y':y});

export default function IslandPuzzleLevel({level,onNext}){
  const cfg=CONFIGS[level.id]||CONFIGS[61],START=cfg.start,GATE=cfg.gate,CRYSTAL=cfg.crystal,PLATES=cfg.plates,SOLIDS=cfg.solids;
  const [player,setPlayer]=useState(START),playerRef=useRef(START);
  const [facing,setFacing]=useState({x:1,y:0}),[rocks,setRocks]=useState(cfg.objects),rocksRef=useRef(cfg.objects);
  const [status,setStatus]=useState('play'),[message,setMessage]=useState(cfg.advancedSequence?'Tres bloques comparten dos corredores. Libera cada cruce antes de introducir el siguiente bloque.':cfg.logicSequence?'Los dos bloques se pueden mover. Observa el pasillo: ocupar la entrada demasiado pronto puede dejarte sin espacio.':cfg.crate?'Las cajas avanzan una casilla por patada; las piedras continúan rodando.':'Explora la playa y guía los objetos hasta los discos dorados.');
  const [kicking,setKicking]=useState(false),[impact,setImpact]=useState(null);
  const [walking,setWalking]=useState(false),[stepFrame,setStepFrame]=useState(0),walkTimer=useRef(null),actions=useRef({}),timers=useRef(new Set());
  function later(fn,ms){const id=setTimeout(()=>{timers.current.delete(id);fn();},ms);timers.current.add(id);return id;}
  const [enemy,setEnemy]=useState(cfg.enemy?{x:6,y:6,dir:1}:null),[hearts,setHearts]=useState(cfg.enemy?2:0),[timeLeft,setTimeLeft]=useState(cfg.time||0);
  const invulnerable=useRef(false);
  const [hurtView,setHurtView]=useState(false);
  const platesActive=PLATES.every(plate=>rocks.some(rock=>rock.x===plate.x&&rock.y===plate.y));
  const rockAt=(x,y)=>rocksRef.current.find(rock=>rock.x===x&&rock.y===y);
  const facingRock=rockAt(player.x+facing.x,player.y+facing.y);
  const blocked=(x,y)=>SOLIDS.has(key(x,y))||Boolean(rockAt(x,y))||(!platesActive&&x===GATE.x&&y===GATE.y);
  const save=()=>{try{const storageKey='valle-esmeralda-logic-progress',progress=JSON.parse(localStorage.getItem(storageKey)||'{}');localStorage.setItem(storageKey,JSON.stringify({...progress,[level.id]:{stars:3,crystal:1,complete:true}}));}catch{}};
  function hurt(){if(invulnerable.current||status!=='play')return;recordGameError(level.id);invulnerable.current=true;setHurtView(true);stopWalking();setHearts(value=>{const next=value-1;if(next<=0)setStatus('lost');return Math.max(0,next);});setPlayer(START);playerRef.current=START;setMessage('¡Ay! El centinela te alcanzó. Observa su recorrido antes de cruzar.');later(()=>{invulnerable.current=false;setHurtView(false);},900);}

  function move(dx,dy){
    if(status!=='play'||kicking||invulnerable.current)return false;
    setFacing({x:dx,y:dy});
    const next={x:playerRef.current.x+dx,y:playerRef.current.y+dy};
    if(rockAt(next.x,next.y)){setWalking(false);setMessage('Tienes un objeto delante. Pulsa PATEAR para moverlo.');return;}
    if(blocked(next.x,next.y)){setWalking(false);setMessage(next.x===GATE.x&&next.y===GATE.y?'La puerta necesita todos los discos encendidos.':'Ese camino está cubierto por muros y vegetación.');return;}
    setWalking(true);setStepFrame(frame=>frame?0:1);
    setPlayer(next);playerRef.current=next;
    if(enemy&&next.x===enemy.x&&next.y===enemy.y){hurt();return;}
    if(next.x===CRYSTAL.x&&next.y===CRYSTAL.y&&platesActive){setStatus('won');setMessage('¡El cristal escondido apareció detrás de la puerta!');save();}
  }

  function kick(){
    if(status!=='play'||kicking)return;
    const from=playerRef.current,target={x:from.x+facing.x,y:from.y+facing.y},rock=rockAt(target.x,target.y);
    if(!rock){setMessage('Acércate a una piedra y mira hacia ella antes de patear.');return;}
    const result=kickResult(cfg,rocksRef.current,rock.id,facing);
    if(!result.changed){setMessage('No hay espacio para mover el objeto por ese lado.');return;}
    stopWalking();
    const landing=result.landing,moved=result.objects;
    const landedIndex=PLATES.findIndex(plate=>plate.x===landing.x&&plate.y===landing.y);
    rocksRef.current=moved;setRocks(moved);setKicking(true);setImpact(landing);
    const lit=PLATES.filter(plate=>moved.some(item=>item.x===plate.x&&item.y===plate.y)).length;
setMessage(lit===PLATES.length?'¡Todos los mecanismos respondieron! La puerta de madera se abrió.':landedIndex>=0?`¡${lit}/${PLATES.length} discos activados! Busca la posición del siguiente objeto.`:rock.type==='metal'?'El bloque avanzó una casilla. Deja libre la posición desde la que necesitarás la próxima patada.':rock.type==='crate'?'La caja avanzó una casilla. Camina detrás de ella para volver a empujarla.':'La piedra rodó hasta el siguiente obstáculo. Tendrás que buscar otro ángulo.');
    later(()=>{setKicking(false);setImpact(null);},600);
  }

  function stopWalking(){clearInterval(walkTimer.current);walkTimer.current=null;setWalking(false);}
  function startWalking(dx,dy){
    if(status!=='play')return;
    stopWalking();move(dx,dy);
    walkTimer.current=setInterval(()=>actions.current.move(dx,dy),145);
  }

  useEffect(()=>{
    if(!cfg.enemy||status!=='play')return;
    const timer=setInterval(()=>setEnemy(current=>{if(!current)return null;let x=current.x+current.dir,dir=current.dir;if(x<4||x>14||SOLIDS.has(key(x,current.y))||rockAt(x,current.y)){dir*=-1;x=current.x+dir;}if(SOLIDS.has(key(x,current.y))||rockAt(x,current.y)||x<4||x>14)x=current.x;if(x===playerRef.current.x&&current.y===playerRef.current.y)later(()=>actions.current.hurt(),0);return {...current,x,dir};}),280);
    return()=>clearInterval(timer);
  },[cfg,status]);
  useEffect(()=>{if(!cfg.time||status!=='play')return;const timer=setInterval(()=>setTimeLeft(value=>{if(value<=1){setStatus('lost');setMessage('El gran tótem cerró la cámara. Revisa el orden y vuelve a intentarlo.');return 0;}return value-1;}),1000);return()=>clearInterval(timer);},[cfg.time,status]);

  useEffect(()=>{
    const commands={ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1]};
    const held=new Map();
    const clearHeld=()=>{held.clear();stopWalking();};
    const onKeyDown=event=>{const name=event.key.toLowerCase(),command=commands[event.key]||commands[name];if(command){event.preventDefault();if(!event.repeat){held.delete(name);held.set(name,command);actions.current.startWalking(...command);}}else if(event.key===' '||event.key==='Enter'){event.preventDefault();if(!event.repeat)actions.current.kick();}};
    const onKeyUp=event=>{const name=event.key.toLowerCase();if(!held.has(name))return;const wasActive=[...held.keys()].at(-1)===name;held.delete(name);if(wasActive){const next=[...held.values()].at(-1);if(next)actions.current.startWalking(...next);else stopWalking();}};
    window.addEventListener('blur',clearHeld);document.addEventListener('visibilitychange',clearHeld);window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);return()=>{window.removeEventListener('blur',clearHeld);document.removeEventListener('visibilitychange',clearHeld);window.removeEventListener('keydown',onKeyDown);window.removeEventListener('keyup',onKeyUp);clearInterval(walkTimer.current);for(const id of timers.current)clearTimeout(id);};
  },[]);

  actions.current={move,kick,hurt,startWalking};
  useEffect(()=>{if(status!=='play')stopWalking();},[status]);
  const cells=[],walkable=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(SOLIDS.has(key(x,y)))cells.push({x,y});else walkable.push({x,y});}
  return <main className={`island-page island-level-${level.id}`}><header><a className="brand" href="?view=map"><span>VALLE</span> ESMERALDA<small>UNA AVENTURA POR DESCUBRIR</small></a><div className="chapter"><span>ARCHIPIÉLAGO DEL INGENIO · MISIÓN {level.id-60}/7</span><strong>{level.name}</strong></div><div className="inventory"><span>★ <b>{status==='won'?3:0}</b><small>/ 3</small></span><span>◆ <b>{status==='won'?1:0}</b><small>/ 1</small></span>{cfg.enemy&&<span className="energy">{Array.from({length:2},(_,i)=>i<hearts?'♥':'♡').join(' ')}</span>}</div><HubLinks/></header>
    <section className="island-game"><div className="island-objective"><small>{cfg.time?`QUEDAN ${timeLeft} SEGUNDOS`:'TU MISIÓN'}</small><strong>{platesActive?'ENTRA Y RECLAMA EL CRISTAL':`ACTIVA LOS MECANISMOS · ${PLATES.filter(p=>rocks.some(r=>r.x===p.x&&r.y===p.y)).length}/${PLATES.length}`}</strong></div><div className="island-stage"><img src="./art/tropical-puzzle-room.webp" alt="Playa tropical fantástica con caminos de arena y muros cubiertos de vegetación"/><div className="island-board">
      {walkable.map(cell=><div aria-hidden="true" className={`island-step${player.x===cell.x&&player.y===cell.y?' current':''}`} style={pos(cell.x,cell.y)} key={`step-${key(cell.x,cell.y)}`}><i/></div>)}
      {cells.map(cell=><div className={`island-wall wall-${(cell.x+cell.y)%3}${cell.x===0||cell.x===W-1||cell.y===0||cell.y===H-1?' edge':''}`} style={pos(cell.x,cell.y)} key={key(cell.x,cell.y)}><i/></div>)}
      {PLATES.map((plate,index)=>{const active=rocks.some(rock=>rock.x===plate.x&&rock.y===plate.y);return <div className={`tide-plate ${active?'active':''}`} style={pos(plate.x,plate.y)} key={`plate-${index}`}><span>{active?'✓':'⌾'}</span></div>})}
      <div className={`island-gate ${platesActive?'open':''}`} style={pos(GATE.x,GATE.y)}><i/><i/><i/></div>
      {rocks.map(rock=><div className={`rolling-rock ${rock.type==='crate'?'island-crate':rock.type==='metal'?'island-metal':''} rock-${rock.id}${facingRock?.id===rock.id?' ready':''}`} style={{...pos(rock.x,rock.y),zIndex:facingRock?.id===rock.id?80:20+rock.y}} key={rock.id}><i/><b/></div>)}
      {enemy&&<div className="island-enemy" style={pos(enemy.x,enemy.y)}><span>🦀</span></div>}
      {impact&&<div className="island-impact" style={pos(impact.x,impact.y)}>✦</div>}
      {platesActive&&<div className="island-crystal" style={pos(CRYSTAL.x,CRYSTAL.y)}>♦</div>}
      <div className={`island-hero${hurtView?' hurt':''}${kicking?' kicking':''}${walking?' walking':''}${facing.y?' vertical':''}`} style={{...pos(player.x,player.y),'--face':facing.x<0?-1:1,'--stride':stepFrame?-1:1,zIndex:20+player.y}}><img src={facing.y<0?'./art/hero-walk-back.webp':facing.y>0?'./art/hero-walk-front.webp':`./art/hero-walk-side-${stepFrame+1}.webp`} alt="Protagonista"/></div>
    </div></div>
    <div className="island-message"><b>{platesActive?'PUERTA ABIERTA':cfg.advancedSequence?'LIBERA · CRUZA · COLOCA':cfg.logicSequence?'PIENSA EL ORDEN · ABRE EL CAMINO':'OBSERVA · RODEA · PATEA'}</b><span>{message}</span></div>
    <div className="island-controls"><div className="island-pad"><button onPointerDown={()=>startWalking(0,-1)} onPointerUp={stopWalking} onPointerLeave={stopWalking} onPointerCancel={stopWalking}>▲</button><button onPointerDown={()=>startWalking(-1,0)} onPointerUp={stopWalking} onPointerLeave={stopWalking} onPointerCancel={stopWalking}>◀</button><button onPointerDown={()=>startWalking(0,1)} onPointerUp={stopWalking} onPointerLeave={stopWalking} onPointerCancel={stopWalking}>▼</button><button onPointerDown={()=>startWalking(1,0)} onPointerUp={stopWalking} onPointerLeave={stopWalking} onPointerCancel={stopWalking}>▶</button></div><button className="island-kick" onClick={kick} disabled={status!=='play'||kicking}><span>➤</span> PATEAR</button><div className="island-rule"><b>{cfg.logicSequence?'LOS BLOQUES AVANZAN UNA CASILLA POR PATADA':cfg.crate?'LAS CAJAS AVANZAN PASO A PASO':'LAS PIEDRAS RUEDAN HASTA UN OBSTÁCULO'}</b><small>Mantén pulsada una flecha para caminar. {cfg.logicSequence?'El propio camino determina qué movimiento debe ocurrir primero.':cfg.crate?'Cada caja avanza una casilla por patada.':'Elige bien desde qué lado patear cada piedra.'}</small></div><button className="island-reset" onClick={()=>location.reload()}>↻ REINICIAR</button></div>
    {status==='won'&&<div className="victory"><div className="win-star">★★★</div><small>{cfg.final?'MUNDO COMPLETADO':'CÁMARA SUPERADA'}</small><h1>{cfg.final?'¡El gran tótem despertó!':'¡La isla abrió su secreto!'}</h1><p>Usaste la posición y la dirección de cada patada para resolver la cámara.</p><div className="rewards">★ 3 estrellas <span>◆ 1 cristal</span></div><button onClick={onNext}>{cfg.final?'Volver al mapa':'Siguiente misión →'}</button></div>}
    {status==='lost'&&<div className="victory defeat"><div className="win-star">♡</div><small>{timeLeft===0&&cfg.time?'SE ACABÓ EL TIEMPO':'EL CENTINELA TE ATRAPÓ'}</small><h1>La cámara se cerró</h1><p>Observa la ruta completa antes de mover el primer objeto.</p><button onClick={()=>location.reload()}>Reintentar ↻</button></div>}
    </section><footer><div className="guide-icon">✦</div><p>Guía cada objeto hasta un disco y recupera el cristal.</p><span>Flechas/WASD · Espacio: patear</span></footer></main>;
}

