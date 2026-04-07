export const CODE_TRICKS_SECTIONS = [
  {
    id:"type-conversion", label:"Type Conversion", emoji:"🔄",
    title:"Type Conversions & Parsing", subtitle:"int↔str, char↔int, list↔set↔dict",
    cards:[
      { icon:"🔢", title:"int ↔ str", tag:"Parsing", code:`# int → str
s = str(42)           # '42'
s = f"{42}"           # '42' (f-string)

# str → int
n = int("42")         # 42
n = int("ff", 16)     # 255 (hex)
n = int("1010", 2)    # 10  (binary)

# str → float
f = float("3.14")     # 3.14

# int → binary / hex / octal string
bin(10)   # '0b1010'
hex(255)  # '0xff'
oct(8)    # '0o10'` },
      { icon:"🔤", title:"char ↔ int (ord/chr)", tag:"Very Common", code:`# char → ASCII int
ord('A')              # 65
ord('a')              # 97

# int → char
chr(65)               # 'A'

# 0-based alphabet index
idx = ord('c') - ord('a')   # 2

# char digit → int
d = int('7')                 # 7
d = ord('7') - ord('0')      # 7

# int → alphabet char
chr(ord('a') + 2)            # 'c'` },
      { icon:"📋", title:"list / set / dict conversions", tag:"Array↔Collection", code:`# list → set (deduplicate)
s = set([1, 2, 2, 3])       # {1, 2, 3}

# set → sorted list
lst = sorted(s)              # [1, 2, 3]

# list of tuples → dict
d = dict([(1,'a'), (2,'b')])

# dict → lists
list(d.keys())
list(d.values())
list(d.items())

# str → list of chars
list("abc")                  # ['a', 'b', 'c']

# list of chars → str
''.join(['a','b','c'])       # 'abc'` },
      { icon:"🔁", title:"Sorting / reversing", tag:"Common Gotcha", code:`arr.sort()                          # ascending in-place
arr.sort(reverse=True)              # descending in-place
sorted_arr = sorted(arr)            # returns new list
arr.reverse()                       # reverse in-place
arr[::-1]                           # reverse copy

# Sort by key
arr.sort(key=lambda x: x[1])       # by 2nd element
arr.sort(key=lambda x: (x[1], x[0]))  # multi-key

# Sort strings by length
words.sort(key=len)` },
    ],
  },
  {
    id:"constants", label:"Constants", emoji:"🔢",
    title:"Integer / Float Constants", subtitle:"Bounds, infinity, safe sentinel values",
    cards:[
      { icon:"📏", title:"Python infinity & bounds", tag:"Must Know", code:`import sys, math

# Python integers are unbounded — no overflow!
# Use these for DP/graph sentinel values:
INF = float('inf')       # positive infinity
NEG_INF = float('-inf')  # negative infinity
INF = 10**9              # safe for addition sums
INF = 10**18             # safe for large problems

# Check infinity
math.isinf(float('inf')) # True

# sys reference (not overflow guards)
sys.maxsize              # 9223372036854775807` },
      { icon:"🧮", title:"Midpoint — no overflow in Python", tag:"Binary Search", code:`# Python has no integer overflow.
# Safe form (good habit):
mid = lo + (hi - lo) // 2

# Or simply:
mid = (lo + hi) // 2     # ✅ fine in Python

# Integer division floors toward -inf:
7 // 2     # 3
-7 // 2    # -4  ← floors (unlike Java's truncation!)

# Ceiling division (no float):
import math
math.ceil(7 / 2)         # 4
(7 + 2 - 1) // 2         # 4` },
      { icon:"♾️", title:"Fill with sentinel", tag:"DP Init", code:`# 1D DP
dp = [float('inf')] * (n + 1)
dp[0] = 0

# 2D DP
dp = [[float('inf')] * (n+1) for _ in range(m+1)]

# Boolean DP
dp = [False] * (n + 1); dp[0] = True

# Memoization
memo = {}   # dict-based (most flexible)

# lru_cache (cleanest)
from functools import lru_cache
@lru_cache(maxsize=None)
def solve(i, j):
    ...` },
    ],
  },
  {
    id:"math", label:"Math", emoji:"📐",
    title:"Math Module", subtitle:"import math — no explicit import for built-ins",
    cards:[
      { icon:"🔝", title:"min / max / abs / pow / sqrt", tag:"Built-in", code:`import math

max(a, b);  min(a, b);  abs(x)
math.sqrt(n)             # float
int(math.sqrt(n))        # integer sqrt

# Perfect square check
sq = int(math.sqrt(n))
is_perfect = sq * sq == n

# Ceiling division
-(-a // b)               # ceil(a/b) positive a,b
math.ceil(a / b)

# min/max of list
min(arr);  max(arr)

# Built-in pow with 3 args = fast modular exponentiation
pow(base, exp, mod)      # O(log exp)` },
      { icon:"📊", title:"log / floor / ceil / gcd / lcm", tag:"Common", code:`import math

math.floor(3.7)          # 3
math.ceil(3.2)           # 4
math.log(n)              # natural log
math.log2(n)             # log base 2
math.log10(n)            # log base 10
math.log(n, base)        # any base

# Number of digits (n > 0)
int(math.log10(n)) + 1
len(str(n))              # simpler

# GCD / LCM (Python 3.5+ / 3.9+)
math.gcd(12, 8)          # 4
math.lcm(4, 6)           # 12` },
    ],
  },
  {
    id:"strings-sb", label:"String/SB", emoji:"📝",
    title:"String & List-as-StringBuilder", subtitle:"Immutable str + list buffer pattern",
    cards:[
      { icon:"🔍", title:"String core methods", tag:"Must Know", code:`s = "hello world"
len(s)                   # 11
s[0]                     # 'h'
s[-1]                    # 'd'
s[1:4]                   # 'ell'  [start:end) exclusive
s.find("world")          # 6  (-1 if not found)
s.count("l")             # 3
"world" in s             # True
s.startswith("he")       # True
s.endswith("ld")         # True
s.isdigit()
s.isalpha()
s.isalnum()
s.strip()                # remove whitespace both ends` },
      { icon:"🔀", title:"String transform methods", tag:"Transform", code:`s.lower();  s.upper()
s.strip();  s.lstrip();  s.rstrip()
s.replace("hello", "hi")
s.split(" ")             # ['hello', 'world']
s.split()                # any whitespace
" ".join(["a","b","c"])  # 'a b c'

# Reverse
s[::-1]

# Remove non-alphanumeric
import re
re.sub(r'[^a-z0-9]', '', s.lower())

# Repeat
"ab" * 3                 # 'ababab'` },
      { icon:"🏗", title:"StringBuilder pattern (list buffer)", tag:"Mutable", code:`# Python strings are immutable — use list, then join
buf = []
buf.append("text")
buf.append(str(n))       # append int as string
buf.insert(0, "prefix")  # insert at index
buf.pop()                # remove last
buf.pop(i)               # remove at index i
buf.reverse()            # reverse in-place

# Convert to string (do ONCE at the end)
result = "".join(buf)

# Reverse a string
s[::-1]
''.join(reversed(s))` },
      { icon:"🔢", title:"String comparison & sorting", tag:"Sorting", code:`s1 == s2               # ✅ value equality
s1 is s2               # ❌ identity (never for strings)

# Sorted key (anagram grouping)
key = ''.join(sorted(s))

# Counter as key
from collections import Counter
Counter(s)

# Group anagrams
from collections import defaultdict
groups = defaultdict(list)
for w in words:
    groups[tuple(sorted(w))].append(w)` },
    ],
  },
  {
    id:"arrays-tricks", label:"Arrays", emoji:"📦",
    title:"List / Array Tricks", subtitle:"Python list operations, sort, copy, search",
    cards:[
      { icon:"🔃", title:"Sort & Fill", tag:"Core", code:`arr.sort()                          # ascending in-place
arr.sort(reverse=True)              # descending
arr = [0] * n                       # fill zeros
arr = [float('inf')] * n            # fill infinity
arr[i:j] = [0] * (j - i)           # fill range

# Sort 2D by column
intervals.sort(key=lambda x: x[0])  # by start
intervals.sort(key=lambda x: x[1])  # by end
arr.sort(key=lambda x: (x[0], -x[1]))  # col0 asc, col1 desc` },
      { icon:"📋", title:"Copy & Equality", tag:"Deep vs Shallow", code:`import copy

# Shallow copy (1D — safe)
copy_arr = arr[:]
copy_arr = arr.copy()
copy_arr = list(arr)

# Deep copy (2D / nested)
copy_2d = copy.deepcopy(grid)
copy_2d = [row[:] for row in grid]  # manual

# Check equality
arr1 == arr2           # element-wise ✅

# Debug print
print(arr)
print(*arr)` },
      { icon:"🔍", title:"Binary Search (bisect)", tag:"Built-in", code:`import bisect

arr = [1, 3, 5, 7, 9]    # MUST be sorted

# First position >= x
bisect.bisect_left(arr, 5)     # 2

# First position > x
bisect.bisect_right(arr, 5)    # 3

# Check existence
idx = bisect.bisect_left(arr, 5)
found = idx < len(arr) and arr[idx] == 5

# Insert keeping sorted
bisect.insort(arr, 4)

# Leftmost / rightmost occurrence
left  = bisect.bisect_left(arr, target)
right = bisect.bisect_right(arr, target) - 1` },
    ],
  },
  {
    id:"collections", label:"Collections", emoji:"🗃",
    title:"Collections Module", subtitle:"Counter, defaultdict, deque, OrderedDict",
    cards:[
      { icon:"🔢", title:"Counter — frequency counting", tag:"Very Common", code:`from collections import Counter

c = Counter("aabbcc")         # {'a':2,'b':2,'c':2}
c = Counter([1,2,2,3,3,3])

c['a']                        # 2
c['z']                        # 0 (no KeyError!)
c.most_common(2)              # top 2 [(elem,count),...]
sum(c.values())               # total count

# Arithmetic
c1 + c2   # union (sum)
c1 - c2   # difference (positive only)
c1 & c2   # intersection (min)
c1 | c2   # union (max)` },
      { icon:"🗂", title:"defaultdict — grouped collections", tag:"Grouping", code:`from collections import defaultdict

# Frequency counting
freq = defaultdict(int)
for c in s:
    freq[c] += 1     # no KeyError!

# Grouping
groups = defaultdict(list)
for word in words:
    groups[tuple(sorted(word))].append(word)

# Graph adjacency
graph = defaultdict(set)
for u, v in edges:
    graph[u].add(v)
    graph[v].add(u)

# Nested
matrix = defaultdict(lambda: defaultdict(int))` },
      { icon:"↔️", title:"deque — O(1) both ends", tag:"BFS/Stack", code:`from collections import deque

dq = deque()
dq.append(x)           # add right  (enqueue)
dq.appendleft(x)       # add left   (stack front)
dq.pop()               # remove right
dq.popleft()           # remove left (dequeue)
dq[0]                  # peek left
dq[-1]                 # peek right

# BFS template
q = deque([start])
while q:
    node = q.popleft()
    for nei in graph[node]:
        q.append(nei)` },
    ],
  },
  {
    id:"map-set", label:"Map/Set", emoji:"🗂",
    title:"dict / set Operations", subtitle:"O(1) lookup, frequency, grouping",
    cards:[
      { icon:"🔑", title:"Core dict operations", tag:"Must Know", code:`d = {}
d[key] = val
d.get(key)             # None if missing
d.get(key, 0)          # default value ← most common
key in d               # O(1) check
d.pop(key, None)       # remove safely
len(d)

for k, v in d.items(): ...

# Merge dicts (Python 3.9+)
merged = d1 | d2

# Group pattern
d.setdefault(key, []).append(val)` },
      { icon:"🔢", title:"Frequency counting patterns", tag:"Very Common", code:`# Option 1: get + put
d[key] = d.get(key, 0) + 1

# Option 2: defaultdict
from collections import defaultdict
freq = defaultdict(int)
freq[key] += 1

# Option 3: Counter
from collections import Counter
freq = Counter(arr)

# Decrement and remove if zero
freq[key] -= 1
if freq[key] == 0:
    del freq[key]

# Most common element
max(freq, key=freq.get)` },
      { icon:"🗃", title:"set operations", tag:"O(1) lookup", code:`s = set()
s.add(val)
val in s               # O(1)
s.remove(val)          # KeyError if missing
s.discard(val)         # safe remove
len(s)

# Set from list
s = set(arr)

# Set operations
s1 & s2   # intersection
s1 | s2   # union
s1 - s2   # difference
s1 ^ s2   # symmetric difference

# Visited pattern
visited = set()
if node not in visited:
    visited.add(node)` },
    ],
  },
  {
    id:"pq-comparator", label:"PQ & Comparator", emoji:"⛏",
    title:"heapq — Priority Queue", subtitle:"Min-heap, max-heap, custom ordering",
    cards:[
      { icon:"📉", title:"Min-heap / Max-heap", tag:"heapq", code:`import heapq

# Min-heap (default)
heap = []
heapq.heappush(heap, val)
heapq.heappop(heap)         # removes & returns min
heap[0]                     # peek min

# Max-heap: negate values
heapq.heappush(heap, -val)
-heapq.heappop(heap)        # negate back

# Build heap in-place (O(n))
heapq.heapify(arr)

# Top k
heapq.nlargest(k, arr)
heapq.nsmallest(k, arr)

# Tuples: sorted by first element
heapq.heappush(heap, (priority, val))` },
      { icon:"🔧", title:"Custom comparator (Python)", tag:"Lambda", code:`# heapq only supports min-heap naturally.
# Workaround: push tuples (key, value)

# By frequency ascending:
heap = []
for val, freq in counter.items():
    heapq.heappush(heap, (freq, val))

# By frequency descending:
heapq.heappush(heap, (-freq, val))

# Custom object — implement __lt__
class Item:
    def __init__(self, val, priority):
        self.val = val
        self.priority = priority
    def __lt__(self, other):
        return self.priority < other.priority` },
      { icon:"🔃", title:"Sorting with key= / cmp_to_key", tag:"sorted / sort", code:`import functools

# Sort by second element
arr.sort(key=lambda x: x[1])

# Multi-key sort
words.sort(key=lambda x: (len(x), x))

# Complex: Largest Number concatenation
def cmp(a, b):
    if a+b > b+a: return -1
    if a+b < b+a: return 1
    return 0
nums.sort(key=functools.cmp_to_key(cmp))

# Reverse sort
arr.sort(key=lambda x: -x)
arr.sort(reverse=True)` },
    ],
  },
  {
    id:"deque-section", label:"Deque", emoji:"📚",
    title:"deque — Stack, Queue, Sliding Window", subtitle:"O(1) both ends — prefer over list for queues",
    cards:[
      { icon:"📥", title:"deque as Stack (LIFO)", tag:"Stack", code:`from collections import deque

stack = deque()
stack.append(x)        # push to top
stack.pop()            # pop from top
stack[-1]              # peek top
len(stack) == 0        # isEmpty

# list is also fine as stack:
stack = []
stack.append(x)
stack.pop()
stack[-1]              # peek` },
      { icon:"🔁", title:"deque as Queue (FIFO)", tag:"BFS", code:`from collections import deque

queue = deque()
queue.append(x)        # enqueue (add right)
queue.popleft()        # dequeue (remove left)
queue[0]               # peek front
len(queue) == 0        # isEmpty

# BFS template
q = deque([start])
visited = {start}
while q:
    node = q.popleft()
    for nei in graph[node]:
        if nei not in visited:
            visited.add(nei)
            q.append(nei)` },
      { icon:"↔️", title:"Monotonic deque (sliding window max)", tag:"Sliding Window", code:`from collections import deque

def sliding_max(nums, k):
    dq = deque()    # stores indices; front = max
    result = []
    for i, num in enumerate(nums):
        # remove out-of-window
        while dq and dq[0] <= i - k:
            dq.popleft()
        # maintain decreasing order
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result` },
    ],
  },
  {
    id:"bit-ops", label:"Bit Ops", emoji:"⚡",
    title:"Bit Operations Cheatsheet", subtitle:"Check, set, clear, toggle bits",
    cards:[
      { icon:"🔬", title:"Bit read / write operations", tag:"Must Know", code:`# Check if bit i is set
(n >> i) & 1           # 1 if set, 0 if not
bool(n & (1 << i))

# Set bit i
n |= (1 << i)

# Clear bit i
n &= ~(1 << i)

# Toggle bit i
n ^= (1 << i)

# Python: no overflow — arbitrary precision integers
# No unsigned shift >>> like Java — >> is always arithmetic` },
      { icon:"🔢", title:"Lowest set bit & counting", tag:"Kernighan", code:`# Get lowest set bit
n & (-n)               # 12 (1100) → 4 (0100)

# Clear lowest set bit
n &= (n - 1)           # Kernighan's trick

# Count set bits — Kernighan's O(k)
count = 0
while n:
    n &= n - 1
    count += 1

# Count set bits — Python built-in
bin(n).count('1')
n.bit_count()          # Python 3.10+

# Power of 2 check
n > 0 and (n & (n-1)) == 0

# Bit length
n.bit_length()         # e.g. 5 → 3 (101)` },
      { icon:"⚡", title:"Shift & XOR tricks", tag:"Tricks", code:`n << k                 # n × 2^k
n >> k                 # n ÷ 2^k (arithmetic, floors)

# Even / odd
n & 1 == 0             # even
n & 1 == 1             # odd

# XOR properties
a ^ 0 == a             # unchanged
a ^ a == 0             # self-cancels ← Single Number
a ^ b ^ a == b         # associative + self-cancel

# XOR swap
a ^= b; b ^= a; a ^= b

# Bitmask for n bits
(1 << n) - 1           # n=4 → 0b1111 = 15

# Enumerate all subsets of bitmask m
sub = m
while sub:
    # process sub
    sub = (sub - 1) & m` },
    ],
  },
  {
    id:"grid-utils", label:"Grid Utils", emoji:"🔲",
    title:"Grid / Matrix Utilities", subtitle:"Direction arrays, bounds check, traversals",
    cards:[
      { icon:"🧭", title:"Direction arrays", tag:"BFS/DFS on Grid", code:`# 4-directional
DIRS = [(-1,0),(0,1),(1,0),(0,-1)]

# 8-directional (includes diagonals)
DIRS8 = [(-1,-1),(-1,0),(-1,1),(0,-1),
         (0,1),(1,-1),(1,0),(1,1)]

# Usage with bounds check
rows, cols = len(grid), len(grid[0])
for dr, dc in DIRS:
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:
        pass  # valid neighbor` },
      { icon:"📐", title:"Index conversion & transforms", tag:"Matrix", code:`# 2D → 1D
idx = r * cols + c

# 1D → 2D
r, c = divmod(idx, cols)

# Transpose
matrix = [list(row) for row in zip(*matrix)]

# Rotate 90° clockwise: transpose → reverse each row
matrix = [list(row) for row in zip(*matrix)]
for row in matrix: row.reverse()

# Diagonals
# Main diagonal: matrix[i][i]
# Anti-diagonal: matrix[i][n-1-i]
# Same diagonal (r-c constant)
# Same anti-diagonal (r+c constant)` },
      { icon:"🔍", title:"Grid DFS / BFS templates", tag:"Islands Pattern", code:`# DFS on grid
def dfs(grid, r, c, visited):
    rows, cols = len(grid), len(grid[0])
    if (r < 0 or r >= rows or c < 0 or c >= cols
            or visited[r][c] or grid[r][c] == 0):
        return
    visited[r][c] = True
    for dr, dc in [(-1,0),(0,1),(1,0),(0,-1)]:
        dfs(grid, r+dr, c+dc, visited)

# BFS on grid
from collections import deque
def bfs(grid, sr, sc):
    q = deque([(sr, sc)])
    visited = {(sr, sc)}
    while q:
        r, c = q.popleft()
        for dr, dc in [(-1,0),(0,1),(1,0),(0,-1)]:
            nr, nc = r+dr, c+dc
            if (0<=nr<len(grid) and 0<=nc<len(grid[0])
                    and (nr,nc) not in visited):
                visited.add((nr,nc))
                q.append((nr,nc))` },
    ],
  },
  {
    id:"dsa-blocks", label:"DSA Blocks", emoji:"🧱",
    title:"DSA Building Blocks", subtitle:"GCD, palindrome, modular exp, union-find, node classes",
    cards:[
      { icon:"🔢", title:"GCD, LCM, Prime check", tag:"Math", code:`import math

math.gcd(12, 8)        # 4
math.lcm(4, 6)         # 12

# Manual LCM
def lcm(a, b): return a * b // math.gcd(a, b)

# Is prime — O(√n)
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

# Count digits
len(str(n))
int(math.log10(n)) + 1  # n > 0` },
      { icon:"🔁", title:"Palindrome check", tag:"Two Pointers", code:`# Two pointers
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]: return False
        l += 1; r -= 1
    return True

# One-liner
s == s[::-1]

# Alphanumeric only, case-insensitive
filtered = [c.lower() for c in s if c.isalnum()]
filtered == filtered[::-1]

# Expand around center
def expand(s, l, r):
    while l>=0 and r<len(s) and s[l]==s[r]:
        l -= 1; r += 1
    return r - l - 1  # length` },
      { icon:"🏗", title:"Node class templates", tag:"Copy-paste", code:`# ListNode
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next

# TreeNode
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left; self.right = right

# TrieNode
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

# Graph node (Clone Graph)
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors or []` },
      { icon:"⚡", title:"Modular arithmetic & fast power", tag:"Modular", code:`MOD = 10**9 + 7

# Python built-in 3-arg pow = fast modular exponentiation!
pow(base, exp, MOD)    # O(log exp) — no overflow

# Safe modular ops
(a + b) % MOD
(a * b) % MOD

# Modular inverse (Fermat's little theorem)
pow(b, MOD - 2, MOD)

# Manual modular exponentiation
def mod_pow(base, exp, mod):
    result = 1; base %= mod
    while exp > 0:
        if exp & 1: result = result * base % mod
        base = base * base % mod
        exp >>= 1
    return result` },
      { icon:"🔗", title:"Union-Find (DSU)", tag:"Copy-paste", code:`class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):         # path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):     # union by rank
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True` },
    ],
  },
  {
    id:"init-patterns", label:"Init Patterns", emoji:"🚀",
    title:"Common Initialization Patterns", subtitle:"Frequency arrays, adjacency list, DP tables",
    cards:[
      { icon:"📊", title:"Frequency arrays", tag:"String Problems", code:`# 26 lowercase letters
freq = [0] * 26
for c in s:
    freq[ord(c) - ord('a')] += 1

# Counter (most Pythonic)
from collections import Counter
freq = Counter(s)

# Check two frequency arrays equal
Counter(s1) == Counter(s2)

# 128 ASCII
freq = [0] * 128
for c in s:
    freq[ord(c)] += 1` },
      { icon:"🕸", title:"Graph adjacency list", tag:"Graph Init", code:`from collections import defaultdict

# Unweighted undirected
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)  # omit for directed

# Weighted
graph = defaultdict(list)
for u, v, w in edges:
    graph[u].append((v, w))

# In-degree (Kahn's topo sort)
in_deg = [0] * n
for u, v in edges:
    in_deg[v] += 1

# Adjacency matrix
adj = [[0]*n for _ in range(n)]` },
      { icon:"🎯", title:"DP table initializations", tag:"DP Init", code:`INF = float('inf')

# 1D DP
dp = [0] * (n + 1)
dp = [INF] * (n + 1); dp[0] = 0

# 2D DP
dp = [[INF]*(n+1) for _ in range(m+1)]

# Memoization with dict
memo = {}
def solve(i, j):
    if (i,j) in memo: return memo[(i,j)]
    # ... compute ...
    memo[(i,j)] = result
    return result

# lru_cache
from functools import lru_cache
@lru_cache(maxsize=None)
def dp(i, j): ...` },
      { icon:"📌", title:"Common result variable patterns", tag:"Templates", code:`# Find minimum / maximum
ans = float('inf')
ans = min(ans, candidate)

ans = float('-inf')
ans = max(ans, candidate)

# Collect results (always copy!)
res = []
res.append(current[:])       # list copy
res.append(tuple(current))   # immutable

# Global in nested function
ans = [0]                    # list trick for closure
# OR: use nonlocal
def helper():
    nonlocal ans
    ans = max(ans, ...)

# Two-value result
return [lo, hi]` },
    ],
  },
];
