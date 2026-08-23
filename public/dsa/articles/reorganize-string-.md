# Reorganize String 

> **Slug:** `reorganize-string-`  
> **Published:** 2026-07-03T19:39:38.440Z  
> **Updated:** 2026-07-03T19:39:38.448Z  
> **Keywords:** None  
> **Cover Image:** ![Reorganize String ](https://cdn.codehelp.in/media/reoganise string.png)

**Description:** Rearrange a string so no two adjacent characters are the same. Learn greedy frequency-based logic with examples, edge cases, and complexity analysis.

---

## Problem Statement

Given a string ***s***, your task is to rearrange its characters such that no two adjacent characters are the same. If it is impossible to rearrange the string to meet these conditions, return an **empty string *****""***.

The goal is to ensure that no two adjacent characters are identical once the rearrangement is done.

### Example 1

> [!NOTE]
> **INFO**
> **Input:s = "aab"**
> **Output:** **"aba"**
> **Explanation: ** Original: "aab" has two 'a's adjacent. Rearranged: "aba" has no adjacent duplicates.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** **s = "aaab"**
> **Output:** **""**
> **Explanation:**  We have 3 'a's and 1 'b'. To avoid adjacent 'a's, we need: a_a_a_.We only have 1 'b' to fill 2 gaps. Hence, Impossible to rearrange.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** **s = "aabbcc"**
> 
> **Output: "abcabc"**
> 
> **Explanation: **The frequency of each character is balanced. In **"abcabc"**, **no two adjacent characters are the same**: a b c a b c

### Constraints

- 1 <= **s.length** <= 500
- **s **consists of **lowercase** English letters only.

## Real-Life Analogy

Imagine you’re throwing the ultimate **kids’ birthday party**, and you have to arrange everyone around the big party table. Some kids are easy-going they laugh, play, and get along with everyone. But here’s the catch: some kids are **too similar**. They have the same wild energy, love the same toy, and even make the same jokes. If two of them sit next to each other, a small argument can quickly turn into a full-blown **birthday chaos**—balloons fly, cake gets smushed, and suddenly the party turns into a battlefield.

Your mission? **Seat all the kids so no two “similar” ones sit side by side.**

- If the kids are fairly balanced—like a mix of **hyper, quiet, funny, and shy**—you can create a smooth rotation: **hyper kid, quiet kid, funny kid, shy kid, hyper kid…** and voilà! Everyone’s happy, the energy flows, and the party stays peaceful.
- But imagine a scenario where **10 hyper kids show up**, while all the other types come in just 2 or 3. No matter how you arrange the chairs, some hyper kids **will inevitably sit together**. Chaos is unavoidable, and no clever seating plan can save this party.

In this story:

- The **kids** = characters in a string
- **Similar kids** = identical characters
- **Peaceful seating** = a reorganized string with no adjacent duplicates
- **Impossible seating** = a character appears too many times to avoid being next to itself

So, the Reorganize String problem is basically just you being the party planner trying to **keep the birthday table drama-free**. Think of it as the ultimate puzzle: mix, match, and keep everyone smiling! 

## Brute-Force Approach

### Intuition

One straightforward way to think about this problem is to imagine trying out **every possible arrangement** of the characters in the string. We create all the different orders in which the characters can appear, one after another. Then we examine each arrangement and check whether any two identical characters end up next to each other. If we find an arrangement that avoids such clashes, we return it.
If we go through all possibilities and none of them works, we return an empty string.

This idea is easy to understand because it relies on checking every option rather than making any clever choices.
But the number of arrangements grows extremely fast as the string gets longer, making this approach impractical for anything beyond very small inputs.

It helps build an initial understanding of the problem, but it’s far too slow to use in real applications.

### Algorithm

1. Firstly, we begin by **generating every possible permutation** of the given **string**. Once all these different arrangements are available, we look at them one by one.
2. For each arrangement, we **scan** through the **characters** to see whether any **two** **identical** characters appear next to each other.
3. After this, If we **find such a pair**, we simply move on to the **next arrangement**. If we come across an arrangement where no adjacent characters are the same, we immediately return that arrangement as the answer.
4. After checking all the permutations, if none of them satisfies the condition, then we **conclude** that **no valid arrangement exists** and **return** an empty string.

### Dry Run



### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string reorganizeString(string s) {
        vector<string> permutations;
        generatePermutations(s, 0, permutations);

        for (string &perm : permutations) {
            if (isValid(perm)) {
                return perm;
            }
        }

        return "";
    }

private:
    void generatePermutations(string &s, int index, vector<string> &result) {
        if (index == s.size()) {
            result.push_back(s);
            return;
        }

        for (int i = index; i < s.size(); i++) {
            swap(s[i], s[index]);
            generatePermutations(s, index + 1, result);
            swap(s[i], s[index]);
        }
    }

    bool isValid(string &s) {
        for (int i = 0; i < s.size() - 1; i++) {
            if (s[i] == s[i + 1]) {
                return false;
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
    public String reorganizeString(String s) {
        List<String> permutations = new ArrayList<>();
        generatePermutations(s.toCharArray(), 0, permutations);
        
        for (String perm : permutations) {
            if (isValid(perm)) {
                return perm;
            }
        }
        
        return "";
    }
    
    private void generatePermutations(char[] arr, int index, List<String> result) {
        if (index == arr.length) {
            result.add(new String(arr));
            return;
        }
        
        for (int i = index; i < arr.length; i++) {
            swap(arr, i, index);
            generatePermutations(arr, index + 1, result);
            swap(arr, i, index);
        }
    }
    
    private void swap(char[] arr, int i, int j) {
        char temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    private boolean isValid(String s) {
        for (int i = 0; i < s.length() - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                return false;
            }
        }
        return true;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def reorganizeString(self, s: str) -> str:
        permutations = []
        self.generate_permutations(list(s), 0, permutations)

        for perm in permutations:
            if self.is_valid(perm):
                return perm

        return ""

    def generate_permutations(self, arr, index, result):
        if index == len(arr):
            result.append("".join(arr))
            return

        for i in range(index, len(arr)):
            arr[i], arr[index] = arr[index], arr[i]
            self.generate_permutations(arr, index + 1, result)
            arr[i], arr[index] = arr[index], arr[i]

    def is_valid(self, s):
        for i in range(len(s) - 1):
            if s[i] == s[i + 1]:
                return False
        return True
```

### Complexity Analysis

#### Time Complexity: O(N! × N)

- Generating all possible permutations of a string takes **factorial time**, since the number of arrangements grows as **N!** for a string of length **N**.
- As the string length increases, the number of permutations grows extremely fast.
- After generating each permutation, it must be checked character by character to ensure no two identical characters are adjacent.
- This validation step takes **O(N)** time for each permutation.
- Combining permutation generation and validation results in a total time complexity of **O(N! × N)**.
- Because of this factorial growth, the method is impractical for all but very small strings.

#### Space Complexity: O(N! × N)

- The algorithm stores **all generated permutations** of the string.
- The number of permutations grows factorially as **N!**, where **N** is the length of the string.
- Each permutation is a **full-length copy** of the string, requiring **O(N)** space.
- Therefore, the total memory required is **O(N! × N)**.
- The space usage grows extremely fast with increasing string length.
- Because of this factorial space requirement, the approach is impractical except for very small inputs.

## Optimal Approach

### Intuition

Instead of generating every possible arrangement, we focus **on controlling the characters that cause the most trouble,** the ones that appear very frequently. If a particular character occurs many times, it increases the risk of ending up next to itself. So the safest strategy is to place the most frequent character first, spreading its occurrences as far apart as possible.

To do this, we **count** how many times each character appears and sort them from most frequent to least frequent. Before beginning, we perform a quick mathematical check: if the most frequent character appears more times than the allowed limit, then no arrangement is possible, and we return an empty string immediately.

Once we know it’s possible, we start building the string one character at a time. At every step, we choose the character with the highest remaining frequency that is **different from the one we just placed.** This reduces the chances of forming unwanted duplicates side by side. After placing a character, we decrease its remaining count and continue choosing in the same greedy manner until the entire string is formed. 

Why it works?

By always placing the most “dangerous” character (the one with the most copies left) whenever it’s safe to do so, we ensure we never run into a situation where only identical characters remain to be placed next to each other. If such a situation never arises during the process, the result is guaranteed to have no adjacent duplicates.

### Algorithm

1. We count how many times each **character** **appears**. Start by creating a **frequency map** or **array** that keeps track of how many times each character occurs in the string. This helps us understand which characters are at risk of appearing next to themselves.
2. After this, we verify if a **valid arrangement** is even possible. Find the character with the **highest** **frequency**. If this frequency is greater than **(n + 1) / 2**, then it is impossible to rearrange the string without forming adjacent duplicates. In that case, immediately return an empty string.
3. We construct the **result** using a **greedy strategy**. Now, we create a list containing each character along with its remaining frequency, and sort this list in descending order of frequency.

Now start building the answer:

- At each step, select the character with the highest remaining frequency **that is not the same as the last character placed**.
- Append this character to the result.
- Reduce its frequency count.
- If needed, **re-sort** the list to maintain the highest-frequency character at the front. Repeat this process until all characters are used.

1. At last, we **return** the **constructed string**. Once all characters have been placed without violating the adjacency rule, return the final string as the valid rearrangement.

### Dry Run



### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string reorganizeString(string s) {
        // Step 1: Count frequencies
        unordered_map<char, int> freqMap;
        for (char c : s) {
            freqMap[c]++;
        }

        // Step 2: Check if possible
        int maxFreq = 0;
        for (auto &entry : freqMap) {
            maxFreq = max(maxFreq, entry.second);
        }

        if (maxFreq > (s.size() + 1) / 2) {
            return "";
        }

        // Step 3: Build result greedily
        // Create list of {character, frequency}
        vector<pair<char, int>> freqList;
        for (auto &entry : freqMap) {
            freqList.push_back({entry.first, entry.second});
        }

        string result = "";

        while (!freqList.empty()) {
            // Sort by frequency descending
            sort(freqList.begin(), freqList.end(),
                 [](const pair<char, int> &a, const pair<char, int> &b) {
                     return a.second > b.second;
                 });

            // Find first character different from last
            int index = 0;
            if (!result.empty()) {
                char lastChar = result.back();
                for (int i = 0; i < freqList.size(); i++) {
                    if (freqList[i].first != lastChar) {
                        index = i;
                        break;
                    }
                }
            }

            // Add character to result
            result += freqList[index].first;
            freqList[index].second--;

            // Remove if frequency becomes 0
            if (freqList[index].second == 0) {
                freqList.erase(freqList.begin() + index);
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
    public String reorganizeString(String s) {
        // Step 1: Count frequencies
        Map<Character, Integer> freqMap = new HashMap<>();
        for (char c : s.toCharArray()) {
            freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);
        }
        
        // Step 2: Check if possible
        int maxFreq = 0;
        for (int freq : freqMap.values()) {
            maxFreq = Math.max(maxFreq, freq);
        }
        
        if (maxFreq > (s.length() + 1) / 2) {
            return "";
        }
        
        // Step 3: Build result greedily
        // Create list of [character, frequency]
        List<int[]> freqList = new ArrayList<>();
        for (Map.Entry<Character, Integer> entry : freqMap.entrySet()) {
            freqList.add(new int[]{entry.getKey(), entry.getValue()});
        }
        
        StringBuilder result = new StringBuilder();
        
        while (!freqList.isEmpty()) {
            // Sort by frequency descending
            freqList.sort((a, b) -> b[1] - a[1]);
            
            // Find first character different from last
            int index = 0;
            if (result.length() > 0) {
                char lastChar = result.charAt(result.length() - 1);
                for (int i = 0; i < freqList.size(); i++) {
                    if (freqList.get(i)[0] != lastChar) {
                        index = i;
                        break;
                    }
                }
            }
            
            // Add character to result
            int[] pair = freqList.get(index);
            result.append((char) pair[0]);
            pair[1]--;
            
            // Remove if frequency becomes 0
            if (pair[1] == 0) {
                freqList.remove(index);
            }
        }
        
        return result.toString();
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def reorganizeString(self, s: str) -> str:
        # Step 1: Count frequencies
        freq_map = {}
        for c in s:
            freq_map[c] = freq_map.get(c, 0) + 1

        # Step 2: Check if possible
        max_freq = max(freq_map.values())
        if max_freq > (len(s) + 1) // 2:
            return ""

        # Step 3: Build result greedily
        # Create list of [character, frequency]
        freq_list = [[char, freq] for char, freq in freq_map.items()]

        result = []

        while freq_list:
            # Sort by frequency descending
            freq_list.sort(key=lambda x: x[1], reverse=True)

            # Find first character different from last
            index = 0
            if result:
                last_char = result[-1]
                for i in range(len(freq_list)):
                    if freq_list[i][0] != last_char:
                        index = i
                        break

            # Add character to result
            pair = freq_list[index]
            result.append(pair[0])
            pair[1] -= 1

            # Remove if frequency becomes 0
            if pair[1] == 0:
                freq_list.pop(index)

        return "".join(result)
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Counting the frequency of each character takes **O(N)** time since each character is processed once.
- Checking whether a valid rearrangement is possible involves scanning at most **26** character counts, which takes **O(1)**time.
- While building the rearranged string, one character is placed at a time, resulting in **N** placements.
- At each placement, the list of character–frequency pairs is sorted.
- Since this list contains at most **26** entries, each sort takes **O(1)** time.
- Performing this constant-time sorting **N** times still results in **O(N)** total time.
- Therefore, the overall **time complexity is O(N)**.

#### Space Complexity: O(1)

- Extra space is used to store **character frequencies**.
- A list of **character–frequency pairs** is also maintained.
- Both data structures can contain **at most 26 entries**, since the input consists only of lowercase English letters.
- The size of these structures does **not depend on the length of the string**.
- Therefore, the extra space used by the algorithm remains constant.
- The overall **space complexity is O(1)**.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/reorganize-string-)*
