# Garbage Collection Problem

> **Slug:** `garbage-collection-problem`  
> **Published:** 2026-07-04T20:51:27.438Z  
> **Updated:** 2026-07-04T20:51:27.444Z  
> **Keywords:** Garbage Collection Problem  
> **Cover Image:** ![Garbage Collection Problem](6a4971e338cb2da009adbf33)

**Description:** Learn how to solve the Garbage Collection Problem using traversal and techniques, including intuition, explanation, and optimal solution.

---

## Problem Statement

You are tasked with optimizing the garbage collection in a city using three specialized garbage trucks. The city comprises a linear arrangement of houses, each denoted by a 0-indexed array of strings, ***garbage***. Each element of ***garbage*** represents the assortment of garbage at the ith house with characters 'M', 'P', and 'G' corresponding to metal, paper, and glass garbage, respectively.

Each truck is designated to collect only one type of garbage. The trucks all begin at house 0 and follow the sequence of houses. A truck must only visit houses if there is garbage of its specific type.

Additionally, there is an array ***travel*** where ***travel[i]*** indicates the time it takes, in minutes, to travel from house i to house i + 1.

Importantly, no two trucks can operate at the same time. When a truck is either traveling or collecting garbage, the others must be idle.

Your task is to compute the minimum time required for all trucks to collect all the garbage.



## Example 1

> [!NOTE]
> **INFO**
> **Input:**  garbage = ["G","P","GP","GG"], travel = [2,4,3]
> **Output:** 21
> **Explanation:** The paper garbage truck takes 8 minutes, and the glass garbage truck takes 13 minutes, totaling 21 minutes.

## Example 2

> [!NOTE]
> **INFO**
> **Input:** garbage = ["MMM","PGM","GP"], travel = [3,10]
> **Output:** 37
> **Explanation:** The metal garbage truck takes 7 minutes, the paper garbage truck takes 15 minutes, and the glass garbage truck takes 15 minutes, totaling 37 minutes.

## Example 3

> [!NOTE]
> **INFO**
> **Input: **garbage = ["MGP","GMP","PMG"], travel = [5,3]
> **Output:** 33
> **Explanation: **Each type of garbage is distributed across all houses, resulting in 33 minutes of total collection time.

## Constraints

- The array **`garbage` **consists only of the characters** 'M', 'P', and 'G'.**
- **`travel` **array has a size of one less than the **`garbage` **array.
- Each string in **`garbage` **has a length of **at least 1.**

### Real-Life Analogy

Imagine you run a waste management company in a small town arranged in a straight line. The town has several houses, and each house produces different types of waste: metal cans, paper, and glass bottles. You have three specialized trucks, each designed to collect only one type of waste. The metal truck can only collect metal, the paper truck only paper, and the glass truck only glass.

Here's the challenge: all three trucks start from the company depot at the beginning of the street (house 0). Each truck must drive down the street in order, stopping at houses that have their specific type of garbage. For instance, if the paper truck needs to collect paper from house 5, it must drive through houses 0, 1, 2, 3, and 4 to get there, even if those houses don't have paper. The travel time between consecutive houses varies based on distance.

The critical constraint is that your company operates with a single dispatch system—only one truck can be on the road at a time. When one truck is traveling or collecting garbage, the other two must wait at the depot. Your goal as the operations manager is to calculate the total time needed for all three trucks to complete their routes sequentially. This helps you plan shift schedules, estimate fuel costs, and inform residents when collection will be complete.

## Brute-Force Approach

### Intuition

The brute force approach simulates the actual garbage collection process for each truck type. We process each truck independently, tracking its journey from house to house. For each truck type (M, P, G), we traverse through all houses from the beginning. If a house contains garbage of that type, the truck must travel to that house (accumulating travel time for all intermediate houses) and then spend time collecting the garbage (one minute per unit). The key insight is that each truck must travel to the last house containing its specific garbage type, even if intermediate houses don't have that type. This means we need to track the farthest house each truck must visit.

### Algorithm

1. Firstly, we start with setting the **total time** to zero. This acts as a cumulative counter where we will keep adding the time taken by each truck. Since there are three different types of garbage trucks  **M**, **P**, and **G** we will process each one separately because each truck collects only its own garbage category.
2. For every garbage type, start by initializing a truckTime variable to zero. This variable represents the time taken by that particular truck alone. We keep this separate so that each truck’s work is calculated cleanly before adding it to the overall total.
3. Next, we must determine how far this truck needs to travel. To do that, we scan the list of houses and identify the last house that contains at least one unit of the current garbage type. This step is important because a truck should not travel beyond the point where no garbage of its type exists — otherwise the truck would waste time going further without any purpose. If we discover that no house contains this garbage type, then the truck has nothing to collect and will not move at all. In that case, its time remains zero and we simply skip further processing for that truck.
4. If the truck does need to collect garbage, we now traverse from house 0 up to that last required house. At each house during this journey, we count how many pieces of this specific garbage type are present. Every single unit requires one minute to pick up, so we add this count directly to truckTime.
This step ensures we are accounting for collection time accurately — the more garbage present, the longer the truck will take.
5. As we move from one house to the next, we also include the travel time between houses. However, we only add this travel time until we reach the last house that contains this garbage type. Beyond that point, the truck does not need to go further. This guarantees that we are not adding unnecessary movement time.
6. Once we finish visiting all houses required for this truck, the truckTime now represents the complete time spent on both collection and travel for this garbage type. We add this truckTime to the overall total time, because the final answer should reflect how long all three trucks take combined.
7. Repeat the same process for the remaining garbage types (M, P, and G) so that each one independently computes its required time. After all trucks have finished their routes, the total time accumulated is returned as the final result — representing the total operational time for the entire garbage collection system.

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int garbageCollection(vector<string>& garbage, vector<int>& travel) {
        int totalTime = 0;
        vector<char> types = {'M', 'P', 'G'};

        for (char type : types) {
            int truckTime = 0;
            int lastHouse = -1;

            // find last house
            for (int i = 0; i < garbage.size(); i++) {
                if (garbage[i].find(type) != string::npos) {
                    lastHouse = i;
                }
            }

            if (lastHouse == -1) continue;

            for (int i = 0; i <= lastHouse; i++) {

                for (char c : garbage[i]) {
                    if (c == type) {
                        truckTime++;
                    }
                }

                if (i < lastHouse) {
                    truckTime += travel[i];
                }
            }

            totalTime += truckTime;
        }

        return totalTime;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public int garbageCollection(String[] garbage, int[] travel) {
        int totalTime = 0;

        // Process each garbage type: Metal, Paper, Glass
        char[] types = {'M', 'P', 'G'};

        for (char type : types) {
            int truckTime = 0;
            int lastHouse = -1;

            // Find last house containing this type
            for (int i = 0; i < garbage.length; i++) {
                if (garbage[i].indexOf(type) != -1) {
                    lastHouse = i;
                }
            }

            // If type not present, skip
            if (lastHouse == -1) continue;

            // Traverse up to last house
            for (int i = 0; i <= lastHouse; i++) {

                // Count garbage of this type
                for (char c : garbage[i].toCharArray()) {
                    if (c == type) {
                        truckTime++;
                    }
                }

                // Add travel time
                if (i < lastHouse) {
                    truckTime += travel[i];
                }
            }

            totalTime += truckTime;
        }

        return totalTime;
    }
}
```

### index.py Implementation

```index.py
from typing import List

class Solution:
    def garbageCollection(self, garbage: List[str], travel: List[int]) -> int:
        total_time = 0
        types = ['M', 'P', 'G']

        for t in types:
            truck_time = 0
            last_house = -1

            # find last house with this type
            for i in range(len(garbage)):
                if t in garbage[i]:
                    last_house = i

            if last_house == -1:
                continue

            for i in range(last_house + 1):
                truck_time += sum(1 for c in garbage[i] if c == t)

                if i < last_house:
                    truck_time += travel[i]

            total_time += truck_time

        return total_time
```

### Complexity Analysis

#### Time Complexity: O(N x K)

- To analyse the time complexity, notice that the algorithm processes exactly three garbage types, which is a constant amount of work and does not grow with the input.
- For each type, the algorithm first scans all houses to identify the last position where that specific garbage appears.
- This full scan over the houses takes linear time in terms of the number of houses, so it contributes O(N).
- After identifying this last house, the algorithm again moves from the first house up to this position.
- During this pass, it counts how many units of the current garbage are present in each house.
- In the worst case, every house may contain up to K pieces of garbage of that type, so counting them can take O(K) time per house.
- As a result, this second traversal also grows to O(N × K). Since these two operations happen for each of the three garbage types, the total work becomes a constant multiple of N × K. Constants do not affect Big-O notation, so the final time complexity is **O(N × K)**.

#### **Space Complexity: O(1)**

- For space complexity, the algorithm does not create any extra arrays, lists, or auxiliary data structures that grow with the input size.
- It only keeps a few integer variables such as total time, truck time, and indices, all of which occupy constant space regardless of how many houses exist.
- Therefore, the overall space requirement remains fixed, making the space complexity **O(1)**.

## Optimal Approach

### Intuition

We can separate the problem into two independent components, collection time and travel time. Collection Time: Every piece of garbage, regardless of its type, takes exactly 1 minute to collect. This means the total collection time is simply the sum of all garbage units across all houses.We don't need to process each truck type separately for this, we can count all garbage in a single pass. Now for, Travel Time: Each truck only needs to travel to the last house that contains its specific garbage type. For example, if the last house withpaper is house 5, the paper truck travels from house 0 to house 5. The travel time for each truck is the sum of travel times from house 0 to its respective last house. The key optimization is recognizing that we can gather all necessary information (total garbage count and last positions for each type) in a single pass through the data, rather than making three separate passes as in the brute force approach.

### Algorithm

1. We begin by setting up a few essential variables that will guide the entire calculation. First, we create a `pickTime` variable and initialize it to zero. This will keep track of the total minutes needed to physically collect all garbage units, because every single character in the garbage strings represents one minute of pickup time. Along with that, we prepare three more variables—`lastM`, `lastP`, and `lastG`—each starting at `-1`. These will help us remember the furthest house that contains Metal, Paper, and Glass, ensuring that each truck only travels as far as it actually needs to.
2. Once the setup is complete, we make a single, efficient pass through all the houses. As we move through each house at index `i`, we first add the number of garbage units at this house directly to `pickTime`. This is necessary because the trucks must collect these units regardless of their type. At the same time, we inspect the garbage string to see which types appear in it. If the house contains 'M', we update `lastM` with the current index, because the metal truck will need to go at least this far. The same logic applies to 'P' for the paper truck and 'G' for the glass truck. This single pass ensures we gather all required information without unnecessary repeated scanning.
3. After identifying how far each truck must travel, we compute the travel contribution. For each truck, we check whether its last occurrence is valid (i.e., index >= 0). If so, that truck must travel from house 0 up to that last index. Since the travel array stores the time needed to move from one house to the next, we sum all travel times starting from `travel[0]` up to `travel[lastType - 1]`. This gives us the exact number of minutes each truck spends moving along its route. We repeat this individually for the Metal, Paper, and Glass trucks and add all three results together to obtain the full `travelTime`.
4. Finally, we combine both components—`pickTime` (the time spent collecting garbage) and `travelTime` (the time spent moving between houses). Their sum gives us the total time required for all trucks to complete their work, and this value is returned as the final answer.

### Code

### C++ Implementation

```cpp
class Solution {

public:

    int garbageCollection(vector<string>& garbage,
                          vector<int>& travel) {

        int pickTime = 0;

        // Last occurrence of each garbage type
        int lastM = -1;
        int lastP = -1;
        int lastG = -1;

        int n = garbage.size();

        // Step 1: Count pickup time and find last positions
        for (int i = 0; i < n; i++) {

            // Every garbage unit takes 1 minute
            pickTime += garbage[i].length();

            // Update last occurrence
            if (garbage[i].find('M') != string::npos) {
                lastM = i;
            }

            if (garbage[i].find('P') != string::npos) {
                lastP = i;
            }

            if (garbage[i].find('G') != string::npos) {
                lastG = i;
            }
        }

        int travelTime = 0;

        // Step 2: Add travel time for Metal truck
        for (int i = 0; i < lastM; i++) {
            travelTime += travel[i];
        }

        // Step 3: Add travel time for Paper truck
        for (int i = 0; i < lastP; i++) {
            travelTime += travel[i];
        }

        // Step 4: Add travel time for Glass truck
        for (int i = 0; i < lastG; i++) {
            travelTime += travel[i];
        }

        // Step 5: Return total time
        return pickTime + travelTime;
    }
};
```

### Java Implementation

```java
class Solution {

    public int garbageCollection(String[] garbage, int[] travel) {

        int pickTime = 0;

        // Last occurrence of each garbage type
        int lastM = -1;
        int lastP = -1;
        int lastG = -1;

        int n = garbage.length;

        // Step 1: Count total garbage pickup time
        // and find last occurrence of each type
        for (int i = 0; i < n; i++) {

            // Every garbage unit takes 1 minute
            pickTime += garbage[i].length();

            // Update last positions
            if (garbage[i].indexOf('M') != -1) {
                lastM = i;
            }

            if (garbage[i].indexOf('P') != -1) {
                lastP = i;
            }

            if (garbage[i].indexOf('G') != -1) {
                lastG = i;
            }
        }

        int travelTime = 0;

        // Step 2: Add travel time for Metal truck
        for (int i = 0; i < lastM; i++) {
            travelTime += travel[i];
        }

        // Step 3: Add travel time for Paper truck
        for (int i = 0; i < lastP; i++) {
            travelTime += travel[i];
        }

        // Step 4: Add travel time for Glass truck
        for (int i = 0; i < lastG; i++) {
            travelTime += travel[i];
        }

        // Step 5: Total time
        return pickTime + travelTime;
    }
}
```

### Python Implementation

```python
class Solution:

    def garbageCollection(self, garbage, travel):

        pick_time = 0

        # Last occurrence of each garbage type
        last_m = -1
        last_p = -1
        last_g = -1

        n = len(garbage)

        # Step 1: Count pickup time and find last positions
        for i in range(n):

            # Every garbage unit takes 1 minute
            pick_time += len(garbage[i])

            # Update last occurrence
            if 'M' in garbage[i]:
                last_m = i

            if 'P' in garbage[i]:
                last_p = i

            if 'G' in garbage[i]:
                last_g = i

        travel_time = 0

        # Step 2: Add travel time for Metal truck
        for i in range(last_m):
            travel_time += travel[i]

        # Step 3: Add travel time for Paper truck
        for i in range(last_p):
            travel_time += travel[i]

        # Step 4: Add travel time for Glass truck
        for i in range(last_g):
            travel_time += travel[i]

        # Step 5: Return total time
        return pick_time + travel_time
```

### Complexity Analysis

#### Time Complexity: O(N)

- The algorithm scans all houses once to compute garbage counts and find the last required index for each type → **O(N)**
- Each house is checked for presence/count of **'M'**,** 'P'**, and **'G'**, but this is constant work per house → **O(1) per house**
- After preprocessing, travel time is computed for each garbage type (Metal, Paper, Glass)
- Each travel scan goes over the **travel** array, but only a fixed 3 times → **O(N)** overall (constant factor ignored)

#### Space Complexity: O(1)

- The algorithm uses only a fixed number of variables (total time, last indices for M/P/G, and temporary counters).
- No extra data structures like arrays, lists, or maps are created based on input size.
- Memory usage does not grow with the number of houses or travel values.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/garbage-collection-problem)*
