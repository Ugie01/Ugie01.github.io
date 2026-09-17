// Run with Playwright available through NODE_PATH. Uses Edge by default on Windows.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.local-preview');
fs.mkdirSync(output, { recursive: true });
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173';
const widths = [280, 320, 360, 375, 390, 412, 430, 768, 1024, 1440, 1920];
const pages = ['index.html', ...['fms', 'gosung', 'aiming', 'tracking', 'vip', 'plc'].map(id => `projects/${id}.html`)];
(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  const results = [];
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      for (const url of pages) {
        await page.goto(`${base}/${url}`, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await Promise.all([...document.images].map(async img => { img.loading = 'eager'; try { await img.decode(); } catch {} }));
          await document.fonts.ready;
        });
        const state = await page.evaluate(() => {
          const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
          const out = [...document.querySelectorAll('body *')].filter(el => {
            if (!visible(el) || el.matches('.sr-only, .skip-link')) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
          }).map(el => `${el.tagName}.${el.className}`);
          const broken = [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src'));
          // Flow arrows intentionally sit between boxes, outside each list item's width.
          const clipped = [...document.querySelectorAll('p,h1,h2,h3,button,.tags li,.system-layer')].filter(el => visible(el) && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)).map(el => `${el.tagName}.${el.className}[${el.scrollWidth}x${el.scrollHeight}/${el.clientWidth}x${el.clientHeight}]`);
          const controls = [...document.querySelectorAll('.button,.filters button,.menu-toggle,.nav-links a')].filter(visible);
          const small = controls.filter(el => el.getBoundingClientRect().height < 43).map(el => el.textContent);
          const overlaps = [];
          for (let i=0;i<controls.length;i++) for(let j=i+1;j<controls.length;j++) {
            const a=controls[i].getBoundingClientRect(), b=controls[j].getBoundingClientRect();
            if (Math.min(a.right,b.right)-Math.max(a.left,b.left)>2 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2) overlaps.push([controls[i].textContent,controls[j].textContent]);
          }
          return { overflow: document.documentElement.scrollWidth > innerWidth, out, broken, clipped, small, overlaps, height: document.documentElement.scrollHeight };
        });
        results.push({ width, page: url, ...state });
        assert.equal(state.overflow, false, `${width} ${url}: horizontal overflow`);
        for (const key of ['out','broken','clipped','small','overlaps']) assert.deepEqual(state[key], [], `${width} ${url}: ${key}`);
        if ((width===390 || width===1440) && (url==='index.html' || url==='projects/gosung.html' || url==='projects/fms.html')) {
          await page.screenshot({ path:path.join(output,`${url.replace(/[/.]/g,'-')}-${width}.png`), fullPage:true });
          if(url==='index.html') await page.screenshot({path:path.join(output,`home-${width}.png`)});
        }
      }
    }
    await page.goto(base);
    for(const [filter,count] of [['robot',2],['embedded',3],['all',5]]) {
      await page.locator(`[data-filter="${filter}"]`).click();
      assert.equal(await page.locator('[data-category]:visible').count(),count);
      assert.equal(await page.locator(`[data-filter="${filter}"]`).getAttribute('aria-pressed'),'true');
    }
    for(const width of widths.filter(w=>w<=768)) {
      await page.setViewportSize({width,height:900});
      await page.goto(base);
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      await page.locator('.menu-toggle').click();
      await page.locator('#nav-links a[href="#projects"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    }
    // Without JS, full content, ordinary navigation and project links still work.
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});
    const raw=await nojs.newPage();await raw.goto(base);
    assert.equal(await raw.locator('[data-category]:visible').count(),5);
    assert.equal(await raw.locator('#nav-links').isVisible(),true);
    assert.equal(await raw.locator('.filters').isVisible(),false);
    await raw.locator('h3 a[href="projects/gosung.html"]').click();
    assert.equal(await raw.locator('h1').textContent(),'GoSung');
    await nojs.close();
    // Check relative references and fragment IDs across every static HTML page.
    for (const url of pages) {
      await page.goto(`${base}/${url}`);
      const refs=await page.locator('a[href],img[src],script[src],link[href]').evaluateAll(els=>els.map(el=>el.getAttribute('href')||el.getAttribute('src')));
      for(const ref of refs) {
        if(/^(https?:|mailto:|data:)/.test(ref)) continue;
        const [pathAndQuery,hash]=ref.split('#');const file=pathAndQuery.split('?')[0];const target=file?path.resolve(root,path.dirname(url),decodeURIComponent(file)):path.resolve(root,url);
        assert.ok(fs.existsSync(target),`${url}: missing ${ref}`);
        if(hash && target.endsWith('.html')) assert.ok(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`${url}: missing fragment ${ref}`);
      }
    }
    await page.goto(`${base}/404.html`);assert.equal(await page.locator('h1').textContent(),'페이지를 찾을 수 없습니다.');
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({browser:await browser.version(),results,errors,interactionTests:'passed',noJavaScript:'passed',relativeReferences:'passed'},null,2));
    console.log(`PASS: ${results.length} page/viewport checks; filters, menus, no-JS and local references.`);
  } finally {
    fs.writeFileSync(path.join(output,'latest-checks.json'),JSON.stringify({results,errors},null,2));
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
