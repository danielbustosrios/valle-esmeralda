import test from 'node:test';
import assert from 'node:assert/strict';
import {accessCodeEmail,isValidAccessCode,normalizeAccessCode} from './accessCode.js';

test('normaliza el código a seis cifras',()=>{
  assert.equal(normalizeAccessCode(' 70-56 95 '),'705695');
  assert.equal(normalizeAccessCode('1234567'),'123456');
});

test('acepta únicamente códigos completos',()=>{
  assert.equal(isValidAccessCode('705695'),true);
  assert.equal(isValidAccessCode('70569'),false);
});

test('produce el identificador privado usado por Supabase',()=>{
  assert.equal(accessCodeEmail('705695'),'705695@estudiantes.valle-esmeralda.invalid');
});
