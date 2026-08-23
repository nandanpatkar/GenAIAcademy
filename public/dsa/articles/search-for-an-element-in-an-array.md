# Search for an Element in an Array

> **Slug:** `search-for-an-element-in-an-array`  
> **Published:** 2026-04-06T13:02:57.398Z  
> **Updated:** 2026-04-06T13:02:57.399Z  
> **Keywords:** None  
> **Cover Image:** ![Search for an Element in an Array]({'id': '69d3ae6c9d1c5a8b85044167', 'url': 'https://cdn.codehelp.in/media/articles/1775480425256-c161353d-Search_for_an_.webp'})

**Description:** Search for a target element using linear search. Beginner-friendly DSA approach with step-by-step explanation.

---

## Problem Description

In this problem, you are given an array of integers called ***nums*** and an integer ***target***. Your task is to determine whether the ***target*** exists within the array. If the ***target*** is found, return the index of its first occurrence. If the ***target*** is not found, return ***-1***. Use a straightforward approach to access each element in the array to see if it matches the ***target***.

## Example

> [!NOTE]
> **INFO**
> ### Example 1
> 
> Input: Input: nums = [1, 2, 3, 4, 5], target = 3
> 
> Output: 2
> 
> Explanation: Element 3 is found at index 2.

> [!NOTE]
> **INFO**
> ### Example 2
> 
> Input: nums = [7, 8, 9, 10, 11], target = 5
> 
> Output: -1
> 
> Explanation: Element 5 is not present in the array.

## Intuition

The simplest way to find an element in an array is to check every element from the start to the end.

- If the current element matches the target, we have found the answer.
- If no element matches by the time we finish, then the target does not exist in the array.

This is called **linear search** because it scans the array linearly (from left to right).

## Approach

1. **Start from the beginning** of the array.
2. Compare each element with the target.
3. If an element matches the target, return its index immediately.
4. If the entire array is traversed and no match is found, return `-1`.

## Algorithm

1. Input: Array `nums` of size `n`, integer `target`.
2. For `i` from `0` to `n-1`:  1. If `nums[i] == target`, return `i`.
3. If the loop ends without finding the target, return `-1`.

## Understanding with Example

Input: `nums = [4, 2, 7, 1, 9]`

`target = 7`

Step-by-step:

- Compare `nums[0] = 4` with target `7` → not equal.
- Compare `nums[1] = 2` with target `7` → not equal.
- Compare `nums[2] = 7` with target `7` → match found.
- Output: 2

## Code

### C++ Code Implementation

```c++ code
int searchElementInArray(vector<int>& nums, int target) {
    for(int i = 0; i < nums.size(); i++) {
        if(nums[i] == target) {
            return i;
        }
    }
    return -1;
}
```

### Java Code Implementation

```java code
public int searchElementInArray(int[] nums, int target) {
    for(int i = 0; i < nums.length; i++) {
        if(nums[i] == target) {
            return i;
        }
    }
    return -1;
}
```

## Complexity Analysis

### **Time Complexity**

- In the worst case, we may need to check every element in the array.
- Therefore, time complexity is **O(N)**, where N is the number of elements.

### **Space Complexity**

- We only use a few extra variables (loop index, comparison variable).
- Therefore, space complexity is **O(1)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/search-for-an-element-in-an-array)*
