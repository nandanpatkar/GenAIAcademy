# Nodes Between Critical Points 

> **Slug:** `nodes-between-critical-points-`  
> **Published:** 2026-07-09T08:51:33.641Z  
> **Updated:** 2026-07-09T08:51:33.651Z  
> **Keywords:** Nodes Between Critical Points, CriticalPoints  
> **Cover Image:** ![Nodes Between Critical Points ](https://cdn.codehelp.in/media/articles/1783583620625-7f607276-Nodes_Between_.png)

**Description:** Learn How to Find the Minimum and Maximum Distance Between Critical Points in a Linked List – Brute Force and Optimal Approach with Dry Run

---

## Problem Statement

A critical point in a linked list is a node that is either a local maxima or a local minima. A node is considered a local maxima if its value is strictly greater than both its preceding and succeeding node values. Conversely, a node is a local minima if its value is strictly less than both its preceding and succeeding node values.

In this problem, you are given a linked list represented by its head, and you need to find out the minimum and maximum distances between any two distinct critical points in the list. If there are fewer than two critical points in the list, your function should return [-1, -1].

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input: head = [1, 3, 2, 2, 3, 2, 2, 2, 1]**
> **Output:** : **[3, 3]**
> **Explanation: The critical points are at indices [1, 4, 6] with equal min and max distance.**

> [!NOTE]
> **INFO**
> Example 2
> Input: **head = [1, 2, 3, 4, 5]**
> Output: **[-1, -1]**
> Explanation: **No critical points in a strictly decreasing list.**

## Constraints

- The number of nodes in the list is in the range** [2,  10****5****]**.
- 105<=** Node.val **<= 105

## Real-Life Analogy

Think of a roller coaster ride. The track goes up and down, and as you ride along, there are certain moments that feel very special. When the ride climbs and suddenly reaches a peak higher than both the slope you just came from and the slope ahead, you feel like you are on top of the world that’s a local maxima. A little further, the ride may dip deep into a valley that is lower than the ground you came from and the climb ahead, that’s a local minima. These peaks and valleys are what we call **critical points** in our linked list.

Now, imagine the ride operator wants to measure how thrilling the ride is. They don’t care about every single point on the track, only those dramatic highs and lows. So, they start noting down where these peaks and valleys happen along the track. Once they have all these points, they measure the distances between them. The **shortest distance** tells them how quickly the ride switches between excitement, like going from a peak into a valley almost immediately. The **longest distance** tells them the stretch between the most far-apart dramatic moments, like waiting a long while before the next big drop.

But if the track is too plain, with only one hill or no dips at all, then there just isn’t enough excitement to measure—and in that case, the operator reports back with **[-1, -1].**

At that moment, you gather all those sweets (3 + 1 + 4 = 8) and put them into **one basket of 8 sweets**. The empty baskets on either side are just there to tell you where the grouping begins and ends, so you do not keep them in your final arrangement.

By the end, instead of a confusing sequence of empty baskets and scattered sweets, you are left with just neat baskets, each filled with the total number of sweets that were between two empties.

So, the linked list transformation is like organizing party baskets: throwing away the empty placeholders (0s) and combining everything between them into one clear, meaningful basket — the **sum node**.

## Brute-Force Approach

### Intuition

The brute force approach goes through the linked list to find all the critical points and keeps track of their positions. After that, instead of using any shortcuts, it checks the distance between **every possible pair** of critical points using nested loops. For each pair, it calculates the distance and updates the smallest and largest values found. This works correctly because it tries every combination, but it's slow, O(k²) time if there are k critical points. It misses the optimization that the largest distance is always between the first and last critical points, and the smallest is always between consecutive ones.

### Algorithm

1. We **initialize the traversal variables** like, Create an empty list criticalPoints to store indices of critical nodes. And then set up three pointers as,  prev = head, curr = head.next. Start** index = 1** because **curr **is at position 1 (we need to examine middle nodes that have both neighbors).

2. Now, We **find all Critical points pass:**
**While curr != null && curr.next != null:**

- A node is *critical* if it is a local maxima or minima:
(curr.val > prev.val && curr.val > curr.next.val) **or**
(curr.val < prev.val && curr.val < curr.next.val).
- Now, If critical, and index to criticalPoints.
- Next we move the sliding window forward: **prev = curr, curr = curr.next, index++**.

1. After this we handle the **edge case**, If **criticalPoints.size() < 2**, there are not enough critical points to measure distances → return **[-1, -1].**
2. Next, Initialize distance variables as we set **minDist = Integer.MAX_VALUE** and **maxDist = Integer.MIN_VALUE.**
3. By, **Brute Force Distance Calculation**, Check all pairs of critical points using nested loops:

- For** i = 0** to **criticalPoints.size() - 1**:
- - For **j = i + 1** to **criticalPoints.size() - 1**:
  - - Calculate **distance = criticalPoints.get(j) - criticalPoints.get(i).**
    - Update minDist = Math.min(minDist, distance).
    - Update **maxDist = Math.max(maxDist, distance).**

This checks all possible pairs: (0,1), (0,2), (0,3)..., (1,2), (1,3)..., etc.

6. Lastly, **Return the answer [minDist, maxDist]**. 

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    vector<int> nodesBetweenCriticalPoints(ListNode* head) {

        vector<int> criticalPoints;

        ListNode* prev = head;
        ListNode* curr = head->next;

        int index = 1;

        // First pass: Find all critical points
        while (curr != nullptr && curr->next != nullptr) {

            if ((curr->val > prev->val && curr->val > curr->next->val) ||
                (curr->val < prev->val && curr->val < curr->next->val)) {

                criticalPoints.push_back(index);
            }

            prev = curr;
            curr = curr->next;
            index++;
        }

        // If less than 2 critical points, return {-1, -1}
        if (criticalPoints.size() < 2) {
            return {-1, -1};
        }

        int minDist = INT_MAX;
        int maxDist = INT_MIN;

        // BRUTE FORCE: Check all pairs of critical points
        for (int i = 0; i < criticalPoints.size(); i++) {

            for (int j = i + 1; j < criticalPoints.size(); j++) {

                int distance = criticalPoints[j] - criticalPoints[i];

                minDist = min(minDist, distance);
                maxDist = max(maxDist, distance);
            }
        }

        return {minDist, maxDist};
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public List<Integer> nodesBetweenCriticalPoints(ListNode head) {
        List<Integer> criticalPoints = new ArrayList<>();
        ListNode prev = head;
        ListNode curr = head.next;
        int index = 1;
        
        // First pass: Find all critical points
        while (curr != null && curr.next != null) {
            if ((curr.val > prev.val && curr.val > curr.next.val) ||
                (curr.val < prev.val && curr.val < curr.next.val)) {
                criticalPoints.add(index);
            }
            prev = curr;
            curr = curr.next;
            index++;
        }
        
        // If less than 2 critical points, return [-1, -1]
        if (criticalPoints.size() < 2) {
            return Arrays.asList(-1, -1);
        }
        
        int minDist = Integer.MAX_VALUE;
        int maxDist = Integer.MIN_VALUE;
        
        // BRUTE FORCE: Check all pairs of critical points
        for (int i = 0; i < criticalPoints.size(); i++) {
            for (int j = i + 1; j < criticalPoints.size(); j++) {
                int distance = criticalPoints.get(j) - criticalPoints.get(i);
                minDist = Math.min(minDist, distance);
                maxDist = Math.max(maxDist, distance);
            }
        }
        
        return Arrays.asList(minDist, maxDist);
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def nodesBetweenCriticalPoints(self, head):

        criticalPoints = []

        prev = head
        curr = head.next

        index = 1

        # First pass: Find all critical points
        while curr is not None and curr.next is not None:

            if ((curr.val > prev.val and curr.val > curr.next.val) or
                (curr.val < prev.val and curr.val < curr.next.val)):

                criticalPoints.append(index)

            prev = curr
            curr = curr.next
            index += 1

        # If less than 2 critical points, return [-1, -1]
        if len(criticalPoints) < 2:
            return [-1, -1]

        minDist = float('inf')
        maxDist = float('-inf')

        # BRUTE FORCE: Check all pairs of critical points
        for i in range(len(criticalPoints)):

            for j in range(i + 1, len(criticalPoints)):

                distance = criticalPoints[j] - criticalPoints[i]

                minDist = min(minDist, distance)
                maxDist = max(maxDist, distance)

        return [minDist, maxDist]
```

### Complexity Analysis

#### Time Complexity: **O(n + k****2****)**

- Traversing the linked list to find all critical points takes **O(n)** time.
- Each node is checked exactly once during this traversal.
- After finding all critical points, nested loops are used to check every pair of critical points.
- The outer loop runs **k** times, where **k** is the number of critical points.
- The inner loop runs **(k − 1), (k − 2), … , 1** times.
- Total pair comparisons become: k×(k−1)​ / 2.
- Therefore, checking all pairs takes **O(k²)** time.
- Overall time complexity: ***O(n+k2).***

#### Space Complexity: **O(k)**

- The **criticalPoints **ArrayList stores the indices of all critical points.
- If there are **k** critical points, the ArrayList requires **O(k)** space.
- Variables like **prev, curr, index, minDist**, and **maxDist **use only constant space.
- No recursion is used, so there is no additional call stack space.
- Therefore, the overall space complexity is: ***O(k).***

## Optimal Approach

### Intuition

We do not need to remember every critical point's position as we only need to remember enough to calculate both required distances efficiently." For minimum distance, We only need the previous critical point's position. For maximum distance, We only need the first and current critical point's positions.

### **Algorithm**

1. Firstly we Initialize the traversal variables  Create an empty list **criticalPoints** to store indices of critical nodes. Set up three pointers: **prev = head, curr = head.next**. Start **index = 1** because  **curr **is at position 1.

2. Find All Critical Points Pass:- While **curr != null && curr.next != null**:
- - A node is *critical* if it is a local maxima or minima: **(curr.val > prev.val && curr.val > curr.next.val) **Or** (curr.val < prev.val && curr.val < curr.next.val).**
  - If critical, add **index **to **criticalPoints.**
  - Move the sliding window forward: **prev = curr, curr = curr.next, index++.**

3. Now, we handle the edge case, If **criticalPoints.size() < 2**, there are not enough critical points to measure distances. Then we return **[-1, -1].**

4. Optimized Minimum Distance Calculation. Instead of checking all pairs, only check consecutive critical pointsbecause the minimum distance must occur between adjacent critical points in the sorted list:- Initialize **minDist = Integer.MAX_VALUE**
- Loop from **i = 1** to criticalPoints.size() - 1:
- - Calculate **distance = criticalPoints.get(i) - criticalPoints.get(i-1)**
  - Update minDist = Math.min(minDist, distance).
- This only checks consecutive pairs: (0,1), (1,2), (2,3)..., etc.

5. Now, we directly calculate the maximum distance. The maximum distance is always between the first and last critical points(farthest apart):- **maxDist = criticalPoints.get(criticalPoints.size() - 1) - criticalPoints.get(0)**
- No loops needed - direct calculation

6. Lastly, We return the result as **[minDist, maxDist].**

### **Dry Run**

**//img**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    vector<int> nodesBetweenCriticalPoints(ListNode* head) {

        // Step 1: Initialize traversal variables
        vector<int> criticalPoints;

        ListNode* prev = head;
        ListNode* curr = head->next;

        int index = 1;

        // Step 2: Find all critical points
        while (curr != nullptr && curr->next != nullptr) {

            // Check if current node is a local maxima or minima
            if ((curr->val > prev->val && curr->val > curr->next->val) ||
                (curr->val < prev->val && curr->val < curr->next->val)) {

                criticalPoints.push_back(index);
            }

            // Move the sliding window forward
            prev = curr;
            curr = curr->next;
            index++;
        }

        // Step 3: Handle edge case - less than 2 critical points
        if (criticalPoints.size() < 2) {
            return {-1, -1};
        }

        // Step 4: Optimized minimum distance calculation
        // Only check consecutive critical points
        int minDist = INT_MAX;

        for (int i = 1; i < criticalPoints.size(); i++) {

            int distance = criticalPoints[i] - criticalPoints[i - 1];

            minDist = min(minDist, distance);
        }

        // Step 5: Direct maximum distance calculation
        // Maximum is always between first and last critical points
        int maxDist = criticalPoints[criticalPoints.size() - 1] - criticalPoints[0];

        // Step 6: Return result
        return {minDist, maxDist};
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public List<Integer> nodesBetweenCriticalPoints(ListNode head) {
        // Step 1: Initialize traversal variables
        List<Integer> criticalPoints = new ArrayList<>();
        ListNode prev = head;
        ListNode curr = head.next;
        int index = 1;
        
        // Step 2: Find all critical points
        while (curr != null && curr.next != null) {
            // Check if current node is a local maxima or minima
            if ((curr.val > prev.val && curr.val > curr.next.val) ||
                (curr.val < prev.val && curr.val < curr.next.val)) {
                criticalPoints.add(index);
            }
            // Move the sliding window forward
            prev = curr;
            curr = curr.next;
            index++;
        }
        
        // Step 3: Handle edge case - less than 2 critical points
        if (criticalPoints.size() < 2) {
            return Arrays.asList(-1, -1);
        }
        
        // Step 4: Optimized minimum distance calculation
        // Only check consecutive critical points
        int minDist = Integer.MAX_VALUE;
        for (int i = 1; i < criticalPoints.size(); i++) {
            int distance = criticalPoints.get(i) - criticalPoints.get(i - 1);
            minDist = Math.min(minDist, distance);
        }
        
        // Step 5: Direct maximum distance calculation
        // Maximum is always between first and last critical points
        int maxDist = criticalPoints.get(criticalPoints.size() - 1) - criticalPoints.get(0);
        
        // Step 6: Return result
        return Arrays.asList(minDist, maxDist);
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def nodesBetweenCriticalPoints(self, head):

        # Step 1: Initialize traversal variables
        criticalPoints = []

        prev = head
        curr = head.next

        index = 1

        # Step 2: Find all critical points
        while curr is not None and curr.next is not None:

            # Check if current node is a local maxima or minima
            if ((curr.val > prev.val and curr.val > curr.next.val) or
                (curr.val < prev.val and curr.val < curr.next.val)):

                criticalPoints.append(index)

            # Move the sliding window forward
            prev = curr
            curr = curr.next
            index += 1

        # Step 3: Handle edge case - less than 2 critical points
        if len(criticalPoints) < 2:
            return [-1, -1]

        # Step 4: Optimized minimum distance calculation
        # Only check consecutive critical points
        minDist = float('inf')

        for i in range(1, len(criticalPoints)):

            distance = criticalPoints[i] - criticalPoints[i - 1]

            minDist = min(minDist, distance)

        # Step 5: Direct maximum distance calculation
        # Maximum is always between first and last critical points
        maxDist = criticalPoints[-1] - criticalPoints[0]

        # Step 6: Return result
        return [minDist, maxDist]
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- We traverse the linked list once to identify all critical points.
- Each node is visited exactly once during the traversal.
- Checking whether a node is a critical point takes constant time.
- Therefore, finding all critical points takes: O(n).
- After storing the critical points, we traverse the **criticalPoints **list once to calculate the minimum distance.
- This traversal takes: O(k)
where (k) is the number of critical points.
- Since (k  ≤n), the overall time complexity remains: ***O(n)***.

#### Space Complexity: **O(K)**

- The **criticalPoints **list stores the indices of all critical points.
- If there are **k** critical points, storing them requires: O(k) Space.
- In the worst case, the number of critical points can approach **n**.
- Therefore, the space complexity can become: O(n).
- Variables such as **prev**, **curr**, **index**, **minDist **, and **maxDist **use only constant space: O(1).
- The extra space is mainly used for storing the critical point indices.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/nodes-between-critical-points-)*
