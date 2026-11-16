const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const daily=fs.readFileSync('daily-checkout.js','utf8');
const fixed=fs.readFileSync('product-page.js','utf8');
for(const language of ['en','zh-HK'])for(const width of [390,768,1440]){
 test(`custom checkout defaults ${language} at ${width}px`,()=>{
  const fragment=daily.match(/<select id="dailyDestination"[\s\S]*?<\/select>/)[0];
  const html=vm.runInNewContext('`'+fragment+'`',{t:(en,zh)=>language==='en'?en:zh,matchMedia:()=>({matches:width<=760})});
  assert.match(html,new RegExp('value="'+(language==='en'?'GB':'HK')+'" selected'));
  assert.doesNotMatch(html,/value=""/);
 });
 test(`fixed checkout defaults ${language} at ${width}px`,()=>{
  const line=fixed.split('\n').find(l=>l.includes('fixedDestination.add(new Option'));
  const destination={options:[{}, {}, {}],add(){},value:''};let updates=0;
  vm.runInNewContext(line,{fixedDestination:destination,Option:function(){},t:(en,zh)=>language==='en'?en:zh,updateDelivery:()=>updates++,matchMedia:()=>({matches:width<=760})});
  assert.equal(destination.value,language==='en'?'GB':'HK');assert.equal(updates,1);
 });
}
