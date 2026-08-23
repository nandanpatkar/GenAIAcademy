# Find the Maximum Element in an Array

> **Slug:** `find-the-maximum-element-in-an-array`  
> **Published:** 2026-06-18T12:31:47.203Z  
> **Updated:** 2026-06-18T12:31:47.208Z  
> **Keywords:** Math, Array  
> **Cover Image:** ![Find the Maximum Element in an Array](6a33e49c5df01223634351e7)

**Description:** Find the maximum element in an array using a single traversal. Step-by-step approach with complexity analysis.

---

## Problem Description

Your task is to find the maximum integer value in a given array. This basic problem tests your ability to work with array traversal and element comparison efficiently.

## Example

> [!NOTE]
> **INFO**
> ### Example 1
> 
> Input: Input: arr = [1, 2, 3, 4, 5]
> 
> Output: 5
> 
> Explanation: The maximum element in the array is 5.

> [!NOTE]
> **INFO**
> ### Example 2
> 
> Input: Input: arr = [10, 20, 5, 40, 30, 50]
> 
> Output: 50
> 
> Explanation: The maximum element is 50, appearing last.

## Intuition

To find the maximum value, we can:

- Start by assuming the first element of the array is the maximum.
- Traverse through the array, comparing each element with the current maximum.
- If we find an element larger than our current maximum, we update it.
- At the end, the variable will hold the largest value.

This approach ensures we only pass through the array once.

## Approach

1. Initialize a variable `max_element` with the first element of the array.
2. Traverse the array from the second element to the end.
3. For each element:
4. - If the element is greater than `max_element`, update `max_element`.
5. After traversal, `max_element` will store the largest number.

## Algorithm

1. Input: Array `arr` of size `n`.
2. Set `max_element = arr[0]`.
3. For `i = 1` to `n-1`:
4. - If `arr[i] > max_element`, then `max_element= arr[i]`.
5. Return `max_element`.

## Understanding with Example

Input: `arr = [3, 7, 1, 9, 5]`

Step-by-step:

- Initialize `max_element= 3`
- Compare with `7` → update `max_element = 7`
- Compare with `1` → no update
- Compare with `9` → update `max_element = 9`
- Compare with `5` → no update
- Output: 9

## Code

### C++ Code Implementation

```c++ code
class Solution {
public:
    int findMaximum(vector<int>& arr) {
        int max_element = arr[0];
        for (int i = 1; i < arr.size(); ++i) {
            if (arr[i] > max_element) {
                max_element = arr[i];
            }
        }
        return max_element;
    }
};
```

### Java Code Implementation

```java code
class Solution {
    public int findMaximum(int[] arr) {
        int max_element = arr[0];
        for (int i = 1; i < arr.length; ++i) {
            if (arr[i] > max_element) {
                max_element = arr[i];
            }
        }
        return max_element;
    }
}
```

## Complexity Analysis

### **Time Complexity**

- We traverse the array once and make constant-time comparisons.
- Therefore, time complexity is **O(N)**.

### **Space Complexity**

- We use only one variable (`max_element`) to keep track of the maximum.
- Therefore, space complexity is **O(1)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/find-the-maximum-element-in-an-array)*
