# Minimum Bracket Reversal

> **Slug:** `minimum-bracket-reversal`  
> **Published:** 2026-08-22T16:32:58.652Z  
> **Updated:** 2026-08-22T16:32:58.656Z  
> **Keywords:** Minimum Bracket Reversal, Stacks, Reversal  
> **Cover Image:** ![Minimum Bracket Reversal](6a89cec2f695d4d77644fc49)

**Description:** Learn how to find the minimum bracket reversals  using stacks, with example,  real-life analogy, and complexity analysis.

---

## Problem Statement

Given a string consisting solely of curly braces { and }, your task is to convert this string into a balanced sequence with the least number of reversals. A sequence is defined as balanced when every opening brace { corresponds to a closing brace }.

Your goal is to determine the minimum number of reversals required to achieve a balanced sequence. Reversing means you can change an opening brace { to a closing brace } or vice versa. If it's impossible to balance the string, return -1.

> [!NOTE]
> **INFO**
> Example 1
> Input:  {}}{
> 
> Output: 2
> 
> **Explanation:** By reversing the second `}` to `{` and the last `{` to `}`, the balanced sequence `{}{}` is achieved.

> [!NOTE]
> **INFO**
> Example 2
> Input:  {{{{
> 
> Output: 2
> 
> **Explanation:** Reverse the last two `{` into `}` to form the balanced sequence `{{}}`.

## Constraints

- 1 <= **s.length** <= 104 (or 105, depending on platform)
- **s consists** only of **'{' **and '**}'**

## Optimal Approach

### Intuition

A balanced bracket sequence must have an **even length**, so if the string length is odd, it is impossible to balance it and we return **-1**. For an even-length string, we process the braces from left to right and try to match every closing brace **}** with a previously encountered opening brace **{**. If an opening brace is available, we match them; otherwise, the closing brace remains unmatched. After processing the entire string, only unmatched opening and closing braces remain. Two unmatched opening braces **{{** can be balanced by reversing one of them, and similarly, two unmatched closing braces **}}** require one reversal. Therefore, we calculate the reversals required for both types of unmatched braces and add them to get the minimum number of reversals.

## Algorithm

1. Firstly, check whether the length of the string is odd. If it is odd, **return -1** because a balanced bracket sequence must always contain an even number of braces.
2. Initialize two variables: **unbalancedOpen **to keep track of unmatched opening braces and **unbalancedClose **to keep track of unmatched closing braces.
3. Traverse the string character by character.
4. If the current character is **{**, increment **unbalancedOpen **because we have found an opening brace that may be matched later.
5. If the current character is **}**, check whether there is an unmatched opening brace available. If **unbalancedOpen > 0**, decrement **unbalancedOpen **because the current closing brace can be matched with it. Otherwise, increment **unbalancedClose **because this closing brace has no matching opening brace.
6. After processing the entire string, calculate the number of reversals required for the remaining unmatched braces.
7. For the unmatched opening braces, the required reversals are **(unbalancedOpen + 1) / 2**, because two **{{** braces require one reversal.
8. Similarly, for the unmatched closing braces, the required reversals are **(unbalancedClose + 1) / 2**, because two **}}** braces require one reversal.
9. Finally, add both values and return the total number of reversals required to make the string balanced.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int countReversals (string s)
    {
        // If string length is odd, we can't balance it
        if (s.length() % 2 != 0)
            return -1;
        
        // Initialize counts for unbalanced opening and closing braces
        int unbalanced_open = 0;  // Count of unmatched '{'
        int unbalanced_close = 0; // Count of unmatched '}'
        
        // Process each character in the string
        for (char c : s) {
            if (c == '{') {
                unbalanced_open++;
            }
            else { // c is '}'
                if (unbalanced_open > 0) {
                    // If we have an unmatched opening brace, match it
                    unbalanced_open--;
                }
                else {
                    // No matching opening brace found, count as unbalanced closing
                    unbalanced_close++;
                }
            }
        }
        
        // Calculate minimum reversals needed
        int open_reversals = (unbalanced_open + 1) / 2;
        int close_reversals = (unbalanced_close + 1) / 2;
        
        // Return total minimum reversals needed
        return open_reversals + close_reversals;
    }
};
```

### Java Implementation

```java
class Solution {
    public int countReversals(String s) {
        // If string length is odd, we can't balance it
        if (s.length() % 2 != 0)
            return -1;
        
        // Initialize counts for unbalanced opening and closing braces
        int unbalancedOpen = 0;  // Count of unmatched '{'
        int unbalancedClose = 0; // Count of unmatched '}'
        
        // Process each character in the string
        for (char c : s.toCharArray()) {
            if (c == '{') {
                unbalancedOpen++;
            } else { // c is '}'
                if (unbalancedOpen > 0) {
                    // If we have an unmatched opening brace, match it
                    unbalancedOpen--;
                } else {
                    // No matching opening brace found, count as unbalanced closing
                    unbalancedClose++;
                }
            }
        }
        
        // Calculate minimum reversals needed
        int openReversals = (unbalancedOpen + 1) / 2;
        int closeReversals = (unbalancedClose + 1) / 2;
        
        // Return total minimum reversals needed
        return openReversals + closeReversals;
    }
}
```

### Python Implementation

```python
class Solution:
    def countReversals(self, s: str) -> int:
        # If string length is odd, we can't balance it
        if len(s) % 2 != 0:
            return -1

        # Count unmatched opening and closing braces
        unbalanced_open = 0
        unbalanced_close = 0

        for ch in s:
            if ch == '{':
                unbalanced_open += 1
            else:  # ch == '}'
                if unbalanced_open > 0:
                    # Match with a previous unmatched opening brace
                    unbalanced_open -= 1
                else:
                    # Unmatched closing brace
                    unbalanced_close += 1

        # Minimum reversals needed
        open_reversals = (unbalanced_open + 1) // 2
        close_reversals = (unbalanced_close + 1) // 2

        return open_reversals + close_reversals
```

### Complexity Analysis

#### Time Complexity: O(N)

- ** **The string is traversed exactly once, and each character is processed in constant time.
- Overall it takes ***O(N)***.

#### Space Complexity: O(1)

- ** **Only a few integer variables are used to keep track of unmatched opening and closing braces.
- No extra data structures are required.
- So, overall it takes ***O(1).***



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/minimum-bracket-reversal)*
