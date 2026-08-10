export const QUEST_MISSIONS = [
  {
    id: "one-lane",
    chapter: "01",
    title: "The One-Lane Kitchen",
    shortTitle: "One lane",
    eyebrow: "Start with the familiar",
    difficulty: "Beginner",
    duration: "8 min",
    concept: "Synchronous execution",
    story:
      "A tiny kitchen has one cook. They take an order, wait for it to bake, hand it over, and only then touch the next order. The work is predictable—but every wait freezes the whole line.",
    takeaway:
      "Synchronous code completes the current operation before moving to the next one. Waiting time adds up.",
    misconception: "Synchronous does not mean bad. It is often the clearest choice when work is short, ordered, or dependent.",
    syncTasks: [
      { name: "Soup", start: 0, duration: 3, color: "coral" },
      { name: "Bread", start: 3, duration: 2, color: "gold" },
      { name: "Tea", start: 5, duration: 1, color: "mint" },
    ],
    asyncTasks: [
      { name: "Soup", start: 0, duration: 3, color: "coral" },
      { name: "Bread", start: 0, duration: 2, color: "gold" },
      { name: "Tea", start: 0, duration: 1, color: "mint" },
    ],
    quiz: [
      {
        question: "Three independent synchronous waits take 3s, 2s, and 1s. Roughly how long is the total wait?",
        options: ["3 seconds", "6 seconds", "1 second", "It cannot be known"],
        answer: 1,
        explanation: "They run one after another, so the waits add: 3 + 2 + 1 = 6 seconds.",
      },
      {
        question: "When is synchronous code a sensible choice?",
        options: ["Never", "Only for web servers", "When work is short or must happen in order", "Only when using threads"],
        answer: 2,
        explanation: "Straight-line synchronous code is often the simplest and safest expression of ordered work.",
      },
    ],
    starterCode: `import time

def prepare(name, delay):
    print(f"START:{name}")
    time.sleep(delay)
    print(f"DONE:{name}")

# Keep these calls synchronous and in this exact order.
prepare("soup", 0.10)
prepare("bread", 0.06)
prepare("tea", 0.03)
print("KITCHEN:CLOSED")`,
    solutionCode: `import time

def prepare(name, delay):
    print(f"START:{name}")
    time.sleep(delay)
    print(f"DONE:{name}")

prepare("soup", 0.10)
prepare("bread", 0.06)
prepare("tea", 0.03)
print("KITCHEN:CLOSED")`,
    check: {
      outputOrder: ["START:soup", "DONE:soup", "START:bread", "DONE:bread", "START:tea", "DONE:tea", "KITCHEN:CLOSED"],
    },
  },
  {
    id: "coroutine-ticket",
    chapter: "02",
    title: "A Ticket Is Not a Delivery",
    shortTitle: "Coroutines",
    eyebrow: "Meet async def",
    difficulty: "Beginner",
    duration: "9 min",
    concept: "Coroutine objects",
    story:
      "Writing an async function creates a recipe. Calling it creates a ticket for future work. The ticket still needs an event loop—or another coroutine—to actually run it.",
    takeaway: "Calling an `async def` function returns a coroutine object. It does not execute the body immediately.",
    misconception: "Adding `async` to `def` does not automatically make the function run in the background.",
    syncTasks: [
      { name: "Call function", start: 0, duration: 1, color: "violet" },
      { name: "Run body", start: 1, duration: 2, color: "coral" },
    ],
    asyncTasks: [
      { name: "Create ticket", start: 0, duration: 1, color: "violet" },
      { name: "Await ticket", start: 1, duration: 1, color: "mint" },
      { name: "Run body", start: 2, duration: 2, color: "coral" },
    ],
    quiz: [
      {
        question: "What does calling `deliver()` return when `deliver` was declared with `async def`?",
        options: ["The final result", "A coroutine object", "A new operating-system thread", "Nothing"],
        answer: 1,
        explanation: "The call creates a coroutine object. It must be awaited or scheduled before its body runs.",
      },
      {
        question: "Which statement normally starts the top-level coroutine in a Python script?",
        options: ["asyncio.run(main())", "main.start()", "await run", "thread(main)"],
        answer: 0,
        explanation: "`asyncio.run(main())` creates and manages the event loop for the top-level coroutine.",
      },
    ],
    starterCode: `import asyncio

async def deliver():
    return "package-arrived"

async def main():
    # TODO: await deliver() and print RESULT:<value>
    pass

asyncio.run(main())`,
    solutionCode: `import asyncio

async def deliver():
    return "package-arrived"

async def main():
    result = await deliver()
    print(f"RESULT:{result}")

asyncio.run(main())`,
    check: {
      requiredCode: ["await deliver()", "asyncio.run"],
      outputIncludes: ["RESULT:package-arrived"],
    },
  },
  {
    id: "yield-point",
    chapter: "03",
    title: "The Golden Yield Point",
    shortTitle: "Await",
    eyebrow: "Let someone else move",
    difficulty: "Beginner",
    duration: "10 min",
    concept: "await and cooperative scheduling",
    story:
      "A courier reaches a locked door. Instead of staring at it, they return control to dispatch. `await` is that handoff: this task pauses at a safe point while another ready task gets a turn.",
    takeaway: "`await` pauses the current coroutine and lets the event loop run other ready work.",
    misconception: "`await` does not create parallel CPU execution. Python code still runs cooperatively, one active task at a time on the event-loop thread.",
    syncTasks: [
      { name: "Courier A", start: 0, duration: 3, color: "coral" },
      { name: "Courier B", start: 3, duration: 3, color: "cyan" },
    ],
    asyncTasks: [
      { name: "Courier A waits", start: 0, duration: 3, color: "coral" },
      { name: "Courier B waits", start: 0, duration: 3, color: "cyan" },
    ],
    quiz: [
      {
        question: "What happens when a task reaches `await asyncio.sleep(1)`?",
        options: ["The whole program freezes", "The task yields so other ready tasks can run", "A CPU core is added", "The coroutine is deleted"],
        answer: 1,
        explanation: "The current task suspends. The event loop can advance another ready task during the wait.",
      },
      {
        question: "Does `await` automatically make CPU-heavy work faster?",
        options: ["Yes, always", "Yes, on laptops", "No; async mainly helps waiting/I/O work", "Only when printed"],
        answer: 2,
        explanation: "CPU-heavy work keeps the event-loop thread busy unless it is moved to a thread/process or redesigned.",
      },
    ],
    starterCode: `import asyncio

async def door(name):
    print(f"WAIT:{name}")
    # TODO: wait without blocking the event loop
    await asyncio.sleep(0.08)
    print(f"OPEN:{name}")

async def main():
    await door("A")

asyncio.run(main())`,
    solutionCode: `import asyncio

async def door(name):
    print(f"WAIT:{name}")
    await asyncio.sleep(0.08)
    print(f"OPEN:{name}")

async def main():
    await door("A")

asyncio.run(main())`,
    check: {
      forbiddenCode: ["time.sleep"],
      requiredCode: ["await asyncio.sleep"],
      outputOrder: ["WAIT:A", "OPEN:A"],
    },
  },
  {
    id: "gather-fleet",
    chapter: "04",
    title: "Launch the Whole Fleet",
    shortTitle: "Gather",
    eyebrow: "Independent waits, together",
    difficulty: "Core",
    duration: "12 min",
    concept: "asyncio.gather",
    story:
      "Three services can answer independently: menu, payment, and delivery. Launch all three, then wait for the fleet. The total waiting time approaches the slowest service—not the sum of all three.",
    takeaway: "Use `asyncio.gather()` when independent awaitables can run concurrently and you need all their results.",
    misconception: "`gather()` preserves result order by input position, even if tasks finish in a different order.",
    syncTasks: [
      { name: "Menu API", start: 0, duration: 3, color: "gold" },
      { name: "Payment API", start: 3, duration: 2, color: "mint" },
      { name: "Delivery API", start: 5, duration: 4, color: "violet" },
    ],
    asyncTasks: [
      { name: "Menu API", start: 0, duration: 3, color: "gold" },
      { name: "Payment API", start: 0, duration: 2, color: "mint" },
      { name: "Delivery API", start: 0, duration: 4, color: "violet" },
    ],
    quiz: [
      {
        question: "Independent async jobs take 3s, 2s, and 4s. About how long does `gather()` wait?",
        options: ["9 seconds", "4 seconds", "2 seconds", "0 seconds"],
        answer: 1,
        explanation: "They overlap, so the overall wait is close to the longest individual wait: 4 seconds.",
      },
      {
        question: "In what order does `gather(a, b, c)` return successful results?",
        options: ["Random order", "Completion order", "Input order: a, b, c", "Alphabetical order"],
        answer: 2,
        explanation: "The returned results correspond to the order of the awaitables passed to `gather()`.",
      },
    ],
    starterCode: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return name

async def main():
    # TODO: run all three fetches concurrently
    results = []
    print("RESULTS:" + ",".join(results))

asyncio.run(main())`,
    solutionCode: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return name

async def main():
    results = await asyncio.gather(
        fetch("menu", 0.10),
        fetch("payment", 0.06),
        fetch("delivery", 0.12),
    )
    print("RESULTS:" + ",".join(results))

asyncio.run(main())`,
    check: {
      requiredCode: ["asyncio.gather", "await"],
      outputIncludes: ["RESULTS:menu,payment,delivery"],
    },
  },
  {
    id: "task-launchpad",
    chapter: "05",
    title: "The Task Launchpad",
    shortTitle: "Tasks",
    eyebrow: "Schedule now, await later",
    difficulty: "Core",
    duration: "12 min",
    concept: "asyncio.create_task",
    story:
      "Sometimes work should start now while the current coroutine prepares something else. A Task is a scheduled coroutine that the event loop can advance as soon as control is yielded.",
    takeaway: "`asyncio.create_task()` schedules a coroutine. Keep the task reference and await it before leaving its scope.",
    misconception: "Creating a task is not fire-and-forget. Unobserved failures and unfinished tasks create fragile programs.",
    syncTasks: [
      { name: "Create report", start: 0, duration: 3, color: "cyan" },
      { name: "Prepare UI", start: 3, duration: 2, color: "violet" },
    ],
    asyncTasks: [
      { name: "Report task", start: 0, duration: 3, color: "cyan" },
      { name: "Prepare UI", start: 0, duration: 2, color: "violet" },
    ],
    quiz: [
      {
        question: "What does `asyncio.create_task(coro())` do?",
        options: ["Runs it in a new process", "Schedules the coroutine on the running event loop", "Blocks until it finishes", "Converts it to sync code"],
        answer: 1,
        explanation: "It wraps and schedules the coroutine as a Task on the current running event loop.",
      },
      {
        question: "What should usually happen to a task reference?",
        options: ["Delete it immediately", "Await it or manage it in a TaskGroup", "Convert it to a string", "Send it to `time.sleep`"],
        answer: 1,
        explanation: "Structured ownership ensures completion and makes errors observable.",
      },
    ],
    starterCode: `import asyncio

async def build_report():
    await asyncio.sleep(0.08)
    return "report-ready"

async def main():
    # TODO: schedule build_report now
    report_task = None
    print("UI:prepared")
    # TODO: await the task and print REPORT:<result>

asyncio.run(main())`,
    solutionCode: `import asyncio

async def build_report():
    await asyncio.sleep(0.08)
    return "report-ready"

async def main():
    report_task = asyncio.create_task(build_report())
    print("UI:prepared")
    result = await report_task
    print(f"REPORT:{result}")

asyncio.run(main())`,
    check: {
      requiredCode: ["asyncio.create_task", "await report_task"],
      outputOrder: ["UI:prepared", "REPORT:report-ready"],
    },
  },
  {
    id: "blocking-trap",
    chapter: "06",
    title: "The Blocking Trap",
    shortTitle: "Blocking",
    eyebrow: "One bad wait freezes the loop",
    difficulty: "Core",
    duration: "11 min",
    concept: "Blocking vs non-blocking waits",
    story:
      "One courier refuses to hand control back while waiting. Dispatch cannot move anyone else. A blocking call inside async code can erase the benefit of the whole event loop.",
    takeaway: "Use awaitable I/O in async code. A blocking `time.sleep()` stops the event-loop thread; `await asyncio.sleep()` yields it.",
    misconception: "Placing a blocking function inside `async def` does not make that function asynchronous.",
    syncTasks: [
      { name: "Blocking task", start: 0, duration: 4, color: "coral" },
      { name: "Ready task", start: 4, duration: 1, color: "mint" },
    ],
    asyncTasks: [
      { name: "Waiting task", start: 0, duration: 4, color: "coral" },
      { name: "Ready task", start: 0, duration: 1, color: "mint" },
    ],
    quiz: [
      {
        question: "What is wrong with `time.sleep(2)` inside a coroutine?",
        options: ["Nothing", "It blocks the event-loop thread", "It creates too many tasks", "It changes Python syntax"],
        answer: 1,
        explanation: "Other event-loop tasks cannot advance until the blocking call returns.",
      },
      {
        question: "What is the direct non-blocking replacement for a simulated wait?",
        options: ["await asyncio.sleep(2)", "async time.sleep(2)", "yield time.sleep(2)", "asyncio.block(2)"],
        answer: 0,
        explanation: "`asyncio.sleep` suspends the current task and lets the loop run other ready work.",
      },
    ],
    starterCode: `import asyncio
import time

async def worker(name):
    print(f"START:{name}")
    time.sleep(0.08)  # Fix this blocking call
    print(f"DONE:{name}")

async def main():
    await asyncio.gather(worker("A"), worker("B"))
    print("LOOP:HEALTHY")

asyncio.run(main())`,
    solutionCode: `import asyncio

async def worker(name):
    print(f"START:{name}")
    await asyncio.sleep(0.08)
    print(f"DONE:{name}")

async def main():
    await asyncio.gather(worker("A"), worker("B"))
    print("LOOP:HEALTHY")

asyncio.run(main())`,
    check: {
      forbiddenCode: ["time.sleep"],
      requiredCode: ["await asyncio.sleep", "asyncio.gather"],
      outputIncludes: ["START:A", "START:B", "DONE:A", "DONE:B", "LOOP:HEALTHY"],
    },
  },
  {
    id: "failure-weather",
    chapter: "07",
    title: "Weather the Failure",
    shortTitle: "Errors",
    eyebrow: "Failures are part of the fleet",
    difficulty: "Advanced",
    duration: "13 min",
    concept: "Concurrent error handling",
    story:
      "One service fails while two others succeed. The dispatcher needs an explicit policy: fail the whole mission, collect exceptions as results, retry, or cancel related work.",
    takeaway: "Concurrency does not remove errors. Decide how failures propagate and make that policy visible in code.",
    misconception: "`return_exceptions=True` is not always the right policy; it is useful only when callers intentionally inspect each result.",
    syncTasks: [
      { name: "Profile", start: 0, duration: 2, color: "mint" },
      { name: "Orders fails", start: 2, duration: 2, color: "coral" },
      { name: "Offers", start: 4, duration: 2, color: "gold" },
    ],
    asyncTasks: [
      { name: "Profile", start: 0, duration: 2, color: "mint" },
      { name: "Orders fails", start: 0, duration: 2, color: "coral" },
      { name: "Offers", start: 0, duration: 2, color: "gold" },
    ],
    quiz: [
      {
        question: "Why use `return_exceptions=True` with `gather()`?",
        options: ["To hide every bug", "To receive failures alongside successful results for deliberate inspection", "To retry forever", "To make CPU code parallel"],
        answer: 1,
        explanation: "It turns exceptions into result entries so the caller can apply a per-operation policy.",
      },
      {
        question: "Which modern tool provides structured ownership of a group of tasks in Python 3.11+?",
        options: ["TaskGroup", "ThreadBucket", "AsyncList", "LoopSet"],
        answer: 0,
        explanation: "`asyncio.TaskGroup` keeps related tasks within one managed lifetime and propagates failures structurally.",
      },
    ],
    starterCode: `import asyncio

async def service(name, fail=False):
    await asyncio.sleep(0.04)
    if fail:
        raise RuntimeError(f"{name}-offline")
    return f"{name}-ok"

async def main():
    # Collect all outcomes so one failure does not hide the successes.
    results = await asyncio.gather(
        service("profile"),
        service("orders", fail=True),
        service("offers"),
    )
    print("OUTCOMES:" + ",".join(str(item) for item in results))

asyncio.run(main())`,
    solutionCode: `import asyncio

async def service(name, fail=False):
    await asyncio.sleep(0.04)
    if fail:
        raise RuntimeError(f"{name}-offline")
    return f"{name}-ok"

async def main():
    results = await asyncio.gather(
        service("profile"),
        service("orders", fail=True),
        service("offers"),
        return_exceptions=True,
    )
    print("OUTCOMES:" + ",".join(str(item) for item in results))

asyncio.run(main())`,
    check: {
      requiredCode: ["return_exceptions=True"],
      outputIncludes: ["profile-ok", "orders-offline", "offers-ok"],
    },
  },
  {
    id: "final-dispatch",
    chapter: "08",
    title: "The Dispatch Master",
    shortTitle: "Capstone",
    eyebrow: "Choose the right model",
    difficulty: "Capstone",
    duration: "15 min",
    concept: "Choosing sync or async",
    story:
      "A dashboard loads three independent network resources, formats a tiny summary, then prints it. Your job is to overlap the waiting work without turning simple CPU work into needless async code.",
    takeaway: "Async is a design choice for overlapping waits. Keep ordinary computation ordinary, and make task ownership explicit.",
    misconception: "A mature solution is not 'async everywhere.' It places async boundaries where waiting can overlap.",
    syncTasks: [
      { name: "Profile API", start: 0, duration: 3, color: "violet" },
      { name: "Orders API", start: 3, duration: 4, color: "coral" },
      { name: "News API", start: 7, duration: 2, color: "cyan" },
      { name: "Format", start: 9, duration: 1, color: "mint" },
    ],
    asyncTasks: [
      { name: "Profile API", start: 0, duration: 3, color: "violet" },
      { name: "Orders API", start: 0, duration: 4, color: "coral" },
      { name: "News API", start: 0, duration: 2, color: "cyan" },
      { name: "Format", start: 4, duration: 1, color: "mint" },
    ],
    quiz: [
      {
        question: "Which workload is the best fit for asyncio?",
        options: ["Calculating millions of hashes", "Waiting on many independent network requests", "Sorting one tiny list", "Rendering CSS"],
        answer: 1,
        explanation: "Asyncio shines when many operations spend time waiting for I/O.",
      },
      {
        question: "What should happen to the small formatting step after the requests finish?",
        options: ["Keep it as a normal function", "Make it a new process", "Always wrap it in create_task", "Replace it with sleep"],
        answer: 0,
        explanation: "Small, immediate computation stays clearest as ordinary synchronous code.",
      },
    ],
    starterCode: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return name.upper()

def format_dashboard(items):
    return " | ".join(items)

async def main():
    # Refactor these independent waits to run concurrently.
    profile = await fetch("profile", 0.08)
    orders = await fetch("orders", 0.10)
    news = await fetch("news", 0.05)
    print("DASHBOARD:" + format_dashboard([profile, orders, news]))

asyncio.run(main())`,
    solutionCode: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return name.upper()

def format_dashboard(items):
    return " | ".join(items)

async def main():
    profile, orders, news = await asyncio.gather(
        fetch("profile", 0.08),
        fetch("orders", 0.10),
        fetch("news", 0.05),
    )
    print("DASHBOARD:" + format_dashboard([profile, orders, news]))

asyncio.run(main())`,
    check: {
      requiredCode: ["asyncio.gather"],
      outputIncludes: ["DASHBOARD:PROFILE | ORDERS | NEWS"],
    },
  },
];

export const QUICK_REFERENCE = [
  { term: "Synchronous", meaning: "Finish the current operation before advancing to the next one.", code: "result = fetch()" },
  { term: "Coroutine", meaning: "A suspendable computation produced by calling an async function.", code: "job = fetch_async()" },
  { term: "await", meaning: "Pause this coroutine until an awaitable is ready, yielding control meanwhile.", code: "result = await job" },
  { term: "Task", meaning: "A coroutine scheduled on the running event loop.", code: "task = asyncio.create_task(job)" },
  { term: "gather", meaning: "Run several awaitables concurrently and collect results in input order.", code: "results = await asyncio.gather(a(), b())" },
  { term: "Event loop", meaning: "The scheduler that advances ready tasks and revisits waiting tasks.", code: "asyncio.run(main())" },
];

export const ASYNC_THEORY = {
  definition:
    "Asynchronous programming is a way for one program to make progress on other work while it is waiting. Instead of freezing at a slow operation, the current task pauses and gives another task a turn.",
  analogy:
    "Imagine one cook making tea and toast. The cook starts the kettle, then prepares the toast while the water heats. The cook is still one person, but waiting time is no longer wasted. That is the basic idea behind async programming.",
  steps: [
    {
      title: "Create a coroutine",
      text: "Calling a function written with `async def` creates work that can pause and resume.",
      code: "job = make_tea()",
    },
    {
      title: "Schedule the work",
      text: "The event loop keeps track of which tasks are ready and which tasks are waiting.",
      code: "asyncio.run(main())",
    },
    {
      title: "Pause at await",
      text: "When a task reaches `await`, it pauses until that operation is ready. Other tasks may run meanwhile.",
      code: "await asyncio.sleep(2)",
    },
    {
      title: "Resume with a result",
      text: "When the wait finishes, the event loop gives the paused task another turn from the same line.",
      code: "tea = await make_tea()",
    },
  ],
  glossary: [
    { term: "async def", meaning: "Defines a function that can pause." },
    { term: "coroutine", meaning: "The pause-and-resume work created by an async function." },
    { term: "await", meaning: "Pause this task here until the awaited work is ready." },
    { term: "event loop", meaning: "The coordinator that decides which ready task gets the next turn." },
    { term: "task", meaning: "A coroutine that has been scheduled to run." },
  ],
  exampleCode: `import asyncio

async def make_drink(name, seconds):
    print(f"Starting {name}")
    await asyncio.sleep(seconds)
    print(f"Finished {name}")
    return name

async def main():
    drinks = await asyncio.gather(
        make_drink("tea", 2),
        make_drink("coffee", 1),
    )
    print(drinks)

asyncio.run(main())`,
  exampleNotes: [
    "`async def` creates a function whose work can be paused.",
    "`await asyncio.sleep(...)` represents waiting without freezing the whole event loop.",
    "`asyncio.gather(...)` starts both independent drink jobs and waits for both results.",
    "The coffee can finish before the tea, but `gather` returns results in the order supplied.",
  ],
  useWhen: ["Calling APIs", "Waiting for databases", "Handling many connections", "Timers and network I/O"],
  keepSyncWhen: ["The work is tiny and immediate", "Each step needs the previous result", "The job is CPU-heavy", "Async would only add complexity"],
};

export const MISSION_THEORY = {
  "one-lane": {
    heading: "First understand the normal flow",
    paragraphs: [
      "Regular Python code normally runs from top to bottom. If line 1 waits for two seconds, line 2 cannot start during those two seconds.",
      "This is called synchronous execution. It is easy to read and is often exactly what we want. It becomes inefficient only when independent work spends a lot of time waiting.",
    ],
    remember: "Synchronous means: finish this step, then start the next step.",
  },
  "coroutine-ticket": {
    heading: "An async function creates resumable work",
    paragraphs: [
      "A normal function runs when you call it. An async function behaves differently: calling it creates a coroutine object—a description of work that has not necessarily run yet.",
      "The coroutine must be awaited or scheduled by an event loop. This is why calling `deliver()` alone is different from writing `await deliver()`.",
    ],
    remember: "Calling a coroutine function creates the job; awaiting or scheduling it runs the job.",
  },
  "yield-point": {
    heading: "await is a polite handoff",
    paragraphs: [
      "`await` means: this task cannot continue until something is ready, so let another ready task use the event loop for now.",
      "The task remembers exactly where it paused. When the awaited operation finishes, execution resumes after that `await` expression.",
    ],
    remember: "await pauses one task, not necessarily the whole program.",
  },
  "gather-fleet": {
    heading: "Independent waits can overlap",
    paragraphs: [
      "If three API calls do not depend on one another, waiting for each call before starting the next wastes time. `asyncio.gather()` lets all three waits overlap.",
      "The program still waits for every result, but the total time is usually close to the slowest operation instead of the sum of all operations.",
    ],
    remember: "Use gather when the jobs are independent and you need every result.",
  },
  "task-launchpad": {
    heading: "A Task is scheduled work",
    paragraphs: [
      "`asyncio.create_task()` tells the event loop that a coroutine may start as soon as the current coroutine yields control.",
      "Keep the returned Task and await it later. That makes completion and errors visible instead of leaving background work unmanaged.",
    ],
    remember: "Create the task now, keep its reference, and await it before you leave.",
  },
  "blocking-trap": {
    heading: "Async code can still block",
    paragraphs: [
      "Writing `async def` around blocking code does not magically change the blocking operation. `time.sleep()` still freezes the event-loop thread.",
      "Use libraries that provide awaitable operations. For a simulated wait, use `await asyncio.sleep()`. Blocking legacy work may need `asyncio.to_thread()`.",
    ],
    remember: "Async works only when waiting operations cooperate and yield control.",
  },
  "failure-weather": {
    heading: "Concurrent work needs an error policy",
    paragraphs: [
      "When several tasks run together, one can fail while others are still running. Your program must decide whether related work should stop or whether successful results are still useful.",
      "`TaskGroup` is useful for related tasks that should share one lifetime. `gather(..., return_exceptions=True)` is useful only when you intentionally inspect every result and exception.",
    ],
    remember: "Never hide async failures—choose and document how they should propagate.",
  },
  "final-dispatch": {
    heading: "Async is a tool, not a default",
    paragraphs: [
      "Async is most valuable when many independent operations spend meaningful time waiting for network, database, or other I/O.",
      "Small calculations should usually remain normal functions. CPU-heavy calculations need a different strategy, such as processes, workers, or optimized native code.",
    ],
    remember: "Use async at waiting boundaries; keep simple computation simple.",
  },
};
