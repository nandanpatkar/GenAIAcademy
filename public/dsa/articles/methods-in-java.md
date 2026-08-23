# Methods in Java

> **Slug:** `methods-in-java`  
> **Published:** 2026-08-18T19:46:53.420Z  
> **Updated:** 2026-08-18T19:46:53.426Z  
> **Keywords:** Methods in Java, Java, Static Keyword, Method, Function, Method Overloading, Overriding, Arguments, Parameters, call by value  
> **Cover Image:** ![Methods in Java](https://cdn.codehelp.in/media/articles/1776357775485-4fb24f6f-codehelp-1.jpg.png)

**Description:** Learn Java methods, syntax, parameters, return types, method overloading, call by value, variable scope, and call stack.

---

## Methods in Java

 Let's say you want to print table of 2, or any repeated logic. Without methods, you are copy-pasting the same **for **loop every single time.

 Now if you have to, Print the table of any other number.” You have to go and change it in multiple places. And if you miss even one place, you get an error.

Also by using code again and again, your code becomes

1. Bulky
2. Hard to maintain
3. Not modular
4. Zero readability



This is where **Methods / Function **comes in.

## What is Method/Function ?

A separate block of code that does one specific task. You write it once, and call or use it as many times as you want.

Think of it like a machine, you set it up once and then using it whenever you need it.

### Syntax of a Method

Where:

- returnType: What type of value this method gives back, e.g: int, boolean char, void.
- methodName: Name of function/method, e.g: printTable, CalculateSum.
- (): Represent it is a function/method, e.g: printTable()
- { }: Actual task this method/function does, basically a complete body as what your function execute or you can say all your logic goes here.

 Example:

### Your First Method: Print Table of 2

without methods, you repeat the loop everywhere, with a method, write it once:

Now whenever you need the table of 2, just **call** this method. Which brings us to the next topic.

### Call / Invoke a Method

We use this, when we have to execute or call to run the function.

So to run **printTable, **we have to** call the function.**

Now, when we execute this line, (**printTable** method), runs everything inside  this block and comes back.

### Parameters and Arguments

Sometimes a method needs some data to work with. You pass that data when calling the method.

Here **a** and **b** are hardcoded inside. But what if you want to pass your own numbers?

Now, call it like:

### Terms:

Arguments - the value you send while calling the method, which is **5, 10**.

Parameter - the variable that receives that value inside the method, which is **int a **and **int b**.

### Method Signature

A method's identity is defined by its **signature** as, 

Signature = **return type + method name + parameters**

This matters a lot when we get to Method Overloading (coming up below).

### Void vs Non-void Return Type

#### Void: The method does its job and exits. It doesn't give anything back.

When the closing **} **is reached → method body executes → control goes back to where it was called from.

***Note: We can use the return keyword inside void method, but only to exit early, not to return a value.***

#### Non-void Method that returns a value: When we want the method to **give something back** to the caller.

Here, Returned value:

### Execution Flow and Arguments

Now, let's check how java runs the code, step by step:

You might be confused about "Babbar", so` `System.out.println("Babbar") was written **after** **return ans.** Once **return** executes, the method exits immediately. Any code after **return** is **unreachable** and never runs.

### Method Call Stack

When methods call other methods, Java uses a **Call Stack** to keep track of where it is.

Stack: A data structure where things are added and removed from the top. *We will cover this in details in future video.*

Here's how the call stack looks for the above code:



### Static Keyword

In Java, to use a method, you normally need to create an **object** of the class first. But if you mark a method as **static**, you can use it **directly without creating any object**.

Since we haven't learned objects yet, we mark everything **static** for now.

***Note: We will revisit this properly when we cover Object-Oriented Programming (OOP).***

### Method Overloading

Can two methods have the same name? **Yes**, but their **signatures must be different**.

The difference can be in:

- Number of parameters
- Type of parameters

In Java, the compiler chooses the right **add** method based on the number of arguments. This is called **Method Overloading**.

### Call by Value

When you pass a variable to a method in Java, a **copy** of that value is passed, not the original variable itself.

### Variable Scoping

Variables live only inside the **{ } **block where they are created. Outside that block, they don't exist.

Each method has its own **scope**,  its own private space for variables.

### The main() Method in Java

Every Java program starts from **main()**. 

**Syntax:**

**where:**

- **class Methods: **Every Java program lives inside a class.
- **public: Accessible** from anywhere.
- **static: **No object needed to call it.
- **void: main**() doesn't return anything.
- **main: **The name Java looks for to start the program.
- **strings[] args: **Stores command-line arguments as text.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/methods-in-java)*
