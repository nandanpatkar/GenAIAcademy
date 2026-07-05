#!/usr/bin/env node
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
page.on('console', (msg) => console.log('PAGE:', msg.text()));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Try to access the zustand store via React DevTools-style introspection, then add a node.
const result = await page.evaluate(async () => {
  // Find the React fiber on a known DOM node
  const reactRoot = document.querySelector('#root') || document.body.firstElementChild;
  function findStore(fiber, depth = 0) {
    if (!fiber || depth > 50) return null;
    if (fiber.stateNode?.getState && fiber.stateNode?.setState) return fiber.stateNode;
    if (fiber.memoizedState?.next) {
      let h = fiber.memoizedState;
      while (h) {
        if (h.queue?.dispatch && h.memoizedState?.nodes) return null;
        h = h.next;
      }
    }
    return findStore(fiber.child, depth + 1) || findStore(fiber.sibling, depth + 1);
  }
  const key = Object.keys(reactRoot).find((k) => k.startsWith('__reactContainer'));
  const fiber = reactRoot[key]?.stateNode?.current;
  // Just look at canvas existence
  const rf = document.querySelector('.react-flow');
  const nodes = document.querySelectorAll('.react-flow__node');
  return { hasRF: !!rf, nodeCount: nodes.length, url: location.href };
});
console.log('init:', result);

// Try clicking the "+" toolbar button to add a node
const addBtn = await page.$('[aria-label*="add" i], [aria-label*="insert" i], button:has-text("+")');
console.log('add button found:', !!addBtn);

await page.waitForTimeout(60_000); // keep open for manual inspection
await browser.close();
