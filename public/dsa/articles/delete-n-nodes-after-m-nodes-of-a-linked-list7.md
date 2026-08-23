# Delete N Nodes after M Nodes of a Linked List

> **Slug:** `delete-n-nodes-after-m-nodes-of-a-linked-list7`  
> **Published:** 2026-06-26T18:05:23.826Z  
> **Updated:** 2026-06-26T18:05:23.834Z  
> **Keywords:** Delete N nodes after M nodes of a Linked List, Linked list  
> **Cover Image:** ![Delete N Nodes after M Nodes of a Linked List](6a3ebf4cc643b84ab4ce4b23)

**Description:** Learn how to skip M nodes and delete N nodes in a linked list. Explore brute-force and optimal in-place approaches with explanations.

---

## Problem Statement

You are provided with a singly linked list. The task is to modify this linked list in such a way that you start from the head of the list, skip the first 'm' nodes, and then delete the next 'n' nodes. You should repeat this process until you reach the end of the list.

For example, consider the linked list with elements [1, 2, 3, 4, 5, 6, 7, 8, 9], with m = 2 and n = 3. Perform the following steps:
Skip the first 2 nodes ([1, 2])
Delete the following 3 nodes ([3, 4, 5])
Skip the next 2 nodes ([6, 7])
Delete the next 3 nodes ([8, 9])

After these operations, the modified linked list should be [1, 2, 6, 7].

This problem tests your ability to manipulate linked list pointers and manage node deletion and retention carefully.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:**  **head = [1, 2, 3, 4, 5, 6, 7, 8, 9], m = 2** **n = 2**
> **Output:**  **[1, 2, 5, 6, 9]**
> **Explanation: **After skipping 2 nodes, delete the next 2 nodes, then repeat.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**  **head = [10, 20, 30, 40, 50], m = 1, n = 1**
> **Output:** **[10, 30, 50]**
> **Explanation:**Skip one node, delete one, and repeat the process.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**   **head = [1, 2, 3, 4, 5, 6, 7], m = 3, n = 3**
> **Output:**  **[1, 2, 3, 7]**
> **Explanation: ** Skip 3 nodes, delete the next 3 nodes, then repeat.

## Constraints

- 1 <=** length of linked list **<= 104
- 1 <= **data in each node** <= 105
- 0 <= **m, n **<= length of linked list

## Real-Life Analogy

Suppose, In a big corporate office, there is one coffee machine that everyone loves. But the office has made a very attractive rule to control usage:
First, **m employees** get their coffee normally.Then, the **next n employees** are told, “Sorry, no coffee for you today.” They must go back to their desks without coffee.This process repeats again and again until all employees have had their turn.

**Example: **
**Employees in Line = [1, 2, 3, 4, 5, 6, 7, 8, 9]**, **Rule = m = 2, n = 3**
**First Round at Coffee Machine **

- Employee 1 → gets coffee
- Employee 2 → gets coffee

Coffee drinkers = [1, 2]

*But the rule says: next 3 employees don’t get coffee.** *

- Employee 3 → denied
- Employee 4 → denied
- Employee 5 → denied

**Second Roud **

- Employee 6 → gets coffee
- Employee 7 → gets coffee

**Coffee drinkers = [1, 2, 6, 7]**

*Then again, next 3 denied: *

- Employee 8 → denied
- Employee 9 → denied  (only 2 left, but both go home empty-handed)

**Final Outcome: **
**The lucky coffee drinkers are: [1, 2, 6, 7]**

**Analogy Mapping to Linked List**

- **Employees in line** = Nodes in linked list.
- **Giving coffee to m employees** = Skipping m nodes (keeping them).
- **Denying coffee to n employees** = Deleting n nodes (removing them).
- **Repeating** = Loop until no employees are left.

**Why this story works**
Because you can clearly imagine:

- A long **queue** (linked list).
- Some employees **served** (kept).
- Others **denied** (deleted).
- A repeating **policy** (loop).

## Brute-Force Approach

### Intuition

Convert the linked list into a random-access array (or array of node references), run your selection/filter logic on the array to decide which elements to keep, then rebuild a brand-new linked list from the filtered results.

This turns pointer-heavy linked-list work into straightforward array indexing and a final linear reconstruction.

### **Algorithms**

1. We handle base cases first. Check if the linked list is empty (head == null) or has only one node (head.next == null), in either case there is nothing meaningful to remove or keep, so return head immediately. Also we check the rule parameters: if m <= 0 (keep zero nodes each cycle) then nothing should remain and you can return null immediately; if n == 0 (delete zero nodes each cycle) the list is unchanged so return head.
2. Next, convert the linked list to a random-access array. Start with current = head and traverse the list once, appending each node’s value into an ArrayList. When that single pass finishes you have values = [v0, v1, v2, ...] and you can access any position in O(1), which simplifies the skip-delete bookkeeping.
3. Now process the array with the skip-delete pattern using an index and a companion boolean array. Create keep = new boolean[values.size()] initialized to false, and set index = 0. While index < values.size() do the following in order: mark up to m elements to keep by setting keep[index], keep[index+1], ..., keep[index+m-1] = true, then advance the index by m and mark the next up-to-n elements as deleted (they remain false) by
simply advancing the index by n (again stopping at the end if needed). In code form the loop is conceptually while (index < len) { for (k=0; k<m && index<len; k++, index++) keep[index-1]=true; index += n; } — after the loop keep[i] tells you exactly which positions to preserve.
4. After marking, build the new linked list in a single pass over the values and keep arrays. Create a dummy node and a tail pointer initially at dummy. For each index i from 0 to values.size()-1, if keep[i] == true then create a fresh ListNode(values.get(i)) and append it: tail.next = newNode; tail = tail.next;. After the loop terminate the list by ensuring tail.next = null.
5. Finally, return dummy.next as the head of the reconstructed list. This approach turns all the pointer-heavy work into simple indexed operations and a final linear rebuild, you do one traversal to collect values, one indexed pass to decide which indices to keep, and one pass to reconstruct, clean, easy to reason about, and simple to implement.

### **Dry Run**





### **Code**

### index.cpp Implementation

```index.cpp
#include <vector>
using namespace std;

class Solution {
public:
    ListNode* linkdelete(ListNode* head, int n, int m) {

        if (head == nullptr) {
            return nullptr;
        }

        // Step 1: Convert linked list to array
        vector<int> values;
        ListNode* current = head;

        while (current != nullptr) {
            values.push_back(current->val);
            current = current->next;
        }

        int size = values.size();

        if (size == 0) {
            return nullptr;
        }

        // Step 2: Create boolean array
        // to mark nodes to keep
        vector<bool> keep(size, false);

        // Step 3: Apply skip-delete pattern
        int index = 0;

        while (index < size) {

            // Skip m nodes (mark as keep)
            for (int i = 0; i < m && index + i < size; i++) {
                keep[index + i] = true;
            }

            // Move index to delete section
            index += m;

            // Skip n nodes (delete them)
            index += n;
        }

        // Step 4: Build new linked list
        ListNode* dummy = new ListNode(0);
        ListNode* tail = dummy;

        for (int i = 0; i < size; i++) {

            if (keep[i]) {
                tail->next = new ListNode(values[i]);
                tail = tail->next;
            }
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;
class Solution {
    public ListNode linkdelete(ListNode head, int n, int m) {
        if (head == null) return null;
        
        // Step 1: Convert linked list to array
        List<Integer> values = new ArrayList<>();
        ListNode current = head;
        while (current != null) {
            values.add(current.val);
            current = current.next;
        }
        
        int size = values.size();
        if (size == 0) return null;
        
        // Step 2: Create boolean array to mark which nodes to keep
        boolean[] keep = new boolean[size];
        Arrays.fill(keep, false);
        
        // Step 3: Apply skip-delete pattern
        int index = 0;
        while (index < size) {
            // Skip m nodes (mark as keep)
            for (int i = 0; i < m && index + i < size; i++) {
                keep[index + i] = true;
            }
            
            // Move index to start of delete section
            index += m;
            
            // Skip n nodes (already false, so delete them)
            index += n;
        }
        
        // Step 4: Build new linked list from kept elements
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        
        for (int i = 0; i < size; i++) {
            if (keep[i]) {
                tail.next = new ListNode(values.get(i));
                tail = tail.next;
            }
        }
        
        return dummy.next;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def linkdelete(self, head, n, m):

        if head is None:
            return None

        # Step 1: Convert linked list to array
        values = []
        current = head

        while current is not None:
            values.append(current.val)
            current = current.next

        size = len(values)

        if size == 0:
            return None

        # Step 2: Create boolean array
        # to mark nodes to keep
        keep = [False] * size

        # Step 3: Apply skip-delete pattern
        index = 0

        while index < size:

            # Skip m nodes (mark as keep)
            for i in range(m):
                if index + i < size:
                    keep[index + i] = True

            # Move index to delete section
            index += m

            # Skip n nodes (delete them)
            index += n

        # Step 4: Build new linked list
        dummy = ListNode(0)
        tail = dummy

        for i in range(size):
            if keep[i]:
                tail.next = ListNode(values[i])
                tail = tail.next

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm performs three separate traversals.
- In the first traversal, the linked list is converted into an array → **O(N)**.
- In the second traversal, the keep flags are marked in the array → **O(N)**.
- In the third traversal, a new linked list is created from the filtered elements → **O(N)**.
- Therefore, the total time complexity is:
**O(N) + O(N) + O(N) = O(3N) = O(N)**.
- Although the complexity is linear, this approach is practically slower than an in-place solution because it requires multiple full traversals.

**Space Complexity: O(n)**

- The algorithm uses additional auxiliary data structures.
- The array/list storing node values requires **O(N)** space.
- The boolean array used for marking kept indices also requires **O(N)** space.
- The new linked list for retained elements requires **O(K)** space, where `K ≤ N`.
- Therefore, the total space complexity is:
**O(N) + O(N) + O(K) = O(N)**.
- This is less efficient than the optimal in-place approach, which uses only **O(1)** extra space.

## Optimal Approach

### Intuition

Instead of collecting all data, we traverse the linked list only once and modify the connections in-place. The key insight is to use pointer manipulation as we keep track of the last node we want to preserve, skip over the nodes to be deleted, and directly connect to the next node that should be kept. Think of it as "cutting and reconnecting railroad tracks" while a train is moving. We don't stop the train, collect all the cars, and rebuild the train elsewhere. We just redirect the connections as we encounter them.

### **Algorithms**

1. Firstly, we handle base cases. If the linked list is empty (head == null), or if the number of nodes to keep m is zero, then the result will be an empty list, so we return null immediately. Similarly, if the number of nodes to delete n is zero, then the list remains unchanged, so we can directly return head.
2. Next, we initialize a pointer current = head to begin traversing from the start of the list. The process is carried out in cycles, and we continue as long as current is not null.
3. In each cycle, we first skip m nodes that need to be kept. We do this by advancing the current pointer (m - 1) times so that it lands on the m-th node, which is the last node that should remain in this cycle. If during this skipping phase the current pointer reaches the end (null), then we break out since there are no further nodes left to process.
4. After finishing the keep phase, we begin the delete phase. We create a temporary pointer temp = current.next, which initially points to the first node that needs to be deleted. We then advance temp exactly n times to skip over the block of nodes to be deleted. After this traversal, temp will point to the first node that should remain after the deletion block.
5. Now comes the reconnection step. We set current.next = temp, which effectively removes the unwanted block of n-nodes by directly linking the last kept node to the node that follows the deleted section. Once the connection is updated, we move current = temp to continue processing the remaining nodes in the list.
6. Finally, once the loop finishes, we return the original head pointer. Since all modifications are done in-place by rearranging pointers, no additional data structures are required.

### **Dry Run**





### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    Node* linkdelete(Node* head, int n, int m) {

        Node* current = head;

        while (current != nullptr) {

            // Phase 1: Skip m nodes
            for (int i = 1; i < m && current != nullptr; i++) {
                current = current->next;
            }

            // Safety check
            if (current == nullptr) {
                break;
            }

            // Phase 2: Delete n nodes
            Node* temp = current->next;

            for (int i = 0; i < n && temp != nullptr; i++) {
                Node* nextNode = temp->next;
                temp = nextNode;
            }

            // Phase 3: Reconnect
            current->next = temp;

            // Move to next position
            current = temp;
        }

        return head;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public Node linkdelete(Node head, int n, int m) {
        Node current = head;
        while (current != null) {
            // Phase 1: Skip m nodes (keep them)
            for (int i = 1; i < m && current != null; i++) {
                current = current.next;
            }
            
            // Safety check: if reached end during skipping
            if (current == null) break;
            
            // Phase 2: Delete n nodes by jumping over them
            Node temp = current.next;  // Start of deletion block
            for (int i = 0; i < n && temp != null; i++) {
                Node nextNode = temp.next;
                temp = nextNode;
            }
            
            // Phase 3: Reconnect - bridge the gap
            current.next = temp;  // Connect last kept node to next valid node
            current = temp;       // Move to next processing position
        }
        return head;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def linkdelete(self, head, n, m):

        current = head

        while current is not None:

            # Phase 1: Skip m nodes
            for _ in range(1, m):

                if current is None:
                    break

                current = current.next

            # Safety check
            if current is None:
                break

            # Phase 2: Delete n nodes
            temp = current.next

            for _ in range(n):

                if temp is None:
                    break

                next_node = temp.next
                temp = next_node

            # Phase 3: Reconnect
            current.next = temp

            # Move to next position
            current = temp

        return head
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm traverses the linked list only once.
- During the skipping phase, each kept node is visited exactly once.
- During the deletion phase, each removed node is also visited exactly once.
- Every node in the list is processed only a single time.
- Therefore, the overall time complexity is **O(N)**.
- This is optimal because every node must be checked at least once to decide whether to keep or delete it.

#### **Space Complexity: O(1)**

- The algorithm uses only a constant number of pointer variables such as **current**, **temp**, and **nextNode**.
- No extra data structures are used.
- No recursion is involved, so no additional call stack space is required.
- The linked list is modified in-place by updating node connections.
- Therefore, the overall space complexity is **O(1)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/delete-n-nodes-after-m-nodes-of-a-linked-list7)*
