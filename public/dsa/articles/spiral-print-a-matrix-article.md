# Spiral Print A Matrix

> **Slug:** `spiral-print-a-matrix-article`  
> **Published:** 2026-07-01T10:43:34.197Z  
> **Updated:** 2026-07-01T10:43:34.201Z  
> **Keywords:** Array, Matrix  
> **Cover Image:** ![Spiral Print A Matrix](6a44eef803760e05bbb1cfe5)

**Description:** Traverse a matrix in spiral order using four boundaries. DSA solution with C++, Java, Python, and O(m×n) complexity.

---

## Problem Statement

Given a 2D matrix of size m x n, write a function to traverse the matrix in a spiral order and return the elements of the matrix in a single list. The spiral order starts from the top-left corner going to the right, then goes downwards, then to the left, and finally upwards. The order continues spirally until all elements are traversed.

## Example 1

> [!NOTE]
> **INFO**
> Input: m=3 n=3 matrix=[[1,2,3],[4,5,6],[7,8,9]]
> 
> Output: 1 2 3 6 9 8 7 4 5
> 
> Explanation: Outer ring → 1 2 3 6 9 8 7 4, inner center → 5.

## Example 2

> [!NOTE]
> **INFO**
> Input:  m=3 n=4 matrix=[[1,2,3,4],[5,6,7,8],[9,10,11,12]]
> 
> Output: 1 2 3 4 8 12 11 10 9 5 6 7
> 
> Explanation: First layer (top row, right col, bottom row rev, left col up) then inner 2-element row.

## Intuition

To traverse the matrix in spiral order, we process the matrix layer by layer. At every step, we move in four directions:

- Left to right across the top row
- Top to bottom along the right column
- Right to left across the bottom row
- Bottom to top along the left column

To keep track of the remaining part of the matrix, we maintain four boundaries:

- top for the first row
- bottom for the last row
- left for the first column
- right for the last column

After traversing one side, we move the corresponding boundary inward. This process continues until all elements of the matrix are visited.

## Algorithm

**Step 1:** Create an empty list called result to store the spiral traversal of the matrix.

**Step 2:** Initialize four variables:

- top = 0
- bottom = number of rows - 1
- left = 0
- right = number of columns - 1

These variables represent the current boundaries of the matrix.

**Step 3:** Traverse the matrix while top <= bottom and left <= right.

**Step 4:** Traverse from left to right across the top row and add all elements to the result list. Then increment top.

**Step 5:** Traverse from top to bottom along the right column and add all elements to the result list. Then decrement right.

**Step 6: **Check if top <= bottom.

- If true, traverse from right to left across the bottom row and add all elements to the result list.
- Then decrement bottom.

**Step 7:** Check if left <= right.

- If true, traverse from bottom to top along the left column and add all elements to the result list.
- Then increment left.

**Step 8:** Repeat the process until all elements are traversed.

**Step 9:** Return the result list containing the spiral order traversal.





### C++ Implementation

```cpp
class Solution {
public:

    vector<int> spiralOrder(vector<vector<int>>& matrix) {

        vector<int> result;

        if (matrix.empty() || matrix[0].empty()) {
            return result;
        }

        int top = 0;
        int bottom = matrix.size() - 1;

        int left = 0;
        int right = matrix[0].size() - 1;

        while (top <= bottom && left <= right) {

            // Traverse right across top row
            for (int i = left; i <= right; i++) {
                result.push_back(matrix[top][i]);
            }
            top++;

            // Traverse down right column
            for (int i = top; i <= bottom; i++) {
                result.push_back(matrix[i][right]);
            }
            right--;

            // Traverse left across bottom row
            if (top <= bottom) {

                for (int i = right; i >= left; i--) {
                    result.push_back(matrix[bottom][i]);
                }

                bottom--;
            }

            // Traverse up left column
            if (left <= right) {

                for (int i = bottom; i >= top; i--) {
                    result.push_back(matrix[i][left]);
                }

                left++;
            }
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return result;

        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {

            // Traverse right across top row
            for (int i = left; i <= right; i++)
                result.add(matrix[top][i]);
            top++;

            // Traverse down right column
            for (int i = top; i <= bottom; i++)
                result.add(matrix[i][right]);
            right--;

            // Traverse left across bottom row
            if (top <= bottom) {
                for (int i = right; i >= left; i--)
                    result.add(matrix[bottom][i]);
                bottom--;
            }

            // Traverse up left column
            if (left <= right) {
                for (int i = bottom; i >= top; i--)
                    result.add(matrix[i][left]);
                left++;
            }
        }

        return result;
    }
}
```

### Python Implementation

```python
class Solution:

    def spiralOrder(self, matrix):

        result = []

        if not matrix or not matrix[0]:
            return result

        top = 0
        bottom = len(matrix) - 1

        left = 0
        right = len(matrix[0]) - 1

        while top <= bottom and left <= right:

            # Traverse right across top row
            for i in range(left, right + 1):
                result.append(matrix[top][i])

            top += 1

            # Traverse down right column
            for i in range(top, bottom + 1):
                result.append(matrix[i][right])

            right -= 1

            # Traverse left across bottom row
            if top <= bottom:

                for i in range(right, left - 1, -1):
                    result.append(matrix[bottom][i])

                bottom -= 1

            # Traverse up left column
            if left <= right:

                for i in range(bottom, top - 1, -1):
                    result.append(matrix[i][left])

                left += 1

        return result
```

## Time Complexity: O(m x n)

**Explanation: **Every element of the matrix is visited exactly once during the traversal. Since the matrix contains m × n elements, the total time complexity is O(m × n).

## Space Complexity: O(1)

**Explanation: **No extra data structure is used apart from the result list used for storing the traversal. Therefore, the auxiliary space complexity is constant.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/spiral-print-a-matrix-article)*
