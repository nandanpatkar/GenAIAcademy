# Decode a Message

> **Slug:** `decode-a-message`  
> **Published:** 2026-07-04T20:56:29.155Z  
> **Updated:** 2026-07-04T20:56:29.162Z  
> **Keywords:** Decode Encode, Strings  
> **Cover Image:** ![Decode a Message](https://cdn.codehelp.in/media/articles/1783104876725-f88df844-Decode.png)

**Description:** Learn how to decode an encoded message using string traversal, with clear examples, a real-life analogy, and time and space complexity analysis.

---

## Problem Statement

You're given a message that was encoded using a custom mapping, and the task is to decode this message. The encoding works as follows:

- Each lowercase letter ***'a'*** to ***'z'*** is mapped to a number string in the range of ***'1'*** to ***'26'***.
- A sequence of the message string is formed by concatenating these numbers.

You are required to decode such a number string back to the original message.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  message = "123"
> **Output:** abc
> **Explanation:** 1 -> a, 2 -> b, 3 -> c

## Example 2

> [!NOTE]
> **INFO**
> **Input:** message = "26"
> **Output:** b
> **Explanation:** 2 -> b, 6 -> f

## Example 3

> [!NOTE]
> **INFO**
> **Input: **message = "54321"
> **Output:** edcba
> **Explanation: **5 -> e, 4 -> d, 3 -> c, 2 -> b, 1 -> a

## Constraints

- The length of the input string `message` is between 1 and 1000.
- The input string `message` will only contain characters from '1' to '9'.
- Each number in the sequence will validly map to a lowercase letter.

### Real-Life Analogy

Suppose you are going to a hotel to visit someone, and in this hotel every room number from **1 to 26** is assigned to a particular person whose name starts with a specific letter: room 1 represents ‘a’, room 2 represents ‘b’, and so on up to room 26 representing ‘z’. Now imagine that the receptionist gives you a slip containing a long string of digits that represents the list of people you need to meet, but all the room numbers are written **without any spaces**just one continuous number sequence. Your job is to figure out the correct people by carefully separating the digits into valid room numbers, because sometimes a room number is a single digit (1–9) and sometimes it is two digits (10–26). Only after splitting it correctly can you map each room number back to its corresponding letter. This process is exactly like decoding the given number string back into the original message.

### Brute-Force Approach
Intuition

The straightforward way to decode is to walk through the string left to right, one position at a time. At each position, we check whether the character two positions ahead is `'#'`. If it is, we know the current character and the next one together form a two-digit code (10–26), so we consume both digits plus the `'#'` and map that number to a letter. If it isn't, we consume just the current digit and map it directly to a letter (1–9). We build up the answer by repeatedly appending each decoded letter onto a result string using simple string concatenation.

### Algorithm

1. First, think about whether there's anything to decode at all. If the string is empty or doesn't exist, there's nothing to do, so we just return an empty result right away , no point going further.
2. Now, decide how we'll build our answer as we go. We'll keep an empty result to fill in one letter at a time, and we'll keep track of where we currently are in the string using a pointer, starting from the very beginning.
3. Next, we keep moving through the string from left to right, one step at a time, and at every position we ask ourselves one simple question: "Does this digit belong with the next one, or does it stand alone?"  - The way we answer that is by looking two spots ahead. If we find a `#` sitting there, that's our signal that the current digit and the digit right after it were meant to travel together , they form a two-digit code (somewhere between 10 and 26).
  - - So in that case, we read both digits together as one number.
    - We figure out which letter that number stands for.
    - We add that letter onto our result.
    - Since we just used up two digits and the `#` marker, we jump our pointer forward by three positions to land on whatever comes next.
  - If there's no `#` two spots ahead, that tells us this digit is meant to stand on its own — a single-digit code.
  - - So we just read this one digit by itself.
    - We figure out which letter that digit stands for.
    - We add that letter onto our result.
    - Since we only used up one digit, we move our pointer forward by just one position.
4. We keep repeating this same question , "does this digit pair up with a `#` two ahead, or not?" — over and over until our pointer has walked all the way past the end of the string. At that point, every digit has been accounted for, so whatever we've built up in our result is the fully decoded message, and that's what we return.

### Dry Run

// image

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class DecodeMessage {
public:
    static string decodeMessage(string s) {
        // Edge case: empty string
        if (s.empty()) {
            return "";
        }

        string result = "";
        int i = 0;

        while (i < s.length()) {
            // Check if this is a two-digit code (followed by '#')
            if (i + 2 < s.length() && s[i + 2] == '#') {
                int twoDigit = stoi(s.substr(i, 2));
                char letter = 'a' + twoDigit - 1;
                result += letter;
                i += 3; // Skip both digits and '#'
            } else {
                // Single-digit code
                int oneDigit = s[i] - '0';
                char letter = 'a' + oneDigit - 1;
                result += letter;
                i += 1;
            }
        }

        return result;
    }
};

int main() {
    cout << DecodeMessage::decodeMessage("10#11#12") << endl;
    // Output: jkab

    cout << DecodeMessage::decodeMessage("1326#") << endl;
    // Output: acz

    cout << DecodeMessage::decodeMessage("12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#") << endl;
    // Output: abcdefghijklmnopqrstuvwxyz

    return 0;
}
```

### index.java Implementation

```index.java
public class DecodeMessage {
    
    public static String decodeMessage(String s) {
        // Edge case: null or empty string
        if (s == null || s.length() == 0) {
            return "";
        }
        
        String result = "";
        int i = 0;
        
        while (i < s.length()) {
            // Check if this is a two-digit code (followed by '#')
            if (i + 2 < s.length() && s.charAt(i + 2) == '#') {
                int twoDigit = Integer.parseInt(s.substring(i, i + 2));
                char letter = (char) ('a' + twoDigit - 1);
                result += letter;   // String concatenation - creates a new string each time
                i += 3;             // Skip both digits and the '#'
            } else {
                // Single-digit code
                int oneDigit = s.charAt(i) - '0';
                char letter = (char) ('a' + oneDigit - 1);
                result += letter;   // String concatenation
                i += 1;
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(decodeMessage("10#11#12"));
        // Output: jkab
        
        System.out.println(decodeMessage("1326#"));
        // Output: acz
        
        System.out.println(decodeMessage("12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"));
        // Output: abcdefghijklmnopqrstuvwxyz
    }
}
```

### index.py Implementation

```index.py
class DecodeMessage:

    @staticmethod
    def decode_message(s):
        # Edge case: null or empty string
        if s is None or len(s) == 0:
            return ""

        result = ""
        i = 0

        while i < len(s):
            # Check if this is a two-digit code (followed by '#')
            if i + 2 < len(s) and s[i + 2] == '#':
                two_digit = int(s[i:i + 2])
                letter = chr(ord('a') + two_digit - 1)
                result += letter  # String concatenation
                i += 3            # Skip both digits and '#'
            else:
                # Single-digit code
                one_digit = int(s[i])
                letter = chr(ord('a') + one_digit - 1)
                result += letter  # String concatenation
                i += 1

        return result


# Driver Code
print(DecodeMessage.decode_message("10#11#12"))
# Output: jkab

print(DecodeMessage.decode_message("1326#"))
# Output: acz

print(DecodeMessage.decode_message("12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"))
# Output: abcdefghijklmnopqrstuvwxyz
```

### Complexity Analysis

#### Time Complexity: O(N2)

- We scan the string once, which involves **O(N)** iterations.
- In Java, strings are immutable, so every `result += letter` creates a **new string object**.
- Each concatenation copies all previously built characters into the new string.
- As the result grows from size 1 to N, copying cost increases at each step.
- Total work becomes: **1 + 2 + 3 + … + N = O(N²)**.
- Hence, the overall time complexity is **O(N²)** due to repeated copying.

#### **Space Complexity: O(N)**

- The final output string stores all N characters, requiring **O(N)** space.
- At any moment, only one resulting string is kept (previous ones are discarded).
- However, intermediate strings are repeatedly created during concatenation.
- These temporary objects contribute overhead but do not persist simultaneously.
- Therefore, auxiliary space is **O(1)**, while total space used by the final result is **O(N)**.

## Optimal Approach

### Intuition

The core scanning logic from the brute-force approach is already correct and only makes one pass through the string — the real inefficiency is repeated string concatenation. We can fix this by using a mutable buffer (a `StringBuilder` in Java, or a pre-sized `char` array) to accumulate decoded letters. Appending to a `StringBuilder` is O(1) amortized per character instead of O(N) per character, which brings the total time down to a true O(N).

### Algorithm

1. First, check whether there's actually anything to work with. If the string is empty or doesn't exist, there's no decoding to do, so we just hand back an empty result immediately.
2. Now, before we start scanning, think about *how* we want to build our answer this time. Instead of building the result letter by letter through repeated concatenation, we set up a dedicated, growable buffer to collect our decoded letters in — this way we're not recreating the whole result from scratch every time we add a letter, we're just appending onto the end efficiently.
3. We also set up a pointer to keep track of where we currently are in the string, starting from the very beginning.
4. Then we keep moving through the string from left to right, one step at a time, and at every position we ask the same question as before: "Does this digit belong with the next one, or does it stand alone?"  - We check this by peeking two spots ahead. If a `#` is sitting there, that tells us the current digit and the one right after it are meant to be read together , they form a two-digit code (somewhere between 10 and 26).
  - - So we read both digits together as a single number.
    - We work out which letter that number corresponds to.
    - We drop that letter straight into our buffer.
    - Since we've now consumed two digits plus the `#` marker, we move our pointer forward by three positions.
  - If there's no `#` two spots ahead, that tells us this digit stands on its own as a single-digit code.
  - - So we read just this one digit.
    - We work out which letter that digit corresponds to.
    - We drop that letter straight into our buffer.
    - Since we've only consumed one digit, we move our pointer forward by just one position.
5. We keep repeating this same check,  peeking two ahead for a `#`, then deciding  until our pointer has walked past the entire string. At that point every digit has been read and turned into a letter, so we take everything sitting in our buffer, turn it into the final decoded message, and return it.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
using namespace std;

class DecodeMessageOptimal {
public:
    static string decodeMessage(string s) {
        // Edge case: empty string
        if (s.empty()) {
            return "";
        }

        string result;
        int i = 0;

        while (i < s.length()) {
            // Check if this is a two-digit code (followed by '#')
            if (i + 2 < s.length() && s[i + 2] == '#') {
                // Two-digit code (10-26)
                int twoDigit = (s[i] - '0') * 10 + (s[i + 1] - '0');
                result.push_back('a' + twoDigit - 1);
                i += 3;
            } else {
                // Single-digit code (1-9)
                int oneDigit = s[i] - '0';
                result.push_back('a' + oneDigit - 1);
                i += 1;
            }
        }

        return result;
    }
};

int main() {
    cout << DecodeMessageOptimal::decodeMessage("10#11#12") << endl;
    // Output: jkab

    cout << DecodeMessageOptimal::decodeMessage("1326#") << endl;
    // Output: acz

    cout << DecodeMessageOptimal::decodeMessage("12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#") << endl;
    // Output: abcdefghijklmnopqrstuvwxyz

    return 0;
}
```

### index.java Implementation

```index.java
public class DecodeMessageOptimal {
    
    public static String decodeMessage(String s) {
        // Edge case: null or empty string
        if (s == null || s.length() == 0) {
            return "";
        }
        
        StringBuilder result = new StringBuilder();
        int i = 0;
        
        while (i < s.length()) {
            if (i + 2 < s.length() && s.charAt(i + 2) == '#') {
                // Two-digit code (10-26)
                int twoDigit = (s.charAt(i) - '0') * 10 + (s.charAt(i + 1) - '0');
                result.append((char) ('a' + twoDigit - 1));
                i += 3;
            } else {
                // Single-digit code (1-9)
                int oneDigit = s.charAt(i) - '0';
                result.append((char) ('a' + oneDigit - 1));
                i += 1;
            }
        }
        
        return result.toString();
    }
    
    public static void main(String[] args) {
        System.out.println(decodeMessage("10#11#12"));
        // Output: jkab
        
        System.out.println(decodeMessage("1326#"));
        // Output: acz
        
        System.out.println(decodeMessage("12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"));
        // Output: abcdefghijklmnopqrstuvwxyz
    }
}
```

### index.py Implementation

```index.py
class DecodeMessageOptimal:

    @staticmethod
    def decode_message(s):
        # Edge case: None or empty string
        if s is None or len(s) == 0:
            return ""

        result = []  # Acts like StringBuilder
        i = 0

        while i < len(s):
            # Check if this is a two-digit code (followed by '#')
            if i + 2 < len(s) and s[i + 2] == '#':
                # Two-digit code (10-26)
                two_digit = (ord(s[i]) - ord('0')) * 10 + (ord(s[i + 1]) - ord('0'))
                result.append(chr(ord('a') + two_digit - 1))
                i += 3
            else:
                # Single-digit code (1-9)
                one_digit = ord(s[i]) - ord('0')
                result.append(chr(ord('a') + one_digit - 1))
                i += 1

        return "".join(result)


# Driver Code
print(DecodeMessageOptimal.decode_message("10#11#12"))
# Output: jkab

print(DecodeMessageOptimal.decode_message("1326#"))
# Output: acz

print(DecodeMessageOptimal.decode_message("12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"))
# Output: abcdefghijklmnopqrstuvwxyz
```

### Complexity Analysis

#### Time Complexity: O(N)

- We make a single pass through the string, so each character is processed only once.
- Each character is examined a constant number of times, keeping operations per character O(1).
- StringBuilder.append() runs in O(1) amortized time.
- Internally, StringBuilder grows its buffer (typically by doubling size), avoiding repeated full copying.
- Occasional resizing causes extra work, but it is distributed across many operations (amortized cost).
- Total number of append operations across the entire string is linear.
- Therefore, overall time complexity is **O(N)**.

#### Space Complexity: O(N)

- The `StringBuilder` stores the decoded output.
- In the worst case, the output size can grow up to **O(N)** characters.
- In practice, the output is often smaller because encoded patterns compress multiple input characters into one output character.
- No additional data structures (like arrays, maps, or recursion stacks) are used.
- Only a constant number of extra variables (pointers, indices, counters) are maintained.
- Therefore, auxiliary space usage remains **O(1)**.
- Overall space complexity is **O(N)** due to the required output storage.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/decode-a-message)*
