# Minimum Add to Make Parentheses Valid

> **Slug:** `minimum-add-to-make-parentheses-valid`  
> **Published:** 2026-08-22T16:46:13.194Z  
> **Updated:** 2026-08-22T16:46:13.200Z  
> **Keywords:** Minimum Add to Make Parentheses Valid, Parentheses Valid, Stacks  
> **Cover Image:** ![Minimum Add to Make Parentheses Valid](https://cdn.codehelp.in/media/min add paranth valid.png)

**Description:** Learn how to find the minimum additions needed to make parentheses valid using stacks, with examples, real-life analogy, and complexity analysis.

---

## Problem Statement

Given a string s consisting solely of the characters '(' and ')', your task is to determine the minimum number of parentheses (either '(' or ')') that need to be added to make the string valid. A valid string fulfills the following criteria:

1. It can be an empty string.
2. It can be expressed as AB where both A and B are valid strings.
3. It can be expressed as (A), where A is a valid string.

You are allowed to insert a parenthesis at any position in the string. For example, if s = ")))"), by inserting an opening parenthesis, it becomes "(())", or by inserting a closing parenthesis, it becomes "()))()".

> [!NOTE]
> **INFO**
> **Example 1**
> Input:  s = '()))'
> 
> Output: 2
> 
> **Explanation:** Two moves are required to add missing '(' and ')'.

> [!NOTE]
> **INFO**
> **Example 2**
> Input:  s = '((('
> 
> Output: 3
> 
> **Explanation:** Three moves are required to add closing ')'.

## Constraints

- 1 <=** s.length** <= 105
- **s** consists only of** '(' **and** ')'**

## Brute-Force Approach

### Intuition

The classic way to deal with parenthesis matching problems is by using a Stack. A stack allows us to keep track of unmatched opening parentheses as we iterate through the string.

- When we see an opening parenthesis **(**, we push it onto the stack.
- When we see a closing parenthesis **)**, we check if there is an available opening parenthesis at the top of the stack. If there is, they form a valid pair, and we pop the opening parenthesis from the stack.
- If the stack is empty when we encounter a **)**, it means this closing parenthesis is unmatched and requires an opening parenthesis to be added. We can keep a counter for these unmatched closing parentheses.

After processing the entire string, any remaining elements in the stack are unmatched opening parentheses that require corresponding closing parentheses.

### Algorithm

1. Firstly, initialize an empty stack to keep track of opening parentheses and a counter **unmatchedClose = 0** to count closing parentheses that do not have a matching opening parenthesis.
2. Traverse the string character by character.
3. If the current character is **'('**, push it onto the stack because it may be matched with a closing parenthesis later.
4. If the current character is **')'**, check whether the stack is empty. If it is not empty, pop the top element because we have found a matching pair. If the stack is empty, increment **unmatchedClose** because this closing parenthesis has no matching opening parenthesis.
5. After processing the entire string, the remaining elements in the stack represent the unmatched opening parentheses.
6. Finally, return **stack.size() + unmatchedClose**, which gives the minimum number of parentheses that need to be added to make the string valid.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int minAddToMakeValid(string s) {
        stack<char> st;
        int unmatchedClose = 0;
        
        for (char c : s) {
            if (c == '(') {
                st.push(c);
            } else {
                if (!st.empty()) {
                    st.pop();
                } else {
                    unmatchedClose++;
                }
            }
        }
        
        return st.size() + unmatchedClose;
    }
};
```

### Java Implementation

```java
class Solution {
    public int minAddToMakeValid(String s) {
        Stack<Character> st = new Stack<>();
        int unmatchedClose = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                st.push(c);
            } else {
                if (!st.isEmpty()) {
                    st.pop();
                } else {
                    unmatchedClose++;
                }
            }
        }
        
        return st.size() + unmatchedClose;
    }
}
```

### Python Implementation

```python
class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        stack = []
        unmatched_close = 0
        
        for c in s:
            if c == '(':
                stack.append(c)
            else:
                if stack:
                    stack.pop()
                else:
                    unmatched_close += 1
                    
        return len(stack) + unmatched_close
```

### Complexity Analysis

#### Time Complexity: O(n)

- We traverse the string only once, and each character requires at most one stack operation.
- Since push and pop operations take **O(1)** time.
- The overall time complexity is ***O(n)****.*

#### Space Complexity: O(n)

- In the worst case, the string may contain only opening parentheses, such as **"((((("**.
- In this case, all **n** characters are stored in the stack, resulting in ***O(n)**** * auxiliary space.

## Optimal Approach

### Intuition

While the stack approach works perfectly, we can optimize the space complexity. If we look closely, the stack is only used to count the number of unmatched opening parentheses. It doesn't actually store different types of brackets (like **[** or **{**). Because there is only one type of parenthesis, we don't need a stack—we can simply use an integer counter to keep track of the unmatched opening parentheses!

While traversing the string:

- We keep track of unmatched opening parentheses using a counter **unmatchedOpen**.
- Whenever we encounter a closing parenthesis, we try to match it with a previously seen opening parenthesis by decrementing **unmatchedOpen**.
- If no unmatched opening parenthesis is available (**unmatchedOpen == 0**), this closing parenthesis is an extra, so we count it in an **unmatchedClose **counter.

After processing the entire string, the total number of additions required is simply the sum of unmatched opening and unmatched closing parentheses.

### Algorithm

1. Firstly, we initialize two variables, **unmatchedOpen = 0** (to count unmatched opening parentheses) and **unmatchedClose = 0** (to count unmatched closing parentheses).
2. Next, we traverse each **character c** of the string **s**.
3. If the current character is **'('**, increment **unmatchedOpen**.
4. If the current character is **')'**:
5. - If **unmatchedOpen **is greater than 0, match it with an opening parenthesis by decrementing **unmatchedOpen**.
  - Otherwise, increment** unmatchedClose** because this closing parenthesis has no matching opening parenthesis.
6. At last, we return **unmatchedOpen + unmatchedClose** as the minimum number of parentheses that need to be added.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int minAddToMakeValid(string s) {
        int unmatchedOpen = 0, unmatchedClose = 0;

        for (char c : s) {
            if (c == '(') {
                unmatchedOpen++;
            } else {
                if (unmatchedOpen > 0) {
                    unmatchedOpen--;
                } else {
                    unmatchedClose++;
                }
            }
        }

        return unmatchedOpen + unmatchedClose;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public int minAddToMakeValid(String s) {
        int unmatchedOpen = 0, unmatchedClose = 0;

        for (char c : s.toCharArray()) {
            if (c == '(') {
                unmatchedOpen++;
            } else {
                if (unmatchedOpen > 0) {
                    unmatchedOpen--;
                } else {
                    unmatchedClose++;
                }
            }
        }

        return unmatchedOpen + unmatchedClose;
    }
}
```

### index.python Implementation

```index.python
class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        unmatched_open = 0
        unmatched_close = 0

        for c in s:
            if c == '(':
                unmatched_open += 1
            else:
                if unmatched_open > 0:
                    unmatched_open -= 1
                else:
                    unmatched_close += 1

        return unmatched_open + unmatched_close
```

### Complexity Analysis

#### Time Complexity: O(N)

- We traverse the string exactly once, processing each character in constant time.
- Therefore, the overall time complexity is ***O(N)***.

#### Space Complexity: O(1)

- We use only a couple of integer variables to keep track of unmatched opening and closing parentheses.
- No additional data structure is required, so the space complexity is **O(1)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/minimum-add-to-make-parentheses-valid)*
