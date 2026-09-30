// Which DSA hub section shows a Visual Learning lesson, from its path alone —
// so Today, ⌘K and the planner can link to a lesson without loading the
// course tree. Each track is its own Learn section; the test in
// tests/visualLinks.test.mjs checks every lesson against its track.

export const TRACK_SECTIONS = { dsa: "visual", lld: "lld", os: "os", networking: "networks" };
export const SECTION_TRACKS = Object.fromEntries(Object.entries(TRACK_SECTIONS).map(([track, section]) => [section, track]));

const PREFIXES = [
  ["lld/", "lld"],
  ["operating-system/", "os"],
  ["computer-network/", "networking"],
];

export const trackForPath = (path = "") => PREFIXES.find(([prefix]) => path.startsWith(prefix))?.[1] || "dsa";
export const sectionForPath = (path = "") => TRACK_SECTIONS[trackForPath(path)];
