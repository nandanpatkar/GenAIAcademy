# Replace a Character in a String

> **Slug:** `replace-a-character-in-a-string`  
> **Published:** 2026-07-04T21:34:12.859Z  
> **Updated:** 2026-07-04T21:34:12.868Z  
> **Keywords:** Replace a Character in a String, Replace, String Character  
> **Cover Image:** ![Replace a Character in a String](6a497c4a38cb2da009adbfa0)

**Description:** Learn how to replace a character in a string with step-by-step examples. Includes efficient methods for string manipulation in programming.

---

## Problem Statement

Given a string ***s***, your task is to replace all occurrences of a specified target character ***c1*** with another character ***c2***. The modification should be done directly in the original string such that each instance of ***c1*** is substituted with ***c2***.

Implement a function that accepts three parameters: the string ***s***, the target character ***c1***, and the replacement character ***c2***.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  s = "hello", c1 = 'l', c2 = 'x'
> **Output:** hexxo
> **Explanation:** All occurrences of 'l' are replaced with 'x'.

## Example 2

> [!NOTE]
> **INFO**
> **Input:** s = "apple", c1 = 'p', c2 = 'q'
> **Output:** aqqle
> **Explanation:** All occurrences of 'p' are replaced with 'q'.

## Example 3

> [!NOTE]
> **INFO**
> **Input: **s = "mississippi", c1 = 's', c2 = 'z'
> **Output:** mizzizzippi
> **Explanation: **All occurrences of 's' are replaced with 'z'.

## Constraints

- 1 <= |s| <= 1000
- The string `s` consists of printable ASCII characters.
- `c1` and `c2` are single printable ASCII characters.Real-Life Analogy

### Real-Life Analogy

There was once a small printing shop called **LetterLand**, where workers printed **name tags** for a big event. Each name tag was just a long strip of letters like a **string**. One day, the manager, Mr. Typo, discovered a mistake: “Oh no! We printed every name using the letter **‘A’** instead of **‘O’** wherever it was supposed to appear!”. So he called his assistant, Mira, and said: “Here is the box of name tags (this is your string **s**). The letter  **‘A’** (this is your **c1**) needs to be changed to **‘O’** (this is your **c2**) in every single tag.” Mira didn't want to reprint all the tags from scratch, so she took each name tag and **directly edited** the letters on it. She carefully scanned each tag character by character.

- Whenever she saw the wrong letter **‘A’**, she **replaced** it with **‘O’**.
- When she saw any other letter, she left it untouched.

After finishing the box, every name tag now had the right spelling. Mr. Typo smiled and said:

> “Great job, Mira! You took the old box of name tags and just swapped the wrong letters with the right ones,  exactly how a program replaces characters inside a string.

### Brute-Force Approach
Intuition

The easiest way to replace all occurrences of a character in a string is to use the built-in`replace()` method provided by Java's String class. This method is designed specifically for this purpose and handles all the logic internally. It scans through the entire string, finds every occurrence of the target character, and replaces it with the new character. While this is called "brute-force," it's actually the standard and most efficient solution in Java because the `replace()` method is highly optimized at the language level. It saves us from writing manual loops and character comparisons.

### Algorithm

1. We start by checking the input string. If the string `s` is `null` or has a length of `0`, then no operation is required because there is nothing to replace. Therefore, directly return the string as it is.
2. Now we check whether the target character and replacement character are the same. If`c1` and `c2` represent the same character, then replacing `c1` with `c2` will not change the string in any way. In this case, simply return the original string unchanged. Use the built-in `replace()` method on the string. Invoke:` s.replace`(c1, c2).  This method performs the replacement internally. Understand the internal behavior of replace(). When replace() is called, it:
3. 1. Iterates over each character of the string from beginning to end.
  2. Compares the current character with the target character c1.
  3. If the character is equal to c1, it substitutes that character with c2.
  4. If the character is not equal to c1, it keeps the original character unchanged.
  5. Continues this process until the entire string has been scanned.
4. After this, we construct a new modified string. The `replace()` method does not change the original string (since strings are immutable). Instead, it creates and returns a new string that contains all the updated characters after replacement.
5. At last, we return the final result. The function returns the newly formed string in which all occurrences of `c1` have been replaced by `c2`.

### Code

### Complexity Analysis

#### Time Complexity: O(N)

- The `replace()` method scans the string once, processing each of the **N characters exactly one time**.
- For each character, it performs a **constant-time comparison** with the target character (`c1`).
- If a match is found, the replacement is also done in **O(1)** time.
- Although strings are immutable in Java, the method still performs a single full traversal of the input.
- A new string is constructed during the process, which also requires a linear pass over the characters.
- Therefore, the overall time complexity remains **O(N)**.

#### **Space Complexity: O(N)**

- Strings in Java are immutable, so `replace()` cannot modify the original string in place.
- A **new string of size N** is created to store the result.
- This new allocation happens even if no replacements occur.
- No additional data structures are used beyond this output string.
- Therefore, the space complexity is **O(N)** due to the newly created result string.

### Dry Run

> [!NOTE]
> **INFO**
> **Input: s = "hello", c1 = 'l', c2 = 'L'**
> 
> ##### **Step 1: Check edge cases**
> 
> - String is not null
> - Length = 5 (not empty)
> - c1 ('l') != c2 ('L') → proceed with replacement
> 
> ##### **Step 2: Apply replace() method**
> 
> **Processing each character:**
> 
> ***Index 0: 'h'***
> 
>   → Compare with c1 ('l')
>   → 'h' != 'l' → Keep 'h'
> 
> ***Index 1: 'e'***
> 
>   → Compare with c1 ('l')
>   → 'e' != 'l' → Keep 'e'
> 
> ***Index 2: 'l'***
> 
>   → Compare with c1 ('l')
>  → 'l' == 'l' → Replace with 'L' ✓
> 
> ***Index 3: 'l'***
> 
>   → Compare with c1 ('l')
>   → 'l' == 'l' → Replace with 'L' ✓
> 
> ***Index 4: 'o'***
> 
>   → Compare with c1 ('l')
>   → 'o' != 'l' → Keep 'o'
> 
> ##### **Step 3: Build result string**
> 
> - Combine all processed characters: "heLLo"
> 
> ##### Result: `"heLLo"` ✓

### Optimal Approach
Intuition

While the built-in `replace()` method is convenient, understanding how to manually replace characters helps us learn about string manipulation and character arrays. The approach is straightforward: convert the string to a character array (since strings are immutable in Java), iterate through each character, and whenever we find the target character c1, replace it with c2. After processing all characters, we convert the array back to a string. This gives us complete control over the replacement process and helps us understand what's happening under the hood. It's also useful when we need to perform more complex replacements or keep track of how many replacements were made.

### Algorithm

1. Firstly, we handle the basic edge cases because there is no point continuing if the input cannot be processed. If the string is `null` or empty, we return it immediately since there is nothing to replace. Similarly, if `c1` and `c2` are the same, no actual change will occur, so returning the original string avoids unnecessary work.
2. Now, we convert the string into a character array using `s.toCharArray()`. We do this because Java strings are immutable, meaning they cannot be modified directly. A character array allows us to change individual characters freely.
3. After this, Traverse the character array one index at a time to inspect each character. At every index, we check whether the current character matches the target `c1`. If it matches, we replace it with `c2`; otherwise we leave it as it is. This ensures we only modify the characters that actually need to be changed.
4. Convert the updated character array back into a new string using `new String(charArray)`. Since the original string cannot be altered, this step creates a fresh string with all replacements applied.
5. At last, we return the newly created string which now contains the modified characters wherever `c1` appeared. This completes the transformation while keeping the original string intact.

### Code

### Complexity Analysis

#### Time Complexity: O(N)

- We traverse the character array once from index `0` to `N - 1`.
- For each character, we perform a constant-time check (`c1 == currentChar`).
- If the condition matches, we perform a constant-time replacement (`c2 assignment`).
- The conversion of the input string to a character array takes **O(N)** time.
- After modification, converting the character array back to a string also takes **O(N)** time.
- Since all operations are linear and sequential, the overall time complexity is **O(N)**.

#### Space Complexity: O(N)

- We create a character array from the input string, which requires **O(N)** space.
- We also create a new string from this array, which again requires **O(N)** space.
- Due to Java’s string immutability, in-place modification is not possible.
- The character array acts as temporary storage but still scales linearly with input size.
- No additional data structures are used beyond this array and final output string.
- Therefore, the total space complexity is **O(N)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/replace-a-character-in-a-string)*
