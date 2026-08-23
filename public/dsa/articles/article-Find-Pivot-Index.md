# Find Pivot Index

> **Slug:** `article-Find-Pivot-Index`  
> **Published:** 2026-04-07T10:09:58.435Z  
> **Updated:** 2026-04-07T10:09:58.436Z  
> **Keywords:** None  


**Description:** Find pivot index in array using prefix and suffix sums in DSA. Equal left and right sum with O(N) time complexity.

---

## Problem Statement

Given an integer array ***nums***, find the pivot index of this array. The pivot index is defined as the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the right of the index.

If no such index exists, return -1. If there are multiple pivot indices, you should return the left-most pivot index.

## Example 1

> [!NOTE]
> **INFO**
> Input: n=6 nums=[1,7,3,6,5,6]
> 
> Output: 3
> 
> Explanation: Left-sum (1 + 7 + 3) = 11 and right-sum (5 + 6) = 11 at index 3.

## Example 2

> [!NOTE]
> **INFO**
> Input: n=3 nums=[2,1,-1]
> 
> Output: 0
> 
> Explanation: Left-sum = 0 and right-sum (1 + –1) = 0, so index 0 is the pivot.

## Intuition

To determine whether an index is a pivot, we need to compare the sum of elements on its left with the sum of elements on its right. Recomputing these sums repeatedly for every index would be inefficient. Instead, we can precompute the cumulative sums from both directions. By building a prefix sum array that stores the sum of all elements before each index, and a suffix sum array that stores the sum of all elements after each index, we can check the pivot condition in constant time for every position. This approach allows us to efficiently identify the first index where both sums are equal.

## Algorithm

**Step 1:** Create two auxiliary arrays:
lsum to store the sum of elements to the left of each index, and
rsum to store the sum of elements to the right of each index.

**Step 2:** Populate the lsum array such that lsum contains the sum of all elements before index i.

**Step 3:** Populate the rsum array such that rsum contains the sum of all elements after index i.

**Step 4:** Traverse the array and compare lsum and rsum for each index. The first index where they are equal is the pivot index.

**Step 5:** If no such index is found, return -1.





## Time Complexity: O(n)

**Explanation: **Each array is traversed a constant number of times. Computing the prefix sums, suffix sums, and checking for the pivot index all take linear time.

## Space Complexity: O(n)

**Explanation: **Two additional arrays of size n are used to store prefix and suffix sums.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/article-Find-Pivot-Index)*
