import test from 'node:test';
import assert from 'node:assert/strict';
import {claimProgressOwner,progressFromRemote,PROGRESS_OWNER_KEY} from './progressOwnership.js';

const store=initial=>{const values=new Map(Object.entries(initial||{}));return{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key),has:key=>values.has(key)};};

test('a different student never inherits progress from the previous browser user',()=>{
  const local=store({[PROGRESS_OWNER_KEY]:'student-a','valle-esmeralda-logic-progress':'{"11":{"complete":true}}','valle-esmeralda-player-metrics':'{"totalErrors":9}','valle-esmeralda-pilot-access':'granted'}),session=store({'valle-esmeralda-map-session-started':'true'});
  assert.equal(claimProgressOwner('student-b',local,session),true);
  assert.equal(local.getItem(PROGRESS_OWNER_KEY),'student-b');
  assert.equal(local.getItem('valle-esmeralda-logic-progress'),null);
  assert.equal(local.getItem('valle-esmeralda-player-metrics'),null);
  assert.equal(local.getItem('valle-esmeralda-pilot-access'),null);
  assert.equal(session.getItem('valle-esmeralda-map-session-started'),null);
});

test('the same student keeps their offline progress',()=>{
  const local=store({[PROGRESS_OWNER_KEY]:'student-a','valle-esmeralda-logic-progress':'saved'});
  assert.equal(claimProgressOwner('student-a',local,store()),false);
  assert.equal(local.getItem('valle-esmeralda-logic-progress'),'saved');
});

test('remote progress reconstructs totals after changing accounts',()=>{
  const restored=progressFromRemote({completed_levels:[3,1,2],stars:5,crystals:2,total_errors:7});
  assert.deepEqual(Object.keys(restored.progress),['1','2','3']);
  assert.equal(Object.values(restored.progress).reduce((sum,item)=>sum+item.stars,0),5);
  assert.equal(Object.values(restored.progress).reduce((sum,item)=>sum+item.crystal,0),2);
  assert.equal(restored.metrics.totalErrors,7);
});
