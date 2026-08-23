# Check Whether the BST Contains Dead End

> **Slug:** `check-whether-the-bst-contains-dead-end`  
> **Published:** 2026-07-21T14:50:02.699Z  
> **Updated:** 2026-07-21T14:50:02.702Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Check Whether the BST Contains Dead End](6a5f870de67576629cc4d208)

**Description:** BST Dead End DSA solution using recursion and min-max range tracking. Includes algorithm steps and complexity.

---

## Problem Statement

A Binary Search Tree (BST) is a widely used tree data structure where each node can have at most two children. In the BST, the left child's value is always less than its parent's value, and the right child's value is greater than its parent's value. In this problem, a dead end is defined as a situation where no new nodes can be added around a node because all possible values are already occupied, and this further prevents adhering to the BST property. Your task is to determine if any such dead ends exist within a given BST.

## Example

> [!NOTE]
> **INFO**
> Example : root = [8, 5, 9, 2, 7, null, null, 1]
> 
> Output: true
> 
> Explanation: Node 1 is a Dead End in the given BST.

## Intuition

A *dead end* in a BST means we reach a point where no new node can be inserted without breaking the BST rules. For example, if a node’s possible range of valid values shrinks to just one number, then there’s no space left to insert a new child—this becomes a dead end.

To detect this, we can think in terms of *ranges*. For every node, its children must fall between a certain minimum and maximum value.

- When we move to the left child, the maximum possible value becomes node.val - 1 (since all values must be smaller than the current node).
- When we move to the right child, the minimum possible value becomes node.val + 1 (since all values must be greater than the current node).

As we go deeper into the tree, this valid range keeps shrinking. If at any point the range collapses—meaning min == max, then it tells us there is no valid number left to place a new node. That’s exactly what a dead end is.

So the whole idea is simple: keep track of the valid range **(min, max)** for each node. If we ever find that the range becomes empty (only one possible number remains), we know the BST contains a dead end.

## Algorithm

**Step 1: **In the main function isDeadEnd, we call a helper function checkDeadEnd to check whether the BST contains a dead end or not.

- Initially, we pass the range min = 1 and max = Integer.MAX_VALUE as parameters.
- The reason for starting with min = 1 is that the problem specifies that all node values are greater than or equal to 1.

**Step 2: **Inside the helper function checkDeadEnd(node, min, max), we follow these steps:

- If the current node is null, we return false. An empty subtree does not form a dead end because the range (min, max) is still available for inserting values.
- If min == max, it means the range has collapsed to a single value. No new nodes can be added at this point, so we return true indicating a dead end exists.
- Recursive Calls:
- - For the left subtree, we update the maximum value to node.val - 1 (since left children must be smaller).
  - For the right subtree, we update the minimum value to node.val + 1 (since right children must be greater).
 We then recursively call checkDeadEnd for both left and right subtrees.
- If either the left or right subtree call returns true, we propagate true upwards, indicating that the BST contains a dead end.

**Step 3: **Finally, the helper function’s result is returned by the main function. If checkDeadEnd returns true, it means the BST has at least one dead end; otherwise, it does not.





## **Time Complexity: O(N)**

**Explanation: **We may need to visit every node in the BST to check for dead ends. Since each node is processed once, the overall time complexity is linear in terms of the number of nodes.

## **Space Complexity: O(N)**

**Explanation: **The algorithm uses recursion for tree traversal. In the worst case (if the BST is skewed), the recursive call stack can grow up to the height of the tree, which is O(N). In a balanced BST, the height would be O(log N), but in the worst case, we consider it as O(N).









---
*Extracted from CodeHelp (https://www.codehelp.in/articles/check-whether-the-bst-contains-dead-end)*
