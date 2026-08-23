# Functors

> **Slug:** `functors`  
> **Published:** 2026-03-12T18:44:16.125Z  
> **Updated:** 2026-03-27T21:46:22.949Z  
> **Keywords:** None  
> **Cover Image:** ![Functors]({'$oid': '69b302b5307f479fe367a2c8'})

**Description:** Learn C++ functors (function objects), operator() overloading, built-in STL functors, and how they customize algorithms like sort and find.

---

## What are Functors?

In C++, a **functor** (also called a **function object**) is an object that can be used like a function. It is created from a class or structure that **overloads the function call operator ****`()`**.

Because of this operator overloading, objects of that class can be called just like normal functions.

### Basic Idea

objectName(arguments);

Behind the scenes, this calls the overloaded **`operator()`** defined in the class.

Functors are commonly used in the **Standard Template Library (STL)** with algorithms such as `sort`, `find_if`, and `for_each`.

# Key Benefits of Functors

### 1. State Maintenance

Unlike normal functions, functors can **store data inside the object**. This allows them to maintain state between function calls.

### 2. Function-like Behavior

Functors behave like functions and can be **passed to algorithms, returned from functions, or stored in variables**.

### 3. Customizable Behavior

They allow programmers to **customize the behavior of STL algorithms** by defining their own operations.

# Common STL Functors in C++

C++ provides several **built-in functors** in the `<functional>` header. These are commonly used for arithmetic and comparison operations.

## 1. `std::plus`

Adds two numbers.



## 2. `std::minus`

Subtracts one number from another.

## 3. `std::multiplies`

Multiplies two numbers.

## 4. `std::divides`

Divides one number by another.

## 5. `std::modulus`

Returns the remainder of division.

## 6. `std::negate`

Returns the negative value of a number.

# Practical Use of Functors

Functors are widely used with **STL algorithms**, especially when you want to customize how an algorithm behaves.

For example, the `std::sort` function normally sorts elements in **ascending order**. By providing a custom functor, we can change the sorting behavior.

# Example: Custom Functor for Sorting

### Explanation

1. A custom functor **`SortDescending`** is created.
2. The **`operator()`** defines the comparison rule.
3. `std::sort()` uses this functor to sort the vector in **descending order**.

Output: **9 7 5 4 2**

# Summary

- A **functor** is an object that behaves like a function.
- It is implemented by **overloading the ****`operator()`**.
- Functors can store state and provide customized behavior.
- The **STL ****`<functional>`**** library** provides many built-in functors.
- They are commonly used with **STL algorithms such as ****`sort`****, ****`find_if`****, and ****`for_each`**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/functors)*
