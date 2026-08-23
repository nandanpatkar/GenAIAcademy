# Switch case in C++

> **Slug:** `switch-case-in-c`  
> **Published:** 2026-03-07T08:44:16.445Z  
> **Updated:** 2026-03-27T21:46:21.010Z  
> **Keywords:** None  
> **Cover Image:** ![Switch case in C++]({'$oid': '69abe55c307f479fe36528e5'})

**Description:** Learn the C++ switch case statement, syntax, valid data types, break and default usage, and how it simplifies multiple conditional checks.

---

# Switch Case in C++

The **`switch`**** statement** in C++ is used to select one block of code from multiple possible options. It evaluates a single expression and executes the code associated with the matching `case`.

This statement is particularly useful when a variable can have **multiple predefined values**, making the code cleaner and easier to read compared to multiple `if-else` statements.

# Syntax and Usage

A `switch` statement evaluates an expression (usually an integer or character). Based on the result, the program executes the code inside the matching `case`. If none of the cases match, the `default` block is executed.

### How it Works

1. The expression inside the `switch` statement is evaluated.
2. The result is compared with each `case` value.
3. When a matching case is found, the corresponding block of code is executed.
4. The `break` statement stops further execution and exits the switch block.
5. If none of the cases match, the `default` block is executed.



# Valid Data Types

The expression used in a `switch` statement must be of an **integral or enumerated type**.

Supported data types include:

- `int`
- `char`
- `enum`

Floating-point types such as `float` or `double` and complex data types **cannot be directly used** in a `switch` expression.

# Best Practices

When using a `switch` statement, it is recommended to follow these practices:

- Always include a **`break`**** statement** at the end of each case to prevent unintended fall-through.
- Use the **`default`**** case** to handle values that do not match any defined case.
- Keep case blocks short and readable for better maintainability.

# Important Points

- A `switch` statement is often **more efficient and cleaner** than multiple `if-else` statements when checking a single variable against several possible values.
- If `break` is omitted, execution will continue into the next case. This behavior is known as **fall-through**.
- Variables declared inside a case block are **limited to that block's scope** unless declared outside the `switch`.

# Example: Displaying Day of the Week

The following program prints the **day of the week** based on the number entered by the user.



### Explanation

- The program asks the user to **enter a number between 1 and 7**.
- The `switch` statement checks the value of `day`.
- Based on the matching case, the program prints the corresponding **day of the week**.
- If the input is outside the range `1–7`, the **default case** prints `"Invalid day!"`.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/switch-case-in-c)*
