import type { RawSvgNodeLayout } from './types';

export function parseTranslate(transform: string | null): { x: number; y: number } | null {
  if (!transform) return null;
  const match = transform.match(/translate\(\s*([+-]?\d*\.?\d+)\s*(?:,\s*([+-]?\d*\.?\d+))?\s*\)/);
  if (!match) return null;
  return {
    x: parseFloat(match[1]),
    y: typeof match[2] === 'string' ? parseFloat(match[2]) : 0,
  };
}

export function getAbsoluteTranslation(el: Element): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let current: Element | null = el;

  while (current && current.tagName !== 'svg') {
    const translated = parseTranslate(current.getAttribute('transform'));
    if (translated) {
      x += translated.x;
      y += translated.y;
    }
    current = current.parentElement;
  }

  return { x, y };
}

export function getElementText(group: Element): string | undefined {
  const textContent = [
    ...group.querySelectorAll('text, foreignObject span, foreignObject div, foreignObject p'),
  ]
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return textContent || undefined;
}

/**
 * Bounds for an SVG group via shape-attribute parsing and accumulated transforms.
 *
 * Intentionally skips getBBox(): our ensureMermaidMeasurementSupport shim patches
 * getBBox() to return text-estimated dimensions in element-local space (x=0, y=0
 * with width/height derived from text content). Using those values for layout
 * extraction would place every node at the origin, corrupting reconciliation.
 * Shape-attribute + transform-accumulation produces SVG root-space coordinates
 * reliably across browser and jsdom.
 */
export function buildBoundsFromElement(
  group: Element
): Omit<RawSvgNodeLayout, 'rawId' | 'label'> | null {
  const translation = getAbsoluteTranslation(group);
  const shapeEl =
    group.querySelector('rect') ??
    group.querySelector('circle') ??
    group.querySelector('ellipse') ??
    group.querySelector('polygon') ??
    group.querySelector('path');

  if (!shapeEl) return null;

  let width = 0;
  let height = 0;
  let x = translation.x;
  let y = translation.y;
  const tagName = shapeEl.tagName.toLowerCase();

  if (tagName === 'rect') {
    width = parseFloat(shapeEl.getAttribute('width') ?? '0');
    height = parseFloat(shapeEl.getAttribute('height') ?? '0');
    x = translation.x + parseFloat(shapeEl.getAttribute('x') ?? '0');
    y = translation.y + parseFloat(shapeEl.getAttribute('y') ?? '0');
  } else if (tagName === 'circle') {
    const r = parseFloat(shapeEl.getAttribute('r') ?? '0');
    width = r * 2;
    height = r * 2;
    x = translation.x - r;
    y = translation.y - r;
  } else if (tagName === 'ellipse') {
    const rx = parseFloat(shapeEl.getAttribute('rx') ?? '0');
    const ry = parseFloat(shapeEl.getAttribute('ry') ?? '0');
    width = rx * 2;
    height = ry * 2;
    x = translation.x - rx;
    y = translation.y - ry;
  } else {
    // polygon / path: cannot determine bounds from attributes alone.
    return null;
  }

  return { x, y, width, height };
}

export function parseSvgPathPoints(d: string): { x: number; y: number }[] {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const points: { x: number; y: number }[] = [];

  let index = 0;
  let command = '';
  let current = { x: 0, y: 0 };
  let subpathStart = { x: 0, y: 0 };

  function readNumber(): number { return Number(tokens[index++]); }
  function pushPoint(point: { x: number; y: number }): void {
    points.push({ x: point.x, y: point.y });
    current = point;
  }

  while (index < tokens.length) {
    const token = tokens[index];
    if (/^[a-zA-Z]$/.test(token)) { command = token; index += 1; }

    switch (command) {
      case 'M': case 'L': { const x = readNumber(); const y = readNumber(); pushPoint({ x, y }); if (command === 'M') subpathStart = { x, y }; break; }
      case 'm': case 'l': { const x = current.x + readNumber(); const y = current.y + readNumber(); pushPoint({ x, y }); if (command === 'm') subpathStart = { x, y }; break; }
      case 'H': { pushPoint({ x: readNumber(), y: current.y }); break; }
      case 'h': { pushPoint({ x: current.x + readNumber(), y: current.y }); break; }
      case 'V': { pushPoint({ x: current.x, y: readNumber() }); break; }
      case 'v': { pushPoint({ x: current.x, y: current.y + readNumber() }); break; }
      case 'C': { index += 4; const x = readNumber(); const y = readNumber(); pushPoint({ x, y }); break; }
      case 'c': { index += 4; const x = current.x + readNumber(); const y = current.y + readNumber(); pushPoint({ x, y }); break; }
      case 'S': case 'Q': { index += 2; const x = readNumber(); const y = readNumber(); pushPoint({ x, y }); break; }
      case 's': case 'q': { index += 2; const x = current.x + readNumber(); const y = current.y + readNumber(); pushPoint({ x, y }); break; }
      case 'T': { const x = readNumber(); const y = readNumber(); pushPoint({ x, y }); break; }
      case 't': { const x = current.x + readNumber(); const y = current.y + readNumber(); pushPoint({ x, y }); break; }
      case 'A': { index += 5; const x = readNumber(); const y = readNumber(); pushPoint({ x, y }); break; }
      case 'a': { index += 5; const x = current.x + readNumber(); const y = current.y + readNumber(); pushPoint({ x, y }); break; }
      case 'Z': case 'z': { pushPoint({ x: subpathStart.x, y: subpathStart.y }); break; }
      default: { index += 1; break; }
    }
  }

  return points;
}

export function shiftPathData(path: string, shiftX: number, shiftY: number): string {
  const tokens = path.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  if (tokens.length === 0) return path;

  const shifted: string[] = [];
  let index = 0;
  let command = '';

  const readNum = (): number => Number(tokens[index++]);
  const pushNum = (v: number): void => {
    shifted.push(Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));
  };

  while (index < tokens.length) {
    const token = tokens[index];
    if (/^[a-zA-Z]$/.test(token)) { command = token; shifted.push(token); index += 1; continue; }

    switch (command) {
      case 'M': case 'L': case 'T': { pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); break; }
      case 'H': { pushNum(readNum() + shiftX); break; }
      case 'V': { pushNum(readNum() + shiftY); break; }
      case 'C': { pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); break; }
      case 'S': case 'Q': { pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); break; }
      case 'A': { pushNum(readNum()); pushNum(readNum()); pushNum(readNum()); pushNum(readNum()); pushNum(readNum()); pushNum(readNum() + shiftX); pushNum(readNum() + shiftY); break; }
      default: { shifted.push(tokens[index++]); break; }
    }
  }

  return shifted.join(' ');
}
