# Lowest Common Ancestor(LCA) of a Binary Search Tree

> **Slug:** `lowest-common-ancestorlca-of-a-binary-search-tree`  
> **Published:** 2026-07-06T13:38:15.849Z  
> **Updated:** 2026-07-06T13:38:15.852Z  
> **Keywords:** LCA, Binary Search Tree, Tree, Lowest Common  Ancestor  
> **Cover Image:** ![Lowest Common Ancestor(LCA) of a Binary Search Tree](6a4bafa9d5b821217b7852e2)

**Description:** Find Lowest Common Ancestor (LCA) in a BST using BST properties. Step-by-step solution with complexity.

---

## **Problem Statement**

Given a Binary Search Tree (BST), your task is to find the Lowest Common Ancestor (LCA) of two given nodes, p and q. The Lowest Common Ancestor of two nodes is the lowest node in the BST that has both nodes as descendants, where we consider a node to be a descendant of itself.

The binary search tree has the following properties:

- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.

## Example

> [!NOTE]
> **INFO**
> **Example 1: **[20, 8, 22, 4, 12, N, N, N, N, 10, 14], p = 10, q = 14
> 
> **Output 1: **12

## Intuition

To find the Lowest Common Ancestor (LCA) in a Binary Search Tree (BST), we use its key property: values in the left subtree are smaller than the parent, while values in the right subtree are larger. Now, if both p and q are smaller than the current node, the LCA must be in the left subtree. If both are greater, the LCA must be in the right subtree. Otherwise, the current node is exactly where the paths to p and q diverge, which makes it their Lowest Common Ancestor.

## Algorithm

**Step 1: **If the root of the tree is null, return null because there is no tree to search.

**Step 2: **If both p and q have values smaller than the current node’s value, recursively search in the left subtree, since the LCA must be there.

**Step 3: **If both p and q have values greater than the current node’s value, recursively search in the right subtree, since the LCA must be there.

**Step 4: **If neither of the above conditions is true, it means the current node is the point where the paths to p and q split, or it is one of the nodes itself. In this case, the current node is the Lowest Common Ancestor, so return the root.





## **Time Complexity: O(h)**

**Explanation: **The time complexity is O(h), where h is the height of the tree. In the best case, the tree is balanced, and the height is O(log n), where n is the number of nodes. In the worst case, the tree is skewed, and the height is O(n).

## **Space Complexity: O(h)**

**Explanation: **The space complexity is also O(h) due to the recursion stack. In balanced trees, it's O(log n), and in unbalanced trees, it's O(n). This can be optimized to O(1) by using an iterative approach.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/lowest-common-ancestorlca-of-a-binary-search-tree)*
