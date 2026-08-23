# Minimum Time Difference

> **Slug:** `minimum-time-difference`  
> **Published:** 2026-07-04T20:05:02.493Z  
> **Updated:** 2026-07-04T20:05:02.498Z  
> **Keywords:** Minimum Time Difference, String  
> **Cover Image:** ![Minimum Time Difference](6a4966b638cb2da009adbec1)

**Description:** Learn how to find the Minimum Time Difference using Sorting with clear examples, real-life analogy, intuition, algorithm, and complexity analysis.

---

## Problem Statement

Given a list of 24-hour clock time points in **"HH:MM"** format, return *the minimum ****minutes****difference between any two time-points in the list*.

## Example 1

> [!NOTE]
> **INFO**
> **Input: **timePoints = ["23:59","00:00"]
> **Output:** 1

## Example 2

> [!NOTE]
> **INFO**
> **Input:** timePoints = ["00:00","23:59","00:00"]
> **Output:** 2

## Constraints

- **2 <= timePoints.length <= 2 * 10****4**
- **timePoints[i]** is in the format **"HH:MM".**

### Real-Life Analogy

Imagine you are the station manager at a railway station that operates **24 hours a day**. Every train departure is recorded in **HH:MM** format.

At the end of the day, your boss asks:

> **"Out of all today's train departures, which two trains left closest together in time?"**

For example, suppose the departure times are:
**08:30**
**12:45**
**23:55**
**00:05**

At first glance, you might think the closest departures are during the daytime.

But here's the important part:

The railway operates **continuously**, so **after 23:59, the clock immediately becomes 00:00 of the next day**. Time is circular.

Notice these two departures**, 23:55 **and **00:05**

Although they appear far apart in a sorted list, they're actually only **10 minutes apart** because midnight connects the end of one day to the beginning of the next.

So your job is:

- Convert every departure time into minutes from midnight.
- Compare every pair of neighboring departures after sorting.
- Don't forget to compare the **last departure of the day** with the **first departure of the next day**, since the clock wraps around every 24 hours.

Your final answer is the **smallest gap (in minutes)** between any two train departures.

### Optimal Approach
Intuition

The key observation is that the minimum time difference can only occur between **two neighboring times after sorting**. Once every time is converted into total minutes and arranged in increasing order, any time point that is farther away than its immediate neighbors will always have a larger difference. Therefore, instead of comparing every possible pair, we only need to compare adjacent times in the sorted list. The only special case is that a clock is **circular**—after **23:59**, time wraps back to **00:00**. So, besides adjacent comparisons, we also compare the **last time of the day** with the **first time of the next day** by accounting for the 24-hour wrap-around. This reduces the number of comparisons significantly while still guaranteeing that we find the minimum difference.

### Algorithm

1. We first convert every time from the **"HH:MM" **format into the total number of minutes elapsed since **00:00**. Working with integers makes it much easier to compare time differences than working with strings.
2. We **store all the converted minutes in a list and sort them in ascending order**. Once the times are **sorted**, the minimum difference can only exist **between two consecutive time points**, so there is no need to **compare** every possible **pair**.
3. We **initialize** the answer with a very **large value** and iterate through the sorted list. For **each pair of adjacent times**, we compute their **difference** in **minutes** and update the **minimum difference** whenever we find a smaller value.
4. Finally, since a clock is circular, we also compare the **last time of the day** with the **first time of the next day**. This wrap-around difference is calculated by moving from the last time to midnight and then from midnight to the first time. We update the answer one last time if this difference is smaller.
5. After all comparisons are complete, the **stored minimum difference** represents the smallest gap in minutes between any two given time points.

### Dry Run

//image

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int convertToMin(string time) {
        int hour = stoi(time.substr(0, 2));
        int minute = stoi(time.substr(3, 2));
        return hour * 60 + minute;
    }

    int findMinDifference(vector<string>& timePoints) {
        vector<int> mins;

        for (auto &time : timePoints)
            mins.push_back(convertToMin(time));

        sort(mins.begin(), mins.end());

        int ans = INT_MAX;

        for (int i = 0; i < mins.size() - 1; i++)
            ans = min(ans, mins[i + 1] - mins[i]);

        ans = min(ans, 1440 - mins.back() + mins.front());

        return ans;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    private int convertToMin(String time) {
        int hour = Integer.parseInt(time.substring(0, 2));
        int minute = Integer.parseInt(time.substring(3, 5));
        return hour * 60 + minute;
    }

    public int findMinDifference(List<String> timePoints) {
        List<Integer> mins = new ArrayList<>();

        for (String time : timePoints) {
            mins.add(convertToMin(time));
        }

        Collections.sort(mins);

        int ans = Integer.MAX_VALUE;

        for (int i = 0; i < mins.size() - 1; i++) {
            ans = Math.min(ans, mins.get(i + 1) - mins.get(i));
        }

        ans = Math.min(ans, 1440 - mins.get(mins.size() - 1) + mins.get(0));

        return ans;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def convertToMin(self, time: str) -> int:
        hour = int(time[:2])
        minute = int(time[3:])
        return hour * 60 + minute

    def findMinDifference(self, timePoints: List[str]) -> int:
        mins = []

        for time in timePoints:
            mins.append(self.convertToMin(time))

        mins.sort()

        ans = float('inf')

        for i in range(len(mins) - 1):
            ans = min(ans, mins[i + 1] - mins[i])

        ans = min(ans, 1440 - mins[-1] + mins[0])

        return ans
```

### Complexity Analysis

#### Time Complexity: **O(N log N)**

- The algorithm first converts each of the **N** time strings from the `"HH:MM"` format into the total number of minutes.
- Each conversion takes constant time because the string has a fixed length of 5 characters, so processing all time points requires **O(N)** time.
- Next, we sort the list of converted minutes, which takes **O(N log N)** time.
- After sorting, we perform a single linear scan to compare every pair of adjacent time points, requiring **O(N)** time.
- Finally, we compute the circular difference between the last and first time point in constant time. Therefore, the overall time complexity is **O(N log N)**, dominated by the sorting step.

#### Space Complexity: O(N)

- The algorithm stores the converted minute values in a separate list of size **N**, which requires **O(N)** extra space.
- Apart from this list, only a few integer variables are used for calculations, contributing **O(1)** additional space.
- Since the sorting is performed on the same list and no other significant data structures are created, the overall auxiliary space complexity is **O(N)**.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/minimum-time-difference)*
