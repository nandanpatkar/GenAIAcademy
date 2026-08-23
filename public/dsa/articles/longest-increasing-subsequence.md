# Longest Increasing Subsequence

> **Slug:** `longest-increasing-subsequence`  
> **Published:** 2026-01-09T19:35:41.709Z  
> **Updated:** 2026-03-27T21:46:11.978Z  
> **Keywords:** None  
> **Cover Image:** ![Longest Increasing Subsequence]({'$oid': '694150a5a01ff48c7adbb9d8'})

**Description:** Longest Increasing Subsequence | CodehelpLongest Increasing Subsequence | CodehelpLongest Increasing Subsequence | CodehelpLongest Increasing Subsequence | CodehelpLongest Increasing Subsequence | Codehelp

---

## Problem Statement

Given an integer array ***nums***, return the length of the longest strictly increasing subsequence.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, ***[3, 6, 2, 7]*** is a subsequence of ***[0, 3, 1, 6, 2, 2, 7]***. Your task is to find the maximum possible length of a subsequence where each element is strictly greater than the one before it.



## Example 1

> [!NOTE]
> **INFO**
> Example 1:
> 
> Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]
> 
> Output: 4
> 
> Explanation: The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4. Note: There can be multiple LIS combinations, for instance, [2, 5, 7, 101] or [2, 5, 7, 18] are also valid.

## Example 2

> [!NOTE]
> **INFO**
> Example 2:
> 
> Input: nums = [31, 4, 44, -20, 22, 41, 16, 48, 49, -8, 26, 2, 17]
> 
> Output: 5
> 
> Explanation: The LIS length is computed using the patience sorting / tails array technique.

## Example 3

> [!NOTE]
> **INFO**
> Example 3:
> 
> Input: nums = [35, -2, -15, 20, 3, 4, 21, -4, -18, -8, 45, 48, -19, 26, 35, 13]
> 
> Output: 6
> 
> Explanation: The LIS length is computed using the patience sorting / tails array technique.

# Recursive Approach

## Intuition

To build a strictly increasing subsequence, at every index in the array we have **two choices**:

- **Include** the current element in the subsequence (only if it is greater than the previously chosen element).
- **Exclude** the current element and move to the next index.

The challenge is that the validity of including an element depends on the **last element we included**. Therefore, while making recursive decisions, we must keep track of the index of the previously chosen element. By recursively exploring all possible include/exclude combinations and keeping track of the longest valid subsequence, we can find the length of the LIS. Although this approach is conceptually simple, it is computationally expensive due to repeated calculations.

## Algorithm

**Step 1:** Define a recursive function solve(index, prevIndex):

- index → current position in the array.
- prevIndex → index of the previously chosen element (-1 if none chosen yet).

**Step 2:** If index == nums.length, return 0.

**Step 3:** Option 1 —> Exclude the current element, Compute LIS length by moving to the next index without changing prevIndex.

**Step 4:** Option 2 —> Include the current element:

- Allowed only if prevIndex == -1 or nums[index] > nums[prevIndex].
- If included, add 1 and move to the next index with prevIndex = index.

**Step 5:** Return the maximum of the two choices.

## Time Complexity: O(2ⁿ)

**Explanation: **

- For each element, we explore two possibilities: include or exclude.
- This creates a binary recursion tree.
- In the worst case, all possible subsequences are explored.
- Hence, the time complexity is exponential.

## Space Complexity: O(n)

**Explanation: **

- The recursion depth can go up to n (length of the array).
- No additional data structures are used.
- Space usage is due to the recursion stack only.





# Memorization Approach

## Intuition

In the recursive solution, we decide for every index whether to include the current element in the increasing subsequence or skip it. While this approach is correct, it repeatedly solves the same subproblems. A subproblem here is defined by two things: the current index and the index of the previously chosen element. No matter how we reach that state, the answer for it will always be the same. To avoid this repetition, we use memorization. We store the result for each (index, prevIndex) pair the first time it is computed. Whenever the same state appears again, we directly return the stored value instead of recalculating it. This optimization keeps the recursive logic intact while making the solution efficient.

## Algorithm

**Step 1:** Let n be the length of the array nums. Create a 2D DP array dp of size n × (n + 1) and initialize all values to -1. We use prevIndex + 1 as the second dimension to safely handle the case when prevIndex = -1.

**Step 2:** Define a recursive function solve(index, prevIndex) that returns the length of the longest increasing subsequence starting from index, given that the previous chosen element is at prevIndex.

**Step 3:** If index reaches n, return 0 because no elements are left to process.

**Step 4:** If dp[index][prevIndex + 1] is already computed, return the stored value directly.

**Step 5:** Recursively compute the result by considering two possibilities:

- Skip the current element and move to the next index.
- Include the current element if it forms a strictly increasing sequence with the previously chosen element.

**Step 6:** Store the maximum result of these two choices in dp[index][prevIndex + 1] and return it.

**Step 7:** Call solve(0, -1) to obtain the length of the longest increasing subsequence for the entire array.

## Time Complexity: O(n²)

**Explanation: **There are n possible indices and n + 1 possible values for the previous index. Each state is computed only once because of memorization. Therefore, the total number of operations is proportional to n².

## Space Complexity: O(n²) + O(n)

**Explanation: **The DP table requires O(n²) space to store results for all states. The recursion stack can go as deep as n in the worst case. Together, this gives the total space complexity.





# Tabulation Approach

## Intuition

In the memorization approach, we solved the LIS problem using recursion and stored results to avoid repeated calculations. The **tabulation approach removes recursion completely** and builds the solution iteratively. The main idea is : For every index i, we want to know the length of the **longest increasing subsequence that ends at index i**. If we already know the LIS lengths for all previous indices, we can compute the LIS at the current index by checking all earlier elements. If a previous element is smaller than the current one, we can extend its subsequence by including the current element. By doing this for all indices, we ensure that when we finish, the maximum value in the DP array represents the length of the longest increasing subsequence.

## Algorithm

**Step 1:** Let n be the length of the array nums. Create a DP array dp of size n.

**Step 2:** Initialize every value in dp as 1. This is because every element by itself forms an increasing subsequence of length 1.

**Step 3:** Iterate through the array from left to right. For each index i, check all previous indices j where j < i.

**Step 4:** If nums[j] < nums[i], it means the subsequence ending at j can be extended.

**Step 5:** Keep track of the maximum value in the dp array while updating it.

**Step 6:** After processing all elements, return the maximum value stored in dp.

## Time Complexity: O(n²)

**Explanation: **For each element in the array, we compare it with all previous elements to decide whether the subsequence can be extended. This results in a nested loop structure, leading to a quadratic time complexity.

## Space Complexity: O(n)

**Explanation: **We use a single DP array of size n to store the LIS length ending at each index. No recursion stack or additional data structures are required.







# Optimal Approach

## Intuition

In the tabulation approach, we computed the LIS length by checking all previous elements for every index, which takes O(n²) time. The optimal approach improves this by using a **greedy strategy combined with binary search**. The key idea is **not to store the actual subsequence**, but to maintain an array that helps us determine the *length* of the LIS efficiently.

We maintain an array (often called tails) where:

- tails[i] represents the **smallest possible ending value** of an increasing subsequence of length i + 1.

For every number in the array:

- If it is larger than all values in tails, we extend the LIS.
- Otherwise, we replace the first value in tails that is greater than or equal to the current number using binary search.

The length of the tails array at the end gives the length of the LIS.

## Algorithm

**Step 1:** Create an empty list (or array) called tails.

**Step 2:** Iterate through each number in the array nums.

**Step 3:** For the current number:

- Use binary search to find the first index in tails where the value is greater than or equal to the current number.

**Step 4:** If such an index exists, replace the value at that index with the current number. Otherwise, append the current number to tails.

**Step 5:** After processing all elements, the size of tails represents the length of the longest increasing subsequence.

## Time Complexity: O(n log n)

**Explanation: **

- We iterate through all n elements.
- For each element, we perform a binary search on the tails array.
- Binary search takes O(log n) time.
- Hence, the total time complexity is O(n log n).

## Space Complexity: O(n)

**Explanation: **

- The tails array can grow up to size n in the worst case.
- No recursion stack or additional DP tables are used.
- Therefore, space complexity is linear.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/longest-increasing-subsequence)*
