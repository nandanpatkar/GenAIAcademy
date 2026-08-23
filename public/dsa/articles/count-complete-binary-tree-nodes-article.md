# Count Complete Binary Tree Nodes

> **Slug:** `count-complete-binary-tree-nodes-article`  
> **Published:** 2026-08-02T09:30:14.107Z  
> **Updated:** 2026-08-02T09:30:14.110Z  
> **Keywords:** Tree, Binary Tree  
> **Cover Image:** ![Count Complete Binary Tree Nodes](6a6f0de2cddbc98100890d7e)

**Description:** Count nodes in a complete binary tree using height comparison. Learn the O((log N)²) solution with C++, Java, and Python.

---

## Problem Statement

You are given the root of a **complete binary tree**. Your task is to count the total number of nodes in this tree.

A **complete binary tree** is a binary tree in which every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. This means that if a node has a right child, it must also have a left child, and all nodes on the last level appear consecutively from left to right.

For example, a full binary tree (where every node has 0 or 2 children) is also a complete binary tree. The key characteristic is that all nodes are "packed" to the left without any gaps.

While a straightforward depth-first search (DFS) or breadth-first search (BFS) would count all nodes in O(N) time, where N is the total number of nodes, you should aim for a more efficient approach that leverages the specific structural properties of a complete binary tree.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: root = [1,2,3,4,5,6]
> 
> Output: 6
> 
> Explanation: This is a standard complete binary tree as given in Example 1. The nodes are: 1 (root), 2 (left of 1), 3 (right of 1), 4 (left of 2), 5 (right of 2), and 6 (left of 3). Counting these yields 6 nodes.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: root = [73, 35, 92, 1, 60, 88, 52, 96, 98]
> 
> Output: 9
> 
> Explanation: Counted nodes of a complete binary tree using height comparison.

## Intuition

A complete binary tree has a special property that helps us count nodes more efficiently than a normal traversal.

If the height of the leftmost path and the height of the rightmost path of a subtree are equal, then that subtree is a perfect binary tree. In a perfect binary tree, all levels are completely filled, so we do not need to visit every node individually. Instead, we can directly calculate the number of nodes using the formula -> (2^h-1), where h is the height of the tree.

So, for every subtree:

- If both heights are equal, directly calculate the number of nodes.
- Otherwise, recursively count the nodes in the left and right subtrees.

This approach avoids unnecessary traversal and makes the solution faster than a standard DFS or BFS approach.

## Algorithm

**Step 1: **Create a function getLeftHeight() to calculate the height by continuously moving to the left child.

**Step 2: **Create another function getRightHeight() to calculate the height by continuously moving to the right child.

**Step 3: ** In the countNodes() function, check if the root is null. If yes, return 0.

**Step 4: **Find the left height and right height of the current subtree.

**Step 5: **If both heights are equal, it means the subtree is a perfect binary tree.

**Step 6: **Directly calculate the total number of nodes using -> (2^h-1), where h is the height of the tree.

**Step 7: **If the heights are not equal, recursively count:

- Nodes in the left subtree
- Nodes in the right subtree

and add 1 for the current root node.

**Step 8: **Return the final count.





### C++ Implementation

```cpp
class Solution {
public:

    int getLeftHeight(TreeNode* node) {

        int height = 0;

        while (node != nullptr) {

            height++;

            node = node->left;
        }

        return height;
    }

    int getRightHeight(TreeNode* node) {

        int height = 0;

        while (node != nullptr) {

            height++;

            node = node->right;
        }

        return height;
    }

    int countNodes(TreeNode* root) {

        if (root == nullptr) {
            return 0;
        }

        int leftHeight = getLeftHeight(root);

        int rightHeight = getRightHeight(root);

        if (leftHeight == rightHeight) {

            return (1 << leftHeight) - 1;

        } else {

            return 1
                   + countNodes(root->left)
                   + countNodes(root->right);
        }
    }
};
```

### Java Implementation

```java
class Solution {
    public int getLeftHeight(TreeNode node) {
        int height = 0;
        while (node != null) {
            height++;
            node = node.left;
        }
        return height;
    }
    
    public int getRightHeight(TreeNode node) {
        int height = 0;
        while (node != null) {
            height++;
            node = node.right;
        }
        return height;
    }
    
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        
        int leftHeight = getLeftHeight(root);
        int rightHeight = getRightHeight(root);
        
        if (leftHeight == rightHeight) {
            return (1 << leftHeight) - 1;
        } else {
            return 1 + countNodes(root.left) + countNodes(root.right);
        }
    }
}
```

### Python Implementation

```python
class Solution:

    def getLeftHeight(self, node):

        height = 0

        while node is not None:

            height += 1

            node = node.left

        return height

    def getRightHeight(self, node):

        height = 0

        while node is not None:

            height += 1

            node = node.right

        return height

    def countNodes(self, root):

        if root is None:
            return 0

        leftHeight = self.getLeftHeight(root)

        rightHeight = self.getRightHeight(root)

        if leftHeight == rightHeight:

            return (1 << leftHeight) - 1

        else:

            return (
                1
                + self.countNodes(root.left)
                + self.countNodes(root.right)
            )
```

## Time Complexity: O((log N)^2)

**Explanation: **For every recursive call, we calculate the left height and right height, which takes O(log N) time in a complete binary tree. The recursive calls also occur for at most O(log N) levels. Therefore, the overall time complexity becomes  O((log N)^2) .

## Space Complexity: **O(log N)**

**Explanation: **The extra space is used by the recursion stack. Since the height of a complete binary tree is O(log N), the recursion depth is also O(log N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/count-complete-binary-tree-nodes-article)*
