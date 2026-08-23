# String to Integer (atoi)

> **Slug:** `string-to-integer-atoi`  
> **Published:** 2026-07-03T19:14:53.540Z  
> **Updated:** 2026-07-03T19:14:53.547Z  
> **Keywords:** String to Integer, String, Conversion  
> **Cover Image:** ![String to Integer (atoi)](https://cdn.codehelp.in/media/String to integr.png)

**Description:** Learn how to convert a string to a 32-bit integer with myAtoi. Covers brute-force and state-machine approaches with complexity and dry runs.

---

## Problem Statement

In this problem, you are required to implement a function ***myAtoi(string s)*** that converts a given string to a 32-bit signed integer. This function behaves similarly to the C/C++ ***atoi***  function. The conversion process must follow these specific steps:

1. Skip any leading whitespace characters in the string.
2. Check for an optional '+' or '-' sign. Record the sign if it is present to correctly apply it to the result.
3. Read the string of digits following the '+' or '-' sign. Stop reading if a non-digit character is encountered.
4. Convert the sequence of digits into an integer and apply the recorded sign.
5. Ensure that the resulting integer is within the limits of a 32-bit signed integer (i.e., from -2^31 to 2^31 - 1). If it exceeds this range, return the respective boundary value.
6. Return the resulting integer.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** s = '42'
> **Output:** 42
> **Explanation: **The string '42' is converted to the integer 42.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** s = ' -42'
> **Output:** -42
> **Explanation:** The string '-42' is converted to the integer -42 after ignoring leading whitespace.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** s = '4193 with words'
> **Output: **4193
> **Explanation: **The string is converted to 4193; non-numeric suffix ignored.

### Constraints

- 0 <=** s.length** <= 200
- **s** consists of **English** **letters** (both uppercase and lowercase), digits (0-9), ' ', '+', '-', and '.'.

## Real-Life Analogy

Imagine you are at a ticket counter, and someone hands you a piece of paper with a number written on it. Your task is to figure out how many tickets they want. First, you **ignore any extra spaces** at the start of the paper, because they don’t matter. Then, you **look for a sign** at the beginning: a '+' means they want normal tickets, a '-' means it’s some sort of cancellation or negative request.

Next, you **read the digits one by one**, stopping as soon as you see anything that isn’t a number, like a letter or symbol. You **combine the digits** into a single number and apply the sign you found.

Finally, you **check the limits of the ticket system**: if the number is too large or too small to handle, you cap it at the maximum or minimum allowed value. At the end, you **return the valid number of tickets** you can process.

This is exactly how **atoi** works: it carefully reads a string, interprets its numeric value, applies a sign, and ensures it stays within the allowed 32-bit integer range.

## Brute-Force Approach

### Intuition

For the brute force approach we examines the input string **one **character at a time, handling every scenario explicitly. It **checks each character type** spaces, signs, digits, or invalid characters using separate flags and variables to keep track of the current state. This method ensures that **all edge cases** are handled safely, such as leading spaces, optional signs, non-digit interruptions, and integer overflow. Each digit is **converted step by step**, with checks to prevent exceeding the 32-bit integer range, so that the final result is always valid and accurate.

### Algorithm

1. First, we prepare all the variables we need to process the string. We set **result = 0** to store the numeric value as we build it. The **sign = 1** assumes the number is positive unless a negative sign is encountered. We also set **index = 0** to track our position in the string, and a **started** flag to know whether we have begun reading digits.
2. We move forward in the string while the current character is a space. This ensures that any leading spaces are ignored, and we start processing from the first meaningful character (which could be a digit or a sign).
3. Once we reach a non-space character, we check if it is **'+'** or **'-'**. If it is **'-'**, we set **sign = -1** to indicate a negative number. If it is **'+'**, we leave **sign = 1**. We then increment **index** to move past the sign. Only one sign is allowed, and it must appear before any digits.
4. We now read each character as long as it is a digit. For each digit:

- - Convert the character to its numeric value.
  - Check if adding this digit would cause **integer overflow**, i.e., exceed the limits of a 32-bit signed integer.
  - Update **result** using **result = result * 10 + digit**.
  - Move to the next character. This step carefully accumulates the number while ensuring we stay within integer limits.

1. After finishing the digit parsing, we multiply **result** by **sign** to get the correct positive or negative number. Finally, we ensure that the result does not exceed the 32-bit integer range (**-2³¹ to 2³¹ - 1**). If it does, we clamp it to the nearest boundary.
2. We **return the final integer** value as the result of the conversion. If no digits were found, or the input was invalid, the result would be **0** or clamped to the boundaries as necessary.

### Dry Run



### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
#include <climits>
using namespace std;

class Solution {
public:
    int myAtoi(string s) {
        // Step 1: Initialize variables
        int index = 0;
        int n = s.length();
        int sign = 1;
        int result = 0;

        // Handle empty string
        if (n == 0) return 0;

        // Step 2: Skip leading whitespace
        while (index < n && s[index] == ' ') {
            index++;
        }

        // Check if we've reached the end after whitespace
        if (index == n) return 0;

        // Step 3: Check for sign
        if (s[index] == '+' || s[index] == '-') {
            sign = (s[index] == '-') ? -1 : 1;
            index++;
        }

        // Step 4: Read digits and build the number
        while (index < n) {
            char currentChar = s[index];

            // Check if character is a digit
            if (currentChar < '0' || currentChar > '9') {
                break;
            }

            // Extract digit value
            int digit = currentChar - '0';

            // Check for overflow BEFORE updating result
            if (result > INT_MAX / 10 ||
                (result == INT_MAX / 10 && digit > INT_MAX % 10)) {
                return (sign == 1) ? INT_MAX : INT_MIN;
            }

            // Update result
            result = result * 10 + digit;
            index++;
        }

        // Step 5: Apply sign and return
        return result * sign;
    }
};

int main() {
    Solution solution;

    cout << solution.myAtoi("42") << endl;               // Output: 42
    cout << solution.myAtoi("   -42") << endl;           // Output: -42
    cout << solution.myAtoi("4193 with words") << endl;  // Output: 4193
    cout << solution.myAtoi("words and 987") << endl;    // Output: 0
    cout << solution.myAtoi("-91283472332") << endl;     // Output: -2147483648

    return 0;
}
```

### index.java Implementation

```index.java
class Solution {
    public int myAtoi(String s) {
        // Step 1: Initialize variables
        int index = 0;
        int n = s.length();
        int sign = 1;
        int result = 0;
        
        // Handle empty string
        if (n == 0) return 0;
        
        // Step 2: Skip leading whitespace
        while (index < n && s.charAt(index) == ' ') {
            index++;
        }
        
        // Check if we've reached end after whitespace
        if (index == n) return 0;
        
        // Step 3: Check for sign
        if (s.charAt(index) == '+' || s.charAt(index) == '-') {
            sign = (s.charAt(index) == '-') ? -1 : 1;
            index++;
        }
        
        // Step 4: Read digits and build number
        while (index < n) {
            char currentChar = s.charAt(index);
            
            // Check if character is a digit
            if (currentChar < '0' || currentChar > '9') {
                break; // Stop at first non-digit
            }
            
            // Extract digit value
            int digit = currentChar - '0';
            
            // Check for overflow BEFORE updating result
            // For positive numbers: check against INT_MAX (2147483647)
            if (result > Integer.MAX_VALUE / 10 || 
                (result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {
                return (sign == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            
            // Update result
            result = result * 10 + digit;
            index++;
        }
        
        // Step 5: Apply sign and return
        return result * sign;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def myAtoi(self, s: str) -> int:
        # Step 1: Initialize variables
        index = 0
        n = len(s)
        sign = 1
        result = 0

        # Handle empty string
        if n == 0:
            return 0

        # Step 2: Skip leading whitespace
        while index < n and s[index] == ' ':
            index += 1

        # Check if we've reached the end after whitespace
        if index == n:
            return 0

        # Step 3: Check for sign
        if s[index] == '+' or s[index] == '-':
            sign = -1 if s[index] == '-' else 1
            index += 1

        # Step 4: Read digits and build the number
        while index < n:
            current_char = s[index]

            # Check if character is a digit
            if current_char < '0' or current_char > '9':
                break

            # Extract digit value
            digit = ord(current_char) - ord('0')

            # Check for overflow BEFORE updating result
            if result > (2**31 - 1) // 10 or (
                result == (2**31 - 1) // 10 and digit > (2**31 - 1) % 10
            ):
                return 2**31 - 1 if sign == 1 else -2**31

            # Update result
            result = result * 10 + digit
            index += 1

        # Step 5: Apply sign and return
        return result * sign


# Driver Code
solution = Solution()

print(solution.myAtoi("42"))              # Output: 42
print(solution.myAtoi("   -42"))          # Output: -42
print(solution.myAtoi("4193 with words")) # Output: 4193
print(solution.myAtoi("words and 987"))   # Output: 0
print(solution.myAtoi("-91283472332"))    # Output: -2147483648
```

### Complexity Analysis

#### Time Complexity: O(N)

- The algorithm traverses the string **once from left to right**.
- Each character is examined **only once**.
- No character is revisited or processed multiple times.
- Therefore, the total work grows **linearly with the string length**.
- The overall **time complexity is O(N)**.

#### Space Complexity: O(1)

- The algorithm uses only a **few fixed variables**, such as `result`, `sign`, and `index`.
- It does **not allocate any additional data structures** or buffers.
- Memory usage remains **constant**, regardless of the input string length.
- Therefore, the **space complexity is O(1)**.

## Optimal Approach

### Intuition

The entire parsing process can be visualized as moving through a series of well-defined states, where each state represents a specific phase of reading the string. Instead of relying on scattered if-else checks, the logic flows naturally from one state to another depending on what character is encountered next. When a space appears, the machine remains in the initial state; when a sign is detected, it transitions to the sign-reading state; when digits appear, it moves into the number-building state; and the moment a non-digit appears, it shifts into a stopping state. This structured movement between states makes the code easier to reason about, reduces the chances of missing edge cases, and creates a more predictable and maintainable parsing flow.

### Algorithm

1. This approach treats the **parsing process as a sequence of states**, where each state defines what kind of **input is valid next**. The parsing begins in the **START state**, which allows whitespace to be skipped, a sign to be read, or digits to begin. If whitespace appears, the parser remains in START; if a plus or minus sign appears, it moves to the SIGNED state; and if a digit appears, it shifts to the IN_NUMBER state. Any other character ends the parsing immediately.
2. From the **SIGNED state**, only a digit can transition the **parser into the IN_NUMBER state**; otherwise, the parsing moves to the END state. Once in the IN_NUMBER state, the parser keeps reading digits and building the number until a non-digit appears, which again sends it to the END state.
3. During number formation, overflow is checked before updating the result to ensure the value stays within **32-bit integer limits**. By following these smooth transitions between states, the algorithm becomes structured, predictable, and more maintainable than handling all cases with scattered conditional checks.

### Dry Run



### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int myAtoi(string s) {
        // Step 1: Initialize variables
        int index = 0;
        int n = s.length();
        int sign = 1;
        int result = 0;

        // Handle empty string
        if (n == 0) return 0;

        // Step 2: Skip leading whitespace
        while (index < n && s[index] == ' ') {
            index++;
        }

        // Check if we've reached the end after whitespace
        if (index == n) return 0;

        // Step 3: Check for sign
        if (s[index] == '+' || s[index] == '-') {
            sign = (s[index] == '-') ? -1 : 1;
            index++;
        }

        // Step 4: Read digits and build number
        while (index < n) {
            char currentChar = s[index];

            // Stop at first non-digit
            if (currentChar < '0' || currentChar > '9') {
                break;
            }

            // Extract digit value
            int digit = currentChar - '0';

            // Check for overflow BEFORE updating result
            if (result > INT_MAX / 10 ||
                (result == INT_MAX / 10 && digit > INT_MAX % 10)) {
                return (sign == 1) ? INT_MAX : INT_MIN;
            }

            // Update result
            result = result * 10 + digit;
            index++;
        }

        // Step 5: Apply sign and return
        return result * sign;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public int myAtoi(String s) {
        // Step 1: Initialize variables
        int index = 0;
        int n = s.length();
        int sign = 1;
        int result = 0;
        
        // Handle empty string
        if (n == 0) return 0;
        
        // Step 2: Skip leading whitespace
        while (index < n && s.charAt(index) == ' ') {
            index++;
        }
        
        // Check if we've reached end after whitespace
        if (index == n) return 0;
        
        // Step 3: Check for sign
        if (s.charAt(index) == '+' || s.charAt(index) == '-') {
            sign = (s.charAt(index) == '-') ? -1 : 1;
            index++;
        }
        
        // Step 4: Read digits and build number
        while (index < n) {
            char currentChar = s.charAt(index);
            
            // Check if character is a digit
            if (currentChar < '0' || currentChar > '9') {
                break; // Stop at first non-digit
            }
            
            // Extract digit value
            int digit = currentChar - '0';
            
            // Check for overflow BEFORE updating result
            // For positive numbers: check against INT_MAX (2147483647)
            if (result > Integer.MAX_VALUE / 10 || 
                (result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {
                return (sign == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            
            // Update result
            result = result * 10 + digit;
            index++;
        }
        
        // Step 5: Apply sign and return
        return result * sign;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def myAtoi(self, s: str) -> int:
        # Step 1: Initialize variables
        index = 0
        n = len(s)
        sign = 1
        result = 0

        # Handle empty string
        if n == 0:
            return 0

        # Step 2: Skip leading whitespace
        while index < n and s[index] == ' ':
            index += 1

        # Check if we've reached the end after whitespace
        if index == n:
            return 0

        # Step 3: Check for sign
        if s[index] == '+' or s[index] == '-':
            sign = -1 if s[index] == '-' else 1
            index += 1

        # Step 4: Read digits and build number
        while index < n:
            current_char = s[index]

            # Stop at first non-digit
            if current_char < '0' or current_char > '9':
                break

            # Extract digit value
            digit = ord(current_char) - ord('0')

            # Check for overflow BEFORE updating result
            if (result > 2**31 // 10 or
                (result == 2**31 // 10 and digit > 2**31 - 1 % 10)):
                return 2**31 - 1 if sign == 1 else -2**31

            # Update result
            result = result * 10 + digit
            index += 1

        # Step 5: Apply sign and return
        return result * sign
```

### Complexity Analysis

#### Time Complexity: O(N)

- The algorithm processes **each character in the string exactly once**.
- No character is revisited, and there are **no nested loops**.
- The total work grows **directly proportional to the string length**.
- Therefore, the overall **time complexity is O(N)**.

#### Space Complexity: O(1)

- The algorithm uses only a **fixed number of variables**, such as pointers, a sign indicator, and an accumulator.
- No additional data structures are created that grow with the input size.
- Memory usage remains **constant**, regardless of the string length.
- Therefore, the overall **space complexity is O(1)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/string-to-integer-atoi)*
