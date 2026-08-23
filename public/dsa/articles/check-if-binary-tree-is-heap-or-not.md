# Check if Binary Tree is Heap or Not

> **Slug:** `check-if-binary-tree-is-heap-or-not`  
> **Published:** 2026-07-07T18:35:30.532Z  
> **Updated:** 2026-07-07T18:35:30.633Z  
> **Keywords:** Check if Binary Tree is Heap or Not, Heap, Binary Tree  
> **Cover Image:** ![Check if Binary Tree is Heap or Not](https://cdn.codehelp.in/media/Check if Binary Tree is heap or not.png)

**Description:** Check if a binary tree is a max-heap by  heap order. Learn BFS and index-based methods with examples, edge cases, and O(n) optimized solution.

---

## Problem Description

Given the root of a binary tree, the goal is to determine if the tree satisfies the properties of a max-heap. A binary tree is a max-heap if it adheres to the following criteria:

1. **Complete Binary Tree**: All levels of the tree should be fully filled, except possibly the last, which must be filled from left to right.
2. **Max-Heap Property**: Each node's value must be greater than or equal to the values of its children.

You need to implement a function that checks these properties and returns ***true*** if the binary tree fulfills both the complete binary tree and the max-heap properties. Otherwise, it should return ***false***.

### Example

Consider the following binary tree:

This tree is:

- A complete binary tree as all levels except the last are fully filled, and the last level is filled from left to right.
- All parent nodes have greater or equal values than their child nodes.

Hence, the function should return ***true***.

### Note

Consider various edge cases such as trees with a single node or trees that do not satisfy the completeness property.

### Constraints

- The number of nodes in the tree is in the range [1, 10^4].
- The values of the nodes are in the range [-10^4, 10^4]

### Example 1

> [!NOTE]
> **INFO**
> **Input:** tree = [10, 9, 8, 5, 6, 7, 4]
> **Output:t**rue
> **Explanation:** Tree maintains max-heap properties across all levels.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** tree = [10, 15, 8, 7, 6, 5, 4]
> **Output: false**
> **Explanation:** The value 15 violates the max-heap property as it is greater than its parent.

## Real Life Based Analogy

In a grand hotel that hosts an annual “Pyramid Banquet”, tables are arranged in tiers: one VIP table at the top, two tables on the next tier, four on the next, and so on — each tier can hold twice as many tables as the tier above it. The hotel manager has two strict rules for seating guests at the banquet.

First, the Seating Rule: the staff must fill every table on a tier from left to right before placing guests on the next tier. If the last tier is only partially filled, the staff still must place people from the leftmost table toward the right — no skipping a left table and sitting guests at a right one first. This keeps the hall tidy and predictable (no awkward gaps).

Second, the Seniority Rule: any person sitting at a table must have priority (seniority level, or importance) greater than or equal to everyone at the tables immediately below them. In practice: the VIP at the top must be at least as important as the two people at the next tier; each person on the second tier must be no less important than the two people under them on the third tier, and so on. This prevents junior guests from sitting above seniors and maintains the intended hierarchy.

On banquet day the manager asks an inspector to ensure the seating follows both rules.

The inspector walks through the hall like this:

1. Level-by-level walk (the inspector’s left-to-right scan): She inspects every table in order — starting from the VIP table, then the left table of the next tier, then the right table of that tier, then the leftmost of the third tier, and so on. This is exactly like a level-order traversal (breadth-first search) of a tree.
2. Completeness check (no gaps rule): While walking, the inspector watches for an empty table (an unoccupied spot). If she finds an empty table and later sees a filled table, she raises a red flag: the staff violated the left-to-right filling rule. In algorithm terms you can do this by BFS: once you encounter a null child, any subsequent node in the level-order scan must also be null. If not — the tree is not complete.
3. Max-Heap check (seniority comparison): For every seated guest she passes, she compares their priority to the priorities of the guests sitting at the two tables directly below them. If any guest below has a higher priority than the one above, that breaks the hierarchy and the banquet fails the Seniority Rule. Algorithmically, for every parent node visited during BFS, check parent >= leftChild and parent >= rightChild (when the children exist).
4. Counting/Index trick (another inspector’s method):

A second inspector uses the hall’s seat numbers to be sure the layout is structurally correct. He assigns each table a consecutive number as he walks (0, 1, 2, ...). If the last assigned index equals the total number of tables minus one, the seating is complete. This mirrors the array-index property used in heaps: for n nodes, valid child indices 2*i+1 and 2*i+2 must be < n. If you ever find a child index ≥ n, the structure is incomplete.

## Brute-Force Approach

### Intuition:

The brute-force approach breaks down the problem into separate checks:

1. **Count total nodes**: First traversal to get the total number of nodes
2. **Check completeness**: Second traversal using index-based verification
3. **Check max-heap property**: Third traversal to verify parent-child relationships

We need to verify completeness by ensuring that if we number nodes level by level from left to right (starting from index 0), no gaps should exist. For a complete binary tree with n nodes, all indices from 0 to n-1 should be occupied.

The max-heap property requires that every parent node's value is greater than or equal to its children's values.

### Algorithm

1. **Firstly, we handle the empty-tree edge case**, If `root` is `null`, then we return `true`. And for empty binary tree contains no nodes that can violate completeness or the max-heap property, so it is considered a valid max-heap.
2. **Now, Count nodes as we traverse the entire tree to get ****`N`**. We Perform a full traversal (BFS or DFS) and count each and every node exactly once to obtain `N`, the total number of nodes.
We need `N` because completeness is checked by mapping nodes to array-style indices `0..N-1`. Then, Counting first gives a concrete bound to validate indices against.
3. **Index the nodes using array-mapping (root = 0)**. So, Conceptually map the tree to an array as for a node at index `i`
4. 1. left child index = `2*i + 1`
  2. right child index = `2*i + 2`
During a traversal (recursive DFS or iterative BFS) carry the current node’s index along so each visited node has a unique index under this mapping.
5. ** As we check completeness during an indexed traversal**. For every visited node, if the node’s assigned index `≥ N`, the tree is **not complete** then we return `false` immediately.
Rationale: a complete binary tree, when mapped to indices, must occupy indices `0` through `N-1` without gaps. An out-of-range index indicates a missing node somewhere above it.** **
6. **Now, Check the max-heap property for each node**. For each node we visit, if its left child exists ensure `node.value >= left.value`, and if its right child exists ensure `node.value >= right.value`.
If any comparison fails, the max-heap property is violated and return `false` immediately.
7. **Recommended as we combine counting and checking efficiently. **
8. - Option A (two-pass, simple): For the first pass count nodes (`N`). Second pass traverse with indices and perform completeness + heap checks.
  - Option B (single-pass iterative BFS): Do BFS, append nodes to an array as you visit them (this naturally numbers them left-to-right). After BFS you know `N` and can validate completeness by checking that no position is `null` in the expected array shape and verify heap-order by comparing parent/child values using array indices.
Either approach ensures every node is visited only a small constant number of times.
9. ** We return the final result** as if the traversal completes without detecting an out-of-range index or any heap-order violation, return `true`. Otherwise we return `false` as soon as you detect the first failure.

### Code

### C++ Implementation

```cpp
class Solution {

public:

    bool isHeap(TreeNode* root) {

        // Step 1: Handle edge case
        if (root == NULL) {
            return true;
        }

        // Step 2: Count total nodes
        int nodeCount = countNodes(root);

        // Step 3 & 4: Check both properties
        return isComplete(root, 0, nodeCount)
               && isMaxHeap(root);
    }

    // Count total nodes
    int countNodes(TreeNode* root) {

        if (root == NULL) {
            return 0;
        }

        return 1
               + countNodes(root->left)
               + countNodes(root->right);
    }

    // Check complete binary tree
    bool isComplete(TreeNode* root,
                    int index,
                    int nodeCount) {

        if (root == NULL) {
            return true;
        }

        // Invalid index
        if (index >= nodeCount) {
            return false;
        }

        return isComplete(root->left,
                          2 * index + 1,
                          nodeCount)
               &&
               isComplete(root->right,
                          2 * index + 2,
                          nodeCount);
    }

    // Check max heap property
    bool isMaxHeap(TreeNode* root) {

        if (root == NULL) {
            return true;
        }

        // Check left child
        if (root->left != NULL
            && root->val < root->left->val) {

            return false;
        }

        // Check right child
        if (root->right != NULL
            && root->val < root->right->val) {

            return false;
        }

        return isMaxHeap(root->left)
               &&
               isMaxHeap(root->right);
    }
};
```

### Java Implementation

```java
class Solution {
    public boolean isHeap(TreeNode root) {
        // Step 1: Handle edge case
        if (root == null) return true;
        
        // Step 2: Count total nodes
        int nodeCount = countNodes(root);
        
        // Step 3 & 4: Check both properties
        return isComplete(root, 0, nodeCount) && isMaxHeap(root);
    }
    
    // Helper method to count total nodes
    private int countNodes(TreeNode root) {
        if (root == null) return 0;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
    
    // Helper method to check if tree is complete using index approach
    private boolean isComplete(TreeNode root, int index, int nodeCount) {
        if (root == null) return true;
        
        // If index is >= nodeCount, tree is not complete
        if (index >= nodeCount) return false;
        
        // Recursively check left and right subtrees
        return isComplete(root.left, 2 * index + 1, nodeCount) &&
               isComplete(root.right, 2 * index + 2, nodeCount);
    }
    
    // Helper method to check max-heap property
    private boolean isMaxHeap(TreeNode root) {
        if (root == null) return true;
        
        // Check if current node violates max-heap property with children
        if (root.left != null && root.val < root.left.val) return false;
        if (root.right != null && root.val < root.right.val) return false;
        
        // Recursively check subtrees
        return isMaxHeap(root.left) && isMaxHeap(root.right);
    }
}
```

### Python Implementation

```python
class TreeNode:

    def __init__(self, val=0, left=None, right=None):

        self.val = val
        self.left = left
        self.right = right


class Solution:

    def isHeap(self, root):

        # Step 1: Handle edge case
        if root is None:
            return True

        # Step 2: Count total nodes
        node_count = self.count_nodes(root)

        # Step 3 & 4: Check both properties
        return (self.is_complete(root, 0, node_count)
                and self.is_max_heap(root))

    # Helper method to count nodes
    def count_nodes(self, root):

        if root is None:
            return 0

        return (1
                + self.count_nodes(root.left)
                + self.count_nodes(root.right))

    # Check if tree is complete
    def is_complete(self, root, index, node_count):

        if root is None:
            return True

        # Invalid index means not complete
        if index >= node_count:
            return False

        return (
            self.is_complete(root.left,
                             2 * index + 1,
                             node_count)
            and
            self.is_complete(root.right,
                             2 * index + 2,
                             node_count)
        )

    # Check max heap property
    def is_max_heap(self, root):

        if root is None:
            return True

        # Check left child
        if root.left and root.val < root.left.val:
            return False

        # Check right child
        if root.right and root.val < root.right.val:
            return False

        return (
            self.is_max_heap(root.left)
            and
            self.is_max_heap(root.right)
        )
```

### Dry Run

> [!NOTE]
> **INFO**
> Tree (with array-style indices in parentheses):
> 
> Array representation: `[20, 18, 15, 12, 13, 10]`
> There are 6 nodes (indices 0..5).
> 
> #### Step 1 — `isHeap(root)`
> 
> `root` is not null → proceed.
> 
> #### **Step 2 —** `countNodes(root)` — full recursion trace (returns `nodeCount = 6`)
> 
> Call and return flow (showing `countNodes(node) -> returned_value`):
> 
> `countNodes(20)` → `1 + countNodes(18) + countNodes(15)`
> 
> `countNodes(18)` → `1 + countNodes(12) + countNodes(13)`
> 
> `countNodes(12)` → `1 + countNodes(null) + countNodes(null)` → `1 + 0 + 0 = 1` → returns **1**
> 
> `countNodes(13)` → `1 + 0 + 0 = 1` → returns **1**
> 
> So `countNodes(18) = 1 + 1 + 1 = 3` → returns **3**
> 
> `countNodes(15)` → `1 + countNodes(10) + countNodes(null)`
> 
> `countNodes(10)` → `1 + 0 + 0 = 1` → returns **1**
> 
> `countNodes(null)` → `0`
> 
> So `countNodes(15) = 1 + 1 + 0 = 2` → returns **2**
> 
> So `countNodes(20) = 1 + 3 + 2 = 6` → returns **6**
> 
> So `nodeCount = 6`.
> 
> #### **Step 3** — `isComplete(root, index = 0, nodeCount = 6)`
> 
> We check indices (left child index = `2*i+1`, right = `2*i+2`). A subtree is invalid if its assigned index ≥ `nodeCount`.
> 
> Recursive calls (show `isComplete(node, index)` → result):
> 
> `isComplete(20, 0)` — check `0 < 6` → proceed to children
> a. `isComplete(18, 1)` — `1 < 6`
> i. `isComplete(12, 3)` — `3 < 6`
> - `isComplete(null, 7)` → null → **true**
> - `isComplete(null, 8)` → null → **true**
> → `isComplete(12,3)` returns **true**
> ii. `isComplete(13, 4)` — `4 < 6`
> - `isComplete(null, 9)` → **true**
> - `isComplete(null, 10)` → **true**
> → `isComplete(13,4)` returns **true**
> → `isComplete(18,1)` returns **true** (both children true)
> b. `isComplete(15, 2)` — `2 < 6`
> i. `isComplete(10, 5)` — `5 < 6`
> - `isComplete(null, 11)` → **true**
> - `isComplete(null, 12)` → **true**
> → `isComplete(10,5)` returns **true**
> ii. `isComplete(null, 6)` → null → **true** (note: index 6 === nodeCount but node is null so method returns true immediately on null before comparing index)
> → `isComplete(15,2)` returns **true**
> → `isComplete(20,0)` returns **true**
> 
> All calls returned `true`, so the tree is **complete**.
> 
> > Important note on the `null, index >= nodeCount` case: the code first checks `if (root == null) return true;` — so null children don't trigger the `index >= nodeCount` failure. Only non-null nodes assigned an index ≥ `nodeCount` would make the function return `false`. In our tree every non-null node has index < 6, so it passes.
> 
> ### **Step 4 — **`isMaxHeap(root)` — check parent ≥ children at every node
> 
> Evaluate node-by-node (show comparisons and results):
> 
> Node `20`:
> 
> left = `18` → `20 < 18 ?` → **no** (20 ≥ 18) — OK
> 
> right = `15` → `20 < 15 ?` → **no** (20 ≥ 15) — OK
> → recurse into left and right
> 
> Node `18`:
> 
> left = `12` → `18 < 12 ?` → **no** — OK
> 
> right = `13` → `18 < 13 ?` → **no** — OK
> → recurse
> 
> Node `12`: leaf → OK
> 
> Node `13`: leaf → OK
> 
> Node `15`:
> 
> left = `10` → `15 < 10 ?` → **no** — OK
> 
> right = `null` → nothing to check
> → recurse
> 
> Node `10`: leaf → OK
> 
> All parent-child comparisons satisfied (`parent >= child`), so `isMaxHeap` returns **true**.
> 
> ##### **Final result**
> 
> Both `isComplete(...)` and `isMaxHeap(...)` returned **true**, so:
> 
> `isHeap(root)` **returns ****`true`** — the tree is a valid max-heap (complete + max-heap property).

### Complexity Analysis

#### **Time Complexity: O(n)**

- First, we count the total number of nodes in the tree, which requires visiting each node once, this takes **O(n)** time.
- Next, we check whether the tree is complete. This step also requires traversing the tree, and in the worst case, it visits every node once, resulting in another **O(n)**.
- After that, we verify the max-heap property, which again involves visiting each node once, giving us another **O(n)**.
- Thus, the overall time complexity is:** O(n) + O(n) + O(n) = O(3n) = O(n)**

**Space Complexity: O(h)**
where, 'h' is the height of the tree

- **Worst Case (Skewed Tree):** If the tree is skewed (like a linked list), the height of the tree becomes **n**. In this case, the recursion stack may grow up to **O(n)**.
- **Best Case (Balanced Tree):** If the tree is balanced, its height is approximately **log n**. Hence, the recursion stack depth in this case is **O(log n)**.

## Optimal Approach

### Intuition

 Instead of making three separate traversals, we can optimize by combining the completeness check and max-heap property check into a single traversal. We still need one pass to count nodes first, but then we can verify both properties simultaneously. The key insight is that during the completeness check traversal, we're already visiting each node, so we can simultaneously verify the max-heap property at each node we visit.

Additionally, we can use the **level-order traversal (BFS)** approach for completeness check, which is more intuitive - in a complete binary tree, once we encounter the first null (missing node), all subsequent nodes should also be null.

### Algorithm

1. If the root of the tree is `null`, then the tree is considered a valid max-heap by definition.
2. In this case, we can immediately return **true** without any further computation.
3. **Count Total Nodes, We **Perform a traversal of the tree to count the total number of nodes. This step is **unavoidable** because the completeness check requires knowing the total count. The counting itself takes **O(n)** time, where `n` is the number of nodes.
4. **Perform Combined Check as during** a **single recursive traversal**, we verify both properties:** Completeness Check:**
Use an **index-based approach** (assigning indices as in a binary heap array representation).
For a valid complete binary tree, if a node is assigned index `i`, then:
5. 1. Left child should have index **2i + 1**
  2. Right child should have index **2i + 2**
  3. No node’s index should exceed the total node count.**Max-Heap Property Check:** At each visited node, ensure that the value of the current node is **greater than or equal to** the values of its children.
6. **At last, we return result:**
7. 1. The recursive check ensures both **completeness** and the **max-heap property** are satisfied.
  2. Only if **both conditions** hold true, return **true**; otherwise, return **false**.

### Code

### C++ Implementation

```cpp
class Solution {

public:

    bool isHeap(TreeNode* root) {

        // Step 1: Handle edge case
        if (root == NULL) {
            return true;
        }

        // Step 2: Count total nodes
        int nodeCount = countNodes(root);

        // Step 3: Check both properties
        return checkHeapProperties(
            root,
            0,
            nodeCount
        );
    }

    // Count total nodes
    int countNodes(TreeNode* root) {

        if (root == NULL) {
            return 0;
        }

        return 1
               + countNodes(root->left)
               + countNodes(root->right);
    }

    // Check completeness and heap property
    bool checkHeapProperties(TreeNode* root,
                             int index,
                             int nodeCount) {

        if (root == NULL) {
            return true;
        }

        // Completeness check
        if (index >= nodeCount) {
            return false;
        }

        // Max heap property check
        if (root->left != NULL
            && root->val < root->left->val) {

            return false;
        }

        if (root->right != NULL
            && root->val < root->right->val) {

            return false;
        }

        return checkHeapProperties(
                    root->left,
                    2 * index + 1,
                    nodeCount
               )
               &&
               checkHeapProperties(
                    root->right,
                    2 * index + 2,
                    nodeCount
               );
    }
};
```

### Java Implementation

```java
class Solution {
    public boolean isHeap(TreeNode root) {
        // Step 1: Handle edge case
        if (root == null) return true;
        
        // Step 2: Count total nodes
        int nodeCount = countNodes(root);
        
        // Step 3: Check both properties in single traversal
        return checkHeapProperties(root, 0, nodeCount);
    }
    
    // Helper method to count nodes
    private int countNodes(TreeNode root) {
        if (root == null) return 0;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
    
    // Single method to check both completeness and max-heap property
    private boolean checkHeapProperties(TreeNode root, int index, int nodeCount) {
        if (root == null) return true;
        
        // Check completeness: index should be within bounds
        if (index >= nodeCount) return false;
        
        // Check max-heap property: parent >= children
        if (root.left != null && root.val < root.left.val) return false;
        if (root.right != null && root.val < root.right.val) return false;
        
        // Recursively check left and right subtrees
        return checkHeapProperties(root.left, 2 * index + 1, nodeCount) &&
               checkHeapProperties(root.right, 2 * index + 2, nodeCount);
    }
}
```

### Python Implementation

```python
class TreeNode:

    def __init__(self, val=0, left=None, right=None):

        self.val = val
        self.left = left
        self.right = right


class Solution:

    def isHeap(self, root):

        # Step 1: Handle edge case
        if root is None:
            return True

        # Step 2: Count total nodes
        node_count = self.count_nodes(root)

        # Step 3: Check both properties
        return self.check_heap_properties(
            root,
            0,
            node_count
        )

    # Helper method to count nodes
    def count_nodes(self, root):

        if root is None:
            return 0

        return (
            1
            + self.count_nodes(root.left)
            + self.count_nodes(root.right)
        )

    # Check completeness and heap property
    def check_heap_properties(self,
                              root,
                              index,
                              node_count):

        if root is None:
            return True

        # Completeness check
        if index >= node_count:
            return False

        # Max heap property check
        if root.left and root.val < root.left.val:
            return False

        if root.right and root.val < root.right.val:
            return False

        return (
            self.check_heap_properties(
                root.left,
                2 * index + 1,
                node_count
            )
            and
            self.check_heap_properties(
                root.right,
                2 * index + 2,
                node_count
            )
        )
```

### Dry Run

> [!NOTE]
> **INFO**
> Array/index representation (level order):
> 
> - index 0 -> 10
> - index 1 -> 9
> - index 2 -> 8
> - index 3 -> 7
> - index 4 -> 6
> - index 5 -> 5
> 
> So `nodeCount = 6` (indices 0..5 valid).
> 
> ### Step A — `countNodes(root)`
> 
> `countNodes` traverses recursively:
> 
> - count(10) = 1 + count(9) + count(8)
> - - count(9) = 1 + count(7) + count(6) = 1 + 1 + 1 = 3
>   - - count(7) = 1
>     - count(6) = 1
>   - count(8) = 1 + count(5) + count(null) = 1 + 1 + 0 = 2
>   - - count(5) = 1
> 
> So total `nodeCount = 1 + 3 + 2 = 6`.
> 
> ### Step B — `checkHeapProperties(root, 0, 6)`
> 
> I'll list each recursive call, its `index`, checks performed, and return value.
> 
> 1. `checkHeapProperties(node=10, index=0, nodeCount=6)`
> 2. - completeness: `index (0) < nodeCount (6)` → **OK**
>   - left exists (9): check `root.val < root.left.val` → `10 < 9` → **false** (so OK)
>   - right exists (8): check `10 < 8` → **false** (OK)
>   - Recurse on left and right:
>   - - evaluate `checkHeapProperties(node=9, index=1, nodeCount=6)` AND
>     - `checkHeapProperties(node=8, index=2, nodeCount=6)`
> 3. `checkHeapProperties(node=9, index=1, nodeCount=6)`
> 4. - completeness: `1 < 6` → **OK**
>   - left exists (7): `9 < 7` → **false** (OK)
>   - right exists (6): `9 < 6` → **false** (OK)
>   - Recurse:
>   - - `checkHeapProperties(node=7, index=3, nodeCount=6)` AND
>     - `checkHeapProperties(node=6, index=4, nodeCount=6)`
> 5. `checkHeapProperties(node=7, index=3, nodeCount=6)`
> 6. - completeness: `3 < 6` → **OK**
>   - left: `null` (no check)
>   - right: `null`
>   - returns **true**
> 7. `checkHeapProperties(node=6, index=4, nodeCount=6)`
> → so node 9 subtree returns `true && true = true`
> 8. - completeness: `4 < 6` → **OK**
>   - no children
>   - returns **true**
> 9. `checkHeapProperties(node=8, index=2, nodeCount=6)`
> 10. - completeness: `2 < 6` → **OK**
>   - left exists (5): `8 < 5` → **false** (OK)
>   - right: `null`
>   - Recurse:
>   - - `checkHeapProperties(node=5, index=5, nodeCount=6)` AND
>     - `checkHeapProperties(node=null, index=6, nodeCount=6)`
> 11. `checkHeapProperties(node=5, index=5, nodeCount=6)`
> 12. - completeness: `5 < 6` → **OK**
>   - no children
>   - returns **true**
> 13. `checkHeapProperties(node=null, index=6, nodeCount=6)`
> → node 8 subtree returns `true && true = true`
> 14. - root == null → returns **true**
> 
> Finally root returns `true && true = true`.
> 
> ### Final result
> 
> `isHeap(root)` returns **true** for this tree — it is both **complete** (indices 0..5 used appropriately; index checks passed) and satisfies the **max-heap property** (every parent ≥ its children).

### Complexity Analysis

#### **Time Complexity: O(n)**

- Here, we first count the total number of nodes, and since the **countNodes** function visits every node once, it takes **O(n)**time.
- After that, for checking the completeness and max-heap properties, the **checkHeapProperties** function also visits each node once, which again takes **O(n)** time.
- Since both traversals are separate, the total time is **O(n) + O(n) = O(2n) = O(n)**.
- Thus, the overall **time complexity is O(n)**.

#### **Space Complexity: O(h)**

where, 'h' is the height of the tree

- The space is used by the recursion stack during the DFS traversal. Here, **h** represents the height of the tree.
- In the **worst case (skewed tree)**, if the tree is skewed (like a linked list), the height of the tree becomes **n**, leading to **O(n)**space complexity.
- In the **best case (balanced tree)**, if the tree is balanced, its height is approximately **log n**, resulting in **O(log n)** space complexity.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/check-if-binary-tree-is-heap-or-not)*
