# Rotate an Array

> **Slug:** `Rotate-an-Array-article`  
> **Published:** 2026-06-26T19:12:23.535Z  
> **Updated:** 2026-06-26T19:12:23.538Z  
> **Keywords:** None  


**Description:** Rotate an array to the right by k positions using reversal algorithm. Efficient in-place DSA solution with O(n) time.

---

## Problem Statement

You are given an array of integers ***nums*** and a non-negative integer ***k***. Your task is to rotate the array to the right by ***k*** steps, and you must do this in-place with a space complexity of ***O(1)***, meaning that the operation should use minimal extra space. This problem challenges your understanding of array manipulation and in-place algorithms. In an array rotation, each element is shifted to the right. The last element moves to the first position, and all other elements are also shifted. When the array is rotated by ***k*** steps, an element that was at index ***i*** will move to index ***(i + k) % length of array***.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3
> 
> Output: [5, 6, 7, 1, 2, 3, 4]

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: Input: nums = [-1, -100, 3, 99], k = 2
> 
> Output:[3, 99, -1, -100]

## Intuition

Rotating an array by shifting elements one position at a time would be inefficient, especially when k is large. Instead, we can take advantage of a simple but powerful idea: **array reversal**. By reversing certain parts of the array in a specific order, we can rearrange the elements to match the desired rotated positions without using extra space. If we first reverse the entire array, the elements that need to move to the front are brought closer to their target positions. Then, by reversing the first k elements and finally reversing the remaining elements, the array naturally forms the correct right-rotated order. This approach allows us to perform the rotation efficiently while modifying the array in place.

## Algorithm

**Step 1:** Compute k = k % n to handle cases where k is greater than the array length.

**Step 2:** Reverse the entire array.

**Step 3:** Reverse the first k elements.

**Step 4:** Reverse the remaining elements from index k to n - 1.





## Time Complexity: O(n)

**Explanation: **Each reversal processes a portion of the array, and together all elements are visited a constant number of times. Therefore, the overall time complexity is linear.

## Space Complexity: O(1)

**Explanation: **The rotation is done entirely in place, using only a few temporary variables for swapping elements. No additional data structures are used.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/Rotate-an-Array-article)*
