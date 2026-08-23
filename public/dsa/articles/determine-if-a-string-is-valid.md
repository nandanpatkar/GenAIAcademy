# Determine if a String is Valid

> **Slug:** `determine-if-a-string-is-valid`  
> **Published:** 2026-08-22T16:44:00.209Z  
> **Updated:** 2026-08-22T16:44:00.213Z  
> **Keywords:** Determine if a String is Valid, String Valid, Stacks  
> **Cover Image:** ![Determine if a String is Valid](6a89d1c1f695d4d77644fc5d)

**Description:** Learn how to determine if a string is valid using stacks, with clear examples, step-by-step logic, real-life analogy, and complexity analysis.

---

## Problem Statement

Given a string s, your task is to determine if it is a **valid** string. A string s is considered **valid** if it can be constructed by repeatedly inserting the substring **"abc"** into an initially empty string t. Specifically, at any point, t can be transformed into tleft + "abc" + tright, where t = tleft + tright. Both tleft and tright can be empty.

> [!NOTE]
> **INFO**
> **Example 1**
> Input: s = "aabcbc"
> 
> Output: true
> 
> **Explanation:** Starting with an empty string:
> 
> - Insert "abc" to get "abc"
> - Insert another "abc" at the start to get "aabcbc" The given string "aabcbc" can be constructed through valid insertions.

> [!NOTE]
> **INFO**
> **Example 2**
> Input:  s = "abcabcabcabc"
> 
> Output: true
> 
> **Explanation:** The string is a continuous sequence of "abc" substrings.

## Intuition

Since the string is built by repeatedly inserting the substring **"abc"**, every valid string must eventually be reducible by removing occurrences of **"abc"** again and again.

We can use a stack to simulate this process. As we traverse the string, we push each character onto the stack. Whenever the top three characters of the stack form the sequence **"abc"**, we remove them because they represent one valid insertion. By continuously removing valid **"abc"** sequences, all characters should eventually be eliminated if the string is valid. If any characters remain in the stack at the end, it means the string contains an invalid arrangement and cannot be formed using the given operation.

## Algorithm

1. Firstly, create an empty stack to keep track of the characters that are currently part of the string.
2. Traverse the string character by character and push each character onto the stack.
3. After adding a character, check whether the stack contains at least three characters. If it does, check whether the top three characters form the sequence **"abc"**.
4. If the top three characters form **"abc"**, remove all three characters from the stack because they form a valid sequence that can be eliminated.
5. If the top three characters do not form **"abc"**, leave them unchanged and continue processing the next character.
6. Repeat this process until all characters of the string have been processed.
7. Finally, check whether the stack is empty. If it is empty, return **true**; otherwise, return **false**.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char ch : s) {
            st.push(ch);

            // Check if the last three characters form "abc"
            if (st.size() >= 3) {
                char c = st.top(); st.pop();
                char b = st.top(); st.pop();
                char a = st.top(); st.pop();

                if (a == 'a' && b == 'b' && c == 'c') {
                    // valid "abc" sequence found, do not push back
                } else {
                    // not a valid "abc", push them back in reverse
                    st.push(a);
                    st.push(b);
                    st.push(c);
                }
            }
        }

        // If stack is empty, the string is valid
        return st.empty();
    }
};
```

### Java Implementation

```java
import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> st = new Stack<>();
        for (char ch : s.toCharArray()) {
            st.push(ch);

            // Check if the last three characters form "abc"
            if (st.size() >= 3) {
                char c = st.pop();
                char b = st.pop();
                char a = st.pop();

                if (a == 'a' && b == 'b' && c == 'c') {
                    // valid "abc" sequence found, do not push back
                } else {
                    // not a valid "abc", push them back in reverse
                    st.push(a);
                    st.push(b);
                    st.push(c);
                }
            }
        }

        // If stack is empty, the string is valid
        return st.isEmpty();
    }
}
```

### Python Implementation

```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []

        for ch in s:
            stack.append(ch)

            # Check if the last three characters form "abc"
            if len(stack) >= 3:
                c = stack.pop()
                b = stack.pop()
                a = stack.pop()

                if a == 'a' and b == 'b' and c == 'c':
                    # Valid "abc" sequence found, do not push back
                    pass
                else:
                    # Not a valid "abc", push them back
                    stack.append(a)
                    stack.append(b)
                    stack.append(c)

        # If stack is empty, the string is valid
        return len(stack) == 0
```

### Complexity Analysis

#### Time Complexity: O(n)

- Each character is pushed onto the stack at most once.
- Each character can be removed from the stack at most once.
- Therefore, the total number of stack operations is proportional to the length of the string.
- Hence, the overall time complexity is ***O(n)***.

#### Space Complexity: O(n)

- In the worst case, no **"abc"** sequence can be removed.
- Therefore, all **n** characters may remain in the stack.
- Hence, the space complexity is ***O(n*****)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/determine-if-a-string-is-valid)*
