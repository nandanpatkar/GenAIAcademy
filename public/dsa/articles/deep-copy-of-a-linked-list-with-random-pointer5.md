# Deep Copy of a Linked List with Random Pointer

> **Slug:** `deep-copy-of-a-linked-list-with-random-pointer5`  
> **Published:** 2026-07-09T07:47:01.924Z  
> **Updated:** 2026-07-09T07:47:01.934Z  
> **Keywords:** Deep Copy of a Linked List with Random Pointer, Pointer, Linked List, Random Pointer  
> **Cover Image:** ![Deep Copy of a Linked List with Random Pointer](https://cdn.codehelp.in/media/Deep Copy of a_.png)

**Description:** Learn Deep Copy of a Linked List with Random Pointer , Brute Force and Optimal Approach (C++, Java, Python)

---

## Problem Statement

You are given a special kind of linked list where each node has two pointers: one to the next node and another random pointer that can point to any node in the list or be ***null***. Your task is to create a **deep copy** of this linked list. This means you need to construct a new list where all of the nodes and pointers are replicated exactly, but with new instances, so that the original and copied lists don't share any node objects.

The list is described by an array where each element consists of two values: the node's value and the index of the node to which the random pointer points (or ***null*** if there's no random pointer).
**Example:**
**Input:** A linked list consisting of nodes described as **[[7,null],[13,0],[11,4],[10,2],[1,0]]**

**Explanation:**
• The node with value ***7*** has no random pointer.
•  The node with value ***13*** has a random pointer to the node at index ***0***(value ***7***).
•  The node with value ***11*** has a random pointer to the node at index ***4***(value ***1***).
•  The node with value ***10*** has a random pointer to the node at  index ***2 ***(value ***11***).
•  The node with value ***1*** has a random pointer to the node at index ***0***(value ***7***).

You need to return the head of a new list that has the same values and structure as described but is a different instance, ensuring no pointers in the new list point to a node in the original list.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:**  head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
> **Output:**  [[7, null], [0, null], [4, null], [2, 0], [0, 7]]
> **Explanation:  **Each random pointer is copied to match the original list structure.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**   head = [[1,1],[2,1]]
> **Output:**  [[1, 2], [2, 2]]
> **Explanation:  ** Two nodes with random pointers pointing to each other.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:**  head = [[1,null]]
> **Output:**  [[1, 1]]
> **Explanation:  **Single node with no random pointer.

## Constraints

- 0 <= n <= 1000
- 10000 <= Node.val <= 10000
- Node.random is null or points to a valid node in the list.

## Real-Life Analogy

Suppose, your linked list is like a **classroom of students**. The students are sitting in a single row, one after another, and each student has two things:

1. A **name tag** that says who is sitting immediately next to them in the row (this is like the `next` pointer).
2. A **sticky note** where they can write the name of **any random student in the class**, not just the one beside them (this is like the `random` pointer).
•  Sometimes the sticky note is blank (just like `null`).

Now, the principal comes in and says:
“Hey, I want to build an **identical twin classroom**. Each student here will have a twin sitting in the new classroom.
The twins should sit in the **same order** as the original students, and their sticky notes should point to the **twin of the same student** their original pointed to—not the original one.”

For example:
• If **Riya** (original) points her sticky note to **Aarav**, then **Twin Riya** (in the new classroom) must point her sticky note to **Twin Aarav**, not the real Aarav.
• If **Kabir** doesn’t have a sticky note, then **Twin Kabir** also won’t have one.

In the end, the principal now has **two completely separate classrooms**:
• One with the original students.
• One with the identical twins, all arranged properly with their own name tags and sticky notes.

## Brute-Force Approach

### Intuition

The straightforward approach is to use a hash map to store the mapping between original nodes and their corresponding cloned nodes. We make two passes: first to create all cloned nodes and store the mappings, then second to assign the next and random pointers using the hash map lookup.
The challenge is that when we're processing a node, its random pointer might point to a node we haven't created yet. The hash map solves this by allowing us to create all nodes first, then establish all relationships in a separate pass.

### **Algorithm**

1. Firstly, we handle the base case. If the linked list is empty (head == null), there is nothing to clone, so we immediately return null.
2. Next, in the first pass, we traverse the entire original list. For each node in the list, we create a corresponding cloned node with the same value. While doing this, we store the mapping between each original node and its cloned counterpart in a hash map. This mapping allows us to easily connect the cloned nodes later.
3. In the second pass, we again traverse the original list. For each original node, we use the hash map to find its cloned node. We then assign the next and random pointers of the cloned node by looking up the cloned equivalents of the original node’s next and random pointers from the hash map.
4. Finally, once all the pointers are correctly assigned, we return the cloned head node. This can be obtained directly by looking up the original head in the hash map.

### **Dry Run**

//img

### **Code**

### index.cpp Implementation

```index.cpp
#include <unordered_map>
using namespace std;

class Solution {
public:
    Node* copyRandomList(Node* head) {

        if (head == nullptr) {
            return nullptr;
        }

        // HashMap to store mapping:
        // original node -> cloned node
        unordered_map<Node*, Node*> nodeMap;

        // First pass: Create cloned nodes
        Node* current = head;

        while (current != nullptr) {
            nodeMap[current] = new Node(current->val);
            current = current->next;
        }

        // Second pass: Assign next and random pointers
        current = head;

        while (current != nullptr) {

            Node* clonedNode = nodeMap[current];

            // Assign next pointer
            if (current->next != nullptr) {
                clonedNode->next = nodeMap[current->next];
            }

            // Assign random pointer
            if (current->random != nullptr) {
                clonedNode->random = nodeMap[current->random];
            }

            current = current->next;
        }

        // Return cloned head
        return nodeMap[head];
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        
        // HashMap to store mapping: original node -> cloned node
        Map<Node, Node> nodeMap = new HashMap<>();
        
        // First pass: Create all cloned nodes and store mappings
        Node current = head;
        while (current != null) {
            nodeMap.put(current, new Node(current.val));
            current = current.next;
        }
        
        // Second pass: Assign next and random pointers
        current = head;
        while (current != null) {
            Node clonedNode = nodeMap.get(current);
            
            // Assign next pointer
            if (current.next != null) {
                clonedNode.next = nodeMap.get(current.next);
            }
            
            // Assign random pointer  
            if (current.random != null) {
                clonedNode.random = nodeMap.get(current.random);
            }
            
            current = current.next;
        }
        
        // Return cloned head
        return nodeMap.get(head);
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def copyRandomList(self, head):
        if head is None:
            return None

        # Dictionary to store mapping:
        # original node -> cloned node
        node_map = {}

        # First pass: Create cloned nodes
        current = head

        while current is not None:
            node_map[current] = Node(current.val)
            current = current.next

        # Second pass: Assign next and random pointers
        current = head

        while current is not None:
            cloned_node = node_map[current]

            # Assign next pointer
            if current.next is not None:
                cloned_node.next = node_map[current.next]

            # Assign random pointer
            if current.random is not None:
                cloned_node.random = node_map[current.random]

            current = current.next

        # Return cloned head
        return node_map[head]
```

### Complexity Analysis

#### Time Complexity: **O(n)**

- The algorithm uses two traversals of the linked list.
- The first traversal creates cloned nodes and stores mappings in the hash map → **O(N)**.
- The second traversal assigns **next **and **random **pointers → **O(N)**.
- Hash map operations take **O(1)** time on average.
- Therefore, overall time complexity is **O(N)**.

**Space Complexity: O(n)**

- A hash map is used to store mappings between original nodes and cloned nodes.
- Since there are `N` nodes, the hash map requires **O(N)** extra space.
- Therefore, the overall space complexity is **O(N)**.

## Optimal Approach

### Intuition

Instead of using extra space for a hash map, we can use a clever technique called "interleaving". We create cloned nodes and temporarily insert them right after their corresponding original nodes in the same list. This way, for any original node, its cloned version is always at **originalNode.next**.

This approach eliminates the need for a hash map because we can directly access the cloned node of any original node without additional lookup. After setting up all the relationships, we separate the interleaved list back into the original and cloned lists.

### **Algorithm**

1. Firstly, we handle the base case. If the linked list is empty (head == null), then there is nothing to clone, so we immediately return null.
2. In the first pass, we traverse the original list and create cloned nodes directly alongside the original nodes. For each original node, we create a cloned node with the same value and insert it immediately after the original node. This results in an interleaved structure where every original node is followed by its clone, for example: Original1 → Clone1 → Original2 → Clone2 → and so on.
3. In the second pass, we assign the random pointers for the cloned nodes. While traversing the interleaved list, if an original node has a random pointer, then the random pointer of its cloned node (found at original.next) is set to the cloned version of the node that the original node’s random points to. Since each cloned node is placed immediately after its original, this cloned version can be accessed using original.random.next.
4. In the third pass, we separate the interleaved list into two independent lists. During this traversal, we restore the original list by fixing its next pointers, and at the same time, we extract the cloned list with the correct next pointers.
5. Finally, we return the head of the cloned list, which now forms a fully independent deep copy of the original linked list.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    Node* copyRandomList(Node* head) {

        if (head == nullptr) {
            return nullptr;
        }

        // First pass: Clone each node
        // and insert it next to original node
        Node* it = head;

        while (it != nullptr) {

            Node* cloneNode = new Node(it->val);

            cloneNode->next = it->next;
            it->next = cloneNode;

            it = cloneNode->next;
        }

        // Second pass: Assign random pointers
        it = head;

        while (it != nullptr) {

            if (it->random != nullptr) {
                it->next->random = it->random->next;
            }

            it = it->next->next;
        }

        // Third pass: Detach cloned list
        it = head;
        Node* clonedHead = head->next;

        while (it != nullptr) {

            Node* cloneNode = it->next;

            it->next = cloneNode->next;

            if (cloneNode->next != nullptr) {
                cloneNode->next = cloneNode->next->next;
            }

            it = it->next;
        }

        return clonedHead;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        
        // First pass: clone each node and insert them next to original nodes
        Node it = head;
        while (it != null) {
            Node cloneNode = new Node(it.val);
            cloneNode.next = it.next;
            it.next = cloneNode;
            it = cloneNode.next;
        }
        
        // Second pass: assign random pointers for the cloned nodes
        it = head;
        while (it != null) {
            if (it.random != null) {
                it.next.random = it.random.next;
            }
            it = it.next.next;
        }
        
        // Third pass: detach the cloned list from the original list
        it = head;
        Node clonedHead = head.next;
        while (it != null) {
            Node cloneNode = it.next;
            it.next = cloneNode.next;
            if (cloneNode.next != null) {
                cloneNode.next = cloneNode.next.next;
            }
            it = it.next;
        }
        
        return clonedHead;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def copyRandomList(self, head):
        if head is None:
            return None

        # First pass: Clone each node
        # and insert it next to original node
        it = head

        while it is not None:
            clone_node = Node(it.val)

            clone_node.next = it.next
            it.next = clone_node

            it = clone_node.next

        # Second pass: Assign random pointers
        it = head

        while it is not None:
            if it.random is not None:
                it.next.random = it.random.next

            it = it.next.next

        # Third pass: Detach cloned list
        it = head
        cloned_head = head.next

        while it is not None:
            clone_node = it.next

            it.next = clone_node.next

            if clone_node.next is not None:
                clone_node.next = clone_node.next.next

            it = it.next

        return cloned_head
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm requires three traversals of the linked list.
- In the first traversal, cloned nodes are created and inserted next to original nodes → **O(N)**.
- In the second traversal, random pointers are assigned using the interleaved structure → **O(N)**.
- In the third traversal, the cloned list is separated from the original list → **O(N)**.
- Therefore, the total time complexity is:** O(N) + O(N) + O(N) = O(N)**.

#### **Space Complexity: O(1)**

- The algorithm does not use any extra data structures like a hash map.
- Only a few pointer variables such as **it**, **cloneNode**, and **clonedHead **are used.
- The cloned nodes are part of the required output, so they are not counted as extra space.
- Therefore, the overall space complexity is **O(1)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/deep-copy-of-a-linked-list-with-random-pointer5)*
