# Common Elements In 3 Sorted Array

> **Slug:** `common-elements-in-3-sorted-array-article`  
> **Published:** 2026-07-01T10:35:09.015Z  
> **Updated:** 2026-07-01T10:35:09.018Z  
> **Keywords:** Array  
> **Cover Image:** ![Common Elements In 3 Sorted Array](6a44ed5403760e05bbb1cfd0)

**Description:** Common Elements in Three Sorted Arrays DSA solution using three pointers. O(n1+n2+n3) algorithm explained.

---

## Problem Statement

Given three integer arrays array1, array2, and array3, sorted in **non-decreasing order**, find all the elements that are common to all three arrays. The result should be a list of these common elements, also sorted in non-decreasing order. Importantly, the list of common elements should not contain any duplicates.

## Example 1

> [!NOTE]
> **INFO**
> Input: array1=[1,5,10,20,40,80] array2=[6,7,20,80,100] array3=[3,4,15,20,30,70,80,120]
> 
> Output: 20 80
> 
> Explanation: Only 20 and 80 appear in all three arrays; duplicates are removed.

## Example 2

> [!NOTE]
> **INFO**
> Input: array1=[1,2,3] array2=[1,2,3] array3=[1,2,3]
> 
> Output: 1 2 3
> 
> Explanation: Every element is common, output keeps sorted order without duplicates.

## Intuition

Since all three arrays are already sorted, we can solve the problem efficiently using three pointers. One pointer is used for each array to compare elements at the current positions. If the elements at all three pointers are equal, then that value is common in all arrays, so we add it to the result and move all three pointers forward. If the elements are not equal, we move the pointer that points to the smallest element. This is because a smaller element cannot become equal to larger elements later in the arrays since the arrays are sorted in non-decreasing order. To avoid duplicate values in the final answer, we only add an element if it is different from the last inserted element in the result list.

## Algorithm

**Step 1:** Create an empty list called result to store the common elements.

**Step 2:** Initialize three pointers i, j, and k with value 0. These pointers will traverse array1, array2, and array3 respectively.

**Step 3:** Traverse the arrays while all three pointers remain within the array bounds.

**Step 4:** Check if the current elements of all three arrays are equal.

- If they are equal, add the element to the result list if it is not already the last inserted element.
- Move all three pointers one step forward.

**Step 5:** If the elements are not equal:

- Move pointer i forward if array1[i] is the smallest element.
- Otherwise, move pointer j forward if array2[j] is the smallest element.
- Otherwise, move pointer k forward.

**Step 6: **Continue this process until any one of the arrays is completely traversed.

**Step 7:** Return the result list containing all common elements.





### C++ Implementation

```cpp
class Solution {
public:

    vector<int> commonElements(vector<int>& array1,
                               vector<int>& array2,
                               vector<int>& array3) {

        vector<int> result;

        int i = 0, j = 0, k = 0;

        while (i < array1.size() &&
               j < array2.size() &&
               k < array3.size()) {

            if (array1[i] == array2[j] &&
                array2[j] == array3[k]) {

                // Add only if not duplicate of last added element
                if (result.empty() ||
                    result.back() != array1[i]) {

                    result.push_back(array1[i]);
                }

                i++;
                j++;
                k++;

            } else if (array1[i] < array2[j]) {

                i++;

            } else if (array2[j] < array3[k]) {

                j++;

            } else {

                k++;
            }
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public List<Integer> commonElements(int[] array1, int[] array2, int[] array3) {
        List<Integer> result = new ArrayList<>();
        int i = 0, j = 0, k = 0;

        while (i < array1.length && j < array2.length && k < array3.length) {

            if (array1[i] == array2[j] && array2[j] == array3[k]) {
                // Add only if not duplicate of last added element
                if (result.isEmpty() || result.get(result.size() - 1) != array1[i]) {
                    result.add(array1[i]);
                }
                i++; j++; k++;

            } else if (array1[i] < array2[j]) {
                i++;
            } else if (array2[j] < array3[k]) {
                j++;
            } else {
                k++;
            }
        }

        return result;
    }
}
```

### Python Implementation

```python
class Solution:

    def commonElements(self, array1, array2, array3):

        result = []

        i = j = k = 0

        while (i < len(array1) and
               j < len(array2) and
               k < len(array3)):

            if (array1[i] == array2[j] and
                array2[j] == array3[k]):

                # Add only if not duplicate of last added element
                if (not result or
                    result[-1] != array1[i]):

                    result.append(array1[i])

                i += 1
                j += 1
                k += 1

            elif array1[i] < array2[j]:

                i += 1

            elif array2[j] < array3[k]:

                j += 1

            else:

                k += 1

        return result
```

## Time Complexity: O(n1 + n2 + n3)

**Explanation: **Each pointer moves through its array only once. Since the arrays are traversed in a single pass, the total time taken is proportional to the sum of the sizes of the three arrays.

## Space Complexity: O(1)

**Explanation: **No extra data structures are used apart from the result list. Therefore, the auxiliary space complexity is constant.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/common-elements-in-3-sorted-array-article)*
