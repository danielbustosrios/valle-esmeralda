import {test} from 'node:test';
import assert from 'node:assert/strict';
import {directionFromGesture} from './touchNavigation.js';

test('touch gestures cover every movement direction',()=>{
 assert.equal(directionFromGesture(45,4),'ArrowRight');
 assert.equal(directionFromGesture(-45,4),'ArrowLeft');
 assert.equal(directionFromGesture(3,-45),'ArrowUp');
 assert.equal(directionFromGesture(3,45),'ArrowDown');
});

test('small touches do not move the character accidentally',()=>{
 assert.equal(directionFromGesture(10,8),null);
});
