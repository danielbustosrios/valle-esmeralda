import test from 'node:test';
import assert from 'node:assert/strict';
import {CANNON_COORDINATES,FUNCTION_CANNON_CHALLENGES,FUNCTION_GRAPH_CHALLENGES,cannonFlight} from './cannonCoordinates.js';

test('coordinate cannon contains direct and inferred targets',()=>{assert.equal(CANNON_COORDINATES.length,4);assert.match(CANNON_COORDINATES[2].prompt,/doble/);assert.deepEqual(CANNON_COORDINATES[3].target,{x:-3,y:2});});
test('cannon projectile begins and lands exactly on the selected point',()=>{const start={x:200,y:600},end={x:820,y:360};assert.deepEqual(cannonFlight(start,end,0),start);const landing=cannonFlight(start,end,1);assert.ok(Math.abs(landing.x-end.x)<1e-9);assert.ok(Math.abs(landing.y-end.y)<1e-9);assert.ok(cannonFlight(start,end,.5).y<(start.y+end.y)/2);});
test('function cannon targets are the evaluated coordinate pairs',()=>{assert.equal(FUNCTION_CANNON_CHALLENGES.length,4);for(const challenge of FUNCTION_CANNON_CHALLENGES){assert.equal(challenge.target.x,challenge.input);assert.equal(challenge.target.y,challenge.evaluate(challenge.input));assert.ok(challenge.target.x>=-4&&challenge.target.x<=4);assert.ok(challenge.target.y>=-3&&challenge.target.y<=3);}});
test('graph level builds one function from four distinct points',()=>{assert.equal(FUNCTION_GRAPH_CHALLENGES.length,4);assert.equal(new Set(FUNCTION_GRAPH_CHALLENGES.map(item=>item.input)).size,4);assert.equal(new Set(FUNCTION_GRAPH_CHALLENGES.map(item=>item.formula)).size,1);for(const challenge of FUNCTION_GRAPH_CHALLENGES)assert.equal(challenge.target.y,challenge.evaluate(challenge.input));});
