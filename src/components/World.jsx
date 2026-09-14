import React from 'react';
import Water from './Water.jsx';
import {LEVEL,baseLevelId} from '../game/trajectory.js';
import {heroBodyX} from '../game/dodge.js';

const ROCK_SHAPES=[
  'M-51-16-35-43-7-58 24-51 48-27 58 3 42 34 15 54-18 50-46 29-59 2Z',
  'M-56-9-43-38-17-54 17-57 44-39 59-8 51 23 28 48-5 58-37 43-57 17Z',
  'M-49-27-20-55 14-58 45-42 57-12 48 20 24 49-10 55-42 37-59 4Z',
  'M-58-18-31-49 2-57 35-48 56-21 54 13 34 43 1 58-32 47-55 20Z'
];

// The art and simulation share the same 1200 x 800 coordinate space.
export default function World({level=LEVEL,points,projectile,won,hit,pending,defeated=[],barrelUsed=false,gateActive=false,shooting,missFeedback,paused,dodgeState={x:600,jump:0,rocks:[],invulnerable:0},onReactionEnd}) {
  const stage=baseLevelId(level);
  const previewPoints=level.hideTrajectory?[]:level.previewFraction?points.slice(0,Math.ceil(201*level.previewFraction)):points;
  const running=Math.abs(dodgeState.vx||0)>25,bob=dodgeState.jump?0:running?Math.sin(dodgeState.runCycle||0)*4:Math.sin((dodgeState.elapsed||0)*2.5)*1.4;
  const lean=Math.max(-7,Math.min(7,(dodgeState.vx||0)/58));
  const dodgeBodyX=heroBodyX(dodgeState);
  return <svg className="world" viewBox="0 0 1200 800" role="img" aria-label={level.boss?"Valle Esmeralda durante un derrumbe: el protagonista esquiva muchas rocas":"Valle Esmeralda: protagonista, cañón, ruinas, cascadas y objetivos"}>
    <defs><clipPath id="upper-cleared"><rect x="833" y="276" width="101" height="94" rx="8"/></clipPath><clipPath id="lower-cleared"><rect x="991" y="430" width="99" height="99"/></clipPath><clipPath id="barrel-cleared"><rect x="850" y="466" width="60" height="62"/></clipPath>
      <clipPath id="enemy-face"><ellipse cx="881" cy="319" rx="23" ry="18"/></clipPath>
      <clipPath id="hero-face"><ellipse cx="138" cy="411" rx="23" ry="20"/></clipPath>
      <clipPath id="collected-regions">
        <rect x="833" y="276" width="101" height="94" rx="8"/>
        <rect x="1071" y="255" width="87" height="84" rx="16"/>
      </clipPath>
      <filter id="projectile-glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="5"/></filter>
      <radialGradient id="rock-face" cx="31%" cy="24%" r="78%"><stop stopColor="#a18b72"/><stop offset=".32" stopColor="#756252"/><stop offset=".72" stopColor="#51433a"/><stop offset="1" stopColor="#2f2824"/></radialGradient>
      <filter id="rock-natural" x="-35%" y="-35%" width="170%" height="190%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="8" result="stoneNoise"/><feDisplacementMap in="SourceGraphic" in2="stoneNoise" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="stone"/><feDropShadow in="stone" dx="0" dy="11" stdDeviation="6" floodColor="#090705" floodOpacity=".78"/></filter>
    </defs>
    <image href={level.boss?"./art/dodge-arena.webp":stage>=4?"./art/workshop-no-cannon.webp":`./art/level-${stage}.webp`} width="1200" height="800"/>
    {!level.boss&&<Water paused={paused}/>} 
    {stage>=4&&!level.boss&&<g aria-hidden="true"><image href="./art/cannon-transparent.webp" x={level.origin.x-150} y={points[0].y-55} width="150" height="107" preserveAspectRatio="xMidYMid meet" data-testid="moving-cannon"/>{stage===4&&(hit||won)&&<circle cx={level.target.x} cy={level.target.y} r="38" fill="#a8ffc94d" stroke="#c7ffd7" strokeWidth="5"/>}</g>}
    {level.boss&&<g className={`dodge-scene ${paused?'is-paused':''}`}>
      {dodgeState.rocks.map(rock=>{const fallTime=Math.max(0,(575-rock.y)/Math.max(1,rock.vy)),landingX=Math.max(45,Math.min(1155,rock.x+rock.vx*fallTime));return <ellipse key={`shadow-${rock.id}`} className="rock-warning" cx={landingX} cy="574" rx={rock.r*.8} ry={Math.max(5,rock.r*.18)} opacity={Math.max(.13,Math.min(.72,(rock.y+180)/560))}/>})}
      {dodgeState.rocks.map(rock=><g key={rock.id} className="physics-rock" filter="url(#rock-natural)" transform={`translate(${rock.x} ${rock.y}) rotate(${rock.rotation}) scale(${rock.r/58})`}>
        <path d={ROCK_SHAPES[rock.variant||0]} fill="url(#rock-face)" stroke="#2d2723" strokeWidth="5" strokeLinejoin="round"/>
        <path d="M-34-30-9-45 16-43 1-24-23-18ZM-42 7-18 1-4 17 20 9 39 21 17 43-18 39Z" fill="#352d28" opacity=".35"/>
        <path d="M8-43-3-15 14-1 3 24 18 41M-40-10-18-2-6 17M38-25 21-12 33 4" fill="none" stroke="#28221e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M-31-35-8-44M-43 1-27 8M20-34 35-24" fill="none" stroke="#d0b897" strokeWidth="3.5" strokeLinecap="round" opacity=".58"/>
        <circle cx="-29" cy="22" r="4" fill="#241f1c" opacity=".55"/><circle cx="28" cy="15" r="3" fill="#b19a7f" opacity=".45"/>
      </g>)}
      <ellipse className="hero-ground-shadow" cx={dodgeBodyX} cy="571" rx={Math.max(24,44-dodgeState.jump*.09)} ry="11" opacity={Math.max(.18,.7-dodgeState.jump*.003)}/>
      <g className={dodgeState.invulnerable>0?'moving-hero is-hit':'moving-hero'} transform={`translate(${dodgeState.x-78} ${405-dodgeState.jump})`}>
        {running&&!dodgeState.jump&&<g className="run-dust" transform={`translate(${dodgeState.facing>0?28:128} 155)`}><circle r="8"/><circle cx={dodgeState.facing>0?-12:12} cy="4" r="5"/></g>}
        <g className={dodgeState.jump?'hero-body jumping':running?'hero-body running':'hero-body idle'} transform={`translate(78 ${166+bob}) scale(${dodgeState.facing||1} 1) rotate(${lean}) translate(-78 -166)`}>
          <image href={dodgeState.invulnerable>0?"./art/hero-hurt.webp":"./art/hero-dodge.webp"} width="156" height="170" preserveAspectRatio="xMidYMax meet"/>
        </g>
        {dodgeState.invulnerable>0&&<g className="hurt-bubble" transform="translate(105 17)"><rect x="-39" y="-24" width="78" height="29" rx="11"/><path d="m-13 3-8 11 17-10"/><text y="-5" textAnchor="middle">¡AUCH!</text></g>}
      </g>
    </g>}
    {level.gate&&<g aria-label="Aro de paso y diana final">
      <g className={gateActive?'precision-gate is-active':'precision-gate'} transform={`translate(${level.gate.x} ${level.gate.y})`}><circle r="32" fill="#132d3ddd" stroke="#d7a952" strokeWidth="7"/><circle r="19" fill="#163945" stroke="#8defff" strokeWidth="4"/><circle r="11" fill="none" stroke="#d9ffff" strokeWidth="2" strokeDasharray="4 4"/>{gateActive&&<path d="m-8 0 6 7 12-15" fill="none" stroke="#dcffac" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>}</g>
      {(gateActive||won)&&<g transform="translate(888 334)"><circle r="29" fill="#b8ffb344" stroke="#d7ffb8" strokeWidth="5"/>{won&&<text y="9" textAnchor="middle" fill="#efffdc" fontSize="27" fontWeight="900">✓</text>}</g>}
    </g>}
    <image href="./art/enemy-happy.webp" width="1200" height="800" clipPath="url(#enemy-face)" opacity={stage<4&&missFeedback&&!won&&!defeated.includes("upper")?1:0}/>
    <image href="./art/enemy-angry.webp" width="1200" height="800" clipPath="url(#enemy-face)" opacity={stage<4&&hit&&pending?.ids.includes("upper")?1:0}/>
    <image href="./art/hero-surprised.webp" width="1200" height="800" clipPath="url(#hero-face)" opacity={stage<4&&missFeedback?1:0}/>
    {won&&stage<4&&<image href="./art/level-1-cleared.webp" width="1200" height="800" clipPath="url(#collected-regions)"/>}
    {stage<4&&defeated.includes('upper')&&!won&&<image href="./art/level-1-cleared.webp" width="1200" height="800" clipPath="url(#upper-cleared)"/>}
    {stage===3&&<>
      {defeated.includes('lower')&&<image href="./art/level-1.webp" width="1200" height="800" clipPath="url(#lower-cleared)"/>}
      {barrelUsed&&<image href="./art/barrel-cleared.webp" width="1200" height="800" clipPath="url(#barrel-cleared)"/>}
      {!defeated.includes('lower')&&<g transform="translate(161 149)"><image href="./art/enemy-happy.webp" width="1200" height="800" clipPath="url(#enemy-face)" opacity={missFeedback?1:0}/><image href="./art/enemy-angry.webp" width="1200" height="800" clipPath="url(#enemy-face)" opacity={hit&&pending?.ids.includes('lower')?1:0}/></g>}
      {(missFeedback||hit&&pending?.ids.includes('lower'))&&!defeated.includes('lower')&&<g><rect x="992" y="389" width="105" height="33" rx="10" fill="#fff4d9" stroke="#977650"/><text x="1044" y="412" textAnchor="middle" fill="#943c2c" fontSize="20" fontWeight="900">{hit?'¡Grrr!':'¡Ja, ja!'}</text></g>}
      {hit&&pending?.chain&&<g className={`chain-effect${paused?' is-paused':''}`} transform="translate(880 498)"><circle className="blast-ring" r="195" fill="#ffc86311" stroke="#ffe5a6" strokeWidth="7"/><circle className="blast-core" r="35" fill="#fff2ae"/><text y="-42" textAnchor="middle" fill="#fff4d9" stroke="#65381e" strokeWidth="1" fontSize="23" fontWeight="900">¡BUM!</text></g>}
    </>}
    {!won&&!hit&&previewPoints.length>1&&<path d={previewPoints.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ')} fill="none" stroke="#e8faff" strokeWidth="3.5" strokeDasharray="10 10" strokeLinecap="round" opacity={shooting?.45:.95}/>} 
    {stage<4&&(missFeedback||hit&&pending?.ids.includes("upper"))&&!defeated.includes("upper")&&<g className={`enemy-reaction${paused?' is-paused':''}`} aria-hidden="true">
      <path d="M827 239q0-9 10-9h92q10 0 10 9v25q0 9-10 9h-34l-10 12-1-12h-47q-10 0-10-9Z" fill={hit?'#ffe1c5':'#fff4d9'} stroke="#977650" strokeWidth="2"/>
      <text x="883" y="259" textAnchor="middle" fill={hit?'#943c2c':'#58452e'} fontSize="20" fontWeight="900">{hit?'¡Grrr!':'¡Ja, ja!'}</text>
    </g>}
    {hit&&pending&&!pending.chain&&<g transform={`translate(${pending.point.x} ${pending.point.y})`} aria-label="Impacto confirmado" pointerEvents="none">
      <circle r="23" fill="#fff4b455" stroke="#fff7c9" strokeWidth="3"/>
      <path d="M-32 0h-12M32 0h12M0-32v-12M0 32v12" stroke="#fff7c9" strokeWidth="4" strokeLinecap="round"/>
      <rect x="-65" y="-79" width="130" height="30" rx="9" fill="#204d39" stroke="#fff1a8" strokeWidth="2"/>
      <text y="-58" textAnchor="middle" fill="#fff1a8" fontSize="18" fontWeight="900">¡ACIERTO!</text>
    </g>}
    {projectile&&<g><circle cx={projectile.x} cy={projectile.y} r="14" fill="#65cfff" filter="url(#projectile-glow)"/><circle cx={projectile.x} cy={projectile.y} r="7" fill="#fff" stroke="#b2e9ff" strokeWidth="2"/></g>}
    {missFeedback&&<g key={missFeedback.id} className={`miss-feedback${paused?' is-paused':''}`}>
      <g transform={`translate(${missFeedback.x} ${missFeedback.y})`} aria-hidden="true">
        <g className="miss-puff" fill="#e4eddf" stroke="#c1d9dc" strokeWidth="1.5">
          <circle cx="-14" cy="1" r="12"/><circle cx="0" cy="-9" r="16"/><circle cx="15" cy="0" r="12"/><circle cx="2" cy="7" r="13"/>
        </g>
        <g className="miss-sparks" fill="none" stroke="#c6f5ff" strokeWidth="3" strokeLinecap="round"><path d="m-29-17-7-5m32-14v-8m29 26 7-6m-4 29 9 2m-74 0-8 3"/></g>
      </g>
      <g className="hero-reaction" onAnimationEnd={onReactionEnd}>
        <path d="M97 341q0-10 12-10h90q12 0 12 10v30q0 10-12 10h-43l-12 13 2-13h-37q-12 0-12-10Z" fill="#fff4d9" stroke="#977650" strokeWidth="2"/>
        <text x="154" y="364" textAnchor="middle" fill="#58452e" fontSize="21" fontWeight="900">¡Ups!</text>
      </g>
    </g>}
    {won&&<g transform={`translate(${level.target.x} ${level.target.y})`} fill="#fff2a6">{Array.from({length:12},(_,i)=><path key={i} transform={`rotate(${i*30})`} d="m0-35 4-13-4-7-4 7Z"/>)}</g>}
  </svg>;
}






