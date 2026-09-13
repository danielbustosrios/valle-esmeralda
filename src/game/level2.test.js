import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,pointAt,trajectory,hitsSegment,obstacleImpact} from './trajectory.js';
const level=LEVELS[1];
function simulate(c,h){let previous=pointAt(0,c,h);for(let i=1;i<=200;i++){const p=pointAt(i/200,c,h);if(obstacleImpact(previous,p,level.obstacle))return 'blocked';if(hitsSegment(previous,p))return 'won';previous=p;}return 'miss';}
test('Level 2 initial shot hits the barrier',()=>assert.equal(simulate(81,0),'blocked'));
test('Height and curvature can clear the barrier and win',()=>assert.equal(simulate(100,32),'won'));
test('Height keeps the cannon origin fixed',()=>assert.deepEqual(pointAt(0,100,40),level.origin));
test('Barrier stops the preview at the swept collision point',()=>{const ps=trajectory(81,0,level);assert.ok(ps.length<201);assert.ok(obstacleImpact(ps.at(-2),ps.at(-1),level.obstacle));});
test('Fast segments cannot tunnel through the barrier',()=>assert.ok(obstacleImpact({x:650,y:400},{x:850,y:400},level.obstacle)));

