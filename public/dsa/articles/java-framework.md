# Java Framework Module 1

> **Slug:** `java-framework`  
> **Published:** 2026-04-25T11:07:14.396Z  
> **Updated:** 2026-04-25T11:07:14.403Z  
> **Keywords:** Java Framework Module 1  
> **Cover Image:** ![Java Framework Module 1](https://cdn.codehelp.in/media/articles/1776871088267-b84766e8-Frame.jpg)

**Description:** Learn Java Collection Framework with interfaces, List, ArrayList, LinkedList, methods, and real-world usage for efficient data handling and coding interviews.

---

## **Java Collection Framework**

The Java collections framework provides a set of interfaces and classes to implement various data structures and algorithms. 

**Example****:** The linkedlist class of the collections framework provdes the implementation of the doubly-linked list data.



- The java collections framework provides various interfaces.
- These interfaces include several methods to perform different operations on collections.

## Methods of Collection

The Collection interface includes various methods that can be used to perform different operations on objects. These methods are available in all its sub-interfaces.



- **add() - inserts the specified element to the collection**
- **size() - returns the size of the collection**
- **remove() - removes the specified element from the collection**
- **iterator() - returns on iterator to access elements of the collection**
- **addAll() - adds all the elements of a specified collection to the collection**
- **removeAll() - removes all the elements of the specified collection from the collection**
- **clear() - removes all the elements of the collection.**

## Java List Interface

In Java, the List interface is an ordered collection that allows us to store and access element sequentially.

### How to use it ?





### Methods

- **add() - adds an element to a list.**
- **addAll() - adds all elements of one list to another**
- **get() - helps to randomly access elements from lists**
- **iterator() - returns iterator object that can be used to sequentially access elements of lists.**
- **set() - changes elements of lists**
- **remove() - removes an element from the list**
- **removeAll() - removes all the elements from the list.**
- **clear() - removes all the elements from the list (more efficient thatn removeAll())**
- **size() - returns the length of lists**
- **toArray() - converts a list into an array**
- **contains() - returns true is a list contains specific element.**

### Code

## Java ArrayList

In Java, we use the ArrayList class to implement the functionality of resizable-arrays. It implements the List interface of the collections framework.

### Creation

### Code



### Java LinkedList

The LinkedList class of the Java collections framework provides the functionality of the linkedlist data structure (doubly linkedlist).

**Each element in a **linked list** is known as a node.**
**It consists of 3 fields:**



1. **Prev - **Stores an address of the previous element in the list. It is null for the first element.
2. **Next -** Stores an address of the next element in the list. It is null for the last element.
3. **Data -** stores the actual data.

### Creation of LinkedList

### Implementation



### Code

**Note:**

- **Both ****`ArrayList`**** and ****`LinkedList`**** support ****`clone()`**** in Java, they don’t differ in that.**
- **The confusion comes because ****`clone()`**** creates only a shallow copy, so in a ****`LinkedList`**** (often used with objects), changes appear in both lists.**
- **So it’s not that ****`LinkedList`**** doesn’t support cloning, it’s just misunderstood due to shallow copying **behaviour**.**

### Methods

- **contains() - check if the LinkedList contains the element.**
- **indexOf() - returns the index of the first occurrence of the element.**
- **lastIndexOf() - returns the index of the last occurrence of the element.**
- **clear() - removes all the elements of the LinkedList.**
- **iterator() - returns an iterator to iterative over LinkedList.**

### Linked List as Queue & Deque

Since the **LinkedList** class also implements the **Queue** and the **Deque** interface, it can implement **methods** of these interfaces as well.

**Here are some of the commonly used methods: **

### Methods

- **addFirst() - add the specified element at the beginning of the linked list.**
- **addLast() - add the  specified element at the end of the linked list.**
- **getFirst() - returns the first element.**
- **getLast() - returns the last element.**
- **removeFirst() - removes the first element.**
- **removeLast() - removes the last element.**
- **peek() - returns the first element (head) of the linked list.**
- **poll() - returns and removes the first element from the linked list.**
- **offer() - adds the specified element at the end of the linked list.**

### **Code**

## Java Vector

The Vector** class is an implementation of the List interface** that allows **us to create resizable-arrays **similar to the ArrayList class.

### ﻿﻿Vector vs ArrayList

- ﻿﻿In Java, both **ArrayList** and **Vector** **implements** the **List interface** and provides the **same** **functionalities**. However, there exist some differences between them.
- ﻿﻿The **Vector class synchronizes** each **individual** **operation**. This means whenever we want to perform some operation on vectors, the Vector **class automatically applies a lock to that operation**.
- ﻿﻿It is **because when one thread is accessing a vector**, and at the same time **another** **thread** **tries to access it**, an exception **called** **ConcurrentModificationException** is generated. Hence, this continuous use of lock for each operation makes vectors less efficient.
- ﻿﻿However, in array lists, methods are not synchronized. Instead, it uses the **Collections.synchronizedList()** method that synchronizes the list as a whole.
- **﻿﻿It is recommended to use ArrayList in place of Vector because vectors less efficient.**

### Creation of Vector

### Methods

- **Adding Elements:** add(element), add(index, element), addAll(vector).
- **Access Elements: **get(index), iterator().
- **Removing Elements: **remove(index), removeAll(), clear()**.**
- **set(): changes **an element of the** vector.**
- **size(): returns **the size of the** vector.**
- **toArray(): converts **the** vector **into an** array.**
- **toString(): converts** the **vector **into a** String.**
- **contains(): searches the vector** for specified element and r**eturns a boolean **result**.**

### Code

## Java Stack

The Java collections framework has a** class named Stack** that provides the **functionality of the stack** data structure. The **Stack class extends the Vector class.**

### **Creation**



### Code







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/java-framework)*
