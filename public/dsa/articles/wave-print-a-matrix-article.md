# Wave Print A Matrix

> **Slug:** `wave-print-a-matrix-article`  
> **Published:** 2026-07-01T10:37:37.161Z  
> **Updated:** 2026-07-01T10:37:37.164Z  
> **Keywords:** Array  
> **Cover Image:** ![Wave Print A Matrix](6a44ede603760e05bbb1cfd8)

**Description:** Wave Print Matrix DSA solution using column-wise zig-zag traversal. Efficient O(m×n) algorithm explained.

---

## Problem Statement

Given a 2D matrix of size m x n, your task is to return its elements arranged in a 'wave' order. This means starting from the top-most row and printing elements down in one column, then moving to the next column and printing them up, and continuing this zig-zag pattern until all columns are processed.

## Example 1

> [!NOTE]
> **INFO**
> Input: m=3 n=3 matrix=[[1,2,3],[4,5,6],[7,8,9]]
> 
> Output: 1 4 7 8 5 2 3 6 9
> 
> Explanation: Wave order (col-wise): 1 4 7 ↓, then 8 5 2 ↑, then 3 6 9 ↓.

## Example 2

> [!NOTE]
> **INFO**
> Input:  m=3 n=4 matrix=[[1,2,3,4],[5,6,7,8],[9,10,11,12]]
> 
> Output: 1 5 9 10 6 2 3 7 11 12 8 4
> 
> Explanation: Even columns top→bottom, odd columns bottom→top.

## Intuition

The matrix needs to be traversed column by column in a zig-zag manner. For one column, the elements are collected from top to bottom, and for the next column, the elements are collected from bottom to top. The direction depends on the column index:

- Even-indexed columns are traversed from top to bottom.
- Odd-indexed columns are traversed from bottom to top.

By following this alternating pattern for every column, we can generate the required wave traversal of the matrix.

## Algorithm

**Step 1:** Create an empty list called result to store the wave traversal of the matrix.

**Step 2:** Traverse all columns from 0 to n - 1.

**Step 3:** For every column, check whether the column index is even or odd.

**Step 4:** If the column index is even, traverse that column from top to bottom and add all elements to the result list.

**Step 5:** If the column index is odd, traverse that column from bottom to top and add all elements to the result list.

**Step 6: **Continue this process for all columns of the matrix.

**Step 7:** Return the result list containing the wave order traversal.





### C++ Implementation

```cpp
class Solution {
public:

    vector<int> wavePrintMatrix(vector<vector<int>>& matrix, int m, int n) {

        vector<int> result;

        for (int j = 0; j < n; j++) {

            if (j % 2 == 0) {

                // Even column: top to bottom
                for (int i = 0; i < m; i++) {
                    result.push_back(matrix[i][j]);
                }

            } else {

                // Odd column: bottom to top
                for (int i = m - 1; i >= 0; i--) {
                    result.push_back(matrix[i][j]);
                }
            }
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public List<Integer> wavePrintMatrix(int[][] matrix, int m, int n) {
        List<Integer> result = new ArrayList<>();

        for (int j = 0; j < n; j++) {
            if (j % 2 == 0) {
                // Even column: top to bottom
                for (int i = 0; i < m; i++) {
                    result.add(matrix[i][j]);
                }
            } else {
                // Odd column: bottom to top
                for (int i = m - 1; i >= 0; i--) {
                    result.add(matrix[i][j]);
                }
            }
        }

        return result;
    }
}
```

### Python Implementation

```python
class Solution:

    def wavePrintMatrix(self, matrix, m, n):

        result = []

        for j in range(n):

            if j % 2 == 0:

                # Even column: top to bottom
                for i in range(m):
                    result.append(matrix[i][j])

            else:

                # Odd column: bottom to top
                for i in range(m - 1, -1, -1):
                    result.append(matrix[i][j])

        return result
```

## Time Complexity: O(m x n)

**Explanation: **Every element of the matrix is visited exactly once during the traversal. Since the matrix contains m × n elements, the total time complexity is O(m × n).

## Space Complexity: O(1)

**Explanation: **No extra data structure is used apart from the result list used for storing the traversal. Therefore, the auxiliary space complexity is constant.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/wave-print-a-matrix-article)*
