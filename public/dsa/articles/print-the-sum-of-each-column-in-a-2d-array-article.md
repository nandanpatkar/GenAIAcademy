# Print the Sum of Each Column in a 2D Array

> **Slug:** `print-the-sum-of-each-column-in-a-2d-array-article`  
> **Published:** 2026-06-30T17:15:02.615Z  
> **Updated:** 2026-06-30T17:15:02.618Z  
> **Keywords:** Array  
> **Cover Image:** ![Print the Sum of Each Column in a 2D Array](6a43f97f64b25c8c10cb98bf)

**Description:** DSA solution to calculate the sum of each column in a 2D array using matrix traversal. Includes C++, Java, Python, and complexity.

---

## Problem Statement

Given a 2D array, or matrix, of integers, your task is to calculate the sum of each column and return these sums as an array. Each element in the resulting array should represent the sum of the elements in the corresponding column of the input matrix.

## Example 1

> [!NOTE]
> **INFO**
> Input: Input: matrix = [[1, 2, 3], [4, 5, 6]]
> 
> Output: 5,7,9

## Example 2

> [!NOTE]
> **INFO**
> Input:  Input: matrix = [[7, 8], [9, 10], [11, 12]]
> 
> Output: 27,30

## Intuition

To calculate the sum of each column in a matrix, we process one column at a time. For every column, we traverse all rows and keep adding the elements present in that column.

After calculating the sum of a column, we store it in the result list. We repeat the same process for all columns in the matrix.

This approach ensures that every element of the matrix is visited exactly once while computing the column sums.

## Algorithm

**Step 1:** Create an empty list called result to store the sum of each column.

**Step 2: **Check if the matrix is empty or null. If it is empty, return the result list.

**Step 3:** Store the number of rows in variable n and the number of columns in variable m.

**Step 4:** Traverse all columns from 0 to m - 1.

**Step 5:** For every column, initialize a variable currentSum with value 0.

**Step 6: **Traverse all rows for the current column and add each element to currentSum.

**Step 7:** After processing the entire column, add currentSum to the result list.

**Step 8:** Repeat the process for all columns in the matrix.

**Step 9:** Return the result list containing the sum of every column.





### C++ Implementation

```cpp
class Solution {
public:

    vector<int> columnSums(vector<vector<int>>& matrix) {

        vector<int> result;

        if (matrix.empty()) {
            return result;
        }

        int n = matrix.size();
        int m = matrix[0].size();

        // Traverse through each column j
        for (int j = 0; j < m; j++) {

            int currentSum = 0;

            // Traverse through each row i for the fixed column j
            for (int i = 0; i < n; i++) {

                currentSum += matrix[i][j];
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
    public List<Integer> columnSums(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return result;

        int n = matrix.length;
        int m = matrix[0].length;

        // Traverse through each column j
        for (int j = 0; j < m; j++) {
            int currentSum = 0;
            // Traverse through each row i for the fixed column j
            for (int i = 0; i < n; i++) {
                currentSum += matrix[i][j];
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

    def columnSums(self, matrix):

        result = []

        if not matrix:
            return result

        n = len(matrix)
        m = len(matrix[0])

        # Traverse through each column j
        for j in range(m):

            current_sum = 0

            # Traverse through each row i for the fixed column j
            for i in range(n):

                current_sum += matrix[i][j]

            result.append(current_sum)

        return result
```

## Time Complexity: O(m x n)

**Explanation: **The algorithm traverses every element of the matrix exactly once. If the matrix contains n rows and m columns, the total number of operations is n × m.

## Space Complexity: O(1)

**Explanation: **No extra data structure is used apart from the result list used for storing the column sums. Therefore, the auxiliary space complexity is constant.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/print-the-sum-of-each-column-in-a-2d-array-article)*
