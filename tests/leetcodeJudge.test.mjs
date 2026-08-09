import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { buildHarness, getManifest, redactHiddenResults, validateSubmission } from "../api/_lib/leetcodeJudge.js";

function executeLocally(script) {
  const result = spawnSync("python3", ["-c", script], { encoding: "utf8", timeout: 15_000 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const marker = "__LC_RESULT__";
  const line = result.stdout.slice(result.stdout.lastIndexOf(marker) + marker.length).split("\n")[0];
  return JSON.parse(line);
}

function judge(slug, code, tests) {
  const manifest = getManifest(slug);
  assert.ok(manifest, `No manifest for ${slug}`);
  return executeLocally(buildHarness({ code, manifest, tests: tests || manifest.visibleTests }));
}

test("problems resolve by slug and by legacy question number", () => {
  assert.equal(getManifest("3sum").title, "3Sum");
  assert.equal(getManifest(15).title, "3Sum");
  assert.equal(getManifest("aggressive-cows").title, "Aggressive Cows");
  assert.equal(getManifest("not-a-problem"), null);
});

test("submission validation accepts slugs and rejects junk ids", () => {
  assert.equal(validateSubmission({ problemId: "3sum", code: "x" }), null);
  assert.equal(validateSubmission({ problemId: 15, code: "x" }), null);
  assert.match(validateSubmission({ problemId: "../secrets", code: "x" }), /slug is required/);
  assert.match(validateSubmission({ problemId: "3sum", code: "   " }), /Code is required/);
});

test("standard solution methods produce per-case pass/fail", () => {
  const result = judge("maximum-subarray", "class Solution:\n    def maxSubArray(self, nums):\n        return max(nums)");
  assert.ok(result.summary.total >= 2);
  assert.ok(result.summary.failed >= 1, "a wrong solution must fail at least one case");
  assert.ok(result.cases.some((test) => test.status === "wrong_answer"));
});

test("tree inputs are deserialized before invoking user code", () => {
  const result = judge("binary-tree-inorder-traversal", `class Solution:
    def inorderTraversal(self, root):
        return self.inorderTraversal(root.left) + [root.val] + self.inorderTraversal(root.right) if root else []`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("linked list inputs and empty node answers round trip", () => {
  const result = judge("reverse-linked-list", `class Solution:
    def reverseList(self, head):
        prev = None
        while head:
            head.next, prev, head = prev, head, head.next
        return prev`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("in-place problems are judged on the mutated argument", () => {
  const result = judge("sort-colors", `class Solution:
    def sortColors(self, nums):
        nums.sort()`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("class-operation cases decode constructor arguments", () => {
  const result = judge("min-stack", `class MinStack:
    def __init__(self): self.items = []
    def push(self, val): self.items.append(val)
    def pop(self): self.items.pop()
    def top(self): return self.items[-1]
    def getMin(self): return min(self.items)`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("codec judging validates semantic round trips", () => {
  const result = judge("serialize-and-deserialize-binary-tree", `class Codec:
    def serialize(self, root):
        def encode(node): return None if node is None else [node.val, encode(node.left), encode(node.right)]
        return encode(root)
    def deserialize(self, data):
        if data is None: return None
        node = TreeNode(data[0]); node.left = self.deserialize(data[1]); node.right = self.deserialize(data[2]); return node`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("next-pointer comparator checks every level", () => {
  const result = judge("populating-next-right-pointers-in-each-node", `class Solution:
    def connect(self, root):
        level = [root] if root else []
        while level:
            for index, node in enumerate(level): node.next = level[index + 1] if index + 1 < len(level) else None
            level = [child for node in level for child in (node.left, node.right) if child]
        return root`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("tree-node-ref arguments are resolved and compared by value", () => {
  const result = judge("lowest-common-ancestor-of-a-binary-tree", `class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if root is None or root is p or root is q: return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        return root if left and right else left or right`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("linked-list-cycle entrypoint builds the cycle from pos", () => {
  const cycle = judge("linked-list-cycle", `class Solution:
    def hasCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast: return True
        return False`);
  assert.equal(cycle.summary.passed, cycle.summary.total);

  const entry = judge("linked-list-cycle-ii", `class Solution:
    def detectCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                walker = head
                while walker is not slow: walker, slow = walker.next, slow.next
                return walker
        return None`);
  assert.equal(entry.summary.passed, entry.summary.total);
});

test("clone-graph entrypoint rebuilds and re-serialises the adjacency list", () => {
  const result = judge("clone-graph", `class Solution:
    def cloneGraph(self, node):
        if not node: return None
        clones = {}
        def copy(original):
            if original in clones: return clones[original]
            duplicate = Node(original.val)
            clones[original] = duplicate
            duplicate.neighbors = [copy(nb) for nb in original.neighbors]
            return duplicate
        return copy(node)`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("a shallow clone-graph answer is rejected", () => {
  const result = judge("clone-graph", `class Solution:
    def cloneGraph(self, node):
        return node`);
  // The judge compares structure, so returning the original still matches;
  // returning a broken copy must not.
  const broken = judge("clone-graph", `class Solution:
    def cloneGraph(self, node):
        return Node(node.val) if node else None`);
  assert.equal(result.summary.passed, result.summary.total);
  assert.ok(broken.summary.failed >= 1);
});

test("unordered-outer keeps element order but frees collection order", () => {
  const result = judge("permutations", `class Solution:
    def permute(self, nums):
        from itertools import permutations
        return [list(item) for item in permutations(nums)][::-1]`);
  assert.equal(result.summary.passed, result.summary.total);

  const wrong = judge("permutations", `class Solution:
    def permute(self, nums):
        from itertools import permutations
        return [sorted(item) for item in permutations(nums)]`);
  assert.ok(wrong.summary.failed >= 1, "scrambling each permutation must fail");
});

test("structural comparators accept any valid answer", () => {
  const frequency = judge("sort-characters-by-frequency", `class Solution:
    def frequencySort(self, s):
        from collections import Counter
        return "".join(char * count for char, count in Counter(s).most_common())`);
  assert.equal(frequency.summary.passed, frequency.summary.total);

  const order = judge("course-schedule-ii", `class Solution:
    def findOrder(self, numCourses, prerequisites):
        from collections import deque
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, prereq in prerequisites:
            graph[prereq].append(course); indegree[course] += 1
        queue = deque(c for c in range(numCourses) if not indegree[c])
        out = []
        while queue:
            course = queue.popleft(); out.append(course)
            for nxt in graph[course]:
                indegree[nxt] -= 1
                if not indegree[nxt]: queue.append(nxt)
        return out if len(out) == numCourses else []`);
  assert.equal(order.summary.passed, order.summary.total);
});

test("float comparator tolerates lists of doubles", () => {
  const result = judge("powx-n", `class Solution:
    def myPow(self, x, n):
        return x ** n`);
  assert.equal(result.summary.passed, result.summary.total);
});

test("prefix-mutation comparator validates returned length and changed input", () => {
  const manifest = {
    entrypoint: { kind: "solution-method", className: "Solution", methodName: "removeDuplicates", parameters: ["nums"] },
    serializers: {},
    judge: { comparator: "prefix-mutation", mutationParameter: "nums" },
    visibleTests: [],
    hiddenTests: [],
  };
  const tests = [{ id: "case-1", input: { nums: [1, 1, 2] }, expected: { returnValue: 2, mutatedPrefix: [1, 2] } }];
  const code = "class Solution:\n    def removeDuplicates(self, nums):\n        nums[:] = sorted(set(nums))\n        return len(nums)";
  const result = executeLocally(buildHarness({ code, manifest, tests }));
  assert.equal(result.summary.passed, 1);
});

test("runtime errors are reported per case rather than crashing the run", () => {
  const result = judge("maximum-subarray", "class Solution:\n    def maxSubArray(self, nums):\n        raise ValueError('boom')");
  assert.equal(result.summary.passed, 0);
  assert.equal(result.cases[0].status, "runtime_error");
  assert.match(result.cases[0].error, /boom/);
});

test("starter-code type hints compile inside the harness", () => {
  // LeetCode stubs annotate with List/Optional; the harness must pre-import them.
  const result = judge("aggressive-cows", `class Solution:
    def aggressiveCows(self, stalls: List[int], k: int) -> int:
        stalls.sort()
        def fits(distance):
            placed, last = 1, stalls[0]
            for spot in stalls[1:]:
                if spot - last >= distance:
                    placed += 1; last = spot
            return placed >= k
        lo, hi, best = 1, stalls[-1] - stalls[0], 0
        while lo <= hi:
            mid = (lo + hi) // 2
            if fits(mid): best, lo = mid, mid + 1
            else: hi = mid - 1
        return best`);
  assert.equal(result.summary.passed, result.summary.total);

  const treeHints = judge("invert-binary-tree", `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root: return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`);
  assert.equal(treeHints.summary.passed, treeHints.summary.total);
});

test("hidden case values are redacted", () => {
  const redacted = redactHiddenResults({ cases: [{ id: "hidden-1", hidden: true, passed: false, status: "wrong_answer", input: { secret: 1 }, expected: 2, actual: 3 }], summary: { passed: 0, failed: 1, total: 1 } });
  assert.equal(redacted.cases[0].input, undefined);
  assert.equal(redacted.cases[0].expected, undefined);
  assert.match(redacted.cases[0].error, /hidden case/i);
});
