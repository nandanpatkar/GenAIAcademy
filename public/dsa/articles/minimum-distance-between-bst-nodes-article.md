# Minimum Distance between BST Nodes

> **Slug:** `minimum-distance-between-bst-nodes-article`  
> **Published:** 2026-08-02T09:14:13.548Z  
> **Updated:** 2026-08-02T09:14:13.551Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Minimum Distance between BST Nodes](6a6f0a3bcddbc98100890d4c)

**Description:** Find the minimum absolute difference in a BST using in-order traversal. Learn the O(N) solution with C++, Java, and Python.

---

## Problem Statement

You are given the root of a Binary Search Tree (BST). Your task is to find the minimum absolute difference between the values of any two *different* nodes in the tree.

A Binary Search Tree (BST) has the property that for any node n:

- All values in its left subtree are less than n.val.
- All values in its right subtree are greater than n.val.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root = [4,2,6,1,3,5,7]
> 
> Output: 1
> 
> Explanation: This is a basic balanced BST. The in-order traversal yields [1, 2, 3, 4, 5, 6, 7]. The minimum absolute difference between adjacent elements is 1, occurring multiple times (e.g., |2-1|, |3-2|, |4-3|).

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: root = [0,null,17,null,26,null,30,null,37,null,44,null,46]
> 
> Output: 2
> 
> Explanation: In-order traversal gives sorted BST values; the minimum absolute difference is computed between adjacent nodes.

## Intuition

The key property of a Binary Search Tree (BST) is that an in-order traversal visits all nodes in sorted order. This means the values appear from smallest to largest during traversal.

Now, if the values are sorted, the minimum absolute difference will always be found between two consecutive values. So, instead of comparing every pair of nodes, we only need to compare the current node with the previously visited node during the in-order traversal.

We keep track of the previous value and continuously update the minimum difference whenever we find a smaller difference.

## Algorithm

**Step 1: **Initialize min_diff with Integer.MAX_VALUE and prev_val as null.

**Step 2:** Start an in-order traversal of the BST.

**Step 3: ** Recursively traverse the left subtree.

**Step 4: **Process the current node:

- If prev_val is not null, calculate the difference between the current node value and prev_val.
- Update min_diff if this difference is smaller.

**Step 5: **Update prev_val with the current node’s value.

**Step 6: ** Recursively traverse the right subtree.

**Step 7: **After the traversal is complete, return min_diff.





### C++ Implementation

```cpp
class Solution {
private:
    int min_diff;
    TreeNode* prev_node;

    void inorderTraversal(TreeNode* node) {
        if (node == nullptr) {
            return;
        }

        inorderTraversal(node->left);

        if (prev_node != nullptr) {
            min_diff = min(min_diff, node->val - prev_node->val);
        }

        prev_node = node;

        inorderTraversal(node->right);
    }

public:
    int minDiffInBST(TreeNode* root) {
        min_diff = INT_MAX;
        prev_node = nullptr;

        inorderTraversal(root);

        return min_diff;
    }
};
```

### Java Implementation

```java
class Solution {
    private int min_diff;
    private Integer prev_val;

    private void inorderTraversal(TreeNode node) {
        if (node == null) {
            return;
        }
        inorderTraversal(node.left);
        if (prev_val != null) {
            min_diff = Math.min(min_diff, node.val - prev_val);
        }
        prev_val = node.val;
        inorderTraversal(node.right);
    }

    public int minDiffInBST(TreeNode root) {
        min_diff = Integer.MAX_VALUE;
        prev_val = null;
        inorderTraversal(root);
        return min_diff;
    }
}
```

### Python Implementation

```python
class Solution:
    def __init__(self):
        self.min_diff = float('inf')
        self.prev_val = None

    def inorderTraversal(self, node):
        if node is None:
            return

        self.inorderTraversal(node.left)

        if self.prev_val is not None:
            self.min_diff = min(self.min_diff, node.val - self.prev_val)

        self.prev_val = node.val

        self.inorderTraversal(node.right)

    def minDiffInBST(self, root):
        self.min_diff = float('inf')
        self.prev_val = None

        self.inorderTraversal(root)

        return self.min_diff
```

## Time Complexity: **O(N)**

**Explanation: **We visit every node exactly once during the in-order traversal. Since the tree contains N nodes, the total time complexity is O(N).

## Space Complexity: **O(H)**

**Explanation: **The extra space is used by the recursion stack during traversal, where H is the height of the tree. In a balanced BST, the height is O(log N), while in the worst case of a skewed tree, it can become O(N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/minimum-distance-between-bst-nodes-article)*
