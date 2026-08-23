# Find and Replace Pattern in Strings

> **Slug:** `find-and-replace-pattern-in-strings`  
> **Published:** 2026-07-04T20:23:34.617Z  
> **Updated:** 2026-07-04T20:23:34.623Z  
> **Keywords:** Find and Replace Pattern in Strings, Pattern in Strings, Replace Pattern  
> **Cover Image:** ![Find and Replace Pattern in Strings](6a4969b238cb2da009adbedb)

**Description:** Learn how to find words matching a given pattern using bijection and normalization, with clear examples, intuition, and step-by-step explanation.

---

## Problem Statement

Given a list of strings ***words*** and a string ***pattern***, find and return the list of **all words**from the given list that match the pattern. A word matches the pattern if there exists a permutation of letters in the word such that it matches the pattern. In other words, for a word to match the pattern, a bijection must exist between letters in the pattern and letters in the word.

## Example 1

> [!NOTE]
> **INFO**
> **Input: **words = ["abc", "deq", "mee", "aqq", "dkd", "ccc"] pattern = "abb"
> **Output:** ["mee", "aqq"]
> **Explanation:** 
> 
> - "mee" maps to "abb" as m->a, e->b.
> - "aqq" maps to "abb" as a->a, q->b.
> - "abc", "deq", "dkd", "ccc" do not satisfy the condition.

## Example 2

> [!NOTE]
> **INFO**
> **Input:** words = ["aaa", "bbb", "ccc", "ddd"], pattern = "aaa"
> **Output:** aaa,bbb,ccc,ddd
> **Explanation:** All words consist of repeating letters, just like "aaa".

## Constraints

- 1 <= **words.length** <= 50
- 1 <= **pattern.length** = words[i].length <= 20
- **words[i] **and **pattern** consist of only lowercase English letters.

### Real-Life Analogy

Imagine you're a cryptographer working for an intelligence agency. Your team has intercepted several encrypted messages, and you have a decoder pattern that reveals the structure of valid messages. The pattern is like a template that shows which characters should repeat and where. For example, if your pattern is "ABBA", you're looking for messages that follow the same structure: first character unique, second character unique but different from the first, third character same as the second, and fourth character same as the first.

Think of it like a secret code where:

- Pattern "abb" means: "one letter, then a different letter that repeats"
- A message "mee" fits because: 'm' is alone, then 'e' repeats
- But "abc" doesn't fit because all three letters are different

Another way to think about it: imagine you're a music teacher analyzing rhythm patterns. The pattern "abb" represents: one beat, then two beats of the same type. Songs with patterns like "mee" (one clap, two stomps) or "aqq" (one snap, two claps) match, but "abc" (clap, stomp, snap - all different) doesn't match.

The key insight is that you're not matching the actual letters themselves, but rather the **pattern of repetition and uniqueness**. It's like recognizing that "hello" and "chess" have different patterns: "hello" has structure "abccd" (two pairs with 'l' repeating and 'o' at the end), while "chess" has structure "abcdd" (one pair at the end with 's' repeating).

Your job is to scan through intercepted messages and identify which ones follow the same structural pattern as your decoder template, regardless of what actual letters they use.

## Brute-Force Approach

### Intuition

The brute-force approach checks each word individually to determine whether it matches the structure of the given pattern. To do this, we create two hash maps: one that maps characters from the pattern to characters in the word, and another that maps characters from the word back to the pattern. This ensures a bijection, meaning every pattern character consistently maps to exactly one word character and vice versa.

We traverse both strings together, comparing characters at each position. If a pattern character has appeared before, we verify that it maps to the same word character as earlier. If not, the word is invalid. Likewise, if the current word character has already been mapped, we confirm that it maps back to the same pattern character. Any mismatch in either direction immediately disqualifies the word.

If the entire traversal maintains consistent mappings, the word matches the pattern. This process is repeated for every word, and all valid matches are collected. 

### Algorithm

1. Firstly,  We start by creating an empty result list. We need a place to collect all words that follow the pattern, so we initialize an empty list where valid matches will be stored.
2. We process each word independently because every word must be evaluated against the pattern to determine whether it follows the same structural mapping.
3. We separate this logic for clarity. The function immediately returns false if the lengths differ, because mismatched lengths can never form a valid mapping.
4. We create `patternToWord` and `wordToPattern` maps because bijection must hold in both directions: each pattern character must map to only one word character, and each word character must map back to only one pattern character.
5. At each index, we compare characters from the pattern and word. If a pattern character has appeared before, it must map to the same word character; otherwise, the mapping breaks. Likewise, the word character must map back to the same pattern character. These checks ensure consistent one-to-one relationships.
6. If the full traversal completes without mapping inconsistencies, the word structurally matches the pattern and is added to the result list.
7. After checking all words, we return the list containing only those that follow the given pattern.

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<string> findAndReplacePattern(vector<string>& words, string pattern) {
        vector<string> result;

        for (auto &word : words) {
            if (matchesPattern(word, pattern)) {
                result.push_back(word);
            }
        }

        return result;
    }

private:
    bool matchesPattern(const string &word, const string &pattern) {
        if (word.size() != pattern.size()) {
            return false;
        }

        unordered_map<char, char> patternToWord;
        unordered_map<char, char> wordToPattern;

        for (int i = 0; i < pattern.size(); i++) {
            char pChar = pattern[i];
            char wChar = word[i];

            if (patternToWord.count(pChar)) {
                if (patternToWord[pChar] != wChar) {
                    return false;
                }
            } else {
                patternToWord[pChar] = wChar;
            }

            if (wordToPattern.count(wChar)) {
                if (wordToPattern[wChar] != pChar) {
                    return false;
                }
            } else {
                wordToPattern[wChar] = pChar;
            }
        }

        return true;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        List<String> result = new ArrayList<>();
        
        // Check each word against the pattern
        for (String word : words) {
            if (matchesPattern(word, pattern)) {
                result.add(word);
            }
        }
        
        return result;
    }
    
    // Helper function to check if word matches pattern
    private boolean matchesPattern(String word, String pattern) {
        // Length must be equal
        if (word.length() != pattern.length()) {
            return false;
        }
        
        // Two hash maps for bijection
        Map<Character, Character> patternToWord = new HashMap<>();
        Map<Character, Character> wordToPattern = new HashMap<>();
        
        // Check character by character
        for (int i = 0; i < pattern.length(); i++) {
            char pChar = pattern.charAt(i);
            char wChar = word.charAt(i);
            
            // Check pattern → word mapping
            if (patternToWord.containsKey(pChar)) {
                if (patternToWord.get(pChar) != wChar) {
                    return false; // Inconsistent mapping
                }
            } else {
                patternToWord.put(pChar, wChar);
            }
            
            // Check word → pattern mapping (for bijection)
            if (wordToPattern.containsKey(wChar)) {
                if (wordToPattern.get(wChar) != pChar) {
                    return false; // Breaks bijection
                }
            } else {
                wordToPattern.put(wChar, pChar);
            }
        }
        
        return true; // Word matches pattern
    }
}
```

### index.py Implementation

```index.py
from typing import List

class Solution:
    def findAndReplacePattern(self, words: List[str], pattern: str) -> List[str]:
        result = []

        for word in words:
            if self.matchesPattern(word, pattern):
                result.append(word)

        return result

    def matchesPattern(self, word: str, pattern: str) -> bool:
        if len(word) != len(pattern):
            return False

        pattern_to_word = {}
        word_to_pattern = {}

        for p_char, w_char in zip(pattern, word):

            if p_char in pattern_to_word:
                if pattern_to_word[p_char] != w_char:
                    return False
            else:
                pattern_to_word[p_char] = w_char

            if w_char in word_to_pattern:
                if word_to_pattern[w_char] != p_char:
                    return False
            else:
                word_to_pattern[w_char] = p_char

        return True
```

### Complexity Analysis

#### Time Complexity: O(N × M)

- The algorithm takes **O(N × M)** time. We iterate through each of the **N** words, and for every word we run the `matchesPattern` check.
- This check compares characters one by one across the **M** positions of the word and the pattern.
- Each comparison involves constant-time hash-map lookups and insertions, so processing one word costs **O(M)**.
- Multiplying this by all **N** words results in a total time complexity of **O(N × M)**.
- No additional costly operations are performed, and the nested nature of checking every character of every word dominates the runtime.

#### **Space Complexity: O(M)**

- The space complexity is **O(M)** when considering only auxiliary space.
- For each word, we create two hash maps: one for mapping pattern → word characters and one for word → pattern characters.
- In the worst case, each map holds **M** entries, giving **O(M)** space per check.
- These maps are recreated for each word, so space does not accumulate. If we include output space, the result list may store up to **N** matching words, each of length **M**, making total storage **O(N × M)**.
- But purely auxiliary space remains **O(M)**.

## Optimal Approach

### Intuition

The optimal approach uses **pattern normalization** to simplify matching. Instead of checking each word with hash maps, we convert both the pattern and the word into a canonical form that represents their structural pattern. Each unique character is assigned a sequential number based on its first appearance, and repeated characters reuse the same number. For example, `"abb"` → `[0,1,1]` and `"mee"` → `[0,1,1]`, showing the same structure, while `"abc"` → `[0,1,2]`. By comparing these normalized forms, we can determine pattern matches directly, eliminating hash maps and making the solution simpler, cleaner, and more efficient.

### Algorithm

1. We first convert the given pattern into its canonical normalized form, where each unique character is replaced by a sequential index based on its first appearance. This gives a representation of the pattern’s structure, which we can later compare with words.
2. We create a function that takes any string and outputs its normalized form. For each character, if it hasn’t been seen before, we assign the next available index. Repeated characters reuse their existing index. This ensures words with the same structural pattern produce identical normalized lists.
3. We prepare an empty list to store all words that match the pattern. As for every word, we normalize it using the function and compare it with the precomputed normalized pattern. If they match, we add the word to the result list.
4. After processing all words, the list contains only those that follow the same structural pattern as the input pattern.

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> normalize(string s) {
        unordered_map<char, int> charToIndex;
        vector<int> normalized;
        int index = 0;

        for (char c : s) {
            if (charToIndex.find(c) == charToIndex.end()) {
                charToIndex[c] = index;
                index++;
            }
            normalized.push_back(charToIndex[c]);
        }

        return normalized;
    }

    vector<string> findAndReplacePattern(vector<string>& words, string pattern) {
        vector<string> result;

        vector<int> normalizedPattern = normalize(pattern);

        for (string &word : words) {
            if (normalize(word) == normalizedPattern) {
                result.push_back(word);
            }
        }

        return result;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        List<String> result = new ArrayList<>();
        
        // Normalize the pattern once
        List<Integer> normalizedPattern = normalize(pattern);
        
        // Check each word
        for (String word : words) {
            List<Integer> normalizedWord = normalize(word);
            
            // Compare normalized forms
            if (normalizedWord.equals(normalizedPattern)) {
                result.add(word);
            }
        }
        
        return result;
    }
    
    // Normalize a string to its pattern form
    private List<Integer> normalize(String s) {
        Map<Character, Integer> charToIndex = new HashMap<>();
        List<Integer> normalized = new ArrayList<>();
        int index = 0;
        
        for (char c : s.toCharArray()) {
            // If character seen for first time, assign new index
            if (!charToIndex.containsKey(c)) {
                charToIndex.put(c, index);
                index++;
            }
            
            // Add the index to normalized form
            normalized.add(charToIndex.get(c));
        }
        
        return normalized;
    }
}
```

### index.py Implementation

```index.py
from typing import List

class Solution:
    def findAndReplacePattern(self, words: List[str], pattern: str) -> List[str]:
        def normalize(s: str):
            char_to_index = {}
            normalized = []
            index = 0

            for c in s:
                if c not in char_to_index:
                    char_to_index[c] = index
                    index += 1
                normalized.append(char_to_index[c])

            return normalized

        normalized_pattern = normalize(pattern)
        result = []

        for word in words:
            if normalize(word) == normalized_pattern:
                result.append(word)

        return result
```

### Complexity Analysis

#### Time Complexity: O(N x M)

- The algorithm first normalizes the pattern, which takes O(M) time, where M is the length of the pattern.
- Then, for each of the N words in the list, we normalize the word as well. The normalization process scans all M characters of the word, assigning indices in a hash map and appending them to a list.
- Both hash map operations (lookup and insert) run in O(1) on average.
- Comparing the normalized word with the normalized pattern also takes O(M).
- Therefore, for N words, the total time complexity is **O(N × M)**, dominated by scanning each character of each word.

#### Space Complexity: O(M)

- For each normalization, we use a hash map and a list of size up to M to store character-to-index mappings and the normalized form.
- These are recreated for every word, so the auxiliary space at any time is **O(M)**.
- The result list stores matching words; if output space is counted, it could require O(N × M).
- Excluding output, the working space is **O(M)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/find-and-replace-pattern-in-strings)*
