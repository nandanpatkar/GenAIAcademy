# Iterators

> **Slug:** `iterators`  
> **Published:** 2026-03-12T18:44:22.397Z  
> **Updated:** 2026-03-27T21:46:22.768Z  
> **Keywords:** None  
> **Cover Image:** ![Iterators]({'$oid': '69b2f422307f479fe3678f2e'})

**Description:** Learn C++ iterators, their types, and how they traverse STL containers like vector, list, and set for efficient element access.

---

## What is an Iterator?

In C++, an **iterator** is an object used to **point to elements inside a container** and helps in accessing and traversing those elements.

Iterators are an important component of the **Standard Template Library (STL)** because they provide a **common interface to iterate through different types of containers** such as vectors, lists, and sets.

They work similarly to **pointers**, allowing you to move through elements and access their values.

# Types of Iterators

C++ provides different categories of iterators depending on the operations they support.

### 1. Input Iterator

- Provides **read-only access** to elements.
- Used to read data sequentially from a container.

### 2. Output Iterator

- Provides **write-only access** to elements.
- Used to write or modify values in a container.

### 3. Forward Iterator

- Combines the features of **input and output iterators**.
- Can move **only in the forward direction**.

### 4. Bidirectional Iterator

- Allows movement in **both forward and backward directions**.
- Supported by containers such as **list, set, and map**.

### 5. Random Access Iterator

- Provides the **highest level of functionality**.
- Allows direct access to any element in **constant time**.
- Supports operations such as **addition, subtraction, and indexing**.
- Used by containers like **vector and deque**.

# Examples of Iterators

## Vector Iterator

Vectors support **random access iterators**, which allow efficient traversal and element access.

### Explanation

- `vec.begin()` returns an iterator pointing to the **first element**.
- `vec.end()` points **one position past the last element**.
- `*it` dereferences the iterator to access the element.

# List Iterator

A **list** uses **bidirectional iterators**, allowing traversal in both directions.

### Explanation

- The iterator moves sequentially through the linked list.
- Unlike vectors, lists do **not support random access** using indices.

# Set Iterator

A **set** stores **unique elements in sorted order** and supports **bidirectional iterators**.

### Explanation

- Elements in a set are automatically stored in **ascending order**.
- Iterators allow traversal of the set in sorted order.

# Practical Insights

### Iterators Work with Multiple STL Components

Iterators are not limited to containers like vectors or lists. They can also be used with:

- **Strings**
- **Arrays**
- **Algorithms in the STL**

### Random Access Iterators Provide More Flexibility

Random access iterators behave similarly to pointers and allow operations such as:

- `it + n`
- `it - n`
- `it[n]`

This makes them very powerful when working with containers like **vectors**.

### Using `auto` for Cleaner Code

In modern C++ (C++11 and later), the **`auto`**** keyword** can simplify iterator declarations and improve code readability.

**Example:**

This automatically determines the correct iterator type.

# Summary

- Iterators allow traversal of elements in STL containers.
- They act similarly to **pointers**.
- Different containers support different iterator types.
- Using iterators makes code **generic, reusable, and compatible with STL algorithms**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/iterators)*
