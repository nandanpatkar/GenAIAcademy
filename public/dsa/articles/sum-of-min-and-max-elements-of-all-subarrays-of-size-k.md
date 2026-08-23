# Sum of Min and Max Elements of All Subarrays of Size k

> **Slug:** `sum-of-min-and-max-elements-of-all-subarrays-of-size-k`  
> **Published:** 2026-08-09T12:08:08.534Z  
> **Updated:** 2026-08-09T12:08:08.539Z  
> **Keywords:** Sum of Min and Max Elements of All Subarray of Size K, Queues, Subarrays  
> **Cover Image:** ![Sum of Min and Max Elements of All Subarrays of Size k](https://cdn.codehelp.in/media/articles/1786276567777-5965b97a-7.png)

**Description:** Learn how to find the sum of the minimum and maximum elements of all subarrays of size k with examples and efficient approaches.


---

## Problem Statement

Given an array of integers arr, and an integer k, the task is to compute the sum of the minimum and maximum elements for every contiguous subarray of size k in the array. Your final goal is to return the total sum of these values.

### Problem Description

For a given arr and integer k, find all contiguous subarrays of size k, determine the minimum and maximum values for each subarray, add these values together, and accumulate the results.

> [!NOTE]
> **INFO**
> Example 1
> **Input:** arr = [2, 5, -1, 7, -3, -1, -2], k = 3
> 
> **Output:** 8
> 
> **Explanation:** Sum of min and max for each window: [2 + 5] + [-1 + 5] + [-1 + 7] + [-3 + 7] + [-3 + -1] = 18.

> [!NOTE]
> **INFO**
> Example 2
> **Input:**: arr = [1, 3, 1, 2, 0, 5], k = 2
> 
> **Output:**26
> 
> **Explanation:** Sum of min and max for each window: [1 + 3] + [1 + 3] + [1 + 2] + [0 + 2] + [0 + 5] = 16.

## Brute-Force Approach

### Intuition

A straightforward approach is to consider every subarray of size **k** and traverse the entire window to find its minimum and maximum elements. Since each window requires **O(k)** time and there are **O(n)** windows, the overall complexity becomes **O(n × k)**. To optimize this, we use two deques: one to maintain the minimum element and another to maintain the maximum element of the current window. By storing indices in a specific order (increasing for the minimum deque and decreasing for the maximum deque), we can efficiently discard elements that are no longer useful or fall outside the current window. As a result, the front of each deque always represents the minimum or maximum element of the current window, allowing us to process every window in **O(1)** time and achieve an overall complexity of **O(n)**.

### Algorithm

1. First, create two deques: one (**minDeque**) to maintain the indices of potential minimum elements and another (**maxDeque**) to maintain the indices of potential maximum elements for the current window. Also, initialize a variable **sum **to store the final answer.
2. Next, traverse the array from left to right. Before processing the current element, remove the indices from the front of both deques if they lie outside the current sliding window.
3. To maintain the minimum element, remove indices from the back of **minDeque**while their corresponding values are greater than or equal to the current element, then insert the current index at the back. Similarly, to maintain the maximum element, remove indices from the back of **maxDeque**while their corresponding values are less than or equal to the current element, and then insert the current index.
4. Once the first window of size **k** is formed, the front of **minDeque**represents the minimum element of the current window, while the front of **maxDeque**represents the maximum element. Add both of these values to **sum **.
5. Continue sliding the window by repeating the same process for the remaining elements until all windows have been processed. Finally, return the computed **sum **.

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int sumOfMinAndMax(vector<int>& arr, int k) {
        deque<int> minDeque, maxDeque;
        int sum = 0;

        for (int i = 0; i < arr.size(); ++i) {
            // Remove indices that are out of bound
            while (!minDeque.empty() && minDeque.front() <= i - k) minDeque.pop_front();
            while (!maxDeque.empty() && maxDeque.front() <= i - k) maxDeque.pop_front();

            // Maintain order in minDeque
            while (!minDeque.empty() && arr[minDeque.back()] >= arr[i]) minDeque.pop_back();
            // Maintain order in maxDeque
            while (!maxDeque.empty() && arr[maxDeque.back()] <= arr[i]) maxDeque.pop_back();

            minDeque.push_back(i);
            maxDeque.push_back(i);

            // Start to accumulate sum after the first 'k' elements
            if (i >= k - 1) {
                sum += arr[minDeque.front()] + arr[maxDeque.front()];
            }
        }

        return sum;
    }
};
```

### index.java Implementation

```index.java
import java.util.Deque;
import java.util.LinkedList;

class Solution {
    public int sumOfMinAndMax(int[] arr, int k) {
        Deque<Integer> minDeque = new LinkedList<>();
        Deque<Integer> maxDeque = new LinkedList<>();
        int sum = 0;

        for (int i = 0; i < arr.length; ++i) {
            // Remove indices that are out of the current window
            if (!minDeque.isEmpty() && minDeque.peekFirst() <= i - k) minDeque.pollFirst();
            if (!maxDeque.isEmpty() && maxDeque.peekFirst() <= i - k) maxDeque.pollFirst();

            // Maintain the order in the minDeque
            while (!minDeque.isEmpty() && arr[minDeque.peekLast()] >= arr[i]) minDeque.pollLast();
            // Maintain the order in the maxDeque
            while (!maxDeque.isEmpty() && arr[maxDeque.peekLast()] <= arr[i]) maxDeque.pollLast();

            minDeque.offerLast(i);
            maxDeque.offerLast(i);

            // Calculate the sum of minimum and maximum elements for full windows
            if (i >= k - 1) {
                sum += arr[minDeque.peekFirst()] + arr[maxDeque.peekFirst()];
            }
        }

        return sum;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def sumOfMinAndMax(self, arr: list[int], k: int) -> int:
        min_deque = deque()
        max_deque = deque()
        total_sum = 0

        for i in range(len(arr)):
            # Remove indices that are out of the current window
            if min_deque and min_deque[0] <= i - k:
                min_deque.popleft()

            if max_deque and max_deque[0] <= i - k:
                max_deque.popleft()

            # Maintain increasing order in min_deque
            while min_deque and arr[min_deque[-1]] >= arr[i]:
                min_deque.pop()

            # Maintain decreasing order in max_deque
            while max_deque and arr[max_deque[-1]] <= arr[i]:
                max_deque.pop()

            min_deque.append(i)
            max_deque.append(i)

            # Calculate sum for complete windows
            if i >= k - 1:
                total_sum += arr[min_deque[0]] + arr[max_deque[0]]

        return total_sum
```

### Complexity Analysis

#### Time Complexity: O(n)

- Each array index is inserted into both **minDeque**and **maxDeque**exactly once.
- An index is removed from the front or back of each deque at most once during the entire traversal.
- Since every insertion and removal operation is performed only once per index, the total number of deque operations is linear.
- The array is traversed only once while maintaining the sliding window.
- Therefore, the overall time complexity is **O(n)**.

#### Space Complexity: O(k)

- The **minDeque **stores indices of elements that are potential minimums for the current window.
- The **maxDeque **stores indices of elements that are potential maximums for the current window.
- At any point, both deques contain only the indices that belong to the current sliding window.
- Since the window size is **k**, each deque can hold at most **k** indices.
- Therefore, the overall auxiliary space complexity is **O(k)**.

## Optimal Approach (Monotonic Deque)

### Intuition

To optimize this, we use two deques, one to maintain the minimum element and another to maintain the maximum element of the current window. By storing indices in a specific order (increasing for the minimum deque and decreasing for the maximum deque), we can efficiently discard elements that are no longer useful or fall outside the current window. As a result, the front of each deque always represents the minimum or maximum element of the current window, allowing us to process every window in O(1) time and achieve an overall complexity of O(n).

### Algorithm

1. First, create two deques, one (minDeque) to maintain the indices of potential minimum elements and another (maxDeque) to maintain the indices of potential maximum elements for the current window. Also, initialise a variable sum to store the final answer.
2. Next, traverse the array from left to right. Before processing the current element, remove the indices from the front of both deques if they lie outside the current sliding window.
3. To maintain the minimum element, remove indices from the back of minDeque while their corresponding values are greater than or equal to the current element, then insert the current index at the back. Similarly, to maintain the maximum element, remove indices from the back of maxDeque while their corresponding values are less than or equal to the current element, and then insert the current index.
4. Once the first window of size k is formed, the front of minDeque represents the minimum element of the current window, while the front of maxDeque represents the maximum element. Add both of these values to sum.
5. Continue sliding the window by repeating the same process for the remaining elements until all windows have been processed. Finally, return the computed sum.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
#include <vector>
#include <deque>

using namespace std;

class Solution {
public:
    int sumOfMinAndMax(vector<int>& arr, int k) {
        deque<int> minDeque, maxDeque;
        int sum = 0;

        for (int i = 0; i < arr.size(); ++i) {

            // Remove indices that are out of bound
            while (!minDeque.empty() && minDeque.front() <= i - k) {
                minDeque.pop_front();
            }

            while (!maxDeque.empty() && maxDeque.front() <= i - k) {
                maxDeque.pop_front();
            }

            // Maintain increasing order in minDeque
            while (!minDeque.empty() && arr[minDeque.back()] >= arr[i]) {
                minDeque.pop_back();
            }

            // Maintain decreasing order in maxDeque
            while (!maxDeque.empty() && arr[maxDeque.back()] <= arr[i]) {
                maxDeque.pop_back();
            }

            minDeque.push_back(i);
            maxDeque.push_back(i);

            // Start to accumulate sum after the first 'k' elements
            if (i >= k - 1) {
                sum += arr[minDeque.front()] + arr[maxDeque.front()];
            }
        }

        return sum;
    }
};
```

### index.java Implementation

```index.java
import java.util.Deque;
import java.util.LinkedList;

class Solution {

    public int sumOfMinAndMax(int[] arr, int k) {
        Deque<Integer> minDeque = new LinkedList<>();
        Deque<Integer> maxDeque = new LinkedList<>();

        int sum = 0;

        for (int i = 0; i < arr.length; ++i) {

            // Remove indices that are out of the current window
            if (!minDeque.isEmpty() && minDeque.peekFirst() <= i - k) {
                minDeque.pollFirst();
            }

            if (!maxDeque.isEmpty() && maxDeque.peekFirst() <= i - k) {
                maxDeque.pollFirst();
            }

            // Maintain increasing order in minDeque
            while (!minDeque.isEmpty()
                    && arr[minDeque.peekLast()] >= arr[i]) {
                minDeque.pollLast();
            }

            // Maintain decreasing order in maxDeque
            while (!maxDeque.isEmpty()
                    && arr[maxDeque.peekLast()] <= arr[i]) {
                maxDeque.pollLast();
            }

            minDeque.offerLast(i);
            maxDeque.offerLast(i);

            // Calculate the sum of minimum and maximum elements
            // for complete windows
            if (i >= k - 1) {
                sum += arr[minDeque.peekFirst()]
                        + arr[maxDeque.peekFirst()];
            }
        }

        return sum;
    }
}
```

### index.python Implementation

```index.python
from collections import deque


class Solution:
    def sumOfMinAndMax(self, arr: list[int], k: int) -> int:
        min_deque = deque()
        max_deque = deque()
        total_sum = 0

        for i in range(len(arr)):

            # Remove indices that are out of the current window
            if min_deque and min_deque[0] <= i - k:
                min_deque.popleft()

            if max_deque and max_deque[0] <= i - k:
                max_deque.popleft()

            # Maintain increasing order in min_deque
            while min_deque and arr[min_deque[-1]] >= arr[i]:
                min_deque.pop()

            # Maintain decreasing order in max_deque
            while max_deque and arr[max_deque[-1]] <= arr[i]:
                max_deque.pop()

            min_deque.append(i)
            max_deque.append(i)

            # Calculate sum for complete windows
            if i >= k - 1:
                total_sum += arr[min_deque[0]] + arr[max_deque[0]]

        return total_sum
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Each array index is inserted into both minDeque and maxDeque exactly once.
- An index is removed from the front or back of each deque at most once during the entire traversal.
- Since every insertion and removal operation is performed only once per index, the total number of deque operations is linear.
- The array is traversed only once while maintaining the sliding window.
- Therefore, the overall time complexity is ***O(N).***

#### Space Complexity: O(K)

- The minDeque stores indices of elements that are potential minimums for the current window.
- The maxDeque stores indices of elements that are potential maximums for the current window.
- At any point, both deques contain only the indices that belong to the current sliding window.
- Since the window size is k, each deque can hold at most k indices.
Therefore, the overall auxiliary space complexity is ***O(k)***.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/sum-of-min-and-max-elements-of-all-subarrays-of-size-k)*
