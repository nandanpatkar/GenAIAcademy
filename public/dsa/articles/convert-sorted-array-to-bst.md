# Convert Sorted array to BST

> **Slug:** `convert-sorted-array-to-bst`  
> **Published:** 2026-07-06T13:31:09.184Z  
> **Updated:** 2026-07-06T13:31:09.188Z  
> **Keywords:** Binary Search Tree, BST, Tree, Array  
> **Cover Image:** ![Convert Sorted array to BST](6a4bae14d5b821217b7852c3)

**Description:** Construct height-balanced BST from sorted array using mid element technique. Efficient solution with complexity.

---

## **Problem Statement**

You are given a sorted integer array nums in strictly increasing order. Your task is to convert this array into a height-balanced binary search tree (BST). A height-balanced binary search tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one. This ensures the tree is as flat as possible, which optimizes the operations of searching, insertion, and deletion. The aim is to choose a structure where the central element of any sub-array becomes the root; hence ensuring balanced branches within a subtree.

## Example

> [!NOTE]
> **INFO**
> Example 1: [-10, -3, 0, 5, 9]
> 
> Output 1:

## **Real life analogy**

Imagine you have a set of books arranged in increasing order of size on a shelf. You want to organize them into a balanced pyramid-like structure where the height difference between the left and right side never becomes too large. If you simply start stacking from one end, the pyramid will lean heavily to one side and become unstable. To keep it balanced, you need to carefully pick the middle book as the starting point (the base of balance), then arrange the smaller books on one side and the larger books on the other. This way, the structure remains stable and well-balanced — just like how we need to build a height-balanced BST from a sorted array.

## Intuition

We know that if we perform an *inorder traversal* of a Binary Search Tree (BST), we always get the elements in sorted order. Here, we are already given a sorted array, so our task is to build a BST that reflects this property. To make the tree height-balanced, we need to ensure that the number of nodes on the left and right subtrees are as equal as possible. The best way to achieve this is by choosing the middle element of the array as the root:

- The elements on the left side of the middle will naturally form the left subtree.
- The elements on the right side of the middle will form the right subtree.

We can apply this logic recursively on each subarray. A helper function **“buildTree”** will:

- Pick the middle element as the root.
- Recursively build the left subtree from the left half of the array.
- Recursively build the right subtree from the right half of the array.

This way, the tree remains balanced, and we efficiently construct a valid BST from the sorted array.

## Algorithm

**Step 1:** Use a helper function “**buildTree(nums, start, end)”** to construct the tree. This function will handle creating the root and recursively building the left and right subtrees.

**Step 2:** In the helper function, use two variables start and end to define the current portion of the array we are working with.

- If **start > end**, it means there are no elements left in this range, so return null.

**Step 3:** Find the middle index:

- **mid = (start + end) / 2**
- The element at nums[mid] becomes the **root** of the current subtree.
- Recursively call **buildTree(nums, start, mid - 1)** to build the left subtree.
- Recursively call **buildTree(nums, mid + 1, end)** to build the right subtree.

**Step 4:** Return the root node, which now has both its left and right subtrees attached.

**Step 5:** In the main function **sortedArrayToBST(nums)**, start the process by calling **buildTree(nums, 0, nums.length - 1)** to construct the entire height-balanced BST.





## **Time Complexity: O(N)**

**Explanation:** We visit each element of the array exactly once to create a tree node. Since every element is processed only one time, the overall time complexity is O(N).

## **Space Complexity: O(N)**

**Explanation: **The space is mainly used by the recursion call stack. In the worst case (when the tree becomes skewed), the depth of recursion can go up to N, giving a space complexity of **O(N)**. In the best/average case (balanced tree), the height is **O(log N)**, so the space would be **O(log N)**. Therefore, the space complexity is O(N) in the worst case and O(log N) in the average case.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/convert-sorted-array-to-bst)*
