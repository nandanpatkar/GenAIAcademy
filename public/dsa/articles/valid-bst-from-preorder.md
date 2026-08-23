# Valid BST from Preorder

> **Slug:** `valid-bst-from-preorder`  
> **Published:** 2026-07-06T13:36:06.695Z  
> **Updated:** 2026-07-06T13:36:06.698Z  
> **Keywords:** Binary Search Tree, BST, Tree  
> **Cover Image:** ![Valid BST from Preorder](6a4baf40d5b821217b7852da)

**Description:** Valid BST from Preorder: check if preorder traversal can construct a BST using min-max range recursion. O(N) solution.

---

## Problem Statement

Given an array that represents the preorder traversal of a binary search tree (BST), your task is to determine if it's possible to construct a valid BST using these elements. A binary search tree (BST) is a sorted binary tree that satisfies the following properties: The right subtree of a node contains only nodes with keys greater than the node's key. The left subtree of a node contains only nodes with keys less than the node's key. Both the left and right subtrees must individually adhere to the properties of a BST. The order of elements in the given array is the sequence of visiting nodes in a preorder manner, where each subtree is visited starting from its root. Your task is to return 'YES' if it's possible to form a valid BST with the given preorder traversal, otherwise return 'NO'.

## Example

> [!NOTE]
> **INFO**
> **Example 1: **[10, 5, 1, 7, 40, 50]
> 
> **Output 1: **YES

## Intuition

We are given the preorder traversal of a tree, and we need to check if this sequence can represent a valid Binary Search Tree (BST). The main idea comes from the BST property: values in the left subtree are always smaller than the parent, and values in the right subtree are always greater. To capture this, we can keep track of a valid range (min, max) for every node we try to place.

- For the root, the valid range is from -∞ to +∞.
- If we move to the left child, its value must lie between (min, parentValue).
- If we move to the right child, its value must lie between (parentValue, max).

While traversing the preorder array, we check if the current element can fit into its valid range. If yes, we place it and continue; if not, the sequence cannot represent a BST. If we manage to place all elements successfully, then the preorder is valid.

## Algorithm

**Step 1: **In the main function “**canRepresentBST”**, we call a helper function build. This helper function is used to decide whether the given preorder sequence can actually represent a valid BST.

**Step 2: **Inside the “**build” **function:

- If the current index goes out of bounds, it means we have already placed all the nodes successfully, so we return true.
- Otherwise, check if the current element lies within the valid range (min, max).
- - If it does, we treat this element as the current root.
  - Then, we move the index forward and recursively try to build the **left subtree** with the updated range **(min, rootValue)**.
  - After that, we recursively try to build the **right subtree** with the updated range **(rootValue, max)**
- If the current element does not fall within the valid range, then it cannot be placed in the BST, and we return false.

If all nodes are placed following these rules, the preorder traversal represents a valid BST otherwise, it does not.





## **Time Complexity: O(N)**

**Explanation: **The algorithm goes through each element of the preorder array exactly once while checking whether it can be placed in the BST. Since no element is revisited, the overall time complexity is O(N), where N is the number of elements in the array.

## **Space Complexity: O(N)**

**Explanation: **The extra space comes from the recursive function calls. The maximum depth of recursion depends on the height of the BST. In the best case, when the tree is balanced, the height is about log(N). In the worst case, when the tree is skewed, the height can go up to N. Therefore, the space complexity is O(h), which in the worst case becomes O(N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/valid-bst-from-preorder)*
