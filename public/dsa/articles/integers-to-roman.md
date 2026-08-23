# Integers to Romans

> **Slug:** `integers-to-roman`  
> **Published:** 2026-07-05T12:11:35.174Z  
> **Updated:** 2026-07-05T12:11:35.237Z  
> **Keywords:** Integers to Roman, Integers, Roman  
> **Cover Image:** ![Integers to Romans](https://cdn.codehelp.in/media/Integers to romans.png)

**Description:** Convert integers to Roman numerals efficiently. Learn brute-force and greedy approaches with constant time and space complexity explained.

---

## Problem Statement

Roman numerals are an ancient system of writing numbers used in the Roman Empire. We can represent numbers using the Latin letters I, V, X, L, C, D, and M, each representing certain values. The goal of this problem is to create a function that will convert a decimal integer to Roman numeral format. 

Roman numerals are typically written from largest values to smallest values, but there are specific instances where a smaller value appears before a larger one to indicate a subtraction operation.

For this problem, you are given an integer within the range 1 to 3999. Your task is to determine its equivalent Roman numeral.

### Example 1

> [!NOTE]
> **INFO**
> **Input:**  num = 3
> **Output:** III
> **Explanation: **In Roman numerals, the symbol **I** represents the value **1**. To represent the number **3**, we repeat **I** three times as I (1) + I (1) + I (1) = 3. So, 3 represents as III.

### Example 2

> [!NOTE]
> **INFO**
> **Input:** num = 58
> **Output:** LVIII
> **Explanation:** In Roman numerals, **L** represents **50**, **V** represents **5**, and **I** represents **1**. To convert **58**, first take **50**, which is represented by **L**. The remaining value is **8**. Now, **8 = 5 + 3**, which corresponds to **V + III**.So, **58 = 50 + 5 + 3 = L + V + III = LVIII**.

### Example 3

> [!NOTE]
> **INFO**
> **Input:** num = 1994
> **Output:** MCMXCIV
> **Explanation: **In Roman numerals**, M** represents **1000, CM** represents **900, XC** represents **90, IV** represents **4**. To convert **1994**, first take **1000**, which is represented by **M**. The remaining value is **994**. Next, **900** is represented by **CM**. The remaining value is **94**. Then, **90** is represented by **XC**.
> The remaining value is **4**. Finally, **4** is represented by **IV**. So,** 1994 = 1000 + 900 + 90 + 4 = M + CM + XC + IV = MCMXCIV**.

### Constraints

- 1 <= **num** <= 3999

## Real-Life Analogy

Imagine you are in **ancient Rome**, working in a busy market, and your job is to **put price tags on all the items**. But there’s a twist—**numbers don’t exist yet!** Instead, you have small wooden tiles with symbols: M for 1000 coins, D for 500, C for 100, L for 50, X for 10, V for 5, and I for 1. Every time a customer asks for a price tag, you must build the number using these tiles.

You always **start with the biggest tile first** because it’s faster, then **add smaller tiles** to reach the exact price. But sometimes, to save space, you use a shortcut. Instead of writing IIII for 4 coins, you place I before V to make IV, which means 5 − 1 = 4. Instead of LXXXX for 90 coins, you write XC, which is 100 − 10 = 90.

For example, a customer asks you to mark **944 coins**. You pick tiles like this: 900 coins becomes CM, 40 coins becomes XL, and 4 coins becomes IV. The final tag is **CMXLIV**. The customer smiles because the tag is clean, small, and easy to read.

Roman numerals are all about **big tiles first, adding smaller tiles, and using subtraction shortcuts** to save space. It’s an ancient system that is **efficient, neat, and surprisingly clever**.

## Brute-Force Approach

### Intuition

The idea is to predefine every possible Roman numeral representation for each digit place. We create four separate lists: one for the thousands place, one for the hundreds place, one for the tens place, and one for the ones place.
Each list contains all the Roman numeral combinations that a single digit (0–9) can form in that position.

We then extract the digit in the thousands position, the digit in the hundreds position, the digit in the tens position, and the digit in the ones position.
For each extracted digit, we look up its Roman numeral in the corresponding predefined list.
Finally, we concatenate the four selected Roman numeral strings in order—thousands, hundreds, tens, and ones—to form the complete Roman numeral.

This removes the need for calculations or repeated logic, since all combinations are already prepared.

### Algorithm

1. The algorithm begins by preparing four lookup arrays, each storing all possible Roman numeral representations for digits in the thousands, hundreds, tens, and ones positions. The thousands array contains entries for values from 0 to 3, while the hundreds, tens, and ones arrays each contain entries for values from 0 to 9.
2. Next, the number is broken down into its individual positional digits. The thousands digit is found by dividing the number by 1000.
The hundreds digit is obtained by taking the remainder after removing the thousands part and dividing it by 100. The tens digit is extracted by taking the remainder after removing the hundreds part and dividing it by 10. Finally, the ones digit is obtained by taking the remainder after removing the tens part.
3. Once all four digits have been identified, the final Roman numeral is formed by concatenating the corresponding entries from the thousands, hundreds, tens, and ones lookup arrays in that exact order.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `num = 1994`
> 
> **Step 1: Extract digits**
> 
> num = 1994
> 
> thousandDigit = (1994 % 10000) / 1000 = 1
> hundredDigit = (1994 % 1000) / 100 = 994 / 100 = 9
> tenDigit = (1994 % 100) / 10 = 94 / 10 = 9
> `oneDigit = 1994 % 10 = 4`
> 
> **Step 2: Lookup**
> 
> thousands[1] = "M"
> hundreds[9] = "CM"
> tens[9] = "XC"
> `ones[4] = "IV"`
> 
> **Step 3: Concatenate**
> 
> result = "M" + "CM" + "XC" + "IV"
> `result = "MCMXCIV"`
> 
> **Output:** `"MCMXCIV"`

### Code

### C++ Implementation

```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    string intToRoman(int num) {
        // Lookup arrays for each digit position
        vector<string> thousands = {"", "M", "MM", "MMM"};
        vector<string> hundreds = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        vector<string> tens = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        vector<string> ones = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};

        // Extract digits
        int thousandDigit = num / 1000;
        int hundredDigit = (num % 1000) / 100;
        int tenDigit = (num % 100) / 10;
        int oneDigit = num % 10;

        // Concatenate
        return thousands[thousandDigit] +
               hundreds[hundredDigit] +
               tens[tenDigit] +
               ones[oneDigit];
    }
};
```

### Java Implementation

```java
class Solution {
    public String intToRoman(int num) {
        // Lookup arrays for each digit position
        String[] thousands = {"", "M", "MM", "MMM"};
        String[] hundreds = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        String[] tens = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        String[] ones = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};
        
        // Extract digits
        int thousandDigit = num / 1000;
        int hundredDigit = (num % 1000) / 100;
        int tenDigit = (num % 100) / 10;
        int oneDigit = num % 10;
        
        // Concatenate
        return thousands[thousandDigit] + 
               hundreds[hundredDigit] + 
               tens[tenDigit] + 
               ones[oneDigit];
    }
}
```

### Python Implementation

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        # Lookup arrays for each digit position
        thousands = ["", "M", "MM", "MMM"]
        hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]
        tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"]
        ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]

        # Extract digits
        thousand_digit = num // 1000
        hundred_digit = (num % 1000) // 100
        ten_digit = (num % 100) // 10
        one_digit = num % 10

        # Concatenate
        return (
            thousands[thousand_digit]
            + hundreds[hundred_digit]
            + tens[ten_digit]
            + ones[one_digit]
        )
```

### Complexity Analysis

#### Time Complexity: O(1)

- The algorithm performs a **fixed number of operations**, independent of the input value.
- Lookups in the **thousands, hundreds, tens, and ones arrays** take **O(1)** time, as each array contains only a small, predetermined number of elements.
- Forming the final Roman numeral uses **simple string concatenation**, which also takes **O(1)** time because the maximum length of a Roman numeral is bounded (around 15 characters).
- Therefore, the overall **time complexity is O(1)** (constant).

#### Space Complexity: O(1)

- The algorithm uses a set of **fixed-size lookup arrays**.
- The size of these arrays **does not change** with the input value.
- No additional data structures grow based on the number being processed.
- Memory usage remains **constant**.
- Therefore, the overall **space complexity is O(1)**.

## Optimal Approach

### Intuition

The optimal solution is based on a greedy approach because Roman numerals are constructed by always choosing the largest possible symbol at every step. To use this behavior, we first create a mapping of all thirteen key Roman values, including special subtraction cases like 900, 400, 90, and so on. Then, we process these value–symbol pairs in descending order. For each value, we repeatedly subtract it from the number as long as the number remains greater than or equal to that value, and each time we subtract it, we append its corresponding Roman symbol to the result. Once the number becomes smaller than the current value, we move to the next smaller one. This method works efficiently because the Roman numeral system naturally follows a greedy pattern, allowing us to keep picking the largest valid symbol until the entire number is converted.

### Algorithm

1. First, we create a list of **number - symbol pairs**. Each pair contains two things, first is a **numeric value** and second is its **Roman numeral symbol**

This list is arranged from **largest to smallest value**:

- - 1000 → M
  - 900 → CM
  - 500 → D
  - 400 → CD
  - 100 → C
  - 90 → XC
  - 50 → L
  - 40 → XL
  - 10 → X
  - 9 → IX
  - 5 → V
  - 4 → IV
  - 1 → I

Here, 13 values cover all possible Roman numeral cases.

1. Next, we create an **empty result string**. This string will gradually build the final Roman numeral as we process the number.
2. Now we go through each value–symbol pair **from largest to smallest**. For each pair:

- **Check if the current number is greater than or equal to the value**
- - If it is:
  - - Add the corresponding Roman symbol to the result.
    - Subtract that value from the number.
  - Repeat this step as long as the number is still large enough for that value.

This ensures we use the **largest Roman symbols as many times as possible** before moving on to smaller ones.

1. Once the number becomes smaller than the current value, We move to the **next smaller value–symbol pair** and repeat the same checking and subtracting process.
2. At last we return the result as the number becomes **zero** and all required Roman symbols have been added to the result string. At this point, the **result** string represents the **complete Roman numeral**, and we return it.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `num = 1994`
> 
> **Initial:**
> 
> values:  [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
> symbols: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
> result = ""
> `num = 1994`
> 
> **Iteration 1: i=0, value=1000, symbol="M"**
> 
> Is 1994 >= 1000? Yes
>   Append "M", num = 1994 - 1000 = 994
>   result = "M"
> `Is 994 >= 1000? No, move to next`
> 
> **Iteration 2: i=1, value=900, symbol="CM"**
> 
> Is 994 >= 900? Yes
>   Append "CM", num = 994 - 900 = 94
>   result = "MCM"
> `Is 94 >= 900? No, move to next`
> 
> **Iteration 3: i=2, value=500, symbol="D"**
> 
> `Is 94 >= 500? No, move to next`
> 
> **Iteration 4: i=3, value=400, symbol="CD"**
> 
> `Is 94 >= 400? No, move to next`
> 
> **Iteration 5: i=4, value=100, symbol="C"**
> 
> `Is 94 >= 100? No, move to next`
> 
> **Iteration 6: i=5, value=90, symbol="XC"**
> 
> Is 94 >= 90? Yes
>   Append "XC", num = 94 - 90 = 4
>   result = "MCMXC"
> `Is 4 >= 90? No, move to next`
> 
> **Iteration 7-9: Skip (4 < 50, 40, 10)**
> 
> **Iteration 10: i=9, value=9, symbol="IX"**
> 
> `Is 4 >= 9? No, move to next`
> 
> **Iteration 11: i=10, value=5, symbol="V"**
> 
> `Is 4 >= 5? No, move to next`
> 
> **Iteration 12: i=11, value=4, symbol="IV"**
> 
> Is 4 >= 4? Yes
>   Append "IV", num = 4 - 4 = 0
>   result = "MCMXCIV"
> 
>   `Is 0 >= 4? No, move to next`
> 
> **Iteration 13: i=12, value=1, symbol="I"**
> 
> `Is 0 >= 1? No, done`
> 
> **Final Result:** `"MCMXCIV"`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    string intToRoman(int num) {
        string result;
        pair<int, string> values[] = {
            {1000, "M"}, {900, "CM"}, {500, "D"}, {400, "CD"},
            {100, "C"}, {90, "XC"}, {50, "L"}, {40, "XL"},
            {10, "X"}, {9, "IX"}, {5, "V"}, {4, "IV"}, {1, "I"}
        };

        for (const auto& [value, symbol] : values) {
            while (num >= value) {
                result += symbol;
                num -= value;
            }
        }

        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public String intToRoman(int num) {
        // Define value-symbol pairs in descending order
        int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        
        StringBuilder result = new StringBuilder();
        
        // Iterate through each value-symbol pair
        for (int i = 0; i < values.length; i++) {
            // Use this symbol while possible
            while (num >= values[i]) {
                result.append(symbols[i]);
                num -= values[i];
            }
        }
        
        return result.toString();
    }
}
```

### Python Implementation

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        # Define value-symbol pairs in descending order
        values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]

        symbols = [
            "M", "CM", "D", "CD", "C", "XC",
            "L", "XL", "X", "IX", "V", "IV", "I"
        ]

        result = []

        # Iterate through each value-symbol pair
        for i in range(len(values)):
            # Use this symbol while possible
            while num >= values[i]:
                result.append(symbols[i])
                num -= values[i]

        return "".join(result)
```

### Complexity Analysis

#### Time Complexity: O(1)

- The algorithm processes at most **thirteen predefined Roman numeral values**, one after another.
- This happens **regardless of the input number**.
- Even for the largest number (3999), the Roman numeral result contains at most **around fifteen characters**.
- The number of operations and the result size are **fixed** and **do not scale** with the input.
- Therefore, the overall **time complexity is O(1)** (constant).

#### Space Complexity: O(1)

- The algorithm processes at most **thirteen predefined Roman numeral values**, sequentially.
- This processing is **independent of the input number**.
- The largest number (3999) produces a Roman numeral of at most **around fifteen characters**.
- Both the **number of operations** and the **result size** are fixed and **do not scale** with input.
- Therefore, the overall **time complexity is O(1)** (constant).





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/integers-to-roman)*
