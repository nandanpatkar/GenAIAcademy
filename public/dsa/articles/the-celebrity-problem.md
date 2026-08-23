# The Celebrity Problem

> **Slug:** `the-celebrity-problem`  
> **Published:** 2026-08-22T17:23:56.819Z  
> **Updated:** 2026-08-22T17:23:56.823Z  
> **Keywords:** The Celebrity Problem, Stacks  
> **Cover Image:** ![The Celebrity Problem](https://cdn.codehelp.in/media/Celebrity Problem.png)

**Description:** Learn how to solve the Celebrity Problem using stacks, with clear examples, step-by-step logic, and time and space complexity analysis.

---

## Problem Statement

In a gathering of n people, a *celebrity* is someone who satisfies the following conditions:

- The celebrity does not know any other person at the party.
- Everyone else at the party knows the celebrity.

The information about who knows whom is given in a 2D list M[][], where:

- M[i][j] = 1 indicates that person i knows person j.
- M[i][j] = 0 means person i does not know person j.

Your task is to identify whether there is a celebrity at the party.

- If a celebrity is present, return their index.
- If there is no celebrity, return -1.

> [!NOTE]
> **INFO**
> Example 1
> Input: M = [[0, 1], [1, 0]], n = 2
> 
> Output: -1
> 
> **Explanation:** No celebrity exists as both persons know each other.

> [!NOTE]
> **INFO**
> Example 2
> Input: M = [[0, 1, 0], [0, 0, 0], [1, 1, 0]], n = 3
> 
> Output: 1
> 
> **Explanation:** Person 1 does not know anyone and is known by everyone else.

## Optimal Approach

## Intuition

A brute-force approach would be to check every person and verify whether they satisfy the celebrity conditions. This would require checking all rows and columns, resulting in O(n^2) work.

We can do better by using an elimination process.

Consider two people A and B:

- If A knows B, then A cannot be a celebrity because a celebrity knows nobody.
- If A does not know B, then B cannot be a celebrity because everyone must know the celebrity.

Using this observation, we can eliminate one person at a time and eventually find a single potential celebrity candidate.

However, the remaining candidate is only a possibility. We must verify that:

- The candidate does not know anyone else.
- Everyone else knows the candidate.

If both conditions are satisfied, the candidate is the celebrity; otherwise, no celebrity exists.

### Algorithm

**Step 1:** Assume person 0 is the potential celebrity candidate.

**Step 2: **Traverse all people from 1 to n - 1.

**Step 3:** For each person i:

- If the current candidate knows person i, the candidate cannot be a celebrity.
- Update the candidate to i.

**Step 4: **After the traversal, one potential celebrity candidate remains.

**Step 5: **Verify the candidate by checking every other person.

**Step 6: **For each person i (where i is not the candidate):

- If the candidate knows person i, return -1.
- If person i does not know the candidate, return -1.

**Step 7: **If all checks pass, return the candidate index.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int findCelebrity(vector<vector<int>>& M, int n) {
        // Step 1: Find a potential candidate using elimination
        int candidate = 0;
        
        for(int i = 1; i < n; i++) {
            // If current candidate knows i, then current candidate cannot be celebrity
            // Make i the new candidate
            if(M[candidate][i] == 1) {
                candidate = i;
            }
        }
        
        // Step 2: Verify if candidate is actually a celebrity
        for(int i = 0; i < n; i++) {
            // Skip checking candidate against themselves
            if(i != candidate) {
                // If candidate knows someone (M[candidate][i] == 1)
                // OR if someone doesn't know candidate (M[i][candidate] == 0)
                // Then candidate is not a celebrity
                if(M[candidate][i] == 1 || M[i][candidate] == 0) {
                    return -1;
                }
            }
        }
        
        return candidate;
    }
};
```

### Java Implementation

```java
class Solution {
    public int findCelebrity(int[][] M, int n) {
        // Step 1: Find a potential candidate using elimination
        int candidate = 0;
        
        for(int i = 1; i < n; i++) {
            // If current candidate knows i, then current candidate cannot be celebrity
            // Make i the new candidate
            if(M[candidate][i] == 1) {
                candidate = i;
            }
        }
        
        // Step 2: Verify if candidate is actually a celebrity
        for(int i = 0; i < n; i++) {
            // Skip checking candidate against themselves
            if(i != candidate) {
                // If candidate knows someone (M[candidate][i] == 1)
                // OR if someone doesn't know candidate (M[i][candidate] == 0)
                // Then candidate is not a celebrity
                if(M[candidate][i] == 1 || M[i][candidate] == 0) {
                    return -1;
                }
            }
        }
        
        return candidate;
    }
}
```

### Python Implementation

```python
class Solution:
    def findCelebrity(self, M, n):
        # Step 1: Find a potential candidate using elimination
        candidate = 0

        for i in range(1, n):
            # If current candidate knows i,
            # current candidate cannot be the celebrity
            if M[candidate][i] == 1:
                candidate = i

        # Step 2: Verify the candidate
        for i in range(n):
            if i != candidate:
                # Candidate should know nobody
                # Everybody should know candidate
                if M[candidate][i] == 1 or M[i][candidate] == 0:
                    return -1

        return candidate
```

### Complexity Analysis

#### Time Complexity: O(n)

- ** **The first pass eliminates non-celebrities in O(n) time.
- The second pass verifies the remaining candidate in O(n) time.
- Therefore, the overall time complexity is O(n).

#### Space Complexity: O(1)

- Only a few variables are used to store the candidate and loop indices.
- No extra data structures are required.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/the-celebrity-problem)*
