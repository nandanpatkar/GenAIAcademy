/*
 * Drives the running study app in Edge and screenshots each step.
 *   node drive.mjs <baseUrl> <shotDir>
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://localhost:5180/';
const SHOTS = process.argv[3] ?? './shots';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

fs.mkdirSync(SHOTS, { recursive: true });

const problems = [];
const note = (message) => {
  problems.push(message);
  console.log(`  !! ${message}`);
};

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1440,1000'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

let step = 0;
async function shot(name) {
  step += 1;
  const file = path.join(SHOTS, `${String(step).padStart(2, '0')}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  shot -> ${file}`);
}

const text = (sel) => page.$eval(sel, (el) => el.textContent.trim()).catch(() => null);
const count = (sel) => page.$$eval(sel, (els) => els.length).catch(() => 0);

/* ---- 1. library ------------------------------------------------------- */
await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
await page.waitForSelector('.course-card', { timeout: 30000 });

console.log('\n== Library ==');
console.log('  title:   ', await text('.page-head__title'));
console.log('  count:   ', await text('.library-search__count'));
console.log('  shelves: ', await page.$$eval('.library-shelf .section-title', (e) => e.map((x) => x.textContent.trim())));
console.log('  cards:   ', await count('.course-card'));
await shot('library');

if ((await count('.course-card')) !== 37) note(`expected 37 cards, saw ${await count('.course-card')}`);

/* ---- 2. search -------------------------------------------------------- */
console.log('\n== Search "routing" ==');
await page.type('.library-search__input', 'routing');
await new Promise((r) => setTimeout(r, 400));
console.log('  count:   ', await text('.library-search__count'));
console.log('  matches: ', await page.$$eval('.course-card__title', (e) => e.map((x) => x.textContent.trim())));
await shot('search-routing');

console.log('\n== Search "intermediate flows" (multi-word) ==');
await page.click('.library-search__input', { clickCount: 3 });
await page.type('.library-search__input', 'intermediate flows');
await new Promise((r) => setTimeout(r, 400));
console.log('  matches: ', await page.$$eval('.course-card__title', (e) => e.map((x) => x.textContent.trim())));

/* clear */
await page.click('.library-search__clear');
await new Promise((r) => setTimeout(r, 300));
if ((await count('.course-card')) !== 37) note('clear-search did not restore all cards');

/* ---- 3. open a lazily loaded Amazon Connect course -------------------- */
console.log('\n== Open "Routing Fundamentals" ==');
await page.type('.library-search__input', 'Routing Fundamentals');
await new Promise((r) => setTimeout(r, 400));
await page.click('.course-card [data-track], .course-card .btn--primary');
await page.waitForSelector('.course-hero__title', { timeout: 30000 });

console.log('  hero:    ', await text('.course-hero__title'));
console.log('  meta:    ', await text('.course-hero .eyebrow'));
console.log('  outline: ', await text('#course-outline-heading'));
console.log('  modes:   ', await page.$$eval('.mode-card__title', (e) => e.map((x) => x.textContent.trim())));
const track = await page.$eval('.app', (el) => el.dataset.track);
console.log('  theme:   ', track);
if (track !== 'amazon-connect') note(`AWS theme not applied (data-track=${track})`);
await shot('course-home-aws');

/* ---- 4. read a topic -------------------------------------------------- */
console.log('\n== Open topic 1 ==');
await page.click('.outline-list__item');
await page.waitForSelector('.reader__title', { timeout: 30000 });
console.log('  topic:   ', await text('.reader__title'));
console.log('  eyebrow: ', await text('.reader .eyebrow'));
console.log('  sidebar: ', await text('.module-sidebar .progress__value, .module-sidebar .progress'));
console.log('  sections:', await count('.reader__section'));
console.log('  pager:   ', await text('.pager__count'));
await shot('topic-reader');

/* ---- 5. next topic + progress ----------------------------------------- */
console.log('\n== Next topic ==');
await page.click('.pager .btn--primary');
await new Promise((r) => setTimeout(r, 700));
console.log('  topic:   ', await text('.reader__title'));
const done = await count('.module-sidebar__state--done');
console.log('  read marks in sidebar:', done);
if (done < 2) note(`progress not tracking: ${done} topics marked read after viewing 2`);
await shot('topic-2-progress');

/* ---- 6. a review question --------------------------------------------- */
console.log('\n== Review question ==');
const trigger = await page.$('.review-q__trigger');
if (!trigger) {
  note('no review question found on this topic');
} else {
  await trigger.click();
  await new Promise((r) => setTimeout(r, 300));
  const choices = await count('.review-q__choice');
  console.log('  options: ', choices);
  if (choices > 0) {
    await page.click('.review-q__choice');
    await page.click('.review-q__foot .btn--primary');
    await new Promise((r) => setTimeout(r, 300));
    console.log('  verdict: ', await text('.feedback__verdict'));
    console.log('  rationale present:', !!(await page.$('.feedback__line')));
  }
  await shot('review-question');
}

/* ---- 7. a course with code blocks ------------------------------------- */
console.log('\n== Code blocks (Custom CCP Intermediate) ==');
await page.click('.appbar__brand');
await page.waitForSelector('.library-search__input', { timeout: 20000 });
await page.type('.library-search__input', 'Custom CCP Intermediate');
await new Promise((r) => setTimeout(r, 400));
await page.click('.course-card .btn--primary');
await page.waitForSelector('.outline-list__item', { timeout: 30000 });

/* Core API is the topic that carries the Streams samples. */
const items = await page.$$('.outline-list__item');
for (const item of items) {
  const label = await item.evaluate((el) => el.textContent);
  if (/Core API/.test(label)) {
    await item.click();
    break;
  }
}
await page.waitForSelector('.reader__title', { timeout: 30000 });
console.log('  topic:   ', await text('.reader__title'));
const codeBlocks = await count('.blk-code');
console.log('  code blocks rendered:', codeBlocks);
if (codeBlocks === 0) note('expected code blocks on this topic, found none');
await shot('code-blocks');

/* ---- 8. the original Claude course still works ------------------------ */
console.log('\n== Claude course (regression) ==');
await page.click('.appbar__brand');
await page.waitForSelector('.library-search__input', { timeout: 20000 });
await page.type('.library-search__input', 'Associate');
await new Promise((r) => setTimeout(r, 400));
await page.click('.course-card .btn--primary');
await page.waitForSelector('.course-hero__title', { timeout: 30000 });
console.log('  hero:    ', await text('.course-hero__title'));
console.log('  outline: ', await text('#course-outline-heading'));
console.log('  modes:   ', await page.$$eval('.mode-card__title', (e) => e.map((x) => x.textContent.trim())));
const claudeTrack = await page.$eval('.app', (el) => el.dataset.track);
console.log('  theme:   ', claudeTrack);
if (claudeTrack !== 'certifications') note(`Claude course got the wrong theme: ${claudeTrack}`);
await shot('claude-course-home');

/* quiz still reachable */
const modeCards = await page.$$('.mode-card');
await modeCards[1].click();
await page.waitForSelector('.quiz-setup__legend', { timeout: 20000 });
console.log('  quiz setup:', await text('.page-head__lede'));
await shot('claude-quiz-setup');

/* ---- report ----------------------------------------------------------- */
console.log('\n== Console errors ==');
if (consoleErrors.length === 0) console.log('  none');
else consoleErrors.slice(0, 10).forEach((e) => console.log('  ' + e.slice(0, 200)));

console.log(
  problems.length === 0 && consoleErrors.length === 0
    ? '\nRESULT: clean\n'
    : `\nRESULT: ${problems.length} problem(s), ${consoleErrors.length} console error(s)\n`
);

await browser.close();
