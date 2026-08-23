# Height-Balanced Binary Tree

> **Slug:** `height-balanced-binary-tree-article`  
> **Published:** 2026-04-24T10:19:42.776Z  
> **Updated:** 2026-04-24T10:19:42.778Z  
> **Keywords:** Test  
> **Cover Image:** ![Height-Balanced Binary Tree](https://cdn.codehelp.in/media/Height-Balanced Binary Tree.png)

**Description:** Binary Tree Balanced or Not (Height Balanced) DSA solution in C++/Java using DFS recursion with O(n) time.

---

## Problem Statement

Given a root node of a Binary tree, we need to check if the tree is height balanced or not. A height-balanced binary tree is a tree where, for every node, the height difference between its left and right subtrees is at most 1. 

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input:  [1,2,3,4,5,null,null]
> 
> Output: true
> 
> Explanation: This tree is balanced with a height difference of at most 1 between left and right subtrees for each node.





## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: [1,2,3,4,null,5]
> 
> Output: false
> 
> Explanation: The left subtree has a greater depth than the right subtree by more than 1 at node 2, making it unbalanced.







# Brute-force Approach

## Intuition

To check if a binary tree is height-balanced, we can recursively visit each node and calculate the height of its left and right subtrees. To do this, we use a separate method that returns the height of a subtree. At each node, we compare the heights of the left and right subtrees. If the difference between them is more than one, it means the tree is not balanced, and we return false immediately. Otherwise, we continue the same process for the left and right children of the current node. We repeat this until all nodes have been checked. If none of the nodes violate the balance condition, then the tree is considered height-balanced.



## Algorithm

**Step 1: **If the current node is null, it means we’ve reached the end of a branch (an empty subtree). In this case, we return true because an empty tree is always balanced.

**Step 2:** We calculate the height of the left subtree and store it in a variable called “leftHeight”. Similarly, we calculate the height of the right subtree and store it in a variable called “rightHeight”. This is usually done using a separate helper method that recursively finds the height of a tree.

**Step 3: **We check the absolute difference between “leftHeight”and “rightHeight”.

If the difference is greater than 1, it means the current node is unbalanced, the tree is too deep on one side, so we return false.

**Step 4: **Now we recursively check the left and right subtrees to ensure they are also balanced. If both return true, then the current subtree (including the current node) is balanced. If either one returns false, it means the tree is unbalanced somewhere, so we return false.



## Time Complexity: **O(n²)**

**Explanation: **For each node, we calculate the height of its left and right subtrees separately. Since this height calculation itself takes O(n) time in the worst case and we do it for every node, the overall time complexity becomes **O(n²)**.

## Space Complexity: **O(n)**

**Explanation: **We’re using recursion, which means each function call is stored on the stack. At most, we’ll have “h” calls on the stack at once, where “h” is the height of the tree. In the worst case (**a skewed tree**), the height can be up to “n”, so the space complexity is **O(n)**.





# Optimal Approach

## Intuition

 In the previous approach(brute-force), we were checking the height of left and right subtrees separately for every node, which led to repeating the same work multiple times and led to O(n²) time complexity. To avoid this, we combine the **height calculation** and the **balance check** into **one function**. While we calculate the height, we also check if the tree is balanced. If we ever find a node where the left and right subtree heights differ by more than 1, we mark the whole tree as unbalanced by returning -1. If everything is fine, we return the actual height.



## Algorithm

**Step 1: **Start by checking if the current node is null. If it is, return 0 because an empty subtree has height 0 and is considered balanced.

**Step 2:  **Recursively calculate the height of the left and right subtrees using the same function.

**Step 3: **If either the left or right subtree returns -1, it means that subtree is already unbalanced. In that case, return -1 immediately to avoid further checks.

**Step 4: **Check the absolute difference between the left and right subtree heights. If the difference is greater than 1, the current node is unbalanced, so return -1.

**Step 5: **If the current node is balanced, return its height as **1 + max(left, right).**

**Step 6: **In the isBalanced() method, call the helper function on the root. If it returns -1, return false (tree is not balanced). Otherwise, return true.





## Time Complexity: **O(n)**

**Explanation: **We are recursively traversing each node in the binary tree exactly once to calculate the height and check if it is balanced. Since every node is visited only one time, the overall time complexity is **O(n)**, where *n* is the total number of nodes in the tree.

## Space Complexity: **O(n)**

**Explanation: **We’re using recursion, which means each function call is stored on the stack. At most, we’ll have “h” calls on the stack at once, where “h” is the height of the tree. In the worst case (**a skewed tree**), the height can be up to “n”, so the space complexity is **O(n)**





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/height-balanced-binary-tree-article)*
