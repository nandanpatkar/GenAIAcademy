# Remove K Digits

> **Slug:** `remove-k-digits`  
> **Published:** 2026-08-22T17:04:51.472Z  
> **Updated:** 2026-08-22T17:04:51.475Z  
> **Keywords:** Remove K Digits, Stacks  
> **Cover Image:** ![Remove K Digits](6a89d699f695d4d77644fcc2)

**Description:** Learn how to remove K digits to form the smallest possible number using stacks, step-by-step logic, and complexity analysis.

---

## Problem Statement

Given a string num that represents a non-negative integer and an integer k, your task is to form the smallest possible integer by removing exactly k digits from num without changing the order of the remaining digits. After removing the digits, the result should not have leading zeros unless the number is zero itself.

> [!NOTE]
> **INFO**
> Example 1
> Input:  num = '10', k = 2
> 
> Output:  0
> 
> **Explanation:** Removing both digits results in '0'.

> [!NOTE]
> **INFO**
> Example 2
> Input: num = '1432219', k = 3
> 
> Output: 1219
> 
> **Explanation:** Removing the digits '4', '3', and '2' results in the smallest possible integer '1219'.

## Optimal Approach

### Intuition

To obtain the smallest possible number, we should remove larger digits whenever a smaller digit appears after them.

For example, in the number "1432219", when we encounter '3' after '4', keeping '4' would make the number larger. Therefore, removing '4' helps create a smaller result.

We can build the answer digit by digit using a StringBuilder as a stack-like structure.

While processing each digit:

- If the current digit is smaller than the last digit already included in the result, we remove the larger digit (if we still have removals available).
- We continue removing digits as long as it helps make the number smaller.

After processing all digits, if some removals are still left, we remove digits from the end because they contribute the least to making the number smaller.

Finally, we remove any leading zeros and return the resulting number.

## Algorithm

**Step 1:** If k is equal to the length of the number, return "0" because all digits must be removed.

**Step 2: **Create an empty StringBuilder named result to store the digits of the smallest possible number.

**Step 3:** Traverse each digit of the string num.

**Step 4: **For the current digit:

- While:
remove the last digit from result and decrement k.
- - k is greater than 0,
  - result is not empty, and
  - the last digit in result is greater than the current digit,

**Step 5: **Append the current digit to result.

**Step 6:** After processing all digits, if k is still greater than 0, remove k digits from the end of result.

**Step 7:** Remove all leading zeros from the constructed number.

**Step 8:** Extract the remaining substring.

**Step 9:** If the resulting string is empty, return "0"; otherwise, return the resulting string.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string removeKdigits(string num, int k) {
        int n = num.size();
        if (k == n) return "0";
        
        string result = "";
        for (char digit : num) {
            while (k > 0 && !result.empty() && result.back() > digit) {
                result.pop_back();
                k--;
            }
            result.push_back(digit);
        }
        
        while (k > 0) {
            result.pop_back();
            k--;
        }
        
        size_t start = result.find_first_not_of('0');
        result = start == string::npos ? "0" : result.substr(start);
        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public String removeKdigits(String num, int k) {
        int n = num.length();
        if (k == n) return "0";
        
        StringBuilder result = new StringBuilder();
        for (char digit : num.toCharArray()) {
            while (k > 0 && result.length() > 0 && result.charAt(result.length() - 1) > digit) {
                result.deleteCharAt(result.length() - 1);
                k--;
            }
            result.append(digit);
        }
        
        while (k > 0) {
            result.deleteCharAt(result.length() - 1);
            k--;
        }
        
        int start = 0;
        while (start < result.length() && result.charAt(start) == '0') start++;
        
        String finalResult = result.substring(start);
        return finalResult.isEmpty() ? "0" : finalResult;
    }
}
```

### Python Implementation

```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        n = len(num)
        if k == n:
            return "0"

        result = []

        for digit in num:
            while k > 0 and result and result[-1] > digit:
                result.pop()
                k -= 1

            result.append(digit)

        while k > 0:
            result.pop()
            k -= 1

        final_result = ''.join(result).lstrip('0')

        return final_result if final_result else "0"
```

### Complexity Analysis

#### Time Complexity: O(n)

- Each digit is added to the result once and can be removed at most once.
- Therefore, the total number of operations is linear in the length of the string.

#### Space Complexity: O(n)

- The StringBuilder may store up to all digits of the input number, requiring O(n) extra space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/remove-k-digits)*
