# Remove All Occurrences of a Substring

> **Slug:** `remove-all-occurrences-of-a-substring`  
> **Published:** 2026-07-04T21:52:23.282Z  
> **Updated:** 2026-07-04T21:52:23.331Z  
> **Keywords:** Remove all Occurrence of a Substring, Substring  
> **Cover Image:** ![Remove All Occurrences of a Substring](https://cdn.codehelp.in/media/Remove substring.png)

**Description:** Learn how to remove all occurrences of a substring from a string using Map and Trie. Step-by-step examples and optimized solutions.

---

## Problem Statement

Given two strings, ***s*** and ***part***, your task is to remove all occurrences of the string ***part*** from ***s***. Continue removing occurrences of ***part*** from ***s*** until it is no longer present. Ultimately, return the final version of the string ***s***that has all instances of ***part*** removed.

This problem is straightforward and involves string manipulation. You need to continuously eliminate the substring ***part*** from ***s*** as long as it appears in ***s*** and then return the modified string.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** s='daabcbaabcbc', part='abc'
> **Output:** dab
> **Explanation:** We first remove **"abc"** from **"daabcbaabcbc"**, which results in **"dabaabcbc"**.
> Removing **"abc"** again from the updated string gives **"dab"**.
> Since **"abc"** no longer appears, **"dab"** is the final output.

### Example 2

> [!NOTE]
> **INFO**
> **Input: **s='**axxxxyyyyb**', part='xy'
> **Output:** **ab**
> **Explanation:** In the string **"axxxxyyyyb"**, removing **"xy"** repeatedly eliminates all adjacent xy pairs formed during the process. After all possible **"xy"** removals, no such substring remains, and the final string becomes **"ab"**.

### Example 3

> [!NOTE]
> **INFO**
> **Input: **s='mississippi', part='issip'
> **Output:** misspi
> **Explanation: **In **"mississippi"**, the substring **"issip"** appears once in the middle.
> Removing **"issip"** leaves** "misspi"**.Since **"issip"** no longer exists, **"misspi"** is the final result.

### Constraints

- Length of **s** is between 1 and 1000.
- Length of part is between 1 and 100.
- **s** and part consist of **lowercase** English letters only.

## Real-Life Analogy

Imagine you’re cleaning your favorite white shirt the one you’ve had for years, the one that carries good memories. But over time, small stains started appearing: a little coffee spill here, a tiny ink mark there. At first, they seem harmless, but slowly they start making the shirt look messy. Now imagine that every stain on this shirt is actually the same shape the same little blotch pattern appearing again and again on different spots. Think of this repeated blotch as the substring **part**, and the entire shirt as the string **s**.

You take a stain remover and begin cleaning. You dab one stain  it disappears.Then you look again, and there’s another stain of the same shape somewhere else. You remove that too. Just when you think you’re done, you turn the shirt over and notice another one hidden near the seam. You continue this process over and over, removing the same kind of stain wherever it appears. Sometimes, removing one stain even exposes another that wasn’t obvious before but you don’t stop until you’ve removed every last one of them. Only when the shirt finally has **no trace** of that repeated stain pattern do you stop and smile, satisfied.

In the same way, this problem is about repeatedly cleaning the string **s** by removing every occurrence of **part**. As long as **part** exists anywhere in **s**, you scrub it out. And when the string is finally clean when **part** no longer appears that final spotless version is your answer.

## Brute-Force Approach

### Intuition

Think of the original string as a long ribbon and the substring **part** as a small tag attached somewhere on that ribbon. The straightforward idea is simple, keep looking for that tag and cut it out every time you see it. After each cut, you inspect the ribbon again from the beginning, because removing one tag might cause another tag to appear or shift into place. You repeat this search-and-remove cycle until there are no more tags left anywhere on the ribbon.

This method is very easy to understand because you’re just scanning the string again and again, removing each occurrence as soon as you find it. But because you repeatedly look through the entire string after each removal, it ends up doing a lot of extra work. It’s intuitive and direct, but not efficient.

### Algorithm

1. We begin by repeatedly searching the entire string for the substring **part**, because our goal is to keep removing every occurrence until none remain.
2. After this, As long as the string still contains **part**, we find the position where it appears and cut it out by taking everything before that index and everything after it, then joining those two pieces together. We do this because removing one instance may create a new instance immediately after, or shift characters so that another match becomes visible, so each removal must be followed by another full search.
3. Now, we continue this cycle of finding and removing until the string no longer contains **part**, which means all possible occurrences have been eliminated.
4. Once the loop finishes naturally with no more matches left, we return the final form of the string as the result.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "daabcbaabcbc"`, `part = "abc"`
> 
> **Iteration 1:**
> 
> s = "daabcbaabcbc"
> s.contains("abc")? Yes, at index 2
> `Remove: s = "da" + "baabcbc" = "dabaabcbc"`
> 
> **Iteration 2:**
> 
> s = "dabaabcbc"
> s.contains("abc")? Yes, at index 4
> `Remove: s = "daba" + "bc" = "dababc"`
> 
> **Iteration 3:**
> 
> s = "dababc"
> s.contains("abc")? Yes, at index 3
> `Remove: s = "dab" + "" = "dab"`
> 
> **Iteration 4:**
> 
> s = "dab"
> s.contains("abc")? No
> `Exit loop`
> 
> 
> 
> **Output:** `"dab"`

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    
    string removeOccurrences(string s, string part) {
        
        // Keep removing while part exists
        while (s.find(part) != string::npos) {
            int index = s.find(part);
            s = s.substr(0, index) + s.substr(index + part.length());
        }
        
        return s;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public String removeOccurrences(String s, String part) {
        // Keep removing while part exists
        while (s.contains(part)) {
            int index = s.indexOf(part);
            s = s.substring(0, index) + s.substring(index + part.length());
        }
        return s;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def removeOccurrences(self, s: str, part: str) -> str:
        # Keep removing while part exists
        while part in s:
            index = s.find(part)
            s = s[:index] + s[index + len(part):]
        return s
```

### Complexity Analysis

#### Time Complexity: O(N² )

- The search itself costs **O(N × M)** because checking for **part** may compare up to **M** characters at each of **N** positions. Since this scan can repeat around **N / M** times, the total work grows to **O(N² × M)**.
- Additionally, each removal creates new substrings, which also takes **O(N)** time and adds to the overhead.
- Overall, repeated scanning and rebuilding cause the time complexity to become **O(N² × M)**, making the approach inefficient for large inputs.

#### **Space Complexity: O(N)**

- The algorithm **does not use explicit data structures**, but still uses extra memory.
- Each **removal operation creates a new string** by concatenating the remaining parts.
- The newly created string can be **as large as the original** string.
- Since this happens repeatedly, the **total auxiliary space remains O(N)**.

## Optimal Approach

### Intuition

Instead of scanning the whole string again and again to find and remove **part**, we treat the building of the final string like assembling something carefully, one piece at a time. Imagine you're stacking characters one after another, almost like placing beads on a thread. With every new character you add, you quickly glance at the end of your stack to see if the last few beads form the exact pattern of **part**. If they do, you simply pull those last beads off removing an occurrence immediately, right when it appears.

This way, you never need to rescan the entire string to find matches. You detect and eliminate each occurrence **the moment it forms**, using only the characters already in your stack. The process flows naturally: add a character, check the recent few, remove if needed, and continue. By handling everything locally at the end of the stack, you completely avoid the repeated full searches that made the earlier approach inefficien

### Algorithm

1. Start with an **empty stack** because we need a structure that allows efficient addition and removal from the end because whenever the substring **part** appears at the end, we want to remove it immediately without rescanning the entire string because the stack will hold the current result string.
2. **N**ext we iterate through the input string character by character because every character in the input string may contribute to forming the substring **part** because **skipping a character may miss a potential** **occurrence**.
3. **N**ow we **append** the **current character** to the **stack** because by adding characters one by one, we gradually build the result string because a substring can only form when new characters are added.
4. After adding a character, check if the stack has at least as many characters as **part** because only then is it possible for the end of the stack to match **part** because checking earlier would be pointless.
5. Compare the last **length_of_part** characters in the stack with **part** because if they match, a full occurrence of **part** has just formed at the end of the current result because detecting it immediately allows us to remove it right away.
6. **N**ow, delete the last **length_of_part** characters from the stack because this removes the occurrence of **part** immediately because removal happens at the end, which is fast.
7. **Continue **until all characters are processed in the input string because this ensures every occurrence of **part** is detected and removed because one removal may form a new occurrence at the end.
8. Once all characters are processed, **combine the characters** in the stack into a single string because the stack now contains the fully cleaned string with all occurrences of **part** removed.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    
    string removeOccurrences(string s, string part) {
        string stack = "";
        int partLen = part.length();

        for (char c : s) {
            // Add current character
            stack.push_back(c);

            // Check last partLen characters
            if (stack.length() >= partLen) {
                string lastPart = stack.substr(stack.length() - partLen);

                if (lastPart == part) {
                    // Remove matching part
                    stack.erase(stack.length() - partLen, partLen);
                }
            }
        }

        return stack;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public String removeOccurrences(String s, String part) {
        StringBuilder stack = new StringBuilder();
        int partLen = part.length();
        
        for (char c : s.toCharArray()) {
            // Add current character
            stack.append(c);
            
            // Check if last 'partLen' characters form 'part'
            if (stack.length() >= partLen) {
                int start = stack.length() - partLen;
                String lastPart = stack.substring(start);
                
                if (lastPart.equals(part)) {
                    // Remove the matching part
                    stack.delete(start, stack.length());
                }
            }
        }
        
        return stack.toString();
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def removeOccurrences(self, s: str, part: str) -> str:
        stack = []
        part_len = len(part)

        for c in s:
            # Add current character
            stack.append(c)

            # Check last part_len characters
            if len(stack) >= part_len:
                if ''.join(stack[-part_len:]) == part:
                    # Remove matching part
                    del stack[-part_len:]

        return ''.join(stack)
```

### Complexity Analysis

#### Time Complexity: O(N x M)

- The method **processes every character exactly once**, making the core flow linear in the string length.
- The only extra work is **checking whether the end of the stack matches part**, which may involve comparing up to **M characters**.
- Since this check occurs for each of the **N characters**, the total time complexity is **O(N × M)**.
- This approach is **more efficient than brute-force** because it avoids rescanning or repeatedly rebuilding the string; all work is localized at the end of the stack.

#### Space Complexity: O(N)

- The main extra memory used is the **stack**, implemented with a **StringBuilder**.
- The stack can grow up to the **size of the input string** in the worst case.
- **No additional large data structures** are created, and all removals happen **in place** inside the same builder.
- Therefore, the **overall auxiliary space is O(N)**, which is typical for incremental string-building approaches.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/remove-all-occurrences-of-a-substring)*
