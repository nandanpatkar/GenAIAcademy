/*
 * Inline SVG icon set.
 *
 * The reference design used the Material Symbols webfont from a CDN. External
 * CDN assets are not permitted, so the handful of glyphs actually used are
 * inlined here as paths. Icons are decorative by default (aria-hidden); pass a
 * `title` when an icon is the only label for a control.
 */

const PATHS = {
  school: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v5c3 3 9 3 12 0v-5 M22 10v6',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z',
  quiz: 'M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7v.5 M12 17.5h.01 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  check: 'm20 6-11 11-5-5',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1 M9 11l3 3L22 4',
  circle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  x: 'M18 6 6 18 M6 6l12 12',
  xCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M15 9l-6 6 M9 9l6 6',
  arrowRight: 'M5 12h14 m-7-7 7 7-7 7',
  arrowLeft: 'M19 12H5 m7 7-7-7 7-7',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  layers: 'm12 2 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 17l9 5 9-5',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2',
  lightbulb: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
  alert: 'M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  shield: 'M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16 M3 21v-5h5',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z m-3.6 3.6L7 22l5-2 5 2-1.4-5.4',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.4 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.4-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.8 1.1Z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z m10 2-4.3-4.3',
  cloud: 'M17.5 19a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.7-1.2A4 4 0 0 0 6.5 19Z',
  code: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
};

export default function Icon({ name, title, className = '', ...rest }) {
  const d = PATHS[name];
  if (!d) return null;

  const decorative = !title;

  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {d.split(' M').map((segment, index) => (
        <path key={index} d={index === 0 ? segment : `M${segment}`} />
      ))}
    </svg>
  );
}
