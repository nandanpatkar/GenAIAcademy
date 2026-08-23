# Merge Nodes in Between Zeros

> **Slug:** `merge-nodes-in-between-zeroes`  
> **Published:** 2026-07-09T08:54:06.596Z  
> **Updated:** 2026-07-09T08:54:06.602Z  
> **Keywords:** Merge Nodes Between Zeros, Merge Nodes Linked List  
> **Cover Image:** ![Merge Nodes in Between Zeros](https://cdn.codehelp.in/media/articles/1783586900308-b13258af-Merge_Nodes_in_Between_Zeros.png)

**Description:** Learn How to Merge Nodes in Between Zeros – Brute Force and Optimal Approach with Dry Run (C++, Java, Python).

---

## Problem Statement

You are given the head of a singly linked list where the integers are separated by nodes with a value of 0. The list starts and ends with a 0. Your task is to modify the linked list by merging nodes situated between pairs of 0 nodes into a single node. The value of this new node should be equal to the sum of all the merged nodes' values. The 0 nodes should not appear in the final list.

The final result should return the head of a linked list that solely contains the sum of values between each consecutive pair of 0 nodes.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: **head = [0, 3, 1, 0, 4, 5, 2, 0]
> **Output:** : **4, 11]**
> **Explanation: **Sum of values between first and second zero is 4, and between second and third zero is 11.

> [!NOTE]
> **INFO**
> Example 2
> Input: head = [0, 1, 0, 0]
> Output: **[1]**
> Explanation: Single node between zeros with value 1.

> [!NOTE]
> **INFO**
> Example 3
> Input: head = [0, 5, 7, 3, 0, 2, 0]
> Output:[15, 2]
> Explanation: Sum of values between first and second zero is 15, and between second and third zero is 2.

## Constraints

- The number of nodes in the linked list is in the range [3, 2 *105 ].
- 0 <=** Node.val** <= 1000 .
- There **are no consecutive nodes** with **Node.val == 0**.
- The beginning and end of the linked list have **Node.val == 0**.

## Real-Life Analogy

Suppose You are at a birthday party where there are several tables lined up in a row. Each table has a **basket **on it. Some baskets are empty (these are your 0 nodes), while others contain sweets (these are your non-zero values). Now, the rule of the party is: whenever you find sweets placed between two empty baskets, you must collect all of them together, put them into a single new basket, and discard the empty ones. 

E.g: Suppose you see: 

- - First basket is empty → you ignore it.
  - Then comes a few baskets with sweets → say 3, 1, and 4.
  - After that, you hit another empty basket.

At that moment, you gather all those sweets** (3 + 1 + 4 = 8) and put them into one basket of 8 sweets.** The empty baskets on either side are just there to tell you where the grouping begins and ends, so you do not keep them in your final arrangement. 

By the end, instead of a confusing sequence of empty baskets and scattered sweets, you are left with just neat baskets, each filled with the total number of sweets that were between two empties. 

So, the linked list transformation is like organizing party baskets: throwing away the empty placeholders (0s) and combining everything between them into one clear, meaningful basket — **the sum node**.

## Brute-Force Approach

### Intuition

We think like “Let first collect all the segments between zeros then build a new linked list from scratch”. So, we traverse the list and collect the sums of values that lie between every pair of 0 of nodes. After computing each segment-sum, create a node for that sum and append it to a new linked list. The resulting list contains only those sum-nodes (the zeros are not included).

### Algorithm

1. Firstly, Initialize containers for segments, as create a list segments to store groups of values lying between two zero nodes and create a temporary list current Segment to hold numbers as you traverse the linked list.
2. Now we traverse the original linked list, as start with a pointer current = head, For each node, if **current.val == 0: currentSegment** has collected numbers. If yes, add a copy of it to segments, then clear currentSegment for the next group. **Else (current.val != 0), Add the values to currentSegment**. As we continue until the list ends.
3. Compute sums of each segment, we create a list sums and for each each segment in segments, computer the total of all values and store all the total in the sums.
4. Build the new linked list, if we sums is empty, return null (no non-zero values). Otherwise, Create a dummy node (dummy = new ListNode(0)) and a tail pointer pointing to it. For each sum in sums, as we create a new node with that value. Append it to the result (tail.next = newNode). We move tail to this new node.
5. We Return the result, dummy.next which points to the head of the new merged list.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* mergeNodes(ListNode* head) {

        // Step 1: Collect all segments between zeros
        vector<vector<int>> segments;
        vector<int> currentSegment;

        ListNode* current = head;

        while (current != nullptr) {

            if (current->val == 0) {

                if (!currentSegment.empty()) {
                    segments.push_back(currentSegment);
                    currentSegment.clear();
                }

            } else {
                currentSegment.push_back(current->val);
            }

            current = current->next;
        }

        // Step 2: Calculate sums for each segment
        vector<int> sums;

        for (vector<int>& segment : segments) {

            int sum = 0;

            for (int val : segment) {
                sum += val;
            }

            sums.push_back(sum);
        }

        // Step 3: Build new linked list
        if (sums.empty()) {
            return nullptr;
        }

        ListNode* dummy = new ListNode(0);
        ListNode* tail = dummy;

        for (int sum : sums) {

            tail->next = new ListNode(sum);
            tail = tail->next;
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {

    public ListNode mergeNodes(ListNode head) {

        // Step 1: Collect all segments between zeros
        List<List<Integer>> segments = new ArrayList<>();
        List<Integer> currentSegment = new ArrayList<>();

        ListNode current = head;

        while (current != null) {

            if (current.val == 0) {

                if (!currentSegment.isEmpty()) {
                    segments.add(new ArrayList<>(currentSegment));
                    currentSegment.clear();
                }

            } else {
                currentSegment.add(current.val);
            }

            current = current.next;
        }

        // Step 2: Calculate sums for each segment
        List<Integer> sums = new ArrayList<>();

        for (List<Integer> segment : segments) {

            int sum = 0;

            for (int val : segment) {
                sum += val;
            }

            sums.add(sum);
        }

        // Step 3: Build new linked list
        if (sums.isEmpty()) {
            return null;
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        for (int sum : sums) {

            tail.next = new ListNode(sum);
            tail = tail.next;
        }

        return dummy.next;
    }
}
```

### index.py Implementation

```index.py
class Solution:

    def mergeNodes(self, head):

        # Step 1: Collect all segments between zeros
        segments = []
        currentSegment = []

        current = head

        while current is not None:

            if current.val == 0:

                if currentSegment:
                    segments.append(currentSegment[:])
                    currentSegment.clear()

            else:
                currentSegment.append(current.val)

            current = current.next

        # Step 2: Calculate sums for each segment
        sums = []

        for segment in segments:

            total = 0

            for val in segment:
                total += val

            sums.append(total)

        # Step 3: Build new linked list
        if not sums:
            return None

        dummy = ListNode(0)
        tail = dummy

        for total in sums:

            tail.next = ListNode(total)
            tail = tail.next

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **ON)**

- We traverse the linked list once to collect all segments between zeros.
- This traversal takes: O(N).
- Next, we calculate the sum of each segment.
- Since the total number of elements across all segments is (N), this step also takes: O(N).
- After that, we build the result linked list using the calculated sums.
- In the worst case, creating the new linked list also takes: O(N).
- Combining all operations, the overall time complexity is: O(N).

#### Space Complexity: **O(1)**

- Extra lists such as **segments **and **sums **are used to store intermediate data.
- The **segments **list stores all non-zero values between zeros.
- The **sums **list stores the sum of each segment.
- In the worst case, all (N) non-zero nodes may be stored in these lists.
- Therefore, the auxiliary space complexity becomes: O(N).
- The output linked list is not counted as extra space because it is part of the required result.

## Optimal Approach

### Intuition

The optimal approach asks a simple question: “Why store everything?” We don’t need to remember every number between zeros — we only need their sum. So instead of collecting lists and then building the output, we can compute each segment’s sum as we go and immediately append a node for that sum. That lets us do everything in a single traversal and with constant extra space.

### **Algorithm**

1. Insert a dummy before head, as sometimes the zero-sum block starts right at the original head. If we don’t have a dummy, deleting such a block is messy. A dummy node before head makes every deletion uniform.
2. Now, Maintain a running prefix sum, a prefix sum captures the cumulative total from the start up to the current node. If two nodes have the same prefix sum, then everything between them must add to zero (because the total didn’t change).
3. Use a HashMap: prefixSum → latest Node, as we need to quickly check if the current prefix sum has been seen before. If not, we record the node where it occurred. If yes, that earlier node is the “start” of a zero-sum subsequence that ends at the current node.
4. When prefixSum repeats it means the section in between cancels out to zero.
5. Now we remove the zero-sum, as we do not just want to skip the nodes, we must also clear the prefix sums belonging to that block from the map.  Otherwise, state prefix sums deleted nodes could interfere with later matches. So, we unlink the block and remove all intermediate prefix sums.
6. Continue this until end, we repeat this process for every node. By the time we finish, all zero-sum subsequences are gone. Returning dummy.next gives the cleaned-up list.



### **Dry Run**

**//img**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* mergeNodes(ListNode* head) {

        ListNode* dummy = new ListNode(0);
        ListNode* tail = dummy;

        int sum = 0;

        while (head != nullptr) {

            if (head->val == 0 && sum > 0) {

                tail->next = new ListNode(sum);
                tail = tail->next;

                sum = 0;
            }

            sum += head->val;
            head = head->next;
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
class Solution {

    public ListNode mergeNodes(ListNode head) {

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        int sum = 0;

        while (head != null) {

            if (head.val == 0 && sum > 0) {

                tail.next = new ListNode(sum);
                tail = tail.next;

                sum = 0;
            }

            sum += head.val;
            head = head.next;
        }

        return dummy.next;
    }
}
```

### index.py Implementation

```index.py
class Solution:

    def mergeNodes(self, head):

        dummy = ListNode(0)
        tail = dummy

        total = 0

        while head is not None:

            if head.val == 0 and total > 0:

                tail.next = ListNode(total)
                tail = tail.next

                total = 0

            total += head.val
            head = head.next

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- We traverse the linked list only once using the **while (head != null)** loop.
- For each node, only constant-time operations are performed.
- These operations include checking conditions, updating the sum, creating a new node if needed, and moving the pointer forward.
- Since every node is processed exactly once, the total work is proportional to the number of nodes.
- Therefore, the overall time complexity is:0 ***O(n)***.

#### Space Complexity: **O(K)**

- Only a constant number of extra variables are used, such as **dummy**, **tail**, **sum**, and traversal pointers.
- No additional data structures are used during the traversal.
- The newly created output nodes are part of the required result and are not counted as auxiliary space.
- Therefore, the overall auxiliary space complexity is: ***O(1)***.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/merge-nodes-in-between-zeroes)*
