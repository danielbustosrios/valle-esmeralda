import test from 'node:test';
import assert from 'node:assert/strict';
import {clearLogicFailures,completionPercent,logicFailureCount,recordLogicFailure,requiresLogicRecovery,starterWorldsComplete,verifyPilotCode} from './pilotAccess.js';

const memory=new Map();
global.localStorage={getItem:key=>memory.has(key)?memory.get(key):null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};

test('the pilot code accepts exactly the configured four digits',()=>{
  assert.equal(verifyPilotCode('1026'),true);
  assert.equal(verifyPilotCode('102'),false);
  assert.equal(verifyPilotCode('9999'),false);
});

test('the pilot route requires completion of all four starter worlds',()=>{
  memory.clear();
  localStorage.setItem('valle-esmeralda-logic-progress',JSON.stringify({11:{crystal:1},17:{crystal:1},21:{crystal:1}}));
  assert.equal(starterWorldsComplete(),false);
  localStorage.setItem('valle-esmeralda-logic-progress',JSON.stringify({11:{crystal:1},17:{crystal:1},21:{crystal:1},26:{crystal:1}}));
  assert.equal(starterWorldsComplete(),true);
});

test('Puentes del Ingenio requests recovery after two failed attempts',()=>{
  memory.clear();
  assert.equal(recordLogicFailure(),1);
  assert.equal(requiresLogicRecovery(),false);
  assert.equal(recordLogicFailure(),2);
  assert.equal(requiresLogicRecovery(),true);
  clearLogicFailures();
  assert.equal(logicFailureCount(),0);
});

test('completion percentage counts finished levels without exceeding 100',()=>{
  assert.equal(completionPercent({1:{crystal:1},2:{complete:true},3:{stars:3}},68),3);
  assert.equal(completionPercent(Object.fromEntries(Array.from({length:70},(_,index)=>[index,{crystal:1}])),68),100);
});
