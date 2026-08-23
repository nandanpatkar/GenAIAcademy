# Isomorphic Strings

> **Slug:** `isomorphic-strings`  
> **Published:** 2026-07-05T13:20:15.514Z  
> **Updated:** 2026-07-05T13:20:15.548Z  
> **Keywords:** None  
> **Cover Image:** ![Isomorphic Strings](6a4a528538cb2da009adc122)

**Description:** Learn how to check if two strings are isomorphic using efficient mapping techniques. Maintain one-to-one character with examples and complexity.

---

## Problem Statement

Given two strings, **s** and **t**, your task is to determine if they are isomorphic. Two strings are considered isomorphic if each character in string **s** can be mapped to exactly one character in string **t**, maintaining the order of characters.

For instance, consider the strings **s = "egg"** and **t = "add"**. These strings can be transformed to one another by mapping 'e' to 'a', and 'g' to 'd', maintaining their respective orders. Thus, these strings are isomorphic.

In contrast, consider **s = "foo"** and **t = "bar"**. These strings are not isomorphic, as the character 'o' in **s** would have to map to both 'a' and 'r' in **t**, which would violate the one-to-one correspondence requirement.

Your task is to implement a function that verifies whether the given strings are isomorphic, returning *true* if they are and *false* otherwise.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** s = 'egg', t = 'add'
> **Output:** true
> **Explanation: **Mapping 'e' to 'a' and 'g' to 'd' makes the strings isomorphic.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** s = 'foo', t = 'bar'
> **Output:** false
> **Explanation:** Character 'o' would have to map to both 'a' and 'r', which is not allowed.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** s = 'paper', t = 'title'
> 
> **Output: **true
> 
> **Explanation: **Mapping 'p' to 't', 'a' to 'i', 'e' to 'l', and 'r' to 'e' makes the strings isomorphic.

### Constraints

- 1 <= **s.length, t.length** <= 5 * 10^4
- **s** and **t** consist of any valid **ASCII** character.

## Real-Life Analogy

Think of the two strings as two secret messages intercepted by a spy. The first message, ***s***, is written in an unfamiliar language, and the second message, ***t***, might be its translation using a secret cipher. Your job is to figure out whether the same decoding rule was used throughout the message.

In a proper secret cipher, every symbol in the original message must always translate to one specific symbol in the coded message, and this rule cannot change halfway. For example, if the symbol `'e'` in message *s* is translated to `'a'` in message *t*, then every `'e'` that appears later must also become `'a'`. Similarly, no two different symbols in *s* can translate to the same symbol in *t*—otherwise the spy wouldn’t be able to decode it uniquely.

If the entire message follows a clean, consistent one-to-one mapping between characters, then the two strings are considered *isomorphic*. It means the translation could realistically be produced by a reliable cipher. But if even one character breaks this pattern—like mapping to different letters at different times—then the messages cannot come from the same secret code, and they are not isomorphic.

In simple terms, isomorphic strings behave like two messages created using a trustworthy spy cipher: consistent, one-to-one, and predictable.

## Brute-Force Approach

### Intuition

To determine whether two strings are isomorphic, we need to ensure that their characters follow a consistent one-to-one relationship. The simplest and most reliable way to do this is by maintaining **two mappings**: one that maps characters from the first string (`s`) to characters in the second string (`t`), and another that maps characters from `t` back to `s`.

As we walk through both strings at the same time, we verify these relationships. If a character in `s` has appeared before, it must always map to the *same* character in `t`. Similarly, if a character in `t` has appeared before, it must always come from the *same* character in `s`. If at any point these expectations fail—meaning a character tries to map to a different partner—the strings violate the one-to-one pattern and are not isomorphic.

This dual-mapping method ensures that every character is consistently paired, preventing conflicts like two characters from mapping to the same target or a character mapping differently later in the string.

### Algorithm

1. We **check** the **length**. First, make sure both words have the same **number of characters**. If they don’t, they can’t match one-to-one, so stop and say “not isomorphic.”
2. Now, we **create two mapping boxes**, imagine two small lookup boxes, one that remembers which character from the first word maps to which character in the second (`s → t`), and another that remembers the reverse (`t → s`). These two boxes help enforce a strict one-to-one relationship.
3. We go through **both words together**. Look at the characters in both words at the **same** **position**, one pair at a time:

- - Let the current characters be `a` from the first word and `b` from the second.
  - Check the first box (`s → t`):
  - - If `a` is already recorded, it must be recorded as mapping to `b`. If it maps to something else, stop the pattern is broken.
    - If `a` is not recorded yet, remember `a → b` by putting it in the first box.
  - Check the second box (`t → s`) the same way:
  - If `b` is already recorded there, it must map back to `a`. If it maps to a different character, stop  that violates one-to-one.
  - If `b` is not recorded yet, remember `b → a` in the second box.

**Repeat** this for every pair of characters. If you never find a conflict, the pairing has been consistent all the way through.

1. ** **At last, we **return** the result as if we finish checking every position without any conflicting mappings, the two words follow a consistent one-to-one mapping they are **isomorphic**. If we found any conflict at any point, they are **not isomorphic**.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "egg"`, `t = "add"`
> **Initial State:**
> `mapStoT = {}`
> `mapTtoS = {}`
> 
> **Iteration i = 0:**
> charS = 'e', charT = 'a'
> Check mapStoT:
>   `'e' not in map → Add: mapStoT = {'e':'a'}`
> Check mapTtoS:
> `  'a' not in map → Add: mapTtoS = {'a':'e'}`
> 
> **Iteration i = 1:**
> charS = 'g', charT = 'd'
> Check mapStoT:
> `'g' not in map → Add: mapStoT = {'e':'a', 'g':'d'}`
> Check mapTtoS:
> `'d' not in map → Add: mapTtoS = {'a':'e', 'd':'g'}`
> 
> 
> **Iteration i = 2:**
> charS = 'g', charT = 'd'
> Check mapStoT:
>   `'g' in map → mapStoT.get('g') = 'd' ✓ Matches charT = 'd'`
> Check mapTtoS:
>   `'d' in map → mapTtoS.get('d') = 'g' ✓ Matches charS = 'g'`
> ***No conflicts!***
> 
> **Final Maps:**
> 
> mapStoT = {'e':'a', 'g':'d'}
> `mapTtoS = {'a':'e', 'd':'g'}`
> 
> **Output:** `true`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    bool isIsomorphic(string s, string t) {
        // Step 1: Check if lengths are equal
        if (s.length() != t.length()) {
            return false;
        }

        // Step 2: Create two hash maps for bidirectional mapping
        unordered_map<char, char> mapStoT;
        unordered_map<char, char> mapTtoS;

        // Step 3: Iterate through both strings
        for (int i = 0; i < s.length(); i++) {
            char charS = s[i];
            char charT = t[i];

            // Check mapping from S to T
            if (mapStoT.count(charS)) {
                if (mapStoT[charS] != charT) {
                    return false; // Inconsistent mapping
                }
            } else {
                mapStoT[charS] = charT;
            }

            // Check mapping from T to S
            if (mapTtoS.count(charT)) {
                if (mapTtoS[charT] != charS) {
                    return false; // Two different chars map to same char
                }
            } else {
                mapTtoS[charT] = charS;
            }
        }

        // Step 4: All characters mapped consistently
        return true;
    }
};
```

### Java Implementation

```java
class Solution {
    public boolean isIsomorphic(String s, String t) {
        // Step 1: Check if lengths are equal
        if (s.length() != t.length()) {
            return false;
        }
        
        // Step 2: Create two HashMaps for bidirectional mapping
        Map<Character, Character> mapStoT = new HashMap<>();
        Map<Character, Character> mapTtoS = new HashMap<>();
        
        // Step 3: Iterate through both strings
        for (int i = 0; i < s.length(); i++) {
            char charS = s.charAt(i);
            char charT = t.charAt(i);
            
            // Check mapping from S to T
            if (mapStoT.containsKey(charS)) {
                if (mapStoT.get(charS) != charT) {
                    return false; // Inconsistent mapping
                }
            } else {
                mapStoT.put(charS, charT);
            }
            
            // Check mapping from T to S (ensures one-to-one)
            if (mapTtoS.containsKey(charT)) {
                if (mapTtoS.get(charT) != charS) {
                    return false; // Two different chars in s map to same char in t
                }
            } else {
                mapTtoS.put(charT, charS);
            }
        }
        
        // Step 4: All characters mapped consistently
        return true;
    }
}
```

### Python Implementation

```python
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        # Step 1: Check if lengths are equal
        if len(s) != len(t):
            return False

        # Step 2: Create two dictionaries for bidirectional mapping
        mapStoT = {}
        mapTtoS = {}

        # Step 3: Iterate through both strings
        for i in range(len(s)):
            charS = s[i]
            charT = t[i]

            # Check mapping from S to T
            if charS in mapStoT:
                if mapStoT[charS] != charT:
                    return False  # Inconsistent mapping
            else:
                mapStoT[charS] = charT

            # Check mapping from T to S
            if charT in mapTtoS:
                if mapTtoS[charT] != charS:
                    return False  # Two different chars map to same char
            else:
                mapTtoS[charT] = charS

        # Step 4: All characters mapped consistently
        return True
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Each character of both strings is traversed **only once** from start to end.
- There are **no repeated passes**, so the total time depends directly on the lengths of the strings.
- Checking and storing character relationships occur in **constant time O(1)** on average.
- Since each character is processed just once, the total time grows linearly with the string lengths.
- Therefore, the overall **time complexity is O(N)**.

#### Space Complexity: O(K) or O(1)

- The algorithm tracks how characters from one string map to characters in the other string.
- These character relationships are **stored**, which requires extra space.
- The space needed depends on the number of **unique characters** in the strings.
- If all characters are unique, more space is used; if characters repeat, less space is needed.
- Let **K** be the number of unique characters, giving a space complexity of **O(K)**.
- In cases where the character set is fixed and small (e.g., ASCII), the space can be considered **O(1)** constant.

## Optimal Approach

### Intuition

Instead of keeping two full maps to track how characters connect between the two strings, we can make the idea even simpler.

We keep one place to remember **which character from the first string is matched with which character in the second string**.
And we keep another small list just to note **which characters in the second string are already taken** so that no two characters from the first string try to share the same partner.

This way:

- Every character in the first string always goes back to the same character in the second string.
- No character in the second string gets matched with more than one character from the first string.

With this setup, the match between the two strings stays clean, consistent, and unconfused , giving us the most efficient way to check if they are isomorphic.

### Algorithm

1. We **check the length** of the **strings**. If the lengths differ, a one-to-one **mapping** is impossible because one word would have extra characters. So we immediately return **false**.
2. Instead of using two full mapping tables, we simplify:

- A **HashMap** to record how each character in `s` should translate to a character in `t`.
- A **HashSet** to keep track of which characters in `t` are already used in a mapping.

Because  The map ensures **consistency**, a character in `s` must always map to the same character in `t`. The set ensures **uniqueness**, no two characters from `s` map to the same character in `t`. This combination gives the same guarantees as two maps but with slightly less space.

1. We now walk through **both** **strings** together, checking the pair at each position: Let the characters be:`charS` from string `s` and `charT` from string `t`

We now enforce the two rules: first rule is consistent mapping (s → t). If `charS` is already in the map:

- It must map to the same `charT` as before.
- If the stored mapping is different, the pattern breaks → return **false**. This ensures the mapping is stable. 

Now the second rule we follow is no two letters in `s` map to the same letter in `t`. If `charS` has never been mapped before:
- We must check that `charT` is not already taken by some other character.
- If it is already in the set, this violates one-to-one mapping, return **false**.
- If not, we safely create a new mapping (`charS → charT`) and mark `charT` as used. This ensures the mapping is **one-to-one**.

We repeat this for every character pair.

1. If we reach the end **without finding any conflicting mappings**. Every character from `s` maps properly and uniquely to `t`. Therefore, the two strings follow a valid one-to-one pattern. At last, we **return** **true**.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "egg"`, `t = "add"`
> 
> **Step 1: Check Lengths**
> 
> s.length() = 3
> t.length() = 3
> `Lengths match ✓`
> 
> **Step 2: Initialize Data Structures**
> 
> map = {}
> `mappedChars = {}`
> 
> **Iteration i = 0:**
> 
> charS = 'e', charT = 'a'
> 
> Check: map.containsKey('e') → false
>   → charS is not mapped yet
>   
> Check: mappedChars.contains('a') → false
>   → charT is not used yet
>   
> Action:
>   map.put('e', 'a') → map = {'e':'a'}
> `  mappedChars.add('a') → mappedChars = {'a'}`
> 
> **State After Iteration 0:**
> 
> map = {'e':'a'}
> `mappedChars = {'a'}`
> 
> **Iteration i = 1:**
> 
> charS = 'g', charT = 'd'
> 
> Check: map.containsKey('g') → false
>   → charS is not mapped yet
>   
> Check: mappedChars.contains('d') → false
>   → charT is not used yet
>   
> Action:
>   map.put('g', 'd') → map = {'e':'a', 'g':'d'}
> `  mappedChars.add('d') → mappedChars = {'a', 'd'}`
> 
> **State After Iteration 1:**
> 
> map = {'e':'a', 'g':'d'}
> `mappedChars = {'a', 'd'}`
> 
> **Iteration i = 2:**
> 
> charS = 'g', charT = 'd'
> 
> Check: map.containsKey('g') → true ✓
>   → charS is already mapped
>   
> Check Consistency: map.get('g') == 'd'
>   → 'd' == 'd' ✓ Consistent!
>   
> `Action: None (mapping already exists and is consistent)`
> 
> **Final State:**
> 
> map = {'e':'a', 'g':'d'}
> `mappedChars = {'a', 'd'}`
> 
> **Step 4: Return true**
> 
> **Output:** `true`

### Code

### C++ Implementation

```cpp
#include <string>
#include <unordered_map>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool isIsomorphic(string s, string t) {
        // Step 1: Check lengths
        if (s.length() != t.length()) {
            return false;
        }

        // Step 2: Create map and set
        unordered_map<char, char> mp;
        unordered_set<char> used;

        // Step 3: Iterate through strings
        for (int i = 0; i < s.length(); i++) {
            char charS = s[i];
            char charT = t[i];

            if (mp.count(charS)) {
                // charS already mapped, check consistency
                if (mp[charS] != charT) {
                    return false;
                }
            } else {
                // Check if charT is already used
                if (used.count(charT)) {
                    return false;
                }

                // Create new mapping
                mp[charS] = charT;
                used.insert(charT);
            }
        }

        // Step 4: All mappings are valid
        return true;
    }
};
```

### Java Implementation

```java
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

class Solution {
    public boolean isIsomorphic(String s, String t) {
        // Step 1: Check lengths
        if (s.length() != t.length()) {
            return false;
        }
        
        // Step 2: Create map and set
        Map<Character, Character> map = new HashMap<>();
        Set<Character> mappedChars = new HashSet<>();
        
        // Step 3: Iterate through strings
        for (int i = 0; i < s.length(); i++) {
            char charS = s.charAt(i);
            char charT = t.charAt(i);
            
            if (map.containsKey(charS)) {
                // charS is already mapped, check consistency
                if (map.get(charS) != charT) {
                    return false;
                }
            } else {
                // charS is not mapped yet
                // Check if charT is already used
                if (mappedChars.contains(charT)) {
                    return false; // charT already mapped to a different char
                }
                
                // Create new mapping
                map.put(charS, charT);
                mappedChars.add(charT);
            }
        }
        
        // Step 4: All mappings are valid
        return true;
    }
}
```

### Python Implementation

```python
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        # Step 1: Check lengths
        if len(s) != len(t):
            return False

        # Step 2: Create map and set
        mapping = {}
        used = set()

        # Step 3: Iterate through strings
        for char_s, char_t in zip(s, t):

            if char_s in mapping:
                # char_s already mapped, check consistency
                if mapping[char_s] != char_t:
                    return False
            else:
                # Check if char_t is already used
                if char_t in used:
                    return False

                # Create new mapping
                mapping[char_s] = char_t
                used.add(char_t)

        # Step 4: All mappings are valid
        return True
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm traverses the strings **once from left to right**.
- At each position, a few quick operations are performed using a **HashMap** and **HashSet**.
- Operations like **key lookup** or **insertion** take **constant time O(1)** on average.
- Every character is processed **exactly once**.
- Therefore, the total time grows linearly with the length of the strings.
- The overall **time complexity is O(N)**, where **N** is the number of characters in the strings.

#### Space Complexity: O(K) or O(1)

- The algorithm stores the mapping from characters in **s** to characters in **t** using a **HashMap**.
- It also tracks which characters in **t** are already used with a **HashSet**.
- Both data structures grow **only with the number of unique characters**, not the total string length.
- Let **K** be the number of distinct characters in the strings.
- The total extra space used is proportional to **K**.
- Therefore, the **space complexity is O(K)**.
- In cases where the character set is fixed and small (e.g., ASCII), the space can be considered **O(1)** constant.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/isomorphic-strings)*
