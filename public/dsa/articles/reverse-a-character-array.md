# Reverse a Character Array

> **Slug:** `reverse-a-character-array`  
> **Published:** 2026-07-04T21:41:19.795Z  
> **Updated:** 2026-07-04T21:41:19.800Z  
> **Keywords:** Reverse a Character Array  
> **Cover Image:** ![Reverse a Character Array](https://cdn.codehelp.in/media/Reverse  a.png)

**Description:** Learn how to reverse a character array. Step-by-step explanation with examples to handle strings and array manipulations.

---

## Problem Statement

You are given a character array that you need to reverse in-place. The challenge entails modifying the original array without allocating additional space for another array.

The function will receive the character array as input and must return the array with its elements reversed. It is crucial to achieve this in-place by altering the positions of elements directly within the input array.

## Example 1

> [!NOTE]
> **INFO**
> **Input:**  ['a', 'b', 'c', 'd', 'e']
> **Output:** e, d, c, b, a
> **Explanation:** Reversing ['a', 'b', 'c', 'd', 'e'] results in ['e', 'd', 'c', 'b', 'a'].

## Example 2

> [!NOTE]
> **INFO**
> **Input: **['x', 'y', 'z']
> **Output:** z, y, x
> **Explanation:**Reversing ['x', 'y', 'z'] results in ['z', 'y', 'x'].

## Example 3

> [!NOTE]
> **INFO**
> **Input: ** ['1', '2', '3', '4', '5', '6']
> **Output:** 6,5,4,3,2,1
> **Explanation: **Reversing ['1', '2', '3', '4', '5', '6'] results in ['6', '5', '4', '3', '2', '1'].

## Constraints

- The length of the character array will be
between **1** and** 10****5**
- The function should return an integer representing the length of the string.

### Real-Life Analogy

Reversing a character array in-place is like a class of kids preparing for a Magic Mirror Parade. The kids stand in a line, and the teacher needs their order reversed without creating a new line or letting anyone step out.
To achieve this, the kids at the two ends swap positions first, then the next pair moves inward and swaps, and this continues until they reach the middle.
The entire reversal happens right where they stand, using only position swaps, just like how an array is reversed in-place by swapping characters from the start and end until the pointers meet.

### Brute-Force Approach
Intuition

A simple way to reverse an array is to create a new array and start copying elements from the end of the original array to the beginning of the new one. This gives the correct reversed order easily and is very beginner-friendly to understand. However, this solution breaks the in-place requirement because we use extra space to build a new array instead of modifying the original one. For problems that strictly demand an in-place reversal, this method is not allowed. It is shown only to illustrate the basic idea of reversal and to highlight why it cannot be used in scenarios where extra space is restricted.

### Algorithm

1. Firstly, We create a counter that will keep track of how many characters we have seen. In the beginning, this counter is 0 because we have not checked anything yet.
2. Now, begin moving through the string from the first character to the last. Each time we look at a character, increase our counter by 1. This mean, every time we see a new character, we add one more to our total count.
3. When we have checked all the characters and there are no more left, the value inside our counter represents the total number of characters in the string. At last, we return this final counter value as the answer.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {

        // WRONG - Uses extra space!
        vector<char> temp(s.size());

        // Copy in reverse order
        for (int i = 0; i < s.size(); i++) {
            temp[i] = s[s.size() - 1 - i];
        }

        // Copy back
        for (int i = 0; i < s.size(); i++) {
            s[i] = temp[i];
        }
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public void reverseString(char[] s) {
        // WRONG - Uses extra space!
        char[] temp = new char[s.length];
        
        for (int i = 0; i < s.length; i++) {
            temp[i] = s[s.length - 1 - i];
        }
        
        // Copy back
        for (int i = 0; i < s.length; i++) {
            s[i] = temp[i];
        }
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def reverse_string(self, s):
        # WRONG - Uses extra space
        
        temp = [''] * len(s)

        # Copy in reverse order
        for i in range(len(s)):
            temp[i] = s[len(s) - 1 - i]

        # Copy back
        for i in range(len(s)):
            s[i] = temp[i]
```

### Complexity Analysis

#### Time Complexity: O(N)

- The array is processed in two passes.
- In the first pass, all **N elements** are copied into a temporary array in reverse order.
- In the second pass, the reversed elements are copied back into the original array.
- Each pass visits every element exactly once.
- Even though there are two loops, the total work is still linear.
- Therefore, the overall time complexity is **O(N)**.

#### **Space Complexity: O(N)**

- A temporary array of size **N** is created to store the reversed elements.
- This extra storage grows linearly with the input size.
- The original array is not counted as extra space.
- Since additional memory is required for all elements, the approach is **not in-place**.
- Therefore, the space complexity is **O(N)**.

## Optimal Approach

### Intuition

A clean and efficient way to reverse a string in-place is to use the two-pointer technique. One pointer starts at the beginning of the array, and the other starts at the end. By swapping the characters at these two positions and gradually moving both pointers toward the center, the entire array gets reversed without needing any extra space. This method works because each pair of characters is put into its correct reversed position in a single step. It is simple, efficient, and perfectly satisfies the in-place requirement.

### Algorithm

1. Begin by placing one pointer at the very start of the array, which we call the *left* pointer. Place the second pointer at the very end of the array, which we call the *right* pointer. These two pointers mark the positions that will be swapped first.
2. Now keep repeating the process while the left pointer is still before the right pointer. At each step, swap the characters at the left and right positions so they move to their correct reversed places. After swapping, move the left pointer one step to the right, and move the right pointer one step to the left. This gradually brings the pointers toward the center of the array.
3. Once the left pointer reaches the right pointer or goes past it, all the necessary swaps are complete. At this point, the entire array has been reversed in-place, and no further steps are needed.

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    void reverseCharArray(vector<char>& arr) {
        int left = 0;
        int right = arr.size() - 1;
        while (left < right) {
            swap(arr[left], arr[right]);
            ++left;
            --right;
        }
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public void reverseCharArray(char[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            ++left;
            --right;
        }
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def reverseCharArray(self, arr: List[str]) -> None:
        """
        Logic: Two-Pointer Swap
        1. Place a 'left' pointer at the start and a 'right' pointer at the end.
        2. Swap the characters at these positions.
        3. Increment 'left' and decrement 'right'.
        4. Continue until the pointers meet or cross.
        """
        left = 0
        right = len(arr) - 1
        
        while left < right:
            # Pythonic swap: No temporary variable needed
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
            right -= 1
```

### Complexity Analysis

#### Time Complexity: O(N)

- The two-pointer method touches each character at most once.
- Even though we swap pairs, the total number of operations grows in direct proportion to the length of the array.
- This means the process runs in linear time.
- So the overall time complexity is **O(N)**, which is the most efficient you can achieve for reversing a sequence.

#### Space Complexity: O(1)

- This approach uses only a few simple variables: two pointers to track positions and a temporary variable to help with swapping.
- No additional array or extra storage is created.
- Since the amount of space used does not increase with the size of the input, the space complexity remains **O(1)**.
- This makes the solution perfectly in-place and fully satisfies the problem’s constraints.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/reverse-a-character-array)*
