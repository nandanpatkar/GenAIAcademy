# Daily Temperatures

> **Slug:** `daily-temperatures`  
> **Published:** 2026-08-22T17:17:03.748Z  
> **Updated:** 2026-08-22T17:17:03.751Z  
> **Keywords:** Daily Temperatures, Stacks  
> **Cover Image:** ![Daily Temperatures](6a89d952f695d4d77644fce0)

**Description:** Learn how to solve the Daily Temperatures problem using stacks, with clear examples, step-by-step logic, and time and space complexity analysis.

---

## Problem Statement

Given an array of integers representing the daily temperatures, develop an algorithm to determine how many days you must wait until a warmer temperature arrives for each day. If no future day has a higher temperature, the waiting period for that day should be zero.

> [!NOTE]
> **INFO**
> Example 1
> Input:  temperatures = [90, 80, 70, 60]
> 
> Output: [0, 0, 0, 0]
> 
> **Explanation:** No future day has a warmer temperature.

> [!NOTE]
> **INFO**
> Example 2
> Input: temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
> 
> Output: [1, 1, 4, 2, 1, 1, 0, 0]
> 
> **Explanation:** Each index indicates days needed to wait until a warmer temperature.

## Optimal Approach

### Intuition

For each day, we need to find the next day that has a higher temperature.

A brute-force approach would be to check all future days for every index until a warmer temperature is found. However, this would result in O(n²) time complexity.

A more efficient approach is to use a monotonic stack.

We process the temperatures array from right to left. The stack stores indices of days whose temperatures are strictly greater than the current day's temperature.

For each day:

- We remove all indices from the stack whose temperatures are less than or equal to the current temperature because they can never be the next warmer day for the current day.
- After removing them, the top of the stack (if it exists) represents the nearest future day with a warmer temperature.
- The difference between the indices gives the number of days we need to wait.

This allows us to efficiently find the next warmer day for every position.

### Algorithm

**Step 1:** Create an answer array of size n and an empty stack to store indices.

**Step 2: **Traverse the temperatures array from right to left.

**Step 3:** While the stack is not empty and the current temperature is greater than or equal to the temperature at the index on the top of the stack, remove the top index from the stack.

**Step 4: **After removing all smaller or equal temperatures:

- If the stack is not empty, the top index represents the next warmer day.
- Store the difference between the top index and the current index in the answer array.

**Step 5: **Push the current index onto the stack.

**Step 6: **Repeat the process for all days.

**Step 7: **Return the answer array.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> answer(n, 0);
        stack<int> stk;

        for (int i = n - 1; i >= 0; --i) {
            while (!stk.empty() && temperatures[i] >= temperatures[stk.top()]) {
                stk.pop();
            }

            if (!stk.empty()) {
                answer[i] = stk.top() - i;
            }

            stk.push(i);
        }

        return answer;
    }
};
```

### Java Implementation

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Stack<Integer> stk = new Stack<>();

        for (int i = n - 1; i >= 0; --i) {
            while (!stk.isEmpty() && temperatures[i] >= temperatures[stk.peek()]) {
                stk.pop();
            }

            if (!stk.isEmpty()) {
                answer[i] = stk.peek() - i;
            }

            stk.push(i);
        }

        return answer;
    }
}
```

### Python Implementation

```python
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        n = len(temperatures)
        answer = [0] * n
        stack = []

        for i in range(n - 1, -1, -1):
            while stack and temperatures[i] >= temperatures[stack[-1]]:
                stack.pop()

            if stack:
                answer[i] = stack[-1] - i

            stack.append(i)

        return answer
```

### Complexity Analysis

#### Time Complexity: O(n)

- Each index is pushed onto the stack once and popped from the stack at most once.
- Therefore, the total number of stack operations is linear.

#### Space Complexity: O(n)

- In the worst case, all indices may be stored in the stack, requiring O(n) extra space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/daily-temperatures)*
