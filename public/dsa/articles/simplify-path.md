# Simplify Path

> **Slug:** `simplify-path`  
> **Published:** 2026-08-22T17:00:03.068Z  
> **Updated:** 2026-08-22T17:00:03.071Z  
> **Keywords:** Simplify Path, Stacks  
> **Cover Image:** ![Simplify Path](https://cdn.codehelp.in/media/simplify path.png)

**Description:** Learn how to simplify a Unix-style file path using stacks, with clear examples, step-by-step logic, real-life analogy, and complexity analysis.

---

## Problem Statement

In Unix-style file systems, absolute paths start with a slash ('/'). Your task is to simplify a given absolute path, ensuring it follows Unix path rules and returns its canonical form.

### Rules

- Period (`'.'`) represents the current directory and should be ignored.
- Double period (`'..'`) indicates moving up to the parent directory. At the root, it has no effect.
- Consecutive slashes ('//' or more) are considered as a single slash ('/').
- Any sequence of periods not conforming to the above rules should be treated as a normal directory or file name (e.g., `'...'`).

A canonical path should:

- Begin with a single slash `'/'`.
- Separate each directory with a single slash `'/'`.
- Not end with a slash `'/'`, unless it is the root directory.
- Contain no excess or unusual period usage.

> [!NOTE]
> **INFO**
> Example 1
> Input: path="/home/"
> 
> Output: "/home"
> 
> **Explanation:**The path ends with a slash but points to the /home directory.

> [!NOTE]
> **INFO**
> Example 2
> Input:   path="/../"
> 
> Output: "/"
> 
> **Explanation:** The '..' moves up to the parent directory, but since this is the root, it remains as /.

## Optimal Approach

## Intuition

We can think of the path as a sequence of directories that we visit one by one.

A stack is a natural choice for this problem because:

- When we encounter a normal directory name, we move into that directory, so we push it onto the stack.
- When we encounter "..", we move back to the parent directory, so we remove the most recently visited directory from the stack.
- When we encounter "." or an empty segment caused by multiple slashes, we simply ignore it.

After processing all path segments, the stack contains the directories that form the canonical path. We can then rebuild the simplified path from the contents of the stack.

## Algorithm

**Step 1:** Split the given path using '/' as the delimiter.

**Step 2: **Create an empty stack to store valid directory names.

**Step 3:** Traverse each segment obtained after splitting.

**Step 4:** For each segment:

- If the segment is empty or ".", ignore it.
- If the segment is "..", remove the top directory from the stack if the stack is not empty.
- Otherwise, treat it as a valid directory name and push it onto the stack.

**Step 5:** After processing all segments, construct the canonical path using the directories stored in the stack.

**Step 6:** Append each directory to the result string, preceded by a '/'.

**Step 7:** If the result is empty, return "/" because it represents the root directory.

**Step 8: **Otherwise, return the constructed path.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string simplifyPath(string path) {
        stack<string> stk;
        stringstream ss(path);
        string segment;
        
        while (getline(ss, segment, '/')) {
            if (segment == "" || segment == ".") continue;
            if (segment == "..") {
                if (!stk.empty()) stk.pop();
            } else {
                stk.push(segment);
            }
        }
        
        string result;
        while (!stk.empty()) {
            result = "/" + stk.top() + result;
            stk.pop();
        }
        return result.empty() ? "/" : result;
    }
};
```

### Java Implementation

```java
import java.util.Stack;

class Solution {
    public String simplifyPath(String path) {
        Stack<String> stack = new Stack<>();
        String[] segments = path.split("/");
        
        for (String segment : segments) {
            if (segment.isEmpty() || segment.equals(".")) continue;
            if (segment.equals("..")) {
                if (!stack.isEmpty()) stack.pop();
            } else {
                stack.push(segment);
            }
        }
        
        StringBuilder result = new StringBuilder();
        for (String dir : stack) {
            result.append("/").append(dir);
        }
        return result.length() > 0 ? result.toString() : "/";
    }
}
```

### Python Implementation

```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        stack = []

        for segment in path.split('/'):
            if not segment or segment == '.':
                continue
            elif segment == '..':
                if stack:
                    stack.pop()
            else:
                stack.append(segment)

        return '/' + '/'.join(stack) if stack else '/'
```

### Complexity Analysis

#### Time Complexity: O(n)

- ** **Each character of the path is processed at most once while splitting and traversing the segments.
- Stack operations also take constant time, resulting in an overall linear time complexity.

#### Space Complexity: O(n)

- In the worst case, all directory names may be stored in the stack.
- Therefore, the extra space required is proportional to the length of the path.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/simplify-path)*
