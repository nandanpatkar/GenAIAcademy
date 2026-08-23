# Decode String

> **Slug:** `decode-string`  
> **Published:** 2026-08-22T17:00:28.076Z  
> **Updated:** 2026-08-22T17:00:28.082Z  
> **Keywords:** Decode String, Stacks  
> **Cover Image:** ![Decode String](https://cdn.codehelp.in/media/Decode.png)

**Description:** Learn how to decode an encoded string using stacks, with clear examples, step-by-step logic, real-life analogy, and complexity analysis.

---

## Problem Description

You are given an encoded string that needs to be decoded following a specific set of rules. The encoded pattern is formatted as ***k[encoded_string]***, where ***k*** signifies the number of times the ***encoded_string*** should be repeated. This means the value within the square brackets should be repeated ***k*** times to decode it. The encoded string is guaranteed to be a valid format, with no extra spaces, and properly balanced square brackets. Additionally, any numbers in the string refer directly to the repetition count.

> [!NOTE]
> **INFO**
> Example 1
> Input: s = '3[a]2[bc]'
> 
> Output: aaabcbc
> 
> **Explanation: **The characters inside brackets are repeated according to the number before each bracket.

> [!NOTE]
> **INFO**
> Example 2
> Input:   s = '3[a2[c]]'
> 
> Output: accaccacc
> 
> **Explanation:** Nested brackets imply repeated sequences within repeated sequences.

## Optimal Approach

### Intuition

The problem involves decoding a string that follows **nested repetition rules**.

A **stack** is the natural choice here because:

- It follows **Last-In-First-Out (LIFO)** behavior, which matches the way nested brackets need to be decoded.
- When we see a closing bracket `]`, it signals that one complete segment is ready to be decoded.
- By popping elements from the stack, we can:
- 1. Extract the substring inside the brackets.
  2. Fetch the number just before the brackets (the repeat count).
  3. Repeat the substring that many times and push the expanded form back into the stack.

We continue this process until the entire encoded string has been unpacked and decoded.

### Approach

To solve this problem, we need to carefully simulate the decoding process. The tricky part is that the string can have **nested brackets**, which means decoding happens in layers (from innermost to outermost).

The idea is to use a **stack**, since decoding works in the reverse order of encountering characters: we first need to decode the most recent substring enclosed by brackets.

### Algorithm

Let’s now write the step-by-step algorithm for this decoding process:

1. **Initialize an empty stack** to store characters, digits, and intermediate substrings.
2. **Traverse each character** in the string:
3. - If the character is **not a closing bracket (']')**, push it onto the stack.
  - If the character is a **closing bracket (']')**, then:
  - - **Step 1:** Pop from the stack until an opening bracket `'['` is found. This forms the substring inside the brackets.
    - **Step 2:** Pop the `'['` itself (discard it).
    - **Step 3:** Pop digits (if any) from the stack to get the repetition count `k`. The digits may come out in reverse order, so reverse them to form the correct number.
    - **Step 4:** Repeat the substring `k` times and push the expanded result back onto the stack.
4. After processing all characters, the stack will contain the fully decoded string in pieces.
5. **Pop everything from the stack** and join it together to get the final decoded string.

### Understanding with Example

Input: `s = "3[a2[c]]"`

Step-by-step:

- Push characters until `]` is reached. Stack → [`3`, `[`, `a`, `2`, `[`, `c`].
- On encountering first `]`:
- - Substring = `"c"`.
  - Number = `2`.
  - Expanded substring = `"cc"`. Push → Stack = [`3`, `[`, `a`, `"cc"`].
- On next `]`:
- - Substring = `"a" + "cc"` = `"acc"`.
  - Number = `3`.
  - Expanded substring = `"accaccacc"`. Push → Stack = [`accaccacc`].
- End of traversal → Final Answer = `"accaccacc"`.

### Code

### C++ Code Implementation

```c++ code
class Solution {
public:
    string decodeString(string s) {
        stack<string> st;
        for(auto ch : s){
            if(ch == ']'){
                string temp = "";
                while(!st.empty() && !isdigit(st.top()[0])){
                    string top = st.top();
                    temp += top == "[" ? "" : top;
                    st.pop();
                }

                string numericTimes = "";
                while(!st.empty() && isdigit(st.top()[0])){
                    numericTimes += st.top();
                    st.pop();
                }
                reverse(numericTimes.begin(), numericTimes.end());

                int n = stoi(numericTimes);
                string currentDecode = "";
                while(n--){
                    currentDecode += temp;
                }
                st.push(currentDecode);
            }
            else{
                string temp(1, ch);
                st.push(temp);
            }
        }
        string ans = "";
        while(!st.empty()){
            ans += st.top();
            st.pop();
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
```

### Java Code Implementation

```java code
import java.util.Stack;

class Solution {
    public String decodeString(String s) {
        Stack<String> st = new Stack<>();
        for (char ch : s.toCharArray()) {
            if (ch == ']') {
                StringBuilder temp = new StringBuilder();
                while (!st.isEmpty() && !Character.isDigit(st.peek().charAt(0))) {
                    String top = st.pop();
                    if (!top.equals("[")) {
                        temp.insert(0, top);
                    }
                }

                StringBuilder numericTimes = new StringBuilder();
                while (!st.isEmpty() && Character.isDigit(st.peek().charAt(0))) {
                    numericTimes.insert(0, st.pop());
                }

                int n = Integer.parseInt(numericTimes.toString());
                StringBuilder currentDecode = new StringBuilder();
                for (int i = 0; i < n; i++) {
                    currentDecode.append(temp);
                }
                st.push(currentDecode.toString());
            } else {
                st.push(Character.toString(ch));
            }
        }
        StringBuilder ans = new StringBuilder();
        while (!st.isEmpty()) {
            ans.insert(0, st.pop());
        }
        return ans.toString();
    }
}
```

### Python Code Implementation

```python code
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []

        for ch in s:
            if ch == ']':
                temp = []

                # Collect the encoded string
                while stack and not stack[-1].isdigit():
                    top = stack.pop()
                    if top != '[':
                        temp.insert(0, top)

                # Collect the number
                num = []
                while stack and stack[-1].isdigit():
                    num.insert(0, stack.pop())

                n = int(''.join(num))
                decoded = ''.join(temp) * n
                stack.append(decoded)

            else:
                stack.append(ch)

        return ''.join(stack)
```

### Complexity Analysis

#### Time Complexity: O(N)

- Each character is **pushed and popped at most once**.
- Total complexity = **O(N)**, where N = length of the string.

### Space Complexity: O(N)

- The stack may hold up to N characters/substrings in the worst case.
- So, space complexity = **O(N).**



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/decode-string)*
