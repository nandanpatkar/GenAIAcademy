# Find First Repeating Element

> **Slug:** `Find-First-Repeating-Element-article`  
> **Published:** 2026-04-07T10:13:15.170Z  
> **Updated:** 2026-04-07T10:13:15.171Z  
> **Keywords:** None  


**Description:** Find first repeating element in array (DSA) using hashing. Efficient approach with step-by-step algorithm and complexity.

---

## Problem Statement

You are given an array of integers. Your task is to find the first repeating element in this array. A repeating element is one that appears at least twice in the array, and the first one is the one with the least index of its first occurrence.

## Example 1

> [!NOTE]
> **INFO**
> Input: n=7 arr=[1,2,3,4,2,5,6]
> 
> Output: 2
> 
> Explanation: Scanning left→right, 2 is first seen at index 1 and repeats at index 4, so it’s the first repeating element.

## Example 2

> [!NOTE]
> **INFO**
> Input: n=6 arr=[1,2,3,4,5,6]
> 
> Output: -1
> 
> Explanation: No value repeats, hence the function returns –1.

## Intuition

To identify the first repeating element, we need to know whether an element has appeared before while scanning the array. A naive approach would involve checking each element against all previous elements, but that would be inefficient. Instead, we can use a hash-based data structure to keep track of the elements we have already seen.

As we traverse the array from left to right, the first time we encounter an element that already exists in our tracking structure, we know that its first occurrence happened earlier than any other repeating element we might find later. Therefore, we can immediately return that element.

## Algorithm

**Step 1:** Create an empty hash map to store elements that have been seen.

**Step 2:** Traverse the array from left to right. For each element, check if it already exists in the map.

**Step 3:** If the element is already present, return it immediately since it is the first repeating element.

**Step 4:** If the element is not present, add it to the map.

**Step 5:** If the entire array is traversed without finding any repeating element, return -1.





## Time Complexity: O(n)

**Explanation: **The array is traversed once, and each lookup or insertion into the hash map takes constant time on average.

## Space Complexity: O(n)

**Explanation: **In the worst case, all elements are unique, and the hash map stores every element.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/Find-First-Repeating-Element-article)*
