# Brothers from Different Roots

> **Slug:** `brothers-from-different-roots`  
> **Published:** 2026-07-29T19:24:05.353Z  
> **Updated:** 2026-07-29T19:24:05.356Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Brothers from Different Roots](6a6a5346d4d58f79c62c4a4e)

**Description:** Solve Brothers from Different Roots using two BST traversals + two pointers to count valid pairs with sum X.

---

## Problem Statement

Given two distinct Binary Search Trees (BSTs) and an integer x, your task is to determine how many pairs of values exist such that one value comes from each BST and their sum equals x. Each BST consists of nodes with unique integer values. The objective is to find pairs of nodes, with one node from each BST, whose combined value equals x.

## Example

> [!NOTE]
> **INFO**
> Example : root1 = [5,3,7,2,4], root2 = [10,6,15,3,8], x = 10
> 
> Output: 3
> 
> Explanation: Pairs (5, 5) and (7, 3) add up to 10.

## Intuition

We are given two different BSTs and need to count how many pairs of nodes, one from each tree, sum up to the target value x. The main idea comes from the property of BST traversals: an inorder traversal(left -> root -> right) gives elements in ascending order, while a reverse inorder(right -> root -> left) traversal gives elements in descending order. So, if we take the inorder traversal of the first BST, we get a sorted list. Similarly, performing a reverse inorder traversal on the second BST gives us a reverse-sorted list.

Now, with one list sorted in ascending order and the other in descending order, we can use a simple two-pointer approach. Start with a pointer at the beginning of both lists. At each step:

- If the sum of the current elements equals x, we find a valid pair and move both pointers.
- If the sum is smaller than x, we move the pointer in the ascending list forward to increase the sum.
- If the sum is larger than x, we move the pointer in the descending list forward to decrease the sum.

By repeating this until one of the lists is exhausted, we get the total count of valid pairs. This works efficiently because the sorted and reverse-sorted nature of the two lists lets us adjust the sum intelligently without checking all possible pairs.

## Algorithm

**Step 1:** Initialize two lists, **list1 **and **list2**, to store the inorder traversal of the first BST and the reverse inorder traversal of the second BST. Also, initialize a variable **countPair **to keep track of the number of valid pairs.

**Step 2**: Perform an inorder traversal** (left → root → right)** on the first BST using the helper function **inorder **and store the result in **list1**. Similarly, perform a reverse inorder traversal **(right → root → left)** on the second BST using the helper function **rev_inorder **and store the result in **list2**.

**Step 3:** With both traversals ready, place two pointers:

- i starting at the beginning of list1 (smallest element).
- j starting at the beginning of list2 (largest element).

Now, traverse both lists simultaneously:

- If list1[i] + list2[j] == x, increment countPair and move both i and j forward.
- If the sum is less than x, move i forward to pick a larger value.
- If the sum is greater than x, move j forward to pick a smaller value.

**Step 4:** Continue this process until one of the lists is fully traversed. Finally, return countPair, which represents the total number of pairs whose sum equals the target x.





## **Time Complexity: O(N)**

**Explanation: **We are using recursion to traverse the BST which can take O(N) time to traverse and we are also traversing the list to find our pair which is also taking O(N) time.

Thus time complexity will be **O(2N) ~ O(N).**

## **Space Complexity: O(N)**

**Explanation: **We are using recursion to traverse the BST which can take O(N) recursive stack space in the worst case(If it is a skewed tree). Additionally we are

using two lists to store those traversals. Thus space complexity will be **O(N) + O(N) + O(N) = O(3N) ~ O(N)**









---
*Extracted from CodeHelp (https://www.codehelp.in/articles/brothers-from-different-roots)*
