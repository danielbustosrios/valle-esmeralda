import {test} from 'node:test';
import assert from 'node:assert/strict';
import {WAVE_LEVELS,matchesWave,wavePath,waveY} from './waveChallenges.js';

test('wave world grows from amplitude to sine and cosine under time pressure',()=>{
 assert.deepEqual(Object.keys(WAVE_LEVELS).map(Number),[47,48,49,50,51]);
 assert.equal(WAVE_LEVELS[47].rounds.every(round=>round.f==='sin'&&round.b===1&&round.p===0),true);
 assert.equal(new Set(WAVE_LEVELS[50].rounds.map(round=>round.f)).size,2);
 assert.equal(WAVE_LEVELS[51].time,45);
});

test('the displayed path and the travelling orb use the same wave',()=>{
 const settings={a:90,b:2,p:1,f:'cos'},path=wavePath(settings);
 assert.match(path,new RegExp(`L610,${waveY(500,settings)}`));
 assert.equal(matchesWave({...settings},settings),true);
 assert.equal(matchesWave({...settings,b:3},settings),false);
});
