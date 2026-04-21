// One-shot refactor: energy2d.html table-for-layout -> Bootstrap row/cols + .testimonial divs.
// Keeps all original content; only rewrites the layout wrappers and the testimonials structure.

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'public', 'energy2d.html');
let html = fs.readFileSync(FILE, 'utf8');

// --- 1. Outer table open -> row + col-md-8 ------------------------------------------------
html = html.replace(
    /<table>\n<tr>\n<td valign="top">/,
    '<div class="row">\n<div class="col-md-8">'
);

// --- 2. Inner testimonials table -> .testimonials / .testimonial divs ---------------------
// Match from the SECOND <table> (after the refactor of the first table above, this is now
// the first remaining <table> in the file) through its matching </table>.
const testimonialTableRe = /<table>\n((?:(?!<\/table>)[\s\S])*?)<\/table>/;
const testimonialsMatch = html.match(testimonialTableRe);
if (!testimonialsMatch) throw new Error('testimonials table not found');

// Parse each testimonial row. Accept both live <tr>...</tr> and commented <!-- <tr>...</tr> -->.
const rowRe = /<tr>\s*<td[^>]*><img src="image\/([^"]+)"[^>]*><\/td>\s*<td[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/td>\s*<\/tr>/g;

const testimonials = [];
const commentRe = /<!--([\s\S]*?)-->/g;
const hiddenTestimonials = [];

// Find live testimonials (outside comments).
const innerBody = testimonialsMatch[1];
// Remove comment regions from the scan for live rows:
const liveBody = innerBody.replace(commentRe, '');
let m;
while ((m = rowRe.exec(liveBody)) !== null) {
    const country = m[1].replace(/\.png$/, '').replace(/_/g, ' ');
    const quote = m[2].trim();
    testimonials.push({ country, src: m[1], quote });
}

// Find commented testimonials to preserve as HTML comments.
innerBody.replace(commentRe, (_, commentContent) => {
    rowRe.lastIndex = 0;
    let cm;
    while ((cm = rowRe.exec(commentContent)) !== null) {
        const country = cm[1].replace(/\.png$/, '').replace(/_/g, ' ');
        const quote = cm[2].trim();
        hiddenTestimonials.push({ country, src: cm[1], quote });
    }
    return '';
});

function renderTestimonial(t) {
    return `<div class="testimonial">
<img class="testimonial-flag" src="image/${t.src}" alt="${t.country}">
<p class="testimonial-quote">${t.quote}</p>
</div>`;
}

const testimonialsBlock = [
    '<div class="testimonials">',
    '',
    ...testimonials.map((t) => renderTestimonial(t) + '\n'),
    ...hiddenTestimonials.map((t) => '<!--\n' + renderTestimonial(t) + '\n-->\n'),
    '</div>',
].join('\n');

html = html.replace(testimonialTableRe, testimonialsBlock);

// --- 3. Main/sidebar boundary -------------------------------------------------------------
// Original: </td>  blank  blank  <td width="30%" ...>  <div style="background:white...">
// Becomes:  close col-md-8, open col-md-4 + .product-sidebar
html = html.replace(
    /<\/td>\n\n\n<td width="30%"[^>]*>\n<div style="background:white[^"]*">/,
    '</div>\n<div class="col-md-4">\n<div class="product-sidebar">'
);

// --- 4. Outer table close -> close product-sidebar + col-md-4 + row -----------------------
// The legacy inline-style <div> on old line 360 was never explicitly closed; we add its close
// now as part of the wrap-up, then close col-md-4 and row.
html = html.replace(
    /<\/td>\n<\/tr>\n\n\n<\/table>/,
    '</div>\n</div>\n</div>'
);

fs.writeFileSync(FILE, html);
console.log(`rewrote ${FILE}`);
console.log(`  live testimonials: ${testimonials.length}`);
console.log(`  preserved commented testimonials: ${hiddenTestimonials.length}`);
