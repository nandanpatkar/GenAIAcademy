# Longest Common Prefix in a String

> **Slug:** `longest-common-prefix-in-a-string`  
> **Published:** 2026-07-05T13:29:32.315Z  
> **Updated:** 2026-07-05T13:29:32.335Z  
> **Keywords:** Longest Common Prefix in a String  
> **Cover Image:** ![Longest Common Prefix in a String](6a4a5c2738cb2da009adc139)

**Description:** Find the longest common prefix among an array of strings. Learn brute-force and vertical scanning methods with examples, edge cases, and complexity.

---

## Problem Statement

Given an array of strings ***strs***, the task is to determine the **longest common prefix** string that is shared among all the strings in the input array. If there isn't any common prefix, you should return an empty string ***""***.

### Example 1

> [!NOTE]
> **INFO**: Input: strs = ["flower", "flow", "flight"]

Output: "fl"

Explanation:  The strings "flower", "flow", and "flight" share the longest common prefix "fl".

### Example 2

> [!NOTE]
> **INFO**: Input: strs = ["dog", "racecar", "car"]

Output:  ""

Explanation: There is no common prefix among the input strings.

### Example 3

> [!NOTE]
> **INFO**: Input: strs = ['interstellar', 'internet', 'interview']

Output:  inter

Explanation:  The longest common prefix is 'inter'.

### Constraints

- 1 <= **strs.length** <= 200
- 0 <= **strs****.length** <= 200
- **strs** consists of only **lowercase** English letters.

## Real-Life Analogy

The Library book classification system, suppose you are a librarian organizing books on a shelf. Each book has a unique call number like an identifier, but books on related topics share common prefixes in their call numbers.

**Suppose Books on the Shelf:**
Book 1: "SCI-FIC-SPACE-001"
Book 2: "SCI-FIC-TIME-045"
Book 3: "SCI-FIC-ALIEN-089"

**N**ow, our task is to find the longest common starting sequence that all these books share. So, the process of this is to start from the leftmost character of each call number and then compare character by character across all books and lastly, stop when you find a mismatch in any book. 

**Now Analyse the position's**

- Position 0: All have 'S'  ✅
- Position 1: All have 'C'  ✅
- Position 2: All have 'I'  ✅
- Position 3: All have '-'  ✅
- Position 4: All have 'F' ✅
- Position 5: All have 'I'  ✅
- Position 6: All have 'C' ✅
- Position 7: All have '-'  ✅
- Position 8: Book 1 has 'S', Book 2 has 'T', Book 3 has 'A' ❌

**So, we conclude the common Prefix:** `"SCI-FIC-"`

## Brute-Force Approach

### Intuition

The simplest way to find the longest common prefix is to start by assuming that the first word in the list is the prefix. Then, go through each of the other words one by one and check if they start with this prefix. If a word doesn’t match, shorten the prefix from the end until it does. Keep doing this for all the words. If at any point the prefix becomes empty, it means there is no common prefix. After checking all words, whatever remains as the prefix is the longest common beginning shared by all the words.

### Algorithm

1. Firstly, we handle the **edge cases**, If the list of strings is empty or missing, return an empty string. If there is only one string, that string is the common prefix and return it.
2. Now after handling the edge cases we **initialize the prefix**. We take the first string and call it **prefix**. This is our starting guess for the common prefix.
3. ** **Then we **compare** and **shorten** when needed and go through each of the remaining strings one by one. For the current string, check whether it starts with **prefix**. If it does, move on to the next string. If it does not, remove the last character (rightmost character) from **prefix** (make it one character shorter) and check again. Repeat removing the last character until the current string starts with **prefix** or **prefix** becomes empty. If **prefix** becomes empty at any time, return an empty string immediately there is no common prefix.
4. At last, we return the **result**, the remaining **prefix** is the longest common prefix.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `strs = ["flower", "flow", "flight"]`
> 
> **Step 1: Initialize**
> 
> `prefix = "flower"`
> 
> **Step 2: Compare with strs[1] = "flow"**
> 
> **Current prefix:** `"flow"`
> 
> **Step 3: Compare with strs[2] = "flight"**
> 
> 
> **Final prefix:** `"fl"`
> 
> **Step 4: Return**
> **Output:** `"fl"`

### Code

### C++ Implementation

```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        // Step 1: Handle edge cases
        if (strs.empty()) {
            return "";
        }

        // Step 2: Initialize prefix with first string
        string prefix = strs[0];

        // Step 3: Compare with each string
        for (int i = 1; i < strs.size(); i++) {
            // While current string doesn't start with prefix
            while (strs[i].find(prefix) != 0) {
                // Remove last character from prefix
                prefix.pop_back();

                // If prefix becomes empty, no common prefix
                if (prefix.empty()) {
                    return "";
                }
            }
        }

        // Step 4: Return the longest common prefix
        return prefix;
    }
};
```

### Java Implementation

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        // Step 1: Handle edge cases
        if (strs == null || strs.length == 0) {
            return "";
        }
        
        // Step 2: Initialize prefix with first string
        String prefix = strs[0];
        
        // Step 3: Compare with each string
        for (int i = 1; i < strs.length; i++) {
            // While current string doesn't start with prefix
            while (strs[i].indexOf(prefix) != 0) {
                // Remove last character from prefix
                prefix = prefix.substring(0, prefix.length() - 1);
                
                // If prefix becomes empty, no common prefix
                if (prefix.isEmpty()) {
                    return "";
                }
            }
        }
        
        // Step 4: Return the longest common prefix
        return prefix;
    }
}
```

### Python Implementation

```python
class Solution:
    def longestCommonPrefix(self, strs):
        # Step 1: Handle edge cases
        if not strs:
            return ""

        # Step 2: Initialize prefix with first string
        prefix = strs[0]

        # Step 3: Compare with each string
        for i in range(1, len(strs)):
            # While current string doesn't start with prefix
            while not strs[i].startswith(prefix):
                # Remove last character from prefix
                prefix = prefix[:-1]

                # If prefix becomes empty, no common prefix
                if not prefix:
                    return ""

        # Step 4: Return the longest common prefix
        return prefix
```

### Complexity Analysis

#### Time Complexity: **O(S)**

- Let **S** be the total number of characters in all the strings combined.
- In the worst case, every character in every string might be compared to find the common prefix.
- If there are **n** strings and each string has an average length of **m**, the time complexity is **O(n × m)**.
- Since **S = n × m**, the overall time complexity can be expressed as **O(S)**.
- Therefore, the algorithm’s time grows linearly with the total number of characters across all strings.

#### Space Complexity: O(1)

- Only **one variable (prefix)** is used to store the current common substring.
- In **Java**, strings are immutable, so shortening the prefix creates a **new string object**, but the same variable is reused, so no extra storage accumulates.
- In **C++**, if using **std::string**, the prefix variable is updated in place when shortened, and no additional data structures are needed.
- **No extra arrays or collections** are used to store intermediate results.
- Therefore, the **overall extra space used is constant (O(1))**, excluding the space required for the final output string.

## Optimal Approach

### Intuition

Instead of comparing entire strings, we can compare them character by character **across **all strings. Start by taking the **first character** of the first string. Then, check if all other strings have the same character at position 0.
If all strings **match** at that position, move to the next position (1) and repeat the process.
However, if at any point a **mismatch** is found or one of the strings ends we stop immediately and return the prefix built so far. This approach is known as **vertical** **scanning** because we scan the characters column by column from top to bottom across all strings.

The main advantage of this approach is that, we can terminate early as soon as a mismatch is detected, which helps avoid unnecessary comparisons and improves efficiency in many cases.

### Algorithm

1. Firstly**, **We handle the** edge cases**. If the list of strings is **empty** or **missing**, return an empty **string** right away. There is nothing to compare, so the common prefix is empty.
2. Now, Pick the **first string** as the **reference**. Use the first string as guide. We will **compare** each character of this reference string with the characters at the same positions in all the other strings.
3. We check **characters** column by column. Go through the **reference string** from the **first** character to the **last**. For each position **i**:

- Look at every **other string** and check** two things**:
- 1. Does the other string have a character at position **i?** If it’s too **short**, **stop** the common prefix ends here.
  2. If it does have a character, does that **character match** the reference string’s character at **i?** If not, **stop** we have found the **first mismatch**.
- If all **strings** have the same character at position **i**, include that character in the prefix and **move** to the **next position**.

1. At last, we **return** the **prefix**. When we encounter a string that is too short or a mismatching character, return the characters matched so far. If we finish all characters of the first string without mismatches, the entire first string is the common prefix, return it.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `strs = ["flower", "flow", "flight"]`
> 
> **Initial State:**
> 
> `Reference string: strs[0] = "flower"`
> **Position i = 0:**
> 
> All match! Continue.
> 
> **Position i = 1:**
> 
> All match! Continue.
> 
> **Position i = 2:**
> 
> **Mismatch found at position 2!**
> 
> **Return** `strs[0].substring(0, 2)` = `"fl"`
> **Output:** `"fl"`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string longestCommonPrefix(const vector<string>& strs) {
        if (strs.empty()) return "";
        string prefix = strs[0];
        for (int i = 1; i < strs.size(); i++) {
            while (strs[i].find(prefix) != 0) {
                prefix = prefix.substr(0, prefix.size() - 1);
                if (prefix.empty()) return "";
            }
        }
        return prefix;
    }
};
```

### Java Implementation

```java
class Solution {
    public String longestCommonPrefix(List<String> strs) {
        if (strs.isEmpty()) return "";
        String prefix = strs.get(0);
        for (int i = 1; i < strs.size(); i++) {
            while (!strs.get(i).startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}
```

### Python Implementation

```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        
        # Start with the first string as the initial prefix
        prefix = strs[0]
        
        for i in range(1, len(strs)):
            # While the current string does not start with the prefix
            while not strs[i].startswith(prefix):
                # Shorten the prefix by one character from the end
                prefix = prefix[:-1]
                
                # If prefix becomes empty, there is no common prefix
                if not prefix:
                    return ""
                    
        return prefix
```

### Complexity Analysis

#### Time Complexity: **O(S)**

- Let **S** be the total number of characters across all strings i.e **S =** **n x m**.
- **Best case:** An early mismatch occurs (e.g., first characters differ), so the algorithm stops quickly.Time complexity in this case is roughly **O(n × 1)** or **O(n × m)**, where **m** is the length of the shortest string.
- **Worst case:** All strings are identical or share a long prefix, requiring every character of every string to be checked.Time complexity in this case is **O(n × m)**.
- Overall, the time complexity is **O(S)**.
- In practice, it often performs faster because it stops immediately when a mismatch is found.

#### Space Complexity: O(1)

- For both Java and C++, the **extra space complexity is O(1)**.
- The only memory used beyond the input is for loop variables; the prefix string created by substring operations is considered output space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/longest-common-prefix-in-a-string)*
