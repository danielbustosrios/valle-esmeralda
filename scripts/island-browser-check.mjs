import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {CONFIGS,W,H,kickResult,active,same} from '../src/game/island.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/USUARIO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
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

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1200,height:950}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const position=()=>page.locator('.island-hero').evaluate(el=>({x:+el.style.getPropertyValue('--x'),y:+el.style.getPropertyValue('--y')}));
const arrow=(dx,dy)=>dx>0?'ArrowRight':dx<0?'ArrowLeft':dy>0?'ArrowDown':'ArrowUp';
try{
 await page.goto('http://127.0.0.1:5173/?level=61');
 await page.locator('.island-hero').waitFor();await page.waitForTimeout(200);await page.keyboard.down('ArrowUp');await page.waitForTimeout(680);await page.keyboard.up('ArrowUp');
 const p=await position();console.log('held position',p);assert.ok(p.y<=6,'held key repeats after renders');
 await page.waitForTimeout(250);assert.deepEqual(await position(),p,'release stops movement');
 const pad=page.locator('.island-pad button').first();await pad.dispatchEvent('pointerdown');
 await page.waitForTimeout(330);await pad.dispatchEvent('pointerup');
 assert.ok((await position()).y<p.y,'touch hold repeats');
 await page.keyboard.down('ArrowRight');
 const sideFrame=await page.locator('.island-hero img').getAttribute('src');
 await page.waitForTimeout(170);
 assert.notEqual(await page.locator('.island-hero img').getAttribute('src'),sideFrame,'side walk changes leg frame');
 await page.keyboard.down('ArrowDown');await page.keyboard.up('ArrowRight');
 const turn=await position();await page.waitForTimeout(320);await page.keyboard.up('ArrowDown');
 assert.ok((await position()).y>turn.y,'releasing the previous direction does not stop the new one');
 assert.match(await page.locator('.island-hero img').getAttribute('src'),/front/);
 await page.screenshot({path:'island-desktop-qa.png',fullPage:true});
 console.log('PASS held keyboard, touch and release');
 for(const [id,cfg] of Object.entries(CONFIGS)){
  await page.goto('http://127.0.0.1:5173/?level='+id);
  let objects=cfg.objects;
  async function walkTo(target){
   for(let attempts=0;attempts<5;attempts++){
    let player=await position();if(same(player,target))return;
    const path=route(cfg,objects,player,target);assert.ok(path);
    for(const next of path){
     player=await position();
     if(Math.abs(next.x-player.x)+Math.abs(next.y-player.y)!==1)break;
     await page.keyboard.press(arrow(next.x-player.x,next.y-player.y));
     await page.waitForTimeout(150);
    }
    if(same(await position(),target))return;
    await page.waitForTimeout(950);
   }
   throw Error('Could not reach '+JSON.stringify(target));
  }
  for(const [name,dx,dy,count] of plans[id])for(let i=0;i<count;i++){
   const obj=objects.find(o=>o.id===name);await walkTo({x:obj.x-dx,y:obj.y-dy});
   await page.keyboard.press(arrow(dx,dy));await page.keyboard.press('Space');
   await page.waitForTimeout(630);
   objects=kickResult(cfg,objects,name,{x:dx,y:dy}).objects;
  }
  await walkTo(cfg.crystal);
  await page.locator('.victory:not(.defeat)').waitFor({timeout:2000});
  console.log('PASS browser victory '+id);
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/?level=63');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
 await page.screenshot({path:'island-mobile-qa.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS mobile layout and no browser errors');
}finally{await browser.close();}

