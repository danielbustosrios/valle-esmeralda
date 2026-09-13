
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CONFIGS,W,H,kickResult,active,same} from './island.js';
function route(cfg,objects,start,target){
 const queue=[[start,[]]],seen=new Set();
 for(let i=0;i<queue.length;i++){
  const [p,path]=queue[i],k=p.x+','+p.y;
  if(seen.has(k))continue;seen.add(k);
  if(same(p,target))return path;
  for(const [x,y] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const n={x:p.x+x,y:p.y+y};
   if(n.x<=0||n.x>=W-1||n.y<=0||n.y>=H-1||cfg.solids.has(n.x+','+n.y)||objects.some(o=>same(o,n))||(!active(cfg,objects)&&same(n,cfg.gate)))continue;
   queue.push([n,[...path,n]]);
  }
 }
 return null;
}
const plans={
61:[['sun',1,0,1],['moon',0,1,1]],
62:[['sun',1,0,8],['moon',0,1,4]],
63:[['sun',0,-1,5],['moon',1,0,6],['moon',0,-1,5]],
64:[['sun',-1,0,5],['moon',1,0,3],['moon',0,-1,5],['moon',-1,0,7]],
65:[['sun',-1,0,5],['moon',0,-1,4],['moon',-1,0,7],['tide',1,0,5],['tide',0,-1,4]],
66:[['tide',-1,0,6],['sun',0,-1,5],['moon',1,0,6],['moon',0,-1,6]],
67:[['tide',-1,0,6],['sun',-1,0,5],['moon',0,-1,4],['moon',-1,0,7],['gale',1,0,5],['gale',0,-1,5]]
};
for(const [id,cfg] of Object.entries(CONFIGS))test('Island '+id+' has a reachable complete solution',()=>{
 let objects=cfg.objects,player=cfg.start,moves=0,kicks=0;
 for(const [name,dx,dy,count] of plans[id])for(let i=0;i<count;i++){
  const object=objects.find(o=>o.id===name),behind={x:object.x-dx,y:object.y-dy};
  const path=route(cfg,objects,player,behind);assert.ok(path,'Can reach kick position for '+name);
  moves+=path.length;player=behind;
  const result=kickResult(cfg,objects,name,{x:dx,y:dy});assert.ok(result.changed);
  objects=result.objects;kicks++;
  assert.equal(new Set(objects.map(o=>o.x+','+o.y)).size,objects.length);
  assert.ok(objects.every(o=>!cfg.solids.has(o.x+','+o.y)));
 }
 assert.ok(active(cfg,objects));
 const exit=route(cfg,objects,player,cfg.crystal);assert.ok(exit);
 moves+=exit.length;
 if(cfg.time)assert.ok(moves*.145+kicks*.6<cfg.time*.6,'Time budget leaves room for decisions and patrol');
});
test('Island 63 derives its order from the corridor instead of numbered rules',()=>{
 const cfg=CONFIGS[63];let objects=cfg.objects,player=cfg.start;
 for(let i=0;i<6;i++){
  const block=objects.find(o=>o.id==='moon'),behind={x:block.x-1,y:block.y};
  const path=route(cfg,objects,player,behind);assert.ok(path);player=behind;
  const result=kickResult(cfg,objects,'moon',{x:1,y:0});assert.ok(result.changed);objects=result.objects;
 }
 const inner=objects.find(o=>o.id==='sun');
 assert.equal(route(cfg,objects,player,{x:inner.x,y:inner.y+1}),null,'the entrance block removes access to the inner block');
 assert.equal(cfg.order,undefined,'there is no coded or numbered order');
});
test('Island 65 requires clearing both shared entrances in sequence',()=>{
 const cfg=CONFIGS[65];
 const advance=(initialObjects,initialPlayer,id,direction,count)=>{
  let objects=initialObjects,player=initialPlayer;
  for(let i=0;i<count;i++){
   const block=objects.find(o=>o.id===id),behind={x:block.x-direction.x,y:block.y-direction.y};
   const path=route(cfg,objects,player,behind);assert.ok(path);player=behind;
   const result=kickResult(cfg,objects,id,direction);assert.ok(result.changed);objects=result.objects;
  }
  return {objects,player};
 };
 const moonAtCrossing=advance(cfg.objects,cfg.start,'moon',{x:0,y:-1},4);
 const inner=moonAtCrossing.objects.find(o=>o.id==='sun');
 assert.equal(route(cfg,moonAtCrossing.objects,moonAtCrossing.player,{x:inner.x+1,y:inner.y}),null,'the middle block can close the horizontal entrance');
 const tideAtEntrance=advance(cfg.objects,cfg.start,'tide',{x:1,y:0},5);
 const middle=tideAtEntrance.objects.find(o=>o.id==='moon');
 assert.equal(route(cfg,tideAtEntrance.objects,tideAtEntrance.player,{x:middle.x,y:middle.y+1}),null,'the outer block can close the vertical entrance');
});
test('Crates move one cell; rocks stop at the first plate',()=>{
 const c=CONFIGS[62],r=kickResult(c,c.objects,'sun',{x:1,y:0});
 assert.equal(r.landing.x,c.objects[0].x+1);
 const a=CONFIGS[61],s=kickResult(a,a.objects,'sun',{x:1,y:0});
 assert.ok(same(s.landing,a.plates[0]));
});
