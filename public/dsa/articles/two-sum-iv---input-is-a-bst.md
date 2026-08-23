# Two Sum IV - Input is a BST

> **Slug:** `two-sum-iv---input-is-a-bst`  
> **Published:** 2026-07-29T19:36:22.297Z  
> **Updated:** 2026-07-29T19:36:22.300Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Two Sum IV - Input is a BST](6a6a5621d4d58f79c62c4a74)

**Description:** Two Sum in BST DSA solution using inorder traversal + two-pointer technique to check if pair sum equals k.

---

## Problem Statement

You are given the root of a binary search tree (BST) and an integer k. Your task is to determine if there exist two elements in the BST such that their sum equals k. A binary search tree (BST) is a binary tree in which for each node, the values in its left subtree are less than its own value and the values in its right subtree are greater than its own value. Return true if there are two distinct nodes in the BST whose values add up to k, and false otherwise.

## Example

> [!NOTE]
> **INFO**
> Example : root = [5, 3, 6, 2, 4, null, 7], k = 9
> 
> Output: true
> 
> Explanation: Nodes 5 and 4 sum to 9.

## Intuition

The goal is to check if there are two nodes in the BST whose values add up to the target k. A key property of a **Binary Search Tree (BST)** is that its **inorder traversal** (**left → root → right**) always gives us a sorted sequence of values. This makes the problem easier, because once we have a sorted list of values, we can apply the classic **two-pointer technique** to find if any two numbers sum up to k.

Here’s the thought process:

1. Perform an inorder traversal of the BST and store the values in a list. The list will be sorted.
2. Place two pointers: one at the beginning (i = 0) and one at the end (j = n - 1).
3. Check the sum of these two values:
4. - If the sum is **equal to k**, we’ve found the answer → return true.
  - If the sum is **less than k**, move the left pointer (i++) to increase the sum (since larger values are on the right).
  - If the sum is **greater than k**, move the right pointer (j--) to decrease the sum (since smaller values are on the left).
5. Continue this until the pointers meet. If no pair is found, return **false**.

This way, we make use of both the **BST property** (inorder → sorted order) and the **two-pointer strategy** (efficient way to find pairs in sorted data).

## Algorithm

**Step 1:** Create an empty list to store the inorder traversal of the BST.

**Step 2:** Use a helper function “**inorder” **to traverse the tree in inorder fashion (**left → root → right**) and store each node’s value in the list. Since it’s a BST, the list will always be sorted.

**Step 3:** Initialize two pointers:

- i pointing to the beginning of the list,
- j pointing to the end of the list.

Now, check the sum of the values at list[i] and list[j]:

- If the sum equals k, return true (pair found).
- If the sum is less than k, increment i (to try a larger value).
- If the sum is greater than k, decrement j (to try a smaller value).

**Step 4:** Continue this process until the two pointers meet. If no such pair is found, return **false**.





## **Time Complexity: O(N)**

**Explanation: **

- We perform an inorder traversal of the BST, which visits all N nodes once → O(N).
- After that, we use the two-pointer approach on the list, which in the worst case can also take up to O(N) steps.
- Together this is **O(N + N) = O(2N) ≈ O(N).**

## **Space Complexity: O(N)**

**Explanation: **

- The inorder traversal is recursive, so it requires stack space up to O(H), where H is the height of the tree. In the worst case (a skewed tree), this becomes O(N).
- Additionally, we store all N nodes in a list, which takes O(N) space.
- Thus, the overall space complexity is** O(N + N) = O(2N) ≈ O(N).**



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/two-sum-iv---input-is-a-bst)*
