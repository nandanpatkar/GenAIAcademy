#!/usr/bin/env node
// Measures pixel centroid of an SVG vs its viewBox center.
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const files = argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();

for (const file of files) {
  const src = await readFile(file, 'utf8');
  const RASTER = 256;
  const html = `<!doctype html><body style="margin:0;background:#fff">${src.replace(
    /<svg([^>]*)>/i,
    `<svg$1 style="width:${RASTER}px;height:${RASTER}px;display:block">`,
  )}<canvas id="c" width="${RASTER}" height="${RASTER}"></canvas></body>`;
  await page.setContent(html, { waitUntil: 'load' });
  const m = await page.evaluate(async (size) => {
    const svg = document.querySelector('svg');
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(xml); });
    const ctx = document.getElementById('c').getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);
    const d = ctx.getImageData(0, 0, size, size).data;
    let sx = 0, sy = 0, sw = 0, minX=size, minY=size, maxX=-1, maxY=-1;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const i = (y*size+x)*4;
      const ink = (255 - (d[i]+d[i+1]+d[i+2])/3) * (d[i+3]/255);
      if (ink < 8) continue;
      sx += x*ink; sy += y*ink; sw += ink;
      if (x<minX) minX=x; if (x>maxX) maxX=x; if (y<minY) minY=y; if (y>maxY) maxY=y;
    }
    return sw > 0 ? { cx: sx/sw/size, cy: sy/sw/size, bb: { x: minX/size, y: minY/size, w: (maxX-minX+1)/size, h: (maxY-minY+1)/size }} : null;
  }, RASTER);
  if (!m) { console.log(file, '— no ink'); continue; }
  const dx = (m.cx - 0.5) * 100;
  const dy = (m.cy - 0.5) * 100;
  const bbcx = (m.bb.x + m.bb.w/2 - 0.5) * 100;
  const bbcy = (m.bb.y + m.bb.h/2 - 0.5) * 100;
  console.log(`${file}\n  centroid offset from center: x=${dx.toFixed(1)}% y=${dy.toFixed(1)}%\n  bbox center offset:          x=${bbcx.toFixed(1)}% y=${bbcy.toFixed(1)}%\n  bbox: x=${(m.bb.x*100).toFixed(1)}% y=${(m.bb.y*100).toFixed(1)}% w=${(m.bb.w*100).toFixed(1)}% h=${(m.bb.h*100).toFixed(1)}%`);
}
await browser.close();
