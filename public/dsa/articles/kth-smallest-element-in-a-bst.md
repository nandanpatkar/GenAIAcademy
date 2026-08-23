# Kth Smallest Element in a BST

> **Slug:** `kth-smallest-element-in-a-bst`  
> **Published:** 2026-07-21T14:15:29.532Z  
> **Updated:** 2026-07-21T14:15:29.537Z  
> **Keywords:** Tree, BST  
> **Cover Image:** ![Kth Smallest Element in a BST](6a5f7ef0e67576629cc4d1bc)

**Description:** Kth smallest element in BST DSA solution using inorder traversal. Brute force and optimized counting approach.

---

## Problem Statement

Given a binary search tree (BST), your task is to find the kth smallest element in the BST. The elements in a BST are stored in such a way that for each node:

- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.

You are provided with the root of the BST and an integer k. You need to return the kth smallest value among all the values of the nodes present in the tree.

## Example

> [!NOTE]
> **INFO**
> Example: BST: [5,3,6,2,4,null,null,1], k=3
> 
> Output: 3
> 
> Explanation: The 3rd smallest element in the BST is 3.



# **Brute Force Approach**

## Intuition

In a Binary Search Tree, the elements are arranged in such a way that an inorder traversal (visiting the left subtree, then the root, then the right subtree) always produces the values in ascending sorted order. This gives us a simple brute force idea, that is if we perform a full inorder traversal and collect all the node values in a list, then the list itself will be sorted. From this sorted list, finding the Kth smallest element becomes straightforward, we just return the element at index **k - 1** (zero indexed).

## Algorithm

**Step 1:** In the main function **kthSmallest**, we create a list named inorderTraversal. This list will be used to store all the node values of the BST in sorted order (since inorder traversal of a BST always gives elements in ascending order).

**Step 2:** We define and use a helper function inorder to perform the inorder traversal of the BST and fill the list inorderTraversal.

- If the current node is null, we simply return without doing anything.
- Otherwise, we recursively traverse the tree in the order: **left subtree → current node → right subtree** (the standard inorder traversal).
- While traversing, whenever we visit a node, we add its value to the inorderTraversal list.

**Step 3:** Once the inorder traversal is complete, the list **inorderTraversal **contains all node values of the BST in ascending order.

**Step 4:** Since the list is sorted, the kth smallest element will be at index k-1 (because list indices start from 0). So, we return **inorderTraversal.get(k-1)**.



## **Time Complexity: O(N)**

**Explanation:** The inorder traversal visits every node in the BST exactly once. Since there are **N nodes**, the total time taken is proportional to **N**, making the time complexity **O(N)**.

## **Space Complexity: O(N)**

**Explanation:** We store the values of all nodes in the list **inorderTraversal**. In the worst case, this requires space for **N elements**. Additionally, the recursion stack in inorder traversal can go as deep as the height of the tree, but since we are already using **O(N)** space for the list, the overall space complexity remains **O(N)**.



# **Optimal Approach**

## Intuition

In a Binary Search Tree (BST), the inorder traversal (left → root → right) naturally visits the elements in sorted order. This property can be very useful when we want to find the Kth smallest element, because instead of collecting all elements in a separate list and then picking the Kth one, we can directly keep track of our progress during the traversal.

The idea is simple, as we perform an inorder traversal, we maintain a counter to record how many nodes we have visited so far. Since inorder gives nodes in ascending order, the moment our counter reaches “k”, we know we have arrived at the Kth smallest element. At that point, we can stop further traversal and return the result immediately.

This approach avoids the extra space that would be required if we stored the entire traversal result in an array. Instead, we rely only on the recursive call stack and a counter variable, making the solution both efficient and clean.

## Algorithm

**Step 1:** Start an inorder traversal from the root node. During the traversal, follow the order: first visit the left subtree, then the current node, and finally the right subtree. Each time you visit a node, increase a counter that keeps track of how many nodes have been processed so far.

**Step 2:** While updating the counter, if the counter value becomes equal to `k`, record the current node’s value as the Kth smallest element. At this point, no further processing is needed for the answer.

**Step 3:** After the traversal ends (or when the Kth element is found), return the stored value as the Kth smallest element in the BST.





## **Time Complexity:** **O(N)**

**Explanation** : We may need to perform an inorder traversal of the BST, and in the worst case, this requires visiting every node once. Since each node is processed exactly one time, the overall time complexity becomes proportional to the total number of nodes, O(N).

## **Space Complexity : O(H)**

**Explanation** : Apart from a few variables used to keep track of the counter and the result, no extra data structures are required. Hence, the algorithm runs in constant extra space. (Note: the recursion stack in inorder traversal may take up to O(H) space, where H is the height of the tree, but no additional memory beyond that is explicitly used.)












---
*Extracted from CodeHelp (https://www.codehelp.in/articles/kth-smallest-element-in-a-bst)*
