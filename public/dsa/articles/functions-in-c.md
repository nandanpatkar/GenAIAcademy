# Functions in C++

> **Slug:** `functions-in-c`  
> **Published:** 2026-03-09T17:03:33.755Z  
> **Updated:** 2026-03-27T21:46:21.875Z  
> **Keywords:** None  
> **Cover Image:** ![Functions in C++]({'$oid': '69aef6c9307f479fe3663f25'})

**Description:** Learn C++ functions, parameters vs arguments, function declaration, and the difference between call by value and call by reference with examples.

---

## Function

In **C++**, a **function** is a block of code that performs a specific task. Functions help organize programs into smaller, reusable parts, making code easier to read, maintain, and debug. Once a function is defined, it can be called multiple times from different parts of the program.

## Basic Structure of a Function

A function in C++ generally consists of two parts: **declaration** and **definition**.

- **returnType** – The data type of the value returned by the function.
- **functionName** – The name used to call the function.
- **parameters** – Variables that receive input values when the function is called.

## Example of a Function

**Explanation:**

1. The function `add()` takes two integers as input.
2. It returns their sum.
3. In `main()`, the function is called with arguments `5` and `3`.
4. The returned value is stored in `sum` and printed.

## Parameters vs Arguments

Understanding the difference between **parameters** and **arguments** is important when working with functions.

### Parameters

Parameters are variables declared in the **function definition**. They act as placeholders that receive values when the function is called.

### Arguments

Arguments are the **actual values** passed to the function during the function call.

### Example

Here:

- `x` and `y` are **parameters**
- `4` and `5` are **arguments**

## Call by Value vs Call by Reference

C++ functions can receive arguments in two main ways: **Call by Value** and **Call by Reference**.

### Call by Value

In **Call by Value**, a copy of the argument's value is passed to the function. Any changes made inside the function do **not affect the original variable**.

#### Example

**Explanation:**

- `num` is passed as a copy to `modifyValue()`.
- Modifying `a` inside the function does not change `num`.

### Call by Reference

In **Call by Reference**, the function receives a **reference to the original variable** instead of a copy. This means any changes made inside the function **directly affect the original variable**.

#### Example



**Explanation:**

- The `&` symbol creates a reference parameter.
- The function works directly with the original variable `num`.
- Therefore, the value of `num` becomes `100`.

## Summary

- Functions help divide programs into smaller and reusable blocks.
- **Parameters** are variables defined in the function.
- **Arguments** are the actual values passed during the function call.
- **Call by Value** passes a copy of the variable.
- **Call by Reference** passes the original variable using references.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/functions-in-c)*
