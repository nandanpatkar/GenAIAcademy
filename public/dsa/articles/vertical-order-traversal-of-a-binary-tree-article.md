# Vertical Order Traversal of a Binary Tree

> **Slug:** `vertical-order-traversal-of-a-binary-tree-article`  
> **Published:** 2026-04-24T10:17:38.180Z  
> **Updated:** 2026-04-24T10:17:38.182Z  
> **Keywords:** Test  
> **Cover Image:** ![Vertical Order Traversal of a Binary Tree](https://cdn.codehelp.in/media/Vertical Order traversal of a binary tree.png)

**Description:** Binary tree vertical order traversal explained with BFS traversal, coordinate mapping and sorted output rules.

---

## Problem Statement

Your task is to implement a function that performs a **vertical order traversal** of a binary tree, returning the values of the nodes as described: Given a binary tree represented by its root node, you must structure the nodes column-wise, starting from the leftmost column to the rightmost column. Nodes are sorted top to bottom within each column, based on their row values. Additionally, if multiple nodes are located in the same position, they should be sorted by their values. The tree is traversed such that for any ***Node*** at position ***(row, col)***, its left child is positioned at ***(row + 1, col - 1)***, and its right child is positioned at ***(row + 1, col + 1)***. The root of the tree starts at ***(0, 0)***.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root = [3,9,20,null,null,15,7]
> 
> Output: [[9], [3, 15], [20], [7]]
> 
> Explanation: Nodes are ordered by vertical column, with nodes in the same row and column ordered by value.





## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: root = [1,2,3,4,5,6,7]
> 
> Output: [[4], [2], [1, 5, 6], [3], [7]]
> 
> Explanation: Nodes are arranged by their vertical positions.





## Intuition

To understand the vertical order traversal of a binary tree, imagine vertical lines passing through the tree from top to bottom and horizontal lines representing each level of the tree. Every node in the tree lies at the intersection of one vertical and one horizontal line, giving it a coordinate (x, y) where x represents the vertical position (column index), and y represents the horizontal level (row index). The root node starts at coordinate (0, 0). When you move to the left child, the vertical index decreases by 1 (x - 1), and when you move to the right child, it increases by 1 (x + 1). At the same time, going down one level in the tree always increases the level index by 1 (y + 1).







We use a nested map structure to store the nodes during traversal:

- The outer map uses the vertical index x as the key.
- The inner map uses the level index y as the key.
- At each (x, y) position, we store the node values in a priority queue to ensure they are sorted if multiple nodes fall in the same position.

To fill this map correctly, we perform a level-order traversal (BFS) starting from the root. Each element in the queue holds a node along with its (x, y) coordinates. As we traverse:

- We record the node in the map at its corresponding (x, y) position.
- We add the left child to the queue with coordinates (x - 1, y + 1).
- We add the right child with coordinates (x + 1, y + 1).



After finishing the traversal, we construct the result by:

- Iterating through the outer map from the smallest to the largest x (i.e., leftmost to rightmost column).
- For each column, we go through all its levels in order of increasing y.
- At each (x, y), we retrieve the node values from the priority queue (automatically sorted) and add them to the result.

This approach ensures that we return the vertical order traversal with all constraints handled: top-to-bottom order per column and sorted values at the same position.

## Algorithm

**Step 1: ** Initially, create a 2D list “ans” to store the final result. Then, define a nested map to keep track of each node's value along with its vertical and level positions. The outer map uses the vertical index x (which represents the column), and the inner map uses the level index y (which represents the row/depth/level of the tree). At each position (x, y), we store node values in a priority queue to ensure values are sorted when multiple nodes fall on the same position.

**Step 2:** ** **For traversing the tree, use a queue to perform a level order traversal (BFS). Each element in the queue holds a node along with its (x, y) coordinates. Begin by adding the root node to the queue with initial coordinates (0, 0), where x = 0 is the vertical index and y = 0 is the level index.

**Step 3: **While the queue is not empty, remove the front element and do the following:

- Extract the node and its (x, y) position.
- Insert the node's value into the map at its corresponding (x, y) location.
- If the node has a left child, add it to the queue with coordinates (x - 1, y + 1) since it moves one column left and one level down.
- If the node has a right child, add it with coordinates (x + 1, y + 1) since it moves one column right and one level down.

**Step 4:  **After the traversal is complete, iterate through the outer map in order of increasing vertical index x (i.e., from leftmost to rightmost column). For each column, go through the levels in order of increasing y (top to bottom). At each position (x, y), extract the values from the priority queue (which are already sorted) and collect them into a list. Add this list to the final 2D result list “ans”, and finally return “ans” as the vertical order traversal of the tree.





## Time Complexity: O(N logN)

**Explanation:**

1. We use level-order traversal (BFS), visiting each of the N nodes exactly once. So for the traversal it takes O(N).
2. Inserting into the map takes around O(log N) per node, so for each node is inserted into a nested TreeMap<x, TreeMap<y, PriorityQueue>>.
3. So for each of the N nodes, insertions can take up to O(log N). Total insertion cost: O(N log N)
4. Building the result takes O(N log N) time. We extract all node values from the map and priority queues. Removing elements from a PriorityQueue takes log k time, adding up to O(N log N) in total.
5. After summing up everything, the time complexity is near about ~ O(N logN).

## Space Complexity: **O(N)**

**Explanation: **

1. As we are using Queue for the level order traversal hence maximum level of the tree which can be O(N/2) in the worst case of a balanced tree.
2. The map which we are using to store all the nodes of the tree will take O(N) space.
3. Hence total space complexity ~ O(N)





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/vertical-order-traversal-of-a-binary-tree-article)*
