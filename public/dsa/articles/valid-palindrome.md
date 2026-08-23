# Valid Palindrome

> **Slug:** `valid-palindrome`  
> **Published:** 2026-07-04T21:54:52.045Z  
> **Updated:** 2026-07-04T21:54:52.136Z  
> **Keywords:** Valid Palindrome, Palindrome, Check Palindrome  
> **Cover Image:** ![Valid Palindrome](https://cdn.codehelp.in/media/valid palindrome.png)

**Description:** Learn how to check if a string is a valid palindrome. Explore both brute-force and optimal two-pointer approaches with examples and complexity.

---

## Problem Statement

Given a string ***s***, your task is to determine if it is a valid palindrome. 

A string is considered a palindrome if it reads the same backward as forward **after** removing all non-alphanumeric characters and converting all letters to lowercase.

A valid palindrome ignores case and any character that is not a letter or a number, treating them as if they do not exist in the string.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** "race a car"
> **Output:** f***alse***
> **Explanation: **The processed string becomes **"raceacar",** which is not a palindrome because it does not read the same forwards and backwards. **"raceacar"** is not equal to `"racacear"`.

### Example 2

> [!NOTE]
> **INFO**
> **Input: **s="A man, a plan, a canal: Panama"
> **Output:** ***true***
> **Explanation: **Ignoring case and non-alphanumeric characters, the processed string becomes **"amanaplanacanalpanama"**, which reads the same forwards and backwards, so it is a palindrome.

### Example 3

> [!NOTE]
> **INFO**
> **Input: **s=" "
> **Output:** ***true***
> **Explanation: **An empty string reads the same forwards and backwards, so it is considered a valid palindrome.

### Constraints

- The string ***s*** consists only of printable **ASCII** characters.
- The length of ***s*** is between 1 and 2 * 10^5.

## Real-Life Analogy

Imagine you find an old diary in your attic dusty, worn, and filled with scribbles, doodles, ink stains, and random symbols. But inside it, on one particular page, there’s a line written long ago by someone who loved puzzles. The line looks messy at first: it has punctuation marks, spaces, decorative swirls, and even some smudges from spilled tea. You can’t tell whether the message is special or just random scribbling.

Curious, you decide to figure out whether the sentence on that page is actually a hidden *palindrome*, something that reads the same forward and backward. But to check that properly, you must ignore all the extras the diary has collected over the years — the stains, the dots, the curly designs, and the scribbles in the margins. Those don’t matter. Only the actual letters and numbers written in the message matter, because that’s what the original writer intended.

So you take a soft cloth and gently brush away the ink smudges in your mind. You mentally erase every symbol or decoration that isn’t a real letter or a digit. You also don’t care about uppercase or lowercase a beautifully written “A” on the left is the same as a casually scribbled “a” on the right. You only keep the pure sequence of characters that truly form the message.

Once you’ve cleaned the sentence in your head leaving behind just the meaningful letters and numbers, you read it normally from start to end. Then, like a mirror, you read it backwards. If both readings give you the exact same string, you smile: the person who wrote this line left you a hidden palindrome, a quiet little secret preserved through time. If they don’t match, you know the message wasn’t meant to be one.

Just like cleaning that old diary entry to reveal whether it’s symmetrical, the task of checking a valid palindrome is simply about stripping away everything that doesn’t matter and comparing what remains, pure, simple, and reflective.

## Brute-Force Approach

### Intuition

The straightforward idea is to first “clean” the original string by removing everything that isn’t a letter or number and converting all characters to lowercase, so we are left with a simple, uniform version of the string without distractions. Once we have this cleaned version, we just compare it with its reversed form; if both are identical, the string is a palindrome. This method is very easy to understand because it treats the problem like checking a clean, polished mirror image—though it does use extra space since we create a new processed string.

### Algorithm

1. Firstly, we walk through the original string, keep only characters that are letters or digits, convert each kept character to lowercase, and append it to a new **cleaned** string. Because, Palindrome checks should ignore punctuation, spaces, and case differences. By collecting only alphanumeric characters and making them all lowercase we remove those distracting differences so the comparison becomes purely about the sequence of meaningful characters.
2. Create a reversed copy of the **cleaned** string such as, by using a reverse operation or by reading **cleaned** from end to start into a new string. A palindrome reads the same forwards and backwards. Reversing gives a direct mirror to compare against if the mirror matches, the sequence is symmetric.
3. At last, we compare the **cleaned** string with its reversed copy; return **true** if they are exactly the same, otherwise return **false**. After normalization, identical strings mean the characters read the same in both directions the definition of a palindrome.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    bool isPalindrome(string s) {

        // Step 1: Clean the string
        string cleaned = "";

        for (char c : s) {
            if (isalnum(c)) {
                cleaned += tolower(c);
            }
        }

        // Step 2: Check if cleaned string equals its reverse
        string reversedStr = cleaned;

        reverse(reversedStr.begin(), reversedStr.end());

        return cleaned == reversedStr;
    }
};
```

### Java Implementation

```java
class Solution {
    public boolean isPalindrome(String s) {
        // Step 1: Clean the string
        StringBuilder cleaned = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                cleaned.append(Character.toLowerCase(c));
            }
        }
        
        // Step 2: Check if cleaned string equals its reverse
        String cleanedStr = cleaned.toString();
        String reversedStr = cleaned.reverse().toString();
        
        return cleanedStr.equals(reversedStr);
    }
}
```

### Python Implementation

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:

        # Step 1: Clean the string
        cleaned = []

        for c in s:
            if c.isalnum():
                cleaned.append(c.lower())

        cleanedStr = "".join(cleaned)

        # Step 2: Check if cleaned string equals its reverse
        reversedStr = cleanedStr[::-1]

        return cleanedStr == reversedStr
```

### Complexity Analysis

#### Time Complexity: O(N)

- The algorithm **runs in linear time** because each phase is a simple pass over the characters.
- First, we **clean the string** by scanning every character once, which takes **O(N)**.
- Next, we **reverse the cleaned string**, which also costs **O(N)**.
- Finally, we **compare the cleaned string with its reversed copy**, another linear pass of length **N**.
- Since all three operations are linear, the **overall time complexity remains O(N)**.

#### **Space Complexity: O(N)**

- The approach **requires extra memory** because new strings are built during the process.
- The **cleaned string** can hold up to **N characters** in the worst case, contributing **O(N)** space.
- A **reversed version** of the cleaned string is also created, requiring another **O(N)** space.
- Since both strings grow proportionally with the input size, the **total auxiliary space is O(N)**.

## Optimal Approach

### Intuition

Instead of creating a new cleaned string, we treat the original string itself like a long road with two people standing at opposite ends one at the left and one at the right. Their goal is to walk toward each other while checking whether the characters they encounter still preserve the palindrome property.

As they move inward, they simply skip over anything that isn’t a letter or digit, because those characters don’t matter for the palindrome check. And whenever both sides land on valid characters, they compare them in a case-insensitiv** e**way to ensure ‘A’ and ‘a’ are treated the same.

If both sides always match as they walk toward the center, the string behaves like a mirror and is a valid palindrome. But if at any point the characters don’t match, we know immediately that the symmetry is broken.

The beauty of this approach is that we never build a new string or copy characters anywhere, we use the original string exactly as it is. That means we maintain the same linear time but reduce extra space to **O(1)**, because the only memory used is for the two pointers moving across the string.

### Algorithm

1. Set **left = 0** at the start of the string and **right = s.length() - 1** at the end. We do this because our strategy is to examine characters from both ends simultaneously, slowly moving toward the center just like checking both sides of a mirror.
2. As long as **left < right**, we keep evaluating both ends. First, we skip anything on the **left** side that isn’t a letter or digit by moving **left** forward. As this non-alphanumeric characters don’t play any role in palindrome identity. Then, we skip anything on the **right** side that isn’t alphanumeric by moving** right** backward. Again, this keeps us focused only on meaningful characters. Once both pointers land on valid characters, we compare them in a **case-insensitive** way.
If the lowercase versions don’t match, the symmetry breaks instantly and we can return **false**. If they match, we move both pointers inward **left++** and **right--** continuing the mirror check toward the center.
3. At last, If the entire loop finishes without any mismatch, it means every corresponding pair matched perfectly, so the string is a valid palindrome and we return **true**.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    bool isPalindrome(string s) {

        int left = 0;
        int right = s.length() - 1;

        while (left < right) {

            // Skip non-alphanumeric from left
            while (left < right && !isalnum(s[left])) {
                left++;
            }

            // Skip non-alphanumeric from right
            while (left < right && !isalnum(s[right])) {
                right--;
            }

            // Compare characters (case-insensitive)
            if (tolower(s[left]) != tolower(s[right])) {
                return false;
            }

            // Move pointers
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
    public boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            // Skip non-alphanumeric from left
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            
            // Skip non-alphanumeric from right
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            
            // Compare characters (case-insensitive)
            if (Character.toLowerCase(s.charAt(left)) != 
                Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            
            // Move pointers
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
    def isPalindrome(self, s: str) -> bool:

        left = 0
        right = len(s) - 1

        while left < right:

            # Skip non-alphanumeric from left
            while left < right and not s[left].isalnum():
                left += 1

            # Skip non-alphanumeric from right
            while left < right and not s[right].isalnum():
                right -= 1

            # Compare characters (case-insensitive)
            if s[left].lower() != s[right].lower():
                return False

            # Move pointers
            left += 1
            right -= 1

        return True
```

### Complexity Analysis

#### Time Complexity: O(N)

- This approach **runs in linear time** because each character in the string is processed **at most once**.
- The **two pointers** move only inward and **never revisit** any position.
- Every **skip, comparison, and pointer movement** happens in a single pass from both ends.
- Therefore, the **overall time complexity is O(N)**.

#### Space Complexity: O(1)

- The method **uses constant space** because it relies only on **two integer pointers**.
- It **does not create any additional strings or data structures**.
- All **comparisons are performed directly** on the original string, so no extra memory is allocated.
- Therefore, the **auxiliary space remains O(1)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/valid-palindrome)*
