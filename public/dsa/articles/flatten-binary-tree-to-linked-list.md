# Flatten Binary Tree to Linked List

> **Slug:** `flatten-binary-tree-to-linked-list`  
> **Published:** 2026-07-02T07:24:07.161Z  
> **Updated:** 2026-07-02T07:24:07.167Z  
> **Keywords:** Binary Tree, Tree, Linkedlist  
> **Cover Image:** ![Flatten Binary Tree to Linked List](https://cdn.codehelp.in/media/Flatten Binary Tree to linkedlist.png)

**Description:** Flatten binary tree to linked list in-place using preorder traversal. Recursive and Morris traversal approach with O(1) space.

---

## Problem Statement

Given the root of a binary tree, you need to flatten it into a linked list **in place**. The tree nodes should be rearranged such that each node's ***right*** pointer points to the next node in the sequence, and each node's ***left*** pointer is set to ***null***. After flattening, the nodes should follow the pre-order traversal order of the original tree. 

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root = [1,2,5,3,4,null,6,null,null,null,null,7,null]
> 
> Output: [1,null,2,null,3,null,4,null,5,null,6,null,7,null,null]
> 
> Explanation: The tree is flattened to form a linked list in pre-order traversal.

## 

# **Recursive **Approach

## Intuition

To flatten the binary tree into a linked list, we need to rearrange the nodes so that each node only has a right child **(like a singly linked list)**, and the order of nodes follows preorder traversal **(root → left → right)**. A simple way to achieve this is to process the tree in **reverse preorder**: **right → left → root**.

**“Why reverse preorder?” **–>** **Because we want to build the linked list from the end towards the start. This allows us to always know what node should come next when we're at the current node.

We use a** “previous”** pointer to keep track of the last node we've processed.

Here’s the step-by-step idea:

- **Recursively flatten the right subtree.**
- **Recursively flatten the left subtree.**
- **Set the current node’s right pointer to the previous.**
- **Set the current node’s left to null.**
- **Update previous to be the current node.**

By doing this, each node connects its right pointer to the already processed part of the list, and we effectively build the list in reverse.

## Algorithm

**Step 1: **Initialize a variable called previous as null. This will help us keep track of the last processed node in the flattened linked list, we'll keep attaching nodes to the right of this variable.

**Step 2:** If the current root is null, simply return. This is our base case to stop the recursion.

**Step 3: **Recursively flatten the right subtree first, followed by the left subtree.

(We do this because we are building the list in reverse preorder: **right → left → root**).

**Step 4: **Once the left and right subtrees are processed, update the current node:

- Set **root.right = previous **(connect the current node to the already flattened part of the list).
- Set **root.left = null** (since it's a linked list, there should be no left children).
- Update **previous = root** (move the previous pointer to the current node).

### Java Implementation

```java
class Solution {
    public TreeNode previous = null ;
    public void flatten(TreeNode root) {
        if(root == null) return;
       
        flatten(root.right);
        flatten(root.left);
        root.right = previous ;
        root.left = null ;
        previous = root ;
    }
}
```

### C++ Implementation

```cpp
class Solution {
public:
    TreeNode* previous = nullptr;

    void flatten(TreeNode* root) {
        if (root == nullptr) return;

        flatten(root->right);
        flatten(root->left);

        root->right = previous;
        root->left = nullptr;

        previous = root;
    }
};
```



## Time Complexity: **O(N)**

**Explanation: **We visit each node in the binary tree exactly once during the traversal. So, if there are N nodes in the tree, the total time taken is** O(N).**

## Space Complexity: **O(N)**

**Explanation: **We're using recursion, which means function calls are stored in the call stack. In the best case (balanced tree), the height of the tree is log N, so the space used is O(log N). In the worst case (skewed tree all nodes to one side), the height becomes N, so the space used is **O(N)**.





# **Morris **Approach

## Intuition

In the recursive approach, we use the call stack to manage our traversal, which takes extra space. But with Morris Traversal, we aim to flatten the binary tree without using recursion or extra space (constant space).

The key idea is:

- For every node that has a left child, we find the rightmost node in its left subtree (also known as the predecessor).
- Then we connect that rightmost node’s right pointer to the current node’s right child.
- Move the entire left subtree to the right.
- Set the left child to null.

We repeat this process for every node until the whole tree is flattened into a linked list using only right pointers. It’s called **“Morris Traversal”** because it cleverly uses threading to temporarily modify the tree and achieve traversal without extra space.

## Algorithm

**Step 1: **Set a pointer current to the root of the binary tree. We'll traverse the tree using this pointer.

**Step 2:  **While current is not null, do the following:

- **Case 1: No Left Child**
- - If current.left == null, it means there’s no left subtree to process.
  - So simply move to the right child: → current = current.right
- **Case 2: Left Child Exists**
- - If current.left != null, we need to rearrange the tree structure.
  - So find the inorder predecessor of the current node — the rightmost node in the left subtree.
- **Now we perform the flattening operation:**
- - Connect prev.right (i.e., the rightmost node of the left subtree) to current.right → This temporarily saves the original right subtree.
  - Move the entire left subtree to the right: → current.right = current.left
  - Set the left child to null (since it's now part of the linked list): → current.left = null
  - Move to the next node: → current = current.right

**Step 3: **Repeat the process until the current becomes null. At this point, the binary tree has been flattened into a linked list

### Java Implementation

```java
class Solution {
    public void flatten(TreeNode root) {
        morris(root) ;
    }


    void morris(TreeNode root) {
        while(root != null) {
            if(root.left == null) {
                root = root.right ;
            } else {
                TreeNode prev = root.left ;
                while(prev.right != null && prev.right != root) prev = prev.right ;
                if(prev.right == null) {
                    prev.right = root.right ;
                    root.right = root.left ;
                    root.left = null ;
                    root = root.right ;
                }
            }
        }
    }
}
```

### C++ Implementation

```cpp
class Solution {
public:
    void flatten(TreeNode* root) {
        morris(root);
    }

    void morris(TreeNode* root) {
        while (root != nullptr) {
            if (root->left == nullptr) {
                root = root->right;
            } else {
                TreeNode* prev = root->left;

                while (prev->right != nullptr && prev->right != root) {
                    prev = prev->right;
                }

                if (prev->right == nullptr) {
                    prev->right = root->right;
                    root->right = root->left;
                    root->left = nullptr;
                }

                root = root->right;
            }
        }
    }
};
```

## Time Complexity: **O(N)**

**Explanation: **We visit each node exactly once. Even the inner loop (finding the rightmost node) runs at most once per node, so the total work done is linear in the number of nodes.

## Space Complexity: **O(1)**

**Explanation:  **We’re not using recursion or any extra data structure. The tree is modified in place by reusing existing pointers. Thus, the space complexity is constant O(1).







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/flatten-binary-tree-to-linked-list)*
