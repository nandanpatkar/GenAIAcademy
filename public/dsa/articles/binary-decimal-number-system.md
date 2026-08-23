# Binary decimal number system

> **Slug:** `binary-decimal-number-system`  
> **Published:** 2026-03-09T17:02:40.202Z  
> **Updated:** 2026-03-27T21:46:22.188Z  
> **Keywords:** None  
> **Cover Image:** ![Binary decimal number system]({'$oid': '69aefb19307f479fe3664728'})

**Description:** Learn binary and decimal number systems, base-2 vs base-10, and step-by-step methods to convert numbers between binary and decimal.

---

# Binary and Decimal Number Systems

Understanding number systems is important in computer science because computers operate using **binary numbers**, while humans commonly use the **decimal number system**.

## Binary Number System

### Definition

The **Binary Number System** is a method of representing numbers using only two digits: **0 and 1**. Each digit in a binary number is called a **bit** (binary digit).

### Base

The binary system uses **base-2**, meaning each position in a number represents a power of 2.

### Usage

Binary numbers are widely used in **computing and digital electronics** because electronic circuits can easily represent two states, such as **on/off** or **true/false**, which correspond to **1 and 0**.

### Example

Binary number: **1010**

To convert it into decimal:

(1×23)+(0×22)+(1×21)+(0×20)(1×23)+(0×22)+(1×21)+(0×20)

Step-by-step calculation:

(1 × 8) + (0 × 4) + (1 × 2) + (0 × 1)
= 8 + 0 + 2 + 0
= 10

So, **binary 1010 = decimal 10**.

## Decimal Number System

### Definition

The **Decimal Number System** is the most commonly used number system in daily life. It uses **ten digits: 0–9** to represent numbers.

### Base

The decimal system uses **base-10**, meaning each position in a number represents a power of 10.

### Usage

This system is used in everyday tasks such as:

- Counting
- Financial transactions
- Measurements
- General arithmetic operations

# Conversion Between Binary and Decimal

Understanding how to convert numbers between these two systems is essential in computer science.

## 1. Binary to Decimal Conversion

To convert a binary number to decimal:

1. Start from the **rightmost digit**, which represents 2020.
2. Multiply each binary digit by **2 raised to the power of its position**.
3. Add all the results together.

### Example

Convert binary **1101** to decimal.

(1×23)+(1×22)+(0×21)+(1×20)(1×23)+(1×22)+(0×21)+(1×20)

Calculation:

(1 × 8) + (1 × 4) + (0 × 2) + (1 × 1)
= 8 + 4 + 0 + 1
= 13

So, **binary 1101 = decimal 13**.

## 2. Decimal to Binary Conversion

To convert a decimal number to binary:

1. **Divide the number by 2**.
2. Record the **remainder**.
3. Continue dividing the quotient by 2 until the quotient becomes **0**.
4. The binary number is obtained by reading the **remainders from bottom to top**.

### Example

Convert decimal **13** to binary.

13 ÷ 2 = 6  remainder 1
6  ÷ 2 = 3  remainder 0
3  ÷ 2 = 1  remainder 1
1  ÷ 2 = 0  remainder 1

Reading the remainders from **bottom to top**:

1101

So, **decimal 13 = binary 1101**.

## Summary

- **Binary system**
- - Uses digits **0 and 1**
  - Base **2**
  - Used internally by computers
- **Decimal system**
- - Uses digits **0–9**
  - Base **10**
  - Used in everyday calculations
- Conversion between these systems helps us understand **how computers represent and process numbers**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/binary-decimal-number-system)*
