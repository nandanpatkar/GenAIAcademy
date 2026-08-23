# Rotate image

> **Slug:** `rotate-image-article`  
> **Published:** 2026-06-30T17:22:15.267Z  
> **Updated:** 2026-06-30T17:22:15.270Z  
> **Keywords:** Array  
> **Cover Image:** ![Rotate image](6a43fb3364b25c8c10cb98d3)

**Description:** Learn how to rotate a matrix 90 degrees clockwise in-place using transpose and reverse rows. Complete DSA explanation.

---

## Problem Statement

You are given an N x N 2D matrix that represents an image. Your task is to rotate this image by **90 degrees clockwise**.

A key requirement is that you must perform this rotation **in-place**, which means you have to modify the input matrix directly. You are not allowed to use another 2D matrix to store the result.

## Example 1

> [!NOTE]
> **INFO**
> Input: N=4, matrix=[[7263,3483,9154,62], [5944,8721,5154,9591], [9752,1696,6616,3170], [5287,7014,7885,2554]]
> 
> Output: 5287 9752 5944 7263 7014 1696 8721 3483 7885 6616 5154 9154 2554 3170 9591 62
> 
> **Explanation:** The matrix is rotated 90 degrees clockwise.

## Example 2

> [!NOTE]
> **INFO**
> Input:  N=3, matrix=[[1,2,3], [4,5,6], [7,8,9]]
> 
> Output: 5 2 1 6 3 3 7 4 1
> 
> **Explanation:** The matrix is rotated 90 degrees clockwise.

## Intuition

To rotate a matrix by 90 degrees clockwise in-place, we can perform the operation in two simple steps:

- First, transpose the matrix.
- Then, reverse every row.

Transposing the matrix converts rows into columns by swapping elements across the main diagonal. After transposition, reversing each row rearranges the elements into the required clockwise rotated order.

Since all operations are performed directly on the original matrix, no extra 2D matrix is required.

## Algorithm

**Step 1:** Traverse the matrix and transpose it.

- Swap every element at position (i, j) with the element at position (j, i).
- Only process elements above the diagonal to avoid swapping the same pair twice.

**Step 2: **After transposition, traverse every row of the matrix.

**Step 3:** Reverse each row by swapping the first element with the last element, the second element with the second last element, and so on.

**Step 4:** Continue this process for all rows until the matrix becomes rotated by 90 degrees clockwise.

**Step 5:** Since the matrix is modified directly, no return value is required.





### C++ Implementation

```cpp
class Solution {
public:

    void rotate90Clockwise(vector<vector<int>>& matrix, int N) {

        // Step 1: Transpose the matrix
        for (int i = 0; i < N; i++) {

            for (int j = i + 1; j < N; j++) {

                int temp = matrix[i][j];

                matrix[i][j] = matrix[j][i];

                matrix[j][i] = temp;
            }
        }

        // Step 2: Reverse each row
        for (int i = 0; i < N; i++) {

            for (int j = 0; j < N / 2; j++) {

                int temp = matrix[i][j];

                matrix[i][j] = matrix[i][N - j - 1];

                matrix[i][N - j - 1] = temp;
            }
        }
    }
};
```

### Java Implementation

```java
class Solution {
    public void rotate90Clockwise(int[][] matrix, int N) {
        // Step 1: Transpose the matrix
        for (int i = 0; i < N; i++) {
            for (int j = i + 1; j < N; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // Step 2: Reverse each row
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][N - j - 1];
                matrix[i][N - j - 1] = temp;
            }
        }
    }
}
```

### Python Implementation

```python
class Solution:

    def rotate90Clockwise(self, matrix, N):

        # Step 1: Transpose the matrix
        for i in range(N):

            for j in range(i + 1, N):

                matrix[i][j], matrix[j][i] = (
                    matrix[j][i],
                    matrix[i][j]
                )

        # Step 2: Reverse each row
        for i in range(N):

            for j in range(N // 2):

                matrix[i][j], matrix[i][N - j - 1] = (
                    matrix[i][N - j - 1],
                    matrix[i][j]
                )
```

## Time Complexity: O(N²)

**Explanation: **The matrix is traversed during transposition and again while reversing each row. Since the matrix contains N × N elements, the total time complexity is O(N²).

## Space Complexity: O(1)

**Explanation: **The rotation is performed directly on the input matrix without using any additional 2D matrix. Therefore, only constant extra space is required.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/rotate-image-article)*
