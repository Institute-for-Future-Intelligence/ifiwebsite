const { chromium } = require('playwright');

// Regenerate the static poster screenshots used by the click-to-load embeds on public/aims.html.
const base = 'https://aims.intofuture.org/?viewonly=true&userid=HgVr8Ex4o9YsAjgku4RICvBldJK2&project=';
const shots = [
  { url: base + encodeURIComponent('Water Molecules in a Carbon Nanotube'), out: 'public/image/aims-poster-water-nanotube.png' },
  { url: base + encodeURIComponent('HIV-1 Protease Inhibitor'), out: 'public/image/aims-poster-hiv-protease.png' },
  { url: base + encodeURIComponent('Simple Molecular Crystals'), out: 'public/image/aims-poster-crystal-builder.png' },
  { url: base + encodeURIComponent('Copolymers'), out: 'public/image/aims-poster-polymers.png' },
  { url: base + encodeURIComponent('Semiconductors'), out: 'public/image/aims-poster-semiconductors.png' },
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 960, height: 640 },
    deviceScaleFactor: 2,
  });
  for (const s of shots) {
    const page = await context.newPage();
    console.log('Loading', s.url);
    await page.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto warn:', e.message));
    await page.waitForTimeout(6000); // let WebGL simulation render
    await page.screenshot({ path: s.out });
    console.log('Saved', s.out);
    await page.close();
  }
  await browser.close();
})();
