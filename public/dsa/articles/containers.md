# Containers

> **Slug:** `containers`  
> **Published:** 2026-03-12T02:19:00.000Z  
> **Updated:** 2026-03-27T21:46:22.400Z  
> **Keywords:** None  
> **Cover Image:** ![Containers]({'id': '69b2f5e3307f479fe3679221', 'url': 'https://cdn.codehelp.in/payload/WhatsApp Image 2026-03-12 at 21.45.52 (2).jpeg'})

**Description:** Learn common C++ STL containers like vector, list, deque, stack, queue, priority queue, set, and map with examples and key features.

---

# Common C++ STL Containers

The **Standard Template Library (STL)** in C++ provides several ready-to-use data structures called **containers**. These containers help store and manage collections of data efficiently and come with many built-in functions for common operations.

Below are some of the most commonly used STL containers.



# 1. Vector

### Description

A **vector** is a dynamic array that can automatically resize itself when elements are added or removed. It stores elements in **contiguous memory**, allowing **fast random access using indices**.

Vectors are commonly used when the number of elements may change during program execution.

### Example



# 2. List

### Description

A **list** in C++ is a **doubly linked list**. Unlike vectors, elements are **not stored in contiguous memory**. This allows efficient **insertions and deletions anywhere in the container**, but random access using indices is not supported.

### Example

# 3. Deque

### Description

A **deque (double-ended queue)** allows insertion and deletion of elements from **both the front and the back**. It combines features of both **vectors and queues** and grows dynamically.

### Example

# 4. Stack

### Description

A **stack** is a container adaptor that follows the **Last In First Out (LIFO)** principle. This means the last element inserted is the first one to be removed.

Common operations:

- `push()` → Add element
- `pop()` → Remove top element
- `top()` → Access top element

### Example

# 5. Queue

### Description

A **queue** follows the **First In First Out (FIFO)** principle. The element inserted first will be removed first.

Common operations:

- `push()` → Insert element
- `pop()` → Remove front element
- `front()` → Access front element

### Example



# 6. Priority Queue

### Description

A **priority queue** is a type of queue where elements are processed based on their **priority** rather than the order of insertion.

By default, C++ implements a **max-heap**, meaning the **largest element is always at the top**.

### Example



***Output order will be based on priority (largest first).***

# 7. Set

### Description

A **set** is a container that stores **unique elements only**. The elements are automatically stored in **sorted order**.

Duplicate values are **not allowed**.

### Example

# 8. Map

### Description

A **map** stores elements in **key–value pairs**. Each key is unique, and the container automatically keeps the keys **sorted**.

Maps are useful when you need **fast lookups based on keys**.

### Example

# Summary

**Vector:** Dynamic array with fast random access.

**List:** Doubly linked list with efficient insertions and deletions.

**Deque:** Double-ended queue supporting operations at both ends.

**Stack:** LIFO (Last In First Out) container.

**Queue**: FIFO (First In First Out) container.

**Priority Queue:**** ** Queue where elements are processed based on priority.

**Set:**** **Stores unique elements in sorted order.

**Map****:** Stores key–value pairs with unique keys.

/ima





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/containers)*
