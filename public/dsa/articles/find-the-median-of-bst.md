# Find the Median of BST

> **Slug:** `find-the-median-of-bst`  
> **Published:** 2026-07-21T14:42:44.182Z  
> **Updated:** 2026-07-21T14:42:44.185Z  
> **Keywords:** BST, Tree  
> **Cover Image:** ![Find the Median of BST](6a5f845ee67576629cc4d1e6)

**Description:** Median of BST DSA solution using inorder traversal. Find middle element(s) in sorted order with complexity analysis.

---

## Problem Statement

Given the root of a Binary Search Tree (BST), find the median of the BST's elements. The median is defined as follows:

- If the number of nodes in the BST is odd, the median is the middle element of the sorted elements.
- If the number of nodes is even, the median is the average of the two middle elements.

Since performing an inorder traversal on a BST yields elements in ascending order, it can be used to determine the median efficiently.

## Example 1

> [!NOTE]
> **INFO**
> Example : root = [5,3,7,2,4,6,8]
> 
> Output: 5.0
> 
> Explanation: The sorted order is [2,3,4,5,6,7,8] and the median value is 5.

## Example 2

> [!NOTE]
> **INFO**
> Example : root = [5,3,7,2,4,6,8]
> 
> Output: 10.0
> 
> Explanation: The sorted order is [3,5,7,10,13,15,20] and the median value is 10.

## Intuition

A Binary Search Tree (BST) has a special property that an in-order traversal visits all nodes in sorted order.

So, if we perform an in-order traversal of the BST and store the values in a list, the list will automatically contain all elements in ascending order.

Once we have the sorted elements:

- If the total number of nodes is odd, the median will be the middle element.
- If the total number of nodes is even, the median will be the average of the two middle elements.

This makes the problem straightforward because the BST itself helps us generate the sorted sequence efficiently.

## Algorithm

**Step 1: **Create an empty list to store the elements of the BST.

**Step 2: **Perform an in-order traversal of the BST.

**Step 3: **During traversal we recursively traverse the left subtree then add the current node’s value to the list then recursively traverse the right subtree.

**Step 4: **After traversal, the list will contain all BST elements in sorted order.

**Step 5: **Find the total number of elements n.

**Step 6: **If n is odd, return the middle element then -> median = elements[n/2]

**Step 7: **If n is even, return the average of the two middle elements then -> (elements[(n/2)-1] + elements[n/2])/2

**Step 8: **Return the calculated median.





### C++ Implementation

```cpp
class Solution {
private:

    void inorder(TreeNode* node, vector<int>& elements) {

        if (node == nullptr) {
            return;
        }

        inorder(node->left, elements);

        elements.push_back(node->val);

        inorder(node->right, elements);
    }

public:

    double findMedian(TreeNode* root) {

        vector<int> elements;

        inorder(root, elements);

        int n = elements.size();

        if (n % 2 == 1) {

            return (double)elements[n / 2];

        } else {

            return (
                elements[(n / 2) - 1]
                + elements[n / 2]
            ) / 2.0;
        }
    }
};
```

### Java Implementation

```java
class Solution {
    private void inorder(TreeNode node, List<Integer> elements) {
        if (node == null) return;
        inorder(node.left, elements);
        elements.add(node.val);
        inorder(node.right, elements);
    }

    public double findMedian(TreeNode root) {
        List<Integer> elements = new ArrayList<>();
        inorder(root, elements);

        int n = elements.size();
        if (n % 2 == 1) {
            return (double) elements.get(n / 2);
        } else {
            return (elements.get((n / 2) - 1) + elements.get(n / 2)) / 2.0;
        }
    }
}
```

### Python Implementation

```python
class Solution:

    def inorder(self, node, elements):

        if node is None:
            return

        self.inorder(node.left, elements)

        elements.append(node.val)

        self.inorder(node.right, elements)

    def findMedian(self, root):

        elements = []

        self.inorder(root, elements)

        n = len(elements)

        if n % 2 == 1:

            return float(elements[n // 2])

        else:

            return (
                elements[(n // 2) - 1]
                + elements[n // 2]
            ) / 2.0
```

## **Time Complexity: O(N)**

**Explanation: **We visit every node exactly once during the in-order traversal. Therefore, the total time complexity is O(N).

## **Space Complexity: O(N)**

**Explanation: **We use an additional list to store all node values from the BST. Since the list stores all N elements, the space complexity is O(N).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/find-the-median-of-bst)*
