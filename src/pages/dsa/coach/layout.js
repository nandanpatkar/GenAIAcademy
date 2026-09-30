/**
 * Layouts for the coach's visual artifacts. Pure, so they can be unit-tested.
 *
 *   layeredLayout   flow charts and DAG-ish graphs (agent pipelines, topo
 *                   orders): longest-path layers, barycenter ordering; edges
 *                   that close a loop are ignored for layering and reported
 *                   as `backEdges` so they can be drawn differently.
 *   treeFromLevelOrder / treeLayout   binary trees written LeetCode-style
 *   circleLayout    small general graphs
 */

/**
 * `nodes` [{ id, group? }], `edges` [{ source, target }].
 * Returns { positions: { id: { x, y } }, backEdges: Set("a->b"), width, height }.
 */
export function layeredLayout(nodes, edges, { direction = "LR", nodeWidth = 200, nodeHeight = 64, gapX = 80, gapY = 36 } = {}) {
  const ids = nodes.map((node) => node.id);
  const known = new Set(ids);
  const out = new Map(ids.map((id) => [id, []]));
  const valid = edges.filter((edge) => known.has(edge.source) && known.has(edge.target) && edge.source !== edge.target);
  valid.forEach((edge) => out.get(edge.source).push(edge.target));

  // Back edges: DFS in input order; an edge to a node still on the stack closes a loop.
  const state = new Map();
  const backEdges = new Set();
  const visit = (id) => {
    state.set(id, 1);
    out.get(id).forEach((next) => {
      if (state.get(next) === 1) backEdges.add(`${id}->${next}`);
      else if (!state.get(next)) visit(next);
    });
    state.set(id, 2);
  };
  ids.forEach((id) => { if (!state.get(id)) visit(id); });

  const forward = valid.filter((edge) => !backEdges.has(`${edge.source}->${edge.target}`));
  const incoming = new Map(ids.map((id) => [id, []]));
  forward.forEach((edge) => incoming.get(edge.target).push(edge.source));

  // Longest-path layering (Kahn order over the forward DAG).
  const layer = new Map();
  const indegree = new Map(ids.map((id) => [id, incoming.get(id).length]));
  const queue = ids.filter((id) => indegree.get(id) === 0);
  queue.forEach((id) => layer.set(id, 0));
  while (queue.length) {
    const id = queue.shift();
    forward.filter((edge) => edge.source === id).forEach((edge) => {
      layer.set(edge.target, Math.max(layer.get(edge.target) ?? 0, layer.get(id) + 1));
      indegree.set(edge.target, indegree.get(edge.target) - 1);
      if (indegree.get(edge.target) === 0) queue.push(edge.target);
    });
  }
  ids.forEach((id) => { if (!layer.has(id)) layer.set(id, 0); });

  const layerCount = Math.max(0, ...layer.values()) + 1;
  const rows = Array.from({ length: layerCount }, () => []);
  const groupOf = new Map(nodes.map((node) => [node.id, node.group || ""]));
  ids.forEach((id) => rows[layer.get(id)].push(id));

  // Barycenter sweeps (keeping a group's members together as a tie-break).
  const order = new Map();
  const index = () => rows.forEach((row) => row.forEach((id, position) => order.set(id, position)));
  index();
  const neighbours = (id, down) => (down ? incoming.get(id) : out.get(id).filter((next) => !backEdges.has(`${id}->${next}`)));
  for (let sweep = 0; sweep < 4; sweep += 1) {
    const down = sweep % 2 === 0;
    const sequence = down ? rows.slice(1) : rows.slice(0, -1).reverse();
    sequence.forEach((row) => {
      const score = (id) => {
        const linked = neighbours(id, down);
        return linked.length ? linked.reduce((sum, other) => sum + order.get(other), 0) / linked.length : order.get(id);
      };
      row.sort((a, b) => score(a) - score(b) || groupOf.get(a).localeCompare(groupOf.get(b)));
    });
    index();
  }

  const horizontal = direction !== "TB";
  const widest = Math.max(1, ...rows.map((row) => row.length));
  const positions = {};
  rows.forEach((row, layerIndex) => {
    const offset = (widest - row.length) / 2;
    row.forEach((id, position) => {
      const along = layerIndex * ((horizontal ? nodeWidth : nodeHeight) + (horizontal ? gapX : gapY * 2));
      const across = (position + offset) * ((horizontal ? nodeHeight : nodeWidth) + (horizontal ? gapY : gapX / 2));
      positions[id] = horizontal ? { x: along, y: across } : { x: across, y: along };
    });
  });
  const xs = Object.values(positions).map((point) => point.x);
  const ys = Object.values(positions).map((point) => point.y);
  return {
    positions,
    backEdges,
    width: (xs.length ? Math.max(...xs) : 0) + nodeWidth,
    height: (ys.length ? Math.max(...ys) : 0) + nodeHeight,
  };
}

/**
 * A binary tree from a LeetCode level-order array ([3,9,20,null,null,15,7]).
 * Returns nodes [{ index, value, depth, left, right, parent }] where index is
 * the position in the array (stable across frames).
 */
export function treeFromLevelOrder(values) {
  const list = Array.isArray(values) ? values : [];
  if (!list.length || list[0] === null || list[0] === undefined) return [];
  const nodes = [{ index: 0, value: list[0], depth: 0, left: null, right: null, parent: null }];
  const queue = [nodes[0]];
  let cursor = 1;
  while (queue.length && cursor < list.length) {
    const node = queue.shift();
    for (const side of ["left", "right"]) {
      if (cursor >= list.length) break;
      const value = list[cursor];
      if (value !== null && value !== undefined) {
        const child = { index: cursor, value, depth: node.depth + 1, left: null, right: null, parent: node.index };
        nodes.push(child);
        node[side] = child.index;
        queue.push(child);
      }
      cursor += 1;
    }
  }
  return nodes;
}

/** x by in-order rank, y by depth. Returns { positions: { index: { x, y } }, width, height }. */
export function treeLayout(nodes, { gapX = 44, gapY = 64, pad = 24 } = {}) {
  const byIndex = new Map(nodes.map((node) => [node.index, node]));
  const positions = {};
  let rank = 0;
  const walk = (index) => {
    const node = byIndex.get(index);
    if (!node) return;
    walk(node.left);
    positions[index] = { x: pad + rank * gapX, y: pad + node.depth * gapY };
    rank += 1;
    walk(node.right);
  };
  if (nodes.length) walk(0);
  const depth = Math.max(0, ...nodes.map((node) => node.depth));
  return { positions, width: pad * 2 + Math.max(0, rank - 1) * gapX, height: pad * 2 + depth * gapY };
}

/** Nodes evenly on a circle. Returns { positions: { id: { x, y } }, width, height }. */
export function circleLayout(ids, { radius, pad = 36 } = {}) {
  const count = ids.length;
  const r = radius || Math.max(70, count * 16);
  const positions = {};
  ids.forEach((id, index) => {
    const angle = (2 * Math.PI * index) / Math.max(1, count) - Math.PI / 2;
    positions[id] = { x: pad + r + r * Math.cos(angle), y: pad + r + r * Math.sin(angle) };
  });
  return { positions, width: 2 * (r + pad), height: 2 * (r + pad) };
}
