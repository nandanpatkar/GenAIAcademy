export const EDGE_CASE_SECTIONS = [
  {
    id:"overflow", label:"Overflow", emoji:"💥",
    title:"Integer Overflow", subtitle:"Python has arbitrary-precision integers — no silent overflow!",
    cards:[
      { icon:"✅", title:"Python: no integer overflow", tag:"Python Advantage",
        bug:"Python integers are arbitrary precision — unlike Java/C++, they never silently wrap. But float arithmetic and int sentinels can still cause subtle issues.",
        fix:"Use float('inf') for DP/graph sentinels. Only guard when mixing int sentinels with large additions.",
        code:`# Python int — no overflow ever!
a = 10**100              # works fine
a + b                    # no wrapping

# Float infinity
INF = float('inf')
INF > 10**18             # True

# Safe sentinel for DP/graph:
INF = 10**9              # safe for addition
INF = 10**18             # for large problems

# Binary search midpoint — safe in Python:
mid = (lo + hi) // 2    # ✅ no overflow

# Modular multiply — needed for mod problems:
r = (a * b) % MOD       # ✅ Python handles big int` },
      { icon:"⚠️", title:"INF + cost in Dijkstra/DP", tag:"Subtle",
        bug:"If using int INF = 10**9, then INF + large_w can exceed your sentinel and break comparisons.",
        fix:"Use float('inf') which handles addition correctly, or guard before adding.",
        code:`# ✅ float('inf') handles addition gracefully
dist = [float('inf')] * n
if dist[u] + w < dist[v]:   # inf + w = inf → correct

# ❌ If using int sentinel, guard before adding
INF = 10**9
if dist[u] != INF and dist[u] + w < dist[v]:
    dist[v] = dist[u] + w

# ✅ math.inf is same as float('inf')
import math
dist = [math.inf] * n; dist[src] = 0` },
    ],
  },
  {
    id:"empty-null", label:"Empty/None", emoji:"📭",
    title:"Empty / None Input", subtitle:"Always handle before index access or loop",
    cards:[
      { icon:"📭", title:"Empty / None list", tag:"IndexError",
        bug:"nums[0] or nums[-1] on empty list throws IndexError. Most algorithms assume at least one element.",
        fix:"Guard at the very top of your function with 'if not nums'.",
        code:`if not nums:             # covers None and []
    return 0

if len(nums) < 2:
    return nums[0] if nums else 0

# Kadane's: init from nums[0], loop from i=1 → needs guard
# Two pointers: right = len-1 → -1 if empty → crash
# Fixed window: k > n → IndexError building first window` },
      { icon:"🔤", title:"Empty / None string", tag:"IndexError",
        bug:"s[0] on empty string throws IndexError. s[1:] returns '' silently. Logic may be wrong.",
        fix:"Check 'if not s' before any algorithmic logic.",
        code:`if not s:               # covers None and ""
    return ""

# Python quirk: no exception on empty slices
""[1:]         # "" — no error (silently empty)
""[::-1]       # "" — palindrome check may incorrectly pass!

# "".split(",") returns [''] — length 1, NOT 0!
len("".split(","))     # 1 ← gotcha!

# ✅ Guard before split
if not s: return []
parts = s.split(",")` },
      { icon:"🔗", title:"None head (Linked List)", tag:"AttributeError",
        bug:"Accessing head.val or head.next when head is None raises AttributeError.",
        fix:"Guard immediately. Fast pointer's fast.next.next needs fast.next checked first.",
        code:`if not head: return None
if not head.next: return head    # single node

# Fast/slow: Python short-circuits 'and'
while fast and fast.next:        # fast before fast.next!
    slow = slow.next
    fast = fast.next.next

# Dummy head eliminates head deletion special cases
dummy = ListNode(0)
dummy.next = head` },
      { icon:"🌳", title:"None root (Tree)", tag:"AttributeError",
        bug:"Every recursive tree function must handle None as base case.",
        fix:"First line of every tree recursive function: if not node: return ...",
        code:`def helper(node):
    if not node: return 0  # ALWAYS first line

# BFS
if not root: return []

# Don't offer None children to queue
if node.left:  q.append(node.left)
if node.right: q.append(node.right)` },
    ],
  },
  {
    id:"single-two-elem", label:"Single/Two Elem", emoji:"1️⃣",
    title:"Single / Two Elements", subtitle:"Most algorithms silently fail for n=1 or n=2",
    cards:[
      { icon:"1️⃣", title:"Single-element list", tag:"Off-by-one",
        bug:"Two pointers converge immediately. Kadane's loop never runs. House Robber II with 1 element breaks circular logic.",
        fix:"Verify return value for n=1. Add explicit guard when needed.",
        code:`# House Robber II: MUST guard
if len(nums) == 1: return nums[0]

# Kadane: max subarray of [-5] = -5 ✓ (init from nums[0])
# Max Product of [-5] = -5 ✓ (init from nums[0])
# Binary Search [5]: lo=hi=0 → found ✓
# Two pointers: l=r=0, while l<r never runs → OK` },
      { icon:"2️⃣", title:"Two-element cases", tag:"Head removal",
        bug:"Remove Nth from end of 2-node list can remove head. House Robber II with 2 elements.",
        fix:"Dummy node handles head removal. Explicit guard for House Robber II.",
        code:`if len(nums) == 2:
    return max(nums[0], nums[1])

# Remove Nth from end [1,2], n=2: removes head
# → dummy node handles correctly
dummy = ListNode(0); dummy.next = head

# Palindrome LL [1→2]: not palindrome ✓
# [1→1]: palindrome ✓` },
      { icon:"🌳", title:"Single-node tree", tag:"Edge Case",
        bug:"Root with no children. BST validate with int extremes can fail — use float bounds in Python.",
        fix:"Use float('-inf') and float('inf') as BST validation bounds.",
        code:`# Diameter [1]: ans = 0 ✓
# Max Depth [1]: 1 ✓
# Path Sum [5] target=5: leaf check passes ✓

# BST validate — use float bounds
def validate(node, lo=float('-inf'), hi=float('inf')):
    if not node: return True
    if not (lo < node.val < hi): return False
    return (validate(node.left, lo, node.val) and
            validate(node.right, node.val, hi))

# LCA: if root == p or root == q, return root immediately` },
    ],
  },
  {
    id:"arrays-ec", label:"Arrays", emoji:"📦",
    title:"Array-Specific Edge Cases", subtitle:"All-same, all-negative, zeros, sorted, duplicates",
    cards:[
      { icon:"🔢", title:"All elements same", tag:"Duplicate handling",
        bug:"3Sum dedup, rotated array search with all-same — all need explicit duplicate handling.",
        fix:"Skip duplicates at same recursion level; add early-exit conditions.",
        code:`# 3Sum all zeros [0,0,0] → [[0,0,0]], not multiple copies
nums.sort()
for i, n in enumerate(nums):
    if i > 0 and nums[i] == nums[i-1]: continue
    # inner two-pointer also skip dups

# Rotated Sorted Array II all same [1,1,1,1]:
if nums[lo] == nums[mid] == nums[hi]:
    lo += 1; hi -= 1; continue

# Longest Consecutive [1,1,1] → 1
# set() deduplicates; count only from sequence start` },
      { icon:"➖", title:"All negative numbers", tag:"Wrong init",
        bug:"Initializing answer to 0 when all elements are negative — valid answer is negative but 0 is returned.",
        fix:"Init from nums[0] or float('-inf'), not 0.",
        code:`# ❌ Kadane's with ans=0
# Input [-3,-1,-2] → wrongly returns 0

# ✅ Init from first element
max_so_far = nums[0]; curr = nums[0]
for n in nums[1:]:
    curr = max(n, curr + n)
    max_so_far = max(max_so_far, curr)

# Max Product Subarray [-2] → -2, not 0
# Init max_p = min_p = ans = nums[0]` },
      { icon:"0️⃣", title:"Zeros in array", tag:"Product / Reset",
        bug:"Zeros reset product subarrays. Prefix product logic handles multi-zero correctly.",
        fix:"Handle zero as a subarray boundary.",
        code:`# Max Product Subarray [2,3,0,4]:
max_p = min_p = ans = nums[0]
for n in nums[1:]:
    max_p, min_p = (max(n, max_p*n, min_p*n),
                    min(n, max_p*n, min_p*n))
    ans = max(ans, max_p)

# Subarray Sum = 0:
prefix_count = {0: 1}
# handles sums that equal target exactly` },
      { icon:"🔃", title:"Already sorted / not rotated", tag:"Rotation=0",
        bug:"Rotated sorted array that isn't rotated — pivot = 0. Must still work.",
        fix:"Standard binary search branches handle pivot=0 correctly.",
        code:`# [1,2,3,4,5] — "rotated" by 0 positions
# Binary search still works correctly ✓

# 3Sum on sorted: add early exit:
for i, n in enumerate(nums):
    if n > 0: break  # no three positives sum to 0

# Dutch National Flag [0,0,0,0]: all go left ✓` },
    ],
  },
  {
    id:"sliding-window-ec", label:"Sliding Window", emoji:"🪟",
    title:"Sliding Window Edge Cases", subtitle:"k > n, all match, no match, counter boundary",
    cards:[
      { icon:"📏", title:"Window size k > n", tag:"IndexError",
        bug:"Building first window of size k when k > n causes IndexError.",
        fix:"Guard k > len(nums) at the top.",
        code:`if k > len(nums): return 0

# k == n: sliding loop range(k, n) is empty → returns first window ✓
# k == 1: single element window → trivial ✓

# Permutation In String:
if len(p) > len(s): return False

# Max Consecutive Ones III (k=0, all zeros):
# Window never expands → answer = 0 ✓` },
      { icon:"✅", title:"All / no chars satisfy condition", tag:"Result init",
        bug:"Min Window — no valid window should return '', not None. Max window — entire string may be valid.",
        fix:"Initialize result tracking to detect 'no valid window'.",
        code:`# Min Window Substring: no valid window
min_len = float('inf'); start = 0
# ... logic ...
return ("" if min_len == float('inf')
        else s[start:start+min_len])

# Longest Substring No Repeat all same "aaaa":
# Window shrinks to 1 → answer = 1 ✓

# Max Consecutive Ones III all ones: answer = n ✓` },
      { icon:"🗂", title:"Matches counter — boundary cross", tag:"Subtle",
        bug:"Increment/decrement matches only when a character transitions across the zero boundary.",
        fix:"Check equality to 0 / 1 on the transition, not every increment.",
        code:`from collections import Counter

need = Counter(pattern)
matches = 0
for c in s:
    need[c] -= 1
    if need[c] == 0:      # just became satisfied
        matches += 1

# Remove left char:
if need[left_c] == 0:     # was satisfied, now losing
    matches -= 1
need[left_c] += 1

# Valid when: matches == len(Counter(pattern))` },
    ],
  },
  {
    id:"binary-search-ec", label:"Binary Search", emoji:"🔍",
    title:"Binary Search Edge Cases", subtitle:"Infinite loop, off-by-one, wrong boundary",
    cards:[
      { icon:"🔁", title:"Infinite loop: lo = mid", tag:"Hangs forever",
        bug:"When lo + 1 == hi, mid = lo. If you set lo = mid, no progress — infinite loop.",
        fix:"Always advance: lo = mid + 1.",
        code:`# ❌ Infinite loop when lo=0, hi=1: mid=0, lo stays 0
while lo < hi:
    mid = (lo + hi) // 2
    if valid(mid): hi = mid
    else: lo = mid          # ← HANGS!

# ✅ Always advance
while lo < hi:
    mid = (lo + hi) // 2
    if valid(mid): hi = mid
    else: lo = mid + 1      # ✅` },
      { icon:"🔢", title:"First / last occurrence of duplicate", tag:"Don't return early",
        bug:"For first/last occurrence, don't return when found — keep narrowing.",
        fix:"Set hi = mid (first) or lo = mid+1 (last) when target is found.",
        code:`# First occurrence (leftmost):
lo, hi = 0, len(nums) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if nums[mid] < target: lo = mid + 1
    else: hi = mid           # don't return, narrow left

# Last occurrence (rightmost):
while lo < hi:
    mid = (lo + hi + 1) // 2  # bias right!
    if nums[mid] > target: hi = mid - 1
    else: lo = mid` },
      { icon:"🎯", title:"Search-on-Answer wrong boundaries", tag:"Wrong Answer",
        bug:"lo/hi must cover the complete valid range.",
        fix:"lo = minimum possible answer; hi = maximum possible answer.",
        code:`# Koko Eating Bananas:
lo, hi = 1, max(piles)     # lo=1 min, hi=max worst case

# Capacity to Ship:
lo = max(weights)           # must fit heaviest
hi = sum(weights)           # ship all in one day

# Template:
lo, hi = min_possible, max_possible
while lo < hi:
    mid = (lo + hi) // 2
    if feasible(mid): hi = mid
    else: lo = mid + 1
return lo` },
    ],
  },
  {
    id:"linkedlist-ec", label:"Linked List", emoji:"🔗",
    title:"Linked List Edge Cases", subtitle:"None order, lost pointer, even/odd length, head removal",
    cards:[
      { icon:"🐢", title:"Fast/slow None check order", tag:"AttributeError",
        bug:"Checking fast.next.next before fast.next is not None raises AttributeError for even-length lists.",
        fix:"Check fast before fast.next — Python short-circuits 'and'.",
        code:`# ❌ AttributeError when list has even length
while fast.next.next:
    ...

# ✅ Short-circuit evaluation
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

# Odd  [1,2,3]: fast=3, slow=2 (middle) ✓
# Even [1,2,3,4]: fast=None, slow=2 (first middle) ✓` },
      { icon:"🔄", title:"Reverse: save next before overwriting", tag:"Lost Pointer",
        bug:"Writing curr.next = prev before saving curr.next permanently drops the rest of the list.",
        fix:"Save nxt = curr.next FIRST, then reverse, then advance.",
        code:`# ❌ curr.next overwritten, rest of list lost
curr.next = prev
prev = curr
curr = curr.next    # ← points to prev, list dropped!

# ✅ Save first
while curr:
    nxt = curr.next      # 1. save
    curr.next = prev     # 2. reverse
    prev = curr          # 3. advance prev
    curr = nxt           # 4. advance curr
return prev              # new head` },
      { icon:"📏", title:"Remove Nth: n equals list length", tag:"Head deletion",
        bug:"n = list length means remove the head. Without dummy node this needs a special case.",
        fix:"Dummy node avoids all head-removal special cases.",
        code:`dummy = ListNode(0); dummy.next = head
fast = slow = dummy
for _ in range(n + 1):    # n+1 steps
    fast = fast.next
while fast:
    fast = fast.next
    slow = slow.next
slow.next = slow.next.next
return dummy.next
# [1,2], n=2: removes head → dummy.next=node2 ✓` },
      { icon:"🔁", title:"Cycle: Floyd's two phases", tag:"Two Phases",
        bug:"Phase 1 detects cycle. Phase 2 finds entry — reset one pointer to head.",
        fix:"After meeting, reset one pointer to head, advance both one step at a time.",
        code:`# Phase 1: detect
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: break
else:
    return None  # no cycle

# Phase 2: find entry
ptr = head
while ptr != slow:
    ptr = ptr.next; slow = slow.next
return ptr  # cycle start` },
    ],
  },
  {
    id:"tree-ec", label:"Tree", emoji:"🌳",
    title:"Tree Edge Cases", subtitle:"Skewed, negative values, LCA ancestor case",
    cards:[
      { icon:"📐", title:"Skewed tree → recursion limit", tag:"n=10⁵ depth",
        bug:"Fully skewed tree has depth = n. Python's default recursion limit is ~1000.",
        fix:"Use iterative solution for large inputs, or increase recursion limit carefully.",
        code:`import sys
sys.setrecursionlimit(10**5)  # increase (risky)

# Better: iterative inorder (safe for skewed)
def inorder_iter(root):
    stack, cur, result = [], root, []
    while cur or stack:
        while cur:
            stack.append(cur); cur = cur.left
        cur = stack.pop()
        result.append(cur.val)
        cur = cur.right
    return result` },
      { icon:"🔢", title:"BST float bounds vs int bounds", tag:"Wrong validation",
        bug:"Using int bounds fails for node.val at extremes. Python avoids this with float('inf').",
        fix:"Always use float('-inf') and float('inf') as BST validation bounds.",
        code:`# ✅ float bounds — no integer limit issue
def validate(node, lo=float('-inf'), hi=float('inf')):
    if not node: return True
    if not (lo < node.val < hi): return False
    return (validate(node.left, lo, node.val) and
            validate(node.right, node.val, hi))

validate(root)  # call with float bounds` },
      { icon:"➖", title:"Negative node values in path/sum", tag:"Wrong init",
        bug:"Max Path Sum initialized to 0 gives wrong answer when all nodes are negative.",
        fix:"Init ans to float('-inf').",
        code:`ans = [float('-inf')]

def max_gain(node):
    if not node: return 0
    L = max(0, max_gain(node.left))
    R = max(0, max_gain(node.right))
    ans[0] = max(ans[0], node.val + L + R)
    return node.val + max(L, R)

max_gain(root)
return ans[0]` },
      { icon:"🌿", title:"LCA — p is ancestor of q", tag:"Early return",
        bug:"Standard algorithm handles ancestor case correctly via early return.",
        fix:"If root == p or root == q, return root immediately.",
        code:`def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    L = lca(root.left, p, q)
    R = lca(root.right, p, q)
    if L and R: return root   # both sides found
    return L or R

# BST LCA: use value comparisons
def lca_bst(root, p, q):
    if p.val < root.val > q.val:
        return lca_bst(root.left, p, q)
    if p.val > root.val < q.val:
        return lca_bst(root.right, p, q)
    return root` },
    ],
  },
  {
    id:"graph-ec", label:"Graph", emoji:"🕸",
    title:"Graph Edge Cases", subtitle:"Disconnected, stale entries, negative weights",
    cards:[
      { icon:"🔌", title:"Disconnected graph — incomplete BFS", tag:"Missed nodes",
        bug:"Starting BFS/DFS from a single source won't visit other connected components.",
        fix:"Start from every unvisited node.",
        code:`# ❌ Only visits component of node 0
dfs(graph, 0, visited)

# ✅ Cover all components
components = 0
for i in range(n):
    if i not in visited:
        dfs(graph, i, visited)
        components += 1

# Kahn's topo sort: if len(result) < n → cycle exists
# Works even with disconnected components` },
      { icon:"🗺", title:"Dijkstra: stale entries + negative weights", tag:"Wrong Answer",
        bug:"Without stale-entry check, outdated PQ entries cause wrong distances. Dijkstra is incorrect with negative edges.",
        fix:"Always add stale-entry guard. Use Bellman-Ford for negative weights.",
        code:`import heapq
dist = [float('inf')] * n; dist[src] = 0
pq = [(0, src)]
while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]: continue    # ✅ stale-entry guard
    for v, w in graph[u]:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            heapq.heappush(pq, (dist[v], v))

return -1 if dist[dst] == float('inf') else dist[dst]` },
      { icon:"🔁", title:"Undirected: parent ≠ back-edge", tag:"False cycle",
        bug:"In undirected DFS, edge back to parent looks like a cycle but isn't.",
        fix:"Track parent and skip it. For directed graphs use 3-state visited.",
        code:`# ❌ False positive — parent edge looks like cycle
def dfs(u, visited):
    visited.add(u)
    for v in graph[u]:
        if v in visited: return True  # wrong!

# ✅ Pass parent, skip it
def dfs(u, parent, visited):
    visited.add(u)
    for v in graph[u]:
        if v == parent: continue    # skip parent
        if v in visited: return True
        if dfs(v, u, visited): return True
    return False

# Directed: 3-state (0=unvisited, 1=in-stack, 2=done)` },
    ],
  },
  {
    id:"stack-queue-ec", label:"Stack/Queue", emoji:"📚",
    title:"Stack / Queue Edge Cases", subtitle:"Pop on empty, leftover elements, calculator sign",
    cards:[
      { icon:"📭", title:"Pop / peek on empty stack", tag:"IndexError",
        bug:"list.pop() on empty list raises IndexError.",
        fix:"Guard before every pop/peek.",
        code:`# ✅ Guard before pop
if stack: stack.pop()

# Valid Parentheses: extra ")" → stack empty → False
if not stack or stack[-1] != expected:
    return False

# Basic Calculator:
# Init result = 0, sign = 1, stack = []
# Handles leading "+" or "-" before first operand

# Stack peek safely
top = stack[-1] if stack else None` },
      { icon:"📊", title:"Leftover elements after loop", tag:"Monotonic Stack",
        bug:"Items remaining in monotonic stack have no next greater/smaller element.",
        fix:"Process remaining elements or use a sentinel.",
        code:`# Next Greater Element: remaining → -1
result = [-1] * n; stack = []
for i in range(n):
    while stack and nums[stack[-1]] < nums[i]:
        result[stack.pop()] = nums[i]
    stack.append(i)
# remaining already -1 ✓

# Largest Rectangle Histogram: append sentinel
heights.append(0)   # triggers all remaining to pop
for i, h in enumerate(heights):
    while stack and heights[stack[-1]] > h:
        height = heights[stack.pop()]
        width = i if not stack else i - stack[-1] - 1
        max_area = max(max_area, height * width)
    stack.append(i)` },
    ],
  },
  {
    id:"dp-ec", label:"DP", emoji:"🎯",
    title:"DP Edge Cases", subtitle:"Base case index, circular input, loop direction",
    cards:[
      { icon:"0️⃣", title:"Wrong base case / index crash", tag:"IndexError",
        bug:"Accessing dp[i-2] when i=1. In Python accessing negative indices doesn't crash but silently wraps around to the back of the array, causing logical bugs.",
        fix:"Initialize dp[0] and handle i < 2 explicitly before using dp[i-2].",
        code:`# In Python, list[-1] gets the last element!
# So for Climbing Stairs (n=1):
dp = [0, 0]
dp[0] = 1
dp[1] = 1
# if you loop range(2, n+1), it doesn't execute for n=1
# but if you blindly access dp[i-2], it reads dp[-1]!` }
    ],
  },
];
