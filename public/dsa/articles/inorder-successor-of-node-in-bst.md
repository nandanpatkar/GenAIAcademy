# Inorder Successor of Node in BST

> **Slug:** `inorder-successor-of-node-in-bst`  
> **Published:** 2026-07-06T13:40:11.258Z  
> **Updated:** 2026-07-06T13:40:11.261Z  
> **Keywords:** BST, Binary Search Tree, Tree  
> **Cover Image:** ![Inorder Successor of Node in BST](6a4bb034d5b821217b7852eb)

**Description:** Inorder successor in BST DSA solution using iterative traversal. Find next greater node with O(H) time.

---

## Problem Statement

In a Binary Search Tree (BST), every node has a unique value, and for any node, all values in its left subtree are lesser, while all values in its right subtree are greater. The task is to find the inorder successor of a given node in such a tree. The inorder successor of a node in a BST is defined as the node that would appear immediately after it in an inorder traversal of the tree.

## Example

> [!NOTE]
> **INFO**
> **Example 1: **[20, 8, 22, 4, 12, null, null, null, null, 10, 14], target = 8
> 
> **Output 1: **10

## Intuition

To solve this problem, we make use of the special properties of a Binary Search Tree (BST). In a BST, all values in the left subtree of a node are smaller, and all values in the right subtree are larger. This ordering allows us to efficiently search for the inorder successor. The inorder successor of a node is the next node that would appear if we performed an inorder traversal (which visits nodes in sorted order). Instead of doing a full traversal, we can directly use the BST structure to find it. We start with a variable “**successor” **set to **null**. Then, we traverse the tree starting from the root:

- If the target’s value is **less than the current node’s value**, it means the current node could potentially be the successor (since it’s larger than the target). But there might still be a smaller candidate on the left side, so we update the **successor **to the current node and move left.
- If the target’s value is **greater than or equal to the current node’s value**, the successor must lie in the right subtree, so we move right.

By doing this, whenever we encounter a node greater than the target, we record it as a possible successor. The traversal ensures we always move closer to the smallest such value, which is exactly what the inorder successor is.

## Algorithm

**Step 1:** Initialize a variable **successor **as **null**. This will be used to store the potential inorder successor of the target node.

**Step 2:** Start traversing the BST from the root:

- If the target’s value is **less than the current node’s value**, then the current node is a possible successor. Update successor to this node and move to the left child to check if there exists a smaller valid successor.
- If the target’s value is **greater than or equal to the current node’s value**, the successor must lie in the right subtree, so move to the right child.

**Step 3:** Repeat the process until the traversal reaches **null**. At this point, the value stored in **successor **(if any) is the inorder successor of the given node.





## **Time Complexity: O(H)**

**Explanation: **The algorithm only traverses down the tree, moving either left or right at each step. In the worst case, it may travel from the root to the deepest leaf, which takes time proportional to the height of the tree (H).

## **Space Complexity: O(1)**

**Explanation: **The algorithm uses only a constant amount of extra space (the successor variable) and does not require any additional data structures or recursion.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/inorder-successor-of-node-in-bst)*
