# Balanced Binary Search Tree

> **Slug:** `balanced-binary-search-tree`  
> **Published:** 2026-07-29T19:07:38.190Z  
> **Updated:** 2026-07-29T19:07:38.193Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Balanced Binary Search Tree](6a6a4f6ad4d58f79c62c4a20)

**Description:** Balance BST algorithm | inorder traversal + build balanced tree from sorted array | O(N) time, O(N) space.

---

## Problem Statement

Given a Binary Search Tree (BST), the task is to transform it into a balanced BST with the minimum possible height. A balanced BST is defined as a binary tree in which the depth of the two subtrees of every node never differ by more than 1. This transformation is crucial for ensuring efficient operations, maintaining O(log n) time complexity for searching, inserting, and deleting elements.

## Example

> [!NOTE]
> **INFO**
> Example : n=[5, 3, 8, 2, 4, 6, 10]
> 
> Output: 3
> 
> Explanation: Tree is balanced by reordering nodes with 5 as the root, maintaining BST properties while balancing subtrees.

## Intuition

A Binary Search Tree (BST) gives us elements in sorted order if we perform an inorder traversal. Using this property, we can first collect all the nodes of the given BST into a sorted list.

Once we have the sorted list, the task reduces to constructing a balanced BST from a sorted array. The best way to keep the tree balanced is to choose the middle element as the root, so that the number of nodes on the left and right subtrees are nearly equal.

- The left half of the list will form the left subtree.
- The right half of the list will form the right subtree.

By applying this logic recursively, we can rebuild the entire tree in a balanced manner.

## Algorithm

**Step 1:** Perform an inorder traversal of the given BST. Store the nodes’ values in a list. This ensures the elements are sorted.

**Step 2:** Use a helper function buildBalancedTree(nodes, start, end) to construct the balanced BST:

- If start > end, return null (no nodes left in this range).
- Find the middle index: mid = (start + end) / 2.
- The element at nodes[mid] becomes the root of the current subtree.
- Recursively build the left subtree using elements from start to mid - 1.
- Recursively build the right subtree using elements from mid + 1 to end.

**Step 3:** Return the root of this newly built tree.

**Step 4:** In the main function **balanceBST(root)**, first gather all elements using inorder, then pass the list to **buildBalancedTree **to get the balanced BST.





## **Time Complexity: O(N)**

**Explanation:** Inorder traversal takes O(N) to visit all nodes. Building the balanced BST also takes O(N), since each element is inserted exactly once. So overall, the time complexity is O(N).

## **Space Complexity: O(N)**

**Explanation: **We store all the node values in a list, which takes O(N) space. The recursion stack during tree construction can take up to O(log N) space in the average case (balanced tree), but in the worst case, it could go up to O(N) if recursion depth is large. So the overall space complexity is O(N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/balanced-binary-search-tree)*
