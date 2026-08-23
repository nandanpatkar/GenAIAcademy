# Merge Two BSTs

> **Slug:** `merge-two-bsts`  
> **Published:** 2026-07-21T15:00:53.005Z  
> **Updated:** 2026-07-21T15:00:53.008Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Merge Two BSTs](6a5f898e9d1d30b9304cbb30)

**Description:** Merge two BSTs solution | inorder traversal with two stacks | sorted merge + unique elements | O(N+M).

---

## Problem Statement

Given two Binary Search Trees (BSTs), root1 and root2, your task is to return a single BST containing all elements from both input BSTs in sorted order. Each element must be unique (duplicates should be removed).

## Example

> [!NOTE]
> **INFO**
> Example : root1 = [5, 3, 7], root2 = [2, 1, 4]
> 
> Output: [1, 2, 3, 4, 5, 7]
> 
> Explanation: Merged result is a sorted BST with values: [1, 2, 3, 4, 5, 7].

## Intuition

The key to solving this problem lies in understanding the property of a BST. An inorder traversal (**left → root → right**) of a BST always gives the elements in sorted order.
Now, we have two BSTs. If we perform inorder traversal separately on both, we’ll get two sorted lists. Once we have those lists, we could simply merge them like we merge two sorted arrays. But storing the full traversals requires O(N + M) extra space, which isn’t optimal.

Instead, we can take advantage of the fact that inorder traversal can be simulated step by step using a stack:

- For the first BST, we push nodes onto a stack while moving left. The top of the stack always gives the next smallest element available from that tree.
- Similarly, for the second BST, we do the same, so its stack’s top gives the next smallest element from that tree.

Now, since we always want to build a single sorted list, at every step we just need to compare the tops of both stacks:

- The smaller value is guaranteed to be the next correct element in the final merged list, so we pick it and move to its right child.
- If both values are equal, we only take it once (because duplicates aren’t allowed) and move forward in both trees.

By repeating this process, we effectively merge the two BSTs on the fly, without ever creating the entire traversals in advance. It’s like performing the merge step of merge sort, but directly on the trees using stacks. This approach is efficient, clean, and avoids wasting extra memory.

## Algorithm

**Step 1: **Initialize two stacks sa and sb to simulate inorder traversal for both BSTs.

**Step 2: **Start with two pointers a and b pointing to the roots of root1 and root2.

**Step 3: **Push left children of both a and b into their respective stacks until reaching null.

**Step 4: **Now compare the top elements of both stacks:

- If one stack is empty, pick from the other.
- If both stacks have elements, choose the smaller value (since inorder guarantees sorted order).

**Step 5: **Add the chosen value to the answer list and move to its right child to continue inorder traversal.

**Step 6: **Repeat **steps3 **and **step5 **until both stacks and both pointers are empty.

**Step 7: **Finally, return the list of merged elements.





## **Time Complexity: O(N + M)**

**Explanation: **Each node from both trees is pushed and popped from a stack exactly once. The comparison at each step takes constant time. Hence, the total time complexity is proportional to the number of nodes in both BSTs combined.

## **Space Complexity: O(H1 + H2)**

**Explanation: **Here, H1 and H2 are the heights of the two BSTs. The extra space comes from the stacks used for simulating inorder traversal. In the worst case (for skewed trees), this can be O(N + M). On average, for balanced BSTs, it will be closer to O(log N + log M).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/merge-two-bsts)*
