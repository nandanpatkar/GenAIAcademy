# Top View of Binary Tree

> **Slug:** `top-view-of-binary-tree-article`  
> **Published:** 2026-04-24T10:18:05.744Z  
> **Updated:** 2026-04-24T10:18:05.746Z  
> **Keywords:** Test  
> **Cover Image:** ![Top View of Binary Tree](https://cdn.codehelp.in/media/Top View of Binary Tree.png)

**Description:** Binary tree top view explained with BFS traversal, horizontal distance mapping and sorted output using TreeMap.

---

## Problem Statement

In this problem, you are given a binary tree, and your task is to print the top view of this binary tree. The top view of a binary tree represents the set of nodes visible when the tree is viewed straight down from above. In other words, these are the nodes that appear when the tree is seen from the top, without any obstruction. To achieve this, you need to consider horizontal distances from the root node and ensure that you are only capturing the first node that appears at each horizontal distance. The nodes should be printed from the leftmost to the rightmost node in the top view.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: Binary Tree: [1, 2, 3, 4, 9, 6, 7, N, N, 8, N, N, N, N, N]
> 
> Output: Top View: [4,2,1,3,7]
> 
> Explanation: The top view includes nodes visible from the top: [4,2,1,3,7]







## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: Binary Tree: [1, 2, 3, 4, 5, 6, 7, N, 8, N, N, N, N, N, N, N, 9]** **
> 
> Output: Top View: [4, 2, 1, 3, 7]
> 
> Explanation: The top view includes nodes visible from the top: [4, 2, 1, 3, 7].





## Intuition

To get the top view of a binary tree, imagine some vertical lines passing through each node from top to bottom. Each vertical line represents a unique vertical index. 

- Left → vertical index decreases (−1, −2, …)
- Right → vertical index increases (+1, +2, …)



The root node is assigned a vertical index of 0. Moving left decreases the index by 1, and moving right increases it by 1. These indexes help us track nodes that lie on the same vertical line when viewed from the top. Now, the key idea is that for each vertical index, we want to capture the topmost node, the one that appears first when viewed from top.

To achieve this, we perform any** traversal** of the tree. While traversing, we store the first node we encounter at each vertical index in a **sorted map**(for java people** “TreeMap”**) so we can later print the result from **leftmost to rightmost index**. By the end of the traversal, this map will hold exactly the nodes visible from the top view of the binary tree.

## Algorithm

**Step 1: **Create a list “ans” to store the final result and check if the tree is empty then directly return the empty list.

**Step 2:** Create a sorted map to store the top view of nodes based on their vertical index position. The vertical index is the key of the map and the value is the node’s data.

**Step 3: **Initialize an empty queue to perform the level order traversal into the tree. For each and every node we’ll store the node's value and the vertical index of it. We’ll enqueue the root node along with the vertical index of it initialized to 0.

**Step 4: **While the queue is not empty, we keep processing one node at a time using level order traversal:

- For each node, we check its vertical index.
- If this index is not already in the map, we add the node’s value. This means it’s the first node seen at that vertical position, which is what we want for the top view.
- If the index is already in the map, we skip it because a higher node (closer to the top) has already been recorded.
- Then, we add the left child to the queue with a vertical index of **(currVerIdx - 1)** (moving left).
- And we add the right child with a vertical index of **(currVerIdx + 1)** (moving right).

**Step 5: **After the traversal, we iterate over the map to build the result. Since the map is sorted by vertical index the nodes are already in left to right order. We simply add each node’s value to the ans list and return it as the final top view of the tree.





## Time Complexity: **O(Nlogn)**

**Explanation: **

- Each of the **N nodes** is visited once during the **BFS traversal**, which takes **O(N)** time.
- For every node, we may insert its vertical index into a **map**, and each insertion takes **O(log N)** time(**TreeMap** for Java people/ **map **for c++ people).
- In the worst case, this results in **O(N log N)** total time due to TreeMap operations.

## Space Complexity: **O(N)**

**Explanation: **

- The **queue** used in BFS can hold up to **N/2 nodes** in the worst case (maximum width of a balanced binary tree).
- The **map **may also store up to **N/2 entries**, one for each unique vertical index.
- So overall, the space used is **O(N/2 + N/2) = O(N)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/top-view-of-binary-tree-article)*
