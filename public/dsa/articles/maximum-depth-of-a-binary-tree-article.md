# Maximum depth of a Binary tree

> **Slug:** `maximum-depth-of-a-binary-tree-article`  
> **Published:** 2026-04-24T10:20:03.042Z  
> **Updated:** 2026-04-24T10:20:03.044Z  
> **Keywords:** Test  
> **Cover Image:** ![Maximum depth of a Binary tree](https://cdn.codehelp.in/media/Maximum depth of a Binary tree.png)

**Description:** Maximum Depth of Binary Tree (Height) using BFS Level Order Traversal and DFS Recursion. DSA solution + complexity.

---

## Problem Statement

Given the root of a binary tree, return depth of that binary tree. The maximum depth of a binary tree is the number of nodes present on the longest path from root to leaf node.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root = [1,2,3,null,null,4,5,6]
> 
> Output: 4
> 
> Explanation:  In this example the maximum depth of this binary tree is 1 -> 3 -> 4 -> 6





## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: root = [1,2,null,3,null,4,null]
> 
> Output: 4
> 
> Explanation: In this example the maximum depth of this binary tree is 1 -> 2 -> 3 -> 4





# **Iterative **Approach

## Intuition

To find the depth of a binary tree, we can use level order traversal, which helps us explore the tree level by level. We start by placing the root node into a queue and use a counter to keep track of how many levels we've processed. For each level, we remove all the nodes currently in the queue, and for each node, we add its children to the queue for the next level. Once we finish processing all nodes at the current level, we increment the counter. This process continues until there are no more nodes left to process. By the end, the counter will hold the total number of levels in the tree, which is the depth we're looking for.

## Algorithm

**Step 1: ** Initialize a queue to perform level order traversal and a variable “depth” to keep track of the depth. If the root is null, return 0 immediately, as it represents an empty tree.

**Step 2:** Add the root node to the queue.

**Step 3: **Loop until the queue becomes empty:

- Get the current size of the queue (This represents the number of nodes at the current level).
- Iterate through all nodes at the current level by removing each node from the queue, and if it has left or right children, add them to the queue.
- After processing all nodes at the current level, increment the “depth” variable to indicate moving to the next level.

**Step 4: **Once the queue is empty, return the “depth” variable, which now holds the maximum depth of the binary tree.





## Time Complexity: **O(N)**

**Explanation: **The time complexity is **O(N)**, where N is the total number of nodes in the binary tree. This is because during level order traversal, we visit each node exactly once to calculate the depth.

## Space Complexity: **O(N)**

**Explanation: **The space complexity is also **O(N)**. In the worst-case scenario, especially when the tree is completely balanced, the last level can contain up to **N/2** nodes. These nodes will all be stored in the queue at the same time, leading to a space usage proportional to the number of nodes in the tree.





# **Recursive **Approach

## Intuition

 To find the depth of a binary tree, we need to calculate the height of its left and right subtrees. For any given node, the maximum depth from that node is the greater height between its left and right subtrees, **plus 1** (to include the current node itself). We can do this recursively, by exploring both the left and right children of each node and returning the maximum depth found. In the end, this gives us the longest path from the root to a leaf.

## Algorithm

**Step 1:  **If the current node is null, return 0. This means we’ve reached beyond a leaf node.

**Step 2:  **Recursively call the same function to find the depth of the left subtree and the right subtree. This helps us explore how deep the tree goes in both directions from the current node.

**Step 3: **Once we have the depths of both subtrees, we take the maximum of the two because we’re interested in the longest path and add 1  to it to include the current node. So, **depth = 1 + max(leftDepth, rightDepth)**.

**Step 4: **We’ll repeat this process until the** **recursion ends. Finally, when we return back to the root node, we get the maximum depth of the entire binary tree.





## Time Complexity: **O(n)**

**Explanation: **If we observe carefully, we are recursively traversing all the nodes in the binary tree, resulting in a time complexity of O(n).

## Space Complexity: **O(n)**

**Explanation: **Since we are recursively traversing the entire binary tree, in the worst-case scenario such as when the tree is skewed, the call stack may hold up to n function calls (where n is the number of nodes in the tree). Hence, the space complexity is O(n).





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/maximum-depth-of-a-binary-tree-article)*
