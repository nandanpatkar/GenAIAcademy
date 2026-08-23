# Recursion Series || Day - 1

> **Slug:** `recursion-series-day-1`  
> **Published:** 2026-06-16T11:08:16.001Z  
> **Updated:** 2026-06-16T11:08:16.008Z  
> **Keywords:** recursion, recursion series  
> **Cover Image:** ![Recursion Series || Day - 1](69620aaa39b05fb4df627a5b)

**Description:** With this lecture, we are marking the start of Codehelp's Recursion Series, where we will master all the easy/medium/hard concepts or problems related to recursion.

---

# **Introduction to Recursion**

Recursion is a programming technique where a function calls itself to solve a problem.

Instead of solving a large problem directly, recursion breaks it into smaller and similar problems. The function keeps working on smaller versions of the same problem until it reaches a stopping condition known as the **base case**.

# **Components of Recursion**

Every recursive solution usually contains three important parts.

## **1. Base Case**

The base case is the condition that stops the recursion.

Without a base case, the function will keep calling itself forever, eventually causing a program crash due to a **Stack Overflow**.

### **Example**

## **2. Recursive Call**

The recursive call is where the function calls itself with a smaller version of the original problem.

The goal is to reduce the problem size at each step until the base case is reached.

### **Example**

## **3. Processing Work**

Processing work refers to the processing performed by the current function call.

It can happen either before or after the recursive call depending on the problem.

### **Example**

# **Memory Usage in Recursion**

Recursion uses a special memory structure called the **Call Stack**. Whenever a function calls itself, information about that call is stored in the call stack.

As recursion goes deeper, more stack memory is used. If too many recursive calls are made, the call stack may run out of memory and result in a **Stack Overflow Error**.

# **Problem 1: Factorial of a Number**

## **Problem Statement**

Find the factorial of a number `n`.

The factorial of a number is the product of all positive integers from `n` down to `1`.

### **Example**

> [!NOTE]
> **INFO**
> 5! = 5 × 4 × 3 × 2 × 1 = 120

## **Recursive Thinking**

We can express the problem as:

> [!NOTE]
> **INFO**
> 5! = 5 × 4!

Similarly,

> [!NOTE]
> **INFO**
> 4! = 4 × 3!
> 3! = 3 × 2!
> 2! = 2 × 1!

The problem keeps getting smaller until we reach:

> [!NOTE]
> **INFO**
> 1! = 1

This becomes our base case.

## **Pseudocode**

## **Complexity Analysis**

### **Time Complexity**

> [!NOTE]
> **INFO**
> O(n)

### **Space Complexity**

> [!NOTE]
> **INFO**
> O(n)

The space complexity is `O(n)` because each recursive call occupies space in the call stack.

# **Problem 2: Fibonacci Number**

## **Problem Statement**

Find the nth Fibonacci number.

The Fibonacci sequence is:

> [!NOTE]
> **INFO**
> 0, 1, 1, 2, 3, 5, 8, 13...

The recurrence relation is:

## **Recursive Thinking**

To calculate:

> [!NOTE]
> **INFO**
> fibo(4)

we need:

> [!NOTE]
> **INFO**
> fibo(4) = fibo(3) + fibo(2)

Further,

> [!NOTE]
> **INFO**
> fibo(3) = fibo(2) + fibo(1)
> fibo(2) = fibo(1) + fibo(0)

Notice that one problem generates two smaller problems.

## **Pseudocode**

## **Complexity Analysis**

### **Time Complexity**

> [!NOTE]
> **INFO**
> O(2^n)

### **Space Complexity**

> [!NOTE]
> **INFO**
> O(n)

## **Important Observation**

In the factorial problem, one recursive call is generated.

In the Fibonacci problem, two recursive calls are generated.

In general, a recursive problem may depend on one, two, or multiple smaller problems.

# **Problem 3: Check if an Array is Sorted**

## **Problem Statement**

Determine whether an array is sorted in non-decreasing order.

### **Examples**

> [!NOTE]
> **INFO**
> Input:  [2, 4, 8, 9, 9, 15]
> Output: true

> [!NOTE]
> **INFO**
> Input:  [5, 8, 2, 9, 3]
> Output: false

## **Recursive Thinking**

Instead of checking the whole array at once:

1. Check whether the remaining array is sorted.
2. Compare the current element with the next element.
3. Combine both results.

## **Base Case**

If we reach the last element of the array, it is considered sorted.

## **Pseudocode**

## **Complexity Analysis**

### **Time Complexity**

> [!NOTE]
> **INFO**
> O(n)

### **Space Complexity**

> [!NOTE]
> **INFO**
> O(n)

# **Summary**

Recursion is a powerful technique that allows a function to solve a problem by calling itself.

To solve any recursion problem, focus on three questions:

1. What is the base case?
2. What is the smaller problem?
3. What processing work needs to be done?

If these three parts are clear, writing recursive solutions becomes much easier.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/recursion-series-day-1)*
