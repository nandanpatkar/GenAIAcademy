# Find the Unique Element in an Array

> **Slug:** `Find -the-Unique-Element-in-an-Array-article`  
> **Published:** 2026-04-07T10:15:51.568Z  
> **Updated:** 2026-04-07T10:15:51.570Z  
> **Keywords:** None  


**Description:** Find single element in array where others appear twice. Efficient XOR based DSA approach with linear time and constant space.

---

## Problem Statement

You are given an array of integers where each element appears twice, except for one distinct element that appears only once. Your task is to identify and return this unique element. Implement an efficient solution that operates in linear time complexity with constant additional space.

## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: Input: nums = [2, 3, 5, 3, 2]
> 
> Output: 5

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: Input: nums = [1, 1, 2, 2, 3]
> 
> Output: 3

## Intuition

A direct approach such as counting the frequency of each element would require additional memory, which violates the constant space requirement. Instead, we can take advantage of a special property of the **bitwise XOR  operator**. The XOR operation has three important characteristics: a number XORed with itself results in zero, a number XORed with zero remains unchanged, and the operation is commutative and associative. Because all elements except one appear exactly twice, each duplicate pair cancels itself out when XORed together. The only value that remains after XORing all elements is the one that appears only once.

## Algorithm

**Step 1:** Initialize a variable unique with the value 0.

**Step 2:** Traverse through each element in the array and apply the XOR operation between the current element and unique.

**Step 3:** After processing all elements, the variable unique will hold the value of the element that appears only once.

**Step 4:** Return unique as the final answer.





## Time Complexity: O(n)

**Explanation: **The array is traversed exactly once, and each XOR operation takes constant time. Therefore, the overall time complexity is linear.

## Space Complexity: O(1)

**Explanation: **Only a single integer variable is used to store the intermediate result. No additional data structures are required, ensuring constant extra space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/Find%20-the-Unique-Element-in-an-Array-article)*
