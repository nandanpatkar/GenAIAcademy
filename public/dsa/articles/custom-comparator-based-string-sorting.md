# Custom Comparator Based String Sorting

> **Slug:** `custom-comparator-based-string-sorting`  
> **Published:** 2026-07-04T20:39:03.911Z  
> **Updated:** 2026-07-04T20:39:03.917Z  
> **Keywords:** Custom Comparator Based String Sorting, String, Custom based Sorting, Sorting  
> **Cover Image:** ![Custom Comparator Based String Sorting](6a496ed938cb2da009adbf1a)

**Description:** Learn how to sort strings using a custom alphabet order with comparator-based sorting, including intuition, explanation, and optimal solution.

---

## Problem Statement

Given the problem of sorting strings using a custom alphabetical order, you will have two main inputs:

1. An integer array of strings ***arr***, with each string made up of only lowercase English letters.
2. A string ***order***, representing a distinct permutation of the standard English alphabet to define a custom order.

The task is to sort the array ***arr*** based on this custom order dictated by ***order***. Each character's position in ***order*** determines its rank. The less its index in ***order***, the higher it ranks in this custom sorting process.

## Example 1

> [!NOTE]
> **INFO**
> **Input: **arr = ["apple", "banana", "cherry"], order = "zyxwvutsrqponmlkjihgfedcba"
> **Output:** cherry,banana,apple
> **Explanation:**Sorting in reverse lexicographical order.

## Example 2

> [!NOTE]
> **INFO**
> **Input:** arr = ["dog", "cat", "bat"], order = "abcdefghijklmnopqrstuvwxyz"
> **Output:** bat,cat,dog
> **Explanation:** Regular alphabetical order sorting.

## Example 3

> [!NOTE]
> **INFO**
> **Input: **arr = ["xyz", "yxz", "zxy"], order = "xyzabcdefghijklmnopqrstuvw"
> **Output:** xyz,yxz,zxy
> **Explanation: **Words are sorted based on order of 'x', 'y', 'z'.

## Constraints

- 1 <= **arr.length** <= 105
- 1 <=** arr[i].length** <= 100
- **arr[i] **consists of lowercase English letters.
- order is a valid permutation of the lowercase English alphabets.
- Time complexity should be O(n log n), where n is the number of strings in `arr`.

### Real-Life Analogy

Imagine you walk into a **fancy international hotel** that hosts guests from all around the world. Every country has its own language and its own alphabetical order. One evening, the hotel plans a **special dinner** where guests will be called to the dining hall **based on the alphabet order of their home country**, not the usual English A–Z.
To manage this, the hotel gives you a list of guest names (this is your `arr`). But these names must not be sorted using English alphabetical order. Instead, every country has submitted its **own custom alphabet** — maybe ‘q’ comes before ‘a’, maybe ‘z’ comes before ‘b’. This custom sequence is your `order`.

Before calling guests, the staff must understand the new order. So they create a small notepad where they write:

- The first letter in the custom alphabet gets rank 0
- The second letter gets rank 1
- The third letter gets rank 2
- …and so on

This notepad becomes the hotel’s **reference dictionary**. Now, as the staff prepares to announce guest names, they don’t look at the English alphabet at all. They compare names **based on the special ranking** given by the custom alphabet. If two names start with the same letter, they simply compare the next letter, still using the same special ranking. Guests with "earlier" letters in this custom alphabet get priority and are invited first. So in this hotel, you don’t sort names by the English ‘A comes before B’. You sort them by whatever sequence the country has declared, even if that order looks strange to you.

### Brute-Force Approach
Intuition

The brute force approach involves creating a custom comparison function that compares two strings character by character based on the custom order. For each comparison, we need to look up the position of each character in the `order`string to determine which character should come first. The basic idea is to manually compare each pair of strings during the sorting process. When comparing two strings, we examine them character by character from left to right. At each position, we find the index of both characters in the custom `order` string. The character with the smaller index comes first. If characters at a position are equal, we move to the next character. If one string is a prefix of another, the shorter string comes first.

To perform this comparison for every pair of strings in the array, we use a sorting algorithm (like quicksort or mergesort) with our custom comparator function. However, the inefficiency comes from the fact that for each character comparison, we perform a linear search through the `order` string using methods like `indexOf()`, which takes O(26) time in the worst case.

### Algorithm

1. To compare two strings using a custom alphabetical order, we begin by examining them from left to right, because the first differing character determines which string should appear earlier. Since the ordering is not standard English alphabetical order but a custom one provided through the `order` string, each character must be ranked based on its position within this custom order.
2. We first identify the minimum length of the two strings, because comparison can only continue as long as both strings have characters available at the same index. Then, for each position, we extract the corresponding characters from both strings and look up their priority by checking their index in the custom `order` string. The idea is simple: whichever character appears earlier in `order` is considered “smaller” and therefore that string should come first in the sorted list. If the character from the first string has a lower index in `order`, the first string is ranked ahead; if the second string’s character has a lower index, the second string should appear before it. Only when both characters share the same custom rank do we continue comparing the next position.
3. If, after checking all comparable positions, both strings are identical up to the length of the shorter one, then it becomes a prefix-based decision. In custom sorting (as in dictionary order), a shorter string always comes before a longer one if all matched characters are the same. So if one string ends earlier, it naturally becomes the “smaller” one. If both strings also share the same length, then they are completely identical under this custom ordering.
4. Finally, after defining this comparison behavior, we use this logic as the comparator inside a sorting function. The sorting algorithm repeatedly applies this custom character-ranking system so that the entire array gets reordered according to the user-defined alphabet. Once sorting completes, the array reflects the proper custom-ordered sequence.

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<string> customSortString(string order, vector<string>& arr) {

        auto customCompare = [&](const string &s1, const string &s2) -> bool {
            int minLen = min(s1.size(), s2.size());

            for (int i = 0; i < minLen; i++) {
                char c1 = s1[i];
                char c2 = s2[i];

                int index1 = order.find(c1);
                int index2 = order.find(c2);

                if (index1 < index2) return true;
                if (index1 > index2) return false;
            }

            return s1.size() < s2.size();
        };

        sort(arr.begin(), arr.end(), customCompare);
        return arr;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    public String[] customSortString(String order, String[] arr) {
        // Sort using custom comparator
        Arrays.sort(arr, new Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                return customCompare(s1, s2, order);
            }
        });
        
        return arr;
    }
    
    // Custom comparison function
    private int customCompare(String s1, String s2, String order) {
        int len1 = s1.length();
        int len2 = s2.length();
        int minLen = Math.min(len1, len2);
        
        // Compare character by character
        for (int i = 0; i < minLen; i++) {
            char c1 = s1.charAt(i);
            char c2 = s2.charAt(i);
            
            // Find indices in custom order (Linear search - O(26))
            int index1 = order.indexOf(c1);
            int index2 = order.indexOf(c2);
            
            // If indices are different, return comparison result
            if (index1 < index2) {
                return -1;  // s1 comes before s2
            } else if (index1 > index2) {
                return 1;   // s2 comes before s1
            }
            // If equal, continue to next character
        }
        
        // If all characters match, shorter string comes first
        return Integer.compare(len1, len2);
    }
}
```

### index.py Implementation

```index.py
from typing import List

class Solution:
    def customSortString(self, order: str, arr: List[str]) -> List[str]:

        def custom_compare(s1: str, s2: str) -> int:
            min_len = min(len(s1), len(s2))

            for i in range(min_len):
                c1 = s1[i]
                c2 = s2[i]

                index1 = order.index(c1)
                index2 = order.index(c2)

                if index1 < index2:
                    return -1
                elif index1 > index2:
                    return 1

            return len(s1) - len(s2)

        from functools import cmp_to_key
        arr.sort(key=cmp_to_key(custom_compare))
        return arr
```

### Complexity Analysis

#### Time Complexity: O(N × M × log N × K)

- The sorting process compares N strings using a typical sorting algorithm like quicksort or mergesort, which performs O(N log N) comparisons.
- Each comparison may examine up to M characters of the strings, and for each character, the comparator looks up its position in the custom order string, which takes O(K) time.
- With K being the length of the order string (at most 26), the total complexity becomes O(N × M × log N × K).
- Since K is small and constant, this simplifies to O(N × M × log N), reflecting the primary cost of string comparisons and sorting.

#### **Space Complexity: O(log N)**

- The space used depends on the sorting algorithm. In-place quicksort requires O(log N) stack space due to recursion, while merge sort requires O(N) additional space for temporary arrays.
- The comparator itself only uses a fixed number of variables and does not allocate additional memory proportional to input size.
- Therefore, the overall space complexity is determined mainly by the sorting process, resulting in O(log N) for recursive quicksort or O(N) for merge sort, keeping memory usage efficient for practical input sizes.

## Optimal Approach

### Intuition

The brute-force approach becomes slow because it repeatedly uses `indexOf()` to find a character’s position in the custom order. Each call scans the entire `order` string, taking O(K) time, and this cost is paid for every character comparison during sorting. The optimal solution removes this overhead by preprocessing the custom order and creating a direct mapping that stores each character’s rank. Since we only deal with lowercase English letters, an array based map is efficient and fast. With this mapping, every comparison becomes an O(1) lookup instead of a linear search, making the overall sorting process significantly faster and more scalable.

### Algorithm

1. We first build a `rankMap` array of size 26 because this lets us instantly know the priority of any character without scanning the `order` string repeatedly. By assigning each character its rank (and giving unseen characters a large rank), we prepare a constant-time lookup that removes the inefficiency of repeated `indexOf()` calls.
2. We compare two strings character by character because sorting depends on the relative order of their characters. At each position, we check the precomputed ranks. If the ranks differ, we immediately know which string should come first. This works in constant time due to the mapping.
3. We compare lengths only when all compared characters match because, in lexicographic ordering, if one string is a prefix of the other, the shorter one must appear first. This step ensures correctness for edge cases like `"app"` vs `"apple"`.
4. We apply the built-in sorting function because it efficiently reorders the array while relying on our custom comparator to enforce the custom alphabet rule.
5. We output the reordered list because the array is now fully sorted according to the given custom character order.

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<string> customSortString(string order, vector<string>& arr) {

        // Step 1: build rank map
        vector<int> rank(26, 26);

        for (int i = 0; i < order.size(); i++) {
            rank[order[i] - 'a'] = i;
        }

        // Step 2: custom sort
        sort(arr.begin(), arr.end(), [&](const string &s1, const string &s2) {
            int minLen = min(s1.size(), s2.size());

            for (int i = 0; i < minLen; i++) {
                int r1 = rank[s1[i] - 'a'];
                int r2 = rank[s2[i] - 'a'];

                if (r1 != r2) {
                    return r1 < r2;
                }
            }

            return s1.size() < s2.size();
        });

        return arr;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    public String[] customSortString(String order, String[] arr) {
        // Step 1: Build rank mapping for O(1) lookups
        int[] rankMap = new int[26];
        
        // Initialize all characters with high rank (not in custom order)
        Arrays.fill(rankMap, 26);
        
        // Assign ranks based on custom order
        for (int i = 0; i < order.length(); i++) {
            rankMap[order.charAt(i) - 'a'] = i;
        }
        
        // Step 2: Sort using custom comparator with rank map
        Arrays.sort(arr, (s1, s2) -> {
            int minLen = Math.min(s1.length(), s2.length());
            
            // Compare character by character using O(1) lookups
            for (int i = 0; i < minLen; i++) {
                int rank1 = rankMap[s1.charAt(i) - 'a'];
                int rank2 = rankMap[s2.charAt(i) - 'a'];
                
                if (rank1 != rank2) {
                    return rank1 - rank2;
                }
            }
            
            // If all characters match, shorter string comes first
            return s1.length() - s2.length();
        });
        
        return arr;
    }
}
```

### index.py Implementation

```index.py
from typing import List

class Solution:
    def customSortString(self, order: str, arr: List[str]) -> List[str]:
        # Step 1: Build rank map
        rank = {c: i for i, c in enumerate(order)}

        # characters not in order (if any) get high rank
        def get_rank(c: str) -> int:
            return rank.get(c, 26)

        from functools import cmp_to_key

        def compare(s1: str, s2: str) -> int:
            min_len = min(len(s1), len(s2))

            for i in range(min_len):
                r1 = get_rank(s1[i])
                r2 = get_rank(s2[i])

                if r1 != r2:
                    return r1 - r2

            return len(s1) - len(s2)

        arr.sort(key=cmp_to_key(compare))
        return arr
```

### Complexity Analysis

#### Time Complexity: O(n x L x log n)

- Building the rank map takes **O(1)** time since the alphabet size is fixed (26 characters).
- Sorting takes **O(n log n)** comparisons for **n** strings.
- Each comparison may check up to **L characters**, and each check is **O(1)** using the rank map.
- So, each comparison costs **O(L)** time.
- Overall, **O(n x log n × L)** where **n = number of strings, L = maximum string length**.

#### Space Complexity: O(1)

- The algorithm uses a fixed-size **rankMap** (or hash map) for storing character ranks, which has size **26**.
- This does not change with input size, so it is **constant space**.
- The sorting uses only a few local variables in the comparator and no extra data structures proportional to `n`.
- Any additional memory used by the sorting algorithm itself is not part of the algorithm’s auxiliary space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/custom-comparator-based-string-sorting)*
