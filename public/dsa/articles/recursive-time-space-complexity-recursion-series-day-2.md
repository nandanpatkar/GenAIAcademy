# Recursive Time & Space Complexity ||  Recursion Series || Day-2

> **Slug:** `recursive-time-space-complexity-recursion-series-day-2`  
> **Published:** 2026-06-18T12:40:48.970Z  
> **Updated:** 2026-06-18T12:40:49.041Z  
> **Keywords:** recursion, recursion time complexity, recursion space complexity, recursive time and space complexity  
> **Cover Image:** ![Recursive Time & Space Complexity ||  Recursion Series || Day-2](69620aaa39b05fb4df627a5b)

**Description:** With this article, we are going to learn about finding time and space complexities of recursive solutions.

---

# **Recursive Time and Space Complexity**

In the previous lecture, we learned how recursion works.

We saw concepts like:

- Base Case
- Recursive Call
- Self Work
- Call Stack
- Backtracking

Now, a very important question arises:

How expensive is recursion?

To answer this question, we study:

1. Time Complexity
2. Space Complexity

# **Why Does Recursion Have Two Complexities?**

Whenever a recursive function runs, two things happen:

### **Work is Performed**

The function may perform some calculations.

Example:

> [!NOTE]
> **INFO**
> return n * factorial(n - 1);

This affects **Time Complexity**.

### **Function Calls are Stored**

Every recursive call creates a new stack frame.

This affects **Space Complexity**.

# **Understanding Time Complexity**

Time Complexity tells us:

How much work is performed as the input size grows?

In recursion, we calculate:

1. Number of recursive calls
2. Work done inside each call

# **Example 1: Print Numbers from N to 1**

## **Dry Run**

For:

> [!NOTE]
> **INFO**
> printNumbers(5);

Calls generated:

> [!NOTE]
> **INFO**
> printNumbers(5)
> printNumbers(4)
> printNumbers(3)
> printNumbers(2)
> printNumbers(1)
> printNumbers(0)

Total Calls:

> [!NOTE]
> **INFO**
> 6

For input size `n`

> [!NOTE]
> **INFO**
> n + 1 calls

## **Work Done in Each Call**

Inside each call we perform:

This takes constant time.

> [!NOTE]
> **SUCCESS**
> O(1)

## **Total Time Complexity**

> [!NOTE]
> **WARNING**
> Number of Calls × Work per Call
> 
> = O(n) × O(1)
> 
> = O(n)

# **Example 2: Factorial**

## **Recursive Calls**

For:

> [!NOTE]
> **INFO**
> factorial(5)

Calls generated:

> [!NOTE]
> **INFO**
> factorial(5)
> factorial(4)
> factorial(3)
> factorial(2)
> factorial(1)
> factorial(0)

Total Calls:

> [!NOTE]
> **INFO**
> 6

In general:

> [!NOTE]
> **INFO**
> n + 1 calls

## **Work Performed**

Inside each function call:

> [!NOTE]
> **INFO**
> n * smallerAnswer

One multiplication operation is performed.

> [!NOTE]
> **INFO**
> O(1)

## **Time Complexity**

> [!NOTE]
> **INFO**
> O(n)

# **Example 3: Power of 2**

## **Number of Calls**

> [!NOTE]
> **INFO**
> n + 1

## **Work Per Call**

> [!NOTE]
> **INFO**
> One multiplication
> 
> O(1)

## **Time Complexity**

> [!NOTE]
> **SUCCESS**
> O(n)

# **Understanding Space Complexity**

Students often make this mistake:

“Factorial only uses one variable, so space complexity should be O(1).”

Wrong.

In recursion, we must count the memory used by the recursion stack.

# **What Creates Space Complexity?**

Every recursive call creates a new stack frame.

Example:

> [!NOTE]
> **INFO**
> factorial(5)

creates:

> [!NOTE]
> **INFO**
> factorial(5)
> factorial(4)
> factorial(3)
> factorial(2)
> factorial(1)
> factorial(0)

Before reaching the base case, all these calls are present in memory.

# **Space Complexity of Factorial**

Maximum Stack Depth:

> [!NOTE]
> **INFO**
> n + 1

Therefore:

> [!NOTE]
> **INFO**
> Space Complexity = O(n)

# **Shortcut for Single Recursive Calls**

Whenever you see:

> [!NOTE]
> **INFO**
> solve(n - 1);

or

> [!NOTE]
> **INFO**
> solve(n / 2);

First count:

### **How many calls are generated?**

Then count:

### **Maximum stack depth?**

# **Quick Examples**

## **Factorial**

> [!NOTE]
> **INFO**
> factorial(n - 1)

Time:

> [!NOTE]
> **SUCCESS**
> O(n)

Space:

> [!NOTE]
> **SUCCESS**
> O(n)

## **Power of Two**

> [!NOTE]
> **INFO**
> power(n - 1)

Time:

> [!NOTE]
> **SUCCESS**
> O(n)

Space:

> [!NOTE]
> **SUCCESS**
> O(n)

## **Binary Search (Recursive)**

> [!NOTE]
> **INFO**
> search(n / 2)

Time:

> [!NOTE]
> **SUCCESS**
> O(log n)

Space:

> [!NOTE]
> **SUCCESS**
> O(log n)

Because stack depth becomes:

> [!NOTE]
> **INFO**
> log n

# **Golden Rule**

For beginner recursion problems:

### **Time Complexity**

> [!NOTE]
> **INFO**
> (Number of Recursive Calls)
> ×
> (Work Done in Each Call)

### **Space Complexity**

> [!NOTE]
> **INFO**
> Maximum Depth of Recursion Stack

If you can answer these two questions, you can calculate the complexity of most basic recursive programs.

# **Summary**

When solving any recursion problem, always ask:

1. How many recursive calls are being made?
2. How much work is done inside one call?
3. What is the maximum recursion depth?

From these answers:

- Time Complexity can be calculated.
- Space Complexity can be calculated.

This is the foundation required before studying advanced recursion trees and recurrence relations.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/recursive-time-space-complexity-recursion-series-day-2)*
