# Swap Nodes in Linked List

> **Slug:** `swap-nodes-in-linked-list-9`  
> **Published:** 2026-07-03T18:58:27.052Z  
> **Updated:** 2026-07-03T18:58:27.059Z  
> **Keywords:** Swapping Nodes in a Linked List, Linked List Two Pointer, Swap Kth Nodes  
> **Cover Image:** ![Swap Nodes in Linked List](6a48064618e7ea53cc9ad752)

**Description:** Swapping Nodes in a Linked List – Step-by-Step Explanation, Dry Run, Complexity Analysis, and Code (C++, Java, Python)

---

## Problem Statement

Given the head of a singly linked list and an integer k, your task is to return the head of the linked list after swapping the values of the kth node from the beginning and the kth node from the end. This operation should be performed without modifying the node structure, i.e., you should only swap the values of these nodes. The linked list is 1-indexed, meaning the position counting starts from 1.

**Example**
**Consider the linked list: **1 → 2 → 3 → 4 → 5 and k = 2. 
- The 2nd node from the beginning is 2.
- The 2nd node from the end is 4.
- After swapping the values of these nodes, the linked list becomes: 
**1 → 4 → 3 → 2 → 5**

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: ** head = [100, 200, 300], k = 1
> **Output:** [300, 200, 100]
> **Explanation:** The 1st node from the beginning and end are swapped.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**head = [1, 2, 3, 4, 5], k = 2
> **Output:**  [1, 4, 3, 2, 5]
> **Explanation: ** The 2nd node from the beginning and end are swapped.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input: head = [1, 2, 3, 4, 5], k = 3**
> **Output:** **[1, 2, 3, 4, 5]**
> **Explanation: **The 3rd node from the beginning and end are the same node.

## Constraints

- The number of nodes in the list is in the range [1, ].
- 0 < = Node.val <= 100
- 1 <= k <= n, where n is the number of nodes in the list.

## Real-Life Analogy

Imagine a queue of students waiting in line for lunch in the school cafeteria. Each student is holding a lunch tray with their meal. Now, the teacher comes and says, “The student who is **kth from the front** and the student who is **kth from the back** should exchange their lunch trays.”

The students themselves don’t move in the line—the order of the queue stays exactly the same. Only the meals on their trays are swapped. In the same way, in the linked list, we don’t rearrange the nodes; we just swap the values inside the kth node from the beginning and the kth node from the end.

## Brute-Force Approach

### Intuition

We need to swap values of two specific nodes: kth from beginning and kth from end. The straightforward approach is to first find the total length of the list, then calculate the positions of both nodes, traverse to find them, and finally swap their values. This requires multiple traversals, one for length calculation and separate traversals to locate each target node.

Since we can not directly jump to specific positions in a linked list like arrays, we have to start from head and walk step-by-step each time. For the kth node from beginning, we walk k-1 steps. For the kth node from end, we need to know the total length first, then walk (length-k) steps.

### Algorithm

1. We handle base cases, Check if the linked list is empty (head == null) or has only one node (head.next == null). If either is true, return head immediately because no swapping is required.
2. Now, When we traverse the entire linked list once with a temporary pointer temp = head, incrementing a counter length until temp becomes null. This gives the total number of nodes. Collect all odd-positioned nodes, For each odd position (1, 3, 5, ...), navigate from head to that position and create a new node with that value. Build the odd chain using oddHead and oddTail pointers.
3. We find the 4th node from beginning as start a pointer current = head and navigate from head to the kth node by advancing current exactly k-1 times. Store this node as kthFromBegin.
4. Now, we find kth node from end, as the kth node from end is actually the (length - k + 1)th node from the beginning. Start another pointer current = head and navigate (length - k) steps to reach this node. Store this node as kthFromEnd.
5. After finding out the first or last, now we swap their values, we simply exchanges the values, temp = kthFromBegin.val, kthFromBegin.val = kthFromEnd.val; kthFromEnd.val = temp.
6. At last, we return the original head as the structure remains unchanged.

### **Dry Run**



### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* swapNodes(ListNode* head, int k) {

        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Step 1: Calculate total length
        int length = 0;
        ListNode* temp = head;

        while (temp != nullptr) {
            length++;
            temp = temp->next;
        }

        // Step 2: Find kth node from beginning
        ListNode* kthFromBegin = head;

        for (int i = 1; i < k; i++) {
            kthFromBegin = kthFromBegin->next;
        }

        // Step 3: Find kth node from end
        ListNode* kthFromEnd = head;
        int stepsToKthFromEnd = length - k;

        for (int i = 0; i < stepsToKthFromEnd; i++) {
            kthFromEnd = kthFromEnd->next;
        }

        // Step 4: Swap values
        int tempVal = kthFromBegin->val;
        kthFromBegin->val = kthFromEnd->val;
        kthFromEnd->val = tempVal;

        return head;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode swapNodes(ListNode head, int k) {
        if (head == null || head.next == null) return head;
        
        // Step 1: Calculate total length
        int length = 0;
        ListNode temp = head;
        while (temp != null) {
            length++;
            temp = temp.next;
        }
        
        // Step 2: Find kth node from beginning
        ListNode kthFromBegin = head;
        for (int i = 1; i < k; i++) {
            kthFromBegin = kthFromBegin.next;
        }
        
        // Step 3: Find kth node from end
        ListNode kthFromEnd = head;
        int stepsToKthFromEnd = length - k;
        for (int i = 0; i < stepsToKthFromEnd; i++) {
            kthFromEnd = kthFromEnd.next;
        }
        
        // Step 4: Swap values
        int tempVal = kthFromBegin.val;
        kthFromBegin.val = kthFromEnd.val;
        kthFromEnd.val = tempVal;
        
        return head;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def swapNodes(self, head, k):

        if head is None or head.next is None:
            return head

        # Step 1: Calculate total length
        length = 0
        temp = head

        while temp is not None:
            length += 1
            temp = temp.next

        # Step 2: Find kth node from beginning
        kth_from_begin = head

        for _ in range(1, k):
            kth_from_begin = kth_from_begin.next

        # Step 3: Find kth node from end
        kth_from_end = head
        steps_to_kth_from_end = length - k

        for _ in range(steps_to_kth_from_end):
            kth_from_end = kth_from_end.next

        # Step 4: Swap values
        temp_val = kth_from_begin.val
        kth_from_begin.val = kth_from_end.val
        kth_from_end.val = temp_val

        return head
```

### Complexity Analysis

#### Time Complexity: **O( N)**

- The algorithm performs multiple traversals of the linked list.
- First, the entire list is traversed to calculate the total length → **O(N)**.
- Second, we traverse to find the kth node from the beginning → **O(K)**.
- Since **K ≤ N**, this becomes → **O(N)** in the worst case.
- Third, we traverse to find the kth node from the end → **O(N - K)**.
- Since **(N - K) ≤ N**, this also becomes → **O(N)** in the worst case.
- Therefore, the total time complexity is:
**O(N) + O(K) + O(N - K) = O(N)**.
- Even though up to **2N** nodes may be visited overall, the complexity remains linear.

#### **Space Complexity: O(1)**

- The algorithm uses only a constant amount of extra space.
- Pointer variables such as **temp, kthFromBegin**, and **kthFromEnd** require **O(1)** space.
- Integer variables like **length, stepsToKthFromEnd, tempVal**, and **i** also use constant space.
- No new nodes or extra data structures are created.
- No recursion is used, so no additional call stack space is required.
- Therefore, the overall space complexity is **O(1)**.

## Optimal Approach

### Intuition

Instead of making multiple traversals, we can find both target nodes in a single pass using a two-pointer technique. The key insight is that when we advance one pointer to the kth position, we can start moving a second pointer from the head. When the first pointer reaches the end, the second pointer will be exactly at the kth position from the end.

This is similar to finding the kth node from the end using the "runner" technique. We maintain a gap of k nodes between two pointers, so when the first pointer reaches the end, the second pointer is at the desired position from the end.

### Algorithm

1. Firstly, we check if the linked list is empty or has only one node. Return immediately if true.
2. Then Initialise, the pointer as set up first = head and second = head. Also, keep a reference kthFromBegin is equal to null to store the kth node from beginning.
3. Further, we move first pointer to kth position. And then Advance the first pointer exactly k-1 times. After this, first points to the kth node from beginning. By doing this we save this as kthFromBegin.
4. Now, Move both pointers together, and then we move both first and second pointers together until first.next becomes null. When this loop ends, second will be pointing to the kth node from the end.
5. Then, we swap the values to exchange the values between kthFromBegin and second (which is kthFromEnd).
6. At last, we return the result as original head.

### Dry Run



### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* swapNodes(ListNode* head, int k) {

        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        ListNode* first = head;
        ListNode* second = head;
        ListNode* kthFromBegin = nullptr;

        // Move first pointer to kth position
        for (int i = 1; i < k; i++) {
            first = first->next;
        }

        // Save kth node from beginning
        kthFromBegin = first;

        // Move both pointers until first reaches end
        while (first->next != nullptr) {
            first = first->next;
            second = second->next;
        }

        // Swap values
        int temp = kthFromBegin->val;
        kthFromBegin->val = second->val;
        second->val = temp;

        return head;
    }
};
```

### index.java Implementation

```index.java
class Solution {

    public ListNode swapNodes(ListNode head, int k) {

        // Edge case
        if (head == null || head.next == null) {
            return head;
        }

        ListNode first = head;
        ListNode second = head;
        ListNode kthFromBegin = null;

        // Step 1: Move first pointer to kth node
        for (int i = 1; i < k; i++) {
            first = first.next;
        }

        // Store kth node from beginning
        kthFromBegin = first;

        // Step 2: Move first to end
        // Move second simultaneously
        while (first.next != null) {
            first = first.next;
            second = second.next;
        }

        // Step 3: Swap values
        int temp = kthFromBegin.val;
        kthFromBegin.val = second.val;
        second.val = temp;

        return head;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def swapNodes(self, head, k):

        if head is None or head.next is None:
            return head

        first = head
        second = head
        kth_from_begin = None

        # Move first pointer to kth position
        for _ in range(1, k):
            first = first.next

        # Save kth node from beginning
        kth_from_begin = first

        # Move both pointers until first reaches end
        while first.next is not None:
            first = first.next
            second = second.next

        # Swap values
        temp = kth_from_begin.val
        kth_from_begin.val = second.val
        second.val = temp

        return head
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm uses the two-pointer technique in a single traversal.
- In the first phase, the **first **pointer is moved **(k - 1)** steps ahead to reach the kth node from the beginning → **O(K)**.
- During this phase, the **second **pointer remains at the head.
- The kth node from the beginning is stored in **kthfromBegin**.
- In the second phase, both **first **and **second **pointers move together until** first.next** becomes **null**.
- This phase takes **(N - K)** steps → **O(N - K)**.
- After completion, the **second **pointer points to the kth node from the end.
- Therefore, the total time complexity is:
**O(K) + O(N - K) = O(N)**.

#### **Space Complexity: O(1)**

- The algorithm uses only a constant amount of extra space.
- Pointer variables such as `first`, `second`, and `kthFromBegin` require **O(1)** space.
- Integer variables like `temp` and `i` also use constant space.
- No new nodes or extra data structures are created.
- No recursion is used, so no additional call stack space is required.
- Therefore, the overall space complexity is **O(1)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/swap-nodes-in-linked-list-9)*
