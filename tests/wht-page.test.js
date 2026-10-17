#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const page = fs.readFileSync('html/wht.html', 'utf8');
const match = page.match(/<script>\s*([\s\S]*?)<\/script>/i);
assert.ok(match, 'WHtR page must include its calculator logic.');
class Element {
  constructor(value='') { this.value=String(value); this.min=''; this.max=''; this.hidden=false; this.attributes={}; this.focused=false; this._html=''; this._text=''; }
  set innerHTML(v) { this._html=String(v); this._text=this._html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }
  get innerHTML() { return this._html; }
  get textContent() { return this._text; }
  set textContent(v) { this._text=String(v); this._html=this._text; }
  setAttribute(k,v) { this.attributes[k]=String(v); }
  getAttribute(k) { return this.attributes[k] ?? null; }
  removeAttribute(k) { delete this.attributes[k]; }
  remove() { this.removed=true; }
  focus() { this.focused=true; }
}
const ids={waist:new Element('80'),waistUnit:new Element('cm'),height:new Element('180'),heightUnit:new Element('cm'),result:new Element(),formula:new Element()};
const errors=[];
const bar=new Element(); bar.hidden=false;
const document={
 addEventListener(){},
 getElementById(id){assert.ok(ids[id], 'Unexpected DOM lookup '+id); return ids[id];},
 querySelector(s){return s==='.bar-container'?bar:null;},
 querySelectorAll(s){return s==='.clerfit-input-error'?errors:[];}
};
const context=vm.createContext({document,console,Math,Number,Object,Promise,String});
vm.runInContext(match[1],context,{filename:'html/wht.html:inline-script',timeout:3000});
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
function set(v){Object.entries(v).forEach(([k,x])=>ids[k].value=String(x));}
function clear(){set({waist:80,waistUnit:'cm',height:180,heightUnit:'cm'});context.clearWHtROutput();context.syncWHtRBounds();bar.hidden=false;}
function out(id='result'){return ids[id].textContent||ids[id].innerHTML;}
test('known answer 80cm / 180cm = 0.444',()=>{clear();context.calculateWHtR();assert.match(out(),/0\.444/);assert.match(out('formula'),/80\.0.*180\.0.*0\.444/);assert.equal(bar.hidden,true);});
test('mixed units are converted to centimetres correctly',()=>{clear();set({waist:31.49606299,waistUnit:'in',height:5.90551181,heightUnit:'ft'});context.calculateWHtR();assert.match(out(),/0\.444/);assert.match(out('formula'),/80\.0 cm.*180\.0 cm/);});
test('unit-specific field bounds update correctly',()=>{clear();set({waistUnit:'m',heightUnit:'ft'});context.syncWHtRBounds();assert.equal(ids.waist.min,'0.2');assert.equal(ids.waist.max,'2.5');assert.equal(ids.height.min,'1.64041995');assert.equal(ids.height.max,'8.20209974');});
test('empty, zero and negative inputs are rejected without stale results',()=>{for(const v of [{waist:''},{height:''},{waist:0},{height:-1}]){clear();context.calculateWHtR();set(v);context.calculateWHtR();assert.match(out(),/Enter valid positive waist and height/);assert.equal(out('formula'),'');}});
test('measurements outside the domain are rejected',()=>{for(const v of [{waist:19.9},{waist:250.1},{height:49.9},{height:250.1}]){clear();set(v);context.calculateWHtR();assert.match(out(),/Check that waist is/);assert.equal(out('formula'),'');}});
test('supported domain endpoints are accepted',()=>{clear();set({waist:20,height:50});context.calculateWHtR();assert.match(out(),/0\.400/);clear();set({waist:250,height:250});context.calculateWHtR();assert.match(out(),/1\.000/);});
test('reset clears inputs and outputs, restores cm bounds and focuses waist',()=>{clear();context.calculateWHtR();context.resetWHtR();assert.equal(ids.waist.value,'');assert.equal(ids.height.value,'');assert.equal(ids.waistUnit.value,'cm');assert.equal(ids.heightUnit.value,'cm');assert.equal(out(),'');assert.equal(out('formula'),'');assert.equal(ids.waist.min,'20');assert.equal(ids.waist.max,'250');assert.equal(ids.waist.focused,true);});
test('page has unique charset, accessible result and reset control, no obsolete risk legend',()=>{assert.equal((page.match(/<meta charset=/gi)||[]).length,1);assert.match(page,/id="result" role="status" aria-live="polite"/);assert.match(page,/onclick="resetWHtR\(\)"/);assert.doesNotMatch(page,/Blue: Underfat|Orange: Overweight Risk|googletagmanager|google-analytics/i);assert.match(page,/does not change the calculation|not a universal category/i);});
console.log('WHtR page regression checks passed: '+checks);
