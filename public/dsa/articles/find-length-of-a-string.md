# Find length of a String

> **Slug:** `find-length-of-a-string`  
> **Published:** 2026-07-04T21:47:05.648Z  
> **Updated:** 2026-07-04T21:47:05.653Z  
> **Keywords:** Find length of a string  
> **Cover Image:** ![Find length of a String](https://cdn.codehelp.in/media/Length of string.png)

**Description:** Learn how to find the length of a string using simple and efficient methods. Step-by-step explanation with examples.

---

## Problem Statement

Given a string, determine and return the total number of characters it contains. This includes all types of characters such as lowercase and uppercase English letters, digits, punctuation, and spaces.

The length is calculated by counting each character from the first to the last. This means that spaces and punctuation marks are included in the count.

For example, consider the string "Hello, World!". Its length is 13 because all characters, including the space and punctuation, are counted.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  'hello'
> **Output:** 5
> **Explanation:** The string 'hello' has 5 characters.

## Example 2

> [!NOTE]
> **INFO**
> **Input: **'world!'
> **Output:** 6
> **Explanation:**The string 'world!' has 6 characters.

## Example 3

> [!NOTE]
> **INFO**
> **Input: **'openai'
> **Output:** 6
> **Explanation: **The string 'openai' has 6 characters.

## Constraints

- The input string will contain only printable ASCII characters.
- The length of the string will be between 1 and 105 characters.
- The function should return an integer representing the length of the string.

### Real-Life Analogy

Imagine you are packing items into a box for shipping.
Every single thing you place inside counts big items, small items, soft items, even tiny accessories like screws or tags. Nothing is ignored.

Similarly, when you find the length of a string, you count every character inside it  letters, numbers, spaces, and even punctuation marks.
Just like counting all items in the box, you start from the first character and continue until the last.

For example: The string "Hello, World!" has 13 characters, because every item inside the “box” letters, comma, space, exclamation mark is included.

## Brute-Force Approach

### Intuition

We can calculate the length of a string by manually iterating through each character and increasing a counter. This helps beginners see what actually happens behind the scenes when a length function is called. However, this becomes a brute-force method because we end up doing work that the string object has already done internally. Instead of taking constant time like the built-in method, this manual traversal takes O(N) time since we must visit every character. Therefore, this approach is mainly useful for learning concepts or for cases where strings are being implemented from scratch.

### Algorithm

1. Firstly, We create a counter that will keep track of how many characters we have seen. In the beginning, this counter is 0 because we have not checked anything yet.
2. Now, begin moving through the string from the first character to the last. Each time we look at a character, increase our counter by 1. This mean, every time we see a new character, we add one more to our total count.
3. When we have checked all the characters and there are no more left, the value inside our counter represents the total number of characters in the string. At last, we return this final counter value as the answer.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    
    int lengthOfString(string s) {
        int count = 0;

        // Count each character manually
        for (int i = 0; i < s.size(); i++) {
            count++;
        }

        return count;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public int lengthOfString(String s) {
        int count = 0;
        
        // Count each character manually
        for (int i = 0; i < s.length(); i++) {
            count++;
        }
        
        return count;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def length_of_string(self, s: str) -> int:
        count = 0

        # Count each character manually
        for _ in s:
            count += 1

        return count
```

### Complexity Analysis

#### Time Complexity: O(N)

- The string is traversed character by character.
- Each character is processed exactly once.
- The number of operations grows linearly with the size of the string.
- Therefore, the total time taken is proportional to **N**, where N is the length of the string.
- Hence, the time complexity is **O(N)**.

#### **Space Complexity: O(1)**

- Only a single counter variable is used to track the result.
- No extra data structures or auxiliary storage are created.
- The memory usage does not change with input size.
- Therefore, the space complexity remains constant.
- Hence, the space complexity is **O(1)**.

## Optimal Approach

### Intuition

The most efficient and practical way to find the length of a string is to use the built-in length function provided by the programming language. Modern string objects usually store their length internally, so calling this function simply returns that stored value. This avoids any unnecessary traversal and gives the result instantly. Because of this, the built-in method is considered the optimal and standard approach, and it is the one you should always rely on in real-world code.

### Algorithm

1. To find the length of the string, we simply call the built-in length feature provided by the language. Each language offers an easy way to do this.
For example, Java uses `s.length`, Python uses `len`, C++ uses `length` or `size`, and JavaScript also uses `length`. These functions immediately give us the stored length of the string without manually counting anything.
2. Once the built-in function gives us the length, simply return that value as your final answer. No extra steps are needed because the built-in method already does the work internally.

### Code

### index.cpp Implementation

```index.cpp
int findStringLength(const string& input) {
    return input.length();
}
```

### index.java Implementation

```index.java
class Solution {
    public int lengthOfString(String s) {
        return s.length();
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def findStringLength(self, input_str: str) -> int:
        """
        Logic:
        In Python, the built-in len() function returns the number of 
        characters in a string. This includes spaces, punctuation, 
        and special characters.
        """
        return len(input_str)
```

### Complexity Analysis

#### Time Complexity: O(1)

- Getting the length of a string is a constant-time operation in most programming languages.
- This is because the string size is typically stored internally as metadata.
- The value is returned directly without iterating through the characters.
- Therefore, the operation does not depend on the size of the string.
- Hence, the time complexity is **O(1)**.

#### Space Complexity: O(1)

- No additional data structures or temporary storage are created.
- The operation only accesses existing metadata of the string.
- Memory usage remains constant regardless of input size.
- Therefore, the space complexity is **O(1)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/find-length-of-a-string)*
