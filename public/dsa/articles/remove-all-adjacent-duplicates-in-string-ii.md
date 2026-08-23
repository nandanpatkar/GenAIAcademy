# Remove All Adjacent Duplicates in String II

> **Slug:** `remove-all-adjacent-duplicates-in-string-ii`  
> **Published:** 2026-07-04T22:01:07.865Z  
> **Updated:** 2026-07-04T22:01:07.877Z  
> **Keywords:** Remove All Adjacent Duplicates in String  
> **Cover Image:** ![Remove All Adjacent Duplicates in String II](https://cdn.codehelp.in/media/Remove All string 2.png)

**Description:** Remove k-adjacent duplicates from a string efficiently. Learn brute-force rescanning and optimal stack-based linear-time approaches with examples.

---

## Problem Statement

Given a string ***s***, you need to remove ***k*** adjacent duplicates from the string in a repetitive manner until no more ***k***-duplicate removals can be performed. Return the resulting string after all possible duplicate removals.

A duplicate is defined as ***k*** contiguous characters that are all the same.

> [!NOTE]
> **INFO**
> **Input:***** s =  ***"deeedbbcccbdaa", k =** 3, Output:***** ***"aa"
> 
> **Explanation:**
> 
> 1. Remove "eee" from "deeedbbcccbdaa"; the string becomes "ddbbcccbdaa".
> 2. Remove "ccc"; the string becomes "ddbbdaa".
> 3. Remove "bbb"; the string becomes "dddaa".
> 4. Remove "ddd"; the string becomes "aa".
> 5. No more ***k***-duplicate removals can be done.
> 
> The final result after all duplicate removals is "aa".

### Example 1

> [!NOTE]
> **INFO**
> **Input:**  s = "abcd", k = 2
> **Output:** "abcd"
> **Explanation:** No two adjacent characters are the same. No removal possible and return original string

### Example 2

> [!NOTE]
> **INFO**
> **Input: **s = 'pbbcggttciiippooaais', k = 2
> **Output:** "ps"
> **Explanation: **Remove adjacent duplicates in pairs until only 'ps' remains.

### Constraints

- 1 <= **s.length** <= 10^5
- 2 <= **k** <= 10^4
- **s** consists of lowercase English letters.

## Real-Life Analogy

Imagine you are standing beside a magical candy factory conveyor belt, stretching far ahead, filled with colorful candies lined up one after another. Each candy has a color, like red, blue, or green, and the belt has a unique magical rule: whenever exactly **k candies of the same color line up right next to each other**, the machine immediately detects them and zaps them away in a flash of light. But the magic doesn’t stop there. 

As soon as those candies disappear, the remaining candies slide together to fill the empty spaces, just like they are drawn by invisible hands. This sliding can sometimes create a new group of **k matching candies**, which triggers another zap, followed by more sliding. This cycle of detecting, zapping, and sliding continues over and over until the belt finally settles into a stable state where no more groups of k identical candies exist. What remains on the belt after all the zaps and slides is the final sequence of candies—the leftovers that could not form a complete group of k. Essentially, the conveyor belt is constantly cleaning itself, magically removing patterns of repeated candies, until it can no longer do so, leaving only unmatched candies behind.

## Brute-Force Approach

### Intuition

The simple way to solve this problem is to *keep cleaning the string again and again* until it stops changing. We scan through the string looking for any group of k identical characters in a row, and as soon as we find such a group, we remove it. But removing those characters causes the remaining parts of the string to shift, and after the shift, new groups of k duplicates may appear.

So the idea is simple: Keep scanning → remove duplicates → scan again → remove again → until there’s nothing left to remove. It’s like repeatedly brushing dust off a table: Every time we wipe, some dust falls from the edges or corners into the middle. So, we wipe again and again until the table is finally clean.

### Algorithm

1. To do this, we maintain a **boolean flag** that tells us whether we removed anything in the current round. This flag is important because it tells the algorithm whether we need to **scan the string again** if we removed something, new groups of duplicates may have formed after the deletion. If we didn’t remove anything during a full pass, we know the string is fully clean, and we can stop.
2. The process works by moving a **window of size k** across the string. For each window, we check whether **all characters inside it are the same**. If they are, this window represents a **group of k consecutive duplicates**. We then **delete these k characters** from the string.
3. After deleting, the string **shrinks**, and previously non-adjacent characters may now become adjacent. This could create **new groups of k duplicates**, which is why we need to repeat the scanning process. Each time we perform a full scan, we check the flag: if **any deletions happened**, we go through the string again; if **no deletions happened**, we are finished.
4. Finally, once the string has no more groups of k identical characters, we return it in its **current cleaned-up form**.

### Dry Run

> [!NOTE]
> **INFO**
> Initial Input: s = "abbbaaac", k = 3
> 
> changed = true
> 
> We now enter the outer loop.
> 
> **Pass 1:**
> 
> Scan the string from left:
> 
> 1. 'a'
> 
> **count = 1  **
> 
> **remaining = 1  **
> 
> **→ keep "a"  **
> 
> **sb = "a"**
> 
> 2. 'bbb'
> 
> **count = 3 → divisible by k  **
> 
> **remaining = 0  **
> 
> **→ remove "bbb"  **
> 
> **sb = "a"**
> 
> **changed = true**
> 
> 3. 'aaa'
> 
> **count = 3 → divisible by k  **
> 
> **remaining = 0  **
> 
> **→ remove "aaa"  **
> 
> **sb = "a"**
> 
> **changed = true**
> 
> 4. 'c'
> 
> **count = 1  **
> 
> **→ keep "c"  **
> 
> **sb = "ac"**
> 
> After Pass 1:
> 
> **s = "ac"**
> 
> **changed = true**
> 
> Pass 2:
> 
> Input: s = "ac"
> 
> Scan again:
> 
> 1. 'a'
> 
> **count = 1 → keep  **
> 
> **sb = "a"**
> 
> 2. 'c'
> 
> **count = 1 → keep  **
> 
> **sb = "ac"**
> 
> No groups removed → changed stays false
> 
> **Loop stops.**
> 
> FINAL OUTPUT: **"ac"**

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string removeDuplicates(string s, int k) {

        bool changed = true;

        while (changed) {
            changed = false;
            string result = "";

            int i = 0;

            while (i < s.length()) {

                int j = i;

                // Count consecutive identical characters
                while (j < s.length() && s[j] == s[i]) {
                    j++;
                }

                int count = j - i;

                // If count is divisible by k, remove those groups
                int remaining = count % k;

                for (int m = 0; m < remaining; m++) {
                    result += s[i];
                }

                if (count >= k) {
                    changed = true;
                }

                i = j;
            }

            s = result;
        }

        return s;
    }
};
```

### Java Implementation

```java
class Solution {
    public String removeDuplicates(String s, int k) {
        boolean changed = true;
        
        while (changed) {
            changed = false;
            StringBuilder sb = new StringBuilder();
            int i = 0;
            
            while (i < s.length()) {
                int j = i;
                // Count consecutive identical characters
                while (j < s.length() && s.charAt(j) == s.charAt(i)) {
                    j++;
                }
                
                int count = j - i;
                
                // If count is divisible by k, remove those groups
                int remaining = count % k;
                for (int m = 0; m < remaining; m++) {
                    sb.append(s.charAt(i));
                }
                
                if (count >= k) {
                    changed = true;
                }
                
                i = j;
            }
            
            s = sb.toString();
        }
        
        return s;
    }
}
```

### Python Implementation

```python
class Solution:
    def removeDuplicates(self, s: str, k: int) -> str:

        changed = True

        while changed:
            changed = False
            result = []

            i = 0

            while i < len(s):

                j = i

                # Count consecutive identical characters
                while j < len(s) and s[j] == s[i]:
                    j += 1

                count = j - i

                # If count is divisible by k, remove those groups
                remaining = count % k

                for _ in range(remaining):
                    result.append(s[i])

                if count >= k:
                    changed = True

                i = j

            s = "".join(result)

        return s
```

### Complexity Analysis

#### Time Complexity: O(N² / k)

- Let **N** be the length of the string and **k** the size of the duplicate group to remove.
- In the **worst case**, each removal eliminates **k characters**, so we can have roughly **N/k removals** before the string stabilizes.
- In each pass, the algorithm scans the **entire string** to find k-length duplicate groups, which takes **O(N)** time.
- Total number of passes is approximately **N/k**, each costing **O(N)**.
- Therefore, the combined time complexity is: **O(N × (N/k)) = O(N² / k)**.
- This approach is **inefficient for large inputs** due to repeated rescanning of the string.

#### **Space Complexity: O(N)**

- After every removal, the algorithm **rebuilds the string**.
- A **temporary buffer** is used to hold the updated string during each iteration.
- - In **Java**, this buffer is typically a **StringBuilder**.
  - In **C++**, this buffer is typically a **string** or a **vector<char>**.
- At any point, this temporary buffer may contain **up to N characters**, where **N is the length of the string** in that iteration.

## Optimal Approach

### Intuition

When we try to remove k adjacent duplicates by repeatedly scanning the entire string, it becomes slow because we keep rechecking the same characters. A better way is to process the string only once while keeping track of how many times each character appears consecutively.

To do this efficiently, we use a stack where each entry stores two things:

- the character
- how many times it has appeared in a row so far

Each time a new character comes in, we compare it with the character on the top of the stack. If it's the same, we increase the count. If the count ever reaches *k*, that means we found k duplicates, so we immediately remove them by popping the stack entry. Because we process characters in real time and remove duplicates immediately when they form, we never need to rescan earlier parts of the string. This avoids repeated work and makes the whole process efficient and clean.

In the end, the stack will contain only the characters that survived all removals, along with how many times each one appears. We simply rebuild the final string using that information.

### Algorithm

1. To solve this problem, we use a simple idea, whenever characters appear next to each other repeatedly, we want to keep track of how many times they’ve occurred so far. A stack becomes the perfect tool because it lets us remember the character we’re currently building a group for and how many times it has appeared consecutively.
2. As we move through the string from left to right, we look at each character and compare it with the one on top of the stack. If it’s a new character, we start a fresh entry for it with a count of 1. If it's the same as the one on the stack, we simply increase the count of that character. Now comes the clever part: if the count ever reaches **k**, it means we’ve found exactly k duplicates sitting together so we remove that entire group instantly by popping it from the stack. This way, the string keeps “cleaning itself” while we process it.
3. Once we finish scanning the string, the stack holds whatever survived each character along with how many times it appears consecutively in the final version. All that's left is to rebuild the string from this information by repeating each character according to its stored count. The result we get is the fully processed string where all k-length duplicate groups have disappeared automatically as soon as they formed.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "abbaca"`, `k = 2`
> 
> **Initial:** `stack = []`
> 
> **Process 'a':**
> 
> Stack empty, push ('a', 1)
> `stack = [('a', 1)]`
> 
> **Process 'b':**
> 
> Top = 'a', current = 'b' → different
> Push ('b', 1)
> `stack = [('a', 1), ('b', 1)]`
> 
> **Process 'b':**
> 
> Top = 'b', current = 'b' → same
> Increment count: ('b', 2)
> Count = k = 2 → Pop!
> `stack = [('a', 1)]`
> 
> **Process 'a':**
> 
> Top = 'a', current = 'a' → same
> Increment count: ('a', 2)
> Count = k = 2 → Pop!
> `stack = []`
> 
> **Process 'c':**
> 
> Stack empty, push ('c', 1)
> `stack = [('c', 1)]`
> 
> **Process 'a':**
> 
> Top = 'c', current = 'a' → different
> Push ('a', 1)
> `stack = [('c', 1), ('a', 1)]`
> 
> **Build Result:**
> 
> From stack: [('c', 1), ('a', 1)]
> `Result: "c" (1 time) + "a" (1 time) = "ca"`
> 
> **Output:** `"ca"`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string removeDuplicates(string s, int k) {
        stack<pair<char, int>> stk;

        for (char c : s) {
            if (!stk.empty() && stk.top().first == c) {
                stk.top().second++;
            } else {
                stk.push({c, 1});
            }
            
            if (stk.top().second == k) {
                stk.pop();
            }
        }

        string result;
        while (!stk.empty()) {
            auto [character, count] = stk.top();
            stk.pop();
            result.insert(result.begin(), count, character);
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public String removeDuplicates(String s, int k) {
        // Stack to store (character, count) pairs
        Stack<Pair> stack = new Stack<>();
        
        // Process each character
        for (char c : s.toCharArray()) {
            if (!stack.isEmpty() && stack.peek().ch == c) {
                // Same character as top, increment count
                stack.peek().count++;
                
                // If count reaches k, remove these k characters
                if (stack.peek().count == k) {
                    stack.pop();
                }
            } else {
                // Different character, push new entry
                stack.push(new Pair(c, 1));
            }
        }
        
        // Build result from stack
        StringBuilder result = new StringBuilder();
        for (Pair pair : stack) {
            for (int i = 0; i < pair.count; i++) {
                result.append(pair.ch);
            }
        }
        
        return result.toString();
    }
    
    // Helper class to store character-count pairs
    class Pair {
        char ch;
        int count;
        
        Pair(char ch, int count) {
            this.ch = ch;
            this.count = count;
        }
    }
}
```

### Python Implementation

```python
class Solution:
    def removeDuplicates(self, s: str, k: int) -> str:

        # Stack to store (character, count) pairs
        stack = []

        # Process each character
        for c in s:

            if stack and stack[-1][0] == c:

                # Same character as top, increment count
                stack[-1][1] += 1

                # If count reaches k, remove these k characters
                if stack[-1][1] == k:
                    stack.pop()

            else:

                # Different character, push new entry
                stack.append([c, 1])

        # Build result from stack
        result = []

        for ch, count in stack:
            result.append(ch * count)

        return "".join(result)
```

### Complexity Analysis

#### Time Complexity: O(N)

- The algorithm traverses the string **once from left to right**, processing each character **exactly once**.
- There is **no repeated scanning** or backward jumping; it’s a **linear pass**.
- A **stack** is used to track characters, and the **final result string** is built by processing each character once.
- Both stack operations and result construction occur **once per character**.
- Therefore, the total work grows **linearly with the string length N**.
- Overall, the **time complexity is O(N)**, making the approach **efficient and optimal**.

#### Space Complexity: O(N)

- In the **worst case**, if no characters are removed, the **stack** can hold **all N characters**, using **O(N)** space.
- The **final result string** also requires space proportional to the number of characters in it, up to **O(N)**.
- Both stack and result string grow **linearly with input size**.
- Therefore, the total **extra space needed is O(N)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/remove-all-adjacent-duplicates-in-string-ii)*
