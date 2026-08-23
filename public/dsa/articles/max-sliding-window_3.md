# Max Sliding Window

> **Slug:** `max-sliding-window_3`  
> **Published:** 2026-07-10T17:22:38.137Z  
> **Updated:** 2026-07-10T17:22:38.241Z  
> **Keywords:** Max Sliding Window, Heap, Sliding Window  
> **Cover Image:** ![Max Sliding Window](6a5129cef5904fb07752e9a4)

**Description:** Learn how to solve the Max Sliding Window problem using brute and optimal, with explanations, examples, complexity analysis.

---

## Problem Description

You are tasked with finding the maximum number for each sliding window of size ***k*** as it moves from the leftmost side to the rightmost side of an array of integers ***nums***. At each step, only the ***k*** numbers within the current window are visible, and you need to identify and return an array of these maximum numbers for each window position.

For clarity, here is how the sliding window works with an example:

## Example

> [!NOTE]
> **INFO**
> Input: nums = [1,3,-1,-3,5,3,6,7],   k = 3
> 
> Output:  [3,3,5,5,6,7]
> 
> Explanation:

Your goal is to develop an efficient solution that works well even for large arrays. Use of appropriate data structures is crucial to optimize performance.

## Example 1:

> [!NOTE]
> **INFO**
> Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
> 
> Output:  [3, 3, 5, 5, 6, 7]
> 
> Explanation: The maximum for each sliding window of size 3 is computed as [3,3,5,5,6,7].

### Example 2:

> [!NOTE]
> **INFO**
> Input: nums = [9, 11, -3, 4, 5, 2, 8], k = 2
> 
> Output: [11, 11, 4, 5, 5, 8]
> 
> Explanation: For each window of size 2, the maximum is recorded as [11,11,4,5,5,8].

### Example 3:

> [!NOTE]
> **INFO**
> Input: nums = [4, 3, 2, 1], k = 1
> 
> Output: [4, 3, 2, 1]
> 
> Explanation:  Each window contains a single element, so the output is the array itself.

### Constraints

- 1 <= nums.length <= 105
- -104 <= nums[i] <= 104
- 1 <= k <= nums.length

### Real-Life Analogy

Imagine you are a **stock market analyst** watching a giant digital display board streaming **live stock prices** every second. The numbers keep changing rapidly and thousands of prices flashing by and it is impossible to focus on every single one.

So, instead of tracking every tick, you decide to monitor the highest price within the last k seconds. This gives you a clearer, rolling snapshot of recent performance, like a sliding window of maximum values.

For example, if **k = 5 minutes**:

- At **10:05 AM**, you look at prices from **10:00 to 10:05** and note the highest.
- At **10:06 AM**, the window slides forward now you track prices from **10:01 to 10:06**.
- At **10:07 AM**, it slides again — now from **10:02 to 10:07**.

Each time the window moves forward by one step, a **new price enters** and the **oldest price exits**, and you must instantly know:
“What’s the highest price in my current window?”

But rescanning all k prices every second would be far too slow, especially with millions of live updates.

That’s why you need a **smart data structure** that can:

- **Quickly add** the latest price as it arrives,
- **Efficiently remove** prices that slide out of view, and
- **Instantly return** the current maximum.

This is exactly what the **Sliding Window Maximum** problem solves!
It teaches how to efficiently maintain the maximum value as a window moves through data  a concept that’s critical in **real-time analytics**, **time-series monitoring**, and **algorithmic trading** systems.

### Brute-Force Approach
Intuition

The most straightforward approach is to simulate exactly what the problem asks. for each window position, scan all k elements in that window and find the maximum.

This is like manually checking every stone in a pile each time the pile shifts by one position. We look at all k numbers, compare them, and pick the largest.

While this approach is inefficient for large inputs, it's simple to understand and implement. For small arrays or small window sizes, this works perfectly fine and may even be preferable due to its simplicity.

### Algorithm

1. Firstly, we calculate result array size as the number of windows is `nums.length - k + 1. `If we found that array has 8 elements and k=3, we implement 8-3+1 = 6 windows.
2. Then, we iterate through each window position, As from the start of the index which is 0 and this go up to nums.length - k. This will ensures that we don't need to go out of bounds.
3. Now, for each window starting at position 'i' ,The steps we follow:
4. - Firstly, we initialize `max` variable (start with smallest possible value)
  - Then, we scan all k elements in the current window because we check from index i to i+k-1.
  - After this we track the maximum value found during the scan.
  - At last, we store this maximum in the result array at position 'i'.
5. At last, we return the result array containing all window maximums.

### Code

### C++ Implementation

```cpp
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> result(n - k + 1);

        // Process each window
        for (int i = 0; i <= n - k; i++) {
            int maximum = INT_MIN;

            // Find maximum in the current window [i, i + k - 1]
            for (int j = i; j < i + k; j++) {
                maximum = max(maximum, nums[j]);
            }

            result[i] = maximum;
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        
        // Process each window
        for (int i = 0; i <= n - k; i++) {
            int max = Integer.MIN_VALUE;
            
            // Find max in current window [i, i+k-1]
            for (int j = i; j < i + k; j++) {
                max = Math.max(max, nums[j]);
            }
            
            result[i] = max;
        }
        
        return result;
    }
}
```

### Python Implementation

```python
class Solution:
    def maxSlidingWindow(self, nums, k):
        n = len(nums)
        result = [0] * (n - k + 1)

        # Process each window
        for i in range(n - k + 1):
            maximum = float('-inf')

            # Find max in current window [i, i + k - 1]
            for j in range(i, i + k):
                maximum = max(maximum, nums[j])

            result[i] = maximum

        return result
```

### Complexity Analysis

#### Time Complexity: **O(n × k)**

- There are **n - k + 1** sliding windows, which is approximately **O(n)**.
- For each window, we scan all **k** elements to find the maximum.
- Each window takes **O(k)** time.
- **Overall Time Complexity:** **O(n × k)**.

#### Space Complexity: **O(1)**

- Only a few extra variables (**max**, loop indices) are used.
- No additional data structures are required.
- The result array is the required output and is **not** counted as auxiliary space.
- **Overall Auxiliary Space Complexity:** **O(1)**.

## Optimal Approach (Monotonic Deque)

### Intuition

The optimal solution uses a **Monotonic Decreasing Deque** (double-ended queue). This is a great data structure that maintains potential maximum candidates in strictly **decreasing order** from front to back.

**Core Insight:** When a new element enters the window, if it is **larger** than elements at the back of the deque, those smaller elements can **never** be the maximum in any future window because the new element is both larger and will stay in the window longer. So we immediately remove them.

### Algorithm

1. Firstly, we create a deque and it will store indices not the values of array elements. As we it use the indices to check if elements are still within the window. It access values using nums[index].
2. Process each element from left to right.
3. For each index i: ** **
4. 1. **Step A: Remove front if out of window**
  2. 1. If **deque.front() <= i - k**, then we need to remove from the front.
    2. For the window position i contains indices **[i-k+1, i]**
    3. Elements at index ≤ i-k are outside.
  3. **Step B: Maintain monotonic decreasing property**
  4. 1. While deque is not empty AND **nums[deque.back()] < nums[I]**:
    2. So, we remove from back as these elements are now useless. Because, new element is larger and will outlast them.
  5. **Step C: Add current index**
  6. 1. Add index i to the back of deque.
  7. **Step D: Store result (after first window is complete)**
  8. 1. IIf **i >= k-1**, the front of deque has the window's maximum.
    2. Then we store **nums[deque.front()]** in result.
5. **At last, we return the result in the form of array.**

### Code

### C++ Implementation

```cpp
#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> result(n - k + 1);
        deque<int> dq;

        for (int i = 0; i < n; i++) {
            // Step 1: Remove elements outside the current window
            if (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }

            // Step 2: Remove elements smaller than the current element
            // (they're useless because the current element is larger)
            while (!dq.empty() && nums[dq.back()] < nums[i]) {
                dq.pop_back();
            }

            // Step 3: Add the current index
            dq.push_back(i);

            // Step 4: Store the maximum once the window is complete
            if (i >= k - 1) {
                result[i - k + 1] = nums[dq.front()];
            }
        }

        return result;
    }
};
```

### Java Implementation

```java
import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>();
        
        for (int i = 0; i < n; i++) {
            // Step 1: Remove elements outside current window
            if (!deque.isEmpty() && deque.peekFirst() <= i - k) {
                deque.pollFirst();
            }
            
            // Step 2: Remove elements smaller than current
            // (they're useless - current element is larger and will last longer)
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            
            // Step 3: Add current element's index
            deque.offerLast(i);
            
            // Step 4: Store result once window is complete
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        
        return result;
    }
}
```

### Python Implementation

```python
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums, k):
        n = len(nums)
        result = [0] * (n - k + 1)
        dq = deque()

        for i in range(n):
            # Step 1: Remove elements outside the current window
            if dq and dq[0] <= i - k:
                dq.popleft()

            # Step 2: Remove elements smaller than the current element
            # (they're useless because the current element is larger)
            while dq and nums[dq[-1]] < nums[i]:
                dq.pop()

            # Step 3: Add the current index
            dq.append(i)

            # Step 4: Store the maximum once the window is complete
            if i >= k - 1:
                result[i - k + 1] = nums[dq[0]]

        return result
```

### Complexity Analysis

#### Time Complexity: O(n)

- We iterate through the array only once.
- Each element is **inserted into the deque exactly once**.
- Each element is **removed from the deque at most once**.
- Since every element is processed a constant number of times, the total operations are proportional to **n**.
- **Overall Time Complexity:** ***O(n)****.*

#### Space Complexity:  O(k)

- The deque stores at most **k** indices at any time (the current window size).
- Elements that move out of the sliding window are removed immediately.
- The result array is the required output and is **not** counted as auxiliary space.
- **Overall Auxiliary Space Complexity:** ***O(k)****.*



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/max-sliding-window_3)*
