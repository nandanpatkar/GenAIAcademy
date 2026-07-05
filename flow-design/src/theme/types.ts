export interface ThemeColors {
  bg: string;
  fill: string; // for SVG
  border: string;
  stroke: string; // for SVG
  iconBg: string;
  iconColor: string;
  handle: string;
  ring: string;
  text: string;
  subText: string;
  shadow: string; // for export
}

export type NodeColorMode = 'subtle' | 'filled';

export interface ContainerVisualStyle {
  bg: string;
  border: string;
  text: string;
  subText: string;
  accentBg: string;
  accentText: string;
  hoverBg: string;
  badgeBg: string;
  badgeText: string;
}

export interface EdgeVisualStyle {
  stroke: string;
  text: string;
  mutedText: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  pillHoverBorder: string;
  pillHoverText: string;
  focusRing: string;
  metaBg: string;
  metaBorder: string;
  metaText: string;
  metaMutedText: string;
}

export interface NodeExportColor {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  text: string;
  subText: string;
}

export interface SectionColors {
  bg: string;
  border: string;
  title: string;
  badge: string; // Tailwind class
  badgeBgHex?: string; // For export
  badgeTextHex?: string; // For export
}

export const NODE_COLOR_OPTIONS = [
  'white',
  'slate',
  'blue',
  'emerald',
  'amber',
  'red',
  'violet',
  'pink',
  'yellow',
] as const;

export type NodeColorKey = (typeof NODE_COLOR_OPTIONS)[number] | 'custom';

export const NODE_COLOR_LABELS: Record<(typeof NODE_COLOR_OPTIONS)[number] | 'custom', string> = {
  white: 'White',
  slate: 'Slate',
  blue: 'Blue',
  emerald: 'Green',
  amber: 'Orange',
  red: 'Red',
  violet: 'Violet',
  pink: 'Pink',
  yellow: 'Yellow',
  custom: 'Custom',
};
