# Implement Quick Sort Algorithm on Array

> **Slug:** `implement-quick-sort-algorithm-on-array`  
> **Published:** 2026-07-03T18:08:04.041Z  
> **Updated:** 2026-07-03T18:08:04.050Z  
> **Keywords:** Quick Sort, Implementation, Partitioning and Recursion  
> **Cover Image:** ![Implement Quick Sort Algorithm on Array](6a47fa3718e7ea53cc9ad708)

**Description:** Learn how to implement the Quick Sort algorithm on an array using partitioning and recursion, with examples and  complexity analysis.

---

## Problem Statement

Given an unsorted array of integers, implement the Quick Sort algorithm to sort the array in ascending order.

Quick Sort is a highly efficient sorting algorithm and is based on the partitioning of arrays into smaller sub-arrays. During the sorting process, certain steps are performed, which involve choosing a pivot element from the array and rearranging the elements based on this pivot.

### Example:

#### Input:

arr = [10, 7, 8, 9, 1, 5]

#### Output:

arr = [1, 5, 7, 8, 9, 10]

#### Explanation:

- An initial pivot is chosen (often the last element).
- The list is partitioned, placing smaller elements on one side of the pivot and larger elements on the other.
- The partitioning process continues recursively for the resulting sub-arrays.
- The base case occurs when the array or sub-array contains fewer than two elements.

This problem does not require you to choose any specific pivot selection strategy. Implement the algorithm efficiently in terms of both time and space complexity.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:** n = 5, arr = [5, 3, 8, 6, 2]
> 
> **Output:** [2, 3, 5, 6, 8]
> 
> **Explanation:** Quick sort sorts the array in ascending order.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:**  n = 1, arr = [5]
> 
> **Output:** [5]
> 
> **Explanation:** A single element array is already sorted.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:**  n = 2, arr = [2, 1]
> 
> **Output:** [1, 2]
> 
> **Explanation:** Quick sort will swap the two elements.

## Constraints

- 1 <= nums.length <= 100
- 0 <= nums[i] <= 10

## Real-Life Analogy

**1. The Library Bookshelf**

Imagine you are a librarian and you have a long shelf of books that are completely out of order. Your job is to sort all the books alphabetically by title, but you cannot move every book one by one from one end to the other — that would take forever. Instead, you use a smarter approach.

**2. Pick a Reference Book (The Pivot)**

You randomly pick one book from the shelf — say, a book titled "M" — and declare it your reference book (the pivot). Your goal now is simple:

•       Every book that comes before "M" alphabetically goes to the LEFT side.

•       Every book that comes after "M" alphabetically goes to the RIGHT side.

•       "M" itself sits exactly in its correct sorted position.

After this one pass, even though the left and right groups are still messy internally, you know "M" is perfectly placed.

**3. Divide and Repeat (Recursion)**

Now you repeat the same process for the LEFT pile and the RIGHT pile independently:

•       Pick another reference book from the left pile, partition that pile around it.

•       Pick another reference book from the right pile, partition that pile around it.

•       Keep doing this for every sub-pile until each group has only one book.

**4. The Base Case**

When a pile has only one book (or no books at all), you stop — a single book is already "sorted" by itself. You don't need to do anything.

**5. Final Result**

Once every sub-pile is resolved, the entire shelf is sorted. No book was fully moved across the entire shelf; instead, each book found its correct position through repeated, localized partitioning.

**Conclusion**

Quick Sort works exactly like this librarian: pick a pivot, split the problem into two smaller halves, and recursively solve each half. The real power is that with a good pivot, each step roughly halves the problem, leading to very fast overall sorting.

## Brute-Force Approach

### Intuition

The most straightforward way to sort an array is to repeatedly scan it and pick the smallest element each time, placing it at the front. This is the Selection Sort approach — the brute-force baseline. While simple to understand, it does not leverage any divide-and-conquer strategy and performs a full O(N²) number of comparisons regardless of the input.

***Example:***

arr = [10, 7, 8, 9, 1, 5]

•       Pass 1: Find minimum (1), swap to position 0 → [1, 7, 8, 9, 10, 5]

•       Pass 2: Find minimum in remaining (5), swap to position 1 → [1, 5, 8, 9, 10, 7]

•       Pass 3: Find minimum in remaining (7), swap to position 2 → [1, 5, 7, 9, 10, 8]

•       ... and so on until sorted.

### Algorithm

1. First, we iterate over the array from index 0 to N−1. For each position *i*, we assume that the element at that index is the minimum value.
2. Next, we scan the remaining portion of the array, from index *i + 1* to *N − 1*, to find the actual minimum element. This step ensures that we correctly identify the smallest value among the unsorted elements.
3. If we encounter an element smaller than the one at position *i*, we update our minimum and, after completing the scan, swap the smallest element found with the element at position *i*.
4. We repeat this process for each index until the entire array is sorted. This method gradually builds the sorted portion of the array from left to right.

### Dry Run

//img

### Code

### Complexity Analysis

#### Time Complexity: **O(N²)**

- Let **N** be the number of characters in each word.
- The outer loop runs N-1 times.
- For each position, the inner loop scans the remaining unsorted portion — on average N/2 elements.
- Total comparisons: (N-1) + (N-2) + ... + 1 = N(N-1)/2, which simplifies to O(N²).
- This is slow for large arrays and does not benefit from any existing order in the input.

#### Space Complexity: O(1)

- Sorting is done in-place — no extra arrays are created.
- Only a constant number of temporary variables are used (minIdx, temp).
- Therefore, the space complexity is O(1).

## Optimal Approach

### Intuition

In the Brute-Force approach, we always pick the **last element as the pivot**. This works well on average, but fails badly on already-sorted or reverse-sorted arrays ,causing O(N²) time because every partition is completely unbalanced. So, for the optimal approach, instead of always picking the last element, **randomly select a pivot** and swap it to the last position before partitioning. This way, no specific input can consistently trigger the worst case. On average, the pivot will divide the array reasonably well, keeping the time complexity at **O(N log N)** with very high probability.

### Algorithm

1. we start by handling the base case because there is no need to process a subarray that already has zero or one element, such a portion is inherently sorted, so continuing further would only waste computation.
2. To improve performance and avoid worst-case scenarios (like already sorted arrays), we choose a pivot randomly. This randomness helps in creating more balanced partitions on average, which is the key reason Quick Sort performs efficiently in most cases.
3. Once the pivot is chosen, we partition the array. The purpose of this step is to rearrange elements in such a way that all values less than or equal to the pivot are placed on its left, and all greater values are placed on its right. We maintain a pointer to track the boundary of smaller elements so that as we scan the array, we can correctly position each element relative to the pivot. This step is crucial because it ensures that the pivot will end up in its correct sorted position.
4. After partitioning, we place the pivot in its final position by swapping it into the correct index. At this point, we know for sure that the pivot does not need to be moved again, which effectively reduces the problem size.]
5. Finally, we recursively apply the same process to the left and right subarrays. We do this because, although the pivot is correctly placed, the elements on either side are not yet fully sorted. By repeatedly applying the same logic, we break the problem into smaller parts until the entire array becomes sorted.

### Dry Run

// image

### Code

### file.cpp Implementation

```file.cpp
#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int partition(vector<int>& arr, int low, int high) {
    // Randomly select pivot and move it to the end
    int randomIndex = low + rand() % (high - low + 1);
    swap(arr[randomIndex], arr[high]);

    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    // Place pivot in its correct position
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    // Base case: subarray has 1 or 0 elements
    if (low >= high) return;

    // Partition and get pivot's final index
    int pivotIndex = partition(arr, low, high);

    // Recursively sort left and right subarrays
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
}

int main() {
    srand(time(0));
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size() - 1);

    // Output: 1 5 7 8 9 10
    for (int num : arr) cout << num << " ";
    return 0;
}
```

### file.java Implementation

```file.java
#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int partition(vector<int>& arr, int low, int high) {
    // Randomly select pivot and move it to the end
    int randomIndex = low + rand() % (high - low + 1);
    swap(arr[randomIndex], arr[high]);

    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    // Place pivot in its correct position
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    // Base case: subarray has 1 or 0 elements
    if (low >= high) return;

    // Partition and get pivot's final index
    int pivotIndex = partition(arr, low, high);

    // Recursively sort left and right subarrays
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
}

int main() {
    srand(time(0));
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size() - 1);

    // Output: 1 5 7 8 9 10
    for (int num : arr) cout << num << " ";
    return 0;
}
```

### Complexity Analysis

#### Time Complexity: **O(N log N)**

- Let N be the number of elements in the array.
- **Best Case — O(N log N):** The random pivot divides the array into two nearly equal halves at every step. Each level of recursion does O(N) work across all partition calls, and there are log N levels. The total work is O(N × log N) = O(N log N).
- **Average Case — O(N log N):** With a randomized pivot, even unequal splits like 1/4 and 3/4 still produce O(log N) recursion depth on average. The expected number of comparisons across all random pivot choices is 2N ln N, which simplifies to O(N log N). This is the most common real-world case.
- **Worst Case — O(N²) theoretically, O(N log N) practically:** Without randomization, always picking the smallest or largest element as pivot causes maximally unbalanced splits, leading to N levels of recursion with O(N) work each, giving O(N²). However, with randomized pivot selection, the probability of this occurring is 2^N / N!, which is essentially zero for large N. Therefore, the practical worst case remains O(N log N).
- The **partition()** function iterates through each subarray exactly once, doing O(1) work per element.
- The random pivot selection (**rand.nextInt()** in Java, **rand()** in C++) takes O(1) time and adds no overhead to the overall complexity.
- Therefore, the overall time complexity is O(N log N).

#### Space Complexity: O(log N)

- The algorithm sorts in-place, meaning no auxiliary array is created. Space is consumed only by the recursive call stack.
- **Best / Average Case — O(log N):** With balanced partitions, the maximum recursion depth is log N. Each stack frame stores only a constant number of variables (**low, high, pivotIndex, i, j**), which is O(1) per frame. Total space = O(log N) frames × O(1) per frame = O(log N).
- **Worst Case — O(N):** If every partition is maximally unbalanced, the recursion depth reaches N, making the stack space O(N). With randomized pivot, this is statistically negligible but theoretically possible.
- No additional data structures like hash maps or auxiliary arrays are used anywhere in the algorithm.
- Therefore, the overall space complexity is O(log N) on average and O(N) in the theoretical worst case.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/implement-quick-sort-algorithm-on-array)*
