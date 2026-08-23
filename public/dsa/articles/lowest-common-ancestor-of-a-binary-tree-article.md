# Lowest Common Ancestor of a Binary Tree

> **Slug:** `lowest-common-ancestor-of-a-binary-tree-article`  
> **Published:** 2026-04-24T10:15:05.746Z  
> **Updated:** 2026-04-24T10:15:05.747Z  
> **Keywords:** Test  
> **Cover Image:** ![Lowest Common Ancestor of a Binary Tree](https://cdn.codehelp.in/media/Lowest Common Ancestor of a Binary Tree.png)

**Description:** Lowest Common Ancestor (LCA) in binary tree using recursion/DFS. Brute force root-to-node paths vs optimal O(N) solution.

---

## Problem Statement

In this problem, you are given a binary tree and two distinct nodes p and q. Your task is to find their Lowest Common Ancestor (LCA).

The Lowest Common Ancestor of two nodes p and q in a binary tree is defined as the deepest node in the binary tree that has both p and q as descendants. A node can be a descendant of itself, so if one node is an ancestor of the other, it can be the LCA.

## Example 1

> [!NOTE]
> **INFO**: Input: root =  [1, 2, 3, 4, 5, 6, 7, null, null, 9, 8, null, null, null, null], p = 4, q = 5
Output: 2
Explanation: The LCA of nodes 4 and 5 is 2.





## Example 2

> [!NOTE]
> **INFO**: Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: Node 5 is the LCA of itself and node 4.

# Brute force Approach

## Intuition

The Lowest Common Ancestor (LCA) of two nodes in a binary tree is the deepest node that is an ancestor of both nodes. To understand this intuitively, imagine tracing the path from the root of the tree to each of the two nodes (say p and q) and storing these paths in two separate lists. As you compare both paths from the beginning, you'll notice that they start out the same but eventually diverge. The last node they share before the paths split is the Lowest Common Ancestor. This works because the point where their paths differ indicates they’ve moved into different branches of the tree, and the last common node before this split is the closest ancestor they both have, located farthest from the root.

## Algorithm

**Step 1: **Check if the root is **null**. If it is, return **null **immediately since there's no tree to search. Then, create two empty lists named `list1`** **and `list2`. These lists will be used to store the paths from the root to the two given nodes.

**Step 2:** Use a helper function named `rootToNode` to find the path from the root to each of the target nodes **(p and q)**. This function will traverse the tree and fill the corresponding list with nodes along the path until it reaches the target.

**Step 3: **Now compare both lists **(list1 and list2)** element by element from the beginning. The last node where both lists have the same value is the point where the paths to p and q start to diverge. This node is the **Lowest Common Ancestor**, so return it.





## Time Complexity: **O(N)**

**Explanation: **We traverse the entire tree twice once to find the path from the root to node **p**, and once for node **q**. Each traversal takes **O(N) **time, where N is the number of nodes in the tree. After that, we compare the two paths to find the last common node, which takes up to **O(N)** time in the worst case. So, the total time complexity is **O(N + N + N) = O(3N)**, which simplifies to **O(N)**.

## Space Complexity: **O(3N)**

**Explanation: **In the worst case **(for a skewed tree)**, the recursive calls can use up to O(N) space on the call stack. Additionally, we use two lists to store the paths from the root to nodes **p **and **q**, each taking up to **O(N)** space. So, the total space usage is **O(N + N + N) = O(3N)**, which is still considered linear space **O(N)**.



# Optimal Approach

## Intuition

In the previous approach, we stored the entire path from the root to each target node using lists, which required extra space. To improve this, the key idea is to use a recursive approach that avoids storing paths and instead relies on dividing the problem into smaller subproblems. We start by checking if the current node matches either of the given nodes **(p or q)**. If it does, we can immediately return the current node, since one of the targets has been found.

Then, we recursively search the left and right subtrees to see if the other node exists in either branch. If both the left and right recursive calls return non-null values, it means one node was found in the left subtree and the other in the right so the current node is their Lowest Common Ancestor. If only one side **(left or right)** returns a non-null value, it means both nodes are located in that subtree, so we return the non-null result upward. If both sides return null, it means neither of the nodes were found in this branch, so we return null. This approach is both time-efficient and space-efficient, as it doesn’t require storing paths and works in a single traversal of the tree.

## Algorithm

**Step 1: **If the root of the tree is **null**, return **null **there's nothing to search. Next, if the current node matches either of the target nodes **(p or q)**, return the current node itself, as it could be part of the final answer.

**Step 2:  **Recursively search for** p** and **q** in the left and right subtrees of the current node. Store the results from both sides.

**Step 3: ** After the recursive calls:

- If the left subtree returns **null**, it means both nodes must be in the right subtree, so we return the result from the right.
- If the right subtree returns **null**, it means both nodes are in the left subtree, so we return the result from the left.
- If both sides return non-null values, it means one node was found on each side so the current node is the Lowest Common Ancestor, and we return it.



## Time Complexity: **O(N)**

**Explanation: **We traverse each node of the binary tree once in a single recursive pass. Since we visit every node only one time, the total time complexity is **O(N)**, where N is the number of nodes in the tree.

## Space Complexity: **O(N)**

**Explanation: **The space complexity is determined by the recursion stack. In the worst case **(such as in a completely skewed tree)**, the depth of the recursion can be **O(N)**. Therefore, the space complexity is also **O(N)**.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/lowest-common-ancestor-of-a-binary-tree-article)*
