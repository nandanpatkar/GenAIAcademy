# Flatten BST to Sorted Linked List

> **Slug:** `flatten-bst-to-sorted-linked-list`  
> **Published:** 2026-07-21T15:10:22.774Z  
> **Updated:** 2026-07-21T15:10:22.778Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Flatten BST to Sorted Linked List](6a5f8bd59d1d30b9304cbb44)

**Description:** BST to sorted linked list | inorder traversal flattening | in-place pointer rewiring | O(N) time explained.

---

## Problem Statement

You are given the root of a Binary Search Tree (BST). Your task is to convert this BST into a sorted linked list, in-place. The linked list should maintain the nodes in increasing order, representing the inorder traversal of the BST. Each node in the BST should be transformed such that it only points to the next node using its right pointer, while the left pointers must be set to null.

## Example

> [!NOTE]
> **INFO**
> Example : root = [4,2,5,1,3]
> 
> Output: 1 -> 2 -> 3 -> 4 -> 5
> 
> Explanation: Flattened list follows sorted order: 1 -> 2 -> 3 -> 4 -> 5.

## Intuition

We’re asked to “flatten” a Binary Search Tree into a sorted linked list, where each node only points to the next using its right pointer, and all left pointers are null.

Now the BST property says:

- An inorder traversal (Left → Root → Right) of a BST always visits nodes in increasing order.
- That means if we simply follow the inorder path, we’ll encounter values in the exact order they should appear in our linked list.

Now the question is: **How do we connect the nodes like a linked list while traversing?**

- Imagine you’re walking through the tree in sorted order (inorder).
- You need to keep track of the node you just visited (prev).
- When you move to the next node, you can say:
- - The prev.right should now point to this node.
  - Also, since we no longer need the left connection (because linked lists only go forward), we set **node.left = null**.

This way, step by step, every node’s right pointer forms a chain that looks exactly like a singly linked list.

Think of it as threading a string through the BST nodes in sorted order:

-> You start at the smallest node.

-> Tie it to the next smallest.

-> Keep going until the largest.

At the end, you’ve transformed the BST into a neatly ordered linked list without needing extra data structures, because we do it in-place during traversal.

## Algorithm

**Step 1:** Initialize two references:

- head → stores the head of the linked list (first node in inorder).
- prev → keeps track of the previously processed node.
** *****(In Java, we use single-element arrays to simulate references since primitives/objects don’t behave like C++ references.)***

**Step 2: **Perform an **inorder traversal** on the BST:

- Recursively visit the left subtree.
- Process the current node:
- - If prev is null, set head = current node.
  - Otherwise, link prev.right = current node.
  - Set current.left = null.
  - Move prev to the current node.
- Recursively visit the right subtree.

**Step 3: **Once traversal is complete, return head as the start of the sorted linked list.





## **Time Complexity: O(N)**

**Explanation: **Every node in the BST is visited exactly once during the inorder traversal. Each operation (pointer adjustment) at a node takes constant time. Thus time complexity O(N).

## **Space Complexity: O(N)**

**Explanation: **The space is used by the recursion stack. In the best case (for balanced BST), it is **log N.** In the worst case (if it is a skewed BST) then it is **N**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/flatten-bst-to-sorted-linked-list)*
