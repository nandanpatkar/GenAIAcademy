# Group Anagrams

> **Slug:** `group-anagrams`  
> **Published:** 2026-07-05T12:40:05.620Z  
> **Updated:** 2026-07-05T12:40:05.638Z  
> **Keywords:** None  
> **Cover Image:** ![Group Anagrams](https://cdn.codehelp.in/media/Group anagrams.png)

**Description:** Group words that are anagrams of each other using sorting and hash maps. Learn brute-force vs optimal approaches with examples and complexity.

---

## Problem Statement

Given an array of strings ***strs***, your task is to group the anagrams together. 

***Note: ***An **anagram** is a word or phrase formed by rearranging the letters of another, using all the original letters exactly once. For example, the words *listen* and *silent* are anagrams of each other.

The output should be a list of groups, where each group contains words that are anagrams of each other. The order of groups and the order of words in the groups does not matter.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** strs =** ["eat", "tea", "tan", "ate", "nat", "bat"]**
> **Output: [ ["eat", "tea", "ate"], ["tan", "nat"], ["bat"] ]**
> **Explanation: **In this example, *eat*, *tea*, and *ate* are anagrams and are grouped together. Similarly, *tan *and *nat* form another group. The word *bat* stands alone as it has no anagrams in the provided list.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** strs = **['listen', 'silent', 'enlist', 'hello', 'ohell']**
> **Output:** ** [[enlist, listen, silent], [hello, ohell]]**
> **Explanation:** The words 'listen', 'silent', 'enlist' are anagrams. Similarly, 'hello' and 'ohell' are anagrams.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** strs =** ['abc', 'cab', 'bac', 'xyz', 'zxy', 'yxz', 'pqr']**
> 
> **Output: [[abc, bac, cab], [pqr], [xyz, yxz, zxy]]**
> 
> **Explanation: **Each group contains words that are anagrams of each other.

### Constraints

- 1 <= **strs.length** <= 10^4
- 0 <=** strs[i].length** <= 100
- **strs[i] **consists of lowercase English letters.

## Real-Life Analogy

Imagine you’ve got a **huge box of keys**—all jumbled together. At first glance, they look completely different: some are shiny, some are dull, some have flashy keychains, and some are plain. But here’s the secret: the magic of a key isn’t in its keychain or color it’s in the **pattern of its metal cuts**.

You start examining them closely, and suddenly you notice something amazing: **some keys are identical on the inside**, even if their decorations make them look unique. Two keys might have totally different keychains, but if their cuts match perfectly, they open the same lock. That’s the true identity of a key.

Grouping anagrams works **exactly the same way**. Two words might look completely different at first—different letters, different order—but if they contain the **same letters in the same quantities**, they are secretly the same inside. Words like **“listen,” “silent,” and “enlist”** are just keys with different keychains but identical ridges—they all belong to the same hidden group.

So next time you see a messy box of keys or a jumble of letters remember: it’s not the outside that counts, it’s the **inner pattern** that really tells the story.

## Brute-Force Approach

### Intuition

A straightforward way to solve this problem is to compare every word with every other word and see which ones are anagrams of each other. For each word, we check whether another word contains exactly the same letters in possibly a different order. If they match, we place them together in the same group.

We continue doing this comparison for all possible pairs and gradually build groups of words that share the same characters. This method works because anagrams always use the same letters with the same frequency so if two words match letter-by-letter after checking, they belong together.
However, this involves a lot of pairwise checking, making it a very slow approach when the list of words becomes large.

### Algorithm

1. Begin by **creating an empty** **result** list that will store all the groups of anagrams. Along with this, prepare a visited array initialized to false for every string, indicating that no string has been grouped yet.
2. Start **iterating** through each string using index `i`. If the string at index `i` is already marked as visited, simply move to the next index.
If it is not visited, start forming a new group by first adding the string at index `i` into this group. 
Still in this step, continue by checking all strings that come after index `i`. For each index `j`, verify whether the string at `i` and the string at `j` are anagrams of one another.

If they are anagrams, include the string at j in the current group and mark it as visited so that it is not processed again in future iterations.
3. After all strings have been processed in this manner and all possible groups have been formed, return the final result list containing all the anagram groups.

### Dry Run



### Code

### C++ Implementation

```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        vector<vector<string>> result;
        vector<bool> visited(strs.size(), false);

        for (int i = 0; i < strs.size(); i++) {
            if (visited[i]) continue;

            vector<string> group;
            group.push_back(strs[i]);
            visited[i] = true;

            for (int j = i + 1; j < strs.size(); j++) {
                if (!visited[j] && areAnagrams(strs[i], strs[j])) {
                    group.push_back(strs[j]);
                    visited[j] = true;
                }
            }

            result.push_back(group);
        }

        return result;
    }

private:
    bool areAnagrams(string s1, string s2) {
        if (s1.length() != s2.length()) return false;

        sort(s1.begin(), s1.end());
        sort(s2.begin(), s2.end());

        return s1 == s2;
    }
};
```

### Java Implementation

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> result = new ArrayList<>();
        boolean[] visited = new boolean[strs.length];
        
        for (int i = 0; i < strs.length; i++) {
            if (visited[i]) continue;
            
            List<String> group = new ArrayList<>();
            group.add(strs[i]);
            visited[i] = true;
            
            for (int j = i + 1; j < strs.length; j++) {
                if (!visited[j] && areAnagrams(strs[i], strs[j])) {
                    group.add(strs[j]);
                    visited[j] = true;
                }
            }
            
            result.add(group);
        }
        
        return result;
    }
    
    private boolean areAnagrams(String s1, String s2) {
        if (s1.length() != s2.length()) {
            return false;
        }
        
        char[] arr1 = s1.toCharArray();
        char[] arr2 = s2.toCharArray();
        Arrays.sort(arr1);
        Arrays.sort(arr2);
        
        return Arrays.equals(arr1, arr2);
    }
}
```

### Python Implementation

```python
class Solution:
    def groupAnagrams(self, strs):
        result = []
        visited = [False] * len(strs)

        for i in range(len(strs)):
            if visited[i]:
                continue

            group = [strs[i]]
            visited[i] = True

            for j in range(i + 1, len(strs)):
                if not visited[j] and self.areAnagrams(strs[i], strs[j]):
                    group.append(strs[j])
                    visited[j] = True

            result.append(group)

        return result

    def areAnagrams(self, s1, s2):
        if len(s1) != len(s2):
            return False

        return sorted(s1) == sorted(s2)
```

### Complexity Analysis

#### Time Complexity: O(N² × M log M)

- Let **N** be the number of strings and **M** the average length of each string.
- The **outer loop** iterates through all **N strings once**, giving **O(N)** time.
- For every unvisited string, the **inner loop** also goes through up to **N strings**, adding another **O(N)** factor.
- Each comparison between two strings checks if they are **anagrams**, which involves **sorting** each string.
- Sorting a string of length **M** takes **O(M log M)** time.
- Combining these steps, the total time complexity is **O(N × N × M log M) = O(N² × M log M)**.
- This makes the approach very **slow for large inputs**.

#### Space Complexity: O(N + M)

- The algorithm maintains a **result list** to store all strings, which uses **O(N)** space.
- A **visited array** of size **N** is also used, adding another **O(N)** space.
- During each anagram check, **temporary arrays** created for sorting a string of length **M** require **O(M)** space.
- Combining all components, the total space complexity is **O(N + M)**.

## Optimal Approach

### Intuition

Instead of checking every string against every other string, we can identify anagrams using a simple idea:
all anagrams look exactly the same when their letters are sorted.

For example:

- `"eat"` → sorted → `"aet"`
- `"tea"` → sorted → `"aet"`
- `"ate"` → sorted → `"aet"`

Even though the original words are different, their sorted forms act like a **unique signature** that represents their anagram group.

So the idea is to use a **HashMap**, where each sorted signature becomes the key, and all strings that match this signature are collected in the same list. This way, every word automatically finds its correct anagram group without any pairwise comparisons.

By letting sorted strings guide the grouping, the process becomes clean, fast, and avoids unnecessary repeated work.

### Algorithm

1. Firstly, we create an empty map to hold groups
make a map where each key will be a *sorted string* (the characters of a word in alphabetical order) and each value will be a list that collects the original words that share that sorted form. This map is where we will gather words that are anagrams of each other.
2. For each word in the input array, compute its key by sorting its characters (for example, `"eat"` → `"aet"`). Look up that key in the map. If the key already exists, append the original word to the list for that key. If the key does not exist yet, create a new list containing the original word and put it into the map under that sorted-key. Doing this for every word groups all words with the same letters under the same key automatically.
3. Now, collect the grouped anagrams. After every input word has been processed, the map’s values are exactly the groups of anagrams. Iterate through the map’s values and collect each list (each value) into a final result list. Each collected list is one group of words that are anagrams of one another.
4. At last, we return the list of lists you built from the map’s values. The order of groups and the order of words within a group does not matter; each returned list contains only words that are mutual anagrams.

### Dry Run



### Code

### C++ Implementation

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Step 1: Create HashMap
        unordered_map<string, vector<string>> mp;

        // Step 2: Process each string
        for (string str : strs) {
            // Sort string to create key
            string key = str;
            sort(key.begin(), key.end());

            // Add to corresponding group
            mp[key].push_back(str);
        }

        // Step 3: Build result from all groups
        vector<vector<string>> result;
        for (auto& entry : mp) {
            result.push_back(entry.second);
        }

        return result;
    }
};
```

### Java Implementation

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Step 1: Create HashMap
        Map<String, List<String>> map = new HashMap<>();
        
        // Step 2: Process each string
        for (String str : strs) {
            // Sort string to create key
            char[] chars = str.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            
            // Add to corresponding group
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(str);
        }
        
        // Step 3: Build result from all groups
        return new ArrayList<>(map.values());
    }
}
```

### Python Implementation

```python
class Solution:
    def groupAnagrams(self, strs):
        # Step 1: Create dictionary
        groups = {}

        # Step 2: Process each string
        for string in strs:
            # Sort string to create key
            key = ''.join(sorted(string))

            # Add to corresponding group
            if key not in groups:
                groups[key] = []
            groups[key].append(string)

        # Step 3: Build result from all groups
        return list(groups.values())
```

### Complexity Analysis

#### Time Complexity: O(N × M log M)

- Let **N** be the number of strings and **M** the average length of each string.
- The algorithm processes each of the **N strings** once.
- For every string, its characters are **sorted**, which takes **O(M log M)** time.
- Sorting occurs **once per string**, and **HashMap insertions** take **O(1)** average time.
- Combining these steps, the total time complexity is **O(N × M log M)**.

#### Space Complexity: O(N × M)

- The algorithm stores all strings inside a **HashMap**.
- Each original string requires **O(M)** space, where **M** is its length.
- There are **N strings**, so storing the originals requires **O(N × M)** space.
- Each key in the HashMap is a **sorted version of the string**, adding the same **O(N × M)** space.
- Combining these, the overall **space complexity is O(N × M)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/group-anagrams)*
