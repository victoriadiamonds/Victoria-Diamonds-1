const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
for(const [file,selector] of [['daily-checkout.js','id="dailyDestination"'],['product-page.js','name="deliveryDestination"']]){
 const source=fs.readFileSync(new URL(file,'file:///'+__dirname.replaceAll('\\','/')+'/../'),'utf8');
 const start=source.indexOf('<select '+selector);
 const fragment=source.slice(start,source.indexOf('</select>',start)+9);
 for(const language of ['en','zh-HK'])test(`${file}: UK default and Hong Kong alternative in ${language}`,()=>{
  const html=vm.runInNewContext('`'+fragment+'`',{t:(en,zh)=>language==='en'?en:zh});
  assert.deepEqual([...html.matchAll(/<option value="([^"]+)"([^>]*)>/g)].map(([,value,attributes])=>[value,attributes.trim()]),[['GB','selected'],['HK','']]);
 });
}
