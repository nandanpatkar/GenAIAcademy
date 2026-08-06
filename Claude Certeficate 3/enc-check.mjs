import fs from "node:fs";
const p = "./tools/build-connect-data.mjs";
const s = fs.readFileSync(p, "utf8");
const bad = s.match(/Ã.|â€./g) ?? [];
console.log("suspect sequences:", bad.length);
const set = {}; for (const b of bad) set[b] = (set[b] ?? 0) + 1;
console.log(set);
for (const m of s.matchAll(/.{0,40}â€.{0,3}.{0,25}/g)) { console.log(JSON.stringify(m[0])); break; }
