# Convert a String to Uppercase

> **Slug:** `convert-a-string-to-uppercase`  
> **Published:** 2026-07-04T21:21:49.930Z  
> **Updated:** 2026-07-04T21:21:49.936Z  
> **Keywords:** Convert a String to Uppercase, Uppercase  
> **Cover Image:** ![Convert a String to Uppercase](https://cdn.codehelp.in/media/Convert a String upper.png)

**Description:** Learn how to convert a string to uppercase using simple methods and examples. Step-by-step guide to handle strings efficiently in any language.

---

## Problem Statement

In this task, you need to create a function that transforms all lowercase letters in a given string to their corresponding uppercase counterparts. The function should only process ASCII characters, ensuring that digits, punctuation marks, and other non lowercase characters remain unaffected. The goal is to iterate through each character of the string and convert uppercase letters wherever necessary.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  "hello world"
> **Output:** HELLO WORLD
> **Explanation:** All lowercase letters are converted to uppercase.

## Example 2

> [!NOTE]
> **INFO**
> **Input:**"TeStInG"
> **Output:** TESTING
> **Explanation:**Mixed uppercase and lowercase letters are converted to all uppercase.

## Example 3

> [!NOTE]
> **INFO**
> **Input: **"c++ programming"
> **Output:** C++ PROGRAMMING
> **Explanation: **Letters are converted to uppercase, but special characters remain unchanged.

## Constraints

- The length of the string `s` will be in the range [1, 100].
- The string `s` consists of printable ASCII characters only.
- No external libraries for string manipulation are allowed.

### Real-Life Analogy

Imagine you work at a newspaper printing press. Your job is to prepare headlines for the front page. According to the newspaper's style guide, all headlines must be printed in UPPERCASE letters to grab readers' attention. Every morning, reporters submit their headline drafts. Some write in lowercase like "breaking news today", some use mixed case like "Stock Market Hits Record High", and some already use uppercase. 

You sit at your desk with a red pen and a simple rule book:

- If you see a lowercase letter (a z), circle it and write its uppercase version (A-Z) above it
- If you see anything else numbers, punctuation marks, spaces, or letters already in uppercase leave them exactly as they are.
For example, when you receive "Breaking news: 50 injured in accident!", you work through each character:
- 'B' → already uppercase, leave it
- 'r' → lowercase, convert to 'R'
- 'e' → lowercase, convert to 'E'
- ... and so on
- '5' → digit, leave it
- '0' → digit, leave it
- '!' → punctuation, leave it

After processing: "BREAKING NEWS: 50 INJURED IN ACCIDENT!"

### Brute-Force Approach
Intuition

The simplest and most straightforward way to convert a string to uppercase is to use the built-in `toUpperCase()` method provided by Java's String class. This method internally handles all the conversion logic for us. It processes each character in the string, checks if it's a lowercase letter, and converts it to uppercase if needed. While this is called "brute-force," it's actually the standard and most efficient way to solve this problem in Java because it's a well optimized built-in function.

### Algorithm

1. Before applying any conversion, check the input string carefully. If the string is `null`, return `null` immediately because there is nothing to convert. If the string is empty, return an empty string since there are no characters that need changing. This avoids unnecessary work and prevents errors.
2. After the basic checks, call the built-in `toUpperCase()` method on the string. This method goes through the string character by character. For every lowercase letter it finds, it converts it to the matching uppercase letter. Characters that are not lowercase such as digits, punctuation marks, spaces, and already uppercase letters are left exactly as they are. The conversion happens automatically and efficiently inside the built-in method.
3. Once the conversion is done, the method gives back a new string where all lowercase letters have been replaced with their uppercase versions. Return this newly created uppercase string as the final output.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

class StringToUppercaseBrute {
public:
    
    static string convertToUppercase(string str) {

        // Step 1: Handle empty string
        if (str.empty()) {
            return "";
        }

        // Step 2: Convert using built-in transform
        transform(str.begin(), str.end(), str.begin(), ::toupper);

        return str;
    }
};

// Test cases
int main() {

    cout << StringToUppercaseBrute::convertToUppercase("hello world") << endl;
    cout << StringToUppercaseBrute::convertToUppercase("Java123") << endl;
    cout << StringToUppercaseBrute::convertToUppercase("") << endl;

    return 0;
}
```

### index.java Implementation

```index.java
public class StringToUppercaseBrute {

    // Brute Force Approach - Using Built-in toUpperCase() Method
    public static String convertToUppercase(String str) {

        // Step 1: Handle null input
        if (str == null) {
            return null;
        }

        // Step 2: Handle empty string
        if (str.isEmpty()) {
            return "";
        }

        // Step 3: Convert string to uppercase
        String upperCaseString = str.toUpperCase();

        // Step 4: Return the converted string
        return upperCaseString;
    }

    public static void main(String[] args) {

        String str1 = "hello world";
        String str2 = "Java123";
        String str3 = "";
        String str4 = null;

        System.out.println(convertToUppercase(str1)); // HELLO WORLD
        System.out.println(convertToUppercase(str2)); // JAVA123
        System.out.println(convertToUppercase(str3)); // ""
        System.out.println(convertToUppercase(str4)); // null
    }
}
```

### index.py Implementation

```index.py
class StringToUppercaseBrute:

    @staticmethod
    def convert_to_uppercase(s):
        # Step 1: Handle None input
        if s is None:
            return None
        
        # Step 2: Handle empty string
        if len(s) == 0:
            return ""
        
        # Step 3: Use built-in method
        return s.upper()


# Test cases
if __name__ == "__main__":
    print(StringToUppercaseBrute.convert_to_uppercase("hello world"))
    print(StringToUppercaseBrute.convert_to_uppercase("Java123"))
    print(StringToUppercaseBrute.convert_to_uppercase(""))
    print(StringToUppercaseBrute.convert_to_uppercase(None))
```

### Complexity Analysis

#### Time Complexity: O(N)

- The **toUpperCase()** method internally iterates through each character in the string exactly once.
- For each character, it performs a constant-time check to determine if it's a lowercase letter and converts it if necessary.
- Therefore, if the string has N characters, the time complexity is O(N).
- The method processes all N characters sequentially, making it linear time complexity.

#### **Space Complexity: O(N)**

- The algorithm creates a new string (or character array) to store the converted result.
- This requires space proportional to the length of the input string **N**.
- Even though no extra data structures like stacks or maps are used, the output storage itself contributes to space usage.
- Any intermediate representation (like a character array or list) also scales linearly with input size.
- Therefore, the overall space complexity is **O(N)**.

## Optimal Approach

### Intuition

While using the built-in `toUpperCase()` method is the standard approach, understanding how to manually convert characters helps us learn about ASCII values and character manipulation. The key insight is that in ASCII encoding, lowercase letters (a-z) and uppercase letters (A-Z) are separated by exactly 32 positions. Lowercase 'a' has ASCII value 97, and uppercase 'A' has value 65. The difference is 32. So, to convert any lowercase letter to uppercase, we simply subtract 32 from its ASCII value. We iterate through each character, check if it's a lowercase letter (ASCII value between 97-122), and if so, subtract 32 to get the uppercase equivalent. All other characters remain unchanged.

### Algorithm

1. Start by checking if the input string is `null`. If it is, return `null` immediately because there is no content to process. If the string is empty, simply return an empty string since there are no characters that need conversion.
2. Transform the string into a character array. This allows you to access and modify each character directly, which makes the manual uppercase conversion easier and more efficient.
3. Now move through the character array from the first index to the last. For each position, pick the current character.
Check whether this character is a lowercase English letter. This is done by verifying if it lies between `'a'` and `'z'`. If it is lowercase, convert it to uppercase by adjusting its ASCII value (subtracting 32 or shifting from `'a'` to `'A'`). If the character is not lowercase such as digits, punctuation, spaces, or already uppercase letters leave it unchanged. Store the final (converted or unchanged) character back into the same position in the array.
4. After processing all characters, create a new string using the updated character array. This new string represents the fully converted uppercase version of the original input.
5. Return the newly formed uppercase string as the output.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class StringToUppercaseOptimal {
public:
    
    static string convertToUppercase(string str) {

        // Step 1: Handle empty string
        if (str.empty()) {
            return "";
        }

        // Step 2: Traverse and convert
        for (int i = 0; i < str.size(); i++) {
            if (str[i] >= 'a' && str[i] <= 'z') {
                str[i] = char(str[i] - 32);
            }
        }

        return str;
    }
};

// Test cases
int main() {

    cout << StringToUppercaseOptimal::convertToUppercase("hello world") << endl;
    cout << StringToUppercaseOptimal::convertToUppercase("Breaking news: 50 injured!") << endl;
    cout << StringToUppercaseOptimal::convertToUppercase("Java123") << endl;
    cout << StringToUppercaseOptimal::convertToUppercase("") << endl;

    return 0;
}
```

### index.java Implementation

```index.java
public class StringToUppercaseOptimal {

    // Optimal Approach - Manual ASCII Conversion
    public static String convertToUppercase(String str) {

        // Step 1: Handle null input
        if (str == null) {
            return null;
        }

        // Step 2: Handle empty string
        if (str.isEmpty()) {
            return "";
        }

        // Step 3: Convert string to character array
        char[] chars = str.toCharArray();

        // Step 4: Traverse each character
        for (int i = 0; i < chars.length; i++) {

            // Check if character is lowercase
            if (chars[i] >= 'a' && chars[i] <= 'z') {

                // Convert lowercase to uppercase using ASCII difference
                chars[i] = (char) (chars[i] - 32);
            }
        }

        // Step 5: Create new string from updated array
        return new String(chars);
    }

    // Driver code
    public static void main(String[] args) {

        System.out.println(convertToUppercase("hello world"));
        // HELLO WORLD

        System.out.println(convertToUppercase("Breaking news: 50 injured!"));
        // BREAKING NEWS: 50 INJURED!

        System.out.println(convertToUppercase("Java123"));
        // JAVA123

        System.out.println(convertToUppercase(""));
        // ""

        System.out.println(convertToUppercase(null));
        // null
    }
}
```

### index.py Implementation

```index.py
class StringToUppercaseOptimal:

    @staticmethod
    def convert_to_uppercase(s: str):
        # Step 1: Handle None input
        if s is None:
            return None
        
        # Step 2: Handle empty string
        if len(s) == 0:
            return ""
        
        # Step 3: Convert to list (since strings are immutable)
        chars = list(s)

        # Step 4: Traverse and convert
        for i in range(len(chars)):
            if 'a' <= chars[i] <= 'z':
                chars[i] = chr(ord(chars[i]) - 32)

        # Step 5: Return final string
        return "".join(chars)


# Test cases
if __name__ == "__main__":
    print(StringToUppercaseOptimal.convert_to_uppercase("hello world"))
    print(StringToUppercaseOptimal.convert_to_uppercase("Breaking news: 50 injured!"))
    print(StringToUppercaseOptimal.convert_to_uppercase("Java123"))
    print(StringToUppercaseOptimal.convert_to_uppercase(""))
    print(StringToUppercaseOptimal.convert_to_uppercase(None))
```

### Complexity Analysis

#### Time Complexity: O(N)

- We traverse the string character by character exactly once.
- For each character, we perform a constant-time check (is it lowercase?) and potentially a constant-time conversion (subtract 32 or perform bit manipulation).
- Since we process each of the N characters once with O(1) operations per character, the overall time complexity is O(N) where N is the length of the string.
- Here, **No function call overhead**: Unlike the built-in method which may have additional overhead, our manual implementation directly processes each character in a simple loop, making it very efficient in practice.

#### Space Complexity: O(N)

- We create a character array from the input string which requires O(N) space.
- Then, we create a new string from this array, which also requires O(N) space.
- However, since strings in Java are immutable, this space is necessary for the result.
- Therefore, the space complexity is O(N).
- ***Note that the character array is temporary storage, but it's the same size as the input, so it still contributes O(N) to space complexity.***







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/convert-a-string-to-uppercase)*
