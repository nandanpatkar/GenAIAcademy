# Find Duplicate Number

> **Slug:** `Find-Duplicate-Number-article`  
> **Published:** 2026-04-07T10:13:46.935Z  
> **Updated:** 2026-04-07T10:13:46.937Z  
> **Keywords:** None  


**Description:** Find duplicate number in array using Floyd’s Cycle Detection (tortoise and hare) in DSA with O(N) time and O(1) space.

---

## Problem Statement

You are given an array of integers ***nums*** containing ***n + 1*** integers where each integer is in the range  inclusive. There is only one duplicate number in ***nums***, return this duplicate number.

## Example 1

> [!NOTE]
> **INFO**
> Input: n=5 nums=[1,3,4,2,2]
> 
> Output: 2
> 
> Explanation: Among numbers 1‒4, the value 2 is repeated.

## Example 2

> [!NOTE]
> **INFO**
> Input: n=5 nums=[3,1,3,4,2]
> 
> Output: 3
> 
> Explanation: 3 occurs at indices 0 and 2 → duplicate = 3.

## Intuition

This problem can be solved by observing that the array values can be interpreted as pointers. Each element points to the index represented by its value. Because the array contains n + 1 numbers but only n possible values, at least one value must repeat. This repetition creates a **cycle** when the array is viewed as a linked structure.

To detect this cycle efficiently, we can use **Floyd’s Cycle Detection Algorithm**, commonly known as the **tortoise and hare approach**. The idea is to move two pointers at different speeds through the array. If a cycle exists, the two pointers will eventually meet. Once they meet, resetting one pointer to the start and moving both pointers at the same speed will lead them to the entrance of the cycle, which corresponds to the duplicate number.

## Algorithm

**Step 1:** Initialize two pointers, tortoise and hare, both starting at the first element of the array.

**Step 2:** Move tortoise one step at a time and hare two steps at a time until they meet. This step confirms the presence of a cycle.

**Step 3:** Reset the tortoise pointer to the beginning of the array.

**Step 4:** Move both pointers one step at a time. The point where they meet again is the entrance of the cycle.

**Step 5:** Return the value at the meeting point, which is the duplicate number.





## Time Complexity: O(n)

**Explanation: **The pointers traverse the array a limited number of times. Both phases of the algorithm run in linear time.

## Space Complexity: O(1)

**Explanation: **Only a constant number of variables are used. No extra data structures are required.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/Find-Duplicate-Number-article)*
