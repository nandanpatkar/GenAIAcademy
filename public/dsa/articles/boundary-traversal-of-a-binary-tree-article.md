# Boundary Traversal of a Binary Tree

> **Slug:** `boundary-traversal-of-a-binary-tree-article`  
> **Published:** 2026-04-24T10:18:26.432Z  
> **Updated:** 2026-04-24T10:18:26.433Z  
> **Keywords:** Test  
> **Cover Image:** ![Boundary Traversal of a Binary Tree](https://cdn.codehelp.in/media/Boundary Traversal_.png)

**Description:** Boundary traversal of binary tree anti-clockwise using left boundary + leaf nodes + right boundary reverse. O(N) time DSA.

---

## Problem Statement

Given a binary tree, your task is to perform a boundary traversal. The boundary traversal of a binary tree involves visiting the boundary nodes in an anti-clockwise direction, starting from the root. The boundary includes three parts:

**Left Boundary:** Traverse all nodes on the left edge of the tree, from the root down to the last node before a leaf, excluding the last leaf node.

**Leaf Nodes:** These are all the nodes that do not have any children. You should visit all the leaf nodes in the tree from left to right.

**Right Boundary:** Traverse all nodes on the right edge of the tree, from the last node before a leaf up to the root, excluding the root and last leaf nodes.

The task is to return a list of integers representing the values of nodes in the order of their boundary traversal.

## Example 1

> [!NOTE]
> **INFO**
> **Input:** root = [1, 2, 3, 4, 5, null, null, 7, 8, null, 9]
> 
> **Output:** [1, 2, 4, 7, 8, 9, 3]
> 
> **Explanation:** Boundary traversal visits left boundary, leaves, and right boundary in the correct order.





## Example 2

> [!NOTE]
> **INFO**
> **Input:** root = [1, null, 2, null, 3]
> 
> **Output:** [1, 3, 2]
> 
> **Explanation:** Straight line tree to the right.





## Intuition

To perform the boundary traversal of a binary tree, we divide the task into three parts: the **left boundary**, the **leaf nodes**, and the **right boundary**. We start by adding the root node **(if not null)** to the result.

- **Left Boundary: **Starting from the root’s left child, we move down the left side of the tree. At each step, we go to the left child if it exists; otherwise, we move to the right child. We stop once we reach a leaf node. Importantly, we skip adding any leaf node during this step to avoid duplicates.
- **Leaf Nodes: **We perform a standard preorder traversal of the entire tree. For each node, we check if it’s a leaf **(it has no left or right child)**. If it is, we add it to our result. This ensures that all leaf nodes are collected from left to right, no matter where they are located.
- **Right Boundary: **Starting from the root’s right child, we move down the right side of the tree. Similar to the left boundary, we go to the right child if it exists, otherwise to the left. We stop at leaf nodes and skip them to prevent duplicates. The right boundary nodes are added in reverse (bottom-up) order, so we store them in a temporary list and reverse it before adding to the final result.





Finally, we combine all three parts, **the root, the left boundary, the leaf nodes, and the reversed right boundary **to get the complete boundary traversal of the tree.

## Algorithm

**Step 1: **Initialize an empty list ans to store the final result. If the root of the binary tree is null, return the empty list immediately.

**Step 2:** Add the root node. If the root is not a leaf node, we add the root’s value to the result list since it is always part of the boundary.

**Step 3: **Traverse the Left Boundary (excluding leaf nodes)
 Use a helper function leftBoundary(node, ans):

- Start from the root’s left child and keep moving to the left.
- If a left child doesn’t exist, move to the right child.
- At each step, add the node’s value to the result list.
- If a node is a leaf (has no left or right children), we skip it as leaf nodes are handled separately.

**Step 4: **Add All Leaf Nodes (from left to right)
 Use a helper function leafNode(node, ans):

- Traverse the entire tree using a recursive preorder traversal.
- If the current node is a leaf (no left and right children), add its value to the result list.
- This ensures all leaf nodes  from both left and right subtrees are included in order.

**Step 5:** Traverse the Right Boundary (excluding leaf nodes, in reverse order)
 Use a helper function rightBoundary(node, ans):

- Start from the root’s right child and keep moving to the right.
- If a right child doesn’t exist, move to the left child.
- Just like the left boundary, skip leaf nodes here as well.
- Since we want the right boundary in bottom-up order, store these nodes in a temporary list during traversal and add them to the final result after reversing.

**Step 6:** Return the final result list. At this point, the list **ans** will contain the boundary traversal in the correct anti-clockwise order:** Root → Left Boundary → Leaf Nodes → Reversed Right Boundary.**





## Time Complexity: **O(N)**

**Explanation: **We visit each node of the binary tree at most once, so the total time complexity is O(N), where N is the number of nodes in the tree. Here's how the time is spent in different parts:

- **Left Boundary:** We traverse down the left side of the tree. In the worst case (for a completely left-skewed tree), this can take up to O(N) time.
- **Leaf Nodes:** We perform a preorder traversal of the entire tree to find all leaf nodes. This also takes O(N) time as every node is visited once.
- **Right Boundary:** Similar to the left boundary, we traverse down the right side of the tree. In the worst case (right-skewed tree), this traversal can also take up to O(N) time.

## Space Complexity: **O(N)**

**Explanation: **We use a list to store the final boundary traversal, which in the worst case may hold all N nodes, contributing O(N) space. Additionally, recursive function calls (for **left, leaf, and right traversals**) consume stack space:

- In a balanced tree, the recursion depth is **O(log N)**.
- In the worst-case (**skewed tree**), the recursion depth can go up to **O(N)**.

Hence, the overall space complexity in the worst case is O(N).







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/boundary-traversal-of-a-binary-tree-article)*
