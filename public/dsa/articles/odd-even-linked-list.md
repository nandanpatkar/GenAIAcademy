# Odd-Even Linked List

> **Slug:** `odd-even-linked-list`  
> **Published:** 2026-07-09T07:52:08.075Z  
> **Updated:** 2026-07-09T07:52:08.083Z  
> **Keywords:** Odd Even Linked List Problem, Rearrange Linked List Odd Even  
> **Cover Image:** ![Odd-Even Linked List](https://cdn.codehelp.in/media/articles/1782497068870-eeb81485-WhatsApp_Image_2026-06-26_at_11.19.49_PM.jpeg)

**Description:** Learn how to rearrange a linked list by grouping odd and even indexed nodes using brute-force and optimal approaches.

---

## Problem Statement

Given a singly linked list, the task is to rearrange the nodes such that all nodes appearing at odd indices are grouped together followed by the nodes at even indices. Indices begin at 1, meaning that the first node in the list is considered at an odd index, the second node at an even index, and so on. 

Your goal is to return the head of the modified linked list after performing the rearrangement. The relative order should be maintained within the oddindexed nodes and even-indexed nodes as they appear in the original list.

 You must achieve this transformation using O(1) extra space and within O(n) time complexity, where n is the number of nodes in the linked list.

**Example**

**Input**: A linked list: 1 → 2 → 3 → 4 → 5 

**Output:** A reordered linked list: 1 → 3 → 5 → 2 → 4 

**Explanation:** In this example, all the nodes which are located at odd indices (1, 3, 5) are rearranged before the nodes at even indices (2, 4). 

Nodes at odd indices (1, 3, 5) are grouped, followed by even indices (2, 4).3The initial relative order of odd and even indexed nodes is maintained in the final rearranged list.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: **head = [1, 2, 3, 4, 5]
> **Output:**[1, 3, 5, 2, 4]
> **Explanation:** Nodes at odd indices (1, 3, 5) are grouped, followed by even indices (2, 4).

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input: **head = [2, 1, 3, 5, 6, 4, 7]
> **Output:**: [2, 3, 6, 7, 1, 5, 4]
> **Explanation: **Nodes at odd indices are grouped, followed by even indices in their original order.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input: **head = [1, 2]
> **Output**: [1, 2]
> **Explanation:**Only two nodes, no reordering required.

## Constraints

- The number of nodes in the list is in the range [0, 104].
- -106 <= Node.val <= , 106
- Must solve in O(1) extra space complexity and O(n) time complexity.

## Real-Life Analogy

Suppose, your linked list like a line of people waiting outside a movie theatre. The people are standing one behind another, each holding a ticket with a number that shows their position in the line (1st, 2nd, 3rd, and so on). 

Now, the theatre manager comes out and says: “Hey, I want to rearrange you all in a way that all the people standing at odd positions (1st, 3rd, 5th, …) should stand together in the front of the line, and after them, all the people standing at even positions (2nd, 4th, 6th, …) should stand together. But, nobody is allowed to break their original mini-group order. So if two friends were already standing in order within the odd positions, they must stay in that order. Same goes for the even ones.”

**What happens then? **

Everyone at odd positions just “link arms” with the next odd person, forming a continuous chain. Similarly, everyone at even positions link up behind one another. Finally, the last odd-positioned person simply reaches back and connects to the first even-positioned person, and the line is perfectly restructured. 

This way, the line is reorganized without pulling people out and reshuffling them individually, it is just about redirecting connections, while keeping the relative order intact. That’s exactly what happens in the linked list too: odd indexed nodes are grouped first, then even-indexed nodes, but their original order within the groups is preserved.

## Brute-Force Approach

### Intuition

We need to rearrange this linked list to group odd-positioned and evenpositioned nodes. Since we need to separate them, we should collect them separately. But we need to know which positions are odd/even, so we will first count the total length. 

Here's the problem - we can not directly jump to specific positions in a linked list like arrays. We have to start from head and walk step-by-step each time. For position 3: walk 2 steps. For position 5: walk 4 steps. This means repeating traversal work.

 As this We will create brand new nodes instead of rewiring existing pointers to avoid breaking the original list while traversing. This approach is methodical and foolproof, though not the most efficient.

### Algorithm

1. Handle base cases, like we check if the linked list is empty (head == null) or has only one node (head.next == null). If either is true, return head immediately because no rearrangement is required.
2. After this, we calculate the total length, Traverse the entire linked list once with a temporary pointer temp = head, incrementing a counter length until temp becomes null. This gives the total number of nodes.
3. Now, we collect all the odd-positioned nodes, as for each odd position pos = 1, 3, 5, ... <= length: start a pointer current = head and navigate from head to the node at position pos by advancing current pos-1 times. Create a new ListNode with current.val and append it to the odd chain using oddHead and oddTail. Initialize oddHead/oddTail on the first odd node and update oddTail as you append further odd nodes.
4. Next, Collect all even-positioned nodes as for each even position pos = 2, 4, 6, ... <= length: similarly set current = head and navigate pos-1 steps to reach that node. Create a new ListNode with current.val and append it to the even chain using evenHead and evenTail. Initialize evenHead/ evenTail on the first even node and update evenTail as you append further even nodes.
5. Connect odd chain to even chain, as after both chains are built, if oddTail is not null set oddTail.next = evenHead so the odd-positioned nodes are followed by the even-positioned nodes.
6. At last, Return oddHead as the head of the rearranged linked list (this is null only when the original list was empty).

### **Dry Run**





### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        int length = 0;
        ListNode* temp = head;

        while (temp != nullptr) {
            length++;
            temp = temp->next;
        }

        ListNode* oddHead = nullptr;
        ListNode* oddTail = nullptr;

        // Collect odd-positioned nodes
        for (int pos = 1; pos <= length; pos += 2) {
            ListNode* current = head;

            // Navigate to position pos
            for (int i = 1; i < pos; i++) {
                current = current->next;
            }

            if (oddHead == nullptr) {
                oddHead = oddTail = new ListNode(current->val);
            } else {
                oddTail->next = new ListNode(current->val);
                oddTail = oddTail->next;
            }
        }

        ListNode* evenHead = nullptr;
        ListNode* evenTail = nullptr;

        // Collect even-positioned nodes
        for (int pos = 2; pos <= length; pos += 2) {
            ListNode* current = head;

            // Navigate to position pos
            for (int i = 1; i < pos; i++) {
                current = current->next;
            }

            if (evenHead == nullptr) {
                evenHead = evenTail = new ListNode(current->val);
            } else {
                evenTail->next = new ListNode(current->val);
                evenTail = evenTail->next;
            }
        }

        // Attach even list after odd list
        if (oddTail != nullptr) {
            oddTail->next = evenHead;
        }

        return oddHead;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode oddEvenList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        int length = 0;
        ListNode temp = head;

        while (temp != null) {
            length++;
            temp = temp.next;
        }

        ListNode oddHead = null;
        ListNode oddTail = null;

        // Collect odd-positioned nodes
        for (int pos = 1; pos <= length; pos += 2) {
            ListNode current = head;

            // Navigate to position pos
            for (int i = 1; i < pos; i++) {
                current = current.next;
            }

            if (oddHead == null) {
                oddHead = oddTail = new ListNode(current.val);
            } else {
                oddTail.next = new ListNode(current.val);
                oddTail = oddTail.next;
            }
        }

        ListNode evenHead = null;
        ListNode evenTail = null;

        // Collect even-positioned nodes
        for (int pos = 2; pos <= length; pos += 2) {
            ListNode current = head;

            // Navigate to position pos
            for (int i = 1; i < pos; i++) {
                current = current.next;
            }

            if (evenHead == null) {
                evenHead = evenTail = new ListNode(current.val);
            } else {
                evenTail.next = new ListNode(current.val);
                evenTail = evenTail.next;
            }
        }

        // Attach even list after odd list
        if (oddTail != null) {
            oddTail.next = evenHead;
        }

        return oddHead;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def oddEvenList(self, head):
        if head is None or head.next is None:
            return head

        length = 0
        temp = head

        while temp is not None:
            length += 1
            temp = temp.next

        oddHead = None
        oddTail = None

        # Collect odd-positioned nodes
        for pos in range(1, length + 1, 2):
            current = head

            # Navigate to position pos
            for _ in range(1, pos):
                current = current.next

            if oddHead is None:
                oddHead = oddTail = ListNode(current.val)
            else:
                oddTail.next = ListNode(current.val)
                oddTail = oddTail.next

        evenHead = None
        evenTail = None

        # Collect even-positioned nodes
        for pos in range(2, length + 1, 2):
            current = head

            # Navigate to position pos
            for _ in range(1, pos):
                current = current.next

            if evenHead is None:
                evenHead = evenTail = ListNode(current.val)
            else:
                evenTail.next = ListNode(current.val)
                evenTail = evenTail.next

        # Attach even list after odd list
        if oddTail is not None:
            oddTail.next = evenHead

        return oddHead
```

### Complexity Analysis

#### Time Complexity: **O( **n2**)**

- Traversing the linked list to find its length takes **O(n)** time.
- Building the odd-positioned list requires multiple traversals from the head, taking **O(n²/2)** time.
- Building the even-positioned list also requires multiple traversals from the head, taking **O(n²/2)** time.
- Total time complexity: O(n) + O(n2/2) + O(n2/2).
- Hence by simplifying**,n****2**** .**

#### **Space Complexity: O(n)**

- A new node is created for every node in the original linked list while building the odd and even chains.
- Storing these newly created nodes requires **O(n)** extra space.
- Additional variables such as **oddHead, oddTail, evenHead, evenTail, current**, and **temp **use only **O(1)** space.
- No recursion is used, so there is no extra call stack space.
- Therefore, the overall space complexity is: ***O(n)***.

## Optimal Approach

### Intuition

We need to rearrange this linked list to group odd-positioned and even positioned nodes. Instead of collecting them separately, let's think about this different way, we can see a pattern here! In the original list, odd and even positioned nodes are already alternating. What if we don't need to create new nodes at all? What if we can just redirect the existing connections? Then we maintain two separate pointers like one for odd positions and one for even positions. As we move through the list, we can make each odd node skip over the even node and directly connect to the next odd node. Similarly, we can make each even node skip over the odd node and connect to the next even node.

### Algorithm

1. We first handle the base cases as if head == null or head.next == null return head immediately, a list with 0 or 1 node needs no rearrangement.
2. Next, initialize three pointers to maintain two running chains, odd = head (last node in the odd chain so far), even = head.next (last node in the even chain so far), and evenHead = even (save the start of the even chain so we can attach it later).
3. Now we perform the single-pass rewiring. Use the loop while (even != null && even.next != null) to advance a sliding window through the list. In each iteration:
4. 1. **Rewire the odd chain:** **odd.next = even.next**. Because even.next is the next odd-positioned node in the original list, so attach it after the current odd tail.
  2. **Advance the odd pointer: **odd = odd.next, as we move the odd tail to the newly appended odd node so subsequent odd nodes attach after it.
  3. **Rewire the even chain:** even.next = odd.next. After advancing odd, odd.next is the next even-positioned node; attach it after the current even tail.
  4. **Advance the even pointer:** even = even.next. Now, we move the even tail to the newly appended even node (may become null at the list end).
5. When the loop finishes, odd is the tail of the odd-position chain and evenHead is the head of the even-position chain. Connect them by setting odd.next = evenHead so all odd-positioned nodes are followed by the even-positioned nodes.
6. Finally, return head (original head remains the head of the rearranged list).

### Dry Run



### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {

        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        ListNode* odd = head;
        ListNode* even = head->next;
        ListNode* evenHead = even;

        while (even != nullptr && even->next != nullptr) {

            odd->next = even->next;
            odd = odd->next;

            even->next = odd->next;
            even = even->next;
        }

        odd->next = evenHead;

        return head;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode oddEvenList(ListNode head) {

        if (head == null || head.next == null) {
            return head;
        }

        ListNode odd = head;
        ListNode even = head.next;
        ListNode evenHead = even;

        while (even != null && even.next != null) {

            odd.next = even.next;
            odd = odd.next;

            even.next = odd.next;
            even = even.next;
        }

        odd.next = evenHead;

        return head;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def oddEvenList(self, head):

        if head is None or head.next is None:
            return head

        odd = head
        even = head.next
        evenHead = even

        while even is not None and even.next is not None:

            odd.next = even.next
            odd = odd.next

            even.next = odd.next
            even = even.next

        odd.next = evenHead

        return head
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The linked list is traversed only once using the **while **loop.
- In each iteration, one odd-positioned node and one even-positioned node are processed.
- Both **odd **and **even **pointers move forward after every iteration.
- Each node is visited exactly once during the traversal.
- Therefore, the overall time complexity is:*** O(n)***.

#### **Space Complexity: O(1)**

- Only three extra pointer variables are used: **odd**, **even **, and **even Head**.
- No new nodes are created during the process.
- The existing nodes are rearranged by updating their **next **pointers.
- No additional data structures are used.
- No recursion is involved, so there is no extra call stack space.
- Therefore, the overall space complexity is: *** O(1)***.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/odd-even-linked-list)*
