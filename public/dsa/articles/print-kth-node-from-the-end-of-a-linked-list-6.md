# Print Kth Node from the End of a Linked List

> **Slug:** `print-kth-node-from-the-end-of-a-linked-list-6`  
> **Published:** 2026-07-09T07:47:19.080Z  
> **Updated:** 2026-07-09T07:47:19.086Z  
> **Keywords:** Print Kth Node from the End of a Linked List, LinkedList, Kth Node  
> **Cover Image:** ![Print Kth Node from the End of a Linked List](https://cdn.codehelp.in/media/articles/1783583048747-090c92cb-_Print_Kth_Node_.png)

**Description:** Learn How to Print the Kth Node from the End of a Linked List, Brute Force and Optimal Approach with Dry Run.

---

## Problem Statement

Given a singly linked list, your task is to find the kth node from the end of the list. The linked list is indexed from the end, meaning the last node is 1, the second to last is 2, and so on up to the length of the list. Your goal is to determine the value of this node using an efficient strategy that involves only a single traversal of the list.

> [!NOTE]
> **INFO**
> Example 1
> Consider the linked list: 1 -> 2 -> 3 -> 4 -> 5. If you need to find the 2nd node from the end:
> 
> **Input:** k = 2 
> **Output:** 4
> **Explanation: **Here, the 2nd node from the end is 4.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**:list = [10, 20, 30, 40], k = 1
> 
> **Output:** 40
> **Explanation: **The last node is 40.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:** list = [5, 10, 15, 20, 25, 30], k = 6
> 
> **Output:** 5
> **Explanation: **The 6th node from the end is the first node: 5.

## Constraints

- 1 <= k <= length of the list <= 100
- 1000 <= Node.val <= 1000
- Assume k is always valid for the length of the list.

## Real-Life Analogy

Imagine you are watching a long parade passing by on a single road. The people in the parade are walking in a straight line, one after another. You’re standing at the starting point, so you see everyone enter, but you don’t know how many people are in total until the parade ends.

Now, suppose your friend asks:* "Can you tell me who is the 5th person from the end of the parade?"*

At first, this feels tricky. You can’t just count backward because you don’t know when the parade will end.

Here’s what you do instead:

- You bring along two friends with you (two pointers).
- First, you send **Friend A** to follow the parade, and you tell **Friend B** to wait.
- After **Friend A** has walked ahead by exactly *k* people, you tell **Friend B** to start walking too.
- From this point on, both **Friend A** and **Friend B** walk together, step by step.
- When **Friend A** finally reaches the very end of the parade, **Friend B** will be standing right at the person who is the *kth from the end*.

This way, you never had to walk the parade twice or rewind it. By cleverly staggering the start of the two friends, you found the exact person your friend wanted, just like finding the kth node from the end of a linked list in one traversal.

## Brute-Force Approach

### Intuition

The straightforward approach is to first traverse the entire linked list to calculate its total length, then traverse again to find the kth node from the end. Since we cannot directly access nodes by index in a linked list (unlike arrays), we need to walk step-by-step from the head.
The kth node from the end is actually the (length - k + 1)th node from the beginning. For example, in a list of 5 nodes, the 2nd node from the end is the (5 - 2 + 1) = 4th node from the beginning.

### **Algorithms**

1. Firstly, we handle the base cases. If the linked list is empty (head == null), then there is no node to return, so we immediately return -1 or handle it as appropriate.
2. Next, we calculate the total length of the linked list. To do this, we traverse the list once using a temporary pointer temp = head, incrementing a counter length until temp becomes null. This traversal gives us the total number of nodes present in the list.
3. Once the length is known, we determine the position of the required node from the beginning. Since the kth node from the end is equivalent to the (length - k + 1)th node from the start, we compute this value. If this position turns out to be invalid (for example, less than 1 or greater than the length of the list), we return -1.
4. After verifying that the position is valid, we start another traversal from the head of the list with a pointer current = head. We then move forward (length - k) steps to reach the target node.
5. Finally, we return the value stored in this target node, which represents the kth node from the end of the linked list.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int kthNodeFromEnd(ListNode* head, int k) {

        if (head == nullptr) {
            return -1;
        }

        // Step 1: Calculate total length
        int length = 0;
        ListNode* temp = head;

        while (temp != nullptr) {
            length++;
            temp = temp->next;
        }

        // Step 2: Check if k is valid
        if (k > length) {
            return -1;
        }

        // Step 3: Find kth node from end
        ListNode* current = head;
        int stepsToTarget = length - k;

        for (int i = 0; i < stepsToTarget; i++) {
            current = current->next;
        }

        // Step 4: Return the value
        return current->val;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public int kthNodeFromEnd(ListNode head, int k) {
        if (head == null) return -1;
        
        // Step 1: Calculate total length
        int length = 0;
        ListNode temp = head;
        while (temp != null) {
            length++;
            temp = temp.next;
        }
        
        // Step 2: Check if k is valid
        if (k > length) return -1;
        
        // Step 3: Find (length - k + 1)th node from beginning
        // which is same as kth node from end
        ListNode current = head;
        int stepsToTarget = length - k;
        for (int i = 0; i < stepsToTarget; i++) {
            current = current.next;
        }
        
        // Step 4: Return the value
        return current.val;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def kthNodeFromEnd(self, head, k):

        if head is None:
            return -1

        # Step 1: Calculate total length
        length = 0
        temp = head

        while temp is not None:
            length += 1
            temp = temp.next

        # Step 2: Check if k is valid
        if k > length:
            return -1

        # Step 3: Find kth node from end
        current = head
        steps_to_target = length - k

        for _ in range(steps_to_target):
            current = current.next

        # Step 4: Return the value
        return current.val
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm performs two traversals of the linked list.
- In the first traversal, the total length of the list is calculated by visiting each node once → **O(N)**.
- In the second traversal, we move from the head to the target node → **O(N - K)** in the worst case.
- Both traversals are linear in nature.
- Therefore, the total time complexity is:
**O(N) + O(N - K) = O(N)**.
- This is optimal because finding the kth node from the end requires processing most or all nodes at least once.

#### **Space Complexity: O(1)**

- Only a constant amount of extra space is used.
- Pointer variables such as **temp **and **current **require **O(1)** space.
- Integer variables like **length **and **stepsToTarget **also use constant space.
- No extra data structures are used.
- No recursion is involved, so no additional call stack space is required.
- Therefore, the overall space complexity is **O(1)**.

## Optimal Approach

### Intuition

Instead of making two separate traversals, we can find the kth node from the end in a single pass using the **two-pointer technique** (also known as the "runner" or "sliding window" approach).
The key insight is to maintain a gap of exactly k nodes between two pointers. We first move the first pointer k steps ahead, then move both pointers together. When the first pointer reaches the end (null), the second pointer will be exactly at the kth position from the end.

This works because if there's a gap of k nodes between the pointers, and the first pointer is at the end, then the second pointer must be k positions back from the end.

### **Algorithm**

1. Firstly, we handle the base cases. If the linked list is empty (head == null), then there is no node to return, so we immediately return -1.
2. Next, we initialize two pointers, first = head and second = head, both starting from the beginning of the list.
3. After initialization, we create a gap of k nodes between the two pointers. To do this, we move the first pointer exactly k steps ahead. If the first pointer becomes null before completing k steps, it indicates that k is larger than the length of the list, and in such a case, we return -1.
4. Once the gap is established, we move both the first and second pointers together, one step at a time, until the first pointer reaches the end of the list (null). At this point, the second pointer will be positioned at the kth node from the end.
5. Finally, we return the value of the node pointed to by the second pointer, which is our required result.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int kthNodeFromEnd(ListNode* head, int k) {

        if (head == nullptr) {
            return -1;
        }

        ListNode* first = head;
        ListNode* second = head;

        // Move first pointer k steps ahead
        for (int i = 0; i < k; i++) {

            if (first == nullptr) {
                return -1; // k is larger than list length
            }

            first = first->next;
        }

        // Move both pointers until first reaches end
        while (first != nullptr) {
            first = first->next;
            second = second->next;
        }

        // second now points to kth node from end
        return second->val;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public int kthNodeFromEnd(ListNode head, int k) {
        if (head == null) return -1;
        
        ListNode first = head;
        ListNode second = head;
        
        // Move first pointer k steps ahead
        for (int i = 0; i < k; i++) {
            if (first == null) return -1; // k is larger than list length
            first = first.next;
        }
        
        // Move both pointers until first reaches end
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        
        // second now points to kth node from end
        return second.val;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def kthNodeFromEnd(self, head, k):

        if head is None:
            return -1

        first = head
        second = head

        # Move first pointer k steps ahead
        for _ in range(k):
            if first is None:
                return -1  # k is larger than list length

            first = first.next

        # Move both pointers until first reaches end
        while first is not None:
            first = first.next
            second = second.next

        # second now points to kth node from end
        return second.val
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm uses a single traversal of the linked list.
- In the first phase, the **first **pointer is moved **k** steps ahead → **O(K)**.
- In the second phase, both **first **and **second **pointers move together until **first **reaches the end → **O(N - K)**.
- Each node is visited at most once during the traversal.
- Therefore, the total time complexity is:** O(K) + O(N - K) = O(N)**.
- This approach is optimal for finding the kth node from the end.

#### **Space Complexity: O(1)**

- The algorithm uses only a constant amount of extra space.
- Two pointer variables, **first **and **second**, are used → **O(1)** space.
- An integer counter **i **also requires constant space.
- No additional data structures are created.
- No recursion is used, so no extra call stack space is required.
- Therefore, the overall space complexity is **O(1)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/print-kth-node-from-the-end-of-a-linked-list-6)*
