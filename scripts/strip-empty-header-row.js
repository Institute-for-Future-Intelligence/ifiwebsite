// Cleanup: strip-invisible-h1.js removed the <div class="page-header-wrap"> but left behind
// the enclosing <div class="row"><div class="col-sm-12"></div></div> scaffold that used to
// contain it. These empty wrappers add no visual content but contribute DOM noise and can
// cause subtle spacing issues. Remove the empty pair where it exists.

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SKIP = new Set(['index.html', 'godaddy.html', 'google4c251c1ac593094f.html']);

// Match the exact shape: <div class="row">[whitespace]<div class="col-sm-12">[only whitespace]</div>[whitespace]</div>
const EMPTY_ROW_RE = /\s*<div class="row">\s*<div class="col-sm-12">\s*<\/div>\s*<\/div>/;

const files = fs
    .readdirSync(PUBLIC_DIR)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f));

let removed = 0;
for (const f of files) {
    const p = path.join(PUBLIC_DIR, f);
    const orig = fs.readFileSync(p, 'utf8');
    if (!EMPTY_ROW_RE.test(orig)) continue;
    fs.writeFileSync(p, orig.replace(EMPTY_ROW_RE, ''));
    removed++;
}
console.log(`empty header row removed from ${removed} file(s)`);
