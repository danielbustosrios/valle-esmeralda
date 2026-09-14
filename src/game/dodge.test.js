import test from 'node:test';
import assert from 'node:assert/strict';
import {heroBodyX,rockHitsHero} from './dodge.js';

test('visible body centre stays under the feet when the pose turns',()=>{
  assert.equal(heroBodyX({x:600,facing:1}),618);
  assert.equal(heroBodyX({x:600,facing:-1}),608);
});

test('rock collision follows the visible body instead of transparent sprite space',()=>{
  const hero={x:600,facing:1,jump:0};
  assert.equal(rockHitsHero({x:690,y:500,r:50},hero),false);
  assert.equal(rockHitsHero({x:680,y:500,r:50},hero),true);
});

test('turning keeps the collision body on the same visible support point',()=>{
  assert.equal(rockHitsHero({x:618,y:500,r:16},{x:600,facing:1,jump:0}),true);
  assert.equal(rockHitsHero({x:608,y:500,r:16},{x:600,facing:-1,jump:0}),true);
  assert.equal(rockHitsHero({x:675,y:500,r:16},{x:600,facing:1,jump:0}),false);
  assert.equal(rockHitsHero({x:665,y:500,r:16},{x:600,facing:-1,jump:0}),false);
});

test('jumping moves the collision body with the hero',()=>{
  const rock={x:618,y:520,r:25};
  assert.equal(rockHitsHero(rock,{x:600,facing:1,jump:0}),true);
  assert.equal(rockHitsHero(rock,{x:600,facing:1,jump:145}),false);
});

