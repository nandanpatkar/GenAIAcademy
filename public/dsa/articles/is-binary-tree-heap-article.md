# Is Binary Tree Heap?

> **Slug:** `is-binary-tree-heap-article`  
> **Published:** 2026-08-02T09:23:08.522Z  
> **Updated:** 2026-08-02T09:23:08.526Z  
> **Keywords:** Tree  
> **Cover Image:** ![Is Binary Tree Heap?](6a6f0afccddbc98100890d57)

**Description:** Learn how to check if a binary tree is a valid Max-Heap using BFS and recursion with efficient O(N) C++, Java, and Python solutions.

---

## Problem Statement

A **Binary Heap** is a specialized tree-based data structure that satisfies the **heap property** and the **shape property**. For this problem, we will focus on determining if a given binary tree is a **Max-Heap**.

A binary tree is a Max-Heap if it satisfies both of the following properties:

1. **Shape Property (Complete Binary Tree):** The tree must be a **complete binary tree**. A complete binary tree is a binary tree in which every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. This means that if we were to represent the tree using an array (where the root is at index 0, its left child at 2i+1, and its right child at 2i+2), then all indices from 0 up to N-1 (where N is the total number of nodes) must be occupied without any gaps.
2. **Heap Property (Max-Heap):** For every node N in the tree, the value of N must be greater than or equal to the values of its children (if they exist). That is, if N.left exists, then N.val >= N.left.val, and if N.right exists, then N.val >= N.right.val.

Given the root of a binary tree, determine if it is a Max-Heap.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: Tree: [10, 9, 8, 7, 6, 5]
> 
> Output: true
> 
> Explanation: This tree is a complete binary tree: all levels are filled except the last, and nodes on the last level (7, 6, 5) are as far left as possible. It also satisfies the Max-Heap property: 10 >= 9, 10 >= 8; 9 >= 7, 9 >= 6; 8 >= 5. Both properties are met, making it a valid Max-Heap.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: Tree: [35, 92, 1, 60, 88, null, 96, 98, 17, 67, 32]
> 
> Output: false
> 
> Explanation: Tree violates the shape property (not a complete binary tree).

## Intuition

To determine whether a binary tree is a Max-Heap, we need to check two conditions. The first condition is that the tree must be a Complete Binary Tree. This means all levels should be completely filled except possibly the last level, and the last level nodes must appear from left to right without gaps. We can check this using level-order traversal (BFS). While traversing the tree, once we encounter a null node, all nodes that appear afterward must also be null. If we find a non-null node after a null, it means there is a gap in the tree, so the tree is not complete. The second condition is the Max-Heap property. Every parent node must have a value greater than or equal to its children. We can verify this recursively for every node in the tree. If both the completeness condition and the heap property are satisfied, then the binary tree is a valid Max-Heap.

## Algorithm

**Step 1: **Create a function to check whether the binary tree is complete.

**Step 2: **If the root is null, return true.

**Step 3: ** Perform level-order traversal using a queue and insert the root node into it.

**Step 4: **Traverse the tree while the queue is not empty.

**Step 5: **Remove the front node from the queue.

- If the node is null, mark that a null node has been found.
- Otherwise:
- - If a null node was already found earlier, return false.
  - Insert the left and right children into the queue.

**Step 6: ** If traversal finishes successfully, return true because the tree is complete.

**Step 7: **Create another function to check the Max-Heap property recursively.

**Step 8: **For every node, If the left child exists and its value is greater than the current node, return false orIf the right child exists and its value is greater than the current node, return false.

**Step 9: **Recursively check the left and right subtrees.

**Step 10: **If all nodes satisfy the heap property, return true.

**Step 11: **In the main function, return the result of both checks:

- The tree must be complete.
- The heap property must also be satisfied.





### C++ Implementation

```cpp
class Solution {
public:

    bool isComplete(TreeNode* root) {

        if (root == nullptr) {
            return true;
        }

        queue<TreeNode*> q;

        q.push(root);

        bool foundNull = false;

        while (!q.empty()) {

            TreeNode* current = q.front();
            q.pop();

            if (current == nullptr) {

                foundNull = true;

            } else {

                if (foundNull) {
                    return false;
                }

                q.push(current->left);
                q.push(current->right);
            }
        }

        return true;
    }

    bool isHeapPropertySatisfied(TreeNode* root) {

        if (root == nullptr) {
            return true;
        }

        if (root->left != nullptr) {

            if (root->val < root->left->val) {
                return false;
            }

            if (!isHeapPropertySatisfied(root->left)) {
                return false;
            }
        }

        if (root->right != nullptr) {

            if (root->val < root->right->val) {
                return false;
            }

            if (!isHeapPropertySatisfied(root->right)) {
                return false;
            }
        }

        return true;
    }

    bool isBinaryTreeHeap(TreeNode* root) {

        return isComplete(root) &&
               isHeapPropertySatisfied(root);
    }
};
```

### Java Implementation

```java
class Solution {
    public boolean isComplete(TreeNode root) {
        if (root == null) {
            return true;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        boolean foundNull = false;

        while (!queue.isEmpty()) {
            TreeNode current = queue.poll();

            if (current == null) {
                foundNull = true;
            } else {
                if (foundNull) {
                    return false;
                }
                queue.add(current.left);
                queue.add(current.right);
            }
        }
        return true;
    }

    public boolean isHeapPropertySatisfied(TreeNode root) {
        if (root == null) {
            return true;
        }

        if (root.left != null) {
            if (root.val < root.left.val) {
                return false;
            }
            if (!isHeapPropertySatisfied(root.left)) {
                return false;
            }
        }

        if (root.right != null) {
            if (root.val < root.right.val) {
                return false;
            }
            if (!isHeapPropertySatisfied(root.right)) {
                return false;
            }
        }

        return true;
    }

    public boolean isBinaryTreeHeap(TreeNode root) {
        return isComplete(root) && isHeapPropertySatisfied(root);
    }
}
```

### Python Implementation

```python
class Solution:

    def isComplete(self, root):

        if root is None:
            return True

        queue = deque()

        queue.append(root)

        foundNull = False

        while queue:

            current = queue.popleft()

            if current is None:

                foundNull = True

            else:

                if foundNull:
                    return False

                queue.append(current.left)
                queue.append(current.right)

        return True

    def isHeapPropertySatisfied(self, root):

        if root is None:
            return True

        if root.left is not None:

            if root.val < root.left.val:
                return False

            if not self.isHeapPropertySatisfied(root.left):
                return False

        if root.right is not None:

            if root.val < root.right.val:
                return False

            if not self.isHeapPropertySatisfied(root.right):
                return False

        return True

    def isBinaryTreeHeap(self, root):

        return (
            self.isComplete(root)
            and self.isHeapPropertySatisfied(root)
        )
```

## Time Complexity: **O(N)**

**Explanation: **We traverse all nodes once while checking completeness and once again while checking the heap property. Since each node is visited only once in both traversals, the total time complexity is O(N).

## Space Complexity: **O(N)**

**Explanation: **The queue used for level-order traversal can store up to N nodes in the worst case. The recursive heap check also uses recursion stack space depending on the height of the tree. Therefore, the overall space complexity is O(N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/is-binary-tree-heap-article)*
