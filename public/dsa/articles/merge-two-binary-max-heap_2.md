# Merge Two Binary Max Heap

> **Slug:** `merge-two-binary-max-heap_2`  
> **Published:** 2026-07-10T17:22:14.809Z  
> **Updated:** 2026-07-10T17:22:14.838Z  
> **Keywords:** Merge Two Binary Max Heap, Binary, Heap, Merge  
> **Cover Image:** ![Merge Two Binary Max Heap](https://cdn.codehelp.in/media/articles/1783702722733-e685bc42-Merge_Two_Binary_Max_Heap.png)

**Description:** Learn how to merge two Binary Max Heaps using brute and optimal approaches, with  explanations, complexity analysis, and code implementations.

---

## Problem Description

Given two binary max-heaps represented by their root nodes, your task is to merge these heaps into a single binary max-heap, while maintaining the max-heap properties. A binary max-heap is a complete binary tree where each node's value is greater than or equal to the values of its children.

## Example

#### Heap 1:

> [!NOTE]
> **INFO**
> 10
> 
>    /  \  
> 
>   9    8

#### Heap 2:

> [!NOTE]
> **INFO**
> 5
> 
>    / \  
> 
>   4   6

After merging these heaps, the resulting max-heap is:

> [!NOTE]
> **INFO**
> 10
> 
>    /  \ 
> 
>   9    8
> 
>  / \  
> 
> 5   6
> 
>  
> 
> 4

The function should return the root of the merged binary max-heap.

### Example 1:

> [!NOTE]
> **INFO**
> Input: heap1 = [10, 9, 8, 7, 6, 5, 4], heap2 = [15, 12, 9, 7]
> 
> Output: 1
> 
> Explanation: Heaps are merged and heapified to maintain max-heap property.

### Example 2:

> [!NOTE]
> **INFO**
> Input: heap1 = [1], heap2 = [2]
> 
> Output: 1
> 
> Explanation: Single element heaps, merged with the larger element at the root.

### Example 3:

> [!NOTE]
> **INFO**
> Input: heap1 = [4, 3, 2, 1], heap2 = [6, 5]
> 
> Output: 1
> 
> Explanation: Two heaps merged into a max-heap structure.

### Constraints

- 1 <= **nums.length** <= 100
- 0 <=** nums[i]** <= 1000

### Real-Life Analogy

Imagine you have two giant mountains made entirely of stones. Each mountain is built in a very special way — the **biggest stone** always sits right on top, and every stone below it is **smaller** than the one supporting it. This perfect balance keeps the mountain stable and strong. These mountains represent your **binary max-heaps**.

One day, the king orders that both mountains be combined into one **even larger mountain**, but with a rule — the structure must remain the same:

- The biggest stone must stay on top.
- Every stone below should still be smaller than the one above it.
- And the mountain must remain perfectly shaped — no missing spaces or uneven sides.

The workers couldn’t just stack one mountain over the other — that would break the balance. So, they carefully gathered **all the stones** from both mountains and laid them out together on the ground.

Then, starting from the bottom, they began **rebuilding** the new mountain. They placed stones back layer by layer, ensuring at each step that the **largest stone always comes on top** and every stone beneath it is smaller, preserving the same perfect pyramid shape.

By the end, they had a single magnificent mountain — taller, stronger, and perfectly balanced — a new **max-heap**, formed by merging the two.

### Brute-Force Approach
Intuition

The brute-force approach strategy is insert all elements from both heaps into a new max-heap one by one. We start with the first heap and then insert each element from the second heap individually, maintaining the heap property after each insertion. This is similar to manually adding customers to a priority queue one at a time. Each time you add a customer, you need to ensure they're placed in the correct position based on their priority, which involves comparing and swapping with their parent until the heap property is satisfied.

### Algorithm

1. Firstly, Create a result heap and copy all elements from heap1 into it. This gives us our initial max-heap structure.
2. After this, we will insert elements one by one: For each element in heap2, insert it into the result heap using the standard heap insertion process and then, Add the element at the end of the heap, "Bubble up" or "heapify up" by comparing with parent and then swap with parent if the element is larger - Continue until heap property is restored
3. Now, we move to the heapify Up process, For each inserted element at position i: - Calculate parent index: `parent = (i - 1) / 2` - If `heap[i] > heap[parent]`, swap them and, Move to parent position and repeat. After this, we stop when element is in correct position or reaches root.
4. At last, we return the merged heap. After all elements from heap2 are inserted, return the result heap.

### Code

### C++ Implementation

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    // Helper function to maintain heap property by bubbling up
    void heapifyUp(vector<int>& heap, int index) {
        int parent = (index - 1) / 2;

        // If current element is greater than parent, swap and continue
        while (index > 0 && heap[index] > heap[parent]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }
    }

public:
    // Brute Force: Insert elements one by one from heap2 into heap1
    vector<int> mergeHeapsBruteForce(vector<int>& heap1, vector<int>& heap2) {
        // Start with heap1 as the result
        vector<int> result = heap1;

        // Insert each element from heap2 one by one
        for (int element : heap2) {
            result.push_back(element);              // Add at the end
            heapifyUp(result, result.size() - 1);   // Restore heap property
        }

        return result;
    }
};
```

### Java Implementation

```java
import java.util.*;

class Solution {
    // Helper function to maintain heap property by bubbling up
    private void heapifyUp(List<Integer> heap, int index) {
        int parent = (index - 1) / 2;
        
        // If current element is greater than parent, swap and continue
        while (index > 0 && heap.get(index) > heap.get(parent)) {
            Collections.swap(heap, index, parent);
            index = parent;
            parent = (index - 1) / 2;
        }
    }
    
    // Brute Force: Insert elements one by one from heap2 into heap1
    public List<Integer> mergeHeapsBruteForce(List<Integer> heap1, List<Integer> heap2) {
        // Start with heap1 as the result
        List<Integer> result = new ArrayList<>(heap1);
        
        // Insert each element from heap2 one by one
        for (int element : heap2) {
            result.add(element);  // Add at the end
            heapifyUp(result, result.size() - 1);  // Restore heap property
        }
        
        return result;
    }
}
```

### Python Implementation

```python
class Solution:
    # Helper function to maintain heap property by bubbling up
    def heapify_up(self, heap, index):
        parent = (index - 1) // 2

        # If current element is greater than parent, swap and continue
        while index > 0 and heap[index] > heap[parent]:
            heap[index], heap[parent] = heap[parent], heap[index]
            index = parent
            parent = (index - 1) // 2

    # Brute Force: Insert elements one by one from heap2 into heap1
    def mergeHeapsBruteForce(self, heap1, heap2):
        # Start with heap1 as the result
        result = heap1.copy()

        # Insert each element from heap2 one by one
        for element in heap2:
            result.append(element)              # Add at the end
            self.heapify_up(result, len(result) - 1)  # Restore heap property

        return result
```

### Complexity Analysis

#### Time Complexity: O((n + m) × log(n + m))

- Copying all **n** elements of **heap1** into the result takes **O(n)** time.
- We insert each of the **m** elements from **heap2** one by one.
- Each insertion consists of:  - Appending the element to the end of the heap: **O(1)**.
  - Performing a **heapify-up** operation to restore the max-heap property: **O(log k)**, where **k** is the current heap size.
- Since the heap size grows up to **n + m**, each heapify-up takes at most **O(log(n + m))**.
- Performing this for all **m** insertions takes **O(m × log(n + m))**.
- **Overall, O(n + m × log(n + m))**. This is commonly written as ***O((n + m) × log(n + m))***.

### Space Complexity: O(n + m)

- A new list/vector is created to store the merged heap, requiring **O(n + m)** space.
- The **heapify-up** operation uses only a constant amount of extra space (**O(1)**) for variables.
- **Overall Space Complexity:** ***O(n + m)***.

### Dry Run

// img

## Optimal Approach

## Intuition

The optimal approach leverages a key insight about heap construction as building a heap from scratch is faster than inserting elements one by one. This is based on the mathematical property that heapifying from the bottom-up takes O(n) time, not O(n log n). We need to think of it like this, instead of carefully placing each book on a shelf one by one (checking each time if it's in the right position), we dump all books on a table, then organize them all at once using a systematic approach starting from the bottom shelves and working your way up. This bulk organization is surprisingly more efficient. The algorithm works by: 

  1. Simply combining both arrays (no ordering needed) 

 2. Starting from the last non-leaf node and working backwards.

 3. "Sinking" each node down to its correct position (heapify down)

## Algorithm

1. Firstly, we merge the arrays as we combine both heap arrays into a single array.  No need to maintain heap property yet, just concatenate them. 
`mergedHeap = heap1 + heap2` and 
 Size: `n = mergedHeap.size()` 

2. After this, we find starting point: As Calculate the index of the last non-leaf node. And the formula we follow as `lastNonLeaf = n/2 - 1` because, In a complete binary tree, nodes from index n/2 to n-1 are leaf nodes 

3. Now, we heapify from bottom to top as  in the  Starting from the last non-leaf node and moving backwards to the root (index 0): For each node at index i, perform heapifyDown(i) and this ensures all subtrees below are valid heaps before processing the node 

4. Then we perform the process HeapifyDown Process For a node at index I, Find the largest among from current node, left child (2*i+1), right child (2*i+2) and If the largest is not the current node we swap current node with largest child and Recursively heapifyDown from the new position of swapped node. Stop when node is larger than both children orreaches a leaf.

5. At last, we return the heap,  After all nodes are heapified, the array represents a valid max-heap.

## Code

### C++ Implementation

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    // Helper function to maintain max-heap property by sinking down
    void heapifyDown(vector<int>& heap, int i, int n) {
        int largest = i;          // Initialize largest as root
        int left = 2 * i + 1;     // Left child index
        int right = 2 * i + 2;    // Right child index

        // If left child is larger than root
        if (left < n && heap[left] > heap[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && heap[right] > heap[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest != i) {
            swap(heap[i], heap[largest]);

            // Recursively heapify the affected subtree
            heapifyDown(heap, largest, n);
        }
    }

public:
    // Optimal approach: Merge + Build Heap
    vector<int> mergeHeaps(vector<int>& heap1, vector<int>& heap2) {
        // Step 1: Merge both heaps into one array
        vector<int> mergedHeap = heap1;
        mergedHeap.insert(mergedHeap.end(), heap2.begin(), heap2.end());

        int n = mergedHeap.size();

        // Step 2: Build heap from bottom to top
        // Start from last non-leaf node and move upwards
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapifyDown(mergedHeap, i, n);
        }

        return mergedHeap;
    }
};

// Driver Code
int main() {
    Solution sol;

    // Test Case 1
    vector<int> heap1 = {10, 9, 8, 7, 6, 5, 4};
    vector<int> heap2 = {15, 12, 9, 7};

    vector<int> result = sol.mergeHeaps(heap1, heap2);
    cout << "Merged Heap: ";
    for (int x : result)
        cout << x << " ";
    cout << endl;

    // Test Case 2
    heap1 = {20, 15, 10};
    heap2 = {25, 18, 12};

    result = sol.mergeHeaps(heap1, heap2);
    cout << "Merged Heap: ";
    for (int x : result)
        cout << x << " ";
    cout << endl;

    return 0;
}
```

### Java Implementation

```java
import java.util.*;

class Solution {
    // Helper function to maintain max-heap property by sinking down
    private void heapifyDown(List<Integer> heap, int i, int n) {
        int largest = i;           // Initialize largest as root
        int left = 2 * i + 1;      // Left child index
        int right = 2 * i + 2;     // Right child index
        
        // If left child is larger than root
        if (left < n && heap.get(left) > heap.get(largest)) {
            largest = left;
        }
        
        // If right child is larger than largest so far
        if (right < n && heap.get(right) > heap.get(largest)) {
            largest = right;
        }
        
        // If largest is not root
        if (largest != i) {
            Collections.swap(heap, i, largest);
            
            // Recursively heapify the affected subtree
            heapifyDown(heap, largest, n);
        }
    }
    
    // Optimal approach: Merge + Build Heap
    public List<Integer> mergeHeaps(List<Integer> heap1, List<Integer> heap2) {
        // Step 1: Merge both heaps into one array
        List<Integer> mergedHeap = new ArrayList<>(heap1);
        mergedHeap.addAll(heap2);
        
        int n = mergedHeap.size();
        
        // Step 2: Build heap from bottom to top
        // Start from last non-leaf node and move upwards
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapifyDown(mergedHeap, i, n);
        }
        
        return mergedHeap;
    }
    
    // Main method for testing
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Test Case 1
        List<Integer> heap1 = Arrays.asList(10, 9, 8, 7, 6, 5, 4);
        List<Integer> heap2 = Arrays.asList(15, 12, 9, 7);
        
        List<Integer> result = sol.mergeHeaps(heap1, heap2);
        System.out.println("Merged Heap: " + result);
        
        // Test Case 2
        heap1 = Arrays.asList(20, 15, 10);
        heap2 = Arrays.asList(25, 18, 12);
        
        result = sol.mergeHeaps(heap1, heap2);
        System.out.println("Merged Heap: " + result);
    }
}
```

### Python Implementation

```python
class Solution:
    # Helper function to maintain max-heap property by sinking down
    def heapify_down(self, heap, i, n):
        largest = i              # Initialize largest as root
        left = 2 * i + 1         # Left child index
        right = 2 * i + 2        # Right child index

        # If left child is larger than root
        if left < n and heap[left] > heap[largest]:
            largest = left

        # If right child is larger than largest so far
        if right < n and heap[right] > heap[largest]:
            largest = right

        # If largest is not root
        if largest != i:
            heap[i], heap[largest] = heap[largest], heap[i]

            # Recursively heapify the affected subtree
            self.heapify_down(heap, largest, n)

    # Optimal approach: Merge + Build Heap
    def mergeHeaps(self, heap1, heap2):
        # Step 1: Merge both heaps into one array
        merged_heap = heap1.copy()
        merged_heap.extend(heap2)

        n = len(merged_heap)

        # Step 2: Build heap from bottom to top
        # Start from last non-leaf node and move upwards
        for i in range(n // 2 - 1, -1, -1):
            self.heapify_down(merged_heap, i, n)

        return merged_heap


# Driver Code
if __name__ == "__main__":
    sol = Solution()

    # Test Case 1
    heap1 = [10, 9, 8, 7, 6, 5, 4]
    heap2 = [15, 12, 9, 7]

    result = sol.mergeHeaps(heap1, heap2)
    print("Merged Heap:", result)

    # Test Case 2
    heap1 = [20, 15, 10]
    heap2 = [25, 18, 12]

    result = sol.mergeHeaps(heap1, heap2)
    print("Merged Heap:", result)
```

### Complexity Analysis

#### Time Complexity: O(n + m)

- Merging both heaps into one array takes **O(n + m)**.
- Building a max-heap from the merged array using the **bottom-up heapify** algorithm also takes **O(n + m)**.
- Therefore, the **overall time complexity is O(n + m).**

#### Space Complexity:  O(n + m)

- A new array is created to store the merged heap, requiring **O(n + m)** space.
- The recursive **heapifyDown()** uses **O(log(n + m))** call stack space, which is negligible compared to the output array.
- Therefore, the **overall space complexity is O(n + m)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/merge-two-binary-max-heap_2)*
