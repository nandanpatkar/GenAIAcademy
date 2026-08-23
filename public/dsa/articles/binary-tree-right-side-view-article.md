# Binary Tree Right Side View

> **Slug:** `binary-tree-right-side-view-article`  
> **Published:** 2026-04-24T10:19:13.678Z  
> **Updated:** 2026-04-24T10:19:13.680Z  
> **Keywords:** Test  
> **Cover Image:** ![Binary Tree Right Side View](https://cdn.codehelp.in/media/Binary Tree Right Side View.png)

**Description:** DSA Right view of binary tree: level order traversal to collect last node of every level. Time O(N), space O(N).

---

## Problem Statement

Given the root of a binary tree, imagine standing on the right side of it. You want to see the values of the nodes that are visible from this right side, ordered from top to bottom. Your task is to write a function that returns these visible node values.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root =** **[1,2,3,4,5,6,7,N,8,N,N,N,N,N,N,N,9]
> 
> Output:  [1,3,7,8,9]
> 
> Explanation: The nodes visible from the right are 1, 3, 7,8 and 9.





## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: root = ** **[1,2,3,4,5,6,7,N,N,N,8,N,N,4,N,N,9]
> 
> Output:  [1,3,7,4,9]
> 
> Explanation: The nodes visible from the right are 1, 3,7,4 and 9





## Intuition

To get the right side view of a binary tree, imagine standing on the right side of the tree and looking at it level by level. From this angle, at each level, only the rightmost node is visible because the nodes to its left are hidden behind it. So, the idea is simple: We can do a level order traversal of the tree. While traversing each level, we just need to pick the last node (i.e., the rightmost node) from that level and add it to our result list. By the end of the traversal, this list will contain all the nodes that are visible from the right side of the tree.

## Algorithm

**Step 1: **Create an empty list “ans” to store the final right-side view of the binary tree. If the tree is empty (i.e., root is null), return the empty list immediately.

**Step 2:** Initialize a queue to help with level order traversal (also known as BFS). Add the root node to the queue.

**Step 3: **While the queue is not empty, repeat the following steps:

- Find the number of nodes in the current level using queue.size().
- Loop through all the nodes at the current level:
- - Remove  the front node from the queue.
  - If the node has a left child, add it to the queue.
  - If the node has a right child, add it to the queue.
  - If it's the last node of the current level, add its value to the ans list (this node is visible from the right side).
- We’ll continue this process until the queue is empty.

**Step 4: **Once all levels are processed, return the “ans” list containing the right side view of the binary tree.



## Time Complexity: **O(N)**

**Explanation: **We visit each node in the binary tree exactly once during the level order traversal. So, if there are N nodes in the tree, the total time taken is O(N).

## Space Complexity: **O(N)**

**Explanation: **We use two extra data structures: The ans list to store the right-side view, which in the worst case can hold up to N nodes. The queue is used for level order traversal, which can also hold up to N nodes at a time in the worst case (like when the tree is completely unbalanced or skewed). Hence, the total space used is O(N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/binary-tree-right-side-view-article)*
