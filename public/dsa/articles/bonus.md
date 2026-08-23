# Collection Framework Bonus Module

> **Slug:** `bonus`  
> **Published:** 2026-04-27T05:43:14.943Z  
> **Updated:** 2026-04-27T05:43:14.949Z  
> **Keywords:** Collection Framework Bonus Module  
> **Cover Image:** ![Collection Framework Bonus Module](https://cdn.codehelp.in/media/articles/1777111469659-b827bf73-PHOTO-2026-04-25-13-08-17.jpg)

**Description:** Learn Java Map interface with key-value pairs, HashMap, TreeMap, LinkedHashMap, methods, Comparable vs Comparator, lambda expressions, and sorting.

---

## What is Map Interface ?

In Java, **elements of Map are stored in key/value pairs**. **Keys** are **unique** values **associated** with **individual Values**. A **map** cannot contain **duplicate** keys.  And, **each key** is associated with a **single value**.







## Map Characteristics

Here are some key characteristics of the Map interface:



- **No Duplicate Keys -** **Each Key can map** to at most **one value**. However, different keys can map to the same value.
- **Key-Value Association -** It maintains an** association of keys to values**.
- **Implementations -** Some of the well-known **classes that implement the Map interface** are **HashMap, TreeMap, LinkedHashMap,** and **Hashtable**.
- **Order - **The Map interface itself doesn't **guarantee any specific order of its elements**. However, some specific implementations like **TreeMap maintain a sorted order**, and LinkedHashMap maintains the insertion order.
- **Null Values -** **Maps allow null values** and **depending on the implantation**, null kets. For example, **HashMap allows one null key** and **multiple null values**, but Hashtable does not allow null keys or values.

### Map Methods

- **put(K, V) - **Inserts the association of a **key K** and a** value V **into the **map**. If the **key** is already **present**, the** new value replaces the old value**.
- **putAll() -** **Inserts all the entries** from the **specified map to this map.**
- **putifAbsent(K, V) -** Inserts the association if the key K is not already associated with the value V.
- **get(K) -** **Returns the value** associated with the **specified key K**. If the key is not found, **it returns null**.
- **getOrDefault(K, defaultValue) -** **Returns the value** associated with the **specified key K.** If the **key is not found**, it returns the defaultValue.
- **containsKey(K) -** **Checks if the specified key K **is **present in the map or not**.
- **containsValue(V) - Checks if the specified value** **V** is **present** in the map or not.
- **replace(K, V) -** **Replace the value of the key K** with the new specified value V.
- **replace(K, oldValue, newValue) -** Replaces the v**alues of the key K **with the new values newValue only if the **key K **is** associated with the value oldValue**.
- **remove(K) - Removes the entry from** the map that has **key K** associated with value V.
- **keyset() -** Returns a set of all the keys present in a map.
- **values() -** **Returns a set of all the values present** in a **map**.
- **entrySet() - Returns a set of all the key/value** **mapping present in a map.**

### Code

## Iterating over a map

**Here, Integer as Key and String as Value.**

## Comparable Interface

- **Purpose: Defines a natural ordering for the objects of the classes that implement it.**
- **Method to implement: compareTo(T o)**
- **Functionality: This method compares the current object with the specified object to determine their order.**
- **Return Value: Returns a negative integer, zero or a positive integer as this object is less than, equal to, or greater than the specified object, respectively.**
- **Usage Context: Useful when there is a single, natural ordering of the objects (e.g., alphabetical order for strings, numerical order for numbers).**
- **Integration: Automatically used by sorting methods in collections that do not specify a custom comparator (e.g., Collections.sort(list) when sorting a list of objects that implement comparable).**

### Code

    import java.util.ArrayList;



## Comparator Interface

- **Purpose:** Provides a way to define a custom order for objects, separate from their natural ordering.
- **Method to Implement:** compare(T o1, T o2)
- Functionality: Compares its two arguments for order.
- **Return Value: **Returns a negative integer, zero, or positive integer as the argument is less than, equal to, or greater than the second.
- **Usage Context:** Ideal when you need multiple different ways of ordering objects, or when objects do not have a natural ordering.
- **Flexibility:** Allows specifying the order externally, which is useful for sorting methods when you want to sort based on attributes that are not considered in natural ordering.
- **Integration: **Used by providing an instance of Comparator to sorting methods, such as Collections.sort(list, comparator) or Arrays.sort(array, comparator).

### Code

## Lambda Function

A **lambda function **is just a **short way** to **write** a **function** **without creating a full class or method**.

### Code

## Arrays.sort

### Code







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/bonus)*
