# Find the Average of Array Elements

> **Slug:** `find-the-average-of-array-elements`  
> **Published:** 2026-06-18T12:25:54.449Z  
> **Updated:** 2026-06-18T12:25:54.454Z  
> **Keywords:** Array, Math  
> **Cover Image:** ![Find the Average of Array Elements](6a33e3ab5df01223634351d6)

**Description:** Find Average of an Array DSA solution using array traversal. Compute mean value with O(N) time complexity.

---

## Problem Description

You are given an array of integers. Your task is to compute the average value of the elements in the array. The average is defined as the sum of all the elements divided by the number of elements. You should consider all possible integer values that are within the provided constraints.

## Example

> [!NOTE]
> **INFO**: Example 1
Input: arr = [2, 4, 6, 8, 10]
Output: 6
Explanation: Average of [2, 4, 6, 8, 10] is 6.

> [!NOTE]
> **INFO**: Example 2
Input: arr = [1, -1, 1, -1]
Output: 0
Explanation: Average of [1, -1, 1, -1] is 0.

## Intuition

The problem is straightforward. To calculate the average:

1. Add all the elements in the array together.
2. Count the number of elements.
3. Divide the sum by the count.

## Approach

1. **Initialize Variables**
2. - Use a variable to store the running sum of the array elements.
  - Use another variable to store the count of elements.
3. **Traverse the Array**
4. - Go through each element in the array.
  - Add the element’s value to the sum.
5. **Calculate the Average**
6. - After traversal, divide the total sum by the count of elements.
  - Make sure to handle division properly (for integers vs floating-point results).
7. **Return or Print Result**
8. - Output the computed average.

## Algorithm

1. Start with `sum = 0`.
2. Let `n` be the size of the array.
3. For each element `x` in the array:
4. - Add `x` to `sum`.
5. After the loop ends:
6. - Compute `average = sum / n`.
7. Return `average`.





## Understanding with Example

**Input**: `arr = `

Step-by-step:

- **Sum **= 2 + 4 + 6 + 8 + 10 = 30
- **Number of elements** = 5
- **Average **= 30 / 5 = 6
- **Output**: 6

## Code

### C++ Code Implementation

```c++ code
class Solution {
public:
    double findAverage(const vector<int>& arr) {
        double sum = 0;
        for(int i = 0; i < arr.size(); i++) {
            sum += arr[i];
        }
        return sum / arr.size();
    }
};
```

### Java Code Implementation

```java code
class Solution {
    public double findAverage(int[] arr) {
        double sum = 0;
        for(int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum / arr.length;
    }
}
```

## Complexity Analysis

**Time Complexity**

- We traverse the array once, performing a constant-time addition for each element.
- Therefore, the time complexity is **O(N)**, where N is the number of elements.

**Space Complexity**

- We only use a few extra variables (`sum`, `n`, and `average`).
- Therefore, the space complexity is **O(1)**.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/find-the-average-of-array-elements)*
