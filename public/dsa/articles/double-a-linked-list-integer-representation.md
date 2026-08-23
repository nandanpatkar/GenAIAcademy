# Double a Linked List Integer Representation

> **Slug:** `double-a-linked-list-integer-representation`  
> **Published:** 2026-07-09T09:14:20.401Z  
> **Updated:** 2026-07-09T09:14:20.407Z  
> **Keywords:** Double a Linked List Integer Representation, Linked List  
> **Cover Image:** ![Double a Linked List Integer Representation](6a4f65232e81bcf652787536)

**Description:** Learn How to Double a Linked List Integer Representation – Brute Force and Optimal Approach with Dry Run (C++, Java, Python)

---

## Problem Statement

Given a singly linked list, where each node contains a single digit of a non-negative integer in reverse order, return the head of a new linked list formed by doubling the integer represented by the linked list.

### **Problem Description**

The linked list you are given consists of nodes where each node contains one digit of a non-negative integer. The digits are stored in reverse order, meaning that the least significant digit appears first.

Your task is to double the integer represented by this linked list and return a new linked list representing this doubled value, maintaining the reverse order of the digits.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: **head = [1, 2, 3]
> **Output:** [2, 4, 6]
> **Explanation:**  Doubling the integer representation yields [2, 4, 6].

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** head = [9, 9, 9]
> **Output::** [1, 9, 9, 8]
> **Explanation: **Doubling the integer representation yields [1, 9, 9, 8].

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input: **head = [0]
> **Output:** [0]
> **Explanation:**  Doubling the integer representation yields [0].

## Real-Life Analogy

In a busy bakery, the cashier maintains the daily sales record in a very particular way. Instead of writing the amount in the usual left-to-right order, she writes it in reverse.
For example, if the bakery sold items worth **521 rupees**, she notes it down as ** 1 → 2 → 5**. This is her quirky system, but it works because she always writes digits starting from the smallest place value first.
One evening, the bakery owner announces a special “Party Day” whatever the sales amount is, they will match it and donate the same amount to charity.

Now the cashier has an interesting task as she must calculate **double** the recorded sales, but still keep the digits in her reverse style.
She starts from the smallest digit (the front of her record), doubles it, and if the result goes above 9, she carries the extra to the next digit. Step by step, she goes through the entire chain of digits as multiplying, carrying, and recording the new values.

At the end, she has a brand-new register a doubled sales record, written in the same reverse order. Just like before, the smallest digit leads the list, followed by the rest, all neatly linked together.

So, the cashier’s reversed register of sales is like the linked list, and her process of doubling with careful carryovers is exactly how we double the number stored in a linked list in reverse order.

## Brute-Force Approach

### Intuition

The digits are given in reverse order, meaning the least significant digit comes first. To double the number correctly, we need to process it from the most significant digit. So, we first reverse the linked list. Then, moving left to right, we double each digit, keeping track of any carry just like we do in normal arithmetic. If a carry remains at the end, we add a new digit. Finally, we reverse the list again to restore the original format.

### **Algorithm**

1. Firstly we reverse the linked list. Since digits are stored in reverse order (least significant digit first), reversing puts the most significant digit at the head. This helps us process digits in natural left-to-right order while handling carry properly.

2. Now, we traverse the reversed list and double each digit**.** For every node, calculate digit * 2 + carry. This simulates manual multiplication digit by digit, ensuring carry is propagated correctly.

3. Create new nodes for the doubled digits. We store the result digits in a new list so the original input remains unchanged. Each digit after % 10 becomes a node, making the linked list representation consistent.

4. If a carry remains after the last node (e.g., doubling 999), we must create an extra node to store it. This ensures correctness for all edge cases.

5. At last, we reverse the result list back, Since we initially reversed the input, the result list is also in reversed order. Reversing it back restores the required format: least significant digit at the head.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class ListNode {
public:
    int val;
    ListNode* next;

    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* doubleIt(ListNode* head) {
        ListNode* dummy = new ListNode(0);
        ListNode* current = dummy;
        int carry = 0;
        ListNode* prev = nullptr;

        // Reverse the linked list
        while (head != nullptr) {
            ListNode* nextNode = head->next;
            head->next = prev;
            prev = head;
            head = nextNode;
        }

        head = prev; // head now points to reversed list

        // Double each digit
        while (head != nullptr) {
            int doubled = head->val * 2 + carry;
            carry = doubled / 10;

            current->next = new ListNode(doubled % 10);
            current = current->next;

            head = head->next;
        }

        // Add remaining carry if exists
        if (carry != 0) {
            current->next = new ListNode(carry);
        }

        // Reverse the result list
        ListNode* doubledList = dummy->next;
        prev = nullptr;

        while (doubledList != nullptr) {
            ListNode* nextNode = doubledList->next;
            doubledList->next = prev;
            prev = doubledList;
            doubledList = nextNode;
        }

        return prev;
    }
};
```

### index.java Implementation

```index.java
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
class Solution {
    public ListNode doubleIt(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;
        ListNode prev = null;
        while (head != null) {
            ListNode nextNode = head.next;
            head.next = prev;
            prev = head;
            head = nextNode;
        }
        head = prev;  // head now points to the reversed list
        while (head != null) {
            int doubled = head.val * 2 + carry;
            carry = doubled / 10;
            current.next = new ListNode(doubled % 10);
            current = current.next;
            head = head.next;
        }
        if (carry != 0) {
            current.next = new ListNode(carry);
        }
        ListNode doubledList = dummy.next;
        prev = null;
        while (doubledList != null) {
            ListNode nextNode = doubledList.next;
            doubledList.next = prev;
            prev = doubledList;
            doubledList = nextNode;
        }
        return prev;
    }
}
```

### index.py Implementation

```index.py
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def doubleIt(self, head):
        dummy = ListNode(0)
        current = dummy
        carry = 0
        prev = None

        # Reverse the linked list
        while head:
            next_node = head.next
            head.next = prev
            prev = head
            head = next_node

        head = prev  # head now points to reversed list

        # Double each digit
        while head:
            doubled = head.val * 2 + carry
            carry = doubled // 10

            current.next = ListNode(doubled % 10)
            current = current.next

            head = head.next

        # Add remaining carry if exists
        if carry != 0:
            current.next = ListNode(carry)

        # Reverse the result list
        doubled_list = dummy.next
        prev = None

        while doubled_list:
            next_node = doubled_list.next
            doubled_list.next = prev
            prev = doubled_list
            doubled_list = next_node

        return prev
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- First, we reverse the linked list by visiting all **n** nodes once → **O(n)**.
- Next, we traverse the reversed list to double each digit and handle the carry → **O(n)**.
- If a carry remains after processing all nodes, we add one extra node → **O(1)**.
- Finally, we reverse the resulting list again to restore the original order → **O(n)**.
- Total time complexity:** O(n) + O(n) + O(1) + O(n)**
- Removing constants in Big-O notation, the overall time complexity becomes:** O(n)**.

### **Space Complexity: O(N)**

- We create a new linked list to store the doubled number.
- For every digit in the input list, one new node is created → **n nodes**.
- If an extra carry remains at the end, one additional node may be created → **1 extra node**.
- Therefore, the total number of nodes created is at most **n + 1**.
- Ignoring constants in Big-O notation, the overall space complexity becomes:** O(n)**.

## Optimal Approach

### Intuition

For optimal solution, The list gives digits **least-significant first** (reverse order). Doubling a number is performed from least-significant digit to most-significant, carrying any overflow to the next digit. That means we can process the list **left → right once**, maintaining a single carry variable. For each node we compute **sum = node.val * 2 + carry**, write **sum % 10** into the node (or a new node), and **set carry = sum / 10**. Any leftover carry after the last node becomes a new most-significant digit.

### **Algorithm**

1. Reverse the linked list, Since the input digits are stored in **forward order** (most significant digit at the head), doubling directly is tricky because we need to handle carry starting from the least significant digit.
Reversing the list makes the **least significant digit come first**, so we can process digits naturally with carry propagation in a single pass.

2. Now, Traverse the reversed list and double each digit → For each node, compute: **sum = node.val * 2 + carry.**

- 1. The new digit is **sum % 10.**
  2. The updated carry is **sum / 10**. This simulates manual multiplication digit-by-digit while ensuring carry flows correctly across the digits.

3. Next, Append carry if needed, as If a non-zero carry remains after the last digit, add a new node with that carry. This ensures numbers like 999 correctly become 1998. 
4. Reverse the list again. After doubling, the result is still in **reversed order**. Reversing the list back restores the digits to **forward order (MSB-first)**, consistent with the input format.

### **Code**

### index.cpp Implementation

```index.cpp
class ListNode {
public:
    int val;
    ListNode* next;

    ListNode() : val(0), next(nullptr) {}

    ListNode(int val) {
        this->val = val;
        this->next = nullptr;
    }

    ListNode(int val, ListNode* next) {
        this->val = val;
        this->next = next;
    }
};

class Solution {
private:
    ListNode* reverse(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;

        while (curr != nullptr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }

        return prev;
    }

    ListNode* doubleLSBFirst(ListNode* head) {
        if (head == nullptr) return nullptr;

        ListNode* curr = head;
        ListNode* tail = nullptr;
        int carry = 0;

        while (curr != nullptr) {
            int sum = curr->val * 2 + carry;

            curr->val = sum % 10;
            carry = sum / 10;

            tail = curr;
            curr = curr->next;
        }

        if (carry > 0) {
            tail->next = new ListNode(carry);
        }

        return head;
    }

public:
    ListNode* doubleItForwardOrder(ListNode* head) {
        if (head == nullptr) return nullptr;

        ListNode* rev = reverse(head);

        rev = doubleLSBFirst(rev);

        return reverse(rev);
    }
};
```

### index.java Implementation

```index.java
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) {
        this.val = val;
    }
    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}
class Solution {
    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;

        while (curr != null) {
            ListNode nxt = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
    private ListNode doubleLSBFirst(ListNode head) {
        if (head == null) return null;
        ListNode curr = head, tail = null;
        int carry = 0;
        while (curr != null) {
            int sum = curr.val * 2 + carry;
            curr.val = sum % 10;
            carry = sum / 10;
            tail = curr;
            curr = curr.next;
        }
        if (carry > 0) {
            tail.next = new ListNode(carry);
        }
        return head;
    }
    public ListNode doubleItForwardOrder(ListNode head) {
        if (head == null) return null;
        ListNode rev = reverse(head);
        rev = doubleLSBFirst(rev);
        return reverse(rev);
    }
}
```

### index.py Implementation

```index.py
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:

    def reverse(self, head):
        prev = None
        curr = head

        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        return prev

    def doubleLSBFirst(self, head):
        if head is None:
            return None

        curr = head
        tail = None
        carry = 0

        while curr:
            total = curr.val * 2 + carry
            curr.val = total % 10
            carry = total // 10

            tail = curr
            curr = curr.next

        if carry > 0:
            tail.next = ListNode(carry)

        return head

    def doubleItForwardOrder(self, head):
        if head is None:
            return None

        rev = self.reverse(head)
        rev = self.doubleLSBFirst(rev)

        return self.reverse(rev)
```

### Complexity Analysis

#### Time Complexity: **O( N)**

- First, we reverse the linked list by traversing all** n** nodes once → **O(n)**.
- Next, we traverse the reversed list again to double each digit and handle the carry → **O(n)**.
- If a carry remains after processing all digits, we add one extra node → **O(1)**.
- Finally, we reverse the list again to restore the required forward order → **O(n)**.
- Total time complexity:** O(n) + O(n) + O(1) + O(n)**
- Ignoring constants in Big-O notation, the overall time complexity becomes:** O(n)**.

#### **Space Complexity:***** *****O(1)**

- We use only a constant number of extra variables such as **prev, curr, tail**, and **carry **→ **O(1)** space.
- At most, one extra node is created if a leftover carry remains after doubling → **O(1)** space.
- No additional arrays, lists, stacks, or other data structures proportional to `n` are used.
- Therefore, the auxiliary space complexity remains:** O(1)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/double-a-linked-list-integer-representation)*
