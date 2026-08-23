# Flatten a Multilevel Doubly Linked List

> **Slug:** `check`  
> **Published:** 2026-07-10T16:38:53.952Z  
> **Updated:** 2026-07-10T16:38:53.959Z  
> **Keywords:** Flattern a Multilevel Doubly Linked List, Multilevel Doubly Linkedlist, Linked list, Doubly Linked list  
> **Cover Image:** ![Flatten a Multilevel Doubly Linked List](6a511ff9f5904fb07752e960)

**Description:** Learn how to flatten a multilevel doubly linked list using an efficient approach, with examples, explanation, code implementation.

---

## Problem Statement

You are given a doubly linked list where, in addition to the `next` and `prev` pointers, some nodes may also have a `child` pointer. This `child` pointer could point to the head of a separate doubly linked list. These child lists themselves may have nodes with their own children, forming a multilevel data structure.

Your task is to **flatten** the list so that all nodes appear in a single-level, doubly linked list. You should connect all nodes from the child lists into the main list.

Specifically, if you encounter a node `x` with a `child` list, you must insert the entire child list between node `x` and `x.next`. The `child` pointers in the final flattened list should all be `null`.

The nodes should be ordered as if you were doing a pre-order traversal of the multilevel structure.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: ** Multilevel list with 7 nodes.
> **Output:**  4 92 45 83 22 47 80
> **Explanation: **List flattened pre-order.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**Multilevel list with 16 nodes.
> **Output:**48 52 93 46 28 13 59 50 88 51 75 96 6 27 92 56
> **Explanation:  **List flattened pre-order.

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

    Node* solve(Node* head) {

        if (!head) return NULL;

        Node* it = head;
        Node* tail = head;

        while (it) {

            Node* nextNode = it->next;

            if (it->child) {

                Node* childHead = it->child;
                Node* childTail = solve(childHead);

                // Attach child list
                it->next = childHead;
                childHead->prev = it;

                // Connect child tail with next node
                childTail->next = nextNode;

                if (nextNode)
                    nextNode->prev = childTail;

                it->child = NULL;

                tail = childTail;
            }
            else {
                tail = it;
            }

            it = nextNode;
        }

        return tail;
    }

    Node* flatten(Node* head) {

        solve(head);
        return head;
    }
};
```

### index.java Implementation

```index.java
class Solution {

    public Node solve(Node head) {

        if (head == null)
            return null;

        Node it = head;
        Node tail = head;

        while (it != null) {

            Node nextNode = it.next;

            if (it.child != null) {

                Node childHead = it.child;
                Node childTail = solve(childHead);

                // Attach child list
                it.next = childHead;
                childHead.prev = it;

                // Connect child tail with next node
                childTail.next = nextNode;

                if (nextNode != null)
                    nextNode.prev = childTail;

                it.child = null;

                tail = childTail;
            }
            else {
                tail = it;
            }

            it = nextNode;
        }

        return tail;
    }

    public Node flatten(Node head) {

        solve(head);
        return head;
    }
}
```

### index.py Implementation

```index.py
class Solution:

    def solve(self, head):

        if not head:
            return None

        it = head
        tail = head

        while it:

            nextNode = it.next

            if it.child:

                childHead = it.child
                childTail = self.solve(childHead)

                # Attach child list
                it.next = childHead
                childHead.prev = it

                # Connect child tail with next node
                childTail.next = nextNode

                if nextNode:
                    nextNode.prev = childTail

                it.child = None

                tail = childTail

            else:
                tail = it

            it = nextNode

        return tail

    def flatten(self, head):

        self.solve(head)
        return head
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
*Extracted from CodeHelp (https://www.codehelp.in/articles/check)*
