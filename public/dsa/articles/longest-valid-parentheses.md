# Longest Valid Parentheses

> **Slug:** `longest-valid-parentheses`  
> **Published:** 2026-08-22T17:01:25.685Z  
> **Updated:** 2026-08-22T17:01:25.688Z  
> **Keywords:** Longest Valid Parentheses, Stacks  
> **Cover Image:** ![Longest Valid Parentheses](https://cdn.codehelp.in/media/Longest Valid_.png)

**Description:** Learn how to find the length of the longest valid parentheses substring using stacks, with examples, logic,  and complexity analysis.

---

## Problem Statement

The task is to determine the length of the longest substring of a given string s, composed only of the characters '(' and ')', that represents a well-formed sequence of parentheses.

A well-formed or valid parentheses sequence means every opening bracket '(' has a corresponding closing bracket ')', and they are correctly nested and ordered.

> [!NOTE]
> **INFO**
> Example 1
> Input:  s = "(()"
> 
> Output: 2
> 
> **Explanation:** The longest valid parentheses substring is "()", which starts at index 1 and ends at index 2.

> [!NOTE]
> **INFO**
> Example 2
> Input: s = ")()())"
> 
> Output: 4
> 
> **Explanation:** The longest valid parentheses substring is "()()", which starts at index 1 and ends at index 4.

## Optimal Approach

### Intuition

To find the longest valid parentheses substring, we need a way to keep track of unmatched opening parentheses and determine the length of valid sequences whenever a matching closing parenthesis is found.

A stack can help us store the indices of unmatched parentheses. Instead of storing the characters themselves, we store their indices because we need to calculate substring lengths.

We initially place -1 in the stack. This acts as a base index for calculating lengths when the first valid substring is found.

While traversing the string:

- If we encounter an opening parenthesis '(', we push its index onto the stack.
- If we encounter a closing parenthesis ')', we remove the top element from the stack because it potentially matches an opening parenthesis.

After popping:

- If the stack becomes empty, it means there is no valid starting point for future substrings, so we push the current index as the new base.
- Otherwise, the current valid substring length is the difference between the current index and the index at the top of the stack.

By continuously updating the maximum length, we obtain the length of the longest valid parentheses substring.

## Algorithm

**Step 1:** Create a stack and push -1 into it as the initial base index.

**Step 2: **Initialize a variable maxLen to store the maximum valid substring length.

**Step 3:** Traverse the string from left to right.

**Step 4: **If the current character is '(', push its index onto the stack.

**Step 5:**If the current character is ')'pop the top element from the stack.

**Step 6:** After popping:

- If the stack becomes empty, push the current index into the stack as the new base.
- Otherwise, calculate the length of the current valid substring as:
currentLength = currentIndex - stack.peek()

**Step 7:** Update maxLen with the maximum value between maxLen and currentLength.

**Step 8:** After processing the entire string, return maxLen.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int longestValidParentheses(string s) {
        stack<int> stk;
        stk.push(-1);
        int maxLen = 0;

        for (int i = 0; i < s.length(); ++i) {
            if (s[i] == '(') {
                stk.push(i);
            } else {
                stk.pop();
                if (stk.empty()) {
                    stk.push(i);
                } else {
                    maxLen = max(maxLen, i - stk.top());
                }
            }
        }
        return maxLen;
    }
};
```

### Java Implementation

```java
class Solution {
    public int longestValidParentheses(String s) {
        Stack<Integer> stk = new Stack<>();
        stk.push(-1);
        int maxLen = 0;

        for (int i = 0; i < s.length(); ++i) {
            if (s.charAt(i) == '(') {
                stk.push(i);
            } else {
                stk.pop();
                if (stk.isEmpty()) {
                    stk.push(i);
                } else {
                    maxLen = Math.max(maxLen, i - stk.peek());
                }
            }
        }
        return maxLen;
    }
}
```

### Python Implementation

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack = [-1]
        max_len = 0

        for i in range(len(s)):
            if s[i] == '(':
                stack.append(i)
            else:
                stack.pop()

                if not stack:
                    stack.append(i)
                else:
                    max_len = max(max_len, i - stack[-1])

        return max_len
```

### Complexity Analysis

#### Time Complexity: O(n)

- The string is traversed exactly once.
- Each index is pushed onto and popped from the stack at most one time.

#### Space Complexity: O(n)

- In the worst case, all indices may be stored in the stack, requiring O(n) extra space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/longest-valid-parentheses)*
