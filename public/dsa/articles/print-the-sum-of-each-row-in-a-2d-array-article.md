# Print the Sum of Each Row in a 2D Array

> **Slug:** `print-the-sum-of-each-row-in-a-2d-array-article`  
> **Published:** 2026-06-30T17:11:03.871Z  
> **Updated:** 2026-06-30T17:11:03.874Z  
> **Keywords:** Array  
> **Cover Image:** ![Print the Sum of Each Row in a 2D Array](6a43f7a764b25c8c10cb98b2)

**Description:** Learn how to find row sums in a 2D array using nested loops. Step-by-step DSA solution with C++, Java, and Python.

---

## Problem Statement

Given a 2D array consisting of integers, your task is to write a function that computes the sum of the integers in each row and returns an array containing each of these sums. The function receives a 2D vector (or list) of integers as input. Each sub-list within this 2D vector symbolizes a distinct row of the array. The expected output is a vector (or list) of integers, where each integer represents the sum of the respective row from the input array.

## Example 1

> [!NOTE]
> **INFO**
> Input: arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
> 
> Output: [6, 15, 24]
> 
> Explanation: 
> 
> - he sum of the first row is 1 + 2 + 3 = 6.
> - The sum of the second row is 4 + 5 + 6 = 15.
> - The sum of the third row is 7 + 8 + 9 = 24.
> 
> Therefore, the output is `[6, 15, 24]`.

## Example 2

> [!NOTE]
> **INFO**
> Input:  arr = [[1], [2, 2], [3, 3, 3]]
> 
> Output: [1, 4, 9]
> 
> Explanation: 
> 
> - The sum of the first row is 1.
> - The sum of the second row is 2 + 2 = 4.
> - The sum of the third row is 3 + 3 + 3 = 9.
> 
> Thus, the resulting output is `[1, 4, 9]`.

## Intuition

To find the sum of each row in a 2D array, we process one row at a time. For every row, we calculate the total by adding all elements present in that row.

After calculating the sum of a row, we store it in the result list. We repeat the same process for all rows in the array.

## Algorithm

**Step 1:** Create an empty list called result to store the sum of each row.

**Step 2: **Check if the input array is empty or null. If it is empty, return the result list.

**Step 3:** Traverse each row of the 2D array using a loop.

**Step 4:** For every row, initialize a variable currentSum with value 0.

**Step 5:** Traverse all elements of the current row and add each element to currentSum.

**Step 6: **After processing the entire row, add currentSum to the result list.

**Step 7:** Repeat the process for all rows in the array.

**Step 8:** Return the result list containing the sum of every row.





### C++ Implementation

```cpp
class Solution {
public:

    vector<int> rowSums(vector<vector<int>>& arr) {

        vector<int> result;

        if (arr.empty()) {
            return result;
        }

        // Iterate through each row
        for (int i = 0; i < arr.size(); i++) {

            int currentSum = 0;

            // Sum all elements in the current row
            for (int j = 0; j < arr[i].size(); j++) {

                currentSum += arr[i][j];
            }

            result.push_back(currentSum);
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public List<Integer> rowSums(int[][] arr) {
        List<Integer> result = new ArrayList<>();
        if (arr == null || arr.length == 0) return result;

        // Iterate through each row
        for (int i = 0; i < arr.length; i++) {
            int currentSum = 0;
            // Sum all elements in the current row
            for (int j = 0; j < arr[i].length; j++) {
                currentSum += arr[i][j];
            }
            result.add(currentSum);
        }
        return result;
    }
}
```

### Python Implementation

```python
class Solution:

    def rowSums(self, arr):

        result = []

        if not arr:
            return result

        # Iterate through each row
        for i in range(len(arr)):

            current_sum = 0

            # Sum all elements in the current row
            for j in range(len(arr[i])):

                current_sum += arr[i][j]

            result.append(current_sum)

        return result
```

## Time Complexity: O(m x n)

**Explanation: **The algorithm traverses every element of the 2D array exactly once. If the matrix contains m rows and n columns, the total number of operations is m × n.

## Space Complexity: O(1)

**Explanation: **No extra data structure is used apart from the result list used for storing the row sums. Therefore, the auxiliary space complexity is constant.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/print-the-sum-of-each-row-in-a-2d-array-article)*
