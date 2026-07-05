#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const TRANSLATIONS = {
  de: { edgeStyleCurved: 'Geschwungen', edgeStyleRounded: 'Abgerundet', edgeStyleSharp: 'Spitz', edgeStyleStraight: 'Gerade' },
  es: { edgeStyleCurved: 'Curva', edgeStyleRounded: 'Redondeada', edgeStyleSharp: 'Aguda', edgeStyleStraight: 'Recta' },
  fr: { edgeStyleCurved: 'Courbé', edgeStyleRounded: 'Arrondi', edgeStyleSharp: 'Angle vif', edgeStyleStraight: 'Droit' },
  ja: { edgeStyleCurved: '曲線', edgeStyleRounded: '角丸', edgeStyleSharp: '鋭角', edgeStyleStraight: '直線' },
  tr: { edgeStyleCurved: 'Eğri', edgeStyleRounded: 'Yuvarlatılmış', edgeStyleSharp: 'Keskin', edgeStyleStraight: 'Düz' },
  zh: { edgeStyleCurved: '曲线', edgeStyleRounded: '圆角', edgeStyleSharp: '尖角', edgeStyleStraight: '直线' },
};

const SRC = resolve('src/i18n/locales');
const PUB = resolve('public/locales');

for (const [locale, keys] of Object.entries(TRANSLATIONS)) {
  for (const root of [SRC, PUB]) {
    const path = resolve(root, locale, 'translation.json');
    const json = JSON.parse(await readFile(path, 'utf8'));
    if (!json.settingsModal?.canvas) {
      console.warn('skip (no settingsModal.canvas):', path);
      continue;
    }
    Object.assign(json.settingsModal.canvas, keys);
    await writeFile(path, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('updated:', path);
  }
}
