# Path Sum

> **Slug:** `path-sum-article`  
> **Published:** 2026-04-22T11:12:18.565Z  
> **Updated:** 2026-04-22T11:12:18.570Z  
> **Keywords:** None  
> **Cover Image:** ![Path Sum](https://cdn.codehelp.in/media/path sum.png)

**Description:** Path Sum binary tree problem: root-to-leaf DFS recursion to check if any path equals targetSum. O(N) time solution.

---

## Problem Statement

You are given the root of a binary tree and an integer, ***targetSum***. Your task is to determine if there is a root-to-leaf path in the tree such that the sum of the values along that path equals ***targetSum***.

A **root-to-leaf path** is defined as a sequence of nodes starting from the root node and ending at any leaf node. A **leaf** is a node that has no children.

## Example 1

> [!NOTE]
> **INFO**: Input: Binary Tree:[1, 2, 3, 4, 5, 6, 7, null, null, 9, 8, null, null, null, null], targetSum= 17
Output: true
Explanation: Path 1 -> 2 -> 5 -> 9  equals target sum 17.





## Example 2

> [!NOTE]
> **INFO**
> **Input:** Binary Tree: [1, 2, 3], targetSum=5
> 
> **Output:** false
> 
> **Explanation:** No path in the tree adds up to 5.

## Intuition

The problem asks us to determine whether there exists a path from the root to any leaf node such that the sum of all node values along that path is equal to the given **targetSum**. To solve this, we can use a **Depth-First Search (DFS)** approach. While traversing the tree, we keep reducing the targetSum by the value of the current node. So the key idea is:

- At each node, subtract its value from the **targetSum**.
- When we reach a leaf node **(a node with no children)**, check if the remaining **targetSum **is exactly equal to the leaf node's value.
- - If it is, then a valid path exists, and we return **true**.
  - If not, we continue searching in other branches of the tree.

This process is repeated recursively for both left and right subtrees. If any path satisfies the condition, we return **true**. If no such path is found, we return **false**. So, we’re essentially exploring all **root-to-leaf **paths and checking whether any one of them adds up to the **targetSum**.

## Algorithm

**Step 1: **If the root is **null**, that means the tree is empty. In this case, there is no path to check, so we return **false**.

**Step 2:**  If the current node is a leaf node **(both left and right children are null)**, we check if its value is equal to the remaining targetSum.

- If `targetSum- node.val == 0`, it means we have found a valid **root-to-leaf** path whose sum equals the target. So, we return **true**.
- Otherwise, we return **false**.

**Step 3: **If the current node is not a leaf, we:

- Subtract the current node's value from `targetSum`.
- Recursively call the same function for both the left and right subtrees with the updated `targetSum`.
- Store the results in two variables, say **left **and **right **, which indicate whether a valid path was found in either subtree.

**Step 4: **If either **left **or **right **is **true**, it means a valid path exists in the tree, so we return **true**.  If both are **false**, no valid path exists, so we return **false**.





## Time Complexity: **O(N)**

**Explanation: **We are using DFS traversal to explore and check for a valid path in the entire tree. In the worst case, we may need to visit every node once, so the time complexity is O(N), where N is the number of nodes in the tree.

## Space Complexity: **O(N)**

**Explanation: **We are recursively traversing the tree using DFS, and the recursive calls take up to O(H) space, where H is the height of the binary tree. In the best case, when the tree is balanced, the height is log(N). In the worst case, when the tree is completely skewed, the height becomes N. Therefore, the space complexity in the worst case is O(N).







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/path-sum-article)*
