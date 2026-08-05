// Seed schema + challenge definitions for the SQL & Query Plan Lab.
//
// Everything here runs inside PGlite (real PostgreSQL compiled to WASM), so the
// plans the learner sees come from the actual Postgres planner — not a mock.
// Row counts are tuned so a Seq Scan and an Index Scan differ by a visible
// margin while still seeding in a couple of seconds on a laptop.

export const SEED_SQL = `
drop table if exists order_items, orders, products, customers cascade;

create table customers (
  id         int primary key,
  name       text not null,
  email      text not null,
  country    text not null,
  created_at timestamptz not null
);

create table products (
  id       int primary key,
  name     text not null,
  category text not null,
  price    numeric(10,2) not null
);

create table orders (
  id          int primary key,
  customer_id int not null,
  status      text not null,
  total       numeric(10,2) not null,
  created_at  timestamptz not null
);

create table order_items (
  id         int primary key,
  order_id   int not null,
  product_id int not null,
  qty        int not null,
  unit_price numeric(10,2) not null
);

-- 5,000 customers across 8 countries
insert into customers (id, name, email, country, created_at)
select g,
       'Customer ' || g,
       'user' || g || '@example.com',
       (array['IN','US','GB','DE','JP','BR','AU','CA'])[1 + (g % 8)],
       now() - ((g % 900) || ' days')::interval
from generate_series(1, 5000) g;

-- 200 products across 6 categories
insert into products (id, name, category, price)
select g,
       'Product ' || g,
       (array['electronics','books','grocery','apparel','toys','home'])[1 + (g % 6)],
       round((5 + (g % 400))::numeric, 2)
from generate_series(1, 200) g;

-- 40,000 orders — deliberately NOT indexed on customer_id
insert into orders (id, customer_id, status, total, created_at)
select g,
       1 + (g::bigint * 7919 % 5000)::int,
       (array['paid','pending','shipped','refunded','cancelled'])[1 + (g % 5)],
       round((10 + (g % 900))::numeric, 2),
       now() - ((g % 720) || ' days')::interval
from generate_series(1, 40000) g;

-- ~120,000 line items
insert into order_items (id, order_id, product_id, qty, unit_price)
select g,
       1 + (g % 40000),
       1 + (g::bigint * 104729 % 200)::int,
       1 + (g % 5),
       round((5 + (g % 400))::numeric, 2)
from generate_series(1, 120000) g;

-- Give the planner real statistics, otherwise every estimate is a guess.
analyze;
`;

export const SCHEMA_SUMMARY = [
  { table: "customers", rows: "5,000", columns: ["id (pk)", "name", "email", "country", "created_at"] },
  { table: "products", rows: "200", columns: ["id (pk)", "name", "category", "price"] },
  { table: "orders", rows: "40,000", columns: ["id (pk)", "customer_id", "status", "total", "created_at"] },
  { table: "order_items", rows: "120,000", columns: ["id (pk)", "order_id", "product_id", "qty", "unit_price"] },
];

// ── Plan helpers used by challenge validators ────────────────────────────────
// Each validator receives a flat list of plan nodes (see flattenPlan in
// SqlLab.jsx) plus the raw root node, and returns { pass, message }.

const findNodes = (nodes, type) => nodes.filter((n) => n["Node Type"] === type);

const scanOf = (nodes, relation, type) =>
  nodes.find((n) => n["Node Type"] === type && n["Relation Name"] === relation);

const anySeqScanOn = (nodes, relation) =>
  nodes.some((n) => n["Node Type"] === "Seq Scan" && n["Relation Name"] === relation);

const indexScanOn = (nodes, relation) =>
  nodes.some(
    (n) =>
      ["Index Scan", "Index Only Scan", "Bitmap Heap Scan"].includes(n["Node Type"]) &&
      n["Relation Name"] === relation
  );

export const CHALLENGES = [
  {
    id: "seq-to-index",
    title: "Kill the Seq Scan",
    difficulty: "Warm-up",
    concept: "Indexes & access paths",
    brief:
      "This query reads every one of the 40,000 rows in `orders` to find the handful belonging to one customer. Run it, read the plan, then add an index so Postgres can jump straight to the rows it needs.",
    hint: "`CREATE INDEX idx_orders_customer ON orders (customer_id);` — then run Explain again. Watch both the node type and the actual time.",
    sql: `select id, status, total, created_at
from orders
where customer_id = 42
order by created_at desc;`,
    validate: (nodes) => {
      if (anySeqScanOn(nodes, "orders")) {
        return {
          pass: false,
          message: "Still a Seq Scan on orders — Postgres is reading all 40,000 rows. Create an index on the column you filter by.",
        };
      }
      if (!indexScanOn(nodes, "orders")) {
        return { pass: false, message: "No index access path on orders yet. Run the query so a plan can be captured." };
      }
      return {
        pass: true,
        message: "Index scan on orders. Postgres now walks the B-tree straight to customer 42 instead of scanning the table.",
      };
    },
  },

  {
    id: "sargable",
    title: "The Index That Never Gets Used",
    difficulty: "Core",
    concept: "Sargability",
    brief:
      "An index on `customers(email)` already exists — this query still ignores it. Wrapping an indexed column in a function, or leading a LIKE with `%`, makes the predicate non-sargable. Rewrite the WHERE clause so the index becomes usable.",
    hint:
      "`lower(email) = …` can't use a plain index on `email`. Either match the column directly (`email = 'user77@example.com'`) or build a matching expression index: `CREATE INDEX ON customers (lower(email));`",
    setup: "create index if not exists idx_customers_email on customers (email);",
    sql: `select id, name, country
from customers
where lower(email) = 'user77@example.com';`,
    validate: (nodes) => {
      if (anySeqScanOn(nodes, "customers")) {
        return {
          pass: false,
          message: "Seq Scan on customers. The predicate is still non-sargable — the planner can't match it to any index.",
        };
      }
      if (!indexScanOn(nodes, "customers")) {
        return { pass: false, message: "Run the query to capture a plan." };
      }
      return {
        pass: true,
        message: "Sargable now — the predicate matches an index the planner can actually use.",
      };
    },
  },

  {
    id: "n-plus-one",
    title: "Collapse the N+1",
    difficulty: "Core",
    concept: "Joins vs. round trips",
    brief:
      "Application code often loops: fetch 20 orders, then fire one query per order for its items. That's 21 round trips. Write a SINGLE query returning each of the 20 most recent orders together with its item count — one join, one trip.",
    hint:
      "Join `orders` to `order_items` on `order_items.order_id = orders.id`, `group by orders.id`, and `count(*)`. An index on `order_items(order_id)` will help the join a lot.",
    sql: `-- Replace this N+1 pattern with one joined query.
select id, total, created_at
from orders
order by created_at desc
limit 20;
-- …then, for each id above, the app would run:
-- select count(*) from order_items where order_id = $1;`,
    validate: (nodes, root, ctx) => {
      const joins = nodes.filter((n) => /Join|Nested Loop/.test(n["Node Type"]));
      if (!joins.length) {
        return { pass: false, message: "No join node in the plan yet — you're still querying a single table." };
      }
      const touchesItems = nodes.some((n) => n["Relation Name"] === "order_items");
      if (!touchesItems) {
        return { pass: false, message: "The plan never touches order_items. Join it in to get the counts." };
      }
      if (!ctx.columns.some((c) => /count|items|n_items/i.test(c))) {
        return { pass: false, message: "Joined — now aggregate. Return a count of items per order." };
      }
      return {
        pass: true,
        message: `One query, one plan, ${joins[0]["Node Type"]} doing the work. 21 round trips became 1.`,
      };
    },
  },

  {
    id: "composite-order",
    title: "Sort Without Sorting",
    difficulty: "Sharp",
    concept: "Composite indexes & ordering",
    brief:
      "This query filters on `status` and orders by `created_at`. Right now Postgres gathers matching rows and then sorts them. A composite index in the right column order lets the index supply the ordering for free — no Sort node at all.",
    hint:
      "Column order matters: equality predicate first, then the ordering column. `CREATE INDEX ON orders (status, created_at DESC);` Try the reverse order too and compare the plans.",
    sql: `select id, customer_id, total, created_at
from orders
where status = 'paid'
order by created_at desc
limit 25;`,
    validate: (nodes) => {
      const sorts = findNodes(nodes, "Sort");
      if (sorts.length) {
        return {
          pass: false,
          message: "There's still a Sort node. The index isn't supplying the order — check your column ordering.",
        };
      }
      if (!indexScanOn(nodes, "orders")) {
        return { pass: false, message: "No index scan on orders yet." };
      }
      return {
        pass: true,
        message: "No Sort node. The index walk returns rows already ordered, so LIMIT 25 stops after 25 rows.",
      };
    },
  },

  {
    id: "estimate-drift",
    title: "When the Planner Guesses Wrong",
    difficulty: "Sharp",
    concept: "Statistics & estimate error",
    brief:
      "Every plan node shows estimated rows vs. actual rows. When those diverge badly the planner picks the wrong strategy — a Nested Loop for a million rows, say. Insert a skewed batch, run this query, and find the node whose estimate is off by more than 10×. Then fix it.",
    hint:
      "After bulk-changing data the statistics are stale. Run `ANALYZE orders;` and explain again — watch the estimate snap back to reality. The lab flags any node off by ≥10× in amber.",
    setup: `insert into orders (id, customer_id, status, total, created_at)
select 500000 + g, 1 + (g % 5000), 'flash_sale', 99.00, now()
from generate_series(1, 12000) g
on conflict (id) do nothing;`,
    sql: `select customer_id, count(*), sum(total)
from orders
where status = 'flash_sale'
group by customer_id
order by sum(total) desc
limit 10;`,
    validate: (nodes) => {
      // Only scan nodes are meaningful here. A Sort or Aggregate sitting under a
      // LIMIT stops early by design, so its "actual" rows are legitimately lower
      // than the estimate — flagging that would be a false positive. Scan-node
      // drift, by contrast, is exactly what stale statistics cause.
      const scans = nodes.filter((n) => /Scan/.test(n["Node Type"]));
      const worst = scans.reduce((acc, n) => {
        const est = (n["Plan Rows"] ?? 0) * (n["Actual Loops"] || 1);
        const act = (n["Actual Rows"] ?? 0) * (n["Actual Loops"] || 1);
        if (est < 1 || act < 1) return acc;
        const ratio = Math.max(est / act, act / est);
        return ratio > acc.ratio ? { ratio, node: n } : acc;
      }, { ratio: 1, node: null });

      if (worst.ratio >= 10) {
        const rel = worst.node["Relation Name"] ? ` on ${worst.node["Relation Name"]}` : "";
        return {
          pass: false,
          message: `"${worst.node["Node Type"]}"${rel} is off by ${worst.ratio.toFixed(1)}× (est ${worst.node["Plan Rows"]} vs actual ${worst.node["Actual Rows"]}). Statistics are stale — run ANALYZE orders;`,
        };
      }
      return {
        pass: true,
        message: `Every scan is within 10× of its estimate (worst: ${worst.ratio.toFixed(1)}×). The planner is working with accurate statistics again.`,
      };
    },
  },
];

export const SNIPPETS = [
  { label: "List indexes", sql: "select tablename, indexname, indexdef from pg_indexes where schemaname = 'public' order by tablename;" },
  { label: "Table sizes", sql: "select relname as table, n_live_tup as rows from pg_stat_user_tables order by n_live_tup desc;" },
  { label: "Refresh stats", sql: "analyze;" },
  { label: "Drop an index", sql: "drop index if exists idx_orders_customer;" },
];
