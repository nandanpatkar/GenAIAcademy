# Valid Anagram - Check if two Strings are anagrams of each other

> **Slug:** `valid-anagram---check-if-two-strings-are-anagrams-of-each-other`  
> **Published:** 2026-08-09T07:25:08.601Z  
> **Updated:** 2026-08-09T07:25:08.631Z  
> **Keywords:** None  
> **Cover Image:** ![Valid Anagram - Check if two Strings are anagrams of each other](https://cdn.codehelp.in/media/_Valid_.png)

**Description:** Learn how to check if two strings are anagrams using sorting and hash maps, with clear examples, real-life analogy, and complexity analysis.

---

## Problem Statement

Given two strings ***s*** and ***t***, your task is to determine if ***t*** is an anagram of ***s***.

***Note:*** An anagram is formed by rearranging the letters of a word or phrase to produce a new word or phrase, using all the original letters exactly once. In other words, ***t*** is an anagram of ***s*** if you can rearrange the letters of ***s*** to get ***t***.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:** s = "anagram", t = "nagaram"
> **Output:** true
> **Explanation: **Both strings contain the letters a, g, m, n, r in the same frequencies. Thus, ***t*** is an anagram of ***s***.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** s = 'rat', t = 'car'
> **Output:** false
> **Explanation:** car' is not an anagram of 'rat'.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:** s = 'hello', t = 'lloeh'
> 
> **Output:** true
> 
> **Explanation: **'lloeh' is an anagram of 'hello'.

## Constraints

- 1 <= **s.length**, **t.length** <= 5 * 10^4
- s and t consist of **lowercase** English letters.

## Real-Life Analogy

### 1. The Bakery Setup

Imagine you are a chef who owns a beautiful bakery. Every morning, you prepare **two baskets of ingredients** to bake your famous pastries.

### 2. Basket A (Original Ingredients)

In the first basket (Basket A), you carefully place:

- A few eggs
- Cups of flour
- Spoons of sugar
- A pinch of salt
- Some butter

This basket represents your **original recipe**.

### 3. Basket B (Rearranged Ingredients)

Later that day, your assistant brings another basket (Basket B) and claims:

- It contains **the exact same ingredients**
- Nothing is added
- Nothing is missing
- The ingredients are **just arranged differently**

### 4. Your Task: Verification

You cannot rely on appearance alone. You must **carefully count and compare**:

- Are there the **same number of eggs**?
- Is the **amount of flour identical**?
- Are the **spoons of sugar, butter, and salt** exactly the same?

### 5. Final Decision

- If **every ingredient matches perfectly** in both **type and quantity**, then Basket B is truly made from the same ingredients as Basket A.
- - You can confidently say **Basket B is an anagram of Basket A** — same ingredients, just shuffled.
- If even **one ingredient is extra or missing** (for example, an extra egg or no butter), then the baskets may look similar, but **they are not true anagrams**.

### Conclusion

If two strings contain **exactly the same characters in the same amounts** — no extra, no missing — then they are **perfect anagrams**, just like the two baskets with identical ingredients arranged differently.

## Brute-Force Approach

### Intuition

If two strings are anagrams, it means they consist of exactly the same characters appearing the same number of times, but possibly in a different order. By sorting both strings alphabetically, we rearrange their characters into a fixed sequence, which reveals whether they truly match.
After sorting, if both strings become identical, it confirms that every character and its frequency are the same in both. Sorting thus acts as a simple and reliable way to test for anagrams, since any difference in characters or frequency will immediately make the sorted versions of the strings appear different.

***Example:***

- `s = "anagram"` → sorted: `"aaagmnr"`
- `t = "nagaram"` → sorted: `"aaagmnr"`
- Both sorted strings match → They are anagrams!
This is much more efficient than generating permutations.

### Algorithm

1. We **check** if both words have the same length. First, look at how many letters each word has.
If the two words don’t have the same number of letters, they can never be anagrams.
**For example**, “cat” and “cuts” can’t be anagrams because one has 3 letters and the other has 4.
2. **Break** both words into individual letters. Next, separate each word into its individual letters.
For example, “listen” becomes [l, i, s, t, e, n] and “silent” becomes [s, i, l, e, n, t].
This helps us clearly see and compare each letter later.
3. Now, Arrange the letters in order.** **Now, put all the letters of both words in alphabetical order.
When we **sort** them, “listen” becomes [e, i, l, n, s, t] and “silent” also becomes [e, i, l, n, s, t].
Sorting helps us see if both words are made of exactly the same letters.
4. **Compare** the arranged letters.** **Finally, compare the two arranged lists of letters.
If they look exactly the same, it means both words have the same letters in the same quantity, so they are anagrams.
If even one letter is different, they are not anagrams.

### Dry Run

**Input:** `s = "listen"`, `t = "silent"`

**Step 1:** Check lengths

- `s.length() = 6`
- `t.length() = 6`
- Lengths are equal ✓

**Step 2:** Convert to arrays

- `sArr = ['l', 'i', 's', 't', 'e', 'n']`
- `tArr = ['s', 'i', 'l', 'e', 'n', 't']`

**Step 3:** Sort arrays

- `sArr` after sorting: `['e', 'i', 'l', 'n', 's', 't']`
- `tArr` after sorting: `['e', 'i', 'l', 'n', 's', 't']`

**Step 4:** Compare

- `sArr` equals `tArr` ✓
- Return `true`

**Output:** `true`

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <algorithm>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        // Step 1: Check if lengths are equal
        if (s.length() != t.length()) {
            return false;
        }

        // Step 2: Sort both strings
        sort(s.begin(), s.end());
        sort(t.begin(), t.end());

        // Step 3: Compare sorted strings
        return s == t;
    }
};
```

### index.java Implementation

```index.java
import java.util.Arrays;

class Solution {
    public boolean isAnagram(String s, String t) {
        // Step 1: Check if lengths are equal
        if (s.length() != t.length()) {
            return false;
        }
        
        // Step 2: Convert strings to character arrays
        char[] sArr = s.toCharArray();
        char[] tArr = t.toCharArray();
        
        // Step 3: Sort both arrays
        Arrays.sort(sArr);
        Arrays.sort(tArr);
        
        // Step 4: Compare sorted arrays
        return Arrays.equals(sArr, tArr);
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Step 1: Check if lengths are equal
        if len(s) != len(t):
            return False

        # Step 2: Sort both strings and compare
        return sorted(s) == sorted(t)
```

### Complexity Analysis

#### Time Complexity: **O(N log N)**

- Let **N** be the number of characters in each word.
- Converting a string into a list of characters takes **O(N)** time because each character is read once.
- Sorting the list of characters takes **O(N log N)** time.
- Sorting is the most time-consuming step in the algorithm.
- Comparing the two sorted character lists takes **O(N)** time.
- Since **O(N log N)** dominates the other operations, the overall time complexity is **O(N log N)**.

#### Space Complexity: O(N)

- Let **N** be the number of characters in each word.
- New lists are created to store the characters of both words, which requires **O(N)** space.
- The additional space used by the sorting algorithm depends on the sorting method.
- Some sorting algorithms require **O(log N)** extra space, while others may require constant space.
- The dominant space usage comes from storing the character lists.
- Therefore, the overall space complexity is **O(N)**.

## Optimal Approach Frequency Count (HashMap)

### Intuition

Instead of sorting the strings, we can check whether two words are anagrams by counting how many times each letter appears. The main idea is that if both words have the same characters appearing the same number of times, they must be anagrams. To do this efficiently, we can use a single HashMap (or frequency table).
As we go through the first word, we increase the count for each character. Then, as we go through the second word, we decrease the count. If at the end all counts are back to zero, it means both words contain identical letters with equal frequencies, confirming they are anagrams.

### Algorithm

1. First, see if **both** words have the same number of letters. If not, they cannot be anagrams, so stop and say “no.”
2. Now, we **count** the letters in the first word. Imagine a small box of counters where each letter has its own pile. Go through the first word letter by letter and add one counter to that letter’s pile each time it appears. After this, every letter in the first word has a number showing how often it appears.
3. After this, we **match** with the second word now we go through the second word letter by letter. For each letter you see, take away one counter from that letter’s pile in the box. If you ever need to take away a counter but that pile is empty (or the letter was never in the box), the words are not anagrams stop and say “NO”.
4. If we finish the second word and every pile in the box has exactly **zero** counters left, the two words used the same letters the same number of times, say “**YES**” they are anagrams. If any pile still has counters, say “**NO**”.

### Dry Run

**Input:** `s = "anagram"`, `t = "nagaram"`

**Step 1:** Check lengths

- `s.length() = 7`
- `t.length() = 7`
- Lengths match ✓

**Step 2:** Build frequency map from `s = "anagram"`

**Final map:** `{a:3, n:1, g:1, r:1, m:1}`

**Step 3:** Process string `t = "nagaram"`

All characters successfully decremented!

**Step 4:** Return `true`

**Output:** `true`

### Code

### index.cpp Implementation

```index.cpp
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        // Step 1: Early exit if lengths differ
        if (s.length() != t.length()) {
            return false;
        }

        // Step 2: Build frequency map for string s
        unordered_map<char, int> countMap;

        for (char c : s) {
            countMap[c]++;
        }

        // Step 3: Verify with string t
        for (char c : t) {
            // If character not in map or count is already 0
            if (countMap.find(c) == countMap.end() || countMap[c] == 0) {
                return false;
            }

            // Decrement count
            countMap[c]--;
        }

        // Step 4: All characters matched
        return true;
    }
};
```

### index.java Implementation

```index.java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAnagram(String s, String t) {
        // Step 1: Early exit if lengths differ
        if (s.length() != t.length()) {
            return false;
        }
        
        // Step 2: Build frequency map for string s
        Map<Character, Integer> countMap = new HashMap<>();
        for (char c : s.toCharArray()) {
            countMap.put(c, countMap.getOrDefault(c, 0) + 1);
        }
        
        // Step 3: Verify with string t
        for (char c : t.toCharArray()) {
            // If character not in map or count is already 0
            if (!countMap.containsKey(c) || countMap.get(c) == 0) {
                return false;
            }
            // Decrement count
            countMap.put(c, countMap.get(c) - 1);
        }
        
        // Step 4: All characters matched
        return true;
    }
}
```

### index.python Implementation

```index.python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Step 1: Early exit if lengths differ
        if len(s) != len(t):
            return False

        # Step 2: Build frequency map for string s
        countMap = {}

        for c in s:
            countMap[c] = countMap.get(c, 0) + 1

        # Step 3: Verify with string t
        for c in t:
            # If character not in map or count is already 0
            if c not in countMap or countMap[c] == 0:
                return False

            # Decrement count
            countMap[c] -= 1

        # Step 4: All characters matched
        return True
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Let **N** be the number of characters in each word.
- We iterate through the first word once to count the frequency of each character, which takes **O(N)** time.
- Adding or updating a character count in the map takes **O(1)** time on average.
- We then iterate through the second word once to check and update the character counts, which also takes **O(N)** time.
- The total time for both passes is **O(N + N) = O(N)**.
- Since no sorting is involved, this approach is faster than sorting-based methods.
- Therefore, the overall time complexity is **O(N)**.

#### Space Complexity: O(K)

- The space complexity depends on the number of unique characters in the words.
- Let **K** be the number of distinct characters.
- The character frequency map can store up to **K** entries.
- For lowercase English letters, **K ≤ 26**, so the space usage is constant, or **O(1)**.
- In a general case where all characters are unique, **K = N**, leading to **O(N)** space.
- Therefore, the overall space complexity is **O(K)**.
- This is effectively **O(1)** for a fixed alphabet and **O(N)** in the worst case.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/valid-anagram---check-if-two-strings-are-anagrams-of-each-other)*
