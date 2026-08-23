# Construct Binary Search Tree from Preorder Traversal

> **Slug:** `construct-binary-search-tree-from-preorder-traversal`  
> **Published:** 2026-07-06T13:34:44.778Z  
> **Updated:** 2026-07-06T13:34:44.781Z  
> **Keywords:** Binary Search Tree, BST, Tree  
> **Cover Image:** ![Construct Binary Search Tree from Preorder Traversal](6a4baeeed5b821217b7852d2)

**Description:** Construct BST from Preorder DSA solution using bound recursion. Build valid BST in O(N) with algorithm & complexity.

---

## **Problem Statement**

Given an array of unique integers preorder, the task is to construct a Binary Search Tree (BST) and return its root node, using preorder as the list of elements visited in a preorder traversal.

**Definitions**

A binary search tree (BST) is a binary tree in which each node's left subtree contains values strictly less than the node's value, and each right subtree contains values strictly greater than the node's value. A preorder traversal is a traversal technique where you visit the root node first, followed by recursively doing a preorder traversal of the left subtree, then the right subtree. It is ensured that a BST can always be constructed from any preorder input given within the specified constraints.

## Example

> [!NOTE]
> **INFO**
> **Example 1: [8, 5, 1, 7, 10, 12]**
> 
> **Output 1:**

## **Real-Life Analogy**

** **Imagine you are arranging people in a family photo. The rule is: the tallest person stands first (at the center), then people shorter than them stand on the left side, and people taller than them stand on the right side. Now, someone gives you a list of people in the order they were called to stand (this is like the preorder traversal). From this list alone, you have to figure out the exact way the group was arranged in the photo, with everyone standing in the correct left or right position based on their height.

## Intuition

We are given the preorder traversal of a BST, which always follows the order **root → left → right**. That means the very first element in the preorder array is the root of our tree. The main challenge is to decide how the remaining elements should be placed in the left and right subtrees. Here we rely on the BST property: values smaller than a node go to its left, and values greater than a node go to its right. To build the tree, we use a helper function **“buildTree”** that keeps track of a bound. This bound tells us the maximum value allowed in the current subtree. If the current number is larger than the bound, it means this number does not belong here, so we return null. Otherwise, we create a node, then build its left subtree with the bound set to the node’s value, and afterwards build the right subtree with the original bound passed down.





 [For instance, if we are placing nodes in the right subtree of “5” while still under “8”, the bound becomes “8”. This way, any value we add here must be greater than 5 but also less than “8”. By maintaining these bounds, we can reconstruct the **BST **in a single pass over the preorder array.]

## Algorithm

**Step 1:** In the main function, call the helper function buildTree with three arguments: the preorder array, a bound value (initially set to MAX_VALUE), and an index pointer (starting at 0).

**Step 2:** Inside the helper function, first check:

- If the index is out of range (no more elements left), or
- If the current value is greater than the bound (it doesn’t fit the **BST **property),
 then return **null**.

**Step 3:** Otherwise, create a new node using the current value **(preorder[index[0]])** and move the index forward by one.

**Step 4:** Recursively build the **left subtree** by calling the helper again with the bound set to the current node’s value. This ensures all left children are smaller than the current node.

**Step 5:** Recursively build the **right subtree** by calling the helper with the original bound (passed from the parent). This ensures all right children are greater than the current node but still within the parent’s limit.

**Step 6:** Finally, return the root node of the current subtree.





## **Time Complexity: O(N)**

**Explanation: **We go through each element of the preorder array exactly once and place it in the tree. Since every element is processed only a single time, the overall time complexity is O(N).

## **Space Complexity:O(N)**

**Explanation: **The recursion stack can grow in proportion to the height of the tree. In the worst case (when the tree is completely skewed like a linked list), the height can be N, leading to O(N) space usage. In the best case (balanced tree), the height would be O(log N), but we consider the worst case, so the space complexity is O(N).









---
*Extracted from CodeHelp (https://www.codehelp.in/articles/construct-binary-search-tree-from-preorder-traversal)*
