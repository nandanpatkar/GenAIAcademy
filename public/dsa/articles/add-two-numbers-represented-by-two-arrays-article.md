# Add Two Numbers Represented By Two Arrays

> **Slug:** `add-two-numbers-represented-by-two-arrays-article`  
> **Published:** 2026-06-30T17:04:39.426Z  
> **Updated:** 2026-06-30T17:04:39.429Z  
> **Keywords:** Array  
> **Cover Image:** ![Add Two Numbers Represented By Two Arrays](6a43f70864b25c8c10cb98aa)

**Description:** Add Two Numbers DSA solution using array traversal, carry handling, reverse digits, simulation algorithm, C++, Java & Python.

---

## Problem Statement

You are given two non-empty arrays, nums1 and nums2, representing two non-negative integers. The digits are stored in reverse order, and each of their elements contains a single digit. Your task is to add the two numbers and return the sum as an array in the same digit-reversed format.

## Example 1

> [!NOTE]
> **INFO**
> Input: nums1=[2,4,3] nums2=[5,6,4]
> 
> Output: 7 0 8
> 
> Explanation: 342 + 465 = 807 → reversed digits [7,0,8]

## Example 2

> [!NOTE]
> **INFO**
> Input:  nums1=[0] nums2=[0]
> 
> Output: 0
> 
> Explanation: 0 + 0 = 0 → [0]

## Intuition

The digits of both numbers are stored in reverse order, which means we can directly start adding digits from index 0 just like normal addition from right to left.

We traverse both arrays simultaneously and add the corresponding digits along with the carry generated from the previous addition. After calculating the sum:

- The last digit becomes part of the result.
- The remaining value becomes the new carry.

If one array becomes shorter than the other, we continue using the remaining digits of the larger array. After all digits are processed, if a carry still remains, it is also added to the result.

## Algorithm

**Step 1:** Create an empty list called result to store the digits of the final sum.

**Step 2: **Initialize a variable carry with value 0.

**Step 3:** Store the lengths of both arrays.

**Step 4:** Traverse the arrays using a loop while:

- There are still digits left in nums1, or
- There are still digits left in nums2, or
- A carry value still exists.

**Step 5:** Start each iteration with sum = carry.

**Step 6: **If the current index exists in nums1, add that digit to sum.

**Step 7:** If the current index exists in nums2, add that digit to sum.

**Step 8:** Add sum % 10 to the result list because it represents the current digit of the answer.

**Step 9:** Update the carry using sum / 10.

**Step 10:** Continue the process until all digits and carry are processed.

**Step 11:** Return the result list containing the final sum in reverse order.







### C++ Implementation

```cpp
class Solution {
public:

    vector<int> addTwoNumbers(vector<int>& nums1,
                              vector<int>& nums2) {

        vector<int> result;

        int carry = 0;

        int n1 = nums1.size();
        int n2 = nums2.size();

        for (int i = 0;
             i < n1 || i < n2 || carry != 0;
             i++) {

            int sum = carry;

            if (i < n1) {
                sum += nums1[i];
            }

            if (i < n2) {
                sum += nums2[i];
            }

            result.push_back(sum % 10);

            carry = sum / 10;
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public List<Integer> addTwoNumbers(int[] nums1, int[] nums2) {
        List<Integer> result = new ArrayList<>();
        int carry = 0;
        int n1 = nums1.length, n2 = nums2.length;

        for (int i = 0; i < n1 || i < n2 || carry != 0; i++) {
            int sum = carry;
            if (i < n1) sum += nums1[i];
            if (i < n2) sum += nums2[i];
            result.add(sum % 10);
            carry = sum / 10;
        }

        return result;
    }
}
```

### Python Implementation

```python
class Solution:

    def addTwoNumbers(self, nums1, nums2):

        result = []

        carry = 0

        n1 = len(nums1)
        n2 = len(nums2)

        i = 0

        while i < n1 or i < n2 or carry != 0:

            total = carry

            if i < n1:
                total += nums1[i]

            if i < n2:
                total += nums2[i]

            result.append(total % 10)

            carry = total // 10

            i += 1

        return result
```

## Time Complexity: O(max(n1, n2))

**Explanation: **The loop runs until all digits of both arrays are processed. In the worst case, the number of iterations is equal to the length of the larger array.

## Space Complexity: O(max(n1, n2))

**Explanation: **The result list stores the digits of the final sum. In the worst case, the result can contain one extra digit due to carry, so the space required is proportional to the size of the larger number.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/add-two-numbers-represented-by-two-arrays-article)*
