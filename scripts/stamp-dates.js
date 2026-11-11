// Stamps "Updated <date>" into the byline of every article in public/, using the
// file's last-modified time. Runs before each `firebase deploy` (see firebase.json).
//
// - The stamp is a <span class="v2-updated"> appended to the <p class="v2-byline">,
//   so re-running replaces it instead of adding another.
// - A byline that already has a hand-written date (e.g. "· March 31, 2026") keeps it;
//   the "Updated" stamp is added only when the file was modified on a later day.
// - After rewriting a file, its original modified time is restored, so stamping never
//   counts as an update by itself.
//
// Usage: node scripts/stamp-dates.js

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'public');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const BYLINE = /(<p class="v2-byline">)([\s\S]*?)(<\/p>)/;
const STAMP = /\s*&middot;\s*<span class="v2-updated">[^<]*<\/span>/;
const MANUAL_DATE = new RegExp('(' + MONTHS.join('|') + ') (\\d{1,2}), (\\d{4})');

const dayKey = (d) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const formatDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

let changed = 0;
let articles = 0;
const changedNames = [];

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith('.html')) continue;
  const file = path.join(root, name);
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(BYLINE);
  if (!match) continue;
  articles++;

  const stat = fs.statSync(file);
  const modified = stat.mtime;

  // Strip any previous stamp, then trim trailing whitespace inside the byline.
  const body = match[2].replace(STAMP, '');
  const content = body.replace(/\s+$/, '');
  const trailing = body.slice(content.length);

  let stamped = content;
  const manual = content.match(MANUAL_DATE);
  const manualDate = manual
    ? new Date(+manual[3], MONTHS.indexOf(manual[1]), +manual[2])
    : null;
  if (!manualDate || dayKey(modified) > dayKey(manualDate)) {
    stamped += ` &middot; <span class="v2-updated">Updated ${formatDate(modified)}</span>`;
  }

  const next = html.replace(BYLINE, match[1] + stamped + trailing + match[3]);
  if (next !== html) {
    fs.writeFileSync(file, next);
    fs.utimesSync(file, stat.atime, stat.mtime);
    changed++;
    changedNames.push(name);
  }
}

// Firebase's upload cache (.firebase/hosting.*.cache) identifies a file by its modified
// time. Since the original time is restored above, drop the entries of rewritten files
// so firebase deploy rehashes and uploads them.
if (changedNames.length) {
  const cacheDir = path.resolve(__dirname, '..', '.firebase');
  const names = new Set(changedNames);
  for (const f of fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : []) {
    if (!f.endsWith('.cache')) continue;
    const cacheFile = path.join(cacheDir, f);
    const lines = fs.readFileSync(cacheFile, 'utf8').split('\n');
    const kept = lines.filter((l) => !names.has(l.split(',')[0]));
    if (kept.length !== lines.length) fs.writeFileSync(cacheFile, kept.join('\n'));
  }
}

console.log(`stamp-dates: ${articles} articles, ${changed} updated`);
