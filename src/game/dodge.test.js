import test from 'node:test';
import assert from 'node:assert/strict';
import {DODGE_HEART_POSITIONS,dodgeHeartHitsHero,dodgeIntensity,heroBodyX,rockHitsHero,shouldSpawnDodgeHeart} from './dodge.js';

test('the minute challenge has 30 easy, 26 current and 4 calm seconds',()=>{
  assert.equal(dodgeIntensity(0).phase,'INICIO');
  assert.ok(dodgeIntensity(29.9).difficulty<.31);
  assert.equal(dodgeIntensity(30).paceElapsed,0);
  assert.equal(dodgeIntensity(29.9).spawnFactor,.73);
  assert.equal(dodgeIntensity(30).spawnFactor,.62);
  assert.equal(dodgeIntensity(55.9).phase,'AVALANCHA');
  assert.ok(dodgeIntensity(55.9).finale>.98);
  assert.equal(dodgeIntensity(56).phase,'CALMA');
  assert.equal(dodgeIntensity(59.9).finale,0);
  assert.equal(dodgeIntensity(59.9).spawnFactor,1);
});

test('visible body centre stays under the feet when the pose turns',()=>{
  assert.equal(heroBodyX({x:600,facing:1}),600);
  assert.equal(heroBodyX({x:600,facing:-1}),600);
});

test('rock collision follows the visible body instead of transparent sprite space',()=>{
  const hero={x:600,facing:1,jump:0};
  assert.equal(rockHitsHero({x:670,y:500,r:50},hero),false);
  assert.equal(rockHitsHero({x:660,y:500,r:50},hero),true);
});

test('turning keeps the collision body on the same visible support point',()=>{
  assert.equal(rockHitsHero({x:600,y:500,r:16},{x:600,facing:1,jump:0}),true);
  assert.equal(rockHitsHero({x:600,y:500,r:16},{x:600,facing:-1,jump:0}),true);
  assert.equal(rockHitsHero({x:657,y:500,r:16},{x:600,facing:1,jump:0}),false);
  assert.equal(rockHitsHero({x:543,y:500,r:16},{x:600,facing:-1,jump:0}),false);
});

test('jumping moves the collision body with the hero',()=>{
  const rock={x:600,y:520,r:25};
  assert.equal(rockHitsHero(rock,{x:600,facing:1,jump:0}),true);
  assert.equal(rockHitsHero(rock,{x:600,facing:1,jump:145}),false);
});

test('the recovery heart appears once when seven seconds remain',()=>{
  assert.equal(shouldSpawnDodgeHeart(52.9,53,60),true);
  assert.equal(shouldSpawnDodgeHeart(53,53.1,60),false);
  assert.equal(shouldSpawnDodgeHeart(52,52.9,60),false);
});

test('the recovery heart is collected near the hero on the platform',()=>{
  assert.equal(dodgeHeartHitsHero({x:500},{x:530,jump:0}),true);
  assert.equal(dodgeHeartHitsHero({x:500},{x:580,jump:0}),false);
  assert.equal(dodgeHeartHitsHero({x:500},{x:500,jump:150}),false);
});

test('three recovery hearts have fixed places across the platform',()=>{
  assert.deepEqual(DODGE_HEART_POSITIONS,[220,600,980]);
});
