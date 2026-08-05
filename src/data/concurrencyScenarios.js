// Scenarios for the Concurrency & Race Condition Lab.
//
// A race is hard to teach because you can't observe it: the failing interleaving
// happens once in ten thousand runs, on someone else's machine, at 3am. So this
// lab makes the scheduler explicit. The learner picks which thread runs next,
// and can then ask the engine to enumerate EVERY interleaving and report exactly
// what fraction of them break the invariant.
//
// Step contract:
//   kind   — "read" | "write" | "compute" | "lock" | "unlock"
//   target — variable or lock name (used for the highlight + lock bookkeeping)
//   run(mem, local) -> { mem, local }   pure; never mutate the arguments
//
// Each scenario ships an `unsafe` variant and a `fixed` variant so the same
// invariant can be measured before and after the fix.

const lockStep = (name) => ({
  label: `lock(${name})`,
  code: `mutex_${name}.lock();`,
  kind: "lock",
  target: name,
  run: (mem, local) => ({ mem, local }),
});

const unlockStep = (name) => ({
  label: `unlock(${name})`,
  code: `mutex_${name}.unlock();`,
  kind: "unlock",
  target: name,
  run: (mem, local) => ({ mem, local }),
});

export const SCENARIOS = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    id: "lost-update",
    title: "The Lost Update",
    tagline: "counter++ is three operations, not one",
    concept: "Read-modify-write",
    difficulty: "Warm-up",
    brief:
      "Two threads each increment a shared counter once. `counter++` looks atomic in source, but it compiles to three separate steps: load, add, store. If both threads load before either stores, one increment vanishes.",
    invariantLabel: "counter == 2",
    fixLabel: "Wrap the read-modify-write in a mutex",
    fixNote:
      "The mutex makes load-add-store indivisible. No interleaving can place another thread's load between this thread's load and store, so every increment survives.",
    memory: { counter: 0 },
    check: (mem) => mem.counter === 2,
    variants: {
      unsafe: [
        {
          name: "Thread A",
          steps: [
            { label: "tmp ← counter", code: "int tmp = counter;", kind: "read", target: "counter",
              run: (mem, local) => ({ mem, local: { ...local, tmp: mem.counter } }) },
            { label: "tmp ← tmp + 1", code: "tmp = tmp + 1;", kind: "compute", target: null,
              run: (mem, local) => ({ mem, local: { ...local, tmp: (local.tmp ?? 0) + 1 } }) },
            { label: "counter ← tmp", code: "counter = tmp;", kind: "write", target: "counter",
              run: (mem, local) => ({ mem: { ...mem, counter: local.tmp ?? 0 }, local }) },
          ],
        },
        {
          name: "Thread B",
          steps: [
            { label: "tmp ← counter", code: "int tmp = counter;", kind: "read", target: "counter",
              run: (mem, local) => ({ mem, local: { ...local, tmp: mem.counter } }) },
            { label: "tmp ← tmp + 1", code: "tmp = tmp + 1;", kind: "compute", target: null,
              run: (mem, local) => ({ mem, local: { ...local, tmp: (local.tmp ?? 0) + 1 } }) },
            { label: "counter ← tmp", code: "counter = tmp;", kind: "write", target: "counter",
              run: (mem, local) => ({ mem: { ...mem, counter: local.tmp ?? 0 }, local }) },
          ],
        },
      ],
      fixed: [
        {
          name: "Thread A",
          steps: [
            lockStep("m"),
            { label: "tmp ← counter", code: "int tmp = counter;", kind: "read", target: "counter",
              run: (mem, local) => ({ mem, local: { ...local, tmp: mem.counter } }) },
            { label: "counter ← tmp + 1", code: "counter = tmp + 1;", kind: "write", target: "counter",
              run: (mem, local) => ({ mem: { ...mem, counter: (local.tmp ?? 0) + 1 }, local }) },
            unlockStep("m"),
          ],
        },
        {
          name: "Thread B",
          steps: [
            lockStep("m"),
            { label: "tmp ← counter", code: "int tmp = counter;", kind: "read", target: "counter",
              run: (mem, local) => ({ mem, local: { ...local, tmp: mem.counter } }) },
            { label: "counter ← tmp + 1", code: "counter = tmp + 1;", kind: "write", target: "counter",
              run: (mem, local) => ({ mem: { ...mem, counter: (local.tmp ?? 0) + 1 }, local }) },
            unlockStep("m"),
          ],
        },
      ],
    },
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    id: "check-then-act",
    title: "Check-Then-Act",
    tagline: "the balance was fine when you checked",
    concept: "TOCTOU",
    difficulty: "Core",
    brief:
      "An account holds ₹100. Two withdrawals of ₹100 each run concurrently. Both check `balance >= 100`, both see 100, and both proceed to debit. The check was true when it happened — it just stopped being true before the act.",
    invariantLabel: "balance >= 0",
    fixLabel: "Hold the lock across BOTH the check and the act",
    fixNote:
      "Locking only the debit isn't enough — the gap between check and act is the bug. The critical section has to span the decision as well as the mutation.",
    memory: { balance: 100, approved: 0 },
    check: (mem) => mem.balance >= 0,
    variants: {
      unsafe: [
        {
          name: "Withdraw A",
          steps: [
            { label: "ok ← balance >= 100", code: "bool ok = balance >= 100;", kind: "read", target: "balance",
              run: (mem, local) => ({ mem, local: { ...local, ok: mem.balance >= 100 } }) },
            { label: "if (ok) balance -= 100", code: "if (ok) balance -= 100;", kind: "write", target: "balance",
              run: (mem, local) => local.ok
                ? ({ mem: { ...mem, balance: mem.balance - 100, approved: mem.approved + 1 }, local })
                : ({ mem, local }) },
          ],
        },
        {
          name: "Withdraw B",
          steps: [
            { label: "ok ← balance >= 100", code: "bool ok = balance >= 100;", kind: "read", target: "balance",
              run: (mem, local) => ({ mem, local: { ...local, ok: mem.balance >= 100 } }) },
            { label: "if (ok) balance -= 100", code: "if (ok) balance -= 100;", kind: "write", target: "balance",
              run: (mem, local) => local.ok
                ? ({ mem: { ...mem, balance: mem.balance - 100, approved: mem.approved + 1 }, local })
                : ({ mem, local }) },
          ],
        },
      ],
      fixed: [
        {
          name: "Withdraw A",
          steps: [
            lockStep("acct"),
            { label: "ok ← balance >= 100", code: "bool ok = balance >= 100;", kind: "read", target: "balance",
              run: (mem, local) => ({ mem, local: { ...local, ok: mem.balance >= 100 } }) },
            { label: "if (ok) balance -= 100", code: "if (ok) balance -= 100;", kind: "write", target: "balance",
              run: (mem, local) => local.ok
                ? ({ mem: { ...mem, balance: mem.balance - 100, approved: mem.approved + 1 }, local })
                : ({ mem, local }) },
            unlockStep("acct"),
          ],
        },
        {
          name: "Withdraw B",
          steps: [
            lockStep("acct"),
            { label: "ok ← balance >= 100", code: "bool ok = balance >= 100;", kind: "read", target: "balance",
              run: (mem, local) => ({ mem, local: { ...local, ok: mem.balance >= 100 } }) },
            { label: "if (ok) balance -= 100", code: "if (ok) balance -= 100;", kind: "write", target: "balance",
              run: (mem, local) => local.ok
                ? ({ mem: { ...mem, balance: mem.balance - 100, approved: mem.approved + 1 }, local })
                : ({ mem, local }) },
            unlockStep("acct"),
          ],
        },
      ],
    },
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    id: "deadlock",
    title: "Lock Ordering Deadlock",
    tagline: "both polite, both stuck forever",
    concept: "Deadlock",
    difficulty: "Core",
    brief:
      "Transfer money between two accounts. Thread A locks account 1 then account 2; thread B locks account 2 then account 1. Each grabs its first lock, then waits forever for the other's. Nothing is corrupted — nothing happens at all.",
    invariantLabel: "no deadlock, total == 300",
    fixLabel: "Always acquire locks in a global order",
    fixNote:
      "Both threads now take lock 1 before lock 2, regardless of transfer direction. A cycle in the wait-for graph becomes impossible, so deadlock cannot occur.",
    memory: { acct1: 200, acct2: 100 },
    check: (mem) => mem.acct1 + mem.acct2 === 300,
    variants: {
      unsafe: [
        {
          name: "Transfer 1→2",
          steps: [
            lockStep("a1"),
            lockStep("a2"),
            { label: "acct1 -= 50", code: "acct1 -= 50;", kind: "write", target: "acct1",
              run: (mem, local) => ({ mem: { ...mem, acct1: mem.acct1 - 50 }, local }) },
            { label: "acct2 += 50", code: "acct2 += 50;", kind: "write", target: "acct2",
              run: (mem, local) => ({ mem: { ...mem, acct2: mem.acct2 + 50 }, local }) },
            unlockStep("a2"),
            unlockStep("a1"),
          ],
        },
        {
          name: "Transfer 2→1",
          steps: [
            lockStep("a2"),
            lockStep("a1"),
            { label: "acct2 -= 30", code: "acct2 -= 30;", kind: "write", target: "acct2",
              run: (mem, local) => ({ mem: { ...mem, acct2: mem.acct2 - 30 }, local }) },
            { label: "acct1 += 30", code: "acct1 += 30;", kind: "write", target: "acct1",
              run: (mem, local) => ({ mem: { ...mem, acct1: mem.acct1 + 30 }, local }) },
            unlockStep("a1"),
            unlockStep("a2"),
          ],
        },
      ],
      fixed: [
        {
          name: "Transfer 1→2",
          steps: [
            lockStep("a1"),
            lockStep("a2"),
            { label: "acct1 -= 50", code: "acct1 -= 50;", kind: "write", target: "acct1",
              run: (mem, local) => ({ mem: { ...mem, acct1: mem.acct1 - 50 }, local }) },
            { label: "acct2 += 50", code: "acct2 += 50;", kind: "write", target: "acct2",
              run: (mem, local) => ({ mem: { ...mem, acct2: mem.acct2 + 50 }, local }) },
            unlockStep("a2"),
            unlockStep("a1"),
          ],
        },
        {
          name: "Transfer 2→1",
          steps: [
            lockStep("a1"),
            lockStep("a2"),
            { label: "acct2 -= 30", code: "acct2 -= 30;", kind: "write", target: "acct2",
              run: (mem, local) => ({ mem: { ...mem, acct2: mem.acct2 - 30 }, local }) },
            { label: "acct1 += 30", code: "acct1 += 30;", kind: "write", target: "acct1",
              run: (mem, local) => ({ mem: { ...mem, acct1: mem.acct1 + 30 }, local }) },
            unlockStep("a2"),
            unlockStep("a1"),
          ],
        },
      ],
    },
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    id: "publish",
    title: "Publishing a Half-Built Object",
    tagline: "the flag said ready. it wasn't.",
    concept: "Visibility & ordering",
    difficulty: "Sharp",
    brief:
      "A producer fills a buffer then sets `ready = true`. A consumer spins until `ready`, then reads the buffer. If the producer's two writes land in the wrong order — or the consumer observes them out of order — the consumer reads an empty buffer while being told it's ready.",
    invariantLabel: "consumer never reads an unfilled buffer",
    fixLabel: "Set the flag last, under the same lock the reader uses",
    fixNote:
      "The lock creates a happens-before edge: everything the producer wrote before releasing is visible to whoever acquires next. Ordering stops being a coincidence.",
    memory: { data: 0, ready: 0, seen: -1 },
    check: (mem) => mem.seen === -1 || mem.seen === 42,
    variants: {
      unsafe: [
        {
          name: "Producer",
          steps: [
            { label: "ready ← 1", code: "ready = true;   // reordered!", kind: "write", target: "ready",
              run: (mem, local) => ({ mem: { ...mem, ready: 1 }, local }) },
            { label: "data ← 42", code: "data = 42;", kind: "write", target: "data",
              run: (mem, local) => ({ mem: { ...mem, data: 42 }, local }) },
          ],
        },
        {
          name: "Consumer",
          steps: [
            { label: "if (ready) seen ← data", code: "if (ready) seen = data;", kind: "read", target: "ready",
              run: (mem, local) => (mem.ready ? ({ mem: { ...mem, seen: mem.data }, local }) : ({ mem, local })) },
          ],
        },
      ],
      fixed: [
        {
          name: "Producer",
          steps: [
            lockStep("pub"),
            { label: "data ← 42", code: "data = 42;", kind: "write", target: "data",
              run: (mem, local) => ({ mem: { ...mem, data: 42 }, local }) },
            { label: "ready ← 1", code: "ready = true;", kind: "write", target: "ready",
              run: (mem, local) => ({ mem: { ...mem, ready: 1 }, local }) },
            unlockStep("pub"),
          ],
        },
        {
          name: "Consumer",
          steps: [
            lockStep("pub"),
            { label: "if (ready) seen ← data", code: "if (ready) seen = data;", kind: "read", target: "ready",
              run: (mem, local) => (mem.ready ? ({ mem: { ...mem, seen: mem.data }, local }) : ({ mem, local })) },
            unlockStep("pub"),
          ],
        },
      ],
    },
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    id: "three-way",
    title: "Three Threads, One Total",
    tagline: "more threads, exponentially more ways to fail",
    concept: "Interleaving explosion",
    difficulty: "Sharp",
    brief:
      "Three threads each add their own amount to a shared total. Two threads over three steps gives 20 interleavings; three threads gives 1,680. The bug rate barely changes — but your odds of hitting it in testing collapse. This is why races survive code review.",
    invariantLabel: "total == 60",
    fixLabel: "One mutex around every read-modify-write",
    fixNote:
      "Serialising the critical section collapses 1,680 interleavings into a handful of equivalent orderings, all of which produce 60.",
    memory: { total: 0 },
    check: (mem) => mem.total === 60,
    variants: {
      unsafe: [10, 20, 30].map((amount, i) => ({
        name: `Worker ${i + 1} (+${amount})`,
        steps: [
          { label: "t ← total", code: "int t = total;", kind: "read", target: "total",
            run: (mem, local) => ({ mem, local: { ...local, t: mem.total } }) },
          { label: `total ← t + ${amount}`, code: `total = t + ${amount};`, kind: "write", target: "total",
            run: (mem, local) => ({ mem: { ...mem, total: (local.t ?? 0) + amount }, local }) },
        ],
      })),
      fixed: [10, 20, 30].map((amount, i) => ({
        name: `Worker ${i + 1} (+${amount})`,
        steps: [
          lockStep("m"),
          { label: "t ← total", code: "int t = total;", kind: "read", target: "total",
            run: (mem, local) => ({ mem, local: { ...local, t: mem.total } }) },
          { label: `total ← t + ${amount}`, code: `total = t + ${amount};`, kind: "write", target: "total",
            run: (mem, local) => ({ mem: { ...mem, total: (local.t ?? 0) + amount }, local }) },
          unlockStep("m"),
        ],
      })),
    },
  },
];
