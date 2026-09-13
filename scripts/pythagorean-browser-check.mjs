import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/USUARIO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
async function nudge(key,ms=130){await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);await page.waitForTimeout(35);}
try{
 await page.addInitScript(()=>{Math.random=()=>.1;});await page.goto('http://127.0.0.1:5173/?level=68&jump=2');await page.locator('.pyth-hero').waitFor();
 assert.equal(await page.locator('.boss-life strong').innerText(),'16/16');assert.equal(await page.locator('.energy').innerText(),'♥ ♥');assert.equal(await page.locator('.colossus.traversing').count(),0);assert.equal(await page.locator('.boss-ground-rock').count(),0);
 const bossRight=await page.locator('.colossus').evaluate(el=>getComputedStyle(el).right);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(520);await page.keyboard.up('ArrowRight');const beforeJump=await page.locator('.pyth-hero').boundingBox();await page.keyboard.press('Space');await page.waitForTimeout(220);const duringJump=await page.locator('.pyth-hero').boundingBox();assert.ok(await page.locator('.pyth-hero.jumping').count(),'space triggers the natural jump after walking');assert.ok(duringJump.y<beforeJump.y-20&&duringJump.x>beforeJump.x+12,'the jump rises and preserves walking momentum after the direction is released');
 await page.locator('.counter-stone').waitFor({timeout:10000});
 const stone=page.locator('.counter-stone');for(let i=0;i<25&&!await stone.evaluate(el=>el.classList.contains('ready'));i++){const [heroX,stoneX]=await Promise.all([page.locator('.pyth-hero').evaluate(el=>parseFloat(el.style.left)),stone.evaluate(el=>parseFloat(el.style.left))]);await nudge(heroX>stoneX+.5?'ArrowLeft':'ArrowRight');}
 assert.ok(await stone.evaluate(el=>el.classList.contains('ready')));assert.match(await page.locator('.pyth-controls button').nth(1).innerText(),/PATEAR/);await page.keyboard.press('Space');await page.locator('.kicked-rock-flight').waitFor({timeout:800});await page.waitForTimeout(280);const flightBox=await page.locator('.kicked-rock-flight').boundingBox();assert.ok(flightBox&&flightBox.y<560,'the kicked stone remains clearly visible during its arc');await page.locator('.boss-life strong').getByText('15/16',{exact:true}).waitFor({timeout:2500});
 await page.waitForTimeout(1200);assert.equal(await page.locator('.colossus').evaluate(el=>getComputedStyle(el).right),bossRight);assert.equal(await page.locator('.boss-ground-rock').count(),0);assert.equal(errors.length,0,errors.join('\n'));console.log('Level 68 passed: no horizontal rocks, natural contextual jump/kick, two hearts, and 16 boss health.');
}finally{await browser.close();}






