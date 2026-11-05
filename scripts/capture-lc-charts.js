const { chromium } = require('playwright');

// Capture the enlarged chat charts of the published liquid-crystal examples for
// public/aims-liquid-crystals.html (one PNG per chart, the app's own rendering).
const base = 'https://aims.intofuture.org/?viewonly=true&userid=HgVr8Ex4o9YsAjgku4RICvBldJK2&project=';
const projects = [
  {
    title: 'Modeling Liquid Crystals with Gay-Berne Particles',
    outs: [
      'aims-lc-clearing-point',
      'aims-lc-pixel-switch',
      'aims-lc-constant-pressure',
      'aims-lc-layers',
      'aims-lc-layer-profile',
      'aims-lc-quench',
    ],
  },
  {
    title: 'Mixing Long and Short Rods in a Liquid Crystal',
    outs: ['aims-lc-mixture-by-kind', 'aims-lc-mixture-compositions'],
  },
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  for (const p of projects) {
    const page = await context.newPage();
    console.log('Loading', p.title);
    await page.goto(base + encodeURIComponent(p.title), { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => console.log('goto warn:', e.message));
    await page.waitForSelector('[data-report-attachment]', { timeout: 60000 });
    await page.waitForTimeout(3000);
    const cards = page.locator('[data-report-attachment]');
    const n = await cards.count();
    console.log(`  ${n} chart card(s)`);
    if (n !== p.outs.length) throw new Error(`expected ${p.outs.length} charts in "${p.title}", found ${n}`);
    for (let i = 0; i < n; i++) {
      await cards.nth(i).locator('[aria-label]').first().click();
      const modal = page.locator('.ant-modal-content').last();
      await modal.waitFor({ state: 'visible' });
      await page.waitForTimeout(1200); // let the chart finish its entry animation
      await page.mouse.move(2, 2); // no hover tooltip on the chart
      const out = `public/image/${p.outs[i]}.png`;
      await modal.screenshot({ path: out });
      console.log('  saved', out);
      await page.keyboard.press('Escape');
      await modal.waitFor({ state: 'hidden' }).catch(() => {});
      await page.waitForTimeout(500);
    }
    await page.close();
  }
  await browser.close();
})();
