import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/USUARIO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const pages=[
  ['map','?view=map'],['shop','?view=shop'],['parabola','?level=1'],['dodge','?level=11'],
  ['logic','?level=15'],['graph','?level=21'],['maze','?level=26'],['rotating','?level=36'],
  ['darkness','?level=40'],['waves','?level=47'],['bomber','?level=60'],['island','?level=63'],['final','?level=68']
];
const results=[];
try{
  for(const [name,query] of pages){
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
    const errors=[];page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});page.on('pageerror',error=>errors.push(error.message));
    const started=Date.now();await page.goto(`http://127.0.0.1:5173/${query}`,{waitUntil:'networkidle'});
    const metrics=await page.evaluate(()=>{
      const visible=element=>{const style=getComputedStyle(element),box=element.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&box.width>0&&box.height>0;};
      const small=[...document.querySelectorAll('button,a,input')].filter(visible).map(element=>{const box=element.getBoundingClientRect();return{label:element.getAttribute('aria-label')||element.textContent?.trim().slice(0,36)||element.tagName,width:Math.round(box.width),height:Math.round(box.height)};}).filter(item=>item.width<40||item.height<40);
      const images=[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.src);
      const resources=performance.getEntriesByType('resource');
      return{scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth,scrollHeight:document.documentElement.scrollHeight,small:small.slice(0,8),missingImages:images,transferKB:Math.round(resources.reduce((sum,item)=>sum+(item.transferSize||0),0)/1024),resourceCount:resources.length};
    });
    results.push({name,loadMs:Date.now()-started,overflow:metrics.scrollWidth>metrics.innerWidth,...metrics,errors});
    await page.close();
  }
  console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
