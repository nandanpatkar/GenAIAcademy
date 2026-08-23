#  Partition List

> **Slug:** `partition-list`  
> **Published:** 2026-07-09T17:39:56.938Z  
> **Updated:** 2026-07-09T17:39:56.945Z  
> **Keywords:** Partition List, Linked list  
> **Cover Image:** ![ Partition List](6a4fdcac2e81bcf65278766a)

**Description:** Learn how to partition a linked list around a given value using an efficient approach, with examples, explanation, and code implementation.

---

## Problem Statement

You are given the **head **of a singly linked list and a pivot value** x**. Your task is to partition the list such that all nodes with values **less than** ** x **come before all nodes with values **greater than or equal to** ** x.**

A critical requirement is that you must **preserve the original relative order** of the nodes within each of the two partitions.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: **head = [1,4,3,2,5,2], x = 3
> **Output:**  [1,2,2,4,3,5]
> **Explanation: **Nodes 1, 2, and 2 are less than 3 and appear first, in their original order. Nodes 4, 3, and 5 are greater than or equal to 3 and appear next, also in their original order.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** head = [2,1], x = 2
> **Output:** [1,2]
> **Explanation:  **Node 1 is less than 2. Node 2 is greater than or equal to 2.

### Constraints

- 1 <= nums.length <= 100
- 0 <= nums[i] <= 1000

## Real-Life Analogy

Imagine you are organizing people outside a movie theater.

There is a long queue of people waiting to enter, and the manager announces a simple rule:

- People younger than **x years** should stand in the **front section**.
- People aged **x or older** should stand in the **back section**.

But there is one very important condition: 

- The order among people must remain exactly the same as they originally arrived.

So if three younger people arrived in the order:
**Aman → Riya → Kunal**,
they must still remain in that same order in the front section.

Similarly, if older people arrived as:
**Neha → Arjun → Simran**,
their order in the back section cannot change either.

The organizer walks through the queue one person at a time:

- If a person’s age is less than `x`, they are guided into the **front line**.
- Otherwise, they are guided into the **back line**.

At the end, both lines are connected together:
first the younger group, then the older group.

So:

- The original queue represents the **linked list**.
- The age limit `x` represents the **pivot value**.
- The two separate lines represent the **two partitions**.
- Preserving arrival order is exactly like maintaining the **relative order of nodes** in the linked list.

This is precisely how the **Partition List** problem works.

## Brute-Force Approach

### Intuition

A simple approach is to store the node values into two separate arrays or lists: one for values smaller than `x`,and another for values greater than or equal to `x`. After traversing the linked list and storing the values, we overwrite the original linked list by first filling values from the smaller list, followed by values from the greater/equal list.

This approach is easy to implement and maintains the relative order of nodes, but it requires extra space to store the values separately.

### **Algorithm**

1. Traverse the linked list once and divide the node values into two separate arrays: one array stores all values smaller than `x`, and another array stores all values greater than or equal to `x`.
2. After storing all values, traverse the linked list again from the beginning.
3. First, overwrite the linked list nodes using the values stored in the smaller-values array.
4. Once all smaller values are placed, continue overwriting the remaining nodes using the values stored in the greater/equal-values array.
5. In this way, all smaller values appear before the greater/equal values while maintaining their original relative order.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* partition(ListNode* head, int x) {

        vector<int> small;
        vector<int> large;

        ListNode* temp = head;

        while (temp) {

            if (temp->val < x) {
                small.push_back(temp->val);
            } else {
                large.push_back(temp->val);
            }

            temp = temp->next;
        }

        temp = head;

        for (int val : small) {
            temp->val = val;
            temp = temp->next;
        }

        for (int val : large) {
            temp->val = val;
            temp = temp->next;
        }

        return head;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode partition(ListNode head, int x) {

        List<Integer> small = new ArrayList<>();
        List<Integer> large = new ArrayList<>();

        ListNode temp = head;

        while (temp != null) {

            if (temp.val < x) {
                small.add(temp.val);
            } else {
                large.add(temp.val);
            }

            temp = temp.next;
        }

        temp = head;

        for (int val : small) {
            temp.val = val;
            temp = temp.next;
        }

        for (int val : large) {
            temp.val = val;
            temp = temp.next;
        }

        return head;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def partition(self, head: ListNode, x: int) -> ListNode:

        small = []
        large = []

        temp = head

        while temp:

            if temp.val < x:
                small.append(temp.val)
            else:
                large.append(temp.val)

            temp = temp.next

        temp = head

        for val in small:
            temp.val = val
            temp = temp.next

        for val in large:
            temp.val = val
            temp = temp.next

        return head
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- First traversal of the linked list to store values into two separate arrays → **O(N).**
- Second traversal of the linked list to overwrite node values → **O(N).**

### **Space Complexity: O(N )**

- Extra arrays are used to store node values smaller than `x` and greater than or equal to `x`.
- Therefore: **O(N).**

## Optimal Approach

### Intuition

A simple way to solve this problem is to create two separate linked lists, one list for nodes having values smaller than **x, **and another list for nodes having values greater than or equal to **x.** We traverse the original linked list once and place each node into its corresponding list based on its value. After processing all nodes, we connect the smaller-value list with the greater/equal-value list.

Since nodes are added in the same order as they appear in the original linked list, the relative order of nodes is preserved.

### **Algorithm**

1. Firstly, we create two separate dummy linked lists, one list (**fp**) to store nodes having values smaller than **x**,
and another list (s**p**) to store nodes having values greater than or equal to **x**.
2. Then, we traverse the original linked list once: if the current node value is smaller than **x**,
attach it to the first list. Otherwise, attach it to the second list.
3. After processing all nodes, connect the first list with the second list. Then make the last node point to **nullptr** to avoid any unwanted connection.
4. Finally, return the head of the first list as the answer.

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* partition(ListNode* head, int x) {

        ListNode* fp = new ListNode(-1);
        ListNode* sp = new ListNode(-1);

        auto fpTail = fp;
        auto spTail = sp;

        auto it = head;

        while (it) {

            if (it->val < x) {

                // First partition
                fpTail->next = it;
                fpTail = fpTail->next;

            } else {

                // Second partition
                spTail->next = it;
                spTail = spTail->next;
            }

            it = it->next;
        }

        // Connect both partitions
        fpTail->next = sp->next;

        // End the list properly
        spTail->next = nullptr;

        return fp->next;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode partition(ListNode head, int x) {

        ListNode fp = new ListNode(-1);
        ListNode sp = new ListNode(-1);

        ListNode fpTail = fp;
        ListNode spTail = sp;

        ListNode it = head;

        while (it != null) {

            if (it.val < x) {

                // First partition
                fpTail.next = it;
                fpTail = fpTail.next;

            } else {

                // Second partition
                spTail.next = it;
                spTail = spTail.next;
            }

            it = it.next;
        }

        // Connect both partitions
        fpTail.next = sp.next;

        // End the list properly
        spTail.next = null;

        return fp.next;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def partition(self, head: ListNode, x: int) -> ListNode:

        fp = ListNode(-1)
        sp = ListNode(-1)

        fpTail = fp
        spTail = sp

        it = head

        while it:

            if it.val < x:

                # First partition
                fpTail.next = it
                fpTail = fpTail.next

            else:

                # Second partition
                spTail.next = it
                spTail = spTail.next

            it = it.next

        # Connect both partitions
        fpTail.next = sp.next

        # End the list properly
        spTail.next = None

        return fp.next
```

### Complexity Analysis

#### Time Complexity: **O( N )**

- We traverse the linked list only once.
- Each node is visited exactly one time.
- Therefore, time complexity is:  O(N). where**, N =** number of nodes in linked list.

#### **Space Complexity:***** *****O(1)**

- No extra data structure proportional to **N** is used.
- Only a few pointer variables are used, Therefore: O(1).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/partition-list)*
