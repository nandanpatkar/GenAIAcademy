# Transpose of a Matrix

> **Slug:** `transpose-of-a-matrix-article`  
> **Published:** 2026-06-30T17:19:28.472Z  
> **Updated:** 2026-06-30T17:19:28.475Z  
> **Keywords:** Array  
> **Cover Image:** ![Transpose of a Matrix](6a43fa0a64b25c8c10cb98c8)

**Description:** Matrix Transpose algorithm explained with 2D array traversal, row-column interchange, and C++, Java, Python solutions.

---

## Problem Statement

Given a matrix A with dimensions n x m, your task is to compute and return its transpose. A transpose of a matrix is obtained by flipping it over its diagonal, which effectively means rows become columns and columns become rows.

## Example 1

> [!NOTE]
> **INFO**
> Input: Input: n = 1, m = 1, matrix = [[5]]
> 
> Output: 5
> 
> **Explanation:** A 1x1 matrix remains the same after transposition.

## Example 2

> [!NOTE]
> **INFO**
> Input:   Input: n = 2, m = 2, matrix = [[1, 2], [3, 4]]
> 
> Output: 1 3 2 4
> 
> **Explanation:** Transposing a 2x2 matrix swaps rows and columns.

## Intuition

The transpose of a matrix is formed by converting rows into columns and columns into rows. This means that the element present at position (i, j) in the original matrix will move to position (j, i) in the transposed matrix. To achieve this, we create a new matrix whose dimensions are reversed compared to the original matrix. Then, we traverse every element of the original matrix and place it in its new transposed position.

## Algorithm

**Step 1:** Check if the matrix is empty or null. If it is empty, return an empty matrix.

**Step 2: **Store the number of rows in variable n and the number of columns in variable m.

**Step 3:** Create a new matrix called transposed with dimensions m x n.

**Step 4:** Traverse every element of the original matrix using two nested loops.

**Step 5:** For every element at position (i, j), place it at position (j, i) in the transposed matrix.

**Step 6: **Continue this process until all elements are copied into their new positions.

**Step 7:** Return the transposed matrix.





### C++ Implementation

```cpp
class Matrix {
public:

    vector<vector<int>> transpose(vector<vector<int>>& matrix) {

        if (matrix.empty()) {
            return {};
        }

        int n = matrix.size();
        int m = matrix[0].size();

        // The dimensions of the transposed matrix are swapped
        vector<vector<int>> transposed(m, vector<int>(n));

        for (int i = 0; i < n; i++) {

            for (int j = 0; j < m; j++) {

                // Element at (i, j) moves to (j, i)
                transposed[j][i] = matrix[i][j];
            }
        }

        return transposed;
    }
};
```

### Java Implementation

```java
class Matrix {
    public int[][] transpose(int[][] matrix) {
        if (matrix == null || matrix.length == 0) {
            return new int[0][0];
        }

        int n = matrix.length;
        int m = matrix[0].length;

        // The dimensions of the transposed matrix are swapped
        int[][] transposed = new int[m][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                // Element at (i, j) moves to (j, i)
                transposed[j][i] = matrix[i][j];
            }
        }

        return transposed;
    }
}
```

### Python Implementation

```python
class Matrix:

    def transpose(self, matrix):

        if not matrix:
            return []

        n = len(matrix)
        m = len(matrix[0])

        # The dimensions of the transposed matrix are swapped
        transposed = [[0 for _ in range(n)] for _ in range(m)]

        for i in range(n):

            for j in range(m):

                # Element at (i, j) moves to (j, i)
                transposed[j][i] = matrix[i][j]

        return transposed
```

## Time Complexity: O(m x n)

**Explanation: **The algorithm traverses every element of the matrix exactly once. If the matrix contains n rows and m columns, the total number of operations is n × m.

## Space Complexity: O(m x n)

**Explanation: **A new matrix of size m x n is created to store the transpose of the original matrix. Therefore, the space required is proportional to the total number of elements in the matrix.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/transpose-of-a-matrix-article)*
