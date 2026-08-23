# Kth Largest Element in an Array

> **Slug:** `kth-largest-element-in-an-array-article`  
> **Published:** 2026-06-30T17:25:08.065Z  
> **Updated:** 2026-06-30T17:25:08.068Z  
> **Keywords:** Array  
> **Cover Image:** ![Kth Largest Element in an Array](6a43fbeb64b25c8c10cb98dd)

**Description:** Find the Kth Largest Element using a min-heap (priority queue). DSA solution with C++, Java, Python, and O(n log k).

---

## Problem Statement

Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in sorted order, not the kth distinct element.

You must solve it without modifying the original array (though you can use auxiliary space).

## Example 1

> [!NOTE]
> **INFO**
> Input: nums = [3,2,1,5,6,4], k = 2
> 
> Output: 5
> 
> **Explanation:** When the array is sorted in ascending order, it becomes [1, 2, 3, 4, 5, 6]. The 2nd largest element is 5.

## Example 2

> [!NOTE]
> **INFO**
> Input:  nums = [3,2,1,5,6,4], k = 2
> 
> Output: 5 
> 
> **Explanation:** When sorted ascending: [1,2,3,4,5,6], the 2nd largest is 5.

## Intuition

To find the kth largest element efficiently, we can use a min-heap of size k.

The idea is to keep track of only the k largest elements seen so far:

- Every element from the array is added to the min-heap.
- If the heap size becomes greater than k, we remove the smallest element from the heap.

By doing this, the heap always contains the k largest elements of the array. Among these k elements, the smallest element will be the kth largest element overall. At the end of the traversal, the top element of the min-heap gives the required answer.

## Algorithm

**Step 1:** Create a min-heap using a priority queue.

**Step 2: **Traverse all elements of the array.

**Step 3:** Insert the current element into the min-heap.

**Step 4:** Check if the size of the heap becomes greater than k.

- If it becomes greater than k, remove the smallest element from the heap.

**Step 5:** Continue this process for all elements in the array.

**Step 6:** After processing all elements, the heap will contain exactly the k largest elements.

**Step 7:** Return the top element of the min-heap, because it represents the kth largest element.





### C++ Implementation

```cpp
class Solution {
public:

    int findKthLargest(vector<int>& nums, int k) {

        priority_queue<int, vector<int>, greater<int>> minHeap;

        for (int num : nums) {

            minHeap.push(num);

            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        return minHeap.top();
    }
};
```

### Java Implementation

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }

        return minHeap.peek();
    }
}
```

### Python Implementation

```python
class Solution:

    def findKthLargest(self, nums, k):

        min_heap = []

        for num in nums:

            heapq.heappush(min_heap, num)

            if len(min_heap) > k:
                heapq.heappop(min_heap)

        return min_heap[0]
```

## Time Complexity: O(n log k)

**Explanation: **For every element in the array, we perform heap insertion and possibly one heap removal operation. Each heap operation takes O(log k) time because the heap size never exceeds k.

Therefore, the total time complexity is O(n log k).

## Space Complexity: O(k)

**Explanation: **The min-heap stores at most k elements at any time. Therefore, the extra space required is proportional to k.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/kth-largest-element-in-an-array-article)*
