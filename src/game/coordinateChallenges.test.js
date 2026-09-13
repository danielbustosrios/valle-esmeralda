import test from 'node:test';
import assert from 'node:assert/strict';
import {COORDINATE_CHALLENGES} from './coordinateChallenges.js';

test('coordinate chapter covers four quadrants and inferred coordinates',()=>{
  assert.equal(COORDINATE_CHALLENGES.length,4);
  assert.ok(COORDINATE_CHALLENGES.some(item=>item.target.x<0));
  assert.ok(COORDINATE_CHALLENGES.some(item=>item.target.y<0));
  assert.match(COORDINATE_CHALLENGES.at(-1).prompt,/opuesto/);
  for(const {target} of COORDINATE_CHALLENGES){assert.ok(target.x>=-4&&target.x<=4);assert.ok(target.y>=-3&&target.y<=3);}
});
