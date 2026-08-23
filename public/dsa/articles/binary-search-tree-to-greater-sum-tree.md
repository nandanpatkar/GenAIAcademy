# Binary Search Tree to Greater Sum Tree

> **Slug:** `binary-search-tree-to-greater-sum-tree`  
> **Published:** 2026-07-29T19:17:38.348Z  
> **Updated:** 2026-07-29T19:17:38.351Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Binary Search Tree to Greater Sum Tree](6a6a5144d4d58f79c62c4a37)

**Description:** Convert a Binary Search Tree to a Greater Sum Tree with reverse inorder traversal, Java code, and step-by-step explanation.

---

## Problem Statement

Given the root of a Binary Search Tree (BST), you need to convert it into a Greater Sum Tree. In a Greater Sum Tree, every node's key in the original BST should be modified to be the sum of the original key plus the sum of all keys that are greater than the original key in the BST.

Definition: A Binary Search Tree (BST) is a tree where each node follows the rules:

- The left subtree of a node contains nodes with keys lesser than the node's key.
- The right subtree of a node contains nodes with keys greater than the node's key.
- Both left and right subtrees also satisfy these rules.

## Example

> [!NOTE]
> **INFO**
> Example : BST: [4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8]
> 
> Output: [30, 36, 21, 36, 35, 26, 15, null, null, null, 33, null, null, null, 8]
> 
> Explanation: Converts each node in the BST to the corresponding node in the GST.

## Intuition

The key to solving this problem lies in how a **Binary Search Tree (BST)** is structured.

- Inorder traversal (Left → Root → Right) of a BST gives elements in **ascending order**.
- If we flip this and do a **reverse inorder traversal** (Right → Root → Left), we will get elements in **descending order**.

Now if we notice what the problem is asking, each node’s new value should be its own value **plus the sum of all greater values** in the tree.

This fits perfectly with a reverse inorder traversal:

- When we visit the largest node first (rightmost node), there are no greater elements, so its value stays the same.
- Then, as we move to smaller nodes, we can keep a running sum of everything we’ve already seen (which are all greater values).
- At each step, we simply **add this running sum** to the current node’s value.

By the time we finish, every node has been updated to hold the required greater sum value.

## Algorithm

**Step 1:** Start from the root and perform a **reverse inorder traversal** (Right → Root → Left).

**Step 2: **Maintain a variable sum that keeps track of the running sum of values we’ve already processed.

**Step 3: **For each node:

- First, move to the **right child** (greater values).
- Then, update the current node:
 **node.val = node.val + sum**
 and update **sum = node.val**.
- Finally, move to the **left child** (smaller values).

**Step 4: **Continue this until the entire tree is traversed.

**Step 5: **Return the root of the modified tree.





## **Time Complexity: O(N)**

**Explanation: **We visit each node exactly once during the reverse inorder traversal. At each step, the operations (addition and assignment) take constant time. So, the overall complexity is linear in the number of nodes.

## **Space Complexity: O(N)**

**Explanation: **The extra space comes from the recursion stack used in the traversal. In the best case (balanced BST), the height is about log N. In the worst case (**skewed BST**), the height can be N.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/binary-search-tree-to-greater-sum-tree)*
