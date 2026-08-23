# Reverse Vowels of a String

> **Slug:** `reverse-vowels-of-a-string`  
> **Published:** 2026-07-05T13:23:33.904Z  
> **Updated:** 2026-07-05T13:23:33.936Z  
> **Keywords:** Reverse Vowels of a String, Reverse Vowels, String  
> **Cover Image:** ![Reverse Vowels of a String](https://cdn.codehelp.in/media/articles/1783106612272-c84d362e-Reverse_Vowels.png)

**Description:** Reverse only the vowels in a string while keeping other characters in place. Learn brute-force and two-pointer methods with examples and complexity.

---

## Problem Statement

You are required to implement a function that receives a string ***s*** as input and outputs a new string where only the vowels are reversed. 

***Note:*** Vowels are defined as the characters 'a', 'e', 'i', 'o', 'u', and their uppercase equivalents 'A', 'E', 'I', 'O', 'U'. All other characters including consonants and special characters should remain in their original positions in the string.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** ***s = "hello"***
> **Output:** "holle"
> **Explanation: **The vowels in "hello" are 'e' and 'o'. When these are reversed, their positions swap, resulting in "holle".

### Example 2

> [!NOTE]
> **INFO**
> **Input:** s = "leetcode"
> **Output:** "leotcede"
> **Explanation:** In "leetcode", the vowels 'e', 'e', and 'o' are reversed, leading to the string "leotcede".

### Example 3

> [!NOTE]
> **INFO**
> **Input:** s = 'IceCreAm'
> 
> **Output: **AceCreIm
> 
> **Explanation: **Vowels ['I', 'e', 'e', 'A'] reversed result in 'AceCreIm'.

### Constraints

- 1 <= **s.length** <= 3 * 105
- s consists of printable **ASCII** characters.

## Real-Life Analogy

Imagine walking into an art gallery where paintings are arranged in a neat line across a wall. Some of these paintings have small red dots placed beside them, these are the **vowels**. The others, without red dots, are the consonants and special characters.

Now, your task is to rearrange the red-dotted paintings (vowels) **without disturbing the positions of the unmarked paintings**. In simpler terms, the vowels will change places among themselves, but the consonants will stay exactly where they are.

Let’s understand this:
Suppose the gallery wall (input string) is **"hello"**. Here, the paintings with red dots are**‘e’** and **‘o’**.

1. **Identify the red-dot paintings**, find all the vowels: ‘e’ and ‘o’.
2. **Take them down temporarily**, imagine removing them from the wall, leaving empty spaces where they used to be:`h _ l l _`
Collected red dots: `[e, o]`
3. **Reverse the red-dot paintings**, rearrange them in the opposite order: `[o, e]`
4. **Rehang them in the same empty positions**, place them back exactly where vowels originally were:
`h o l l e`

So, the final wall now reads **"holle"**.
Throughout the process, the consonants (‘h’, ‘l’, ‘l’) never moved from their original positions only the vowels swapped places.

## Brute-Force Approach

### Intuition

Think of a word as a line of musical notes, where some notes (the vowels) sound softer and more melodic, while the others (the consonants) provide structure and rhythm. Your goal is to reverse only the soft, melodic notes (vowels) without disturbing the rhythm (consonants). To do this, first, you listen carefully and pick out all the vowel sounds, just like separating the melodic notes from the rest of the music. Once you have this collection of vowels, you reverse their order, as if replaying those notes backward.

Next, you **recreate the original tune** by going through the word again, whenever you come across a vowel’s spot, you replace it with the next reversed vowel from your collection. For all other characters, you keep them exactly as they were.

This method is very intuitive and easy to visualize, but it requires **extra space** because you temporarily store all the vowels before putting them back in reversed order.

### Algorithm

1. Firstly, We make a **quick vowel list**. Decide which characters count as vowels: **a, e, i, o, u** plus their **uppercase** versions. Having this set makes it fast to check whether a character is a vowel or not.
2. After collecting this, we gather the vowels as walk through the string from **left **to** right** and **collect** every **vowel** we find into a **small list** called **vowels**. Skip anything that isn’t a vowel (numbers, symbols, consonants, spaces). After this pass we have all the vowels in the order they appear in the original word.
3. Now, **Reverse** the **collected vowels**. As we reverse the order of the **vowels** list so that the last vowel becomes the first, and so on. In the example **[e, o]** becomes **[o, e]**. This reversed list is what we will place back into the original vowel slots.
4. Create a **new**, empty result container. Walk through the original **string again**, character by character. If the current character is a vowel, take the next vowel from the reversed `vowels` list and append it to the result; if it’s **not a vowel**, **append** the **original** **character** **unchanged**. Keep an index (pointer) into the reversed vowel list so we always take the next vowel in order. This step fills only the vowel positions with reversed vowels and leaves every other character where it was.
5. Finish this and **return**, after we have processed every character, the result container holds the final string. Vowels have been reversed, and all other characters remain in their original positions. Return that string as the output.

### Dry Run

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    string reverseVowels(string s) {
        unordered_set<char> vowels = {
            'a','e','i','o','u',
            'A','E','I','O','U'
        };

        int left = 0;
        int right = s.length() - 1;

        while (left < right) {

            while (left < right && vowels.find(s[left]) == vowels.end()) {
                left++;
            }

            while (left < right && vowels.find(s[right]) == vowels.end()) {
                right--;
            }

            if (left < right) {
                swap(s[left], s[right]);
                left++;
                right--;
            }
        }

        return s;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public String reverseVowels(String s) {
        Set<Character> vowels = new HashSet<>(Arrays.asList(
            'a','e','i','o','u','A','E','I','O','U'
        ));
        int left = 0, right = s.length() - 1;
        char[] result = s.toCharArray();

        while (left < right) {
            while (left < right && !vowels.contains(result[left])) {
                left++;
            }
            while (left < right && !vowels.contains(result[right])) {
                right--;
            }
            if (left < right) {
                char temp = result[left];
                result[left] = result[right];
                result[right] = temp;
                left++;
                right--;
            }
        }
        return new String(result);
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def reverseVowels(self, s: str) -> str:
        vowels = set('aeiouAEIOU')

        left, right = 0, len(s) - 1
        result = list(s)

        while left < right:
            while left < right and result[left] not in vowels:
                left += 1

            while left < right and result[right] not in vowels:
                right -= 1

            if left < right:
                result[left], result[right] = result[right], result[left]
                left += 1
                right -= 1

        return ''.join(result)
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- Let **N** be the total number of characters in the string.
- **First pass:** Extract all vowels, which takes **O(N)** time since each character is checked once.
- **Reversing vowels:** Takes **O(V)** time, where **V** is the number of vowels (**V ≤ N**).
- **Second pass:** Rebuild the final string by placing vowels in reversed order, which takes **O(N)** time.
- Checking if a character is a vowel using a set is a **constant-time operation O(1)**.
- Combining all steps, the overall **time complexity is O(N)**.

#### Space Complexity: O(N)

- Additional space is used to store the vowels in a list, which takes **O(V)** space, where **V** is the number of vowels.
- The vowel set (containing at most 10 characters for uppercase and lowercase vowels) requires **O(1)** space.
- The **StringBuilder **(if using java) used to reconstruct the final string takes **O(N)** space.
- Since **V ≤ N**, the dominant space usage comes from the **StringBuilder** and the vowel list.
- Therefore, the overall **space complexity is O(N)** due to the auxiliary storage used during processing.

## Optimal Approach

### Intuition

For optimal way we use **two-pointer technique**. Imagine two people standing at opposite ends of a line of letters one at the start (left) and one at the end (right). Both move toward each other, looking only for vowels. Whenever the left pointer finds a vowel and the right pointer also points to a vowel, they **swap** those two letters. If one of them points to a non-vowel (like a consonant or symbol), that pointer simply **moves inward** until it finds a vowel. This continues until both pointers meet in the middle.
By swapping vowels directly within the character array, this method reverses their order **in-place**—meaning we don’t need to extract or store them separately. The consonants and other characters remain in their exact positions, ensuring the original structure of the string is preserved.
This technique is both **space-efficient and elegant**, as it eliminates the need for additional storage while still achieving the same reversed vowel arrangement

### Algorithm

1. Firstly, We Make a **mutable copy** of the text, because many programming languages (like Java) don’t let you **change** a **string** directly, first make a changeable list of characters from the string. Think of this as laying out each character on a board so you can swap them easily.
2. Now, we **place** **two** **markers** put one marker at the start of the board (left) and one at the end (right). These two markers will move toward each other as we work.
3. After this, we **move** the markers and act at **each position**. Repeat the following until the left marker meets or passes the right marker:

- Look at the character under the left marker.
- - If it is **not a vowel**, move the left marker one step to the right and check again. Do not change anything.
- Look at the character under the right marker.
- - If it is **not a vowel**, move the right marker one step to the left and check again.
- If **both** characters are vowels at the same time, swap them (exchange their places). Then move the left marker one step to the right and the right marker one step to the left.

This way, non-vowel characters (consonants, digits, punctuation, spaces) are skipped and remain in place, while vowels found by the two markers get swapped to reverse their order.

1. When the markers meet, all vowels have been **reversed in place**. Turn the modified list of characters back into a normal string and **return** it.

### Dry Run

### 

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    string reverseVowels(const string& s) {
        unordered_set<char> vowels = {'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'};
        int left = 0, right = s.size() - 1;
        string result = s;

        while (left < right) {
            while (left < right && vowels.find(result[left]) == vowels.end()) {
                left++;
            }
            while (left < right && vowels.find(result[right]) == vowels.end()) {
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

### index.java Implementation

```index.java
class Solution {
    public String reverseVowels(String s) {
        // Step 1: Convert to character array
        char[] chars = s.toCharArray();
        
        // Step 2: Initialize two pointers
        int left = 0;
        int right = chars.length - 1;
        
        // Step 3: Traverse with two pointers
        while (left < right) {
            // If left is not a vowel, skip it
            if (!isVowel(chars[left])) {
                left++;
            }
            // If right is not a vowel, skip it
            else if (!isVowel(chars[right])) {
                right--;
            }
            // Both are vowels, swap them
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
    
    // Helper method to check if character is a vowel
    private boolean isVowel(char c) {
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' ||
               c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U';
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def reverseVowels(self, s: str) -> str:
        # Step 1: Convert string to list of characters
        chars = list(s)

        # Step 2: Initialize two pointers
        left = 0
        right = len(chars) - 1

        # Step 3: Traverse with two pointers
        while left < right:

            # If left is not a vowel, move left pointer
            if not self.isVowel(chars[left]):
                left += 1

            # If right is not a vowel, move right pointer
            elif not self.isVowel(chars[right]):
                right -= 1

            # Both are vowels, swap them
            else:
                chars[left], chars[right] = chars[right], chars[left]

                # Move both pointers
                left += 1
                right -= 1

        # Step 4: Convert list back to string
        return ''.join(chars)

    # Helper method to check if character is a vowel
    def isVowel(self, c: str) -> bool:
        return c in 'aeiouAEIOU'
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- The algorithm uses **two pointers**, one starting from the beginning and one from the end of the string.
- Each character is checked **at most once**, so the traversal takes **O(N)** time, where **N** is the total number of characters.
- Checking if a character is a vowel is a **constant-time operation O(1)**, either via conditional checks or a HashSet lookup.
- There are **no nested loops** or repeated passes over the string.
- Therefore, the overall **time complexity is O(N)**.

#### Space Complexity: O(1)





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/reverse-vowels-of-a-string)*
