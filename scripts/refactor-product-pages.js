// Convert the outer <table><tr><td valign="top">...<td width="XX%">...</tr></table>
// layout on product pages into responsive Bootstrap col-md-8 / col-md-4 wrappers.
// Only touches the OUTERMOST table via depth-aware parsing — nested tables (like the
// kyla-price testimonial on iflow.html and the code-comparison on iflow.html) are preserved.
//
// Skips energy2d.html because its conversion was already done with more substantial edits
// (testimonial table -> flex divs).

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PAGES = ['aims', 'aladdin', 'iflow', 'ie', 'telelab', 'nexlab', 'scifi', 'quantum', 'isv'];

// Find the outermost <table>...</table> span starting from an index.
function findOutermostTable(html, startFrom = 0) {
    const openRe = /<table[^>]*>/gi;
    const closeRe = /<\/table>/gi;
    openRe.lastIndex = startFrom;
    const first = openRe.exec(html);
    if (!first) return null;
    const openStart = first.index;
    let depth = 1;
    let pos = openRe.lastIndex;
    while (depth > 0) {
        openRe.lastIndex = pos;
        closeRe.lastIndex = pos;
        const nextOpen = openRe.exec(html);
        const nextClose = closeRe.exec(html);
        if (!nextClose) return null;
        if (nextOpen && nextOpen.index < nextClose.index) {
            depth++;
            pos = openRe.lastIndex;
        } else {
            depth--;
            pos = closeRe.lastIndex;
            if (depth === 0) return { start: openStart, end: closeRe.lastIndex };
        }
    }
    return null;
}

function transformPage(html) {
    const span = findOutermostTable(html);
    if (!span) return { html, changed: false, reason: 'no table found' };

    const slice = html.slice(span.start, span.end);

    // The outer table must open with <table>\n<tr>\n<td...> or <tr><td...> on one line.
    const openMatch = slice.match(/^<table[^>]*>\s*<tr[^>]*>\s*<td[^>]*>/);
    if (!openMatch) return { html, changed: false, reason: 'outer td open not recognized' };

    // Find the sidebar cell boundary: optional </td> then <td width="XX%" ...>[optional sidebar div].
    // The </td> is optional because some pages (e.g. scifi.html) have loose markup without it.
    const sidebarRe = /(?:<\/td>\s*)?<td\s+width="\d+%"[^>]*>\s*(?:<div\s+style="background:\s*white[^"]*">)?/;
    const sidebarMatch = slice.match(sidebarRe);
    if (!sidebarMatch) return { html, changed: false, reason: 'sidebar td boundary not recognized' };

    // Find the closing of the outer table: </td></tr></table>
    const closeRe = /<\/td>\s*<\/tr>\s*<\/table>\s*$/;
    const closeMatch = slice.match(closeRe);
    if (!closeMatch) return { html, changed: false, reason: 'outer close not recognized' };

    // Replace opening
    let out = slice.replace(openMatch[0], '<div class="row">\n<div class="col-md-8">');
    // Replace sidebar boundary
    out = out.replace(sidebarRe, '</div>\n<div class="col-md-4">\n<div class="product-sidebar">');
    // Replace closing
    out = out.replace(closeRe, '</div>\n</div>\n</div>');

    const newHtml = html.slice(0, span.start) + out + html.slice(span.end);
    return { html: newHtml, changed: true };
}

const results = [];
for (const name of PAGES) {
    const file = path.join(PUBLIC_DIR, `${name}.html`);
    if (!fs.existsSync(file)) { results.push({ name, skipped: 'no file' }); continue; }
    const before = fs.readFileSync(file, 'utf8');
    const { html, changed, reason } = transformPage(before);
    if (!changed) { results.push({ name, skipped: reason }); continue; }
    fs.writeFileSync(file, html);
    results.push({ name, ok: true });
}

for (const r of results) {
    if (r.ok) console.log(`  ✓ ${r.name}`);
    else console.log(`  ✗ ${r.name}: ${r.skipped}`);
}
