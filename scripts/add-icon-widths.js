// Add a matching width attribute to inline icon <img> tags that have height="N" but no width.
// Also adds vertical-align: middle for consistent inline alignment with adjacent text.
// These icons (e.g., under-construction.png) were relying on the height attribute alone, which
// gets overridden by any CSS height rule. Explicit width+height pins the size unambiguously.

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Match <img> tags that have height="N" (digits only — excludes already-bad "12px" form)
// AND do NOT already have a width attribute.
const IMG_RE = /<img(?![^>]*\bwidth=)([^>]*?\bheight="(\d+)"[^>]*?)>/g;

function transform(html) {
    let changed = 0;
    const out = html.replace(IMG_RE, (whole, inner, h) => {
        changed++;
        // Preserve existing attrs; add width + vertical-align style if not present.
        const hasStyle = /\bstyle=/.test(inner);
        const widthAttr = ` width="${h}"`;
        if (hasStyle) {
            // Merge into existing style
            const withWidth = inner.replace(
                /\bstyle="([^"]*)"/,
                (_, s) => `style="${s}${s.endsWith(';') || s === '' ? '' : '; '}vertical-align: middle"`
            );
            return `<img${widthAttr}${withWidth}>`;
        }
        return `<img${widthAttr}${inner} style="vertical-align: middle">`;
    });
    return { out, changed };
}

const files = fs.readdirSync(PUBLIC_DIR).filter((f) => f.endsWith('.html'));
let totalTouched = 0;
let totalIcons = 0;
for (const f of files) {
    const p = path.join(PUBLIC_DIR, f);
    const orig = fs.readFileSync(p, 'utf8');
    const { out, changed } = transform(orig);
    if (changed === 0) continue;
    fs.writeFileSync(p, out);
    totalTouched++;
    totalIcons += changed;
    console.log(`  ${f}: +${changed} icon${changed !== 1 ? 's' : ''}`);
}
console.log(`pages touched: ${totalTouched}, icons fixed: ${totalIcons}`);
