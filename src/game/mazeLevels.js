export const MAZE_LEVELS=[
  {id:22,name:'La puerta entre las ruinas',width:11,height:7,seed:2201,keyCount:0,timeLimit:0,parMoves:42},
  {id:23,name:'Los senderos cruzados',width:15,height:9,seed:2303,keyCount:0,timeLimit:0,parMoves:72},
  {id:24,name:'La llave de musgo',width:17,height:11,seed:2407,keyCount:1,timeLimit:0,parMoves:120},
  {id:25,name:'Las cámaras gemelas',width:19,height:13,seed:2511,keyCount:2,timeLimit:0,parMoves:185},
  {id:26,name:'El laberinto del guardián',width:21,height:15,seed:2617,keyCount:3,timeLimit:70,parMoves:260},
  {id:27,name:'La fortaleza de los ecos',width:23,height:15,seed:2719,keyCount:1,timeLimit:0,parMoves:280},
  {id:28,name:'Los pasillos imposibles',width:25,height:17,seed:2821,keyCount:2,timeLimit:0,parMoves:350},
  {id:29,name:'Las tres bóvedas',width:27,height:19,seed:2927,keyCount:3,timeLimit:0,parMoves:430},
  {id:30,name:'La carrera de los portales',width:29,height:19,seed:3037,keyCount:3,timeLimit:105,parMoves:470},
  {id:31,name:'El corazón del laberinto',width:31,height:21,seed:3109,keyCount:4,timeLimit:90,parMoves:540},
  {id:32,name:'La persecución comienza',width:29,height:21,seed:3217,keyCount:2,timeLimit:120,parMoves:500,enemyCount:1,enemySpeed:900},
  {id:33,name:'El círculo cambiante',width:25,height:25,seed:3313,keyCount:2,timeLimit:135,parMoves:520,rotating:true,round:true,rotationInterval:12},
  {id:34,name:'La guardia de piedra',width:31,height:23,seed:3413,keyCount:3,timeLimit:120,parMoves:600,enemyCount:2,enemySpeed:760},
  {id:35,name:'Los anillos vigilados',width:27,height:27,seed:3511,keyCount:3,timeLimit:125,parMoves:620,enemyCount:2,enemySpeed:680,rotating:true,round:true,rotationInterval:10},
  {id:36,name:'El núcleo giratorio',width:29,height:29,seed:3613,keyCount:4,timeLimit:150,parMoves:720,enemyCount:3,enemySpeed:590,rotating:true,round:true,rotationInterval:8},
  {id:37,name:'La entrada en la penumbra',width:25,height:17,seed:3719,keyCount:1,timeLimit:0,parMoves:260,dark:true,lightRadius:118},
  {id:38,name:'Las luces que se apagan',width:27,height:19,seed:3821,keyCount:3,timeLimit:0,parMoves:360,dark:true,lightRadius:130,lightDrain:true},
  {id:39,name:'El sendero de los ecos',width:29,height:21,seed:3917,keyCount:2,timeLimit:0,parMoves:430,dark:true,lightRadius:96,pulse:true},
  {id:40,name:'Sombras en movimiento',width:29,height:21,seed:4013,keyCount:2,timeLimit:0,parMoves:470,dark:true,lightRadius:122,enemyCount:2,enemySpeed:820}
];

const randomFrom=seed=>{let value=seed>>>0;return()=>{value+=0x6D2B79F5;let next=value;next=Math.imul(next^next>>>15,next|1);next^=next+Math.imul(next^next>>>7,next|61);return((next^next>>>14)>>>0)/4294967296;};};
const keyOf=point=>`${point.x},${point.y}`;

export function createMaze(spec){
  const width=spec.width|1,height=spec.height|1,random=randomFrom(spec.seed),grid=Array.from({length:height},()=>Array(width).fill('#'));
  const start={x:1,y:1},stack=[start],visited=new Set([keyOf(start)]);grid[start.y][start.x]='.';
  while(stack.length){
    const current=stack.at(-1),directions=[[2,0],[-2,0],[0,2],[0,-2]].sort(()=>random()-.5);
    const next=directions.map(([dx,dy])=>({x:current.x+dx,y:current.y+dy,dx,dy})).find(point=>point.x>0&&point.y>0&&point.x<width-1&&point.y<height-1&&!visited.has(keyOf(point)));
    if(!next){stack.pop();continue;}
    grid[current.y+next.dy/2][current.x+next.dx/2]='.';grid[next.y][next.x]='.';visited.add(keyOf(next));stack.push({x:next.x,y:next.y});
  }
  const queue=[start],distance=new Map([[keyOf(start),0]]),openNeighbors=point=>[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:point.x+dx,y:point.y+dy})).filter(item=>grid[item.y]?.[item.x]==='.');
  for(let index=0;index<queue.length;index++){const point=queue[index];for(const next of openNeighbors(point))if(!distance.has(keyOf(next))){distance.set(keyOf(next),distance.get(keyOf(point))+1);queue.push(next);}}
  const cells=queue.filter(point=>point.x%2&&point.y%2).sort((a,b)=>distance.get(keyOf(b))-distance.get(keyOf(a))),exit=cells[0];
  const deadEnds=cells.filter(point=>keyOf(point)!==keyOf(exit)&&keyOf(point)!==keyOf(start)&&openNeighbors(point).length===1),keys=[];
  for(let index=0;index<spec.keyCount;index++){const candidate=deadEnds[Math.min(deadEnds.length-1,Math.floor(index*deadEnds.length/Math.max(1,spec.keyCount)))];if(candidate&&!keys.some(item=>keyOf(item)===keyOf(candidate)))keys.push(candidate);}
  const blocked=new Set([keyOf(start),keyOf(exit),...keys.map(keyOf)]),enemyCandidates=cells.filter(point=>!blocked.has(keyOf(point))&&distance.get(keyOf(point))>Math.max(width,height)),enemies=[];
  for(let index=0;index<(spec.enemyCount||0);index++){const candidate=enemyCandidates[Math.min(enemyCandidates.length-1,Math.floor((index+.35)*enemyCandidates.length/Math.max(1,spec.enemyCount)))];if(candidate)enemies.push({...candidate,id:index,tick:index*3});}
  return {...spec,width,height,grid,start,exit,keys,enemies};
}

export const getMazeLevel=id=>{const spec=MAZE_LEVELS.find(level=>level.id===id);return spec?createMaze(spec):null;};
export const isMazeOpen=(maze,x,y)=>maze?.grid[y]?.[x]==='.';
