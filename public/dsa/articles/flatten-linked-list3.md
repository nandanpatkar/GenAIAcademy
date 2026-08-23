# Flatten Linked List

> **Slug:** `flatten-linked-list3`  
> **Published:** 2026-07-09T07:33:44.351Z  
> **Updated:** 2026-07-09T07:33:44.361Z  
> **Keywords:** Flatten Linked List, flattening linked list  
> **Cover Image:** ![Flatten Linked List](6a4f4c4f2e81bcf6527874a3)

**Description:** Learn the flatten multilevel doubly linked list problem with intuitive explanations, optimal solutions, and code implementations.

---

## Problem Statement

You are given a special linked list where each node can also have a child pointer pointing to another linked list. These child lists can also contain nodes with child pointers, creating a multi-level data structure.
The task is to flatten the list so that all nodes appear in a single-level, doubly linked list. The order of nodes in the flattened list should be the same as they appeared in the multi-level structure. You should return the head of this flattened list.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:** n = 3, lists = [ [1,3,5], [2,4,6], [7,8,9]]
> **Output:** 1 2 3 4 5 6 7 8 9
> **Explanation: **Merging three sorted lists with distinct values.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** n=4, lists=[[10, 20], [5, 15, 25], [8, 18, 28], [2, 30]]
> **Output:** 2 5 8 10 15 18 20 25 28 30 
> **Explanation: **Merging four lists with overlapping values.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** n=2, lists=[[1, 4, 9, 11], [2, 5, 6, 10, 12]]
> **Output:** 1  2 4 5 6 9 10 11 12 
> **Explanation: **Two lists of different lengths.

## Constraints

- The total number of nodes in the list is in the range [0, 500].
- 105  <=  Node.val <= 105

## Real-Life Analogy

Suppose you have a grand library. The library has many main shelves arranged in a row (these are the **next pointers**). On each shelf, books are placed vertically one after another (these are the **bottom pointers**).

But here’s the twist: some of those books have hidden drawers inside them, and in those drawers, there are even smaller books (again forming another bottom chain). Sometimes, those smaller books also have their own hidden drawers with more books inside! 

One day, your friend asked for a **master catalog** of all the books in the library, neatly arranged in sorted order by size, age, or importance.

The librarian faced a challenge. He couldn’t just list the books shelf by shelf, because that would break the order. Instead, he needed **one long scroll** that listed every single book in proper sorted order, no matter which shelf or hidden drawer it came from.

So, the librarian came up with a process.
He began by looking at the first book of every main shelf. Among them, he picked the smallest one and wrote it down in the master catalog. If that book had a hidden drawer with more books, he added those books into his pool to consider next. Then he repeated the same step again and again—always picking the smallest book available, adding it to the scroll, and exploring its hidden drawers if any.

In this way, the librarian carefully went through **all the shelves and all the hidden drawers**, until every book was listed. At the end, he had one perfect scroll a single, flattened catalog of the entire library, sorted and ready to use.

## Brute-Force Approach

### Intuition

Firstly, to flatten the given multi-level linked list into a single sorted list, we can first use an auxiliary array to collect all the nodes while traversing. The traversal begins by moving along the main next pointers of the list. For each node encountered, we also explore its child pointers and continue collecting nodes from those sub-lists as well. Once all nodes are gathered in the array, we sort the array so that the values appear in ascending order. Finally, we reconstruct a new linked list from the sorted array and return its head.

### Algorithm

1. First, Prepare a container. As start by setting up an empty array (or list) that will temporarily hold the value of every node we encounter.
2. Traverse through all levels, like walk through the linked list, begging at the head. For each node, add its value to the array. If the node has a child, move down into that child list and continue collecting. If the node has a next, move forwards in the top-level list.
This will ensure that the both the main sequence and all the nested child lists are explored and their values stored.
3. Now, Sort the collected data, as traversal is complete the array will contain values from all nodes. Sort this array so that the values are arranged in ascending order.
4. Now, build the flattened list, using the sorted array and construct a new doubly linked list. Each value from the array becomes a new node. Link them one after another so the list is fully linear and set all child pointers to null.
5. At last, **Return** the head.

### Dry Run

// img

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Node {
public:
    int val;
    Node* prev;
    Node* next;
    Node* child;

    Node(int val) {
        this->val = val;
        prev = nullptr;
        next = nullptr;
        child = nullptr;
    }
};

class FlattenLinkedList {
public:

    // Brute Force: Collect → Sort → Build new doubly linked list
    static Node* flatten(Node* head) {

        if (head == nullptr) {
            return nullptr;
        }

        // Step 1: Collect all node values into a list
        vector<int> values;
        collectValues(head, values);

        // Step 2: Sort the collected values
        sort(values.begin(), values.end());

        // Step 3: Build a new doubly linked list
        return buildList(values);
    }

private:

    // Recursive DFS to traverse through next and child nodes
    static void collectValues(Node* node, vector<int>& values) {

        if (node == nullptr) {
            return;
        }

        values.push_back(node->val);

        // Traverse child list first
        if (node->child != nullptr) {
            collectValues(node->child, values);
        }

        // Then traverse next list
        if (node->next != nullptr) {
            collectValues(node->next, values);
        }
    }

    // Build doubly linked list from sorted values
    static Node* buildList(vector<int>& values) {

        Node* dummy = new Node(-1);
        Node* current = dummy;

        for (int value : values) {

            Node* newNode = new Node(value);

            current->next = newNode;
            newNode->prev = current;

            current = current->next;
        }

        // Remove dummy node connection
        if (dummy->next != nullptr) {
            dummy->next->prev = nullptr;
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Node {
    int val;
    Node prev;
    Node next;
    Node child;

    Node(int val) {
        this.val = val;
        this.prev = null;
        this.next = null;
        this.child = null;
    }
}

public class FlattenLinkedList {

    // Brute Force: Collect → Sort → Build new doubly linked list
    public static Node flatten(Node head) {

        if (head == null) {
            return null;
        }

        // Step 1: Collect all node values into a list
        List<Integer> values = new ArrayList<>();
        collectValues(head, values);

        // Step 2: Sort the collected values
        Collections.sort(values);

        // Step 3: Build a new doubly linked list
        return buildList(values);
    }

    // Recursive DFS to traverse through next and child nodes
    private static void collectValues(Node node, List<Integer> values) {

        if (node == null) {
            return;
        }

        values.add(node.val);

        // Traverse child list first
        if (node.child != null) {
            collectValues(node.child, values);
        }

        // Then traverse next list
        if (node.next != null) {
            collectValues(node.next, values);
        }
    }

    // Build doubly linked list from sorted values
    private static Node buildList(List<Integer> values) {

        Node dummy = new Node(-1);
        Node current = dummy;

        for (int value : values) {

            Node newNode = new Node(value);

            current.next = newNode;
            newNode.prev = current;

            current = current.next;
        }

        // Remove dummy node connection
        if (dummy.next != null) {
            dummy.next.prev = null;
        }

        return dummy.next;
    }
}
```

### index.py Implementation

```index.py
class Node:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
        self.child = None


class FlattenLinkedList:

    # Brute Force: Collect → Sort → Build new doubly linked list
    @staticmethod
    def flatten(head):

        if head is None:
            return None

        # Step 1: Collect all node values into a list
        values = []
        FlattenLinkedList.collect_values(head, values)

        # Step 2: Sort the collected values
        values.sort()

        # Step 3: Build a new doubly linked list
        return FlattenLinkedList.build_list(values)

    # Recursive DFS to traverse through next and child nodes
    @staticmethod
    def collect_values(node, values):

        if node is None:
            return

        values.append(node.val)

        # Traverse child list first
        if node.child is not None:
            FlattenLinkedList.collect_values(node.child, values)

        # Then traverse next list
        if node.next is not None:
            FlattenLinkedList.collect_values(node.next, values)

    # Build doubly linked list from sorted values
    @staticmethod
    def build_list(values):

        dummy = Node(-1)
        current = dummy

        for value in values:

            new_node = Node(value)

            current.next = new_node
            new_node.prev = current

            current = current.next

        # Remove dummy node connection
        if dummy.next is not None:
            dummy.next.prev = None

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **O(N log N)**

- We traverse every node once using **next **and **child **pointers → **O(N)**
- Each insertion into the **ArrayList **takes constant time → **O(1)** per insertion
- Total insertions for **N **nodes → **O(N)**
- Sorting the collected array/list of size **N** takes → **O(N log N)**
- We iterate through the sorted values and create **N** new nodes → **O(N)**
- Each node insertion and linking operation is constant time → **O(1)**
- Therefore, the overall time complexity is:** O(N) + O(N log N) + O(N) = O(N log N)**

#### **Space Complexity: O(N)**

- Storing all node values during traversal requires → **O(N)** space
- Constructing a fresh doubly linked list with `N` nodes also requires → **O(N)** space
- Additional recursion/stack usage may occur if the list is deeply nested with `child` pointers
- Hence, the overall space complexity is:** O(N)**

## Optimal Approach

### Intuition

For optimal solution, we traverse the list normally using **next**. As if a node has a **child **we store its **next** pointer because child list should come before it. Next, we attach the **child** list between the current node and its **next**. After this we move to the child list until its end, then recount with the stored **next**. At last, continue until the entire structure is flattened.

### Algorithm

1. Start with head, so firstly, we initialise a pointer as **curr = head **then we will use this pointer to traverse the main list **from left to right**.
2. Now, Traverse through list as While curr != null, keep checking if the node has a child:
3. 1. If **no child** → just move to the next node (**curr = curr.next**).
  2. If **child exists** → we need to "flatten" the child list here before moving ahead.
4. After traversing we handle the condition when curr.**child !=  null **suppose we are at a node **curr** which has a child list.
5. 1. Save the next node:
Store nextNode = curr.next. because once we connect the child list, the original next would be lost otherwise.
  2. Attach Child list:
Now, make the child list is the new **next** of **curr**. As **curr.next = curr.chld, **Also set **curr.child.prev = curr, **so the doubly linked structure remains intact.
  3. Find the tail of the child list:
Start from **curr.child** ans traverse till you reach the last node in this child list (**tail**).
  4. Reconnect with saved **nextNode.**
If **nextNode **exists i.e., not null,** tail.next = nextNode. **And** nextNode.prev = tail**.
  5. Remove child Pointer, Now that the child is merged into the main list, set **(curr.child = null).**
6. Continue traversal, Move **curr = curr.next**, and keep repeating the same process. This ensures depth-first **flattening** because child lists are always processed before moving ahead.

### Dry Run

// img

### Code

### index.cpp Implementation

```index.cpp
class Node {
public:
    int val;
    Node* prev;
    Node* next;
    Node* child;

    Node(int _val) {
        val = _val;
        prev = nullptr;
        next = nullptr;
        child = nullptr;
    }
};

class Solution {
public:
    Node* flatten(Node* head) {

        if (head == nullptr) {
            return head;
        }

        Node* curr = head;

        while (curr != nullptr) {

            // If there is no child, move ahead
            if (curr->child == nullptr) {
                curr = curr->next;
            }
            else {

                // Save next node
                Node* nextNode = curr->next;

                // Connect child list
                curr->next = curr->child;
                curr->child->prev = curr;

                // Find tail of child list
                Node* tail = curr->child;

                while (tail->next != nullptr) {
                    tail = tail->next;
                }

                // Connect tail with saved next node
                if (nextNode != nullptr) {
                    tail->next = nextNode;
                    nextNode->prev = tail;
                }

                // Remove child pointer
                curr->child = nullptr;
            }
        }

        return head;
    }
};
```

### index.java Implementation

```index.java
class Node {
    int val;
    Node prev;
    Node next;
    Node child;

    Node(int val) {
        this.val = val;
    }
}

class Solution {
    public Node flatten(Node head) {
        if (head == null) {
            return head;
        }

        Node curr = head;

        while (curr != null) {

            // If there is no child, move ahead
            if (curr.child == null) {
                curr = curr.next;
            } 
            else {

                // Save next node
                Node nextNode = curr.next;

                // Connect child list
                curr.next = curr.child;
                curr.child.prev = curr;

                // Find tail of child list
                Node tail = curr.child;

                while (tail.next != null) {
                    tail = tail.next;
                }

                // Connect tail with saved next node
                if (nextNode != null) {
                    tail.next = nextNode;
                    nextNode.prev = tail;
                }

                // Remove child pointer
                curr.child = null;
            }
        }

        return head;
    }
}
```

### index.py Implementation

```index.py
class Node:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
        self.child = None


class Solution:
    def flatten(self, head):
        if head is None:
            return head

        curr = head

        while curr is not None:

            # If there is no child, move ahead
            if curr.child is None:
                curr = curr.next

            else:
                # Save next node
                next_node = curr.next

                # Connect child list
                curr.next = curr.child
                curr.child.prev = curr

                # Find tail of child list
                tail = curr.child

                while tail.next is not None:
                    tail = tail.next

                # Connect tail with saved next node
                if next_node is not None:
                    tail.next = next_node
                    next_node.prev = tail

                # Remove child pointer
                curr.child = None

        return head
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- We traverse each node exactly once → **O(N).**
- At every node:  - Checking the **child **pointer takes → **O(1).**
  - Updating **next**, **prev**, and **child **pointers takes → **O(1).**
- Even while finding the tail of a child list, each node is visited only once overall across the entire traversal.
- After connecting the child list back, those nodes are not traversed again.
- Therefore, the complete traversal of all **N** nodes takes → **O(N).**
- No sorting operation is performed.
- No extra array/list is used unlike the  approach which **ArrayList + sort** requires → **O(N log N).**

#### **Space Complexity: O(1)**

- No additional array or list is used for storing nodes.
- Only a few temporary pointers such as `nextNode` and `tail` are used → **O(1)** space.
- For the iterative approach, overall auxiliary space remains → **O(1).**
- If a recursive DFS approach is used, recursion stack space can become → **O(depth of nesting)** in the worst case.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/flatten-linked-list3)*
