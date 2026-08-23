# Binary Tree to Doubly Linked List

> **Slug:** `binary-tree-to-doubly-linked-list-article`  
> **Published:** 2026-08-02T09:05:11.929Z  
> **Updated:** 2026-08-02T09:05:11.938Z  
> **Keywords:** BST, Tree, Linkedlist  
> **Cover Image:** ![Binary Tree to Doubly Linked List](6a6f07dfcddbc98100890d32)

**Description:** Convert a binary tree to a sorted doubly linked list using in-order traversal. Learn the O(N) in-place approach with C++, Java, and Python.

---

## Problem Statement

You are given the root of a binary tree. Your task is to convert this binary tree into a sorted doubly linked list. The conversion should be performed *in-place*, meaning you should reuse the existing TreeNode objects for the nodes of the doubly linked list.

Specifically, for each TreeNode:

- The left pointer should be repurposed to point to the *previous* node in the doubly linked list.
- The right pointer should be repurposed to point to the *next* node in the doubly linked list.

The nodes in the resulting doubly linked list must be sorted according to their values, which corresponds to the order obtained from an in-order traversal of the original binary tree. After the conversion, the original binary tree structure will be destroyed. Your function should return the head of the newly formed doubly linked list (which will be the node with the smallest value from the in-order traversal).

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: Binary Tree (level-order): 4 2 5 1 3 null null
> 
> Output: None <- 1 <-> 2 <-> 3 <-> 4 <-> 5 -> None
> 
> Explanation: This is the example binary tree provided in the problem description. An in-order traversal of this tree visits nodes in the order 1, 2, 3, 4, 5. The conversion repurposes the `left` and `right` pointers to form a doubly linked list in this sorted order.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: Binary Tree (level-order): 10
> 
> Output: None <- 10 -> None
> 
> Explanation: A single-node binary tree results in a doubly linked list with that single node.

## Intuition

The doubly linked list must be created in sorted order. The order produced by an in-order traversal of a binary tree is:

Left → Root → Right

So, if we traverse the tree using in-order traversal and connect nodes as we visit them, the nodes will automatically form a sorted doubly linked list. We maintain a pointer called prev to store the previously visited node. While visiting the current node:

- Connect the previous node’s right pointer to the current node.
- Connect the current node’s left pointer to the previous node.

The first node visited during the traversal becomes the head of the doubly linked list because it is the leftmost node in the tree. This approach converts the tree into a doubly linked list in-place without creating any extra nodes.

## Algorithm

**Step 1: **Create two variableshead to store the head of the doubly linked list and prev to store the previously visited node.

**Step 2: **Start an in-order traversal of the binary tree.

**Step 3: ** Recursively traverse the left subtree.

**Step 4: **Process the current node.
If prev is null, make the current node the head of the doubly linked list. Otherwise, connect:

- prev.right to the current node
- current.left to prev

**Step 5: **Update prev to the current node.

**Step 6: **Recursively traverse the right subtree.

**Step 7: **After the traversal is complete, return head.





### C++ Implementation

```cpp
class Solution {
private:

    TreeNode* head;

    TreeNode* prev;

    void inorderTraversalAndConvert(TreeNode* node) {

        if (node == nullptr) {
            return;
        }

        inorderTraversalAndConvert(node->left);

        if (prev == nullptr) {

            head = node;

        } else {

            prev->right = node;

            node->left = prev;
        }

        prev = node;

        inorderTraversalAndConvert(node->right);
    }

public:

    TreeNode* treeToDoublyLinkedList(TreeNode* root) {

        if (root == nullptr) {
            return nullptr;
        }

        head = nullptr;

        prev = nullptr;

        inorderTraversalAndConvert(root);

        return head;
    }
};
```

### Java Implementation

```java
class Solution {
    private TreeNode head;
    private TreeNode prev;

    private void inorderTraversalAndConvert(TreeNode node) {
        if (node == null) {
            return;
        }

        inorderTraversalAndConvert(node.left);

        if (prev == null) {
            head = node;
        } else {
            prev.right = node;
            node.left = prev;
        }

        prev = node;

        inorderTraversalAndConvert(node.right);
    }

    public TreeNode treeToDoublyLinkedList(TreeNode root) {
        if (root == null) {
            return null;
        }

        head = null;
        prev = null;

        inorderTraversalAndConvert(root);

        return head;
    }
}
```

### Python Implementation

```python
class Solution:

    def __init__(self):

        self.head = None

        self.prev = None

    def inorderTraversalAndConvert(self, node):

        if node is None:
            return

        self.inorderTraversalAndConvert(node.left)

        if self.prev is None:

            self.head = node

        else:

            self.prev.right = node

            node.left = self.prev

        self.prev = node

        self.inorderTraversalAndConvert(node.right)

    def treeToDoublyLinkedList(self, root):

        if root is None:
            return None

        self.head = None

        self.prev = None

        self.inorderTraversalAndConvert(root)

        return self.head
```

## Time Complexity: O(N)

**Explanation: **We visit every node exactly once during the in-order traversal. Therefore, the total time complexity is O(N).

## Space Complexity: **O(H)**

**Explanation: **The extra space is used by the recursion stack during the recursive traversal, where H is the height of the tree.

- In a balanced tree, the height is O(log N).
- In the worst case of a skewed tree, the height becomes O(N).





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/binary-tree-to-doubly-linked-list-article)*
