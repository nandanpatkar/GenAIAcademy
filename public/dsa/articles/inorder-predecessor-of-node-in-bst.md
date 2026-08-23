# Inorder Predecessor of Node in BST

> **Slug:** `inorder-predecessor-of-node-in-bst`  
> **Published:** 2026-07-29T19:29:30.166Z  
> **Updated:** 2026-07-29T19:29:30.168Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Inorder Predecessor of Node in BST](6a6a5485d4d58f79c62c4a5f)

**Description:** BST inorder predecessor problem solved using iterative traversal. Full DSA approach with steps and complexity.

---

## Problem Statement

Given a Binary Search Tree (BST) and a target node, find the value of the inorder predecessor of the target node. In a BST, the inorder predecessor of a node is the node with the greatest value among the nodes that are less than the target node. In an inorder traversal of a BST, you visit the left subtree first, then the node itself, and finally the right subtree. The inorder predecessor is the node encountered immediately before the target node during this traversal. If the target node does not have an inorder predecessor, return -1.

## Example

> [!NOTE]
> **INFO**
> Example : BST = [20,10,30,5,15], target = 15
> 
> Output: 10
> 
> Explanation: The inorder traversal is [5, 10, 15, 20, 30] and the predecessor of 15 is 10.

## Intuition

To find the inorder predecessor of a node in a BST, we rely on the property that all nodes in the left subtree are smaller and all nodes in the right subtree are larger. Since an inorder traversal visits nodes in sorted order, the predecessor is simply the largest node smaller than the target. Instead of performing a complete inorder traversal, we can directly use the BST structure to search efficiently. We start from the root and keep track of a variable predecessor. Whenever we encounter a node with a value smaller than the target, that node becomes a potential predecessor, but we still move to the right to check if there is a closer candidate. On the other hand, if the current node’s value is greater than or equal to the target, we move left because the predecessor must lie on that side. By the end of the traversal, the predecessor variable will store the node with the largest value smaller than the target, which is exactly what we need.

## Algorithm

**Step 1:** Initialize a variable predecessor as null. This will keep track of the possible predecessor during traversal.

**Step 2:** Start traversing the BST from the root:

- If the target’s value is greater than the current node’s value, then the current node is a possible predecessor. Update predecessor to this node and move to the right child (to check if there’s a larger valid predecessor).
- Otherwise (if the target’s value is less than or equal to the current node’s value), move to the left child, because the predecessor must be smaller.

**Step 3:** Continue the traversal until the root becomes null.

**Step 4:** If a predecessor is found, return its value. Otherwise, return -1.





## **Time Complexity: O(N)**

**Explanation: **At each step, we either move left or right in the BST. In the worst case, the traversal can go from the root to the deepest leaf node, (for a skewed tree) then it can go up to N.

## **Space Complexity: O(1)**

**Explanation: **The algorithm only uses a constant amount of extra space and does not rely on recursion or additional data structures.









---
*Extracted from CodeHelp (https://www.codehelp.in/articles/inorder-predecessor-of-node-in-bst)*
