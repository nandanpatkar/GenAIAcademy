# Algorithms

> **Slug:** `algorithms`  
> **Published:** 2026-03-12T18:44:21.871Z  
> **Updated:** 2026-03-27T21:46:22.568Z  
> **Keywords:** None  
> **Cover Image:** ![Algorithms]({'$oid': '69b2f62b307f479fe36792d8'})

**Description:** Learn C++ STL algorithms like find, sort, count, accumulate, binary_search, and heap operations for efficient data processing.

---

# Algorithms in STL

The **Standard Template Library (STL)** in C++ provides a rich collection of **generic algorithms** that operate on different container types such as `vector`, `list`, `set`, `map`, and others. These algorithms are defined primarily in the `<algorithm>` header and are a core component of the STL.

STL algorithms are designed to work with **iterators**, which allow them to operate on various containers in a consistent and efficient manner. They help perform common operations such as searching, sorting, counting, and manipulating data without manually writing complex loops.

## 1. Iterating and Modifying Algorithms

These algorithms are commonly used to **traverse and manipulate elements within a range**.

### std::for_each

Applies a function to each element within a specified range.

### std::find

Searches for a specific value within a range and returns an iterator pointing to the element if found.

### std::find_if

Searches for the **first element that satisfies a given predicate (condition)**.  

### std::count

Counts the number of occurrences of a specific value within a range.

### std::count_if

Counts the number of elements that satisfy a given condition.

### std::sort

Sorts the elements in a range in **ascending order** by default.

### std::reverse

Reverses the order of elements in a given range.

### std::rotate

Rotates the elements in a range so that a specified element becomes the first element.

### std::unique

Removes **consecutive duplicate elements** from a sorted range.

### std::partition

Rearranges elements in a range into two groups based on a predicate. Elements satisfying the condition appear before those that do not.

## 2. Numeric Algorithms

Numeric algorithms are used for **mathematical operations on sequences of numbers**. These are primarily defined in the `<numeric>` header.

### std::accumulate

Calculates the **sum of elements** in a given range.

### std::inner_product

Computes the **inner product of two ranges of elements**.

### std::partial_sum

Computes the **running sum (prefix sum)** of elements in a range.

### std::iota

Fills a range with **sequentially increasing values**.

## 3. Searching Algorithms

These algorithms help **efficiently locate elements within a sorted range**.

### std::binary_search

Checks whether a value exists in a **sorted range**.

### std::lower_bound

Returns an iterator pointing to the **first element that is greater than or equal to the given value**.

### std::upper_bound

Returns an iterator pointing to the **first element greater than the specified value.**

### std::equal_range

Returns a pair of iterators representing the **range of elements equal to a given value**.

## 4. Minimum and Maximum Algorithms

These algorithms help identify **extreme values** in a dataset.

### std::min

Returns the **smaller of two values**.

### std::max

Returns the **larger of two values**.

### std::min_element

Finds the **smallest element** within a range.

### std::max_element

Finds the **largest element** within a range.

## 5. Heap Algorithms

Heap algorithms operate on **heap data structures**, typically implemented using vectors.

### std::make_heap

Transforms a range of elements into a **max heap**.

### std::push_heap

Inserts a new element into the heap while maintaining the heap property.

### std::pop_heap

Removes the **largest element** from the heap.

### std::sort_heap

Sorts the elements in a heap.

## 6. Set Algorithms

Set algorithms operate on **sorted ranges** and perform set-based operations.

### std::set_union

Computes the **union of two sorted ranges**.

### std::set_intersection

Computes the **intersection of two sorted ranges**.

### std::set_difference

Computes the **difference between two sorted ranges**.

### std::set_symmetric_difference

Computes elements that exist in **either of the ranges but not in both**.

## Iterators in STL

In the C++ Standard Template Library, **iterators** play a crucial role in providing a **uniform mechanism to traverse and manipulate container elements**.

An iterator behaves similarly to a **pointer** or a **cursor**, pointing to elements within a container such as `vector`, `list`, `set`, or `map`. Using iterators, algorithms can access and modify container elements without needing to know the underlying structure of the container.

### Key Advantages of Iterators

- Provide a **standard way to traverse containers**
- Enable **compatibility between algorithms and containers**
- Allow **efficient data access and manipulation**
- Support operations such as **incrementing, dereferencing, and comparison**

Iterators are fundamental to STL because they **connect containers and algorithms**, allowing generic algorithms to work seamlessly with different container types.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/algorithms)*
