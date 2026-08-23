# Zig-zag Level order Traversal of a binary tree

> **Slug:** `zig-zag-level-order-traversal-of-a-binary-tree-article`  
> **Published:** 2026-04-07T11:19:51.607Z  
> **Updated:** 2026-04-07T11:19:51.608Z  
> **Keywords:** None  
> **Cover Image:** ![Zig-zag Level order Traversal of a binary tree](https://cdn.codehelp.in/media/Zig-zag Level order Traversal of a binary tree.png)

**Description:** Binary Tree Zigzag Level Order Traversal using BFS Queue. Spiral/Wavy traversal solution with O(N) time complexity.

---

## Problem Statement

Given the root of a binary tree, your task is to perform a zigzag level order traversal of its nodes' values. This traversal, also known as "zigzag" or "wavy" order, requires that you traverse horizontally from left to right on one level, then from right to left on the next, and continue alternating the direction with each subsequent level. 

## Example 1

> [!NOTE]
> **INFO**: Example 1: Input: root = [1,2,3,4,5,6,7,null,null,8,null,null,9,null,null]
Output: [[1], [3, 2], [4, 5,6,7],[8,9]]
Explanation: The tree is traversed level by level with zigzag direction.





## Example 2

> [!NOTE]
> **INFO**: Example 2: Input: root = [1,2,3,null,null,4,5,6,null,null,null]
Output: [[1], [3, 2], [4, 5],[6]]
Explanation: Zigzag traversal for each level.



## Intuition

Zig-zag traversal is a variation of level order traversal where the direction of traversal alternates at each level. Unlike standard level order, which always goes left to right, zig-zag traversal goes **left to right on one level** and **right to left on the next**. This is achieved using a queue for level-wise processing and a “**LtoRdir**” flag to control the direction. At each level, we process all nodes in the queue, collect their values in the required order based on the flag, and add their children to the queue for the next level. After each level, we simply toggle the flag to switch the direction, creating a zig-zag or spiral pattern through the tree.

## Algorithm

To perform a zig-zag level order traversal on a binary tree, we use a queue to process nodes level by level and a 2D list (list of lists or vector of vectors) to store the final result, where each inner list represents one level of the tree.

**Step 1: **Initialize an empty queue to store nodes for traversal and an empty 2D vector **ans **to store the final result. If the binary tree is empty, return this empty ans list immediately.

**Step 2:** Create a boolean flag called “**LtoRdir**” and set it to **true **initially. This flag will help us control the order in which we add node values at each level(**left-to-right** or **right-to-left**).

**Step 3: **Enqueue the **root node** into the queue to start the traversal.

**Step 4: **Now, begin a loop that continues until the queue becomes empty, meaning all levels have been processed.

**Step 5: **For each iteration (representing a level in the tree), first get the **current size of the queue**, which tells us how many nodes are present at this level. Create a temporary list or vector called **level **of the same size to store the node values of this level.

**Step 6: **Process each node in this level one by one:

- Remove the front node from the queue.
- Determine the correct index at which to insert the node’s value in the level list. If **LtoRdir **is **true**, insert the value at index **i (left to right)**. If LtoRdir is false, insert the value at index **size-1-i (right to left)**.
- Add the node’s value to the calculated index in the level list.
- If the current node has a left or right child, enqueue them into the queue for processing in the next level.

**Step 7: **After all nodes at the current level have been processed, add the level list to the ans list. Then, **toggle the LtoRdir flag** to switch the direction for the next level.

**Step 8: **Once the queue is empty, all levels have been traversed. Return the ans list as the final zig-zag level order traversal of the binary tree.





## Time Complexity: **O(N)**

**Explanation: **The time complexity is O(N), where N is the number of nodes in the binary tree. Each node is visited once added to the queue and processed with constant time operations resulting in a linear traversal.

## Space Complexity: **O(N)**

**Explanation: **The space complexity is also O(N). In the worst case, the queue may hold up to N/2 nodes (from the last level), and the final result stores all N node values. Both together contribute to an overall O(N) space usage.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/zig-zag-level-order-traversal-of-a-binary-tree-article)*
