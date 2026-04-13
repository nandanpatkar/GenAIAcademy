export const ALGO_EXAMPLES = [
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    description: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This process is repeated until the array is sorted.',
    question: 'Implement a function `bubble_sort(arr)` that sorts an array of integers in ascending order in-place using the Bubble Sort algorithm.',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            # Highlight indices being compared
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Initialize data
data = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(data)`
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Searching',
    difficulty: 'Easy',
    description: 'Binary Search is a searching algorithm used in a sorted array by repeatedly dividing the search interval in half. The idea of binary search is to use the information that the array is sorted and reduce the time complexity to O(Log n).',
    question: 'Implement a function `binary_search(arr, target)` that returns the index of the target element in a sorted array, or -1 if the target is not found.',
    code: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Initialize data
data = [11, 12, 22, 25, 34, 64, 90]
target = 25
binary_search(data, target)`
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    description: 'Selection sort is a simple sorting algorithm. This sorting algorithm is an in-place comparison-based algorithm in which the list is divided into two parts, the sorted part at the left end and the unsorted part at the right end. Initially, the sorted part is empty and the unsorted part is the entire list.',
    question: 'Given an array of integers, implement Selection Sort to sort the array in ascending order.',
    code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

data = [29, 10, 14, 37, 13]
selection_sort(data)`
  },
  {
    id: 'linear-search',
    title: 'Linear Search',
    category: 'Searching',
    difficulty: 'Easy',
    description: 'Linear Search is defined as a sequential search algorithm that starts at one end and goes through each element of a list until the desired element is found, otherwise the search continues till the end of the data set.',
    question: 'Implement `linear_search(arr, target)` to find a target value in a given array.',
    code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

data = [10, 50, 30, 70, 80, 60, 20, 90, 40]
target = 20
linear_search(data, target)`
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'Easy',
    description: 'Insertion sort is a simple sorting algorithm that works similar to the way you sort playing cards in your hands. The array is virtually split into a sorted and an unsorted part. Values from the unsorted part are picked and placed at the correct position in the sorted part.',
    question: 'Implement Insertion Sort for an array of integers.',
    code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

data = [12, 11, 13, 5, 6]
insertion_sort(data)`
  },
  {
    id: 'fibonacci-iterative',
    title: 'Fibonacci (Iterative)',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    description: 'The Fibonacci numbers are the numbers in the following integer sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ... Each number is the sum of the two preceding ones.',
    question: 'Calculate the N-th Fibonacci number using an iterative approach to optimize space and time.',
    code: `def fibonacci(n):
    if n <= 1: return n
    fib = [0] * (n + 1)
    fib[1] = 1
    for i in range(2, n + 1):
        fib[i] = fib[i-1] + fib[i-2]
    return fib[n]

fibonacci(8)`
  }
];
