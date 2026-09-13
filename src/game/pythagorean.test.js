import {test} from 'node:test';
import assert from 'node:assert/strict';
import {KICK_DISTANCE,canKickStone,enemyTouchesHero,groundRockHits} from './pythagorean.js';

test('the counterattack requires proximity and facing the Colossus',()=>{
 assert.equal(KICK_DISTANCE,72);
 assert.ok(canKickStone(200,260,1));
 assert.ok(canKickStone(200,272,1));
 assert.equal(canKickStone(200,273,1),false);
 assert.equal(canKickStone(200,260,-1),false);
 assert.equal(canKickStone(250,200,1),false);
 assert.ok(canKickStone(500,450,-1,-1));
 assert.equal(canKickStone(500,450,1,-1),false);
});

test('the Colossus and its low rocks require distance and jumping',()=>{
 assert.equal(enemyTouchesHero(800,850),true);assert.equal(enemyTouchesHero(650,850),false);
 assert.equal(enemyTouchesHero(180,150),true);assert.equal(enemyTouchesHero(340,150),false);
 assert.equal(groundRockHits(300,0,330),true);assert.equal(groundRockHits(300,110,330),false);assert.equal(groundRockHits(300,0,380),false);
});
