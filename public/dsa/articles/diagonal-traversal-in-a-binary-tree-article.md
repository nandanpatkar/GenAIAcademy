# Diagonal Traversal in a Binary Tree

> **Slug:** `diagonal-traversal-in-a-binary-tree-article`  
> **Published:** 2026-04-24T10:20:30.838Z  
> **Updated:** 2026-04-24T10:20:30.846Z  
> **Keywords:** Test  
> **Cover Image:** ![Diagonal Traversal in a Binary Tree](https://cdn.codehelp.in/media/Diagonal Traversal in a binary tree.png)

**Description:** Understand diagonal traversal in binary tree with intuition, naive TreeMap approach and optimized queue method.

---

## Problem Statement

Given the root of the binary tree. Your task is to perform its diagonal traversal. In a diagonal traversal, nodes are grouped by their diagonals. The rules for forming the diagonals are:

- A node’s right child is on the same diagonal as the node.
- A node’s left child is on the next diagonal.
- You start from the root and add nodes from the topmost diagonal to the bottom diagonals, moving rightwards before moving downwards to the left.
- If the diagonal elements are present in two different subtrees, then the left subtree diagonal element should be taken first and then the right subtree.

## Example 1

> [!NOTE]
> **INFO**
> **Input:** root = [8,3,10,1,6,null,14,null,null,4,7,13,null]
> 
> **Output:** [8, 10, 14, 3, 6, 7, 13, 1, 4]
> 
> **Explanation:** The nodes are traversed diagonally from top right to bottom left as per the diagonal order.





## Example 2

> [!NOTE]
> **INFO**
> **Input:** root = [1,2,3]
> 
> **Output:** [1, 3, 2]
> 
> **Explanation:** The root and its right child are on the same diagonal, left child on next diagonal.

# **Naive **Approach

## Intuition

To understand diagonal traversal, imagine lines drawn across the tree from t**op-right(diagonally)** to **bottom-left(diagonally)**, these lines define the diagonals. The idea is to collect nodes that fall along the same diagonal.

Now if we observe:

- The **right child of a node stays on the same diagonal.**
- While the **left child moves to the next diagonal (diagonal index +1)**.

So, here's how we process the tree:

1. We use a **queue** to perform a controlled traversal of the tree.
2. We start by adding the **root node** to the queue.
3. For every node removed from the queue:
4. - Add all its **right children** (one after another) directly to the current diagonal, just keep following the right pointers.
  - We’ll add those nodes into our sorted map(for java people **TreeMap**) where the diagonal index would be the key of our map, and for each diagonal index we’ll add those nodes.
  - But if you find a **left child** at any point, add it to the queue, it belongs to the next diagonal and will be processed later, so we add it into the queue.

This approach ensures we traverse all diagonals in order, from top-right to bottom-left, while maintaining the constraint that if diagonal elements exist in both subtrees, we visit the left subtree nodes first.





(**NOTE**: **Why not level order traversal(BFS)? -> **Level order traversal processes nodes level by level, left to right  it doesn't respect diagonal grouping. This could cause nodes from the right subtree to appear before those from the left on the same diagonal, which violates the problem’s condition.)

## Algorithm

**Step 1: ** Initialize an empty list ans to store the final diagonal traversal result.
 Also, create a **sorted map** (in Java - **TreeMap**) to store nodes according to their diagonal index. The key will represent the diagonal index, and the value will be a list of node values on that diagonal.

**Step 2:** Use a **queue** to help with tree traversal. Start by adding the root node to the queue along with its diagonal index, which is 0.

**Step 3: ** While the queue is not empty, repeat the following steps:

- Remove a node and its diagonal index from the front of the queue.
- Use an inner loop to go through all right children from the current node:
- - Add the current node’s value to the list mapped to its diagonal index.
  - If the node has a **left child**, add it to the queue with diagonal index **di + 1**.
  - Move to the right child** (node = node->right)** and continue.

**Step 4: **Repeat the above process until the queue becomes empty, which means all nodes have been visited and stored in the map.

**Step 5: ** Finally, go through the sorted map in order of diagonal indices. For each diagonal, add all node values to the ans list in sequence.





## Time Complexity: **O(N log N)**

**Explanation: **We traverse the entire binary tree once, visiting each of the **N** nodes — which gives us a base cost of **O(N)**. However, we’re also using a **TreeMap (sorted map)** to store node values based on their diagonal index.

- Inserting a value into a TreeMap takes **O(log N)** time (because it maintains sorted order internally).
- So, for **N insertions**, the total time becomes **O(N log N)**.

Hence, the overall time complexity is **O(N log N)**.

## Space Complexity: **O(3N) ~~ O(N)**

**Explanation: **To store the final result we are using a list which will store all the node’s data so it will take O(N) space. We are using a map to store all the nodes according to it;s diagonal index, as we are storing all the nodes in the tree so it will take O(N) space. To traverse the tree we are using a queue data structure which can take O(N) space at the worst case(in case the tree is a skewed tree) where N is the number of nodes present in the tree.



# **Optimal **Approach

## Intuition

** **In the previous approach, we used a map to group nodes by their diagonal index, which added some extra time and space complexity due to sorting and storage.

In this optimized version, we eliminate the need for a map altogether by directly building the diagonal traversal list while traversing the tree.

Here’s how the idea works:

- We start by adding the root node into a queue along with a dummy diagonal index (which we don’t really use anymore).
- From each node, we move along its right child chain, because all right children lie on the same diagonal. So we can add them directly to our result list (ans).
- While moving through this chain, if a node has a left child, we enqueue it to the queue because left children belong to the next diagonal, and we’ll process them later.
- We repeat this process until the queue becomes empty.

By doing this, we’re effectively traversing the diagonals from **top-right** to **bottom-left** in one pass, and our final list “**ans**” will already contain the correct diagonal order, no need to use a map or sort anything later.

This approach is both time-efficient and space-efficient, and it simplifies the implementation as well.

## Algorithm

**Step 1: **Initialize an empty list ans to store the result of the diagonal traversal.

**Step 2:** Create a queue to help with traversal.
 Add the root node to the queue along with a diagonal index (e.g., 0).
 (Note: The diagonal index isn't used for grouping here — it's just to match the Pair structure.)

**Step 3: **While the queue is not empty, do the following:

- Remove the front node and its diagonal index from the queue.
- Use a loop to move along the current node’s **right child chain**:
- - Add the current node’s value to the ans list.
  - If the node has a **left child**, add it to the queue (we’ll process it later, as it starts a new diagonal).

Move to the **right child** and continue.

**Step 4: **Repeat this process until the queue becomes empty, which means all diagonals have been processed.

**Step 5: **At the end, the list “**ans**” will contain the final diagonal traversal of the tree, which can be returned directly.

## Time Complexity: **O(N)**

**Explanation: **We are visiting each node in the binary tree exactly once during the traversal.
 So the total time taken is proportional to the number of nodes, which is **O(N)**, where **N** is the total number of nodes in the tree.

## Space Complexity: **O(N)**

**Explanation: **We are using two main data structures:

- An **ans list** to store the final diagonal traversal, which takes **O(N)** space since it stores all node values.
- A **queue** for traversal, which in the worst case (e.g., a completely skewed tree) may hold up to **N** nodes.

Therefore, the overall space complexity is also **O(N)**.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/diagonal-traversal-in-a-binary-tree-article)*
