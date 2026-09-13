import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,pointAt,trajectory,encounter} from './trajectory.js';
const level=LEVELS[2];
function shot(c,h,d,defeated=[]){let a=pointAt(0,c,h,d);for(let i=1;i<=200;i++){const b=pointAt(i/200,c,h,d);const result=encounter(a,b,level,defeated);if(result)return result;if(b.y>590)break;a=b;}return null;}
test('Direction changes the path while preserving the muzzle origin',()=>{assert.deepEqual(pointAt(0,70,20,-40),level.origin);assert.notEqual(pointAt(.5,70,20,-40).x,pointAt(.5,70,20,40).x);});
test('Level 3 preview shares every simulation point',()=>trajectory(82,0,level,-40).forEach((p,i)=>assert.deepEqual(p,pointAt(i/200,82,0,-40))));
test('The barrel can be reached and chains to both enemies',()=>{const result=shot(82,0,-40);assert.equal(result.chain,true);assert.deepEqual(result.ids,['upper','lower']);});
test('Enemies can be defeated separately',()=>{assert.deepEqual(shot(50,0,-40).ids,['upper']);assert.deepEqual(shot(78,24,-16,['upper']).ids,['lower']);});
test('Defeated enemies and consumed barrel no longer collide',()=>assert.equal(encounter({x:800,y:498},{x:1100,y:498},level,['upper','lower'],true),null));
test('Swept encounter chooses the first object crossed',()=>{const result=encounter({x:700,y:498},{x:1150,y:498},level);assert.equal(result.chain,true);});

test('Lower bandit visible forehead registers a hit',()=>{const hit=encounter({x:1000,y:437},{x:1080,y:437},level);assert.deepEqual(hit.ids,['lower']);assert.equal(hit.chain,false);});
test('Upper bandit bandana registers a hit',()=>assert.deepEqual(encounter({x:845,y:284},{x:915,y:284},level).ids,['upper']));
test('A clear pass above the lower bandit remains a miss',()=>assert.equal(encounter({x:1000,y:408},{x:1080,y:408},level),null));
