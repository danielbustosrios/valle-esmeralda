import test from 'node:test';
import assert from 'node:assert/strict';
import {LOGIC_CHALLENGES} from './logicChallenges.js';

test('logic progression contains four valid decisions in levels 12 through 17',()=>{
  for(let id=12;id<=17;id++){
    const challenges=LOGIC_CHALLENGES[id];
    assert.equal(challenges.length,4);
    for(const challenge of challenges){
      assert.equal(challenge.answers.length,3);
      assert.equal(new Set(challenge.answers).size,3);
      assert.equal(challenge.answers.includes(challenge.correct),true);
      assert.ok(challenge.hint.length>10);
    }
  }
});

test('advanced levels contain non-constant and interleaved reasoning patterns',()=>{
  assert.match(LOGIC_CHALLENGES[16][2].hint,/Alterna/);
  assert.match(LOGIC_CHALLENGES[16][3].hint,/intercaladas/);
  assert.match(LOGIC_CHALLENGES[17][2].hint,/cuadrados/);
});
