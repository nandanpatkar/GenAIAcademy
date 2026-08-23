# Count the Number of Zeros and Ones in an Array

> **Slug:** `count-the-number-of-zeros-and-ones-in-an-array-article`  
> **Published:** 2026-04-07T10:09:30.413Z  
> **Updated:** 2026-04-07T10:09:30.415Z  
> **Keywords:** None  


**Description:** DSA solution to count zeros and ones in a binary array. Single pass approach with O(N) time and O(1) space.

---

## Problem Description

Given an array of integers ***nums*** where each element is either ***0*** or ***1***, your task is to determine how many zeros and how many ones exist in the array. Return the counts of zeros and ones in the specified format.

## Example

> [!NOTE]
> **INFO**
> ### Example 1
> 
> Input: nums = [0, 1, 0, 1, 1, 0]
> 
> Output: zeros: 3, ones: 3
> 
> Explanation: Equal number of zeros and ones, count of each is 3.

> [!NOTE]
> **INFO**
> ### Example 2
> 
> Input: nums = [0, 0, 0, 0, 0, 0]
> 
> Output: zeros: 6, ones: 0
> 
> Explanation: All elements are zeros, so zero count is 6 and one count is 0.

## Intuition

Since the array contains only 0s and 1s, we can solve this by simply traversing the array and counting how many times each value appears.

- Initialize two counters: one for zeros and one for ones.
- For each element:
- - If it’s 0 → increase the zero counter.
  - If it’s 1 → increase the one counter.
- After traversal, both counters will hold the final counts.

This is efficient since we only need a single pass over the array.

## Approach

1. Initialize two integer counters `countZero` and `countOne` to 0.
2. Traverse through the array:  1. If the element is 0, increment `countZero`.
  2. Otherwise (if 1), increment `countOne`.
3. Return both counters.

## Algorithm

1. Input: Array `nums` of size `n`.
2. Set `countZero = 0`, `countOne = 0`.
3. For each element `num` in `nums`:  1. If `num == 0` → `countZero++`.
  2. Else → `countOne++`.
4. Return `(countZero, countOne)`.

## Understanding with Example

Input: `nums = `

Step-by-step:

- Start with `countZero = 0`, `countOne = 0`.
- Read `0` → `countZero = 1`.
- Read `1` → `countOne = 1`.
- Read `1` → `countOne = 2`.
- Read `0` → `countZero = 2`.
- Read `1` → `countOne = 3`.
- Read `0` → `countZero = 3`.
- Read `0` → `countZero = 4`.
- Final Output: Zeros = 4, Ones = 3





## Code

### C++ Code Implementation

```c++ code
class Solution {
public:
    std::pair<int, int> countZerosAndOnes(const std::vector<int>& nums) {
        int countZero = 0;
        int countOne = 0;
        for (int num : nums) {
            if (num == 0) {
                countZero++;
            } else if (num == 1) {
                countOne++;
            }
        }
        return std::make_pair(countZero, countOne);
    }
};
```

### Java Code Implementation

```java code
class Solution {
    public int[] countZerosAndOnes(int[] nums) {
        int countZero = 0;
        int countOne = 0;
        for (int num : nums) {
            if (num == 0) {
                countZero++;
            } else if (num == 1) {
                countOne++;
            }
        }
        return new int[]{countZero, countOne};
    }
}
```

## Complexity Analysis

### **Time Complexity**

- We traverse the array once, making O(1) operations per element.
- Therefore, time complexity = **O(N)**.

### **Space Complexity**

- Only two counters (`countZero`, `countOne`) are used.
- Therefore, space complexity = **O(1)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/count-the-number-of-zeros-and-ones-in-an-array-article)*
