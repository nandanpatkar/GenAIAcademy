# Find First Unsorted Element in Array

> **Slug:** `Find-First-Unsorted-Element-in-Array-article`  
> **Published:** 2026-04-07T10:11:53.514Z  
> **Updated:** 2026-04-07T10:11:53.516Z  
> **Keywords:** None  


**Description:** Find the first element that breaks sorted order in an array. Simple linear scan approach with O(n) time and O(1) space.

---

## Problem Statement

Given an array of integers, your task is to find the index of the first element that disrupts the sorted order of the array. In a non-decreasing order sequence, each element should be less than or equal to the next element. If the array is already sorted or maintains the non-decreasing order criterion throughout, return -1.

## Example

- **Input**:
- **Output**: ***4***

In the given input, elements from index 0 to 3 (***1***, ***2***, ***3***, ***4***) are in non-decreasing order. The element at index 4 is ***6***, which is followed by ***5*** at index 5, violating the non-decreasing order since ***6*** is greater than ***5***. Hence, index 4 is the first unsorted element.

Try to identify this pattern and apply the logic to solve the problem for any given input array.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: Input: arr = [1, 2, 3, 4, 5]
> 
> Output: -1
> 
> Explanation: The array is already sorted.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: Input: arr = [10, 20, 30, 25, 40]
> 
> Output: 2
> 
> Explanation: First unsorted element is at index 2 (30 > 25).

## Example 3

> [!NOTE]
> **INFO**
> Example 3:
> 
> Input: Input: arr = [5, 4, 3, 2, 1]
> 
> Output: 0
> 
> Explanation: First unsorted element is at index 0 (5 > 4).

## Intuition

A sorted (increasing order) array has a simple and reliable property: every element is less than or equal to the next one. The moment this property fails, we have found the point where the array stops being sorted. Instead of sorting or comparing multiple elements at once, we only need to check **adjacent elements**. By scanning the array from left to right and comparing each element with the one that follows it, we can immediately detect the first violation of the sorted order. As soon as such a violation is found, the current index is the answer. If no violation is found after scanning the entire array, the array is already sorted.

## Algorithm

**Step 1:** Traverse the array from index 0 to n - 2.

**Step 2:** For each index i, compare arr with arr.

**Step 3:** If arr is greater than arr, return i because this index breaks the non-decreasing order.

**Step 4:** If the loop completes without finding any violation, return -1 to indicate that the array is sorted.





## Time Complexity: O(n)

**Explanation: **The array is traversed once, and each comparison takes constant time. Therefore, the overall time complexity is linear.

## Space Complexity: O(1)

**Explanation: **No additional data structures are used. Only a loop variable is required, resulting in constant extra space usage.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/Find-First-Unsorted-Element-in-Array-article)*
