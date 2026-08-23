# String Compression

> **Slug:** `string-compression`  
> **Published:** 2026-07-05T12:14:52.633Z  
> **Updated:** 2026-07-05T12:14:52.657Z  
> **Keywords:** None  
> **Cover Image:** ![String Compression](https://cdn.codehelp.in/media/string comp.png)

**Description:** Learn how to compress a character array in place using two pointers. Covers brute-force vs optimal approach with time and space complexity explained.

---

## Problem Statement

Your task is to compress a given array of characters, ***chars***, in place. The compression is performed by applying the following rules:

1. For each group of consecutive repeating characters, replace the group with the character followed by the number of times it appears.
2. If a character appears only once, it remains unchanged.

The compression should be done without using any extra space beyond the input array itself.

After compressing the array, return the new length of the compressed array. 

### Example 1

> [!NOTE]
> **INFO**
> **Input:**  **s = 'abc'**
> **Output:** **3**
> **Explanation: **String compression replaces repeated characters with the character and its count. Since **"abc"** has no repeats, it stays **"abc"** with length **3**.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** **chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]**
> **Output:** Return **4**, and the first 4 characters of the input array should be: **["a","b","1","2"]**
> **Explanation:** 
> 
> - **'a'** appears once → stays **"a"**
> - **'b' **appears 12 times → compressed as **"b12"**
> - Count **12** is split into **'1'** and **'2'**
> - Final compressed string: **"ab12"** → length **4**

### Example 3

> [!NOTE]
> **INFO**
> **Input:** **chars = ["a","b","c"]**
> **Output: **Return **3, ["a","b","c"]**
> **Explanation: ** In this input:- **'a'** appears **once** → stays **'a'**
> - **'b'** appears **once** → stays **'b'**
> - **'c'** appears **once** → stays **'c'**
> 
> 
> 
> - Since **no character repeats consecutively**, there’s **nothing to compress**.
> - The final compressed string is still **"abc"**, and its **length is 3**.

### Constraints

- 1 <= **chars.length** <= 2000
- **chars[i]** is a lowercase English letter, digit, or symbol.

## Real-Life Analogy

Imagine you are working in a packaging warehouse where identical boxes keep arriving on a conveyor belt. As these boxes pass by, you’re responsible for keeping a summary of what arrived, but you’re only allowed to write everything on a single sheet of paper—no extra pages. Writing every single box would make the sheet messy and long, so instead, you use a clever trick. 

Whenever you see the same type of box arriving repeatedly, you write the label of the box just once and then write the count of how many identical boxes appeared in a row. But if a box appears only once, you simply write the label without any number. This way, long stretches of repeated boxes get compressed into a short, neat summary. By the time the conveyor belt finishes, the sheet contains the compact version of the entire sequence, created entirely in place without using any additional space.

## Brute-Force Approach

### Intuition

A simple, easy-to-understand way to see the compression idea is to first build the compressed result somewhere else and then copy it back into the original array. In this approach you walk through the input, gather each run of identical characters, append the character and its count (when greater than one) into a temporary buffer, and once the entire input is processed you overwrite the original array with the contents of that buffer and return its length. This method clearly shows how runs are detected and how counts are recorded, but it uses extra memory for the temporary buffer and therefore violates the “in-place” space constraint of the problem. Still, implementing this separate-buffer version is useful for learning the compression steps before moving on to the in-place, constant-space solution.

### Algorithm

1. **Initialize a container** to build the compressed string (e.g., a list, array, or string builder, depending on the language).
2. **Iterate through the input array** of characters while keeping track of the **current character** and its **consecutive count**. 

**When the character changes** or the end of the array is reached:
Append the **current character** to the container.If the count is greater than 1, append the **count** (as individual digits if needed).Reset the count for the next character.
3. **Copy the compressed characters** from the container back into the original input array to satisfy the **in-place requirement**.
4. **Return the length** of the compressed string, representing how many positions in the array are now occupied by the valid compressed result.

### Dry Run

> [!NOTE]
> **INFO**
> Let’s dry run with the input:
> 
> **chars = ['a','a','b','b','c','c','c']**
> 
> ##### **Initial State**
> 
> **i = 0**
> **compressed = ""**
> 
> ##### **1st Iteration**
> 
> - **currentChar = 'a'**
> - Count how many **a**:
> **chars[0] = 'a'**
> **chars[1] = 'a'**
> **→ count = 2**
> - Append to **compressed**:
> **compressed = "a2"**
> - Move **i** forward by 2:** i = 2**
> 
> ##### **2nd Iteration**
> 
> - **currentChar = 'b'**
> - Count how many **b**:
> **chars[2] = 'b'**
> **chars[3] = 'b'**
> **→ count = 2**
> - Append:
> **compressed = "a2b2"**
> - Move **i:i = 4**
> 
> ##### **3rd Iteration**
> 
> - **currentChar = 'c'**
> - Count how many **c**:
> **chars[4] = 'c'**
> **chars[5] = 'c'**
> **chars[6] = 'c'**
> **→ count = 3**
> - Append:
> **compressed = "a2b2c3"**
> - Move **i**:** i = 7**
> Loop ends (**i == chars.length**)**.**
> 
> ##### **Copy back to original array**
> 
> **chars[0] = 'a'**
> **chars[1] = '2'**
> **chars[2] = 'b'**
> **chars[3] = '2'**
> **chars[4] = 'c'**
> **chars[5] = '3'**
> 
> Final array (first 6 characters):
> 
> **['a','2','b','2','c','3']**
> 
> ##### **Final Output**
> 
> `return 6`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int compress(vector<char>& chars) {
        string compressed = "";
        int i = 0;

        while (i < chars.size()) {
            char currentChar = chars[i];
            int count = 1;

            // Count consecutive identical characters
            while (i + count < chars.size() && chars[i + count] == currentChar) {
                count++;
            }

            // Append character
            compressed += currentChar;

            // Append count if > 1
            if (count > 1) {
                compressed += to_string(count);
            }

            // Move to next group
            i += count;
        }

        // Copy back to original array
        for (int j = 0; j < compressed.size(); j++) {
            chars[j] = compressed[j];
        }

        return compressed.size();
    }
};
```

### Java Implementation

```java
class Solution {
    public int compress(char[] chars) {
        StringBuilder compressed = new StringBuilder();
        int i = 0;
        
        while (i < chars.length) {
            char currentChar = chars[i];
            int count = 1;
            
            // Count consecutive identical characters
            while (i + count < chars.length && chars[i + count] == currentChar) {
                count++;
            }
            
            // Append character
            compressed.append(currentChar);
            
            // Append count if > 1
            if (count > 1) {
                compressed.append(count);
            }
            
            // Move to next group
            i += count;
        }
        
        // Copy back to original array
        for (int j = 0; j < compressed.length(); j++) {
            chars[j] = compressed.charAt(j);
        }
        
        return compressed.length();
    }
}
```

### Python Implementation

```python
class Solution:
    def compress(self, chars):
        compressed = []
        i = 0

        while i < len(chars):
            current_char = chars[i]
            count = 1

            # Count consecutive identical characters
            while i + count < len(chars) and chars[i + count] == current_char:
                count += 1

            # Append character
            compressed.append(current_char)

            # Append count if > 1
            if count > 1:
                compressed.extend(str(count))

            # Move to next group
            i += count

        # Copy back to original array
        for j in range(len(compressed)):
            chars[j] = compressed[j]

        return len(compressed)
```

### Complexity Analysis

#### Time Complexity: O(N)

- Let **N** be the length of the input array.
- **First pass:** Build the compressed string by counting runs of characters, which takes **O(N)** time.
- **Second pass:** Copy the compressed result back into the original array, which also takes **O(N)** time.
- The total work is proportional to **N**.
- Therefore, the overall **time complexity is O(N)**.

#### Space Complexity: O(N)

- Extra memory is used to store the **compressed output**.
- Using a **StringBuilder** requires space proportional to the number of characters written.
- In the worst case, this space can be up to **O(N)**.
- Therefore, the **auxiliary space complexity is O(N)**.
- This approach **violates the in-place constraint** of the problem.

## Optimal Approach

### Intuition

The idea is to compress the array directly inside the same array without using extra space. To do that efficiently, we use two pointers. The first pointer moves through the characters and identifies how many times a character repeats consecutively. Once a full group is counted, the second pointer writes the compressed form back into the array, first the character itself, and then its count if it appears more than once. This way, reading and writing happen simultaneously but at different positions, allowing us to overwrite the array safely. By using these two pointers together, we manage to compress everything in-place while ensuring that every character group is properly represented in its shortest compressed form.

### Algorithm

1. We begin by setting up two pointers, **read** to scan the characters from the original array and **write** to place the compressed characters back into the same array because using two pointers allows us to scan and overwrite the array in-place without extra space.
2. As the **read** pointer **moves through the array**, it **identifies groups** of the same character appearing consecutively, and **for each group**, we first record which character it is because **compression only applies to consecutive characters** and we need to know which character to write first. Then we count how many times this character repeats by moving the **read** pointer forward until a different character is found because knowing the count allows us to decide whether to append a number after the character or not.
3. Once we know the full group, we start writing the compressed form, the **character** itself is placed at the current **write**position, and if the **count is greater than 1**, we convert the count into digits and write each digit separately because the array only stores characters, and writing digits individually ensures they are correctly placed. The **write** pointer advances as characters and digits are written, which guarantees that we compress in-place without overwriting unprocessed characters.
4. Finally, when the **read** pointer has processed the entire array, the position of the **write** pointer represents how many characters are now in the compressed form because** it tracks the number of valid positions occupied** by the **compressed result**, and this value becomes the new length of the compressed array.

### Dry Run

> [!NOTE]
> **INFO**
> #### **Input**
> 
> `chars = ['a','b','b','b','b','c','c','d'`]
> 
> 
> #### Initial:
> 
> `read = 0`
> `write = 0`
> 
> #### **1st Group → 'a'**
> 
> #### Counting
> 
> - read = 0 → 'a' → count = 1
> - read = 1 → 'b' → STOP
> 
> So:
> 
> `currentChar = 'a'`
> `count = 1`
> `read = 1`
> 
> ### Writing
> 
> - chars[write] = 'a' → write = 1
> - count = 1 → (do NOT write number)
> 
> Array now:
> 
> [a, b, b, b, b, c, c, d]
> `   ↑write=1   ↑read=1`
> 
> #### **2nd Group → 'b'**
> 
> #### Counting
> 
> - read = 1 → 'b' → count = 1
> - read = 2 → 'b' → count = 2
> - read = 3 → 'b' → count = 3
> - read = 4 → 'b' → count = 4
> - read = 5 → 'c' → STOP
> 
> So:
> 
> `currentChar = 'b'`
> `count = 4`
> `read = 5`
> 
> #### Writing
> 
> - chars[write] = 'b' → write = 2
> - write digits of count = "4":
> - - chars[2] = '4' → write = 3
> 
> Array now:
> 
> `[a, b, 4`, b, b, c, c, d]
> `      ↑write=3 read=5`
> 
> 
> #### **3rd Group → 'c'**
> 
> #### Counting
> 
> - read = 5 → 'c' → count = 1
> - read = 6 → 'c' → count = 2
> - read = 7 → 'd' → STOP
> 
> So:
> 
> `currentChar = 'c'`
> `count = 2`
> `read = 7`
> 
> ### Writing
> 
> - chars[write] = 'c' → write = 4
> - write "2":
> - - chars[4] = '2' → write = 5
> 
> Array now:
> 
> `[a, b, 4, c, 2, c, c, d]`
> `         ↑write=5 read=7`
> 
> 
> #### **4th Group → 'd'**
> 
> #### Counting
> 
> - read = 7 → 'd' → count = 1
> - read = 8 → END
> 
> So:
> 
> `currentChar = 'd'`
> `count = 1`
> `read = 8` (end)
> 
> #### Writing
> 
> - chars[write] = 'd' → write = 6
> - count = 1 → no number written
> 
> Array now:
> 
> `[a, b, 4, c, 2, d, c, d]`
> `            ↑write=6`
> 
> #### **Final Output**
> 
> Compressed sequence stored in first `write` indices:
> 
> `['a','b','4','c','2','d'`]
> 
> #### New Length:
> 
> `write = 6`
> 
> #### **Return:**`6`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int compress(vector<char>& chars) {
        int write = 0; // Write pointer
        int read = 0;  // Read pointer

        while (read < chars.size()) {
            char currentChar = chars[read];
            int count = 0;

            // Count consecutive identical characters
            while (read < chars.size() && chars[read] == currentChar) {
                read++;
                count++;
            }

            // Write the character
            chars[write++] = currentChar;

            // Write the count if greater than 1
            if (count > 1) {
                string countStr = to_string(count);

                for (char c : countStr) {
                    chars[write++] = c;
                }
            }
        }

        return write;
    }
};
```

### Java Implementation

```java
class Solution {
    public int compress(char[] chars) {
        int write = 0;  // Write pointer
        int read = 0;   // Read pointer
        
        while (read < chars.length) {
            char currentChar = chars[read];
            int count = 0;
            
            // Count consecutive identical characters
            while (read < chars.length && chars[read] == currentChar) {
                read++;
                count++;
            }
            
            // Write the character
            chars[write++] = currentChar;
            
            // Write the count if greater than 1
            if (count > 1) {
                // Convert count to string and write each digit
                String countStr = String.valueOf(count);
                for (char c : countStr.toCharArray()) {
                    chars[write++] = c;
                }
            }
        }
        
        return write;
    }
}
```

### Python Implementation

```python
class Solution:
    def compress(self, chars):
        write = 0  # Write pointer
        read = 0   # Read pointer

        while read < len(chars):
            current_char = chars[read]
            count = 0

            # Count consecutive identical characters
            while read < len(chars) and chars[read] == current_char:
                read += 1
                count += 1

            # Write the character
            chars[write] = current_char
            write += 1

            # Write the count if greater than 1
            if count > 1:
                for c in str(count):
                    chars[write] = c
                    write += 1

        return write
```

### Complexity Analysis

#### Time Complexity: O(N)

- The array is **traversed only once** using a read pointer, taking **O(N)** time.
- Each character is **processed exactly once**, either for counting or writing.
- Converting a count (e.g., 12 → "12") takes **O(log count)** time.
- Since the maximum count is bounded by **N**, this step does **not exceed O(N)** overall.
- Combining all operations, the algorithm runs in **linear time**.
- Therefore, the overall **time complexity is O(N)**.

#### Space Complexity: O(1)

- The algorithm uses **only two pointers** (`read` and `write`) and a few small variables, which require **constant space**.
- Converting a count to characters creates a temporary string of at most **log₁₀(N) digits**, which is still considered **O(1)**relative to input size.
- **No extra arrays, lists, or dynamic structures** are created.
- Therefore, the overall **space complexity is O(1)**.
- This meets the **in-place requirement** and is optimal.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/string-compression)*
