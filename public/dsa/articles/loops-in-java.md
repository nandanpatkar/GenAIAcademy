# Loops in Java

> **Slug:** `loops-in-java`  
> **Published:** 2026-08-18T10:55:08.350Z  
> **Updated:** 2026-08-18T10:55:08.436Z  
> **Keywords:** loops in java, for loop, while loop, do while loop  
> **Cover Image:** ![Loops in Java](https://cdn.codehelp.in/media/codehelp-1.jpg)

**Description:** Learn Java loops (for, while, do-while), syntax, examples, nested loops, break, continue, and common mistakes for DSA and coding practice.

---

# **Java Loops**

In programming, we often need to repeat a task multiple times.

For example, in a learning platform like **CodeHelp ONE**, you may want to:

- print progress for 7 days
- check all completed modules
- repeat a menu until the user exits
- process multiple test cases

If you write the same statement again and again manually, the code becomes long and inefficient.

That is why we use **loops**.

Loops allow us to execute a block of code repeatedly.

# **What is a Loop in Java?**

A **loop** is a control structure that repeats a block of code as long as a condition is satisfied.

Java mainly provides 3 loops:

1. for loop
2. while loop
3. do-while loop

Each loop is used in slightly different situations.

# **Why Do We Need Loops?**

Loops help in:

- reducing repetition
- writing shorter code
- solving pattern problems
- processing arrays and strings
- implementing DSA logic
- handling repeated input/output

Without loops, even simple tasks become tedious.

For example, printing numbers from 1 to 5 without loop:

This is clearly not scalable.

Using a loop is much better.

# **1) Java for Loop**

The for loop is used when you know in advance how many times the loop should run.

## **Syntax of for Loop**

## **Meaning of Each Part**

### **1. Initialization**

Runs only once at the beginning.

Example:

### **2. Condition**

Checked before every iteration.

If condition is true → loop runs

If condition is false → loop stops

### **3. Update**

Changes loop variable after each iteration.

Example:

```javascript

```

# **Example 1: Print Numbers from 1 to 5**

## **Output**

> [!NOTE]
> **SUCCESS**
> 1
> 2
> 3
> 4
> 5

## **Explanation**

Loop starts with:

```javascript

```

Condition:

```javascript

```

As long as this is true, the loop continues.

After each iteration:

```javascript

```

increases value by 1.

## **Dry Run**

### **Iteration 1**

- day = 1
- 1 <= 5 → true
- print 1
- update → day = 2

### **Iteration 2**

- day = 2
- 2 <= 5 → true
- print 2
- update → day = 3

### **Iteration 3**

- day = 3
- print 3

### **Iteration 4**

- day = 4
- print 4

### **Iteration 5**

- day = 5
- print 5

### **Iteration 6**

- day = 6
- 6 <= 5 → false
- loop stops

# **Example 2: Print Even Numbers from 2 to 10**

## **Explanation**

Initialization:

```javascript

```

Condition:

```javascript

```

Update:

```javascript

```

So values become:

2, 4, 6, 8, 10

This is an example of jumping in steps instead of increasing by 1.

# **Example 3: Print a Message 3 Times**

## **Key Learning**

Use for loop when:

- repetition count is known
- working with indices
- solving pattern problems
- iterating through arrays

# **Flow of for Loop**

The for loop runs in this order:

1. initialization
2. condition check
3. loop body
4. update
5. condition check again
6. repeat until false

# **2) Java while Loop**

The while loop is used when the number of iterations is not fixed in advance.

It keeps running **while the condition remains true**.

## **Syntax of while Loop**

# **Example 4: Print Numbers from 1 to 5 Using while**

## **Explanation**

We first initialize:

```javascript

```

Then loop continues while:

```javascript

```

Inside loop:

- current value is printed
- count++ increases it

## **Dry Run**

### **Start**

count = 1

### **Iteration 1**

- 1 <= 5 → true
- print 1
- count becomes 2

### **Iteration 2**

- 2 <= 5 → true
- print 2
- count becomes 3

And so on until count becomes 6.

Then condition fails and loop stops.

# **Example 5: Countdown Using while**

## **Explanation**

This loop moves backward.

Each time:

- prints current value
- decreases it by 1

Useful when:

- doing countdown
- reverse traversal
- decreasing ranges

# **When to Use while Loop?**

Use while loop when:

- number of repetitions is unknown
- loop depends on some dynamic condition
- waiting for user choice
- processing until condition becomes false

# **3) Java do-while Loop**

The do-while loop is similar to while, but with one important difference:

> It executes the loop body at least once, even if the condition is false.

## **Syntax of do-while Loop**

Notice the semicolon ; after while(condition).

That is important.

# **Example 6: Basic do-while**

## **Output**

> [!NOTE]
> **SUCCESS**
> Revision Round: 1
> Revision Round: 2
> Revision Round: 3

## **Explanation**

The body executes first.

Then condition is checked.

So the order is:

1. execute code
2. update variable
3. check condition
4. repeat if true

## **Dry Run**

### **Start**

revisionRound = 1

### **Iteration 1**

- print 1
- increase to 2
- check 2 <= 3 → true

### **Iteration 2**

- print 2
- increase to 3
- check 3 <= 3 → true

### **Iteration 3**

- print 3
- increase to 4
- check 4 <= 3 → false

Loop stops.

# **Example 7: do-while Runs At Least Once**

## **Explanation**

Condition:

```javascript

```

is false from the beginning.

Still, the message prints once because do-while checks condition **after** execution.

This is the biggest difference between while and do-while.

# **while vs do-while**

## **while**

Condition checked first.

If false initially, loop does not run even once.

## **do-while**

Body runs first.

If condition is false initially, loop still runs once.

## **Example Comparison**

### **while**

No output.

Because condition is false initially.

### **do-while**

Output:

> [!NOTE]
> **SUCCESS**
> Hello

Because body executes once before checking.

# **Infinite Loops**

If loop condition never becomes false, the loop runs forever.

This is called an **infinite loop**.

## **Example 8: Infinite while Loop**

## **Example 9: Infinite for Loop**

## **Why Infinite Loops Happen**

Usually because:

- update is missing
- wrong condition is written
- variable is not changing properly

Example:

This becomes infinite because num is never updated.

# **Nested Loops**

A loop inside another loop is called a **nested loop**.

This is heavily used in:

- pattern problems
- matrices
- grids
- table printing

## **Example 10: Print a Small Square Pattern**

## **Output**

> [!NOTE]
> **SUCCESS**
> * * *
> * * *
> * * *

## **Explanation**

Outer loop controls rows.

Inner loop controls columns.

For every row, inner loop prints 3 stars.

This is the base of all pattern programming.

# **Loop Control Statements**

Java provides statements that affect loop execution:

- break
- continue

# **break in Loop**

break immediately stops the loop.

## **Example 11: Stop at 4**

## **Output**

> [!NOTE]
> **SUCCESS**
> 1
> 2
> 3

## **Explanation**

When testCase == 4, break executes.

Loop stops immediately.

# **continue in Loop**

continue skips current iteration and moves to next one.

## **Example 12: Skip 3**

## **Output**

> [!NOTE]
> **SUCCESS**
> 1
> 2
> 4
> 5

## **Explanation**

When day == 3, continue skips printing.

Loop then moves to next iteration.

# **for vs while vs do-while**

**Loop Type**

**Best Use Case**

for

when number of iterations is known

while

when loop depends on condition

do-while

when code must run at least once

# **Which Loop Should You Use?**

## **Use for loop when:**

- counting from 1 to n
- traversing arrays using index
- solving patterns
- fixed repetitions

## **Use while loop when:**

- condition-based repetition
- user input driven logic
- unknown iteration count

## **Use do-while loop when:**

- menu-based programs
- body must run once
- prompt must show at least once

# **Common Beginner Mistakes in Loops**

## **1. Forgetting update**

Infinite loop.

Because i++ is missing.

## **2. Wrong condition**

Loop never runs.

Because 1 >= 5 is false from the start.

## **3. Extra semicolon after loop**

This is a common mistake.

The semicolon ends the loop early.

## **4. Confusing while and do-while**

Many beginners expect both to behave same.

They do not.

do-while always runs once.

## **5. Reusing same loop variable carelessly**

In nested loops, use meaningful names like:

- row
- col
- i
- j

depending on context.

# **Interview and DSA Relevance of Loops**

Loops are one of the most important fundamentals in Java.

They are used in:

- arrays
- strings
- patterns
- searching
- sorting
- recursion alternatives
- dynamic programming transitions
- matrix traversal

If your loop fundamentals are weak, DSA becomes difficult.

# **Practice Questions**

Try these on your own:

### **1.**Print numbers from 1 to 10 using for loop.

### **2.**Print numbers from 10 to 1 using while loop.

### **3.**Print first 5 even numbers using for loop.

### **4.**Print multiplication table of 7.

### **5.**Use do-while to print a menu at least once.

### **6.**Print sum of numbers from 1 to n.

### **7.**Print square pattern of size n using nested loops.

### **8.**Print only odd numbers from 1 to 20 using continue.

### **9.**Stop loop when value becomes 6 using break.

# **Quick Summary**

A loop helps repeat code efficiently.

Java provides:

- for loop → fixed repetitions
- while loop → condition-based repetitions
- do-while loop → at least one execution

Also remember:

- break stops loop
- continue skips iteration
- nested loops are used for patterns and grids
- missing update can cause infinite loop

# **Final Takeaway**

Loops are not just a topic.

They are one of the strongest foundations of programming.

If conditionals teach your program **how to decide**,

loops teach your program **how to repeat logic**.

That is why loops are everywhere:

- in beginner problems
- in pattern questions
- in DSA
- in real software systems

Inside a structured journey like **CodeHelp ONE**, loop mastery becomes the bridge between:

**basic syntax → logical programming → problem solving**

So don’t rush this topic.

Practice it deeply.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/loops-in-java)*
