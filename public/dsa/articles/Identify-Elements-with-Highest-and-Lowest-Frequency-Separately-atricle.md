# Identify Elements with Highest and Lowest Frequency Separately

> **Slug:** `Identify-Elements-with-Highest-and-Lowest-Frequency-Separately-atricle`  
> **Published:** 2026-04-07T10:11:17.608Z  
> **Updated:** 2026-04-07T10:11:17.609Z  
> **Keywords:** None  


**Description:** Find mode of array in DSA using hash map. Return most frequent element with tie-breaking by smallest value, O(N).

---

## Problem Statement

Given an array of integers, determine the mode of the array. The mode is the element that appears most frequently in the array. If there is more than one element with the highest frequency of appearances, return the smallest of these elements.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: arr = [1, 2, 2, 3, 3, 3]
> 
> Output: {3,1}
> 
> Explanation: 3 is the mode with the highest frequency.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: arr = [4, 5, 5,5, 6, 6]
> 
> Output: {5,4}
> 
> Explanation: 5 and 6 have the same frequency, but 5 is smaller.

## Intuition

To determine how frequently each element appears, we must count the occurrences of every value in the array. Once we have this information, identifying the elements with the highest and lowest frequencies becomes straightforward. The challenge lies in handling ties correctly when multiple elements have the same frequency, we must select the smallest element among them. A hash map is ideal for storing frequency counts efficiently. After building the frequency map, we can iterate through it once, simultaneously tracking both the maximum and minimum frequencies and updating the corresponding elements while respecting the tie-breaking rule.

## Algorithm

**Step 1:** Create a hash map to store the frequency of each element in the array.

**Step 2:** Traverse the input list and update the frequency count for every element.

**Step 3:** Initialize variables to track the maximum frequency and minimum frequency, along with their corresponding elements.

**Step 4:** Iterate through the entries of the frequency map.
Update the element with the highest frequency if a larger frequency is found, or if the frequency is the same and the current element is smaller. Similarly, update the element with the lowest frequency using the same tie-breaking logic.

**Step 5:** Return both elements as an array, with the highest-frequency element first and the lowest-frequency element second.





## Time Complexity: O(n)

**Explanation: **The array is traversed once to build the frequency map and once more to evaluate the highest and lowest frequencies. Since both traversals are linear, the overall time complexity is O(n).

## Space Complexity: O(n)

**Explanation: **The hash map stores frequency counts for each distinct element. In the worst case, all elements are unique, requiring linear extra space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/Identify-Elements-with-Highest-and-Lowest-Frequency-Separately-atricle)*
