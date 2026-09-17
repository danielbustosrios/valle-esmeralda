export const LEVEL = {id:1, name:'El primer disparo', origin:{x:290,y:400}, target:{x:888,y:330,radius:30}, duration:1700, initialCurvature:60};
const LEVEL_2={...LEVEL,id:2,name:'Por encima del obstáculo',initialCurvature:81,obstacle:{x:702,y:255,width:70,height:273}};
const LEVEL_3={...LEVEL,id:3,name:'Una reacción en cadena',enemies:[{...LEVEL.target,id:'upper',hitAreas:[{x:881,y:306,radius:25},{x:888,y:342,radius:29}]},{x:1044,y:487,radius:32,id:'lower',hitAreas:[{x:1042,y:459,radius:28},{x:1046,y:497,radius:30}]}],barrel:{x:880,y:498,radius:25,blastRadius:200}};
const LEVEL_4={...LEVEL,id:4,name:'El taller del Profe Dani B',origin:{x:290,y:410},target:{x:888,y:334,radius:38},initialCurvature:30};
const LEVEL_5={...LEVEL,id:5,name:'La prueba de precisión',origin:{x:290,y:410},target:{x:888,y:334,radius:22},gate:{x:760,y:269,radius:13},initialCurvature:30};
const LEVEL_11={...LEVEL_4,id:11,variantOf:4,name:'El derrumbe de Esmeralda',boss:true,hideTrajectory:true,survivalSeconds:60};
const LOGIC_LEVELS=[
  {id:12,name:'El puente de los patrones',logic:true,logicKind:'Secuencias',timeLimit:0},
  {id:13,name:'Las reglas ocultas',logic:true,logicKind:'Relaciones',timeLimit:0},
  {id:14,name:'La balanza de cristal',logic:true,logicKind:'Deducción',timeLimit:25},
  {id:15,name:'El código de las torres',logic:true,logicKind:'Operaciones',timeLimit:22},
  {id:16,name:'Secuencias maestras',logic:true,logicKind:'Patrones avanzados',timeLimit:35},
  {id:17,name:'El desafío del Oráculo',logic:true,logicKind:'Razonamiento mixto',timeLimit:35}
];
const LEVEL_18={id:18,name:'El mapa de coordenadas',coordinate:true};
const LEVEL_19={id:19,name:'El cañón cartesiano',cannonCoordinate:true};
const LEVEL_20={id:20,name:'El cañón de funciones',cannonCoordinate:true,functionCannon:true};
const LEVEL_21={id:21,name:'La recta de cristal',cannonCoordinate:true,functionCannon:true,functionGraph:true};
const MAZE_LEVELS=[
  {id:22,name:'La puerta entre las ruinas',maze:true,initialCurvature:60},
  {id:23,name:'Los senderos cruzados',maze:true,initialCurvature:60},
  {id:24,name:'La llave de musgo',maze:true,initialCurvature:60},
  {id:25,name:'Las cámaras gemelas',maze:true,initialCurvature:60},
  {id:26,name:'El laberinto del guardián',maze:true,initialCurvature:60},
  {id:27,name:'La fortaleza de los ecos',maze:true,initialCurvature:60},
  {id:28,name:'Los pasillos imposibles',maze:true,initialCurvature:60},
  {id:29,name:'Las tres bóvedas',maze:true,initialCurvature:60},
  {id:30,name:'La carrera de los portales',maze:true,initialCurvature:60},
  {id:31,name:'El corazón del laberinto',maze:true,initialCurvature:60},
  {id:32,name:'La persecución comienza',maze:true,initialCurvature:60},
  {id:33,name:'El círculo cambiante',maze:true,initialCurvature:60},
  {id:34,name:'La guardia de piedra',maze:true,initialCurvature:60},
  {id:35,name:'Los anillos vigilados',maze:true,initialCurvature:60},
  {id:36,name:'El núcleo giratorio',maze:true,initialCurvature:60},
  {id:37,name:'La entrada en la penumbra',maze:true,initialCurvature:60},
  {id:38,name:'Las luces que se apagan',maze:true,initialCurvature:60},
  {id:39,name:'El sendero de los ecos',maze:true,initialCurvature:60},
  {id:40,name:'Sombras en movimiento',maze:true,initialCurvature:60},
  {id:41,name:'El Guardián de la Luz',darkBoss:true,initialCurvature:60}
];
const LINEAR_LEVELS=[
  {id:42,name:'La senda ascendente',cannonCoordinate:true,linearFunction:true,linearSet:0},
  {id:43,name:'La pendiente veloz',cannonCoordinate:true,linearFunction:true,linearSet:1},
  {id:44,name:'El descenso de cristal',cannonCoordinate:true,linearFunction:true,linearSet:2},
  {id:45,name:'La pendiente secreta',cannonCoordinate:true,linearFunction:true,linearSet:3},
  {id:46,name:'La recta del Guardavía',cannonCoordinate:true,linearFunction:true,linearSet:4}
];
const WAVE_LEVELS=[
  {id:47,name:'El primer oleaje',wave:true},
  {id:48,name:'El arrecife del ritmo',wave:true},
  {id:49,name:'Los resortes del tiempo',wave:true},
  {id:50,name:'Seno o coseno',wave:true},
  {id:51,name:'El Guardián de las Mareas',wave:true}
];
const BOMBER_LEVELS=[
  {id:52,name:'La cámara de los bloques de metal',bomber:true},
  {id:53,name:'El corredor blindado',bomber:true},
  {id:54,name:'Las dos placas doradas',bomber:true},
  {id:55,name:'La patrulla de hierro',bomber:true},
  {id:56,name:'El núcleo de la Pólvora',bomber:true},
  {id:57,name:'La bóveda de los tres sellos',bomber:true},
  {id:58,name:'La patada del ariete',bomber:true},
  {id:59,name:'Los arietes cruzados',bomber:true},
  {id:60,name:'El corazón blindado',bomber:true}
];
const ISLAND_PUZZLE_LEVELS=[
  {id:61,name:'La puerta de las dos mareas',islandPuzzle:true},
  {id:62,name:'Las cajas del embarcadero',islandPuzzle:true},
  {id:63,name:'El orden de las mareas',islandPuzzle:true},
  {id:64,name:'El cangrejo centinela',islandPuzzle:true},
  {id:65,name:'La cámara del gran tótem',islandPuzzle:true},
  {id:66,name:'El tapón de la marea',islandPuzzle:true},
  {id:67,name:'La bóveda de los cuatro vientos',islandPuzzle:true}
  ,{id:68,name:'El Guardián de los Mundos',pythagoreanBoss:true,initialCurvature:52}
];
export const LEVELS=[
  LEVEL,LEVEL_2,LEVEL_3,LEVEL_4,LEVEL_5,
  {...LEVEL,id:6,variantOf:1,name:'El primer disparo oculto',previewFraction:1/3},
  {...LEVEL_2,id:7,variantOf:2,name:'El obstáculo oculto',previewFraction:1/3},
  {...LEVEL_3,id:8,variantOf:3,name:'La cadena oculta',previewFraction:1/3},
  {...LEVEL_4,id:9,variantOf:4,name:'El taller sin guía completa',previewFraction:1/3},
  {...LEVEL_5,id:10,variantOf:5,name:'Precisión entre sombras',previewFraction:1/3},
  LEVEL_11,...LOGIC_LEVELS,LEVEL_18,LEVEL_19,LEVEL_20,LEVEL_21,...MAZE_LEVELS,...LINEAR_LEVELS,...WAVE_LEVELS,...BOMBER_LEVELS,...ISLAND_PUZZLE_LEVELS,
];
export const baseLevelId=level=>level.variantOf||level.id;
// The renderer and simulation consume this exact same function. New families can implement pointAt.
export function coefficients(curvature,height,direction){return {a:-(0.05+curvature*0.001),b:0.92+direction*0.01,c:height*0.025};}
export function pointAt(t, curvature, height=0,direction=0,level=LEVEL) {if(baseLevelId(level)>=4){const {a,b,c}=coefficients(curvature,height,direction),x=t*10;return {x:level.origin.x+85*x,y:level.origin.y-85*(a*x*x+b*x+c)};}return {x:LEVEL.origin.x+(850+direction*4)*t,y:LEVEL.origin.y-(780+height*4)*t+(400+curvature*7)*t*t};}
export function hitsSegment(a,b,target=LEVEL.target){const dx=b.x-a.x,dy=b.y-a.y;const u=Math.max(0,Math.min(1,((target.x-a.x)*dx+(target.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(a.x+u*dx-target.x,a.y+u*dy-target.y)<=target.radius+9;}
export function obstacleImpact(a,b,obstacle){
  if(!obstacle)return null;
  let enter=0,leave=1;
  for(const [axis,min,max] of [['x',obstacle.x-9,obstacle.x+obstacle.width+9],['y',obstacle.y-9,obstacle.y+obstacle.height+9]]){
    const d=b[axis]-a[axis];
    if(Math.abs(d)<1e-9){if(a[axis]<min||a[axis]>max)return null;continue;}
    const u=(min-a[axis])/d,v=(max-a[axis])/d;
    enter=Math.max(enter,Math.min(u,v));leave=Math.min(leave,Math.max(u,v));
    if(enter>leave)return null;
  }
  return {x:a.x+(b.x-a.x)*enter,y:a.y+(b.y-a.y)*enter};
}
export function trajectory(curvature,height=0,level=LEVEL,direction=0){const points=[];for(let i=0;i<=200;i++){const p=pointAt(i/200,curvature,height,direction,level);const impact=i?obstacleImpact(points.at(-1),p,level.obstacle):null;if(impact){points.push(impact);break;}points.push(p);if(p.y>590)break;}return points;}
export function encounter(a,b,level,defeated=[],barrelUsed=false){
  const enemies=(level.enemies||[{...level.target,id:'upper'}]).filter(e=>!defeated.includes(e.id));
  const candidates=[...enemies.flatMap(e=>e.hitAreas?e.hitAreas.map(area=>({...area,id:e.id})):[e]),...(level.barrel&&!barrelUsed?[{...level.barrel,id:'barrel'}]:[])];
  const dx=b.x-a.x,dy=b.y-a.y,A=dx*dx+dy*dy;
  const collisions=candidates.map(target=>{const ox=a.x-target.x,oy=a.y-target.y,r=target.radius+9,C=ox*ox+oy*oy-r*r,B=2*(ox*dx+oy*dy),disc=B*B-4*A*C;const t=C<=0?0:A&&disc>=0?(-B-Math.sqrt(disc))/(2*A):Infinity;return {target,t};}).filter(c=>c.t>=0&&c.t<=1).sort((a,b)=>a.t-b.t);
  if(!collisions.length)return null;
  const {target,t}=collisions[0],chain=target.id==='barrel';
  return {ids:chain?enemies.filter(e=>Math.hypot(e.x-target.x,e.y-target.y)<=level.barrel.blastRadius).map(e=>e.id):[target.id],chain,point:{x:a.x+dx*t,y:a.y+dy*t}};
}




