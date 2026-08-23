# Operators in C++

> **Slug:** `operators-in-c`  
> **Published:** 2026-03-09T00:34:00.000Z  
> **Updated:** 2026-03-27T21:46:21.707Z  
> **Keywords:** None  
> **Cover Image:** ![Operators in C++]({'id': '69aef53c307f479fe3663d4b', 'url': 'https://cdn.codehelp.in/payload/WhatsApp Image 2026-03-07 at 16.03.30.jpeg'})

**Description:** Learn C++ operators including arithmetic, relational, logical, assignment, bitwise, unary, and ternary operators with examples and precedence rules.

---

# Types of Operators in C++

C++ provides several types of operators that allow programmers to perform different operations on variables and values.

### 1. Arithmetic Operators

Arithmetic operators are used to perform **basic mathematical calculations**.

Examples:

- `+` → Addition
- `-` → Subtraction
- `*` → Multiplication
- `/` → Division
- `%` → Modulus (remainder)

### 2. Relational Operators

Relational operators are used to **compare two values**. The result of these operations is either **true or false**.

Examples:

- `==` → Equal to
- `!=` → Not equal to
- `>` → Greater than
- `<` → Less than
- `>=` → Greater than or equal to
- `<=` → Less than or equal to

### 3. Logical Operators

Logical operators are used to **combine or manipulate conditions**, especially in decision-making statements.

Examples:

- `&&` → Logical AND
- `||` → Logical OR
- `!` → Logical NOT

### 4. Assignment Operators

Assignment operators are used to **assign values to variables** and sometimes perform operations during assignment.

Examples:

- `=` → Assign value
- `+=` → Add and assign
- `-=` → Subtract and assign
- `*=` → Multiply and assign
- `/=` → Divide and assign

Example:

int x = 5;
x += 3;  // Equivalent to x = x + 3

### 5. Bitwise Operators

Bitwise operators perform operations **directly on the binary representation of numbers**.

Examples:

- `&` → Bitwise AND
- `|` → Bitwise OR
- `^` → Bitwise XOR
- `~` → Bitwise NOT
- `<<` → Left shift
- `>>` → Right shift

### 6. Unary Operators

Unary operators operate on **a single operand**.

Examples:

- `++` → Increment operator
- `--` → Decrement operator

### 7. Conditional (Ternary) Operator

The **ternary operator (****`?:`****)** provides a shorter way to write a simple `if-else` condition.

Example:

int max = (a > b) ? a : b;

### 8. Special Operators

C++ also provides special operators that serve specific purposes.

Examples:

- `sizeof` → Returns the size of a variable or data type in bytes
- `,` (comma operator) → Allows multiple expressions to be evaluated in a single statement

## Operator Precedence and Associativity

Operators in C++ follow a **specific order of precedence**, which determines the sequence in which operations are performed in an expression.

- **Operator precedence** defines which operator is evaluated first.
- **Associativity** determines the direction of evaluation when operators have the same precedence level (usually **left-to-right** or **right-to-left**).

### Example

Consider the expression:

3 + 4 * 5

Since the multiplication operator (`*`) has **higher precedence** than addition (`+`), the multiplication is performed first.

Calculation:

4 * 5 = 20
3 + 20 = 23

### Example and Dry Run

Understanding how expressions work becomes easier through examples.

int a = 5, b = 10;
cout << (a + b * 2);

#### Explanation

1. `b * 2` is evaluated first → `10 * 2 = 20`
2. Then `a + 20` is calculated → `5 + 20 = 25`

Output: 25

## Dry Run Practice

A **dry run** involves manually tracing the execution of a program step-by-step to understand how the code works.

Practicing dry runs helps you:

- Understand program logic more clearly
- Predict program outputs
- Identify logical errors before running the code

## Common Mistakes with Loops

Beginners often make mistakes when writing loops. Some common issues include:

### Infinite Loops

An infinite loop occurs when the loop condition **never becomes false**.

Example:

In this case, the loop runs indefinitely because the value of `i` is **never updated**.

### Incorrect Placement of Increment Statements

Placing the increment operation in the wrong place within a loop can cause **incorrect logic or unexpected behavior**. Always ensure that the loop variable is **updated properly**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/operators-in-c)*
