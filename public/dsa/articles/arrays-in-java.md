# Arrays in Java

> **Slug:** `arrays-in-java`  
> **Published:** 2026-04-16T20:01:08.701Z  
> **Updated:** 2026-04-16T20:01:08.708Z  
> **Keywords:** array, 1d array, 2d array, array problems, array java, arrays java, java dsa course, codehelp  
> **Cover Image:** ![Arrays in Java](https://cdn.codehelp.in/media/codehelp-1.jpg)

**Description:** In this Article, we are going to cover the cover the basics of 1D and 2D array and then move to some problems to get a heck of it

---

# **Complete Guide: 1D + 2D Arrays + Problems**

Till now, you have learned:

- variables → store single value
- loops → repeat logic
- conditionals → make decisions

Now comes a very important concept:

> [!NOTE]
> **INFO**
> Arrays — storing and processing multiple values efficiently

# **What is an Array?**

An **array** is a collection of elements of the same data type stored in **continuous memory locations**.

## **Example**

> [!NOTE]
> **WARNING**: int[] scores = {85, 90, 78, 92, 88};

## **Memory Representation**

> [!NOTE]
> **WARNING**
> Index:   0   1   2   3   4
> 
> 
> Value:  85  90  78  92  88

# **Why Arrays Matter**

Arrays are used in:

- DSA problems
- searching & sorting
- storing test cases
- analytics (like CodeHelp ONE progress tracking)
- matrices & grids

# **1D Array Basics**

## **Declaration**

> [!NOTE]
> **WARNING**: int[] arr;

## **Initialization**

> [!NOTE]
> **WARNING**: int[] arr = new int[5];

OR

> [!NOTE]
> **WARNING**: int[] arr = {1, 2, 3, 4, 5};

## **Traversal**

# **1D Array Problems**

(Already covered earlier — keeping concise here)

## **Problem 1: Sum of Elements**

## **Problem 2: Maximum Element**

## **Problem 3: Minimum Element**

Same logic as max (reverse comparison)

## **Problem 4: Reverse Array (Two Pointer)**

## **Problem 5: Linear Search**

# **What is a 2D Array?**

A **2D array** is an array of arrays.

Think of it like a table or matrix:

> [!NOTE]
> **INFO**: 1  2  3
4  5  6
7  8  9

## **Declaration**

> [!NOTE]
> **WARNING**: int[][] matrix;

## **Initialization**

> [!NOTE]
> **WARNING**
> int[][] matrix = new int[3][3];

OR

> [!NOTE]
> **WARNING**: int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

# **Accessing Elements**

> [!NOTE]
> **INFO**: System.out.println(matrix[1][2]); // 6

->  matrix[][ ]

# **Traversing 2D Array**

## **Using Nested Loops**

## **Explanation**

- outer loop → rows
- inner loop → columns

# **2D Array Problems**

Now we solve **5 important problems**.

# **Problem 1: Print Matrix**

## **Code**

## **Output**

> [!NOTE]
> **SUCCESS**: 1 2 3
4 5 6

# **Problem 2: Row-wise Sum**

## Find sum of each row.

## **Code**

## **Explanation**

Each row is treated like a 1D array.

# **Problem 3: Column-wise Sum**

## **Code**

## **Key Insight**

- outer loop → column
- inner loop → row

# **Problem 4: Find Maximum Element**

## **Code**

# **Problem 5: Transpose of Matrix**

Convert rows into columns

## **Example**

> [!NOTE]
> **INFO**: Original:
1 2 3
4 5 6

Transpose:
1 4
2 5
3 6

## **Code**

## **Key Insight**

->  Swap row and column indices:

> [!NOTE]
> **INFO**: matrix[i][j] → matrix[j][i]

# **Assignment Problems (2D Arrays)**

## **1. Print Diagonal Elements**

> [!NOTE]
> **WARNING**: 1 2 3
4 5 6
7 8 9

Output: 1 5 9

## **2. Sum of Diagonal**

## **3. Search Element in Matrix**

## **4. Check Matrix is Symmetric**

## **5. Spiral Matrix (Advanced)**

# **Common Mistakes in Arrays**

## **❌ Wrong index usage**

> [!NOTE]
> **ERROR**: arrarr.length   // ERROR

## **❌ Using  <= instead of <**

## **❌ Forgetting nested loops in 2D**

## **❌ Confusing rows & columns**

# **1D vs 2D Arrays**



**Feature**

**1D Array**

**2D Array**

Structure

Line

Table

Access

arr[]

arr[][]

Loop

single loop

nested loop

# **Interview Importance**

Arrays are the **starting point of DSA**.

Concepts built here lead to:

- sorting
- searching
- sliding window
- prefix sum
- matrix problems
- graph traversal (later)

# **Final Takeaway**

Arrays teach you:

- how to store data
- how to process data
- how to iterate efficiently

If loops taught you repetition, arrays teach you **structured problem solving**.

And when you combine:

- loops + arrays
- you unlock real programming logic



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/arrays-in-java)*
