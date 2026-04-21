const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SKIP = new Set(['godaddy.html', 'google4c251c1ac593094f.html']);

const HEADER_RE = /<header id="navbar"[\s\S]*?<\/header>/;
const FOOTER_RE = /<footer class="footer container">[\s\S]*?<\/footer>/;
const LOADER_TAG = '<script src="js/include.js"></script>';

function transform(html) {
    const changes = [];
    let out = html;

    if (HEADER_RE.test(out)) {
        out = out.replace(HEADER_RE, '<script>includeHeader();</script>');
        changes.push('header');
    }
    if (FOOTER_RE.test(out)) {
        out = out.replace(FOOTER_RE, '<script>includeFooter();</script>');
        changes.push('footer');
    }
    if (changes.length > 0 && !out.includes('js/include.js')) {
        out = out.replace(/(<body[^>]*>)/, `$1\n${LOADER_TAG}`);
        changes.push('loader');
    }
    return { out, changes };
}

const files = fs
    .readdirSync(PUBLIC_DIR)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f));

let transformed = 0;
let skipped = 0;
const noHeader = [];
const noFooter = [];

for (const f of files) {
    const p = path.join(PUBLIC_DIR, f);
    const orig = fs.readFileSync(p, 'utf8');
    const { out, changes } = transform(orig);
    if (changes.length === 0) {
        skipped++;
        continue;
    }
    if (!changes.includes('header')) noHeader.push(f);
    if (!changes.includes('footer')) noFooter.push(f);
    fs.writeFileSync(p, out);
    transformed++;
}

console.log(`transformed: ${transformed}, unchanged: ${skipped}, total scanned: ${files.length}`);
if (noHeader.length) console.log(`no header block: ${noHeader.join(', ')}`);
if (noFooter.length) console.log(`no footer block: ${noFooter.join(', ')}`);
