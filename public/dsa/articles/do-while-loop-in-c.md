# Do-While Loop in C++

> **Slug:** `do-while-loop-in-c`  
> **Published:** 2026-03-09T17:01:27.246Z  
> **Updated:** 2026-03-27T21:46:21.535Z  
> **Keywords:** None  
> **Cover Image:** ![Do-While Loop in C++]({'$oid': '69aef461307f479fe3663c1e'})

**Description:** Learn the C++ do-while loop, syntax, examples, nested loops, and common mistakes like infinite loops and off-by-one errors.

---

# Do-While Loop in C++

The **do-while loop** is a type of loop that executes a block of code **at least once**, and then continues repeating the execution **as long as the specified condition remains true**.

Unlike `for` and `while` loops, the condition in a **do-while loop is checked after the code block executes**. This guarantees that the loop runs **at least one time**, even if the condition is initially false.

## Syntax

## Key Components

A `do-while` loop consists of the following parts:

- **do keyword** – Indicates the beginning of the loop block.
- **Code block** – The statements that will be executed.
- **while condition** – The condition that determines whether the loop should continue running.

The loop will keep executing **until the condition becomes false**.

## Example

## Explanation

- The variable `i` starts with the value **0**.
- The loop prints the value of `i` and then increments it.
- The condition `i < 5` is checked **after the loop executes**.
- As a result, the program prints numbers **0 to 4**.



# Nested Loops

**Nested loops** occur when one loop is placed **inside another loop**. They are useful when working with **multi-dimensional data or repetitive patterns**.

The inner loop executes **completely for each iteration of the outer loop**.

## Example

## Explanation

- The **outer loop** runs **three times** (`i = 0 to 2`).
- For every iteration of the outer loop, the **inner loop** runs **two times** (`j = 0 to 1`).
- This results in a total of **3 × 2 = 6 iterations**.

**Nested loops are commonly used in tasks such as:**

- Working with **matrices**
- Generating **patterns**
- Processing **multi-dimensional arrays**

## Common Mistakes When Using Loops

### Infinite Loops

If the loop condition never becomes false, the loop will run **indefinitely**. Always ensure that the loop variable is updated correctly.

### Off-by-One Errors

Beginners often make mistakes with loop boundaries, causing the loop to run **one extra or one fewer time** than expected.

### Misplaced Semicolons

Placing a semicolon immediately after a loop condition can unintentionally terminate the loop.

**Example of incorrect usage:**`while(i < 5); `

This creates an empty loop and can cause logical errors.

## Summary

- The **do-while loop** ensures that a block of code runs **at least once**, making it useful when an initial execution is required regardless of the condition.
- **Nested loops**, on the other hand, allow multiple levels of repetition and are widely used for complex iteration tasks such as working with tables, grids, and matrices.
- Understanding these loop structures is essential for solving many **algorithmic and real-world programming problems**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/do-while-loop-in-c)*
