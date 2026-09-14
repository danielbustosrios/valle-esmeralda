import test from 'node:test';
import assert from 'node:assert/strict';
import {rockHitsHero} from './dodge.js';

test('rock collision follows the visible body instead of transparent sprite space',()=>{
  const hero={x:600,facing:1,jump:0};
  assert.equal(rockHitsHero({x:675,y:500,r:50},hero),false);
  assert.equal(rockHitsHero({x:665,y:500,r:50},hero),true);
});

test('turning left mirrors the art without separating the collision body from its shadow',()=>{
  const rockOnBody={x:600,y:500,r:24};
  const rockBesideShadow={x:545,y:500,r:24};
  assert.equal(rockHitsHero(rockOnBody,{x:600,facing:1,jump:0}),true);
  assert.equal(rockHitsHero(rockOnBody,{x:600,facing:-1,jump:0}),true);
  assert.equal(rockHitsHero(rockBesideShadow,{x:600,facing:1,jump:0}),false);
  assert.equal(rockHitsHero(rockBesideShadow,{x:600,facing:-1,jump:0}),false);
});

test('jumping moves the collision body with the hero',()=>{
  const rock={x:618,y:520,r:25};
  assert.equal(rockHitsHero(rock,{x:600,facing:1,jump:0}),true);
  assert.equal(rockHitsHero(rock,{x:600,facing:1,jump:145}),false);
});

