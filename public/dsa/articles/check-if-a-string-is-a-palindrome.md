# Check if a String is a Palindrome

> **Slug:** `check-if-a-string-is-a-palindrome`  
> **Published:** 2026-07-04T21:32:39.844Z  
> **Updated:** 2026-07-04T21:32:39.850Z  
> **Keywords:** Check if a string is a Palindrome, Palindrome String  
> **Cover Image:** ![Check if a String is a Palindrome](6a497bf538cb2da009adbf95)

**Description:** Learn how to check if a string is a palindrome with step-by-step examples. Explore efficient approaches to handle different cases.

---

## Problem Statement

Given a string ***s***, your task is to determine whether the string is a palindrome or not. A string is considered a palindrome if it reads the same forwards and backwards.

For instance, the string "racecar" is a palindrome because it reads the same from left to right and right to left. Conversely, the string "hello" is not a palindrome due to the difference in the sequence when read in reverse.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  s = "madam"
> **Output:** true
> **Explanation:** The string "madam" reads identically forwards and backwards.

## Example 2

> [!NOTE]
> **INFO**
> **Input:** "hello"
> **Output:** false
> **Explanation:**The string "hello" does not have the same sequence when read backwards.

## Example 3

> [!NOTE]
> **INFO**
> **Input: ** "racecar"
> **Output:** true
> **Explanation: **The string "racecar" reads the same forward and backward.

## Constraints

- The length of string ***s*** is between **1** and** 10****5**
- The string ***s*** consists of ASCII characters.

### Real-Life Analogy

Imagine you are walking down your favorite childhood lane, the one you have walked on for years. It’s the path where you played with friends, where you ran barefoot in the rain, where every corner holds a soft memory. One day, you decide to walk this lane again, slowly, soaking in the nostalgia.

As you start your walk from the beginning, you notice the sequence of things you have always loved: a tall mango tree, the blue gate of your old neighbor’s house. You smile because everything feels familiar. Now imagine there is another path an invisible mirror path that starts from the opposite end of the lane and moves towards you. This mirrored path has the exact same landmarks, but in reverse order. Now comes the real magic. You decide to compare the two journeys, your walk from start to end, and the mirror walk from end to start. If every single thing matches perfectly, the mango tree meets the mango tree, the blue gate meets the blue gate, the corner shop meets the corner shop then the lane is special. It reads the same from both directions. It’s balanced. It’s a palindrome path. But sometimes, while comparing, you notice small mismatches. Maybe on your forward path you see the blue gate first, but on the backward path you see the stone first. Or maybe a shop appears too early on one side and too late on the other. That’s when you know the lane isn’t perfectly mirrored. It’s not a palindrome.
In the same way, checking a string for being a palindrome is like walking down memory lane from both ends:

- If both journeys forward and backward show the exact same sequence, the string is a palindrome.
- If even one landmark (or letter) doesn’t match, the path breaks and it’s not.

Only the strings that reflect themselves perfectly like a memory lane that feels the same from every direction earn the title of a true palindrome.

## Brute-Force Approach

### Intuition

The simplest way to check if a string is a palindrome is to reverse the entire string and then compare it with the original string. If the reversed string matches the original string character by character, then it's a palindrome. Otherwise, it's not. This approach is straightforward and easy to understand because we're literally checking if the string reads the same backwards.

### Algorithm

1. Firstly, We handle edge case If the string is null or has length 0 or 1, we return true immediately  as empty strings and single characters are palindromes by definition.
2. After handling the edge cases, we create a new string that contains all characters of the original string but in reverse order. We can do this by:
3. - Starting from the last character of the original string
  - Appending each character to a new string (or StringBuilder)
  - Moving backwards until we reach the first character
4. After creating the reversed string, we compare it with the original string character by character using the `equals()` method.
5. At last, If the original string and reversed string are equal, return `true`. Otherwise, return `false`.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

class PalindromeChecker {
public:
    
    static bool isPalindrome(string s) {

        // Edge case
        if (s.size() <= 1) {
            return true;
        }

        // Step 1: Reverse string
        string reversed = s;
        reverse(reversed.begin(), reversed.end());

        // Step 2: Compare
        return s == reversed;
    }
};

// Test cases
int main() {

    cout << PalindromeChecker::isPalindrome("racecar") << endl; // 1
    cout << PalindromeChecker::isPalindrome("hello") << endl;   // 0
    cout << PalindromeChecker::isPalindrome("noon") << endl;    // 1
    cout << PalindromeChecker::isPalindrome("a") << endl;       // 1
    cout << PalindromeChecker::isPalindrome("") << endl;        // 1

    return 0;
}
```

### index.java Implementation

```index.java
public class PalindromeChecker {
    
    // Brute Force: Reverse the string and compare
    public static boolean isPalindrome(String s) {
        // Edge case: null or empty string
        if (s == null || s.length() <= 1) {
            return true;
        }
        
        // Step 1: Reverse the string
        String reversed = reverseString(s);
        
        // Step 2: Compare original with reversed
        return s.equals(reversed);
    }
    
    // Helper method to reverse a string
    private static String reverseString(String s) {
        StringBuilder sb = new StringBuilder();
        
        // Traverse from end to start
        for (int i = s.length() - 1; i >= 0; i--) {
            sb.append(s.charAt(i));
        }
        
        return sb.toString();
    }
    
    // Utility function to test
    public static void main(String[] args) {
        // Test cases
        System.out.println(isPalindrome("racecar"));  // true
        System.out.println(isPalindrome("hello"));    // false
        System.out.println(isPalindrome("noon"));     // true
        System.out.println(isPalindrome("a"));        // true
        System.out.println(isPalindrome(""));         // true
    }
}
```

### index.py Implementation

```index.py
class PalindromeChecker:

    @staticmethod
    def is_palindrome(s: str) -> bool:
        # Edge case: None or short string
        if s is None or len(s) <= 1:
            return True

        # Step 1: Reverse string
        reversed_s = s[::-1]

        # Step 2: Compare
        return s == reversed_s


# Test cases
if __name__ == "__main__":
    print(PalindromeChecker.is_palindrome("racecar"))  # True
    print(PalindromeChecker.is_palindrome("hello"))    # False
    print(PalindromeChecker.is_palindrome("noon"))     # True
    print(PalindromeChecker.is_palindrome("a"))        # True
    print(PalindromeChecker.is_palindrome(""))         # True
```

### Complexity Analysis

#### Time Complexity: O(N)

- We traverse the entire string once to create the reversed string.
- This takes O(N) time where N is the length of the string.
- Then we compare the two strings character by character, which also takes O(N) time in the worst case.
- So total time is O(N) + O(N) = O(N).

#### **Space Complexity: O(N)**

- We create a new string (or StringBuilder) to store the reversed version of the original string.
- This requires O(N) extra space where N is the length of the string.
- The comparison operation uses constant space, but the reversed string storage dominates the space complexity.

## Optimal Approach

### Intuition

Instead of creating a reversed copy of the entire string, we can use a **two-pointer technique**. The key insight is that in a palindrome, the first character must match the last character, the second must match the second-last, and so on. We place one pointer at the start and another at the end. We compare characters at both pointers and move them toward the center. If we find any mismatch, we immediately return false. If we reach the center without finding a mismatch, it's a palindrome. This approach is optimal because we only traverse half the string and don't use any extra space for storing a reversed copy.

### Algorithm

1. Before doing anything, check if the string is either `null`, empty, or has only one character.
In all these situations, the string is automatically a palindrome because there is nothing to compare. So, return `true` immediately without any further steps.
2. Place one pointer at the very beginning of the string as this is the left pointer, And place the other pointer at the very end of the string as this is the *right* pointer.
These two pointers mark the characters that need to be compared first.
3. Repeat the process as long as the left pointer is still before the right pointer. At each step, compare the character at the left position with the character at the right position. If they are different at any moment, then the string cannot be a palindrome, so return `false` right away.
If the characters match, move both pointers closer to the center by increasing the left pointer and decreasing the right pointer.
4. If the entire loop finishes without finding a mismatch, it means every pair of characters matched correctly. This confirms that the string reads the same forward and backward. So, return `true` because the string is a palindrome.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class PalindromeCheckerOptimal {
public:
    
    static bool isPalindrome(string s) {

        // Edge case: empty or single character
        if (s.size() <= 1) {
            return true;
        }

        int left = 0;
        int right = s.size() - 1;

        while (left < right) {
            if (s[left] != s[right]) {
                return false;
            }
            left++;
            right--;
        }

        return true;
    }
};

// Test cases
int main() {

    cout << PalindromeCheckerOptimal::isPalindrome("racecar") << endl; // 1
    cout << PalindromeCheckerOptimal::isPalindrome("hello") << endl;   // 0
    cout << PalindromeCheckerOptimal::isPalindrome("noon") << endl;    // 1
    cout << PalindromeCheckerOptimal::isPalindrome("a") << endl;       // 1
    cout << PalindromeCheckerOptimal::isPalindrome("") << endl;        // 1
    cout << PalindromeCheckerOptimal::isPalindrome("ab") << endl;      // 0
    cout << PalindromeCheckerOptimal::isPalindrome("aba") << endl;     // 1

    return 0;
}
```

### index.java Implementation

```index.java
public class PalindromeCheckerOptimal {
    
    // Optimal Approach: Two-Pointer Technique
    public static boolean isPalindrome(String s) {
        // Edge case: null or empty string
        if (s == null || s.length() <= 1) {
            return true;
        }
        
        // Initialize two pointers
        int left = 0;
        int right = s.length() - 1;
        
        // Traverse from both ends toward center
        while (left < right) {
            // Compare characters at both pointers
            if (s.charAt(left) != s.charAt(right)) {
                return false;  // Mismatch found
            }
            
            // Move pointers toward center
            left++;
            right--;
        }
        
        // All characters matched
        return true;
    }
    
    // Utility function to test
    public static void main(String[] args) {
        // Test cases
        System.out.println("Test 1: " + isPalindrome("racecar"));  // true
        System.out.println("Test 2: " + isPalindrome("hello"));    // false
        System.out.println("Test 3: " + isPalindrome("noon"));     // true
        System.out.println("Test 4: " + isPalindrome("a"));        // true
        System.out.println("Test 5: " + isPalindrome(""));         // true
        System.out.println("Test 6: " + isPalindrome("ab"));       // false
        System.out.println("Test 7: " + isPalindrome("aba"));      // true
    }
}
```

### index.py Implementation

```index.py
class PalindromeCheckerOptimal:

    @staticmethod
    def is_palindrome(s: str) -> bool:
        # Edge case: None or short string
        if s is None or len(s) <= 1:
            return True

        left, right = 0, len(s) - 1

        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1

        return True


# Test cases
if __name__ == "__main__":
    print(PalindromeCheckerOptimal.is_palindrome("racecar"))  # True
    print(PalindromeCheckerOptimal.is_palindrome("hello"))    # False
    print(PalindromeCheckerOptimal.is_palindrome("noon"))     # True
    print(PalindromeCheckerOptimal.is_palindrome("a"))        # True
    print(PalindromeCheckerOptimal.is_palindrome(""))         # True
    print(PalindromeCheckerOptimal.is_palindrome("ab"))       # False
    print(PalindromeCheckerOptimal.is_palindrome("aba"))      # True
```

### Complexity Analysis

#### Time Complexity: O(N)

- We traverse the string using two pointers that move toward each other.
- In the worst case (when the string is a palindrome), we check all characters up to the middle of the string.
- Since we're moving from both ends simultaneously, we only need to check N/2 characters, but this is still O(N) in Big-O notation.
- At each step, we do constant-time operations: comparing two characters and moving pointers.
- Therefore, the overall time complexity is O(N) where N is the length of the string.
- Here, **No reversal / No extra string creation**. Unlike the brute force approach which creates a reversed copy (taking O(N) time and space), here we just use pointer comparison which is much more efficient in practice.

#### Space Complexity: O(1)

- We only use two integer variables (`left` and `right`) to store the pointer positions.
- No matter how large the input string is, we always use the same constant amount of extra space.
- We don't create any new strings or data structures. Therefore, the space complexity is O(1) (constant space).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/check-if-a-string-is-a-palindrome)*
