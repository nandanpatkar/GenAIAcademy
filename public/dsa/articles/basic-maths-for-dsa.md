# Basic Maths for DSA

> **Slug:** `basic-maths-for-dsa`  
> **Published:** 2026-04-16T21:18:54.647Z  
> **Updated:** 2026-04-16T21:18:54.740Z  
> **Keywords:** maths for DSA, Maths for coding, Basic maths for coding  
> **Cover Image:** ![Basic Maths for DSA](https://cdn.codehelp.in/media/codehelp-1.jpg)

**Description:** In this Article, we will cover the basics Maths needed for have a solid foundation of DSA and its various concepts and solve a lot of coding problems on those concepts.

---

# **Basic Maths for Java/C++ Programming**

This is not the same as school maths theory.

Here, we are interested in maths only from the programming point of view:

- how numbers behave
- how digits are extracted
- how conditions are built
- how loops are used on numbers
- how logic can be optimized

Inside a learning journey like **CodeHelp ONE**, this topic becomes the bridge between:

- **syntax learning → logical problem solving**

If students become strong in this chapter, they become much more comfortable with:

- pattern problems
- number problems
- loops
- conditions
- early DSA questions

# **Why Basic Maths Matters in Programming**

A lot of beginner questions in Java are actually built on simple maths ideas.

For example:

- checking even or odd
- counting digits
- reversing a number
- checking palindrome
- finding factorial
- checking prime
- finding GCD and LCM

At first glance, these look like “math problems”.

But in reality, they are **logic building problems**.

That is why this topic is very important.

# **1. Number Basics**

In programming, we mostly deal with two kinds of numbers at the start:

- **integers** → whole numbers like 5, 18, 120
- **decimal numbers** → like 3.14, 12.5

In beginner DSA and number logic problems, most of the time we use **integers**.

Example:

> [!NOTE]
> **INFO**
> int age = 25;
> int solvedProblems = 150;
> double completionRate = 87.5;

For this article, our main focus will be on **integer mathematics**.

# **2. Basic Arithmetic Operations**

Java supports all the basic mathematical operations:

**Operation**

**Symbol**

Addition

+

Subtraction

-

Multiplication

*

Division

/

Modulo

%

Example:

## **Important: Division in Java**

When both operands are integers, Java performs **integer division**.

So:

> [!NOTE]
> **INFO**
> 10 / 3 = 3

not 3.333...

The decimal part is discarded.

## **Important: Modulo Operator %**

The modulo operator gives the **remainder**.

Example:

> [!NOTE]
> **INFO**
> 10 % 3 = 1

Because:

> [!NOTE]
> **INFO**
> 10 = 3 × 3 + 1

This operator is extremely important in programming.

It is used in:

- even/odd checks
- digit extraction
- cyclic operations
- number logic problems

# **3. Digits of a Number**

This is one of the most important concepts in beginner programming maths.

Whenever you want to work with digits of a number, two operations become very powerful:

## **Extract last digit**

> [!NOTE]
> **INFO**
> n % 10

## **Remove last digit**

> [!NOTE]
> **INFO**
> n / 10

Example:

Suppose:

> [!NOTE]
> **INFO**
> n = 1234

Then:

- n % 10 = 4 → last digit
- n / 10 = 123 → number without last digit

This single idea is used in:

- count digits
- sum of digits
- reverse number
- palindrome number
- Armstrong number

# **Problem 1: Count Digits in a Number**

## **Problem**

Given a positive integer, count how many digits it contains.

Example:

> [!NOTE]
> **INFO**
> Input: 12345
> Output: 5

## **Intuition**

Every time we divide a number by 10, one digit gets removed from the right.

So if we keep doing:

> [!NOTE]
> **INFO**
> n = n / 10

until the number becomes 0, the number of steps tells us the digit count.

## **Java Code**

## **Dry Run**

Initial value:

> [!NOTE]
> **INFO**
> n = 12345, count = 0

Step by step:

- 12345 / 10 = 1234 → count = 1
- 1234 / 10 = 123 → count = 2
- 123 / 10 = 12 → count = 3
- 12 / 10 = 1 → count = 4
- 1 / 10 = 0 → count = 5

Loop stops.

Output:

> [!NOTE]
> **INFO**
> Number of digits = 5

# **Problem 2: Sum of Digits**

## **Problem**

Find the sum of all digits of a number.

Example:

> [!NOTE]
> **INFO**
> Input: 1234
> Output: 10

Because:

> [!NOTE]
> **INFO**
> 1 + 2 + 3 + 4 = 10

## **Intuition**

To process digits one by one:

- extract last digit using % 10
- add it to sum
- remove last digit using / 10

## **Java Code**

## **Dry Run**

Start:

> [!NOTE]
> **INFO**
> n = 1234, sum = 0

### **Iteration 1**

- digit = 1234 % 10 = 4
- sum = 0 + 4 = 4
- n = 1234 / 10 = 123

### **Iteration 2**

- digit = 123 % 10 = 3
- sum = 4 + 3 = 7
- n = 12

### **Iteration 3**

- digit = 12 % 10 = 2
- sum = 7 + 2 = 9
- n = 1

### **Iteration 4**

- digit = 1 % 10 = 1
- sum = 9 + 1 = 10
- n = 0

Output:

> [!NOTE]
> **INFO**
> Sum of digits = 10

# **Problem 3: Reverse a Number**

## **Problem**

Reverse the digits of a number.

Example:

> [!NOTE]
> **INFO**
> Input: 1234
> Output: 4321

## **Intuition**

As we extract digits from right to left, we can build the reversed number.

If current reversed number is rev, then:

> [!NOTE]
> **INFO**
> rev = rev * 10 + digit;

Why multiply by 10?

Because it shifts old digits left and creates space for the new digit.

## **Java Code**

## **Dry Run**

Start:

> [!NOTE]
> **INFO**
> n = 1234, rev = 0

### **Iteration 1**

- digit = 4
- rev = 0 * 10 + 4 = 4
- n = 123

### **Iteration 2**

- digit = 3
- rev = 4 * 10 + 3 = 43
- n = 12

### **Iteration 3**

- digit = 2
- rev = 43 * 10 + 2 = 432
- n = 1

### **Iteration 4**

- digit = 1
- rev = 432 * 10 + 1 = 4321
- n = 0

Output:

> [!NOTE]
> **INFO**
> Reversed number = 4321

# **4. Even and Odd Number**

## **Rule**

A number is:

- **even** if divisible by 2
- **odd** if not divisible by 2

That means:

> [!NOTE]
> **INFO**
> n % 2 == 0

is the standard check for even.

## **Java Code**

## **Explanation**

Here:

> [!NOTE]
> **INFO**
> 7 % 2 = 1

Since remainder is not 0, the number is odd.

# **Problem 4: Palindrome Number**

## **Problem**

A number is palindrome if it reads the same forward and backward.

Examples:

- 121 → palindrome
- 1331 → palindrome
- 123 → not palindrome

## **Intuition**

If we reverse the number and it becomes equal to the original number, then it is palindrome.

## **Java Code**

## **Dry Run**

For n = 121:

- reverse becomes 121
- original also 121

So output:

> [!NOTE]
> **INFO**
> Palindrome

# **Problem 5: Prime Number**

## **Problem**

A prime number is a number greater than 1 that is divisible only by:

- 1
- itself

Examples:

- 2, 3, 5, 7, 11 are prime
- 4, 6, 8, 9 are not prime

## **Basic Intuition**

To check if n is prime:

- try all numbers from 2 to n-1
- if any of them divides n, then it is not prime

## **Basic Java Code**

## **Dry Run for n = 7**

Try divisors:

- 7 % 2 != 0
- 7 % 3 != 0
- 7 % 4 != 0
- 7 % 5 != 0
- 7 % 6 != 0

No divisor found.

Output:

> [!NOTE]
> **INFO**
> Prime

## **Better Optimization**

You only need to check till:

> [!NOTE]
> **INFO**
> sqrt(n)

because factors always come in pairs.

So optimized loop becomes:

This is a very important improvement for placements.

# **Problem 6: Factorial**

## **Problem**

Factorial of n is:

> [!NOTE]
> **INFO**
> n! = n × (n-1) × (n-2) × ... × 1

Examples:

- 5! = 5 × 4 × 3 × 2 × 1 = 120
- 4! = 24

## **Intuition**

We need to keep multiplying all numbers from 1 to n.

## **Java Code**

## **Dry Run**

Start:

> [!NOTE]
> **INFO**
> fact = 1

- i = 1 → fact = 1
- i = 2 → fact = 2
- i = 3 → fact = 6
- i = 4 → fact = 24
- i = 5 → fact = 120

Output:

> [!NOTE]
> **INFO**
> Factorial = 120

# **Problem 7: GCD (Greatest Common Divisor)**

## **Problem**

GCD of two numbers is the largest number that divides both.

Example:

> [!NOTE]
> **INFO**
> GCD of 12 and 18 = 6

because 6 is the greatest number dividing both.

## **Best Method: Euclidean Algorithm**

This is very important and efficient.

Rule:

> [!NOTE]
> **INFO**
> GCD(a, b) = GCD(b, a % b)

until b becomes 0.

## **Java Code**

## **Dry Run**

Start:

> [!NOTE]
> **INFO**
> a = 12, b = 18

### **Iteration 1**

- temp = 18
- b = 12 % 18 = 12
- a = 18

Now:

> [!NOTE]
> **INFO**
> a = 18, b = 12

### **Iteration 2**

- temp = 12
- b = 18 % 12 = 6
- a = 12

Now:

> [!NOTE]
> **INFO**
> a = 12, b = 6

### **Iteration 3**

- temp = 6
- b = 12 % 6 = 0
- a = 6

Loop stops.

Output:

> [!NOTE]
> **INFO**
> GCD = 6

# **Problem 8: LCM**

## **Problem**

LCM means Least Common Multiple.

It is the smallest number divisible by both numbers.

Example:

> [!NOTE]
> **INFO**
> LCM of 12 and 18 = 36

## **Formula**

Very important relation:

> [!NOTE]
> **INFO**
> LCM × GCD = a × b

So:

> [!NOTE]
> **INFO**
> LCM = (a × b) / GCD

## **Java Code**

## **Explanation**

First we compute GCD using Euclidean algorithm.

Then use formula:

> [!NOTE]
> **INFO**
> lcm = (a * b) / gcd;

For 12 and 18:

- gcd = 6
- lcm = (12 × 18) / 6 = 36

# **Problem 9: Armstrong Number**

## **Problem**

An Armstrong number is a number that is equal to the sum of powers of its digits.

For a 3-digit number, we usually check:

> [!NOTE]
> **INFO**
> abc = a³ + b³ + c³

Example:

> [!NOTE]
> **INFO**
> 153 = 1³ + 5³ + 3³
>     = 1 + 125 + 27
>     = 153

So 153 is an Armstrong number.

## **Java Code**

## **Dry Run**

For 153:

- digit = 3 → sum = 27
- digit = 5 → sum = 27 + 125 = 152
- digit = 1 → sum = 152 + 1 = 153

Since sum equals original number, it is Armstrong.

# **Problem 10: Power of a Number**

## **Problem**

Find a^b

Example:

> [!NOTE]
> **INFO**
> 2^5 = 32

## **Intuition**

Multiply a by itself b times.

## **Java Code**

## **Dry Run**

Start:

> [!NOTE]
> **INFO**
> ans = 1

- multiply by 2 → 2
- multiply by 2 → 4
- multiply by 2 → 8
- multiply by 2 → 16
- multiply by 2 → 32

Output:

> [!NOTE]
> **INFO**
> Power = 32

# **Problem 11: Perfect Number**

## **Problem**

A perfect number is a number whose sum of proper divisors equals the number itself.

Example:

For 6:

Proper divisors are 1, 2, 3

Their sum:

> [!NOTE]
> **INFO**
> 1 + 2 + 3 = 6

So 6 is a perfect number.

## **Java Code**

## **Explanation**

We check all numbers less than n.

If a number divides n, it is a proper divisor.

Then sum them all.

If final sum equals n, then it is perfect.

# **Problem 12: Count Number of Even Digits**

## **Problem**

Count how many digits in a number are even.

Example:

> [!NOTE]
> **INFO**
> Input: 248531
> Even digits: 2, 4, 8
> Output: 3

## **Java Code**

## **Explanation**

We extract each digit and check:

> [!NOTE]
> **INFO**
> digit % 2 == 0

If yes, increment count.

# **Problem 13: Print All Prime Numbers from 1 to n**

## **Problem**

Given n, print all prime numbers from 1 to n.

## **Java Code**

## **Output**

> [!NOTE]
> **INFO**
> 2 3 5 7 11 13 17 19

# **Important Patterns You Must Remember**

After this article, students should remember these core patterns:

## **Extract last digit**

```javascript

```

## **Remove last digit**

```javascript

```

## **Even / Odd**

```javascript

```

## **Reverse number building**

```javascript

```

## **GCD relation**

```javascript

```

## **LCM relation**

```javascript

```

These are not just formulas. These are **coding tools**.

# **Common Beginner Mistakes**

## **1. Forgetting that integer division removes decimals**

```javascript

```

not 2.5

## **2. Using % without understanding remainder**

Students should always mentally connect:

```javascript

```

## **3. Losing original number**

In many number problems, n gets modified inside loop.

So if original value is needed later, store it first:

```javascript

```

## **4. Forgetting to update number inside loop**

Example:

This becomes infinite if n = n / 10 is missing.

# **Practice Advice**

Students should not just read this chapter.

They should manually dry run the code on paper for:

- 1234
- 121
- 153
- 28
- 36

That is where real understanding develops.

# **Final Takeaway**

Basic maths in programming is not about memorizing formulas.

It is about understanding:

- how numbers break
- how digits are processed
- how loops interact with numbers
- how conditions build logic

Once students become comfortable with these problems, they start feeling that:

> “I am not just writing Java syntax now. I am actually solving problems.”





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/basic-maths-for-dsa)*
