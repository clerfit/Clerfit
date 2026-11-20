#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), read = file => fs.readFileSync(path.join(root, file), 'utf8');
function parseCsv(text) {
 const rows=[]; let row=[], value='', quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i]; if(quoted){if(c==='"'){if(text[i+1]==='"'){value+='"';i++;}else quoted=false;}else value+=c;}
 else if(c==='"')quoted=true; else if(c===','){row.push(value);value='';}
 else if(c==='\n'){row.push(value.replace(/\r$/,''));if(row.some(x=>x!==''))rows.push(row);row=[];value='';}else value+=c;}
 if(value!==''||row.length){row.push(value.replace(/\r$/,''));rows.push(row);} assert.equal(quoted,false); return rows;
}
function decode(s){return s.replace(/&amp;/g,'&').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&quot;/g,'"').replace(/&#39;/g,"'");}
function meta(html, attr, value) {
 const tags=html.match(/<meta\b[^>]*>/gi)||[];
 for(const tag of tags){const attrs=Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));if(attrs[attr]===value)return decode(attrs.content||'');}
 return '';
}
function title(html){return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()||'';}
function description(html){return meta(html,'name','description');}
function canonical(html){return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]||'';}
function strip(html){return html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&(?:amp|nbsp|quot|#39|lt|gt);/g,' ').replace(/\s+/g,' ').trim();}
const locs=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locs.length,172,'sitemap should list 172 public URLs');
assert.equal(new Set(locs).size,172,'sitemap URLs should be unique');
const titles=[],descriptions=[];
for(const loc of locs){
 const url=new URL(loc), file=url.pathname.replace(/^\/Clerfit\//,'')||'index.html', html=read(file);
 const t=title(html), d=description(html), c=canonical(html);
 assert.ok(t,file+' requires a title'); assert.ok(d,file+' requires a description'); assert.ok(c,file+' requires a canonical URL');
 assert.equal(meta(html,'property','og:title'),t,file+' Open Graph title mismatch');
 assert.equal(meta(html,'property','og:description'),d,file+' Open Graph description mismatch');
 assert.equal(meta(html,'property','og:url'),c,file+' Open Graph canonical mismatch');
 assert.equal(meta(html,'property','og:type'),'website',file+' Open Graph type missing');
 assert.equal(meta(html,'property','og:site_name'),'ClerFit',file+' Open Graph site name missing');
 assert.equal(meta(html,'property','og:image'),'https://clerfit.github.io/Clerfit/logo.png',file+' social image missing');
 assert.equal(meta(html,'name','twitter:card'),'summary_large_image',file+' Twitter card missing');
 assert.equal(meta(html,'name','twitter:title'),t,file+' Twitter title mismatch');
 assert.equal(meta(html,'name','twitter:description'),d,file+' Twitter description mismatch');
 assert.equal(meta(html,'name','twitter:image'),'https://clerfit.github.io/Clerfit/logo.png',file+' Twitter image missing');
 titles.push(t); descriptions.push(d);
}
assert.equal(new Set(titles).size,172,'public titles must be unique');
assert.equal(new Set(descriptions).size,172,'public descriptions must be unique');
const registry=read('js/navigation.js').match(/const CALCULATORS\s*=\s*(\[[\s\S]*?\]);\s*\nconst path/);
assert.ok(registry,'calculator registry must be parseable');
const routes=JSON.parse(registry[1]); assert.equal(routes.length,164);
const summaries=new Set(), bodies=new Set();
for(const route of routes){
 const file='html/'+route.file, html=read(file);
 assert.equal(canonical(html),'https://clerfit.github.io/Clerfit/'+file,file+' canonical does not match route');
 const guides=[...html.matchAll(/<section class="cf-education-card"[\s\S]*?<\/section>/g)];
 assert.equal(guides.length,1,file+' must have exactly one guide');
 const guide=guides[0][0], summary=strip(guide.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1]||''), body=strip(guide);
 assert.ok(summary&&!/^Understand this calculator/i.test(summary),file+' needs a unique guide title');
 assert.ok(body.length>=500,file+' guide is too short');
 assert.ok(!/Enter values within the displayed ranges and review the method/i.test(body),file+' has generic guide placeholder copy');
 assert.ok(!summaries.has(summary),'duplicate guide title: '+summary);
 assert.ok(!bodies.has(body),'duplicate guide body for '+file);
 summaries.add(summary); bodies.add(body);
}
assert.equal(summaries.size,164); assert.equal(bodies.size,164);
const register=parseCsv(read('SCIENTIFIC_REVIEW_REGISTER.csv')),header=register[0],fidx=header.indexOf('file');
assert.ok(fidx>=0,'scientific register needs a file column');
const reviewed=register.slice(1).map(r=>r[fidx]).sort(), routed=routes.map(r=>r.file).sort();
assert.equal(reviewed.length,164,'scientific review register must cover every route');
assert.deepEqual(reviewed,routed,'scientific register must match route files');
assert.equal(new Set(reviewed).size,164,'scientific register cannot repeat a route');
const audit=JSON.parse(read('SEO_METADATA_AUDIT.json'));
assert.equal(audit.html_documents_checked,176); assert.equal(audit.public_pages_checked,172);
assert.equal(audit.unique_titles,176); assert.equal(audit.unique_descriptions,176); assert.deepEqual(audit.findings,[]);
console.log('Site content and SEO checks passed: 172 public URLs, 164 unique calculator guides, and 164 scientific-review entries.');
