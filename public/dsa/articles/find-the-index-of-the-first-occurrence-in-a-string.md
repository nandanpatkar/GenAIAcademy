# Find the Index of the First Occurrence in a String

> **Slug:** `find-the-index-of-the-first-occurrence-in-a-string`  
> **Published:** 2026-07-07T18:36:25.159Z  
> **Updated:** 2026-07-07T18:36:25.168Z  
> **Keywords:** None  
> **Cover Image:** ![Find the Index of the First Occurrence in a String](https://cdn.codehelp.in/media/find the index.png)

**Description:** Find the first occurrence of a substring in a string. Learn brute-force and pointer-based approaches with dry runs, algorithms, and complexity analysis.

---

## Problem Statement

In this problem, your task is to find the index at which a given string ***needle***  first occurs within another string ***haystack***. 

If ***needle*** is a substring of ***haystack***, return the starting index of the first occurrence. If ***needle*** is not found, return -1.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** haystack = 'hello', needle = 'll'
> **Output:** 2
> **Explanation: **The substring 'll' starts at index 2 in 'hello'.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** haystack = 'aaaaa', needle = 'bba'
> **Output:** -1
> **Explanation:** 'bba' does not occur in 'aaaaa'.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** haystack = 'mississippi', needle = 'issip'
> **Output: **4
> **Explanation: **The substring 'issip' starts at index 4.

### Constraints

- 1 <= **haystack.length, needle.length** <= 104
- **haystack** and **needle** consist of only lowercase English characters.

## Real-Life Analogy

Imagine you are reading a long storybook (this is your **haystack**), and you are looking for a specific sentence or phrase (this is your **needle**) to find where it first appears. You start from the very beginning of the book and go through it page by page, line by line, word by word, until you spot that exact sentence.

Once you find the first appearance of that sentence, you note down its position in the book—this is like the **index** where the needle occurs in the haystack. If you read through the entire book and never come across that sentence, you conclude that it’s not there at all, which is equivalent to returning **-1**.

In other words, the task is like a careful search through a long document to locate the very first instance of a specific piece of text, and reporting where it starts.

## Brute-Force Approach

### Intuition

The most straightforward way to find the needle in the haystack is to start at the beginning of the haystack and try matching the needle at every possible position. At each starting point, we carefully compare characters one by one to see if the substring beginning there exactly matches the needle.

If the characters match completely, we immediately return the current starting position as the index of the first occurrence. If they do not match, we move one step forward in the haystack and repeat the comparison. We continue this process until either a match is found or we reach a point where the remaining portion of the haystack is shorter than the needle.

If no matching substring is found by the time we have checked all valid starting positions, we conclude that the needle does not exist in the haystack and return -1. This approach ensures that every possible occurrence is considered, making it simple and easy to understand, though it may not be the most efficient for very long strings.

### Algorithm

1. Firstly, we handle the edge cases before starting the search, handle special conditions to avoid unnecessary computation. If the **needle** is an empty string, by definition it occurs at the start of any string, so **return 0**.
If the **needle** is longer than the **haystack**, it is impossible for it to exist, so **return -1**.
2. After this, we try each starting position in the Haystack, Loop through all possible starting positions where the **needle** could fit inside the **haystack**.
Set up a loop with an index **i** from **0** to **haystack.length - needle.length.**
At each position **i**, consider the substring of **haystack** that starts at **i** and has the same length as **needle**.
3. For the current starting position **i**, compare each character of the **needle** with the corresponding character in the **haystack**.
If all characters match, the substring starting at **i** is identical to **needle**, so return **i** as the index of the first occurrence. If any character does not match, stop checking at this position and move to the next starting index.
4. After checking all possible positions, if no matching substring was found, return **-1** to indicate that the **needle** does not exist in the **haystack**.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `haystack = "sadbutsad"`, `needle = "sad"`
> 
> **Step 1: Edge Cases**
> 
> `needle is not empty ✓`
> `needle.length (3) ≤ haystack.length (9) ✓`
> 
> **Step 2-3: Try Each Position**
> 
> **Position i = 0:**
> 
> `Compare: haystack[0..2] vs needle[0..2]`
> 
> `j = 3 (matched all characters)`
> `Return 0 ✓`
> 
> **Output:** `0`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int strStr(string haystack, string needle) {
        // Step 1: Handle edge cases
        if (needle.empty()) {
            return 0;
        }

        if (needle.length() > haystack.length()) {
            return -1;
        }

        // Step 2: Try each starting position
        for (int i = 0; i <= haystack.length() - needle.length(); i++) {

            // Step 3: Check if needle matches at position i
            int j = 0;
            while (j < needle.length() && haystack[i + j] == needle[j]) {
                j++;
            }

            // If we matched all characters of needle
            if (j == needle.length()) {
                return i;
            }
        }

        // Step 4: Not found
        return -1;
    }
};
```

### Java Implementation

```java
class Solution {
    public int strStr(String haystack, String needle) {
        // Step 1: Handle edge cases
        if (needle.isEmpty()) {
            return 0;
        }
        
        if (needle.length() > haystack.length()) {
            return -1;
        }
        
        // Step 2: Try each starting position
        for (int i = 0; i <= haystack.length() - needle.length(); i++) {
            // Step 3: Check if needle matches at position i
            int j = 0;
            while (j < needle.length() && haystack.charAt(i + j) == needle.charAt(j)) {
                j++;
            }
            
            // If we matched all characters of needle
            if (j == needle.length()) {
                return i;
            }
        }
        
        // Step 4: Not found
        return -1;
    }
}
```

### Python Implementation

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        # Step 1: Handle edge cases
        if needle == "":
            return 0

        if len(needle) > len(haystack):
            return -1

        # Step 2: Try each starting position
        for i in range(len(haystack) - len(needle) + 1):

            # Step 3: Check if needle matches at position i
            j = 0
            while j < len(needle) and haystack[i + j] == needle[j]:
                j += 1

            # If we matched all characters of needle
            if j == len(needle):
                return i

        # Step 4: Not found
        return -1
```

### Complexity Analysis

#### Time Complexity: O((N - M + 1) × M) ≈ O(N × M)

- Let **N** be the length of the **haystack** and **M** the length of the **needle**.
- The algorithm checks every possible starting position in the haystack where the needle could fit.
- There are **(N - M + 1)** such starting positions.
- At each starting position, up to **M characters** are compared to see if the substring matches the needle.
- In the **worst case**, every comparison is necessary.
- The total number of character comparisons is **(N - M + 1) × M ≈ O(N × M)**.
- Example of worst case: haystack = **"aaaaaa"** and needle = **"aaaab"**, where each position requires a full scan.
- Therefore, the **worst-case time complexity is O(N × M)**.

#### Space Complexity: O(1)

- The algorithm uses only a few variables, such as **loop indices** and a **temporary character** for comparison.
- It does **not allocate extra arrays or strings** proportional to the input size.
- Therefore, the **auxiliary space is O(1)**.
- This makes the algorithm **space-efficient**.
- The method is **simple and straightforward**, but can be inefficient for very long strings or repeated patterns.
- It is most suitable for **small to medium input sizes**.

## Optimal Approach

### Intuition

Instead of checking every possible starting position with nested loops, we can use two pointers to traverse the strings simultaneously. One pointer moves along the **haystack** (i), and the other moves along the **needle** (j). Whenever the characters at both pointers match, we move both pointers forward. If a mismatch occurs, we reset the **needle** pointer to the start and continue scanning the **haystack**. This way, we efficiently look for the first occurrence of the **needle** without repeatedly checking overlapping substrings.

### Algorithm

1. Firstly, initialise the pointers as  start with two pointers: **i = 0** for the **haystack** and **j = 0** for the **needle**. This is necessary to keep track of the current positions in both strings while comparing characters.
2. Now, traverse the Haystack. While both pointers are within bounds:

- - If **haystack[i]** equals **needle[j]**, move both pointers forward. This ensures that we continue checking the next characters when the current characters match.
  - If **j **reaches the end of **needle**, a full match is found. Return the starting index **i - j**. This gives the first occurrence of **needle** in **haystack** because all characters of **needle** have matched consecutively.
  - If **haystack[i]** does not equal **needle[j]**, reset **j** to 0 and move **i** to the next possible start: **i = i - j + 1**. This is necessary because a mismatch breaks the current matching sequence, and we need to start checking **needlefrom** the beginning at the next position in **haystack**.

1. At last, we return -1 if **Not Found**. If the end of **haystack** is reached without finding **needle**, **return** **-1**. This indicates that no substring in **haystack** matches **needle**.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) return 0;

        int n = haystack.length();
        int m = needle.length();

        if (m > n) return -1;

        int i = 0; // haystack pointer
        int j = 0; // needle pointer

        while (i < n) {
            // Characters match
            if (haystack[i] == needle[j]) {
                i++;
                j++;

                // Found complete match
                if (j == m) {
                    return i - m;
                }
            } else {
                // Mismatch: reset needle pointer, adjust haystack pointer
                i = i - j + 1;
                j = 0;

                // Early termination
                if (i > n - m) {
                    return -1;
                }
            }
        }

        return -1;
    }
};
```

### Java Implementation

```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) return 0;
        
        int n = haystack.length();
        int m = needle.length();
        
        if (m > n) return -1;
        
        int i = 0; // haystack pointer
        int j = 0; // needle pointer
        
        while (i < n) {
            // Characters match
            if (haystack.charAt(i) == needle.charAt(j)) {
                i++;
                j++;
                
                // Found complete match
                if (j == m) {
                    return i - m;
                }
            } else {
                // Mismatch: reset needle pointer, adjust haystack pointer
                i = i - j + 1;
                j = 0;
                
                // Early termination
                if (i > n - m) {
                    return -1;
                }
            }
        }
        
        return -1;
    }
}
```

### Python Implementation

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if needle == "":
            return 0

        n = len(haystack)
        m = len(needle)

        if m > n:
            return -1

        i = 0  # haystack pointer
        j = 0  # needle pointer

        while i < n:
            # Characters match
            if haystack[i] == needle[j]:
                i += 1
                j += 1

                # Found complete match
                if j == m:
                    return i - m

            else:
                # Mismatch: reset needle pointer, adjust haystack pointer
                i = i - j + 1
                j = 0

                # Early termination
                if i > n - m:
                    return -1

        return -1
```

### Complexity Analysis

#### Time Complexity: O(N x M)

- The **worst-case scenario** happens when each character in the **haystack** is compared with every character in the **needle**.
- The outer traversal goes through up to **N characters**, where **N** is the length of the haystack.
- For each position, the **needle pointer** may move up to **M steps**, where **M** is the length of the needle.
- Therefore, the overall worst-case **time complexity is O(N × M)**.
- Pointer resets may reduce some comparisons in practice, but the **asymptotic complexity remains O(N × M)**.

#### Space Complexity: O(1)

- The algorithm uses only **two pointers**, `i` and `j`, to traverse the strings.
- **No additional data structures** are needed.
- Therefore, the **space complexity is O(1)** (constant space).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/find-the-index-of-the-first-occurrence-in-a-string)*
