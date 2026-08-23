# Convert Sorted List to Binary Search Tree

> **Slug:** `convert-sorted-list-to-binary-search-tree`  
> **Published:** 2026-07-06T13:32:52.531Z  
> **Updated:** 2026-07-06T13:32:52.534Z  
> **Keywords:** BST, Tree, List, Binary Search Tree  
> **Cover Image:** ![Convert Sorted List to Binary Search Tree](6a4bae7bd5b821217b7852ca)

**Description:** Convert sorted list to height balanced BST using middle element approach. Complete DSA algorithm with complexity.

---

## **Problem Statement**

Given the head of a singly linked list where elements are sorted in ascending order, your task is to convert it into a height-balanced binary search tree (BST). A height-balanced binary search tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

## Example

> [!NOTE]
> **INFO**
> **Example 1: **[-10,-3,0,5,9]
> 
> **Output 1: **[0,-3,9,-10,null,5]

## Intuition

We know that a Binary Search Tree (BST) gives us elements in sorted order if we do an inorder traversal. Here, we already have the elements in sorted order inside a singly linked list. The challenge is to build a height-balanced BST from it.

The key idea is to always pick the middle element of the list as the root.

- The elements on the left of this middle node will naturally form the left subtree.
- The elements on the right will form the right subtree.

But unlike arrays, linked lists don’t give us direct access to the middle index. So, we use the slow and fast pointer technique:

- The slow pointer moves one step at a time, while the fast pointer moves two steps.
- When fast reaches the end, slow will be at the middle.

Once we find the middle, we:

- Make it the root node.
- Recursively repeat the process on the left part of the list for the left subtree.
- Recursively repeat the process on the right part of the list for the right subtree.

This way, we divide the list at every step and naturally ensure the tree remains balanced.

## Algorithm

**Step 1:** Create a helper function findMiddle(head) that uses slow and fast pointers to find the middle node of the linked list.

- Maintain a prev pointer to disconnect the left half from the middle.
- Once found, return the middle node.

**Step 2:** In the main function sortedListToBST(head):

- If the list is empty, return null.
- If it has only one node, return a tree node with that value (base case).

**Step 3:** Use findMiddle to locate the middle node of the current list.

- Make this node the root of the current subtree.

**Step 4:** Recursively build the left subtree from the portion of the list before the middle node.
**Step 5:** Recursively build the right subtree from the portion of the list after the middle node.

**Step 6:** Return the root node, which now connects both subtrees.





## **Time Complexity: ** **O(N log N)**

**Explanation: **Finding the middle node takes O(N) time each time we split the list. Since we perform this for each level of the tree, and the tree has about log N levels, the total is O(N log N).

## **Space Complexity: O(log N)**

**Explanation: **We are not using any extra data structures apart from recursion. The space comes from the recursive call stack. In a balanced BST, the height of the tree is O(log N), so the recursion depth is at most O(log N).





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/convert-sorted-list-to-binary-search-tree)*
