/*
 * Extracts text from the PDFs in conne/ into conne-text/<name>.txt.
 *
 *   node tools/extract-pdf-text.mjs
 *
 * A PDF has no paragraphs — only glyphs at coordinates. Naive extraction
 * therefore loses every structural cue the parser relies on. This script keeps
 * those cues by working from pdf.js text items and their positions:
 *
 *   - items are grouped into lines by their baseline (y), then ordered by x,
 *     which repairs the out-of-order runs that plain extraction produces;
 *   - a line noticeably larger than the body text is a heading, and is written
 *     surrounded by blank lines so the course parser sees it as one;
 *   - a wider-than-normal vertical gap between lines becomes a blank line, so
 *     paragraph breaks survive;
 *   - lines repeated at the same position on most pages are running headers or
 *     footers and are dropped, along with bare page numbers;
 *   - a line broken mid-sentence at the column edge is rejoined with the next.
 *
 * The output is the same shape as the courseware exports already in conne/, so
 * tools/connect-parser.mjs can read both without a special case.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* The legacy build runs in Node without a DOM or a worker. */
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const SOURCE_DIR = path.join(root, 'conne');
const OUT_DIR = path.join(root, 'conne-text');

/* Two text items belong to the same line when their baselines are within this
   many points. Anything larger merges genuinely separate lines. */
const LINE_TOLERANCE = 2.5;

/* A vertical step larger than this multiple of the line height is a paragraph
   break rather than ordinary leading. */
const PARAGRAPH_GAP = 1.6;

/* A line this much taller than the page's body text is a heading. */
const HEADING_RATIO = 1.18;

function round(value) {
  return Math.round(value * 100) / 100;
}

/* Group a page's text items into lines, ordered top to bottom, left to right. */
function toLines(items) {
  const lines = [];

  for (const item of items) {
    const text = item.str;
    if (!text || !text.trim()) continue;

    const y = round(item.transform[5]);
    const x = round(item.transform[4]);
    const height = Math.abs(item.transform[3]) || item.height || 0;
    const width = item.width ?? 0;

    const line = lines.find((candidate) => Math.abs(candidate.y - y) <= LINE_TOLERANCE);
    if (line) {
      line.parts.push({ x, width, text });
      line.height = Math.max(line.height, height);
    } else {
      lines.push({ y, height, parts: [{ x, width, text }] });
    }
  }

  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => {
      const parts = line.parts.sort((a, b) => a.x - b.x);

      /*
       * pdf.js splits a line wherever the font or kerning changes, so the
       * pieces need rejoining. Whether a space belongs between two pieces is
       * decided by the horizontal gap between them, not by their contents:
       * inserting one unconditionally puts a space inside every word the
       * encoder happened to split ("Amazo n Connect").
       */
      const spaceGap = Math.max(line.height, 1) * 0.22;
      let text = '';
      let end = null;

      for (const part of parts) {
        const needsSpace =
          text !== '' &&
          !/\s$/.test(text) &&
          !/^\s/.test(part.text) &&
          end !== null &&
          part.x - end > spaceGap;

        if (needsSpace) text += ' ';
        text += part.text;
        end = part.x + part.width;
      }

      return {
        y: line.y,
        height: line.height,
        x: parts[0].x,
        right: end ?? parts[0].x,
        text: text.replace(/\s+/g, ' ').trim(),
      };
    })
    .filter((line) => line.text.length > 0);
}

/*
 * Group a page's text into blocks by proximity, and return them in reading
 * order.
 *
 * Some of these documents are slide-style reference cards that place step
 * lists side by side. Grouping such a page by baseline alone interleaves them
 * ("1. Enter Username. 1. Enter Password."). Splitting on vertical whitespace
 * corridors does not help either, because a full-width heading above the cards
 * bridges the gutter.
 *
 * What does work is treating the page as a set of blocks: two pieces of text
 * belong together when they are close both vertically and horizontally, in
 * units of their own line height. Blocks are then read top to bottom, and left
 * to right where two sit at the same height.
 *
 * On an ordinary single-column page this reduces to one block per paragraph,
 * emitted top to bottom, which is the same result as reading the page straight
 * through.
 */
function clusterBlocks(items) {
  const drawn = items.filter((item) => item.str && item.str.trim());
  if (drawn.length === 0) return [];

  const boxes = drawn.map((item) => {
    const height = Math.abs(item.transform[3]) || item.height || 10;
    const left = item.transform[4];
    const bottom = item.transform[5];
    return { item, height, left, right: left + (item.width ?? 0), bottom, top: bottom + height };
  });

  const near = (a, b) => {
    const unit = Math.max(a.height, b.height, 1);
    const vGap = Math.max(0, Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top));
    const hGap = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
    return vGap <= unit * 1.2 && hGap <= unit * 1.6;
  };

  /* Union-find over the proximity graph. Pages here hold a few hundred items
     at most, so the pairwise scan is not worth optimising. */
  const parent = boxes.map((_, index) => index);
  const find = (index) => {
    let node = index;
    while (parent[node] !== node) {
      parent[node] = parent[parent[node]];
      node = parent[node];
    }
    return node;
  };
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      if (!near(boxes[i], boxes[j])) continue;
      const a = find(i);
      const b = find(j);
      if (a !== b) parent[b] = a;
    }
  }

  const groups = new Map();
  boxes.forEach((box, index) => {
    const key = find(index);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(box);
  });

  const unit =
    boxes.map((box) => box.height).sort((a, b) => a - b)[Math.floor(boxes.length / 2)] || 10;

  return [...groups.values()]
    .map((group) => ({
      top: Math.max(...group.map((box) => box.top)),
      left: Math.min(...group.map((box) => box.left)),
      items: group.map((box) => box.item),
    }))
    /* Bands tolerate the small baseline differences between blocks that are
       side by side but not pixel-aligned. */
    .sort((a, b) => {
      const bandA = Math.round(a.top / (unit * 1.5));
      const bandB = Math.round(b.top / (unit * 1.5));
      return bandA === bandB ? a.left - b.left : bandB - bandA;
    })
    .map((group) => group.items);
}

/* Body text is the most common line height on the page. */
function bodyHeight(lines) {
  const tally = new Map();
  for (const line of lines) {
    const key = Math.round(line.height * 2) / 2;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  let best = 0;
  let bestCount = -1;
  for (const [height, count] of tally) {
    if (count > bestCount) {
      best = height;
      bestCount = count;
    }
  }
  return best;
}

/*
 * Lines that appear at the same vertical position on most pages are running
 * headers and footers, not content.
 */
function findFurniture(pages) {
  const seen = new Map();

  for (const lines of pages) {
    const onThisPage = new Set();
    for (const line of lines) {
      onThisPage.add(`${Math.round(line.y)}|${line.text}`);
    }
    for (const key of onThisPage) seen.set(key, (seen.get(key) ?? 0) + 1);
  }

  const threshold = Math.max(2, Math.ceil(pages.length * 0.5));
  const furniture = new Set();
  for (const [key, count] of seen) {
    if (count >= threshold) furniture.add(key.split('|').slice(1).join('|'));
  }
  return furniture;
}

const BULLET = /^[•·▪◦●○*•▪]\s*/;
const PAGE_NUMBER = /^(page\s+)?\d{1,4}(\s*(\/|of)\s*\d{1,4})?$/i;
const SENTENCE_END = /[.!?:;]["')\]]?$/;

/* Footers that vary per page — the page number defeats the repeated-line
   detector, so they are matched by shape instead. */
const FOOTER =
  /(^©\s*\d{4}|all rights reserved|^amazon web services, inc\b|^\d+ of \d+$)/i;

function blockToText(lines, furniture, body, out) {
  let previous = null;

  /* Each block measures its own right edge. A boxed card is narrower than the
     page, and judging its wrapping against the widest line in the document
     would mark every one of its lines as ending early. */
  const columnRight = lines.reduce((widest, line) => Math.max(widest, line.right), 0);

  for (const line of lines) {
    if (furniture.has(line.text)) continue;
    if (PAGE_NUMBER.test(line.text)) continue;
    if (FOOTER.test(line.text)) continue;

    const isHeading = body > 0 && line.height >= body * HEADING_RATIO;
    const bullet = BULLET.test(line.text);
    const text = line.text.replace(BULLET, '');

    /* Vertical distance from the previous line, in line heights. A negative
       gap means the reader jumped back up the page — the start of the next
       column — which always begins a new block. */
    const gap = previous ? (previous.y - line.y) / Math.max(body, 1) : 0;
    const newBlock =
      !previous || isHeading || previous.isHeading || gap >= PARAGRAPH_GAP || gap < 0;

    /*
     * A wrapped line continues the one above. The giveaway is that the line
     * above ran out of column: a line that stops short of the right margin
     * ended because the author ended it. That distinction is what separates a
     * bullet wrapping onto a second line from the next bullet in the list.
     *
     * Fullness is measured from the line's own left edge, because bullets and
     * quotes are indented and would never reach the margin otherwise. In these
     * documents wrapped lines measure 0.91–1.00 and terminal lines 0.09–0.75,
     * so the threshold sits in open space between the two.
     */
    const previousWasFull =
      previous && (previous.right - previous.x) / Math.max(columnRight - previous.x, 1) >= 0.88;

    /* A line opening in lowercase is a continuation whatever its width — the
       fullness test alone misses wraps inside narrow boxes, where no line gets
       close to the widest line in its block. */
    const continuesSentence = /^[a-z]/.test(text);

    const wraps =
      !newBlock &&
      !bullet &&
      (previousWasFull || continuesSentence) &&
      out.length > 0 &&
      !SENTENCE_END.test(out[out.length - 1]);

    if (wraps) {
      out[out.length - 1] = `${out[out.length - 1]} ${text}`;
    } else {
      /* Headings stand alone; bullets in a run stay adjacent so the course
         parser reads them as one list. */
      if (out.length > 0 && (newBlock || isHeading) && !(bullet && previous?.bullet)) {
        out.push('');
      }
      out.push(text);
    }

    previous = { ...line, isHeading, bullet };
  }

  return out;
}

async function extract(file) {
  const data = new Uint8Array(fs.readFileSync(path.join(SOURCE_DIR, file)));
  const doc = await pdfjs.getDocument({
    data,
    useSystemFonts: true,
    /* Nothing here renders, so the worker and standard fonts are not needed. */
    isEvalSupported: false,
  }).promise;

  const pages = [];
  for (let number = 1; number <= doc.numPages; number += 1) {
    const page = await doc.getPage(number);
    const content = await page.getTextContent();

    /* Each block is turned into lines on its own, so text that merely happens
       to share a baseline across the page is never joined. */
    pages.push(clusterBlocks(content.items).map((block) => toLines(block)));
  }

  const furniture = findFurniture(pages.map((blocks) => blocks.flat()));
  const body = bodyHeight(pages.flat(2));

  const lines = [];
  for (const blocks of pages) {
    for (const block of blocks) {
      const text = blockToText(block, furniture, body, []);
      if (text.length === 0) continue;
      if (lines.length > 0) lines.push('');
      lines.push(...text);
    }
  }

  /* Collapse runs of blank lines to at most two — the course parser reads two
     as "start of a card deck" and more than that means nothing extra. */
  const squeezed = [];
  let blanks = 0;
  for (const line of lines) {
    if (line === '') {
      blanks += 1;
      if (blanks > 2) continue;
    } else {
      blanks = 0;
    }
    squeezed.push(line);
  }

  return { text: `${squeezed.join('\n').trim()}\n`, pages: doc.numPages };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .sort();

  for (const file of files) {
    const { text, pages } = await extract(file);
    const out = `${file.replace(/\.pdf$/i, '')}.txt`;
    fs.writeFileSync(path.join(OUT_DIR, out), text, 'utf8');
    const words = text.split(/\s+/).filter(Boolean).length;
    console.log(
      `  ${out.slice(0, 62).padEnd(62)} ${String(pages).padStart(3)}p  ${String(words).padStart(6)} words`
    );
  }

  console.log(`\n${files.length} PDFs extracted to conne-text/`);
}

await main();
