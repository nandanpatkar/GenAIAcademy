#!/usr/bin/env node
/**
 * Recenter SVG viewBoxes around the visual centroid of their pixels.
 *
 * Why: many third-party icon SVGs have asymmetric pixel mass (e.g. a
 * squirrel's body skews right of its viewBox center). `object-contain`
 * centers the viewBox bbox, so artwork looks off-center in node frames.
 *
 * How: rasterize each SVG in headless chromium, compute the centroid
 * of opaque pixels, then extend the viewBox on the opposite side until
 * the centroid sits at the viewBox center. Also tightens any waste
 * whitespace that lies outside the path bbox.
 *
 * Usage:
 *   node scripts/tighten-svg-viewboxes.mjs [glob ...]
 *   node scripts/tighten-svg-viewboxes.mjs --dry
 *   node scripts/tighten-svg-viewboxes.mjs --pad 0.06 assets/third-party-icons/developer/processed
 */
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { argv, exit, cwd } from 'node:process';
import { glob } from 'node:fs/promises';

const args = argv.slice(2);
const dry = args.includes('--dry');
const padIdx = args.indexOf('--pad');
const pad = padIdx >= 0 ? Number(args[padIdx + 1]) : 0.04;
const inputs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--pad');
// Default to developer brand logos only. AWS/Azure/GCP/CNCF icons are
// professionally designed with built-in backgrounds — recentering them by
// pixel centroid actively misaligns the background square.
const targets = inputs.length ? inputs : ['assets/third-party-icons/developer/processed/**/*.svg'];

async function expand(patterns) {
  const out = [];
  for (const p of patterns) {
    const abs = resolve(cwd(), p);
    if (p.includes('*')) {
      for await (const f of glob(p)) out.push(resolve(cwd(), f));
    } else if (p.endsWith('.svg')) {
      out.push(abs);
    } else {
      for await (const f of glob(`${p}/**/*.svg`)) out.push(resolve(cwd(), f));
    }
  }
  return [...new Set(out)];
}

const VIEWBOX_RE = /\sviewBox\s*=\s*"([^"]+)"/i;

function fmt(n) {
  const r = Math.round(n * 1000) / 1000;
  return Number.isFinite(r) ? String(r) : '0';
}

const files = await expand(targets);
if (!files.length) {
  console.error('No SVGs matched.');
  exit(1);
}
console.log(`Tightening ${files.length} SVGs (pad=${pad}${dry ? ', dry' : ''})…`);

const browser = await chromium.launch();
const page = await browser.newPage();
let changed = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  try {
    const src = await readFile(file, 'utf8');
    const m = src.match(VIEWBOX_RE);
    if (!m) {
      skipped++;
      continue;
    }
    const [vbX, vbY, vbW, vbH] = m[1].trim().split(/[\s,]+/).map(Number);
    if (![vbX, vbY, vbW, vbH].every(Number.isFinite) || vbW <= 0 || vbH <= 0) {
      skipped++;
      continue;
    }

    const RASTER = 512;
    const html = `<!doctype html><html><body style="margin:0;background:#fff">${src.replace(
      /<svg([^>]*)>/i,
      `<svg$1 style="width:${RASTER}px;height:${RASTER}px;display:block">`,
    )}<canvas id="__rcvs" width="${RASTER}" height="${RASTER}"></canvas></body></html>`;
    await page.setContent(html, { waitUntil: 'load' });

    const measured = await page.evaluate(async (size) => {
      const svg = document.querySelector('svg');
      const cvs = document.querySelector('canvas#__rcvs');
      const bb = svg.getBBox();
      const xml = new XMLSerializer().serializeToString(svg);
      const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(xml);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const ctx = cvs.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let sx = 0, sy = 0, sw = 0;
      let minX = size, minY = size, maxX = -1, maxY = -1;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          // weight = darkness * alpha (treat near-white background as empty)
          const lum = (r + g + b) / 3;
          const ink = (255 - lum) * (a / 255);
          if (ink < 8) continue;
          sx += x * ink; sy += y * ink; sw += ink;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
      if (sw <= 0 || maxX < 0) return null;
      return {
        bb: { x: bb.x, y: bb.y, w: bb.width, h: bb.height },
        cx: sx / sw / size, cy: sy / sw / size,
        px: { minX: minX / size, minY: minY / size, maxX: (maxX + 1) / size, maxY: (maxY + 1) / size },
      };
    }, RASTER);

    if (!measured) { skipped++; continue; }
    const { bb, cx, cy, px } = measured;
    if (!(bb.w > 0 && bb.h > 0)) { skipped++; continue; }

    // Map normalized pixel coords back to SVG user units via the displayed viewBox.
    const toSvgX = (n) => vbX + n * vbW;
    const toSvgY = (n) => vbY + n * vbH;
    const cxSvg = toSvgX(cx);
    const cySvg = toSvgY(cy);
    const inkBox = {
      x: toSvgX(px.minX),
      y: toSvgY(px.minY),
      w: (px.maxX - px.minX) * vbW,
      h: (px.maxY - px.minY) * vbH,
    };

    // Start from the tighter of geometric bbox and rasterized ink bbox.
    const tight = {
      x: Math.max(bb.x, inkBox.x),
      y: Math.max(bb.y, inkBox.y),
      w: Math.min(bb.x + bb.w, inkBox.x + inkBox.w),
      h: Math.min(bb.y + bb.h, inkBox.y + inkBox.h),
    };
    tight.w = Math.max(1e-6, tight.w - tight.x);
    tight.h = Math.max(1e-6, tight.h - tight.y);

    // Apply uniform padding.
    const padU = Math.max(tight.w, tight.h) * pad;
    let nx = tight.x - padU;
    let ny = tight.y - padU;
    let nw = tight.w + padU * 2;
    let nh = tight.h + padU * 2;

    // Extend on the side opposite to the centroid skew so centroid lands at center.
    const dx = cxSvg - (nx + nw / 2);
    const dy = cySvg - (ny + nh / 2);
    if (dx > 0) nw += 2 * dx;
    else { nx += 2 * dx; nw += -2 * dx; }
    if (dy > 0) nh += 2 * dy;
    else { ny += 2 * dy; nh += -2 * dy; }

    const wasteX = Math.abs(nx - vbX) + Math.abs(vbX + vbW - (nx + nw));
    const wasteY = Math.abs(ny - vbY) + Math.abs(vbY + vbH - (ny + nh));
    if (wasteX / vbW < 0.01 && wasteY / vbH < 0.01) {
      skipped++;
      continue;
    }

    const next = src.replace(
      VIEWBOX_RE,
      ` viewBox="${fmt(nx)} ${fmt(ny)} ${fmt(nw)} ${fmt(nh)}"`,
    );
    if (next === src) {
      skipped++;
      continue;
    }
    if (!dry) await writeFile(file, next, 'utf8');
    changed++;
    if (changed % 50 === 0) console.log(`  …${changed} updated`);
  } catch (err) {
    errors++;
    console.warn(`! ${file}: ${err.message}`);
  }
}

await browser.close();
console.log(`Done. changed=${changed} skipped=${skipped} errors=${errors}`);
