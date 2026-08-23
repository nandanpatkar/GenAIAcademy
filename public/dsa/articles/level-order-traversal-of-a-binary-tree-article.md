# Level order Traversal of a binary tree

> **Slug:** `level-order-traversal-of-a-binary-tree-article`  
> **Published:** 2026-04-24T10:16:39.142Z  
> **Updated:** 2026-04-24T10:16:39.144Z  
> **Keywords:** Test  
> **Cover Image:** ![Level order Traversal of a binary tree](https://cdn.codehelp.in/media/Level order Traversal of a binary tree.png)

**Description:** Binary Tree Level Order Traversal (BFS) using Queue in C++/Java. Step-by-step algorithm + O(n) complexity.

---

## Problem Statement

Given the root of a binary tree, you need to return the level order traversal of its nodes' values. Level order traversal means visiting all the nodes at each level in left-to-right order, one level at a time.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root = [10, 9, null, 8, null, 7, null]
> 
> Output: [[10], [9], [8], [7]]
> 
> Explanation: Left-skewed tree with each node having only a left child.





## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: root = [1]
> 
> Output: [[1]]
> 
> Explanation: Single-node tree.





## Intuition

To perform a level order traversal on a binary tree, we use a queue along with a 2D list to capture the result where each inner list holds the values of one level. We start by adding the root node to the queue. From there, we work through the tree level by level, continuing as long as the queue isn’t empty. For each level, we figure out how many nodes are currently in the queue which tells us how many nodes are on that level. We then create a temporary list to store those node values. As we go through each node, we take it out of the queue, add its value to the list, and if it has any children, we add them to the queue for the next level. Once we’ve finished all the nodes for the current level, we add that list to our final result. We repeat this process until there are no more nodes left to process.

## Algorithm

**Step 1: **Create an empty queue to store the nodes during traversal and a 2d array to store the final result level-by-level.

**Step 2:** Add the root of the binary tree into the queue

**Step 3: **Iterate until the queue is empty: 

- Check the size of the queue (currently the queue consists of nodes in a single level)
- Create a temporary array to store those nodes in a single level
- Intrate till the number of nodes in the current level
- Now for each node store it into the 1d array and check for its left and right nodes, if they exist then store it into the queue.
- After iterating all the nodes in the current level we store the 1d array int to out final 2d array

**Step 4: **Repeat this process until the queue is empty and then return the final 2d array which contains level order traversal of the binary tree.



## Time Complexity: **O(n)**

**Explanation: **We are processing all the nodes in the binary tree, we are doing enqueue and dequeue for all the nodes and then adding it to our answer we are doing all operation in O(1) time hence time complexity **O(n)**

## Space Complexity: **O(n)**

**Explanation: **In the worst case scenario we’ll be storing all the nodes at the last level of that binary tree in our queue, at max n/2 numbers of nodes can be there. On the other hand we are storing all the nodes in our 2d array. Hence space complexity** O(n)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/level-order-traversal-of-a-binary-tree-article)*
