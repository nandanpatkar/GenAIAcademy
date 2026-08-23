# Diameter of a Binary Tree

> **Slug:** `diameter-of-a-binary-tree-article`  
> **Published:** 2026-04-24T10:18:45.889Z  
> **Updated:** 2026-04-24T10:18:45.890Z  
> **Keywords:** Test  
> **Cover Image:** ![Diameter of a Binary Tree](https://cdn.codehelp.in/media/Diameter of a binary tree.png)

**Description:** Find diameter of binary tree (longest path between two nodes) using recursion, subtree height and O(N) solution.

---

## Problem Statement

You are given the root of a binary tree. Your task is to determine the length of the diameter of the tree.

The diameter of a binary tree is defined as the length of the longest path between any two nodes in the tree. This path does not necessarily pass through the root node.

The length of a path is represented by the number of edges between the two nodes.

## Example 1

> [!NOTE]
> **INFO**
> **Input:** root = [1,2,3,4,5]
> 
> **Output:** 4
> 
> **Explanation:** Longest path is through nodes 4 -> 2 -> 1 -> 3 or 5 -> 2 -> 1 -> 3.





## Example 2

> [!NOTE]
> **INFO**
> **Input:** root = [1,2,3]
> 
> **Output:** 3
> 
> **Explanation:** Longest path is 2 edges in length (2 -> 1 -> 3).





# Brute-force Approach

## Intuition

To find the diameter of a binary tree, imagine checking every node and asking:
 **"What is the longest path that passes through me?"**

This path would include:

- The height of the **left subtree (longest path going down left)**,
- The height of the **right subtree (longest path going down right)**,
- And the sum of these two gives the diameter passing through that node.

We do this for every node and keep track of the maximum diameter we find using a global variable. To calculate the height of any subtree, we use a helper function **“height”**. By doing this recursively for all nodes, we ensure we check every possible diameter, and the largest one is our answer.





## Algorithm

**Step 1: **We’ll use a global variable diameter** **to store our final answer. If the root of the binary tree is null, we return 0 immediately because there’s no diameter to calculate.

**Step 2:** We create a helper function height to calculate the height of the tree starting from any given node. In this function, we recursively find the height of the left and right subtrees. The height of a node is calculated as 1 + max(left height, right height).

**Step 3: **For every node, we calculate the diameter passing through it by adding the height of its left and right subtrees **(leftH + rightH)**. We update the global diameter variable by taking the maximum between the current value and this sum using Math.max(diameter, leftH + rightH).

**Step 4: **We recursively apply this logic to every node in the tree by calling the main function on both the left and right child nodes. This ensures that we calculate the diameter through every possible node. After the traversal is complete, the value stored in the diameter variable will be our final answer.





## Time Complexity: **O(N²)**

**Explanation: **We are traversing the entire binary tree, which takes O(N) time. But for each node, we are also calculating the height of its left and right subtrees, which again takes O(N) in the worst case. Since this height calculation is repeated for every node, the overall time complexity becomes O(N²).

## Space Complexity: **O(N)**

**Explanation: **We are using recursion to both traverse the tree and compute its height. The space used by recursion depends on the height of the tree. In the worst-case scenario -> like a skewed tree, the height can go up to N, leading to a space complexity of O(N).





# **Optimal **Approach

## Intuition

In the previous approach, we were calculating the height of subtrees again and again for each node, which caused unnecessary repetition and increased the time complexity to **O(N²)**. To avoid that, we can improve our solution by calculating the height in a bottom-up manner. As we return the height from each recursive call, we can also calculate the diameter at that node by adding the left and right heights. This way, we calculate the height and update the diameter in a single traversal, avoiding any repeated work. This reduces our overall time complexity to **O(N)**, while still correctly finding the longest path between any two nodes in the tree.

## Algorithm

**Step 1: **Start by initializing a global variable diameter to keep track of the maximum diameter found during the traversal. Create a helper function called `height` that will compute the height of a node while also updating the diameter.

**Step 2:** In the **`height`** function, check for the base case , if the current node is **null**, return 0 because the height of an empty tree is zero.

**Step 3: **Recursively calculate the height of the left and right subtrees.
 At each node, calculate the diameter that passes through it by adding the left and right subtree heights. Update the global diameter variable if this value is larger than the current maximum.

**Step 4: ** Once the entire tree has been traversed and the recursion is complete, return the value stored in the `diameter` variable as the final result.

## Time Complexity: **O(N)**

**Explanation:  **As we are only traversing the entire tree so it takes **O(N)** time.We are visiting each node of the binary tree exactly once to calculate its height and update the diameter. Since we traverse all N nodes only once, the time complexity is **O(N)**.

## Space Complexity: **O(N)**

**Explanation: **We are using recursion to traverse the tree. The space used depends on the height of the tree due to the function call stack. In the worst case such as a completely skewed tree the height can go up to N, resulting in a space complexity of **O(N)**.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/diameter-of-a-binary-tree-article)*
