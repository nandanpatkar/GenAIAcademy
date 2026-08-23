# Convert a String to Lowercase

> **Slug:** `convert-a-string-to-lowercase`  
> **Published:** 2026-07-04T21:11:47.117Z  
> **Updated:** 2026-07-04T21:11:47.134Z  
> **Keywords:** Convert a String to Lowercase, Lowercase  
> **Cover Image:** ![Convert a String to Lowercase](https://cdn.codehelp.in/media/Convert a String lower.png)

**Description:** Learn how to convert any string to lowercase using built-in methods and custom approaches. Step-by-step examples for easy implementation.

---

## Problem Statement

You are given a string ***s*** composed of both uppercase and lowercase English alphabetical characters. Your task is to transform all the characters in the string into lowercase. Create a function that accepts this string and returns a new string with all characters converted to lowercase.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  "Hello World"
> **Output:** hello world
> **Explanation:** All uppercase letters are converted to lowercase.

## Example 2

> [!NOTE]
> **INFO**
> **Input:**"TeStInG"
> **Output:** testing
> **Explanation:** Mixed uppercase and lowercase letters are converted to all lowercase.

## Example 3

> [!NOTE]
> **INFO**
> **Input: **"C++ Programming"
> **Output:** c++ programming
> **Explanation: **Letters are converted to lowercase, but special characters remain unchanged.

## Constraints

- 1 ≤ |s| ≤ 1000
- The string may contain only English alphabetic characters and spaces.

### Real-Life Analogy

Imagine you work in a big old library that receives donations of used books every week. One morning, a huge box of books arrives, but there’s a problem—the titles on the covers are written in all kinds of styles.

Some books have their titles in BIG BOLD CAPITAL LETTERS,
some have tiny lowercase letters,
and some have a mix of both.

Your job for the day is to prepare these books to be added to the library’s digital catalog. But the catalog has one rule:

> **All book titles must be written in lowercase so everything looks consistent.**

So you set up a small table and start going through the books one by one. For each book, you carefully read the title on the cover. If a letter is already small, you leave it as it is. But whenever you see a big uppercase letter, you gently “shrink” it down to its lowercase form—like turning **‘A’ into ‘a’**, **‘B’ into ‘b’**, and so on. You continue this for every single book, shrinking the big letters and keeping the small letters the same.

By the end of the day, all the titles in the catalog look neat, uniform, and easy to read. You didn’t change the meaning of any title you just made everything lowercase so that the library system stays clean and organized. And that’s exactly what converting a string to lowercase does, it goes through each character and gently transforms any uppercase letter into its lowercase version, leaving everything else untouched.

### Brute-Force Approach
Intuition

The idea is to convert the entire string into lowercase using a built-in function provided by the programming language. Before applying the conversion, we handle simple edge cases such as a null or empty string, where we can directly return the same value. For all valid inputs, we rely on the built-in method to transform uppercase letters into lowercase while keeping all other characters unchanged. This approach is preferred because it is simple, reliable, and already optimized within the language’s standard library.

### Algorithm

1. Begin by checking the input string. If the string is `null`, return `null` right away since there’s nothing to process. If the string is empty, simply return an empty string because there are no characters that need to be converted.
2. After the edge cases are handled, call the built-in `toLowerCase()` method on the string. This method automatically scans through the entire string, one character at a time. Whenever it finds an uppercase English letter, it converts it into its lowercase form. Characters that are not uppercase like digits, punctuation, spaces, and already-lowercase letters are left exactly as they are.
3. Once the method finishes processing all the characters, it returns a new string in which every uppercase letter has been transformed to lowercase. Return this new string as your final answer.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class StringToLowercase {
public:
    
    // Brute Force: Using built-in function
    static string toLowerCase(string s) {
        // Edge case: empty string
        if (s.empty()) {
            return "";
        }
        
        // Convert using built-in transformation
        for (char &c : s) {
            c = tolower(c);
        }
        
        return s;
    }
};

// Utility function to test
int main() {
    cout << "Test 1: " << StringToLowercase::toLowerCase("HELLO WORLD") << endl;
    // Output: hello world

    cout << "Test 2: " << StringToLowercase::toLowerCase("JAVA123") << endl;
    // Output: java123

    cout << "Test 3: " << StringToLowercase::toLowerCase("Hello, World!") << endl;
    // Output: hello, world!

    cout << "Test 4: " << StringToLowercase::toLowerCase("already lowercase") << endl;
    // Output: already lowercase

    cout << "Test 5: " << StringToLowercase::toLowerCase("") << endl;
    // Output: (empty string)

    cout << "Test 6: " << StringToLowercase::toLowerCase("ABC@123#xyz") << endl;
    // Output: abc@123#xyz

    cout << "Test 7: " << StringToLowercase::toLowerCase("MiXeD CaSe") << endl;
    // Output: mixed case

    return 0;
}
```

### index.java Implementation

```index.java
public class StringToLowercase {
    
    // Brute Force: Using built-in method
    public static String toLowerCase(String s) {
        // Edge case: null or empty string
        if (s == null) {
            return null;
        }
        
        if (s.length() == 0) {
            return "";
        }
        
        // Step 1: Use built-in toLowerCase() method
        return s.toLowerCase();
    }
    
    // Utility function to test
    public static void main(String[] args) {
        // Test cases
        System.out.println("Test 1: " + toLowerCase("HELLO WORLD"));
        // Output: hello world
        
        System.out.println("Test 2: " + toLowerCase("JAVA123"));
        // Output: java123
        
        System.out.println("Test 3: " + toLowerCase("Hello, World!"));
        // Output: hello, world!
        
        System.out.println("Test 4: " + toLowerCase("already lowercase"));
        // Output: already lowercase
        
        System.out.println("Test 5: " + toLowerCase(""));
        // Output: (empty string)
        
        System.out.println("Test 6: " + toLowerCase("ABC@123#xyz"));
        // Output: abc@123#xyz
        
        System.out.println("Test 7: " + toLowerCase("MiXeD CaSe"));
        // Output: mixed case
    }
}
```

### index.py Implementation

```index.py
class StringToLowercase:
    
    @staticmethod
    def to_lower_case(s):
        # Edge case: None or empty string
        if s is None:
            return None
        
        if len(s) == 0:
            return ""
        
        # Using built-in lower() method
        return s.lower()


# Utility function to test
if __name__ == "__main__":
    print("Test 1:", StringToLowercase.to_lower_case("HELLO WORLD"))
    # Output: hello world

    print("Test 2:", StringToLowercase.to_lower_case("JAVA123"))
    # Output: java123

    print("Test 3:", StringToLowercase.to_lower_case("Hello, World!"))
    # Output: hello, world!

    print("Test 4:", StringToLowercase.to_lower_case("already lowercase"))
    # Output: already lowercase

    print("Test 5:", StringToLowercase.to_lower_case(""))
    # Output: (empty string)

    print("Test 6:", StringToLowercase.to_lower_case("ABC@123#xyz"))
    # Output: abc@123#xyz

    print("Test 7:", StringToLowercase.to_lower_case("MiXeD CaSe"))
    # Output: mixed case
```



### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class StringToLowercase {
public:
    
    // Brute Force: Using built-in function
    static string toLowerCase(string s) {
        // Edge case: empty string
        if (s.empty()) {
            return "";
        }
        
        // Convert using built-in transformation
        for (char &c : s) {
            c = tolower(c);
        }
        
        return s;
    }
};

// Utility function to test
int main() {
    cout << "Test 1: " << StringToLowercase::toLowerCase("HELLO WORLD") << endl;
    // Output: hello world

    cout << "Test 2: " << StringToLowercase::toLowerCase("JAVA123") << endl;
    // Output: java123

    cout << "Test 3: " << StringToLowercase::toLowerCase("Hello, World!") << endl;
    // Output: hello, world!

    cout << "Test 4: " << StringToLowercase::toLowerCase("already lowercase") << endl;
    // Output: already lowercase

    cout << "Test 5: " << StringToLowercase::toLowerCase("") << endl;
    // Output: (empty string)

    cout << "Test 6: " << StringToLowercase::toLowerCase("ABC@123#xyz") << endl;
    // Output: abc@123#xyz

    cout << "Test 7: " << StringToLowercase::toLowerCase("MiXeD CaSe") << endl;
    // Output: mixed case

    return 0;
}
```

### index.java Implementation

```index.java
public class StringToLowercase {
    
    // Brute Force: Using built-in method
    public static String toLowerCase(String s) {
        // Edge case: null or empty string
        if (s == null) {
            return null;
        }
        
        if (s.length() == 0) {
            return "";
        }
        
        // Step 1: Use built-in toLowerCase() method
        return s.toLowerCase();
    }
    
    // Utility function to test
    public static void main(String[] args) {
        // Test cases
        System.out.println("Test 1: " + toLowerCase("HELLO WORLD"));
        // Output: hello world
        
        System.out.println("Test 2: " + toLowerCase("JAVA123"));
        // Output: java123
        
        System.out.println("Test 3: " + toLowerCase("Hello, World!"));
        // Output: hello, world!
        
        System.out.println("Test 4: " + toLowerCase("already lowercase"));
        // Output: already lowercase
        
        System.out.println("Test 5: " + toLowerCase(""));
        // Output: (empty string)
        
        System.out.println("Test 6: " + toLowerCase("ABC@123#xyz"));
        // Output: abc@123#xyz
        
        System.out.println("Test 7: " + toLowerCase("MiXeD CaSe"));
        // Output: mixed case
    }
}
```

### index.py Implementation

```index.py
class StringToLowercase:
    
    @staticmethod
    def to_lower_case(s):
        # Edge case: None or empty string
        if s is None:
            return None
        
        if len(s) == 0:
            return ""
        
        # Using built-in lower() method
        return s.lower()


# Utility function to test
if __name__ == "__main__":
    print("Test 1:", StringToLowercase.to_lower_case("HELLO WORLD"))
    # Output: hello world

    print("Test 2:", StringToLowercase.to_lower_case("JAVA123"))
    # Output: java123

    print("Test 3:", StringToLowercase.to_lower_case("Hello, World!"))
    # Output: hello, world!

    print("Test 4:", StringToLowercase.to_lower_case("already lowercase"))
    # Output: already lowercase

    print("Test 5:", StringToLowercase.to_lower_case(""))
    # Output: (empty string)

    print("Test 6:", StringToLowercase.to_lower_case("ABC@123#xyz"))
    # Output: abc@123#xyz

    print("Test 7:", StringToLowercase.to_lower_case("MiXeD CaSe"))
    # Output: mixed case
```



### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class StringToLowercase {
public:
    
    // Brute Force: Using built-in function
    static string toLowerCase(string s) {
        // Edge case: empty string
        if (s.empty()) {
            return "";
        }
        
        // Convert using built-in transformation
        for (char &c : s) {
            c = tolower(c);
        }
        
        return s;
    }
};

// Utility function to test
int main() {
    cout << "Test 1: " << StringToLowercase::toLowerCase("HELLO WORLD") << endl;
    // Output: hello world

    cout << "Test 2: " << StringToLowercase::toLowerCase("JAVA123") << endl;
    // Output: java123

    cout << "Test 3: " << StringToLowercase::toLowerCase("Hello, World!") << endl;
    // Output: hello, world!

    cout << "Test 4: " << StringToLowercase::toLowerCase("already lowercase") << endl;
    // Output: already lowercase

    cout << "Test 5: " << StringToLowercase::toLowerCase("") << endl;
    // Output: (empty string)

    cout << "Test 6: " << StringToLowercase::toLowerCase("ABC@123#xyz") << endl;
    // Output: abc@123#xyz

    cout << "Test 7: " << StringToLowercase::toLowerCase("MiXeD CaSe") << endl;
    // Output: mixed case

    return 0;
}
```

### index.java Implementation

```index.java
public class StringToLowercase {
    
    // Brute Force: Using built-in method
    public static String toLowerCase(String s) {
        // Edge case: null or empty string
        if (s == null) {
            return null;
        }
        
        if (s.length() == 0) {
            return "";
        }
        
        // Step 1: Use built-in toLowerCase() method
        return s.toLowerCase();
    }
    
    // Utility function to test
    public static void main(String[] args) {
        // Test cases
        System.out.println("Test 1: " + toLowerCase("HELLO WORLD"));
        // Output: hello world
        
        System.out.println("Test 2: " + toLowerCase("JAVA123"));
        // Output: java123
        
        System.out.println("Test 3: " + toLowerCase("Hello, World!"));
        // Output: hello, world!
        
        System.out.println("Test 4: " + toLowerCase("already lowercase"));
        // Output: already lowercase
        
        System.out.println("Test 5: " + toLowerCase(""));
        // Output: (empty string)
        
        System.out.println("Test 6: " + toLowerCase("ABC@123#xyz"));
        // Output: abc@123#xyz
        
        System.out.println("Test 7: " + toLowerCase("MiXeD CaSe"));
        // Output: mixed case
    }
}
```

### index.py Implementation

```index.py
class StringToLowercase:
    
    @staticmethod
    def to_lower_case(s):
        # Edge case: None or empty string
        if s is None:
            return None
        
        if len(s) == 0:
            return ""
        
        # Using built-in lower() method
        return s.lower()


# Utility function to test
if __name__ == "__main__":
    print("Test 1:", StringToLowercase.to_lower_case("HELLO WORLD"))
    # Output: hello world

    print("Test 2:", StringToLowercase.to_lower_case("JAVA123"))
    # Output: java123

    print("Test 3:", StringToLowercase.to_lower_case("Hello, World!"))
    # Output: hello, world!

    print("Test 4:", StringToLowercase.to_lower_case("already lowercase"))
    # Output: already lowercase

    print("Test 5:", StringToLowercase.to_lower_case(""))
    # Output: (empty string)

    print("Test 6:", StringToLowercase.to_lower_case("ABC@123#xyz"))
    # Output: abc@123#xyz

    print("Test 7:", StringToLowercase.to_lower_case("MiXeD CaSe"))
    # Output: mixed case
```

### Complexity Analysis

#### Time Complexity: O(N)

- The `toLowerCase()` method iterates through the entire string once.
- Each of the **N characters** is processed sequentially.
- For every character, a constant-time check is performed to determine whether it is uppercase.
- If needed, a constant-time conversion to lowercase is applied.
- Since each character involves only **O(1)** work, the total time scales linearly.
- Therefore, the overall time complexity is **O(N)**.

#### **Space Complexity: O(N)**

- Java strings are immutable, so `toLowerCase()` cannot modify the original string in place.
- A new string of length **N** is created to store the converted result.
- This new allocation happens regardless of how many characters are actually changed.
- No additional auxiliary data structures are used beyond the output string.
- Hence, the space complexity is **O(N)** due to the newly created result string.

## Optimal Approach

### Intuition

While using the built-in `toLowerCase()` method is the standard approach, understanding how to manually convert characters helps us learn about ASCII values and character manipulation at a deeper level. The key insight is that in ASCII encoding, uppercase letters (A-Z) and lowercase letters (a-z) are separated by exactly 32 positions. Uppercase 'A' has ASCII value 65, and lowercase 'a' has value 97. The difference is 32. So, to convert any uppercase letter to lowercase, we simply add 32 to its ASCII value. We iterate through each character, check if it's an uppercase letter (ASCII value between 65-90), and if so, add 32 to get the lowercase equivalent. All other characters remain unchanged. This manual approach gives us complete control over the conversion process.

### Algorithm

1. Start by checking the input string. If the string is `null`, return `null` immediately because there is nothing to convert. If the string is empty, return an empty string since no characters require processing.
2. Transform the string into a character array so you can work with each character directly. This makes the conversion process efficient and avoids creating many temporary string objects.
3. Move through the character array from index 0 to the last index. For each character, take it out and examine it. Check whether it is an uppercase English letter by seeing if it lies between `'A'` and `'Z'`. If it is uppercase, convert it to lowercase using ASCII adjustment either by adding 32 or by shifting from `'A'` to `'a'`. If the character is not uppercase (like digits, punctuation, spaces, or already lowercase letters), leave it unchanged. Put the final version of the character back into the array.
4. Once all characters have been processed, use the modified character array to create a new string. This new string represents the fully converted lowercase version of the input.
5. Return the newly constructed lowercase string as the output.

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    string toLowerCase(string s) {
        for (char &c : s) {
            c = tolower(c);
        }
        return s;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public String toLowerCase(String s) {
        return s.toLowerCase();
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def toLowerCase(self, s: str) -> str:
        result = []
        for char in s:
            if 'A' <= char <= 'Z':
                result.append(chr(ord(char) + (ord('a') - ord('A'))))
            else:
                result.append(char)
        return "".join(result)
```

### Complexity Analysis

#### Time Complexity: O(N)

- We traverse the string once, processing each character sequentially.
- For every character, we perform a constant-time operation to check if it is uppercase.
- If it is uppercase, we apply a constant-time conversion (e.g., adding 32 or using bit manipulation).
- Each character is handled in **O(1)** time, and there are **N characters total**.
- Therefore, the overall time complexity is **O(N)** due to a single linear pass.

#### Space Complexity: O(N)

- We create a character array from the input string, which requires **O(N)** space.
- After processing, we construct a new string from this modified array, also requiring **O(N)** space.
- Java strings are immutable, so in-place modification is not possible.
- The character array serves as temporary storage but still scales linearly with input size.
- Hence, the total space complexity is **O(N)**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/convert-a-string-to-lowercase)*
