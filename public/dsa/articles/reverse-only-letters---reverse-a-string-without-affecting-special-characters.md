# Reverse Only Letters - Reverse a string without affecting special characters

> **Slug:** `reverse-only-letters---reverse-a-string-without-affecting-special-characters`  
> **Published:** 2026-07-05T13:32:04.638Z  
> **Updated:** 2026-07-05T13:32:04.648Z  
> **Keywords:** None  
> **Cover Image:** ![Reverse Only Letters - Reverse a string without affecting special characters](6a4a5c8038cb2da009adc13e)

**Description:** Reverse only letters in a string while keeping non-letter characters in place. Learn brute-force and two-pointer methods with examples and complexity.

---

## Problem Statement

In this problem, you are given a string ***s*** which consists of mixed characters, including letters, digits, and symbols. Your task is to reverse only the alphabetical letters in the string while keeping all non-alphabetical characters in their original positions. 
The goal is to rearrange the letters within the string such that the positions of non-letter characters remain unchanged. For example, given the input string ***"a-bC-dEf-ghIj"***, the expected output would be ***"j-Ih-gfE-dCba"***.

***Note:*** that the letters have been reversed, while the positions of the dashes ('-') and other non-letter symbols have not changed.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** ***s = "a-bC-dEf-ghIj"***
> **Output:** ***"j-Ih-gfE-dCba"***
> **Explanation: **In the example above, letters ***a***, ***b***, ***C***, ***d***, ***E***, ***f***, ***g***, ***h***, ***I***, and ***j*** are reversed to become ***j***, ***I***, ***h***, ***g***, ***f***, ***E***, ***d***, ***C***, ***b***, and ***a***, respectively. Meanwhile, the dashes remain in their original position.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** s = 'ab-cd'
> **Output:** dc-ba
> **Explanation:** Only letters 'a', 'b', 'c', 'd' are reversed.

### Example 3

> [!NOTE]
> **INFO**
> **Input:**  s = 'Test1ng-Leet=code-Q!'
> 
> **Output:** Qedo1ct-eeLg=ntse-T!
> 
> **Explanation: **Only letters are reversed; digits and symbols remain in place.

### Constraints

- 1 <= **s.length** <= 100
- s consists of printable **ASCII** characters.

## Real-Life Analogy

The Theater Performance, Imagine a theater with a row of seats where some seats are reserved for actors (letters) and some seats are marked with "Reserved" signs which is non-letter characters.

**Initial Setup (Input String) :**`[Actor-A] [Reserved] [Actor-B] [Actor-C] [Reserved] [Actor-D]`

**Here, **Task is to reverse the order of actors, but keep the "Reserved" signs in their exact same seats.

**We follow these steps: **

1. **Take all actors out of their seats** (extract letters)
2. - Actors removed: A, B, C, D
3. **Reverse their lineup order**
4. - Reversed: D, C, B, A
5. **Place them back in non-reserved seats only**
6. - Seat 0: D (actor seat)
  - Seat 1: Reserved (skip)
  - Seat 2: C (actor seat)
  - Seat 3: B (actor seat)
  - Seat 4: Reserved (skip)
  - Seat 5: A (actor seat)

**We conclude final result as: **

`[Actor-D] [Reserved] [Actor-C] [Actor-B] [Reserved] [Actor-A]`

The reserved signs never moved, but the actors are now in reverse order!

## Brute-Force Approach

### Intuition

The simplest way to solve this problem is to first separate all the letters from the given string and store them in a separate collection. Once we have all the letters, we reverse their order. After that, we rebuild the original string by placing the reversed letters back into the positions where letters originally appeared, while keeping all non-letter characters (such as digits, symbols, or spaces) exactly where they were. This method ensures that only the letters are reversed, without disturbing the rest of the string. However, it requires extra space to store the letters temporarily and involves going through the string multiple times.

### Algorithm

1. Firstly, we** extract the letters **as we go through the string from left to right and collect every letter you find into a new list called `letters`. By “letter” we mean alphabetic characters as a–z and A–Z, so skip digits, punctuation, spaces, and other symbols. The goal is to separate only the characters that should be reversed while remembering their order in a simple list. For example, from `"a-bC-d!"`you would collect `['a','b','C','d']`.
2. Then we **reverse the collected letters**. We take the small list of letters you built and reverse its order. This makes the last letter of the original string become the first in the reversed list, and so on. In the example `['a','b','C','d']` becomes `['d','C','b','a']`. Reversing is done only on this compact list, not on the whole string.
3. Now,we **rebuild the final string **as we create an empty result container and keep a pointer as an index that starts at the beginning of the reversed letters list. Walk through the original string again, character by character. If the character at the current position is a letter, take the next letter from the reversed list by using the pointer, append it to the result, and move the pointer forward. If the character is not a letter, keep it exactly as it is and append it unchanged. This way all non-letter characters stay in place while letters are filled from the reversed collection. For `"a-bC-d!"`, rebuilding yields: take `'d'` for position 0 → `'d'`, keep `'-'`, take `'C'` → `'-C'`, keep `'-'`, take `'b'` → `'-b'`, keep `'!'`, etc., producing `"d-Cb-a!"`.
4. Lastly, we** return,** when we reach the end of the original string, our result container holds the final string with letters reversed and all other characters untouched. Return that as the output.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `s = "a-bC-dEf"`
> 
> **Step 1: Extract Letters**
> 
> **Extracted letters:** `[a, b, C, d, E, f]`
> 
> 
> **Step 2: Reverse Letters**
> **Reversed letters:** `[f, E, d, C, b, a]`
> 
> **Step 3: Rebuild String**
> 
> **Step 4: Return Output:** `"f-Ed-Cba"`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string reverseOnlyLetters(const string& s) {
        int left = 0, right = s.size() - 1;
        string result = s;

        while (left < right) {
            while (left < right && !isalpha(result[left])) {
                left++;
            }
            while (left < right && !isalpha(result[right])) {
                right--;
            }
            if (left < right) {
                swap(result[left], result[right]);
                left++;
                right--;
            }
        }
        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public String reverseOnlyLetters(String s) {
        // Step 1: Extract all letters
        List<Character> letters = new ArrayList<>();
        for (char c : s.toCharArray()) {
            if (Character.isLetter(c)) {
                letters.add(c);
            }
        }
        
        // Step 2: Reverse the letters list
        Collections.reverse(letters);
        
        // Step 3: Rebuild the string
        StringBuilder result = new StringBuilder();
        int letterIndex = 0;
        
        for (char c : s.toCharArray()) {
            if (Character.isLetter(c)) {
                // Place reversed letter
                result.append(letters.get(letterIndex));
                letterIndex++;
            } else {
                // Keep non-letter in original position
                result.append(c);
            }
        }
        
        // Step 4: Return result
        return result.toString();
    }
}
```

### Python Implementation

```python
class Solution:
    def reverseOnlyLetters(self, s: str) -> str:

        # Step 1: Extract all letters
        letters = []

        for c in s:
            if c.isalpha():
                letters.append(c)

        # Step 2: Reverse the letters list
        letters.reverse()

        # Step 3: Rebuild the string
        result = []
        letterIndex = 0

        for c in s:
            if c.isalpha():
                # Place reversed letter
                result.append(letters[letterIndex])
                letterIndex += 1
            else:
                # Keep non-letter in original position
                result.append(c)

        # Step 4: Return result
        return "".join(result)
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Let **N** be the total number of characters in the string.
- In the first pass, we iterate through the string once to collect all letters, which takes **O(N)** time.
- Reversing the list of collected letters takes **O(L)** time, where **L** is the number of letters.
- Since **L ≤ N**, reversing does not increase the overall time complexity.
- In the second pass, we rebuild the final string while keeping non-letter characters in place, which takes **O(N)** time.
- Each character is processed only a few times.
- Therefore, the total time complexity of the approach is **O(N)**.

#### Space Complexity: O(N)

- Let **N** be the total number of characters in the string.
- Extra space is used to store the letters separately and to build the final result.
- The list that stores the letters requires **O(L)** space, where **L** is the number of letters.
- The string builder used to create the output requires **O(N)** space.
- Since **L ≤ N**, the total extra space grows linearly with **N**.
- Therefore, the overall space complexity is **O(N)**.

## Optimal Approach

### Intuition

A more efficient way to reverse only the letters in a string is by using the **two-pointer technique**, which avoids creating extra storage. In this method, we place one pointer at the **beginning** of the string (left) and another at the **end** (right). Both pointers move toward each other. If both characters at these positions are letters, we simply swap them. If one of the pointers encounters a non-letter character, we skip it and move the pointer until it reaches a letter. 
This process continues until the two pointers meet. By swapping letters directly within the string, this method reverses the letters in place while keeping all non-letter characters in their original positions. It is **efficient** because it doesn’t require **additional** space for storing letters, and each character is visited only once.

### Algorithm

1. Firstly we **turn** the string into a **list** of characters. Because text in many languages (like Java) can't be changed directly, we first make a mutable copy of the characters. Think of this as laying out every character in a row so we can swap them when needed. This temporary array is what we will modify. As we need a structure we can change, individual letters must be swappable.
2. Now, Place one **marker** at the leftmost position and another at the rightmost position of the character row. These markers will move toward each other as we work. We using two markers lets us find pairs of letters that should be **swapped** to reverse only the letters while keeping other characters fixed.
3. Move the markers and decide what to do at each step. Repeat the following until the left marker meets or passes the right marker:

Look at the character where the left marker sits.

- - If it is not a letter (for example, a digit, space, or punctuation), move the left marker one step to the right and check again. Don’t change anything in the row.
  - Look at the character where the right marker sits.
  - If it is not a letter, move the right marker one step to the left and check again.
  - If both characters are letters, **swap** them, then move the left marker one step right and the right marker one step left.

Because, **skipping** non-letters ensures they remain in their original positions. Swapping letters when both markers point to letters gradually reverses the order of letters across the whole string.

1. **Build** the final string and return it. Once the markers meet, the letters are reversed in place while every other character stayed where it started. **Convert** the modified character row back into a normal string and return it as the result. This final conversion gives you the normal text format the rest of your program expects.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string reverseOnlyLetters(string s) {

        // Step 1: Initialize two pointers
        int left = 0;
        int right = s.length() - 1;

        // Step 2: Traverse with two pointers
        while (left < right) {

            // If left is not a letter, skip it
            if (!isalpha(s[left])) {
                left++;
            }

            // If right is not a letter, skip it
            else if (!isalpha(s[right])) {
                right--;
            }

            // Both are letters, swap them
            else {

                // Swap
                swap(s[left], s[right]);

                // Move both pointers
                left++;
                right--;
            }
        }

        // Step 3: Return result
        return s;
    }
};
```

### Java Implementation

```java
class Solution {
    public String reverseOnlyLetters(String s) {
        // Step 1: Convert to character array
        char[] chars = s.toCharArray();
        
        // Step 2: Initialize two pointers
        int left = 0;
        int right = chars.length - 1;
        
        // Step 3: Traverse with two pointers
        while (left < right) {
            // If left is not a letter, skip it
            if (!Character.isLetter(chars[left])) {
                left++;
            }
            // If right is not a letter, skip it
            else if (!Character.isLetter(chars[right])) {
                right--;
            }
            // Both are letters, swap them
            else {
                // Swap
                char temp = chars[left];
                chars[left] = chars[right];
                chars[right] = temp;
                
                // Move both pointers
                left++;
                right--;
            }
        }
        
        // Step 4: Convert back to string and return
        return new String(chars);
    }
}
```

### Python Implementation

```python
class Solution:
    def reverseOnlyLetters(self, s: str) -> str:

        # Step 1: Convert string to list
        chars = list(s)

        # Step 2: Initialize two pointers
        left = 0
        right = len(chars) - 1

        # Step 3: Traverse with two pointers
        while left < right:

            # If left is not a letter, skip it
            if not chars[left].isalpha():
                left += 1

            # If right is not a letter, skip it
            elif not chars[right].isalpha():
                right -= 1

            # Both are letters, swap them
            else:
                # Swap
                chars[left], chars[right] = chars[right], chars[left]

                # Move both pointers
                left += 1
                right -= 1

        # Step 4: Convert back to string and return
        return "".join(chars)
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Let **N** be the total number of characters in the string.
- The algorithm uses two pointers that move toward each other.
- Each character in the string is checked at most once.
- The `Character.isLetter()` check takes constant time, or **O(1)**.
- The string is traversed in a single pass.
- Therefore, the total time complexity grows linearly and is **O(N)**

#### Space Complexity: O(N) or O(1)

- The space complexity can be interpreted as **O(N) **in java or **O(1) **in C++.
- A character array is created from the string since Java strings are immutable, which requires **O(N)** space.
- Only a few extra variables are used to manage the two pointers, which takes **O(1)** space.
- The algorithm performs swaps directly on the array, making the core operations **in-place**.
- Therefore, the overall space complexity is **O(N) **in java or **O(1) **in C++ due to the character array, while the algorithm itself uses **O(1)** extra space



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/reverse-only-letters---reverse-a-string-without-affecting-special-characters)*
