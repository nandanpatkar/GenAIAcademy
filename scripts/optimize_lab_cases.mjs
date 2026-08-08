import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const START = "const CASES = [";
const END = "];\n\nexport default function";
const TARGET_CASES = 12;

function splitObjects(source) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === "`") { quote = character; continue; }
    if (character === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        objects.push(source.slice(start, index + 1));
        start = -1;
      }
    }
  }
  return objects;
}

function field(object, name) {
  return object.match(new RegExp(`\\b${name}:\\s*"([^"]+)"`))?.[1] || "";
}

function chooseCases(objects) {
  const chosen = [];
  const signatures = new Set();
  for (const object of objects) {
    const signature = [
      field(object, "title").replace(/ · case \d+$/, ""),
      field(object, "regime"),
      field(object, "failure").replace(/; case \d+.*$/, ""),
    ].join("|");
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    chosen.push(object);
    if (chosen.length === TARGET_CASES) break;
  }
  if (chosen.length < TARGET_CASES) {
    for (const object of objects) {
      if (!chosen.includes(object)) chosen.push(object);
      if (chosen.length === TARGET_CASES) break;
    }
  }
  return chosen;
}

let totalBefore = 0;
let totalAfter = 0;
for (let number = 29; number <= 127; number += 1) {
  const file = resolve(`artifact-${number}.jsx`);
  const source = await readFile(file, "utf8");
  const start = source.indexOf(START);
  const end = source.indexOf(END, start);
  if (start < 0 || end < 0) throw new Error(`Could not find CASES in ${file}`);
  const arrayStart = start + START.length;
  const objects = splitObjects(source.slice(arrayStart, end));
  const chosen = chooseCases(objects);
  totalBefore += objects.length;
  totalAfter += chosen.length;
  const replacement = `\n${chosen.map((object) => `  ${object}`).join(",\n")}\n`;
  await writeFile(file, source.slice(0, arrayStart) + replacement + source.slice(end), "utf8");
}

console.log(`Optimized lab scenarios: ${totalBefore} → ${totalAfter}.`);
