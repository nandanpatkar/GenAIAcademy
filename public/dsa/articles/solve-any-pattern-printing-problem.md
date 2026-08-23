# Solve any Pattern Printing Problem

> **Slug:** `solve-any-pattern-printing-problem`  
> **Published:** 2026-04-16T15:52:00.849Z  
> **Updated:** 2026-04-16T15:52:01.032Z  
> **Keywords:** pattern printing  
> **Cover Image:** ![Solve any Pattern Printing Problem](https://cdn.codehelp.in/media/codehelp-1.jpg)

**Description:** Only Trick to solve any pattern printing problem. Here, you will learn how to approach Coding problems based on pattern printing and PFA a assignment of 21 Pattern problems to practice

---

# **Java Pattern Problems **

Pattern problems are one of the best ways to build your programming logic in the beginning.

They help you understand:

- how loops work
- how rows and columns behave
- how printing is controlled
- how logic changes from one line to another

If you are a beginner, do not treat pattern questions as “just star printing”.

They build the exact thinking you will later use in:

- nested loops
- matrices
- simulation problems
- DSA problem-solving

Inside **CodeHelp ONE**, pattern problems are a great starting point for building loop confidence before moving to advanced logic.

# **Basics You Must Know Before Solving Patterns**

Before starting patterns, make sure you understand these things:

## **1. Outer loop controls rows**

If a pattern has n rows, the outer loop usually runs n times.

## **2. Inner loop controls what gets printed in that row**

The inner loop decides:

- how many stars to print
- how many numbers to print
- how many spaces to print

## **3.print() vs println()**

- System.out.print() prints on the same line
- System.out.println() moves to the next line

That means pattern printing usually looks like this:

## **4. Always think row by row**

Best way to solve a pattern:

- Look at row 1
- Look at row 2
- Look at row 3
- Find what changes

Ask:

- Are stars increasing?
- Are stars decreasing?
- Are spaces increasing?
- Are numbers changing with row or column?

## **5. Most beginner patterns are based on 3 things**

- stars or characters
- spaces
- row/column relationship

Once you understand these 3, patterns become easy.

# **Pattern 1: Solid Square Pattern**

## **Problem**

Print a solid square of size n.

### **Example**

For n = 4

```javascript

```

## **Observation**

- Total rows = n
- Total columns in every row = n
- Every position prints *

So:

- outer loop → rows
- inner loop → columns

## **Java Solution**

## **Dry Run for **

## **n = 3**

### **Row 1**

- col = 1 → *
- col = 2 → *
- col = 3 → *
- line ends

### **Row 2**

- again 3 stars

### **Row 3**

- again 3 stars

Output:

```javascript

```

## **Key Learning**

This is the most basic pattern.

It teaches:

- fixed rows
- fixed columns
- nested loop structure

# **Pattern 2: Hollow Square Pattern**

## **Problem**

Print a hollow square of size n.

### **Example**

For n = 5

```javascript

```

## **Observation**

In a hollow square:

- first row → all stars
- last row → all stars
- first column → star
- last column → star
- everything else → space

So star will be printed when:

- row == 1
- row == n
- col == 1
- col == n

## **Java Solution**

## **Dry Run for **

## **n = 4**

### **Row 1**

row == 1, so print stars everywhere

```javascript

```

### **Row 2**

- col 1 → star
- col 2 → space
- col 3 → space
- col 4 → star

```javascript

```

### **Row 3**

same as row 2

### **Row 4**

row == n, so print stars everywhere

## **Key Learning**

This pattern teaches boundary checking.

A lot of beginner logic improves when you start thinking in terms of:

- top boundary
- bottom boundary
- left boundary
- right boundary

# **Pattern 3: Solid Right-Angle Triangle Pattern**

## **Problem**

Print a right-angle triangle.

### **Example**

For n = 5

```javascript

```

## **Observation**

- row 1 → 1 star
- row 2 → 2 stars
- row 3 → 3 stars

So in every row, number of stars = row number

## **Java Solution**

## **Dry Run for **

## **n = 4**

### **Row 1**

print 1 star

```javascript

```

### **Row 2**

print 2 stars

```javascript

```

### **Row 3**

print 3 stars

```javascript

```

### **Row 4**

print 4 stars

```javascript

```

## **Key Learning**

This pattern teaches increasing inner loop length.

This is extremely important because many later problems are based on:

- increasing stars
- decreasing stars
- increasing spaces

# **Pattern 4: Inverted Right-Angle Triangle Pattern**

## **Problem**

Print an inverted right-angle triangle.

### **Example**

For n = 5

```javascript

```

## **Observation**

- row 1 → 5 stars
- row 2 → 4 stars
- row 3 → 3 stars

So stars are decreasing.

Number of stars in each row = n - row + 1

## **Java Solution**

## **Dry Run for **

## **n = 4**

### **Row 1**

n - row + 1 = 4 - 1 + 1 = 4

```javascript

```

### **Row 2**

4 - 2 + 1 = 3

```javascript

```

### **Row 3**

4 - 3 + 1 = 2

```javascript

```

### **Row 4**

4 - 4 + 1 = 1

```javascript

```

## **Key Learning**

This pattern teaches decreasing loop count.

Whenever you see something shrinking row by row, think:

```javascript

```

# **Pattern 5: Solid Pyramid Pattern**

## **Problem**

Print a solid pyramid.

### **Example**

For n = 4

```javascript

```

## **Observation**

Each row has 2 parts:

### **1. Spaces**

- row 1 → 3 leading spaces
- row 2 → 2 leading spaces
- row 3 → 1 leading space
- row 4 → 0 leading spaces

So spaces = n - row

### **2. Stars**

- row 1 → 1 star
- row 2 → 3 stars
- row 3 → 5 stars
- row 4 → 7 stars

So stars = 2 * row - 1

## **Java Solution**

## **Dry Run for **

## **n = 3**

### **Row 1**

- spaces = 3 - 1 = 2
- stars = 2*1 - 1 = 1

```javascript

```

### **Row 2**

- spaces = 3 - 2 = 1
- stars = 2*2 - 1 = 3

```javascript

```

### **Row 3**

- spaces = 3 - 3 = 0
- stars = 2*3 - 1 = 5

```javascript

```

## **Key Learning**

This pattern teaches combination of:

- spaces
- stars
- formula-based printing

This is the base for:

- diamond
- hollow pyramid
- butterfly
- hourglass
- rhombus

# **How to Approach Any Pattern Problem**

Whenever you see a new pattern, follow this method:

## **Step 1**

Count rows

## **Step 2**

For each row, count:

- spaces
- stars / numbers / alphabets

## **Step 3**

Find the formula:

- increasing?
- decreasing?
- odd count?
- even count?

## **Step 4**

Write separate loops for each part

Most patterns become easy once you stop seeing the whole design and start seeing it **row by row**.

# **Assignment Patterns**

Now practice the remaining patterns on your own.

Below I am giving the pattern shape so you know exactly what you need to print.

## **1. Solid Rectangle Pattern**

For rows = 3, cols = 5

```javascript

```

## **2. Hollow Rectangle Pattern**

For rows = 4, cols = 6

```javascript

```

## **3. Hollow Right-Angle Triangle Pattern**

For n = 5

```javascript

```

## **4. Inverted Solid Pyramid Pattern**

For n = 4

```javascript

```

## **5. Hollow Pyramid Pattern**

For n = 5

```javascript

```

## **6. Solid Diamond Pattern**

For n = 4

```javascript

```

## **7. Hollow Diamond Pattern**

For n = 4

```javascript

```

## **8. Butterfly Pattern**

For n = 4

```javascript

```

## **9. Rhombus Pattern**

For n = 5

```javascript

```

## **10. Number Triangle Pattern**

For n = 5

```javascript

```

## **11. Symmetric Number Pyramid Pattern**

For n = 4

```javascript

```

## **12. Number Pyramid Pattern**

For n = 4

```javascript

```

## **13. Floyd’s Triangle Pattern**

For n = 5

```javascript

```

## **14. Alphabet Triangle Pattern**

For n = 5

```javascript

```

## **15. Inverted Alphabet Triangle Pattern**

For n = 5

```javascript

```

## **16. Symmetric Alphabet Pyramid Pattern**

For n = 4

```javascript

```

## **17. Reverse Alphabet Right-Angle Triangle Pattern**

For n = 5

```javascript

```

## **18. Pascal’s Triangle Pattern**

For n = 5

```javascript

```

## **19. Hourglass Shape Pattern**

For n = 4

```javascript

```

## **20. Zig-Zag Pattern**

For n = 9

```javascript

```

## **21. Spiral Matrix Pattern**

For n = 4

```javascript

```

# **Practice Advice for Beginners**

Do not jump directly to hard patterns.

Follow this order:

1. solid square
2. hollow square
3. solid rectangle
4. hollow rectangle
5. right-angle triangle
6. inverted triangle
7. pyramid
8. diamond
9. butterfly
10. number and alphabet patterns

This builds confidence in the right order.

# **Final Advice**

If you get stuck in a pattern problem, do not panic.

Just write this on paper:

- row number
- spaces in that row
- symbols in that row

That single habit solves most beginner pattern questions.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/solve-any-pattern-printing-problem)*
