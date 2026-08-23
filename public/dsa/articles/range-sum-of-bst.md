# Range Sum of BST

> **Slug:** `range-sum-of-bst`  
> **Published:** 2026-07-21T14:36:40.399Z  
> **Updated:** 2026-07-21T14:36:40.402Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Range Sum of BST](6a5f8038e67576629cc4d1c5)

**Description:** Range Sum in BST DSA solution: calculate sum of nodes within [low, high] using optimized BST traversal.

---

## Problem Statement

Given the root node of a Binary Search Tree (BST) and two integers low and high, the task is to calculate the sum of the values of all the nodes that have a value within the inclusive range [low, high]. A Binary Search Tree is a tree data structure in which each node has at most two children referred to as the left child and the right child. The property of BST is that for each node, all the values in the left subtree are less than the node value, and all the values in the right subtree are greater than the node value.

## Example

> [!NOTE]
> **INFO**
> Example : root = [10,5,15,3,7,null,18], low = 7, high = 15
> 
> Output: 32
> 
> Explanation: Nodes within range [7, 15] are 7, 10, and 15, which sum up to 32.



## Intuition

We need to calculate the sum of all nodes in a BST that fall within the range [low, high]. The solution makes use of the BST property: values in the left subtree are always smaller than the current node, and values in the right subtree are always larger.

So, if the current node’s value lies within the given range, we include it in our sum and explore both left and right subtrees. If the current node’s value is smaller than low, then all values in its left subtree will also be smaller, so we only move to the right subtree. Similarly, if the current node’s value is greater than high, then all values in its right subtree will also be greater, so we only move to the left subtree. By following this logic, we only visit the nodes that are relevant, and at the end, we get the correct sum of all values in the range.

## Algorithm

**Step 1:** In the main function, first check if the root of the tree is null. If it is, return 0 since there are no nodes to process.

**Step 2:** Initialize a variable “**csum” **to keep track of the cumulative sum of all valid node values.

**Step 3:** If the current node’s value lies within the range **(low <= node value <= high)**, then add this value to “**csum”**. After that, recursively call the function on both the left and right subtrees to continue checking for other valid nodes.

**Step 4:** If the current node’s value is smaller than the lower boundary low, then all values in the left subtree will also be smaller and outside the range. So, skip the left subtree and move only to the right subtree.

**Step 5:** If the current node’s value is greater than the upper boundary high, then all values in the right subtree will also be greater and outside the range. So, skip the right subtree and move only to the left subtree.

**Step 6:** Once all recursive calls are completed, return the value of “**csum” **as the final result.





## **Time Complexity:** **O(N)**

**Explanation:** Let **N** be the number of nodes in the BST. In the worst case, we may end up visiting every node in the tree. This happens when all node values lie within the given range **[low, high]**.Therefore, the time complexity is proportional to the number of nodes.

## **Space Complexity:** **O(H)**

**Explanation:** Let **H** be the height of the BST. The extra space comes from the recursive call stack during traversal. In the worst case, if the tree is skewed **(like a linked list)**, the height can be **N**, leading to **O(N)** space usage. For a balanced BST, the height is about **log(N)**, giving **O(log N)** space usage on average.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/range-sum-of-bst)*
