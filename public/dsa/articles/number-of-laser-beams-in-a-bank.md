# Number of Laser Beams in a Bank

> **Slug:** `number-of-laser-beams-in-a-bank`  
> **Published:** 2026-07-05T12:08:56.099Z  
> **Updated:** 2026-07-05T12:08:56.136Z  
> **Keywords:** Number of Laser Beams in a Bank  
> **Cover Image:** ![Number of Laser Beams in a Bank](https://cdn.codehelp.in/media/No of laser beam.png)

**Description:** Calculate total laser beams in a bank grid. Learn brute-force and optimal row-by-row approaches with linear space and O(M×N) time efficiency.

---

## Problem Statement

You are given a 2D string array called ***bank***, where each string ***bank[i] ***corresponds to a row of security devices in a bank. Each character in the string can be either:

- ***'1'*** which signifies an active security device.
- ***'0'*** which signifies an inactive security device.

The task is to calculate the total number of laser beams formed. A laser beam is generated between two rows that each have at least one active device. The number of beams formed between a row with ***x*** active devices and another with ***y*** active devices is ***x * y***.

### Task

Determine the aggregate number of laser beams that can be formed throughout the bank's configuration.

### Example 1

> [!NOTE]
> **INFO**
> **Input:** bank = [ "011001", "000000", "010100", "001000"`]`
> 
> **Output:** 8
> **Explanation:** 
> 
> - Row 1: 2 active devices.
> - Row 2: 0 active devices (ignore this row).
> - Row 3: 2 active devices.
> - Row 4: 1 active device.
> - Beams between Row 1 and Row 3: `2 * 2 = 4`
> - Beams between Row 3 and Row 4: `2 * 1 = 2`
> - Total beams = `4 + 2 = 8`
> 
> Calculate the beams between each pair of consecutive non-empty rows to obtain the total laser beams.

### Example 2

> [!NOTE]
> **INFO**
> **Input:**  bank = ['000', '111', '000']
> **Output:** 0
> **Explanation:** No laser beams can be formed between the rows.

### Constraints

- 1 <= **bank.length** <= 500
- 1 <= **bank[i].length** <= 500
- **bank[i][j]** is either '0' or '1'.

## Real-Life Analogy

Imagine a futuristic bank with multiple floors, each protected by rows of laser devices. Every night, when the building goes into security mode, these devices decide whether they will turn on or stay off. A device that turns on glows with a bright red light, and one that stays off remains completely dark. Now, the interesting part of this security system is how it forms laser beams. The system doesn’t create beams across the whole building randomly; instead, it connects floors that are both alive with at least one glowing device. Whenever two floors have active devices, each glowing device on the first floor connects to every glowing device on the second floor, forming bright laser beams that crisscross vertically through the air. It’s almost as if every active device on one floor is shaking hands with every active device on the other.

For example, if one floor has three glowing devices and the next active floor above it has four, the system instantly forms twelve laser beams between them. These beams create a strong protective web that no intruder can pass through. But if there is a floor in between where all the devices are off, that floor acts like a silent and dark space—no beams can be formed through it because there are no glowing devices to connect with. So the security system skips that dark floor and looks for the next floor above that has at least one glowing device.

In this way, the entire bank builds its protection every night by letting the active floors communicate through beams proportional to the number of glowing devices they have. More active devices mean more beams, stronger protection, and a tighter net around the vault. This is exactly how the problem works: each row in the bank is a floor, each ‘1’ is a glowing device, and the total number of laser beams is simply the product of glowing devices between every two floors that are both active.

## Brute-Force Approach

### Intuition

The brute force approach works by first identifying every row in the bank that contains at least one security device. Instead of analyzing all rows, it only keeps track of those that actually matter the ones that contribute to laser beams. Once this filtered list of meaningful rows is collected, the idea is to look at each pair of consecutive such rows and compute how many beams can be formed between them. Since beams only form between neighbouring active rows, each pair contributes a product of their device counts. Adding up the beams from all these pairs yields the final result. This strategy is called brute force because it explicitly gathers and stores all rows with devices first and only then performs the calculations instead of optimizing the process during the scan.

### Algorithm

1. Start at the first row and move down the bank one row at a time. For each row, count how many `'1'`s devices it contains. If a row’s device count is zero, ignore it; if it is greater than zero, record that count. Store each recorded count in a list because we only care about rows that can form beams, empty rows never contribute.
2. After this, take the list of recorded device counts. Now consider each pair of adjacent entries in this list. For each such pair, compute how many beams form between those two rows by multiplying the two counts as beams form only between two non-empty rows with no non-empty rows in between; by building the list we already ensured consecutiveness in terms of active rows.
3. Maintain a running total initialized to zero. For every consecutive pair examined in Step 2, add the product (deviceCount[i] × deviceCount[i+1]) to the running total. As every pair contributes that many distinct device-to-device beams, so summing them gives the total beams.
4. After processing all consecutive pairs in the recorded list, the running total holds the final number of laser beams. Return this value.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** `bank = ["011001","000000","010100","001000"]`
> 
> **Step 1: Extract Rows with Devices**
> 
> **rowsWithDevices = [3, 2, 1]**
> 
> **Step 2: Calculate Beams**
> 
> **Step 3: Return**
> 
> **Output:** `8`

### Code

### C++ Implementation

```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int numberOfBeams(vector<string>& bank) {
        // Step 1: Extract rows with devices
        vector<int> rowsWithDevices;

        for (string& row : bank) {
            int deviceCount = countDevices(row);
            if (deviceCount > 0) {
                rowsWithDevices.push_back(deviceCount);
            }
        }

        // Step 2: Calculate beams between consecutive rows
        int totalBeams = 0;
        for (int i = 0; i < rowsWithDevices.size() - 1; i++) {
            totalBeams += rowsWithDevices[i] * rowsWithDevices[i + 1];
        }

        // Step 3: Return total
        return totalBeams;
    }

private:
    int countDevices(string& row) {
        int count = 0;
        for (char c : row) {
            if (c == '1') {
                count++;
            }
        }
        return count;
    }
};
```

### Java Implementation

```java
import java.util.*;

class Solution {
    public int numberOfBeams(String[] bank) {
        // Step 1: Extract rows with devices
        List<Integer> rowsWithDevices = new ArrayList<>();
        
        for (String row : bank) {
            int deviceCount = countDevices(row);
            if (deviceCount > 0) {
                rowsWithDevices.add(deviceCount);
            }
        }
        
        // Step 2: Calculate beams between consecutive rows
        int totalBeams = 0;
        for (int i = 0; i < rowsWithDevices.size() - 1; i++) {
            totalBeams += rowsWithDevices.get(i) * rowsWithDevices.get(i + 1);
        }
        
        // Step 3: Return total
        return totalBeams;
    }
    
    private int countDevices(String row) {
        int count = 0;
        for (char c : row.toCharArray()) {
            if (c == '1') {
                count++;
            }
        }
        return count;
    }
}
```

### Python Implementation

```python
class Solution:
    def numberOfBeams(self, bank):
        # Step 1: Extract rows with devices
        rows_with_devices = []

        for row in bank:
            device_count = self.countDevices(row)
            if device_count > 0:
                rows_with_devices.append(device_count)

        # Step 2: Calculate beams between consecutive rows
        total_beams = 0
        for i in range(len(rows_with_devices) - 1):
            total_beams += rows_with_devices[i] * rows_with_devices[i + 1]

        # Step 3: Return total
        return total_beams

    def countDevices(self, row):
        count = 0
        for c in row:
            if c == '1':
                count += 1
        return count
```

### Complexity Analysis

#### Time Complexity: O(M x N)

- Let **M** be the number of rows and **N** be the number of columns in the grid.
- The algorithm **examines every row** and **every character** in each row.
- Scanning all **M rows × N columns** results in **O(M × N)** operations.
- After counting devices, processing consecutive row pairs takes at most **O(M)** time, which does **not affect the overall complexity**.
- The dominant work is the **full grid scan**.
- Therefore, the total **time complexity is O(M × N)**.

#### Space Complexity: O(M)

- A separate list is used to store the **number of devices** in each non-empty row.
- In the worst case, where **all rows contain devices**, the list will store **M entries**.
- No other large data structures are used.
- Therefore, the overall **space complexity is O(M)**.

## Optimal Approach

### Intuition

You can avoid storing many rows by processing the bank row by row and remembering only the last non-empty row’s device count; each time you encounter a new row that has devices, you immediately compute the beams between it and the previous non-empty row (by multiplying their device counts) and add that to the running total, then update the remembered count this way you stream the input, never keep more than one previous value in memory, and still account for every valid beam.

### Algorithm

1. Firstly, we start with two memory variables as we keep one variable to store the *total beams we calculate so far*, and another to remember how many devices were in the *last row that actually had devices*. We do this because laser beams only form between rows that both have devices, so remembering the last meaningful row is enough.
2. After this, we go row by row and count devices as for every row, we check how many devices it has. If the row has zero devices, it cannot form any beams so we simply skip it.
3. When we find a row with devices, calculate beams. If this new row has devices, and the previous row we saw also had devices, then beams will form between the two rows. The number of beams between them is:** previousDevices × currentDevices**

We multiply because *each device in one row connects to every device in the next valid row*.
This is why we accumulate this product into our running total.

1. Now, we update the previous row count. After calculating beams, we make the current row's device count the new “previous” count. This lets us correctly check the next row that has devices.
2. After checking all rows, the accumulated total is the exact number of beams formed.

### Dry Run

> [!NOTE]
> **INFO**
> **Input:** **bank = ["011001","000000","010100","001000"]**
> 
> **Initial State:**
> 
> totalBeams = 0
> **previousCount = 0**
> 
> **Row 0: "011001"**
> 
> Count devices: 0+1+1+0+0+1 = 3
> currentCount = 3
> currentCount > 0? Yes
>   previousCount > 0? No (it's 0)
>     Don't add beams (no previous row)
>   Update: previousCount = 3
> **State: totalBeams = 0, previousCount = 3**
> 
> **Row 1: "000000"**
> 
> Count devices: 0+0+0+0+0+0 = 0
> currentCount = 0
> currentCount > 0? No
>   Skip this row (don't update previousCount)
> **State: totalBeams = 0, previousCount = 3 (unchanged)**
> 
> **Row 2: "010100"**
> 
> Count devices: 0+1+0+1+0+0 = 2
> currentCount = 2
> currentCount > 0? Yes
>   previousCount > 0? Yes (it's 3)
>     Add beams: 3 × 2 = 6
>     totalBeams = 0 + 6 = 6
>   Update: previousCount = 2
> **State: totalBeams = 6, previousCount = 2**
> 
> **Row 3: "001000"**
> 
> Count devices: 0+0+1+0+0+0 = 1
> currentCount = 1
> currentCount > 0? Yes
>   previousCount > 0? Yes (it's 2)
>     Add beams: 2 × 1 = 2
>     totalBeams = 6 + 2 = 8
>   Update: previousCount = 1
> **State: totalBeams = 8, previousCount = 1**
> 
> **Return:** `8`

### Code

### C++ Implementation

```cpp
class Solution {
public:
    int numberOfBeams(vector<string>& bank) {
        int totalBeams = 0;
        int previousCount = 0;

        for (string row : bank) {
            int currentCount = countDevices(row);

            // If current row has devices
            if (currentCount > 0) {
                // If there was a previous row with devices, form beams
                if (previousCount > 0) {
                    totalBeams += previousCount * currentCount;
                }

                // Update previous count
                previousCount = currentCount;
            }
        }

        return totalBeams;
    }

private:
    int countDevices(string row) {
        int count = 0;

        for (char c : row) {
            if (c == '1') {
                count++;
            }
        }

        return count;
    }
};
```

### Java Implementation

```java
class Solution {
    private int countSetBits(String binary) {
        int c = 0;
        for (char b : binary.toCharArray()) {
            if (b == '1') c++;
        }
        return c;
    }

    public int numberOfBeams(List<String> bank) {
        List<Integer> devices = new ArrayList<>();
        for (String row : bank) {
            devices.add(countSetBits(row));
        }

        int beams = 0;
        for (int i = 0; i < devices.size() - 1; ++i) {
            int j = i + 1;
            while (j < devices.size()) {
                beams += devices.get(i) * devices.get(j);
                if (devices.get(j) == 0) {
                    ++j;
                } else {
                    break;
                }
            }
        }
        return beams;
    }
}
```

### Python Implementation

```python
class Solution:
    def numberOfBeams(self, bank):
        totalBeams = 0
        previousCount = 0

        for row in bank:
            currentCount = self.countDevices(row)

            # If current row has devices
            if currentCount > 0:
                # If there was a previous row with devices, form beams
                if previousCount > 0:
                    totalBeams += previousCount * currentCount

                # Update previous count
                previousCount = currentCount

        return totalBeams

    def countDevices(self, row):
        count = 0

        for c in row:
            if c == '1':
                count += 1

        return count
```

### Complexity Analysis

#### Time Complexity: O(M x N)

- For each row, the algorithm **scans all characters** to count the number of devices.
- There are **M rows** and **N columns** in each row, resulting in **M × N** total operations.
- No row is processed more than once, and no character is revisited.
- Therefore, the overall **time complexity is O(M × N)**.

#### Space Complexity: O(1)

- The algorithm does **not create any extra arrays or lists**.
- It uses only a few simple variables to store:  - **Total beams so far**
  - **Number of devices in the previous meaningful row**
  - **Count for the current row**
- The amount of extra memory **remains constant**, regardless of input size.
- Therefore, the **space complexity is O(1)**.
- This makes the solution **optimally space-efficient**.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/number-of-laser-beams-in-a-bank)*
