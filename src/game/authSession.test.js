import test from 'node:test';
import assert from 'node:assert/strict';
import {AUTH_SESSION_KEY,clearAuthSession,readAuthSession,startPreviewSession} from './authSession.js';

const createStore=()=>{const data=new Map();return{getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};};
global.localStorage=createStore();
global.sessionStorage=createStore();

test('preview session stores identity but never a password',()=>{
  const session=startPreviewSession({name:'  Luna  ',email:'LUNA@EJEMPLO.COM'},true);
  assert.deepEqual(session,{name:'Luna',email:'luna@ejemplo.com',preview:true});
  assert.equal(localStorage.getItem(AUTH_SESSION_KEY).includes('password'),false);
  assert.deepEqual(readAuthSession(),session);
});

test('closing the preview session clears both browser stores',()=>{
  startPreviewSession({name:'Sol',email:'sol@ejemplo.com'},false);
  clearAuthSession();
  assert.equal(readAuthSession(),null);
});
