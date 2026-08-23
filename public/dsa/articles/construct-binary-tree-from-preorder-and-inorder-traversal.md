# Construct Binary Tree from Preorder and Inorder Traversal

> **Slug:** `construct-binary-tree-from-preorder-and-inorder-traversal`  
> **Published:** 2026-07-21T15:24:26.495Z  
> **Updated:** 2026-07-21T15:24:26.500Z  
> **Keywords:** Tree  
> **Cover Image:** ![Construct Binary Tree from Preorder and Inorder Traversal](https://cdn.codehelp.in/media/Construct Binary Tree from preorder and inorder traversal.png)

**Description:** Binary tree construction from preorder and inorder traversal explained with intuition, algorithm and time complexity.

---

## Problem Statement

You are provided with two integer arrays, **preorder** and **inorder**, which represent the pre-order and in-order traversals of a binary tree. Your task is to construct the binary tree from these traversals.

In the pre-order traversal, nodes are visited in the order: **Root → Left → Right**. Meanwhile, in the in-order traversal, they are visited in the order: **Left → Root → Right**.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]
> 
> Output: [3, 9, 20, null, null, 15, 7]
> 
> Explanation: Constructs a tree where 3 is the root, with 9 as left child and 20 as right child, and 15 and 7 as children of 20.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: preorder=[1,2,3], inorder=[2,1,3]
> 
> Output: [1, 2, 3]
> 
> Explanation: Simple binary tree with 1 as root, 2 as left child, and 3 as right child.

## Intuition

To rebuild a binary tree, we can make use of the preorder and inorder traversals effectively:

- Preorder traversal always gives us the root node first.
- Inorder traversal helps us identify the left and right subtrees for any given root, since it follows the** Left -> Root -> Right** pattern.

Using this, we can recursively build the tree one node at a time:

- Start by picking the current root from the preorder array.
- Find that root in the inorder array. This splits the inorder array into two parts: left of the root **(left subtree)** and right of the root **(right subtree)**.
- Repeat the same process for the left and right halves recursively.

To avoid slicing arrays (which is inefficient), we’ll just pass the start and end indices to keep track of which part of the array we’re currently working on. Since finding the index of the root in the inorder array can take **O(N)** time every time, we’ll use a **HashMap **to store the indices of elements from the inorder array. This will allow constant-time lookup and speed up the solution.

## Algorithm

**Step 1: **Create a map to store the index of each element in the inorder array. This allows us to find the root's position in O(1) time.

**Step 2:** Define a recursive function “**buildTree” **with the following parameters:

- preorder, preStart, preEnd
- inorder, inStart, inEnd
- And the map

**Step 3: **Handle the base case. If **preStart > preEnd **or **inStart > inEnd**, return null because this means the current subtree range is empty.

**Step 4: **Get the root value from **preorder[preStart]**. This is the root of the current subtree. Create a new node with this value.

**Step 5: **Look up the index of the root in the inorder array using map. This gives you rootIndex. Now, calculate the size of the left subtree using **leftSubtreeSize = rootIndex - inStart.**

**Step 6: ** Recursively build the left and right subtrees:

- For the left subtree, the new indices will be:
** preStart + 1 to preStart + leftSubtreeSize** in preorder
 and **inStart to rootIndex - 1 **in inorder.
- For the right subtree, the indices will be:
 **preStart + leftSubtreeSize + 1** to preEnd in preorder
 and **rootIndex + 1** to inEnd in inorder

**Step 7: **Link the left and right subtrees to the root node and return the root. This process continues recursively and constructs the entire tree.





## Time Complexity: **O(N)**

**Explanation: **We traverse each node of the binary tree exactly once during the construction process. Since there are N nodes, the total time taken is O(N).

## Space Complexity: **O(N)**

**Explanation: **There are two main components that contribute to space usage:

1. We use a HashMap to store the indices of the inorder traversal. This takes O(N) space, where N is the number of nodes.
2. The recursive calls to build the tree use stack space. In the worst-case scenario (e.g., when the tree is completely unbalanced or skewed), the recursion depth can go up to N, making the auxiliary space O(N) as well.

So, the overall space complexity is O(N) in the worst case.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/construct-binary-tree-from-preorder-and-inorder-traversal)*
