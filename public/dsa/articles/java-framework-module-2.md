# Java Framework Module 2

> **Slug:** `java-framework-module-2`  
> **Published:** 2026-04-25T11:09:46.008Z  
> **Updated:** 2026-04-25T11:09:46.016Z  
> **Keywords:** Java Framework Module 2  
> **Cover Image:** ![Java Framework Module 2](https://cdn.codehelp.in/media/articles/1777098806233-9dd7b79b-PHOTO-2026-04-25-12-02-39.jpg)

**Description:** Learn Java Queue and Set interfaces with ArrayDeque, PriorityQueue, HashSet, LinkedHashSet, TreeSet, methods, differences, and time complexity.

---

## Java Queue Interface

The Queue interface of the Java collections framework provides the functionality of the queue data structure. It extends the collection interface.





### Implementation



### Methods

- **add() - Inserts **the specified **element into the queue. **If the task is successful, **add() return true**, if not it **throws an exception.**
- **offer() - Inserts the specified element into the queue. **If the task is successful, offer()** returns true, **if not it returns** false.**
- **element() - Returns the head of the queue. **Throws an exception if the **queue is empty.**
- **peek() - Returns the head of the queue. Returns **null if the queue is** empty.**
- **remove() - Returns and removes the head of the queue. **Throws an **exception** if the queue is** empty.**
- **poll() - Returns and removes the head of the queue. Returns null **if the queue is** empty.**



### Difference between add and offer?

- **Use add()** when **you want an error i**f insertion fails.
- **Use offer()** when you want to **handle failure safely **without exceptions.

### For Queue

- **Insertion: Offer()**
- **removal: poll()**
- **accessing first element: peek()**

### Code

## Stack/Queue Operations using ArrayDeque



- **Stack Operations:**** push(), pop()**
- **Queue Operations:**** add(), remove() **

### **Code**

## Priority Queue

- **In a normal queue → First In, First Out (FIFO).**
- **In a Priority Queue → Highest priority element comes out first. **

### Code

## Using ArrayDeque Class

- **Addition: addFirst(), addLast()**
- **Removal: removeFirst(), removeLast()**
- **Accessing: getFirst(), getLast()**

## Java Set Interface

The set interface of teh Java Collections framework provides the features of the mathematical set in Java. It extends the Collection interface. Unlike the List interface, sets cannot contain duplicate elements.



### Code



A **HashSet** is a collection in Java that stores only unique elements and does not maintain any specific order.



When we say the “sequence can be anything,” it means that the elements are not stored in the order you insert them, nor are they sorted. The position of elements depends on how hashing works internally, so the output may appear random and can even change over time.

### Methods

- **add() -** adds the specified element to the set.
- **addAll() - **adds all the elements of the specified collection to the set.
- **iterator() -** returns an iterator that can be used to access elements of the set sequentially.
- **remove() -** removes the specified element from the set.
- **removeAll() - **removes all the elements from the set that is present in another specified set.
- **retainAll() -** retains all the elements in the set that are also present in another specified set.
- **clear() -** removes all the elements from the set.
- **size() -** returns the length (number of elements) of the set.
- **toArray() -** returns an array containing all the elements of the set.
- **contains() - **returns true if the set contains the specified element.
- **containsAll() -** returns true if the set contains all the elements of the specified collection.
- **hashCode() -** returns a hash code value (address of the element in the set)

## Java Hash set

The **HashSet class** of the Java Collections framework provides the **functionalities of the hash table data** **structure**. It implements the Set interface.






### Code

## Why HashSet?

1. In Java, **HashSet is commonly used if we have to access elements randomly.** It is because elements in a **hash table are accessed using hash codes**.
2. The** hashcode of an element is a unique identity** that helps to identify the element in a hash table.
3. HashSet cannot contain **duplicate elements**. Hence, each **hash set elements a unique** hashcode.

***Note: It has a time complexity of O(1).***

## LinkedHashSet

A **LinkedHashSet** is a collection in Java that **stores** **unique elements** (no duplicates) and also **maintains** the **order** in which **elements were inserted**.

### Code



***Note: It has a time complexity of O(n).***

## TreeSet

A **TreeSet is a collection **in** Java** that **stores** **unique** **elements** and automatically sorts them.

Code

***Note: It has a time complexity of O(logn), based on BST.***

### Methods

- **Insertion:** add(), addAll()
- **Access: **iterator()
- **Removal: **remove(), removeAll()
- **Union: **addAll(), **Insertion** - retailAll(), **Difference** - removeAll()
- **Subset:** containsAll()
- **clone(): **creates a copy of the HashSet.
- c**ontains():** Searches the HashSet for the specified element and returns a Boolean result.
- **isEmpty():** Checks if the HashSet is empty.
- **size() :** returns the size of the HashSet.
- **clear() : **Removes all the elements from the HashSet.

### How HashSet removes duplicate objects using equals() and hashCode()

### Code







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/java-framework-module-2)*
