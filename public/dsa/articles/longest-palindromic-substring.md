# Longest Palindromic Substrings

> **Slug:** `longest-palindromic-substring`  
> **Published:** 2026-07-05T12:36:17.503Z  
> **Updated:** 2026-07-05T12:36:17.534Z  
> **Keywords:** None  
> **Cover Image:** ![Longest Palindromic Substrings](https://cdn.codehelp.in/media/longest pal substring.png)

**Description:** Find the longest palindromic substring in a string using brute-force and center-expansion methods. Learn algorithms, dry runs, and time-space analysis.

---

## Problem Statement

Given a string **s**, your goal is to identify the longest substring of **s** that is a palindrome. 

***Note:*** A palindrome is defined as a sequence that reads the same way forwards and backwards. 

### Example 1

> [!NOTE]
> **INFO**
> **Input:** s = 'xyzyxzyzyx'
> **Output:** xyzyx
> **Explanation: ** In "**xyzyxzyzyx**", the substring **"xyzyx"** is a palindrome because it remains the same when reversed. Other palindromic substrings exist, but they are shorter.Therefore, **"xyzyx"** is the longest palindromic substring.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** s = 'aaaa'
> **Output:** aaaa
> **Explanation:** In **"aaaa"**, the entire string is already a palindrome. Since no longer substring exists, **"aaaa"** is the longest palindromic substring.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** s = 'abacdfgdcaba'
> **Output: **aba
> **Explanation: **In **"abacdfgdcaba"**, the substring **"aba"** is a palindrome. Other palindromic substrings exist, but none are longer. Therefore, **"aba"** is the longest palindromic substring.

### Constraints

- 1 <= **s.length** <= 1000
- **s** consists of only English letters and digits.

### Real-Life Analogy

A librarian receives two secret codes, **“paper”** and **“title.”** She begins with a quick glance—if the codes aren’t the same length, there’s no mystery to solve and she stops right there. When the lengths do match, she reads both codes together, moving smoothly from left to right, comparing one character at a time.

As she goes, she keeps two simple notes in her mind: one remembers how characters from the first code pair with characters in the second, and the other ensures that no character in the second code is claimed twice. Each time she looks at a new position, she either confirms a pairing she has already seen or records a new one, a task that takes almost no effort.

Because she moves through the codes only once and never looks back, the work grows steadily with the length of the codes—this makes the process **linear, O(n)**. The extra notes she keeps only depend on how many different characters appear, which stays small for a fixed alphabet, so the extra space is effectively **constant, O(1)**.

## Brute-Force Approach

### Intuition

The most basic approach to finding the longest palindromic substring involves examining all possible substrings of the given string. For each of these substrings, we check whether the characters read the same forwards and backwards, which qualifies it as a palindrome. While performing these checks, we continuously keep track of the longest palindrome we have found so far, updating it whenever a longer one appears. By the time all substrings have been considered, the longest palindromic substring is identified and can be returned as the final answer. This approach is simple to understand but can be inefficient for long strings.

### Algorithm

1. Firstly we **generate** **all possible substrings** of the given string by using two nested loops. The outer loop selects the starting index, and the inner loop selects the ending index. For each combination of start and end indices, extract the substring from the string.
2. For every **extracted substring**, check whether it is a **palindrome**. This can be done using a helper function that compares characters from the start and end moving towards the center.
3. After this  we keep track of the** longest palindrome** found so far. Whenever a palindrome longer than the current maximum is found, update the result to store this new substring.
4. At last, by **checking **all substrings, **return** the **longest palindromic substring** that was tracked as the result.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "babad"`
> 
> **Substrings checked:**
> 
> **Output:** `"bab"`

### Code

### C++ Implementation

```cpp
#include <string>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        if (s.empty()) {
            return "";
        }

        string longest = "";

        // Generate all substrings
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                string substring = s.substr(i, j - i + 1);

                // Check if palindrome and longer than current longest
                if (isPalindrome(substring) && substring.length() > longest.length()) {
                    longest = substring;
                }
            }
        }

        return longest;
    }

private:
    bool isPalindrome(string str) {
        int left = 0;
        int right = str.length() - 1;

        while (left < right) {
            if (str[left] != str[right]) {
                return false;
            }
            left++;
            right--;
        }

        return true;
    }
};
```

### Java Implementation

```java
class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() == 0) {
            return "";
        }
        
        String longest = "";
        
        // Generate all substrings
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                String substring = s.substring(i, j + 1);
                
                // Check if palindrome and longer than current longest
                if (isPalindrome(substring) && substring.length() > longest.length()) {
                    longest = substring;
                }
            }
        }
        
        return longest;
    }
    
    private boolean isPalindrome(String str) {
        int left = 0;
        int right = str.length() - 1;
        
        while (left < right) {
            if (str.charAt(left) != str.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
}
```

### Python Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ""

        longest = ""

        # Generate all substrings
        for i in range(len(s)):
            for j in range(i, len(s)):
                substring = s[i:j + 1]

                # Check if palindrome and longer than current longest
                if self.isPalindrome(substring) and len(substring) > len(longest):
                    longest = substring

        return longest

    def isPalindrome(self, string: str) -> bool:
        left = 0
        right = len(string) - 1

        while left < right:
            if string[left] != string[right]:
                return False
            left += 1
            right -= 1

        return True
```

### Complexity Analysis

#### Time Complexity: O(N³)

- Let **N** be the length of the string.
- The algorithm generates **every possible substring** using two nested loops:  - Outer loop selects the **starting index**.
  - Inner loop selects the **ending index**.
- There are roughly **N² substrings**, so generating them takes **O(N²)** time.
- For each substring, we check if it is a **palindrome** by comparing characters from both ends toward the center.
- Checking a substring can take up to **O(N)** time in the worst case.
- Combining substring generation and palindrome checking, the total time complexity is **O(N² × N) = O(N³)**.
- This **cubic time complexity** makes the approach inefficient for long strings.

#### Space Complexity: O(1)

- The algorithm does **not use extra space** that grows with the input size.
- The only extra storage is a **variable to track the longest palindrome** found so far.
- No substrings are stored, and **no additional data structures** are used.
- Therefore, the **auxiliary space is O(1)**.
- The space usage is **constant** and independent of the input string length.

## Optimal Approach

### Intuition

The problem requires finding the longest substring in a given string that reads the same forwards and backwards, known as a palindrome. A brute-force approach would check every possible substring and then verify whether each is a palindrome, resulting in a time complexity of **O(n³)**, which is inefficient for larger inputs. A more optimized approach takes advantage of the property that every palindrome is symmetric around its center. By treating each character as the center of an odd-length palindrome and each pair of adjacent characters as the center of an even-length palindrome, we can expand outward while the characters match, efficiently identifying the longest palindromic substring in **O(n²)** time with **O(1)** extra space.

### Algorithm

1. Firstly, we initialize **variables to track the starting index** and **maximum length** of the longest palindrome found. These variables will help us know where the longest palindrome begins and how long it is without storing multiple substrings.
2. After this, we **iterate** through each character in the string, treating each as a **potential centre** of a palindrome. Since palindromes can have odd or even lengths, we need to consider two types of centers for each character:

- Single character **center** which is odd-length palindrome: Treat the current character as the middle of the palindrome and attempt to expand outward in both directions.
- **Two-character center** (even-length palindrome): Treat the current character and the next character as the middle pair and expand outward to see if a longer palindrome exists.

1. Use an **expansion helper function** with left and right pointers, Start with the left and right pointers at the center (either the same for odd or consecutive for even).

- **Expand** the **pointers outward** symmetrically as long as the characters at the left and right positions match and the pointers are within the bounds of the string.
- This process ensures we find the **maximum length palindrome centered at that position**.
- **Return** the length of the palindrome found during this expansion.

1. Now, we **compare** the length of the palindrome found with the current maximum length: If the new palindrome is longer than the previous longest, update the **start** index to the leftmost position of this palindrome and update the **maxLength** to its length.
This ensures that after all iterations, we have the start position and length of the longest palindrome in the string. After examining all possible centers, use the recorded **start** index and **maxLength** to extract the longest palindromic substring from the original string.
2. **Return** this substring as the final result, which represents the longest sequence in the string that reads the same forwards and backwards.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "babad"`
> 
> **Iteration i = 0 (character 'b'):**
> 
> **Odd length (center = 'b'):**
> 
> Initial: left = 0, right = 0
> s[0] = 'b' (at center)
> 
> Expand: left = -1, right = 1 (out of bounds on left)
> Length = 1 - (-1) - 1 = 1
> `Palindrome: "b"`
> 
> **Even length (center between 'b' and 'a'):**
> 
> Initial: left = 0, right = 1
> s[0] = 'b', s[1] = 'a' → 'b' ≠ 'a'
> Length = 1 - 0 - 1 = 0
> `No palindrome`
> 
> **Best from i=0: length = 1**
> 
> `start = 0, maxLen = 1`
> 
> **Iteration i = 1 (character 'a'):**
> 
> **Odd length (center = 'a'):**
> 
> Initial: left = 1, right = 1
> s[1] = 'a'
> 
> Expand: left = 0, right = 2
> s[0] = 'b', s[2] = 'b' → match! ✓
> Continue...
> 
> Expand: left = -1, right = 3 (out of bounds on left)
> Length = 3 - (-1) - 1 = 3
> `Palindrome: "bab"`
> 
> **Even length (center between 'a' and 'b'):**
> 
> Initial: left = 1, right = 2
> s[1] = 'a', s[2] = 'b' → 'a' ≠ 'b'
> `Length = 0`
> 
> **Best from i=1: length = 3**
> 
> start = 0, maxLen = 3
> `Current longest = "bab"`
> 
> **Iteration i = 2 (character 'b'):**
> 
> **Odd length:**
> 
> Center: s[2] = 'b'
> Expand: s[1] = 'a', s[3] = 'a' → match! ✓
> Expand: s[0] = 'b', s[4] = 'd' → 'b' ≠ 'd' ✗
> Length = 4 - 0 - 1 = 3
> `Palindrome: "aba"`
> 
> **Even length:**
> 
> s[2] = 'b', s[3] = 'a' → no match
> `Length = 0`
> 
> **Best from i=2: length = 3 (not better than current)**
> 
> **Iteration i = 3 & i = 4:** Similar analysis, no longer palindrome found.
> 
> **Final Result:**
> 
> start = 0, maxLen = 3
> `Output: s.substring(0, 3) = "bab"`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string longestPalindrome(const string& s) {
        if (s.empty()) return "";
        int n = s.size(), start = 0, maxLen = 1;

        auto expandAroundCenter = [&](int left, int right) {
            while (left >= 0 && right < n && s[left] == s[right]) {
                if (right - left + 1 > maxLen) {
                    start = left;
                    maxLen = right - left + 1;
                }
                left--;
                right++;
            }
        };

        for (int i = 0; i < n; ++i) {
            expandAroundCenter(i, i);       // Odd-length palindromes
            expandAroundCenter(i, i + 1);   // Even-length palindromes
        }

        return s.substr(start, maxLen);
    }
};
```

### Java Implementation

```java
class Solution {
    private int start = 0;
    private int maxLen = 1;

    public String longestPalindrome(String s) {
        if (s == null || s.isEmpty()) {
            return "";
        }

        int n = s.length();

        for (int i = 0; i < n; i++) {
            expandAroundCenter(s, i, i);       // Odd-length palindromes
            expandAroundCenter(s, i, i + 1);   // Even-length palindromes
        }

        return s.substring(start, start + maxLen);
    }

    private void expandAroundCenter(String s, int left, int right) {
        int n = s.length();

        while (left >= 0 && right < n && s.charAt(left) == s.charAt(right)) {
            if (right - left + 1 > maxLen) {
                start = left;
                maxLen = right - left + 1;
            }
            left--;
            right++;
        }
    }
}
```

### Python Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ""

        n = len(s)
        start = 0
        max_len = 1

        def expandAroundCenter(left, right):
            nonlocal start, max_len

            while left >= 0 and right < n and s[left] == s[right]:
                if right - left + 1 > max_len:
                    start = left
                    max_len = right - left + 1
                left -= 1
                right += 1

        for i in range(n):
            expandAroundCenter(i, i)       # Odd-length palindromes
            expandAroundCenter(i, i + 1)   # Even-length palindromes

        return s[start:start + max_len]
```

### Complexity Analysis

#### Time Complexity: O(N²)

- The algorithm treats each character in the string as a **potential center** for a palindrome.
- For a string of length **N**, there are **O(N) centers** to check.
- For each center, the algorithm **expands outward** to find the maximum palindrome.
- In the worst case, a palindrome can span nearly the entire string, requiring up to **O(N) steps** per center.
- Combining the center checks and expansions, the total time complexity is **O(N × N) = O(N²)**.
- This is significantly **faster than the brute-force approach**, which checks all substrings and takes **O(N³)** time.

#### Space Complexity: O(1)

- The algorithm does **not use any extra data structures** like arrays, HashMaps, vectors, or sets.
- Only a **constant number of variables** are used (**start**, **maxLen**, **loop index**, **left**, **right**).
- The input string is **not copied or modified**; it is only read.
- The palindrome is identified using **indices**, not by storing substrings during computation.
- The returned substring is considered **output**, not extra working space.
- **So,** **O(1)**  Constant extra space for both **Java and C++.**



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/longest-palindromic-substring)*
