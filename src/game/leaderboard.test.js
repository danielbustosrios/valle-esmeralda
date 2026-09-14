import test from 'node:test';
import assert from 'node:assert/strict';
import {currentStudentRank,displayedRank,isCurrentStudent,sortLeaderboard} from './leaderboard.js';

const rows=[
  {first_name:'Laura',last_initial:'P.',course:'10.1',completion_percent:40,total_errors:9,play_seconds:500},
  {first_name:'Mateo',last_initial:'R.',course:'11.2',completion_percent:60,total_errors:5,play_seconds:700},
  {first_name:'Sara',last_initial:'G.',course:'10.3',completion_percent:60,total_errors:3,play_seconds:800},
  {first_name:'Juan',last_initial:'M.',course:'11.1',completion_percent:60,total_errors:3,play_seconds:600}
];

test('student ranking uses progress only and orders ties alphabetically',()=>{
  assert.deepEqual(sortLeaderboard(rows).map(row=>row.first_name),['Juan','Mateo','Sara','Laura']);
});

test('a student can find their position without exposing their full surname',()=>{
  const sorted=sortLeaderboard(rows),user={firstName:'Sara',lastName:'Gómez',course:'10.3'};
  assert.equal(isCurrentStudent(sorted[2],user),true);
  assert.equal(currentStudentRank(sorted,user),1);
  assert.equal(displayedRank(sorted,0),1);
  assert.equal(displayedRank(sorted,1),1);
  assert.equal(displayedRank(sorted,3),4);
});

