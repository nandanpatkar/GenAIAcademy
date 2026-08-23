#     Remove Zero Sum Consecutive Nodes from Linked List 

> **Slug:** `remove-zero-sum-consecutive-nodes-from-linked-list`  
> **Published:** 2026-06-26T18:34:59.845Z  
> **Updated:** 2026-06-26T18:34:59.856Z  
> **Keywords:** Remove Zero Sum Consecutive Nodes from Linked List, Zero Sum Linked List  
> **Cover Image:** ![    Remove Zero Sum Consecutive Nodes from Linked List ](6a3ec608c643b84ab4ce4b64)

**Description:** Remove Zero Sum Consecutive Nodes from Linked List – Brute Force and Optimal Approach with Dry Run (C++, Java, Python)

---

## Problem Statement

Given the head of a linked list, your task is to remove all consecutive sequences of nodes which sum to zero. The linked list should be rearranged in place such that these sequences are eliminated and only the nodes that were not part of a zero-sum sequence remain. This problem requires modifying the list to ensure that no sequence that sums to zero exists in the final result.

Consider the linked list `[1, 2, -3, 3, 1]`:

1. First, the sequence `[1, 2, -3]` sums to zero.
2. Removing this sequence leaves `[3, 1]`.
3. The sequence `[3, 1]` does not contain any zero-sum subsequence, so this is the list you should return.

The expected output here should be `[3, 1]`.

Your goal is to write an algorithm to efficiently remove these zero-sum sequences and return the resultant linked list.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:**  head = [1, 2, -3, 3, 1]
> **Output:** [3, 1]
> **Explanation:**The sublist [1, 2, -3] sums to zero and is removed.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** head = [1, 2, 3, -3, -2]
> **Output:** [1]
> **Explanation:** The sublist [2, 3, -3, -2] sums to zero and is removed.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:** head = [1, -1]
> **Output:** []
> **Explanation:**  The entire list sums to zero and is removed.

## Constraints

- The number of nodes in the list is in the range [1, 1000].
- Each node's value is within the range of -1000 to 1000.

## Real-Life Analogy

Imagine you are packing a travel bag for a trip. Excited and unsure of what you might need, you keep adding things as you go.

First, you pack a heavy sweater because you think the weather might be cold. A little later, you check the forecast again and realize it’s going to be warm, so you take the sweater back out. In the end, your bag is exactly the same as it was before — as if the sweater was never packed at all.

Then you add a water bottle and a couple of snacks. But after noticing your bag is getting too heavy, you decide to remove all of them together. Once again, your bag returns to its previous state, with no real change left behind.

By the time you finish packing, all the unnecessary “add and remove” actions have cancelled each other out. What remains in the bag are only the truly useful items that matter for the journey.

This is exactly how removing zero-sum sublists works in a linked list. Certain sequences of numbers cancel each other out to zero, meaning they have no lasting effect on the final result. So, those sequences are removed entirely, leaving behind only the meaningful nodes in the list.

## Brute-Force Approach

### Intuition

We want to remove every subsequence in the linked list whose sum is zero. To do this, we try **every possible starting point**, and from each start we check **all possible ending points**. If the sum of the nodes between them becomes zero, we remove that entire sequence.

But here’s the tricky part, once we remove a zero-sum sequence, the list changes. This change can cause **new zero-sum sequences** to appear (because nodes that were previously separated may now become neighbors). That’s why we don’t just stop after one removal, we **start the process over again** until no more zero-sum subsequences exist.

### **Algorithm**

1. Initially, we insert a dummy node before the head → This makes deletions uniform, even when a zero-sum block starts at the original head.

2. Next,  Start a “repeat until nothing changes” loop → Keep a flag (found) that tracks whether any deletion happened in the current pass. If no deletion occurs in a full pass, then we are done. 

3. Now, begin each pass from the dummy node → Set prev = dummy. We will try every possible starting position start = prev.next, because removals can change which ranges sum to zero.

4. For the current start position, run a forward sum sweep, Initialize sum = 0 and walk current from start forward, accumulating sum += current.val.
If at any point sum == 0, the sublist [start … current] sums to zero.

5. Remove the zero-sum block in O(1) → Link around it with prev.next = current.next. Set found = true to mark that a change happened in this pass. 

6. Immediately, restart checking from the (possibly new) node after prev → Because deleting a block can create new zero-sum ranges that cross the cut boundary, we restart the search from the same prev (and on the next outer iteration, from the dummy again).    

7. If no zero-sum block was found for this start → Advance prev = prev.next and repeat the forward sweep from the next starting position.

8. Stop when a full pass makes no deletions → When found stays false after scanning all starts, return dummy.next as the cleaned list.

### **Dry Run**



### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* removeZeroSumSublists(ListNode* head) {
        ListNode* dummy = new ListNode(0);
        dummy->next = head;

        bool found = true;

        while (found) {
            found = false;
            ListNode* prev = dummy;

            while (prev->next != nullptr) {
                ListNode* start = prev->next;
                ListNode* current = start;
                int sum = 0;

                while (current != nullptr) {
                    sum += current->val;

                    if (sum == 0) {
                        prev->next = current->next;
                        found = true;
                        break;
                    }

                    current = current->next;
                }

                if (!found) {
                    prev = prev->next;
                }
            }
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
class BruteApproach {
  public ListNode removeZeroSumSublists(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    boolean found = true;
    while (found) {
      found = false;
      ListNode prev = dummy;
      while (prev.next != null) {
        ListNode start = prev.next;
        ListNode current = start;
        int sum = 0;
        while (current != null) {
          sum += current.val;
          if (sum == 0) {
            prev.next = current.next;
            found = true;
            break;
          }
          current = current.next;
        }
        if (!found) {
          prev = prev.next;
        }
      }
    }
    return dummy.next;
  }
}
```

### index.py Implementation

```index.py
class Solution:
    def removeZeroSumSublists(self, head):
        dummy = ListNode(0)
        dummy.next = head

        found = True

        while found:
            found = False
            prev = dummy

            while prev.next is not None:
                start = prev.next
                current = start
                total = 0

                while current is not None:
                    total += current.val

                    if total == 0:
                        prev.next = current.next
                        found = True
                        break

                    current = current.next

                if not found:
                    prev = prev.next

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **O(N****2****)**

- For each pass, we start traversal from the dummy node.
- We try every possible starting point in the linked list.
- From each starting point, we traverse forward and keep calculating the running sum.
- In the worst case, for one starting node we may scan up to N nodes.
- Since there can be around N starting points, the total operations in one pass become O(N²).
- After removing a zero-sum subsequence, the number of nodes decreases.
- Therefore, even though multiple passes may occur, the overall worst-case time complexity remains O(N²).

#### **Space Complexity: O(1)**

- We only use a constant number of pointer variables such as **dummy**, **prev**, **start**, and **current**.
- We also use a single integer variable sum to store the running total.
- No extra data structures like arrays, lists, stacks, or hash maps are used.
- No additional linked list nodes are created during processing.
- Therefore, the auxiliary space used does not depend on the input size** N**.
- Hence, the space complexity is **O(1)**.

## Optimal Approach

### Intuition

The brute-force approach keeps restarting after every deletion, leading to repeated scans and an overall **O(N²)** time complexity. To optimize, we notice an important property.
If two nodes have the same prefix sum, then the nodes in between them sum to zero. Like, if the running sum up to node A is 10, and the running sum up to node B (later in the list) is also 10, then the sublist between A  and B must sum to 0.
Instead of scanning all possible subsequences, we can **track prefix sums in a HashMap**. The map tells us instantly whether a prefix sum has appeared before, and where. As If it is new, record it if it is seen already, we have found a zero-sum subsequence that can be removed in one shot.
By carefully cleaning up intermediate prefix sums when we remove nodes, we ensure correctness in **just one pass**through the list. This avoids repeated rescans and makes the solution efficient.

### **Algorithm**

1.  Insert a dummy before head → dummy.next = head. Because it simplifies deletions that include the original head.

2.  Now, Maintain a running prefixSum as we walk from dummy → prefixSum += curr.val. Mean equal prefix sums indicate the segment between them sums to zero.

3.  Next, we keep prefixSumMap: prefixSum → latest node → store the current node when you first/last see a prefix sum. We are doing this because it instantly find the start of any zero-sum subsequence.

4.  As prefixSum is new, so now we put(prefixSum, currently) to record were this sum occurs for further matches.

5.  If the prefixSum seen before then the part of the list between the earlier node and current must add up to zero, because the running sum did not change, everything in between cancels out.

6.  Remove prefix sums of the nodes inside the zero-sum block, then connect the earlier node directly to curr.next. As it clears outdated sums from the map and skips the zero-sum nodes in one go.

7.  Lastly, we move to next node until end, then return dummy.next. It finished the single pass and gives the cleaned-up list.

### **Dry Run**



## **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* removeZeroSumSublists(ListNode* head) {
        unordered_map<int, ListNode*> prefixSumMap;

        ListNode* dummy = new ListNode(0);
        dummy->next = head;

        ListNode* curr = dummy;
        int prefixSum = 0;

        while (curr != nullptr) {
            prefixSum += curr->val;

            if (prefixSumMap.count(prefixSum)) {
                ListNode* prev = prefixSumMap[prefixSum]->next;
                int sum = prefixSum;

                while (prev != curr) {
                    sum += prev->val;
                    prefixSumMap.erase(sum);
                    prev = prev->next;
                }

                prefixSumMap[prefixSum]->next = curr->next;

            } else {
                prefixSumMap[prefixSum] = curr;
            }

            curr = curr->next;
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode removeZeroSumSublists(ListNode head) {
        Map<Integer, ListNode> prefixSumMap = new HashMap<>();
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode curr = dummy;
        int prefixSum = 0;

        while (curr != null) {
            prefixSum += curr.val;
            if (prefixSumMap.containsKey(prefixSum)) {
                ListNode prev = prefixSumMap.get(prefixSum).next;
                int sum = prefixSum;
                while (prev != curr) {
                    sum += prev.val;
                    prefixSumMap.remove(sum);
                    prev = prev.next;
                }
                prefixSumMap.get(prefixSum).next = curr.next;
            } else {
                prefixSumMap.put(prefixSum, curr);
            }
            curr = curr.next;
        }
        return dummy.next;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def removeZeroSumSublists(self, head):
        prefix_sum_map = {}

        dummy = ListNode(0)
        dummy.next = head

        curr = dummy
        prefix_sum = 0

        while curr is not None:
            prefix_sum += curr.val

            if prefix_sum in prefix_sum_map:
                prev = prefix_sum_map[prefix_sum].next
                temp_sum = prefix_sum

                while prev != curr:
                    temp_sum += prev.val
                    del prefix_sum_map[temp_sum]
                    prev = prev.next

                prefix_sum_map[prefix_sum].next = curr.next

            else:
                prefix_sum_map[prefix_sum] = curr

            curr = curr.next

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- We traverse the linked list once from the dummy node to the end.
- Traversing all **N **nodes takes **O(N)** time.
- For each node, we calculate/update the running prefix sum.
- HashMap operations like **put**, **get**, and **remove **take **O(1)** average time.
- When a zero-sum sublist is detected, we traverse its internal nodes to remove outdated prefix sums from the HashMap.
- Each node is cleaned up and removed from the HashMap at most once during the entire execution.
- Therefore, the total cleanup work across the whole traversal is also **O(N)**.
- Total Time Complexity = **O(N)** (main traversal) + **O(N)** (total cleanup).
- Hence, the overall time complexity is **O(N)**.

#### **Space Complexity: O(N)**

- The HashMap stores prefix sums corresponding to nodes visited during traversal.
- In the worst case, if no zero-sum subsequence exists, one prefix sum is stored for each node.
- Therefore, the HashMap can contain up to `N` entries.
- This requires **O(N)** extra space.
- Apart from the HashMap, we only use a constant number of pointers such as `dummy`, `curr`, and `prev`.
- We also use a few integer variables like `prefixSum` and `sum`.
- These additional variables require only **O(1)** space.
- Hence, the overall space complexity is **O(N)**.

> [!NOTE]
> **INFO**
> Denoting nodes:   (index:value) for clarity where index counts real nodes starting at 1:
> 
> 
> Start: curr = dummy, prefixsSum = 0, prefixSumMap = {}
> 
> 1. Visit dummy
> • curr = dummy(0)
> • prefixSum += 0 → 0
> • prefixSumMap does not contain 0 → put 0 →  dummy
> ⦿ Map: {0: dummy}
> ⦿ List: unchanged
> **Move curr = curr.next → nodel(1)**
> 2. Visit node1 (1) 
> • prefixSum += 1 → 1
> •﻿﻿ 1 not in map → put 1 - node 1
> ⦿ Map: {0: dummy, 1: node 1}
> ⦿ List: unchanged
> •﻿﻿ **Move curr → node2(2)**
> 3. Visit node2 (2)
> •﻿﻿ prefixSum += 2 → 3
> •﻿﻿ 3 not in map → put 3 - node2
> ⦿ Map: {0: dummy, 1: node 1, 3:  node2}
> •﻿﻿  **Move curr → node3(-3)**
> 4. Visit node3 (-3)
> •﻿﻿ prefixSum += -3 → 0
> •﻿﻿ O is in map (maps to dummy) → we found a zero-sum block between dummy.next and curr.
> 
> ***Remove intermediate sums and unlink block***:
> 
> - prev = prefixSumMap.getO).next = dummy.next = node 1
> - ﻿﻿sum = prefixSum = 0
> - ﻿﻿while (prev != curr):
> - - ﻿﻿sum += prevval → 0 + 1 = 1 → remove 1 from map → prefixSumMap.remove(1)
> prev = prev.next → node2
>   - ﻿﻿sum += prev.val → 1 + 2 = 3 → remove 3 from map
> → prefixSumMap.remove(3)
> prev = prev.next → node3
>   - now prev = curr → stop loop
> - ﻿﻿Now unlink: prefixSumMap.get(O).next = curr.next → dummy.next =
> node3.next = node4.
> *By this effectively removes nodes 1,2,3 from the list.*
> - ﻿﻿Map after removals: {0: dummy}
> - ﻿﻿List now: dummy(0) → 3 → 1 → -3 → -2 → 3 (node: 4 → 8).
> 
> **Move curr = curr.next → curr becomes node4(3) (since curr was**
> **node3(-3), curr.next is node4)**
> 
> 1. Visit node(4) 3
> •﻿﻿ prefixsum += 3 → 3(remember prefixSum carried forward)
> •﻿﻿ ﻿﻿3 not in map → put 3 → node4
> ⦿ Map: {0: dummy, 3: node4}
> •﻿﻿ **Move curr → node5(1)**
> 2. Visit node5(1)
> •﻿﻿ prefixSum += 1 → 4
> •﻿﻿ 4 not in map → put 4 - node5
> ⦿ Map: {0: dummy, 3: node4, 4: node5}
> •﻿﻿  ﻿﻿**Move curr → node6 (-3)**
> 3. Visit node6(-3)
> •﻿﻿  prefixSum += -3 → 1
> •﻿﻿  1  not in map (we removed earlier) → put 1 →  node6
> ⦿  Map: {0: dummy, 3: node4, 4: node5, 1: node6}
> •﻿﻿  **﻿﻿Move curr → node7(-2)**
> 4. Visit node7(-2)
> • prefixSum += -2 → -1
> •-1 not in map → put -1 → node7
> ⦿ Map: {0: dummy, 3: node4, 4: node5, 1: node6, -1: node7}
> • ﻿﻿**Move curr → node8(3)**
> 5. Visit node8(3)
> • prefixsum += 3 → 2
> • 2 not in map → put 2 → node8
> ⦿ Map: {0: dummy, 3: node4, 4: node5, 1: node6, -1: node7, 2: node8}
> • ﻿﻿**Move curr = curr.next → curr = null → loop ends**
> 
> #### Final Result: 
> Return dummy.next → node4 onwards:
> ﻿﻿Final cleaned list: 3 → 1 → -3 → -2 → 3 (That is nodes 4:(3), 5:(1), 6:(-3), 7:(-2), 8:(3))



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/remove-zero-sum-consecutive-nodes-from-linked-list)*
