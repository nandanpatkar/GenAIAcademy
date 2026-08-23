# Multiply Each Element of an Array by 10

> **Slug:** `multiply-each-element-of-an-array-by-10`  
> **Published:** 2026-04-06T13:02:36.536Z  
> **Updated:** 2026-04-06T13:02:36.633Z  
> **Keywords:** None  
> **Cover Image:** ![Multiply Each Element of an Array by 10]({'id': '69d3ae7e9d1c5a8b85044168', 'url': 'https://cdn.codehelp.in/media/articles/1775480442620-0540f071-Multiply_Each_.webp'})

**Description:** Multiply each element in an array by 10 using a simple loop. Learn an easy DSA transformation problem with O(n) solution.

---

## Problem Description

You are given an array of integers and your task is to return a new array where each element in the given array is multiplied by 10.

Your function should take an array as input and output another array where each integer is multiplied by 10.

## Example

> [!NOTE]
> **INFO**
> ### Example 1
> 
> Input:Input: arr = [1, 2, 3, 4, 5]
> 
> Output: [10, 20, 30, 40, 50]
> 
> Explanation: Each element is multiplied by 10.

> [!NOTE]
> **INFO**
> ### Example 2
> 
> Input: Input: arr = [0, -1, -2, 3, 4]
> 
> Output: [0, -10, -20, 30, 40]
> 
> Explanation: Negative and zero values also get multiplied correctly.

## Intuition

The problem is very simple:

- We just need to apply the same operation (multiply by 10) to every element in the array.
- This means we loop through the array, pick each element, multiply it by 10, and store the result.
- The key idea is that the transformation is **element-wise** and does not depend on other elements in the array.

## Approach

1. **Create a Result Vector**
2. - Start by defining an empty vector `result` that will store the multiplied values.
3. **Iterate Over Input Array**
4. - Use a loop to go through each element `num` in the given input array `arr`.
5. **Multiply and Store**
6. - For each element, compute `num * 10`.
  - Append this new value into the `result` vector using `push_back`.
7. **Return the Result**
8. - After processing all elements, return the `result` vector which now contains all elements multiplied by 10.

## Algorithm

1. Input: A vector `arr` containing integers.
2. Initialize an empty vector `result`.
3. For each element `num` in `arr`:
4. - Compute `num * 10`.
  - Append the computed value to `result` using `push_back`.
5. After finishing the loop, return the `result` vector.





## Code

### C++ Code Implementation

```c++ code
vector<int> multiplyByTen(const vector<int>& arr) {
    vector<int> result;
    for (int num : arr) {
        result.push_back(num * 10);
    }
    return result;
}
```

### Java Code Implementation

```java code
import java.util.*;

public class Solution {
    public static List<Integer> multiplyByTen(List<Integer> arr) {
        List<Integer> result = new ArrayList<>();
        for (int num : arr) {
            result.add(num * 10);
        }
        return result;
    }
}
```

## Complexity Analysis

### **Time Complexity**

- The function iterates through the array once.
- For each element, one multiplication and one `push_back` operation are performed, both constant-time operations.
- Total complexity: **O(N)**, where N is the number of elements in the array.

### **Space Complexity**

- A new vector `result` is created to store the multiplied elements.
- In the worst case, it stores all N elements.
- Total complexity: **O(N)**.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/multiply-each-element-of-an-array-by-10)*
