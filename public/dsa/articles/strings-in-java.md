# Strings in Java

> **Slug:** `strings-in-java`  
> **Published:** 2026-04-16T15:54:23.133Z  
> **Updated:** 2026-04-16T15:54:23.135Z  
> **Keywords:** string, strings in java, basics of strings  
> **Cover Image:** ![Strings in Java](https://cdn.codehelp.in/media/codehelp-1.jpg)

**Description:** In this Article, we are going to study the basics of Strings and make a solid foundation for upcoming medium & hard questions based on Strings.

---

# **Java Strings (Foundation Guide)**

Till now, you have learned:

- variables → store single values
- arrays → store multiple values
- loops → process data
- conditionals → make decisions

Now comes a very important topic: " **Strings"**

# **What is a String in Java?**

A **String** is a sequence of characters.

->  In simple words:

> String = collection of characters enclosed in double quotes

## **Example**

## **Real-Life Examples**

Strings are everywhere:

- user name → "Riya"
- course name → "DSA Bootcamp"
- messages → "Welcome to CodeHelp ONE"
- email → "user@gmail.com"

-> Almost every real-world application uses strings heavily.

# **Why Strings Are Important**

Strings are used in:

- user input
- search systems
- text processing
- validation (email, password)
- logs & messages
- problem solving

Inside **CodeHelp ONE**, strings are used in:

- usernames
- course titles
- feedback messages
- leaderboard display

# **How to Create Strings**

## **Method 1: Using String Literal (Most Common)**

## **Method 2: Using new Keyword**

->  For beginners, always use the first method.

# **String is NOT a Primitive Type**

Unlike int, double, char:

- **String is an object (class)**

That’s why it has **methods** (functions) like:

- length()
- charAt()
- equals()

# **String Basics**

## **1. Length of String**

### **Output**

> [!NOTE]
> **SUCCESS**
> 8

## **2. Access Characters**

### **Output**

> [!NOTE]
> **SUCCESS**
> C
> e

## **Important Rule**

- Index starts from **0**

```javascript

```

# **Strings are Immutable**

- This is VERY IMPORTANT

> Once a string is created, it cannot be changed.

## **Example**

## **Output**

> [!NOTE]
> **SUCCESS**
> Hello

## **Why?**

Because concat() does not modify the original string.

It creates a new string.

## **Correct Way**

# **Comparing Strings (VERY IMPORTANT)**

## **❌ Wrong Way**

```javascript

```

## **✅ Correct Way**

```javascript

```

## **Why?**

- == compares memory address
- equals() compares actual content

->  This is a **very common interview question**

# **Taking String Input**

## **Using Scanner**

## **Difference**

**Method**

**Reads**

next()

one word

nextLine()

full line

# **Basic String Problems**

Now let’s solve some **important beginner-level problems**.

# **Problem 1: Print Each Character**

## **Problem Statement**

Print all characters of a string.

## **Code**

## **Output**

> [!NOTE]
> **INFO**
> C
> o
> d
> e

## **Key Learning**

- String traversal is same as array traversal

# **Problem 2: Count Length Without length()**

## **Code**

## **Learning**

- reinforces loop + traversal
- builds logic confidence

# **Problem 3: Count Vowels**

## **Problem**

Count number of vowels in string.

## **Code**

## **Dry Run**

String: CodeHelp

Vowels:

- o
- e
- e

Total = 3

# **Problem 4: Reverse a String**

## **Code**

## **Output**

> [!NOTE]
> **INFO**
> avaJ

## **Key Learning**

- Very important for interviews
- Builds index understanding

# **Problem 5: Check Palindrome**

## **Problem**

Check if string reads same forward and backward.

## **Code**

## **Output**

> [!NOTE]
> **SUCCESS**
> Palindrome

# **Common String Methods**

**Method**

**Use**

length()

size

charAt(i)

character

equals()

compare

toLowerCase()

convert

toUpperCase()

convert

concat()

join

# **Common Mistakes**

## **❌ Using == for comparison**

## **❌ Going out of bounds**

```javascript

```

## **❌ Forgetting immutability**

## **❌ Confusing next() and nextLine()**

# **Homework**

- Count consonants in a string
- Convert string to uppercase without using method
- Find frequency of a character
- Remove all spaces from string
- Check if string contains only digits
- Count words in a sentence

# **Interview Importance**

Strings are one of the most asked topics in:

- coding rounds
- DSA
- backend development

Concepts built here lead to:

- sliding window
- hashing
- pattern matching
- substring problems

# **Final Takeaway**

If arrays taught you how to handle data,

strings teach you how to handle **text data**.

- Almost every real-world problem involves strings.

This is why building a strong foundation here is critical.

Inside a journey like **CodeHelp ONE**, strings mark the point where:

- basic programming → real-world logic



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/strings-in-java)*
