import {test} from 'node:test';import assert from 'node:assert/strict';
import {LEVELS,coefficients,pointAt,trajectory,encounter} from './trajectory.js';
const level=LEVELS[3];
test('Displayed polynomial matches world coordinates',()=>{for(const [c,h,d] of [[30,0,0],[61,13,-17],[100,40,40]]){const abc=coefficients(c,h,d);for(const t of [0,.2,.7,1]){const p=pointAt(t,c,h,d,level),x=(p.x-level.origin.x)/85,y=(level.origin.y-p.y)/85;assert.ok(Math.abs(y-(abc.a*x*x+abc.b*x+abc.c))<1e-10);}}});
test('Each control changes exactly one coefficient',()=>{const base=coefficients(30,10,0),a=coefficients(40,10,0),b=coefficients(30,10,10),c=coefficients(30,20,0);assert.equal(base.b,a.b);assert.equal(base.c,a.c);assert.equal(base.a,b.a);assert.equal(base.c,b.c);assert.equal(base.a,c.a);assert.equal(base.b,c.b);});
test('Height moves launch point vertically and leaves horizontal origin fixed',()=>{assert.deepEqual(pointAt(0,60,40,0,level),{x:290,y:325});});
test('Workshop initial shot misses and a solvable path exists',()=>{const shot=c=>{const ps=trajectory(c,0,level,0);return ps.some((p,i)=>i&&encounter(ps[i-1],p,level));};assert.equal(shot(30),false);assert.equal(shot(60),true);});
test('Workshop preview and projectile share path',()=>trajectory(60,13,level,7).forEach((p,i)=>assert.deepEqual(p,pointAt(i/200,60,13,7,level))));
