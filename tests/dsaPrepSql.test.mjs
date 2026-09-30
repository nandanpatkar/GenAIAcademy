// SQL practice content + judge, run against real PostgreSQL (PGlite in Node).
// Proves each reference solution runs on every dataset, correct alternatives
// are accepted, and the hidden datasets reject the mistakes they target.
// Run: npm run test:dsa-prep
import test from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { ensureRole, executeInSandbox } from "../src/pages/dsa/prep/lib/sqlExec.js";
import { compareResults, precheckQuery } from "../src/pages/dsa/prep/lib/sqlJudge.js";
import { SQL_PROBLEMS, datasetsFor, sqlProblemById } from "../src/pages/dsa/prep/lib/sqlProblems.js";

const pg = new PGlite();
await pg.waitReady;
await ensureRole(pg);
let runId = 0;

async function judge(problem, sql) {
  for (const dataset of datasetsFor(problem)) {
    const expected = await executeInSandbox(pg, dataset.fixture, problem.solution, runId += 1);
    assert.ok(expected.ok, `${problem.id} reference failed on ${dataset.name}: ${expected.error}`);
    const actual = await executeInSandbox(pg, dataset.fixture, sql, runId += 1);
    if (!actual.ok) return { pass: false, dataset: dataset.name, reason: "error", message: actual.error };
    const verdict = compareResults(expected, actual, { ordered: problem.ordered });
    if (!verdict.pass) return { ...verdict, dataset: dataset.name };
  }
  return { pass: true };
}

test("every reference solution runs on every dataset and returns rows where expected", async () => {
  for (const problem of SQL_PROBLEMS) {
    for (const dataset of datasetsFor(problem)) {
      const result = await executeInSandbox(pg, dataset.fixture, problem.solution, runId += 1);
      assert.ok(result.ok, `${problem.id}/${dataset.name}: ${result.error}`);
      if (dataset.name === "sample") assert.ok(result.rows.length > 0, `${problem.id} sample result is empty`);
    }
    assert.equal((await judge(problem, problem.solution)).pass, true, problem.id);
  }
});

test("equivalent alternative queries are accepted", async () => {
  const alternatives = {
    "dept-headcount": "select d.name, (select count(*) from employees e where e.department_id = d.id) from departments d",
    "top-earner-per-dept": "select dept, emp, salary from (select d.name dept, e.name emp, e.salary, rank() over (partition by d.id order by e.salary desc) r from employees e join departments d on d.id = e.department_id) t where r = 1",
    "second-highest": "select max(salary) from employees where salary < (select max(salary) from employees)",
    "never-ordered": "select name from customers c where not exists (select 1 from orders o where o.customer_id = c.id);",
    "high-earners": "SELECT name, salary::float FROM employees WHERE salary > 70000 ORDER BY salary",
  };
  for (const [id, sql] of Object.entries(alternatives)) {
    const verdict = await judge(sqlProblemById(id), sql);
    assert.equal(verdict.pass, true, `${id}: ${verdict.message}`);
  }
});

test("hidden datasets reject the mistakes they were designed for", async () => {
  const wrong = [
    ["high-earners", "select name, salary from employees where salary >= 70000"],
    ["salary-bands", "select name, case when salary > 80000 then 'high' when salary > 50000 then 'mid' else 'low' end from employees"],
    ["dept-headcount", "select d.name, count(*) from departments d left join employees e on e.department_id = d.id group by d.id, d.name"],
    ["dept-headcount", "select d.name, count(e.id) from departments d join employees e on e.department_id = d.id group by d.id, d.name"],
    ["avg-salary-dept", "select d.name, round(avg(e.salary), 2) from departments d join employees e on e.department_id = d.id where e.salary > 60000 group by d.id, d.name"],
    ["manager-names", "select e.name, m.name from employees e join employees m on m.id = e.manager_id order by e.id"],
    ["project-hours", "select p.name, sum(a.hours) from projects p left join assignments a on a.project_id = p.id group by p.id, p.name"],
    ["second-highest", "select salary from employees order by salary desc offset 1 limit 1"],
    ["second-highest", "select distinct salary from employees order by salary desc offset 1 limit 1"],
    ["top-earner-per-dept", "select dept, emp, salary from (select d.name dept, e.name emp, e.salary, row_number() over (partition by d.id order by e.salary desc) r from employees e join departments d on d.id = e.department_id) t where r = 1"],
    ["running-hires", "select name, hired_on, row_number() over (order by hired_on, id) from employees order by hired_on, id"],
    ["repeat-customers", "select c.name, count(*) from customers c join orders o on o.customer_id = c.id group by c.id, c.name having count(*) >= 2"],
    ["revenue-by-category", "select p.category, sum(oi.quantity * p.price) from order_items oi join products p on p.id = oi.product_id group by p.category"],
    ["monthly-orders", "select to_char(ordered_on, 'YYYY-MM'), count(*) from orders group by 1 order by 1"],
    ["above-category-avg", "select p.name, p.category, p.price from products p where p.price >= (select avg(q.price) from products q where q.category = p.category)"],
    ["first-order", "select distinct on (c.id) c.name, o.id, o.ordered_on from customers c join orders o on o.customer_id = c.id order by c.id, o.ordered_on, o.id desc"],
  ];
  for (const [id, sql] of wrong) {
    const verdict = await judge(sqlProblemById(id), sql);
    assert.equal(verdict.pass, false, `${id} should reject: ${sql}`);
  }
});

test("the sandbox is read-only, single-statement and leaves nothing behind", async () => {
  const fixture = datasetsFor(sqlProblemById("high-earners"))[0].fixture;
  for (const sql of ["insert into employees values (99,'x',null,null,1,'2024-01-01')", "drop table employees", "select 1; select 2"]) {
    const result = await executeInSandbox(pg, fixture, sql, runId += 1);
    assert.equal(result.ok, false, sql);
  }
  // Role changes are stopped by the pre-check, not the database (see sqlExec.js).
  assert.equal(precheckQuery("set role postgres").ok, false);
  await executeInSandbox(pg, fixture, "set role postgres", runId += 1);
  const leftovers = await pg.query("select count(*)::int as n from information_schema.schemata where schema_name like 'run_%'");
  assert.equal(leftovers.rows[0].n, 0);
  const who = await pg.query("select current_user as u");
  assert.equal(who.rows[0].u, "postgres");
});

test("judge semantics: multisets, NULLs, numeric tolerance, order and columns", () => {
  const e = { columns: ["a", "b"], rows: [[1, "2.50"], [1, "2.50"], [null, "x"]] };
  assert.equal(compareResults(e, { columns: ["x", "y"], rows: [[null, "x"], [1, 2.5], [1, 2.5]] }).pass, true);
  assert.equal(compareResults(e, { columns: ["x", "y"], rows: [[null, "x"], [1, 2.5]] }).reason, "rowcount");
  assert.equal(compareResults(e, { columns: ["x"], rows: [[1], [1], [null]] }).reason, "columns");
  assert.equal(compareResults(e, { columns: ["x", "y"], rows: [[1, 2.5], [null, "x"], [1, 2.5]] }, { ordered: true }).reason, "order");
  assert.equal(compareResults(e, { columns: ["x", "y"], rows: [[1, 2.5], [1, 2.5], [0, "x"]] }).pass, false);
  assert.equal(precheckQuery("  -- hi\nselect 1;").ok, true);
  assert.equal(precheckQuery("delete from t").ok, false);
  assert.equal(precheckQuery("/* x */").ok, false);
});
