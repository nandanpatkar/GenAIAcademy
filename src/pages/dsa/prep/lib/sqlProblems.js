// Original SQL practice set. Two small schemas, each with a visible "sample"
// dataset and a hidden "edge" dataset built to catch the classic mistakes:
// COUNT(*) on a LEFT JOIN, ROW_NUMBER hiding ties, >= vs >, NOT DISTINCT,
// forgetting to exclude cancelled orders, INNER JOIN dropping NULL managers.
// A query must match the reference solution on every dataset to be accepted.

export const SCHEMAS = {
  company: {
    title: "Company",
    tables: [
      { name: "departments", columns: [["id", "int"], ["name", "text"], ["location", "text"]] },
      { name: "employees", columns: [["id", "int"], ["name", "text"], ["department_id", "int · nullable"], ["manager_id", "int · nullable"], ["salary", "numeric(10,2)"], ["hired_on", "date"]] },
      { name: "projects", columns: [["id", "int"], ["name", "text"], ["department_id", "int"], ["budget", "numeric(12,2)"]] },
      { name: "assignments", columns: [["employee_id", "int"], ["project_id", "int"], ["hours", "int"]] },
    ],
    ddl: `
      CREATE TABLE departments (id int PRIMARY KEY, name text NOT NULL, location text);
      CREATE TABLE employees (id int PRIMARY KEY, name text NOT NULL, department_id int, manager_id int, salary numeric(10,2) NOT NULL, hired_on date NOT NULL);
      CREATE TABLE projects (id int PRIMARY KEY, name text NOT NULL, department_id int, budget numeric(12,2));
      CREATE TABLE assignments (employee_id int NOT NULL, project_id int NOT NULL, hours int NOT NULL);
    `,
    datasets: {
      sample: `
        INSERT INTO departments VALUES (1,'Engineering','Bengaluru'),(2,'Sales','Mumbai'),(3,'Design','Pune'),(4,'Legal','Delhi');
        INSERT INTO employees VALUES
          (1,'Asha',1,NULL,120000,'2019-03-11'),(2,'Ravi',1,1,85000,'2020-07-01'),(3,'Meera',1,1,85000,'2021-01-15'),
          (4,'Kabir',2,NULL,70000,'2018-11-20'),(5,'Zoya',2,4,52000,'2022-05-02'),(6,'Ishaan',3,NULL,64000,'2020-02-10'),
          (7,'Nina',3,6,48000,'2023-08-21'),(8,'Dev',NULL,1,40000,'2024-01-08');
        INSERT INTO projects VALUES (1,'Search revamp',1,500000),(2,'Q3 push',2,120000),(3,'Brand refresh',3,80000),(4,'Compliance audit',4,50000);
        INSERT INTO assignments VALUES (1,1,20),(2,1,35),(3,1,30),(2,3,10),(5,2,40),(6,3,25),(7,3,15);
      `,
      edge: `
        INSERT INTO departments VALUES (1,'Platform','Hyderabad'),(2,'Support','Chennai'),(3,'Research','Pune');
        INSERT INTO employees VALUES
          (10,'Aarav',1,NULL,90000,'2021-06-01'),(11,'Bela',1,10,90000,'2021-06-01'),(12,'Chirag',1,10,50000,'2022-09-09'),
          (13,'Diya',2,NULL,50000,'2020-01-01'),(14,'Eshan',2,13,50000,'2023-03-03'),(15,'Farah',NULL,NULL,30000,'2019-12-31');
        INSERT INTO projects VALUES (5,'Latency budget',1,200000),(6,'Ticket triage',2,30000),(7,'Moonshot',3,900000);
        INSERT INTO assignments VALUES (10,5,10),(11,5,10),(11,6,5),(13,6,40);
      `,
    },
  },
  shop: {
    title: "Shop",
    tables: [
      { name: "customers", columns: [["id", "int"], ["name", "text"], ["country", "text"], ["joined_on", "date"]] },
      { name: "products", columns: [["id", "int"], ["name", "text"], ["category", "text"], ["price", "numeric(10,2)"]] },
      { name: "orders", columns: [["id", "int"], ["customer_id", "int"], ["ordered_on", "date"], ["status", "text — paid | shipped | cancelled"]] },
      { name: "order_items", columns: [["order_id", "int"], ["product_id", "int"], ["quantity", "int"]] },
    ],
    ddl: `
      CREATE TABLE customers (id int PRIMARY KEY, name text NOT NULL, country text, joined_on date);
      CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL, category text NOT NULL, price numeric(10,2) NOT NULL);
      CREATE TABLE orders (id int PRIMARY KEY, customer_id int NOT NULL, ordered_on date NOT NULL, status text NOT NULL);
      CREATE TABLE order_items (order_id int NOT NULL, product_id int NOT NULL, quantity int NOT NULL);
    `,
    datasets: {
      sample: `
        INSERT INTO customers VALUES (1,'Anika','India','2025-01-05'),(2,'Ben','UK','2025-02-10'),(3,'Chen','Singapore','2025-02-20'),(4,'Dara','India','2025-03-01');
        INSERT INTO products VALUES (1,'Keyboard','Accessories',2500),(2,'Mouse','Accessories',900),(3,'Monitor','Displays',15000),(4,'Laptop stand','Accessories',1800),(5,'Webcam','Video',4200);
        INSERT INTO orders VALUES (100,1,'2025-03-02','paid'),(101,1,'2025-03-15','shipped'),(102,2,'2025-03-20','cancelled'),(103,3,'2025-04-01','paid'),(104,2,'2025-04-11','paid');
        INSERT INTO order_items VALUES (100,1,1),(100,2,2),(101,3,1),(102,5,1),(103,4,3),(104,2,1),(104,5,1);
      `,
      edge: `
        INSERT INTO customers VALUES (1,'Eli','USA','2025-05-01'),(2,'Fay','USA','2025-05-02'),(3,'Gus','Canada','2025-05-03'),(4,'Hana','Canada','2025-07-01');
        INSERT INTO products VALUES (1,'Cable','Accessories',300),(2,'Hub','Accessories',300),(3,'Panel','Displays',9000),(4,'Mic','Audio',3500);
        INSERT INTO orders VALUES (200,1,'2025-05-10','cancelled'),(201,1,'2025-05-10','cancelled'),(202,2,'2025-06-01','paid'),(203,2,'2025-06-01','paid'),(204,3,'2025-06-30','shipped');
        INSERT INTO order_items VALUES (200,3,2),(201,4,1),(202,1,4),(203,2,1),(204,1,1);
      `,
    },
  },
};

export const SQL_PROBLEMS = [
  {
    id: "high-earners", title: "High earners", schema: "company", difficulty: "Easy", topic: "Filtering",
    statement: "List the **name** and **salary** of every employee who earns **more than 70,000**. Any row order.",
    hint: "Strictly more than — check the boundary.",
    solution: "SELECT name, salary\nFROM employees\nWHERE salary > 70000;",
  },
  {
    id: "salary-bands", title: "Salary bands", schema: "company", difficulty: "Easy", topic: "CASE",
    statement: "Label each employee's salary band: `'high'` for 80,000 and above, `'mid'` for 50,000 up to (not including) 80,000, and `'low'` otherwise. Return **name** and **band**.",
    hint: "CASE evaluates branches top to bottom; mind the inclusive boundaries.",
    solution: "SELECT name,\n       CASE WHEN salary >= 80000 THEN 'high'\n            WHEN salary >= 50000 THEN 'mid'\n            ELSE 'low' END AS band\nFROM employees;",
  },
  {
    id: "dept-headcount", title: "Department headcount", schema: "company", difficulty: "Easy", topic: "Joins & aggregation",
    statement: "For **every** department return its **name** and **number of employees**. Departments with nobody in them must appear with **0**.",
    hint: "Which join keeps departments with no employees — and what does COUNT(*) count on the NULL side?",
    solution: "SELECT d.name, COUNT(e.id) AS headcount\nFROM departments d\nLEFT JOIN employees e ON e.department_id = d.id\nGROUP BY d.id, d.name;",
  },
  {
    id: "no-project", title: "Unassigned employees", schema: "company", difficulty: "Easy", topic: "Anti-join",
    statement: "Return the **names** of employees who aren't assigned to any project.",
    hint: "NOT EXISTS, or a LEFT JOIN filtered to the rows that found no match.",
    solution: "SELECT e.name\nFROM employees e\nWHERE NOT EXISTS (\n  SELECT 1 FROM assignments a WHERE a.employee_id = e.id\n);",
  },
  {
    id: "avg-salary-dept", title: "Well-paid departments", schema: "company", difficulty: "Medium", topic: "HAVING",
    statement: "Find departments whose **average salary is above 60,000**. Return the department **name** and the average salary **rounded to 2 decimals**.",
    hint: "Filter groups with HAVING — filtering rows first changes the average.",
    solution: "SELECT d.name, ROUND(AVG(e.salary), 2) AS avg_salary\nFROM departments d\nJOIN employees e ON e.department_id = d.id\nGROUP BY d.id, d.name\nHAVING AVG(e.salary) > 60000;",
  },
  {
    id: "manager-names", title: "Who reports to whom", schema: "company", difficulty: "Medium", topic: "Self join",
    statement: "List each employee's **name** with their **manager's name** (NULL when they have no manager), **ordered by employee id**.",
    hint: "Join the table to itself, and keep employees without a manager.",
    solution: "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id\nORDER BY e.id;",
    ordered: true,
  },
  {
    id: "project-hours", title: "Hours per project", schema: "company", difficulty: "Medium", topic: "Joins & aggregation",
    statement: "Every project's **name** and the **total hours** logged against it. Projects nobody has logged time on show **0**.",
    hint: "SUM over no rows is NULL, not 0.",
    solution: "SELECT p.name, COALESCE(SUM(a.hours), 0) AS total_hours\nFROM projects p\nLEFT JOIN assignments a ON a.project_id = p.id\nGROUP BY p.id, p.name;",
  },
  {
    id: "second-highest", title: "Second-highest salary", schema: "company", difficulty: "Medium", topic: "Subqueries",
    statement: "Return the **second-highest distinct salary** as a single column. If there isn't one, return **one row containing NULL**.",
    hint: "Duplicates of the top salary don't count as second. An empty result isn't the same as a NULL row.",
    solution: "SELECT (\n  SELECT DISTINCT salary FROM employees\n  ORDER BY salary DESC\n  OFFSET 1 LIMIT 1\n) AS second_highest;",
    extra: [{ name: "single salary", sql: "INSERT INTO employees VALUES (1,'Solo',NULL,NULL,50000,'2024-01-01'),(2,'Duo',NULL,NULL,50000,'2024-02-01');" }],
  },
  {
    id: "top-earner-per-dept", title: "Top earner per department", schema: "company", difficulty: "Medium", topic: "Window functions",
    statement: "For each department that has employees, return the **department name**, the **employee name** and **salary** of its highest-paid employee. If several people share the top salary, list them all.",
    hint: "ROW_NUMBER picks one row per tie; RANK or a MAX() comparison keeps them all.",
    solution: "SELECT d.name AS department, e.name AS employee, e.salary\nFROM employees e\nJOIN departments d ON d.id = e.department_id\nWHERE e.salary = (\n  SELECT MAX(x.salary) FROM employees x WHERE x.department_id = e.department_id\n);",
  },
  {
    id: "running-hires", title: "Running hire count", schema: "company", difficulty: "Hard", topic: "Window functions",
    statement: "List every employee's **name** and **hire date** with a **running count** of employees hired up to and including that date. People hired on the same day share the same count. **Order by hire date, then id.**",
    hint: "The default window frame with ORDER BY is RANGE — peers share a value. ROW_NUMBER doesn't.",
    solution: "SELECT name, hired_on,\n       COUNT(*) OVER (ORDER BY hired_on) AS hired_so_far\nFROM employees\nORDER BY hired_on, id;",
    ordered: true,
  },
  {
    id: "never-ordered", title: "Customers who never ordered", schema: "shop", difficulty: "Easy", topic: "Anti-join",
    statement: "Return the **names** of customers who have never placed an order (of any status).",
    hint: "A cancelled order is still an order.",
    solution: "SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;",
  },
  {
    id: "repeat-customers", title: "Repeat customers", schema: "shop", difficulty: "Easy", topic: "HAVING",
    statement: "Customers with **at least two orders that weren't cancelled**: their **name** and the **number** of such orders.",
    hint: "Exclude cancelled orders before counting.",
    solution: "SELECT c.name, COUNT(*) AS orders\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.status <> 'cancelled'\nGROUP BY c.id, c.name\nHAVING COUNT(*) >= 2;",
  },
  {
    id: "revenue-by-category", title: "Revenue by category", schema: "shop", difficulty: "Medium", topic: "Joins & aggregation",
    statement: "Revenue per product **category** from orders that were **not cancelled**. Revenue is `quantity × price`. Only categories that earned something appear.",
    hint: "Three tables: items → orders (for status) and items → products (for price and category).",
    solution: "SELECT p.category, SUM(oi.quantity * p.price) AS revenue\nFROM order_items oi\nJOIN orders o ON o.id = oi.order_id\nJOIN products p ON p.id = oi.product_id\nWHERE o.status <> 'cancelled'\nGROUP BY p.category;",
  },
  {
    id: "monthly-orders", title: "Orders per month", schema: "shop", difficulty: "Medium", topic: "Dates",
    statement: "The number of **non-cancelled orders per month**, with the month formatted as `YYYY-MM`, **oldest month first**. Months without such orders are left out.",
    hint: "to_char(date, 'YYYY-MM') gives a sortable month label.",
    solution: "SELECT to_char(ordered_on, 'YYYY-MM') AS month, COUNT(*) AS orders\nFROM orders\nWHERE status <> 'cancelled'\nGROUP BY 1\nORDER BY 1;",
    ordered: true,
  },
  {
    id: "above-category-avg", title: "Pricier than their category", schema: "shop", difficulty: "Medium", topic: "Subqueries",
    statement: "Products priced **strictly above the average price of their own category**: **name**, **category**, **price**.",
    hint: "A correlated subquery compares each product with its own category's average.",
    solution: "SELECT p.name, p.category, p.price\nFROM products p\nWHERE p.price > (\n  SELECT AVG(q.price) FROM products q WHERE q.category = p.category\n);",
  },
  {
    id: "first-order", title: "Each customer's first order", schema: "shop", difficulty: "Hard", topic: "Window functions",
    statement: "For each customer who has ordered anything, their **name**, the **id** and **date** of their first order. If two orders share the earliest date, take the **lower order id**.",
    hint: "DISTINCT ON with the right ORDER BY, or ROW_NUMBER() partitioned by customer.",
    solution: "SELECT DISTINCT ON (c.id) c.name, o.id AS order_id, o.ordered_on\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nORDER BY c.id, o.ordered_on, o.id;",
  },
];

export const sqlProblemById = (id) => SQL_PROBLEMS.find((problem) => problem.id === id) || null;

/** Every dataset a submission is judged on: the visible sample first, then hidden ones. */
export function datasetsFor(problem) {
  const schema = SCHEMAS[problem.schema];
  return [
    { name: "sample", hidden: false, fixture: schema.ddl + schema.datasets.sample },
    { name: "edge cases", hidden: true, fixture: schema.ddl + schema.datasets.edge },
    ...(problem.extra || []).map((entry) => ({ name: entry.name, hidden: true, fixture: schema.ddl + entry.sql })),
  ];
}
