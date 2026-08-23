# Remove All Adjacent Duplicates in String

> **Slug:** `remove-all-adjacent-duplicates-in-string`  
> **Published:** 2026-08-22T16:28:21.814Z  
> **Updated:** 2026-08-22T16:28:21.818Z  
> **Keywords:** Remove All Adjacent Duplicates in String, Stacks, Remove, Duplicates in String  
> **Cover Image:** ![Remove All Adjacent Duplicates in String](https://cdn.codehelp.in/media/Remove All string 1.png)

**Description:** Learn how to remove all adjacent duplicates from a string using stacks, with examples, step-by-step logic, real-life analogy, and complexity analysis.

---

## Problem Statement

Given a string **s** composed of lowercase English letters, your task is to repeatedly perform duplicate removals until no further duplicate pairs can be removed. A duplicate removal consists of selecting any two adjacent and identical letters in the string and removing them. This process should be carried out continuously until the string no longer contains any adjacent duplications.

You are required to return the final form of the string after all possible duplicate removals are done. The uniqueness of the result is assured.

> [!NOTE]
> **INFO**
> Example 1
> Input: s = 'abbaca'
> 
> Output: ca
> 
> **Explanation:** Removing adjacent duplicates results in 'aaca' then 'ca'.

> [!NOTE]
> **INFO**
> Example 2
> 
> Input:   s = 'aabccb'
> 
> Output: 
> 
> **Explanation:** Removing adjacent duplicates leads to an empty string.

## Constraints

- 1 <=** s.length **<= 105
- **s consists only of lowercase English letters**

## Optimal Approach

### Intuition

Whenever two adjacent characters are the same, they must be removed. After removing a pair, new adjacent characters may become equal and form another duplicate pair.

A stack is well-suited for this problem because it allows us to compare the current character with the most recently processed character.

- If the current character is the same as the character at the top of the stack, we remove the top character from the stack. This effectively removes the duplicate pair.
- Otherwise, we push the current character onto the stack.

By processing the string from left to right, the stack always stores the characters that remain after all duplicate removals so far. Once the traversal is complete, the stack contains the final valid string.

### Algorithm

1. Firstly, create an empty stack to keep track of the characters that remain after removing adjacent duplicates.
2. Traverse the string character by character.
3. For each character, check whether the stack is not empty and its top character is equal to the current character.
4. If both characters are equal, remove the top character from the stack because the current character and the top character form an adjacent duplicate pair.
5. Otherwise, push the current character onto the stack because it does not form a duplicate with the previous remaining character.
6. Continue this process until all characters of the string have been processed.
7. After processing the entire string, the stack contains the characters of the final result, but they are stored in reverse order.
8. Therefore, pop the characters from the stack and append them to a result string.
9. Finally, reverse the result string to restore the original order and return it.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string removeDuplicates(string s) {
        stack<char> st;
        for(auto ch : s) {
            if(!st.empty() && st.top() == ch) {
                st.pop();
            } else {
                st.push(ch);
            }
        }
        string ans;
        while(!st.empty()) {
            ans += st.top();
            st.pop();
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
```

### Java Implementation

```java
class Solution {
    public String removeDuplicates(String s) {
        Stack<Character> stack = new Stack<>();
        for (char ch : s.toCharArray()) {
            if (!stack.isEmpty() && stack.peek() == ch) {
                stack.pop();
            } else {
                stack.push(ch);
            }
        }
        StringBuilder ans = new StringBuilder();
        while (!stack.isEmpty()) {
            ans.append(stack.pop());
        }
        return ans.reverse().toString();
    }
}
```

### Python Implementation

```python
class Solution:
    def removeDuplicates(self, s: str) -> str:
        stack = []

        for ch in s:
            if stack and stack[-1] == ch:
                stack.pop()
            else:
                stack.append(ch)

        return ''.join(stack)
```

### Complexity Analysis

#### Time Complexity: O(n)

- Each character is processed only once during the traversal. A character can be pushed onto the stack at most once and removed at most once.
- Therefore, the total number of stack operations is proportional to the length of the string, giving an overall time complexity of ***O(n)***.

#### Space Complexity: O(n)

- In the worst case, no adjacent duplicates are found, so all **n** characters remain in the stack.
- Therefore, the stack can require* ****O(n)*** extra space



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/remove-all-adjacent-duplicates-in-string)*
