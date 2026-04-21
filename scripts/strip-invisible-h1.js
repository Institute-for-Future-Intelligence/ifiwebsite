// Remove the inherited-from-homepage <div class="page-header-wrap"><h1 class="page-header">...IFI...</h1></div>
// from every page EXCEPT index.html. On non-homepage pages, this block is invisible (white text, no banner
// background) and only exists as a copy-paste artifact from the Drupal template. On index.html it's the hero
// title rewritten by initHomepage() in main.js, so leave it alone there.

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SKIP = new Set(['index.html', 'godaddy.html', 'google4c251c1ac593094f.html']);

// Match the wrap div and its contents, non-greedy. Expect to match a single block per page.
const WRAP_RE = /\s*<div class="page-header-wrap">[\s\S]*?<\/div>/;

const files = fs
    .readdirSync(PUBLIC_DIR)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f));

let removed = 0;
let untouched = 0;
const notFound = [];

for (const f of files) {
    const p = path.join(PUBLIC_DIR, f);
    const orig = fs.readFileSync(p, 'utf8');
    if (!WRAP_RE.test(orig)) {
        notFound.push(f);
        untouched++;
        continue;
    }
    const out = orig.replace(WRAP_RE, '');
    fs.writeFileSync(p, out);
    removed++;
}

console.log(`removed page-header-wrap from: ${removed}`);
console.log(`no page-header-wrap found:     ${untouched}`);
if (notFound.length && notFound.length < 15) {
    console.log('  pages with no wrap:', notFound.join(', '));
}
