# Missing Number

> **Slug:** `article-missing-number`  
> **Published:** 2026-04-07T10:10:17.650Z  
> **Updated:** 2026-04-07T10:10:17.652Z  
> **Keywords:** None  


**Description:** Find the missing number in an array using XOR. Learn an efficient O(n) DSA approach with step-by-step explanation and examples.

---

## Problem Statement

Given an array ***nums*** containing ***n*** distinct numbers taken from ***0, 1, 2, ..., n***, find the one that is missing from the array.

## Example 1

> [!NOTE]
> **INFO**
> Input: n=3 nums=[3,0,1]
> 
> Output: 2
> 
> Explanation: The range should contain {0,1,2,3}. Only 2 is absent.

## Example 2

> [!NOTE]
> **INFO**
> Input: n=4 nums=[1,2,3,4]
> 
> Output: 0
> 
> Explanation: Numbers present are {1,2,3,4}; 0 is missing.

## Intuition

A straightforward approach would be to compute the sum of numbers from 0 to n and subtract the sum of the array elements, but this can risk integer overflow for large values of n. Instead, we can use the **bitwise XOR operation**, which provides a safe and efficient alternative. The XOR operation has useful properties: a number XORed with itself becomes 0, a number XORed with 0 remains unchanged, and the operation is both associative and commutative. If we XOR all numbers from 0 to n and also XOR all the elements present in the array, every number that appears in both sets cancels out. The only value that remains is the missing number.

## Algorithm

**Step 1:** Initialize a variable xorSum with the value n.

**Step 2:** Iterate through the array. For each index i, XOR xorSum with both i and nums.

**Step 3:** After the loop completes, xorSum will contain the missing number.

**Step 4:** Return xorSum.





## Time Complexity: O(n)

**Explanation: **The array is traversed exactly once, and each XOR operation runs in constant time, resulting in linear time complexity.

## Space Complexity: O(1)

**Explanation: **Only a single integer variable is used to store the XOR result. No additional data structures are required.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/article-missing-number)*
