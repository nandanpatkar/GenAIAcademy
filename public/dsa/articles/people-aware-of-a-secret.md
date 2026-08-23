# People Aware of a Secret

> **Slug:** `people-aware-of-a-secret`  
> **Published:** 2026-08-16T07:32:32.798Z  
> **Updated:** 2026-08-16T07:32:32.806Z  
> **Keywords:** Number of People Aware of Secret, People Aware of a Secret, Queues, Brute, Optimal  
> **Cover Image:** ![People Aware of a Secret](https://cdn.codehelp.in/media/articles/1786862734191-bad90dcb-6.png)

**Description:** Learn how to solve the People Aware of a Secret problem, with clear examples, step-by-step explanation, and time and space complexity analysis.

---

## Problem Statement

On day **1**, one person discovers a secret.

You are given an integer **delay**, which means that each person will **share** the secret with a new person **every day**, starting from **delay** days after discovering the secret. You are also given an integer **forget**, which means that each person will **forget** the secret **forget** days after discovering it. A person **cannot** share the secret on the same day they forgot it, or on any day afterwards.

Given an integer **n**, return* the number of people who know the secret at the end of day *** n**. Since the answer may be very large, return it **modulo** **109 + 7**.

> [!NOTE]
> **INFO**
> Example  1
> 
> **Input:** n = 5, delay = 2, forget = 4
> 
> **Output:** 3
> 
> **Explanation:** On day 5, five people know the secret.

> [!NOTE]
> **INFO**
> Example  2
> 
> **Input:** n = 10, delay = 3, forget = 5
> 
> **Output:** 5
> 
> **Explanation:** Nine people know the secret on day 10.

> [!NOTE]
> **INFO**
> Example  3
> 
> **Input:** n = 7, delay = 2, forget = 4
> 
> **Output:** 6
> 
> **Explanation:** Seven people know the secret on day 7.

## Constraints

- 1 <=** nums.length** <= 100
- 0 <=** nums[i] **<= 1000

## Brute-Force Approach

### Intuition

The basic approach is to use a **single queue** where each entry stores the **day a group learned the secret** and the **number of people in that group**. Each day, we remove people who have forgotten the secret, then **scan the entire queue** to find everyone whose delay period is over and who can still share the secret. The total number of active sharers becomes the number of new people who learn the secret that day, which we add to the queue. This approach is simple, but the full queue scan happens **every day**, making it inefficient and resulting in **O(n²) time complexity**.

### Algorithm

1. **F**irstly, we create  single queu**e,** Each entry stores the day a group discovered the secret and how many people are in that group. Push the first entry **(Day 1, 1 person)**. Start with a total count of 1.
2. **Process each day from Day 2 to Day n:**
3. - **Step 1 : Remove forgetters, **Check the front of the queue. While the group at the front has known the secret for **forget **or more days, pop them out and subtract their count from the total.
  - **Step 2 : Count active sharers by scanning the full queue, **Go through every single entry in the queue. For each group, check if they've waited at least **delay **days. If yes, add their people count to the "sharers" total. (We do this by popping from the front and pushing to the back, effectively rotating through the entire queue.)
  - **Step 3: Add new people,** If there are any sharers, that many new people hear the secret today. Add them to the total count and push a new entry **(today, sharers)** to the back of the queue.
4. **After processing all days**, return the total count modulo 10⁹ + 7.

## Code

### index.cpp Implementation

```index.cpp
#include <queue>
using namespace std;

class Solution {
public:
    int peopleAwareOfSecret(int n, int delay, int forget) {
        const int M = 1e9 + 7;
        queue<pair<int, int>> q;  // {day discovered, number of people}
        q.push({1, 1});
        int ans = 1;  // total people who currently know the secret

        for (int i = 2; i <= n; i++) {
            // Step 1: Remove people who forget today
            while (!q.empty() && q.front().first + forget <= i) {
                ans = (ans - q.front().second + M) % M;
                q.pop();
            }

            // Step 2: Scan the ENTIRE queue to count active sharers
            int sharers = 0;
            int qSize = q.size();
            for (int j = 0; j < qSize; j++) {
                auto front = q.front();
                q.pop();
                // Check if this group has finished their delay
                if (front.first + delay <= i) {
                    sharers = (sharers + front.second) % M;
                }
                q.push(front);  // put back into the queue
            }

            // Step 3: Add new people who heard the secret today
            if (sharers > 0) {
                ans = (ans + sharers) % M;
                q.push({i, sharers});
            }
        }

        return ans;
    }
};
```

### index.java Implementation

```index.java
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int peopleAwareOfSecret(int n, int delay, int forget) {
        int M = 1_000_000_007;
        Queue<long[]> q = new LinkedList<>();  // {day discovered, number of people}
        q.add(new long[]{1, 1});
        long ans = 1;  // total people who currently know the secret

        for (int i = 2; i <= n; i++) {
            // Step 1: Remove people who forget today
            while (!q.isEmpty() && q.peek()[0] + forget <= i) {
                ans = (ans - q.poll()[1] + M) % M;
            }

            // Step 2: Scan the ENTIRE queue to count active sharers
            long sharers = 0;
            int qSize = q.size();
            for (int j = 0; j < qSize; j++) {
                long[] front = q.poll();
                // Check if this group has finished their delay
                if (front[0] + delay <= i) {
                    sharers = (sharers + front[1]) % M;
                }
                q.add(front);  // put back into the queue
            }

            // Step 3: Add new people who heard the secret today
            if (sharers > 0) {
                ans = (ans + sharers) % M;
                q.add(new long[]{i, sharers});
            }
        }

        return (int) ans;
    }
}
```

### index.py Implementation

```index.py
from collections import deque

class Solution:
    def peopleAwareOfSecret(self, n: int, delay: int, forget: int) -> int:
        M = 10**9 + 7
        q = deque()  # each entry: (day discovered, number of people)
        q.append((1, 1))
        ans = 1  # total people who currently know the secret

        for i in range(2, n + 1):
            # Step 1: Remove people who forget today
            while q and q[0][0] + forget <= i:
                ans = (ans - q.popleft()[1] + M) % M

            # Step 2: Scan the ENTIRE queue to count active sharers
            sharers = 0
            q_size = len(q)
            for j in range(q_size):
                front = q.popleft()
                # Check if this group has finished their delay
                if front[0] + delay <= i:
                    sharers = (sharers + front[1]) % M
                q.append(front)  # put back into the queue

            # Step 3: Add new people who heard the secret today
            if sharers > 0:
                ans = (ans + sharers) % M
                q.append((i, sharers))

        return ans
```

### Complexity Analysis

#### Time Complexity: O(N2)

- We process **n ** days, and on each day we scan through the entire queue to count active sharers.
- The queue can hold up to **n ** entries in the worst case (when new people are discovered every day).
- So each day's scan can take up to O(n) time, giving us O(n) × O(n) = **O(n²). ** overall, ***O(N******2*****)**.

#### Space Complexity: O(N)

- The queue stores one entry per group of people. In the worst case, there are **n ** groups (one for each day).
- Each entry stores just two numbers, so the space is proportional to **n **.
- Therefore, the space complexity is* ****O(N)***.

## Optimal Approach

### Intuition

The key idea is to process the secret **day by day** using two queues. Every person who knows the secret is either **waiting** for their delay period to finish or **actively spreading** the secret until they forget it. Since people always finish their delay and forget in the same order they learned the secret, we can use **FIFO queues** to manage these events. The **delay queue** tracks people who are waiting to become active, while the **forget queue** tracks people until they forget the secret. We also maintain **cur **for the number of active spreaders and **ans **for the total number of people who currently know the secret. Each day, forgotten people are removed, eligible people become active, and every active person shares the secret with one new person.

### Algorithm

1. **Firstly, **we set up the** **system**, **Start with **ans = 1,** one person knows the secret on Day 1 and **cur = 0** nobody is actively spreading yet, they still need to wait. Create two empty queues. In each queue, every entry stores two things: the **day** the group heard the secret, and **how many** people are in that group. Push **(Day 1, 1 person)** into both queues, one person heard the secret on Day 1.
2. We follow these steps, for process each day from Day **1** to Day **n**.
3. 1. **Step 1 : Check if anyone forgets today,** Look at the front of the Forget Queue. If those people heard the secret **forget **or more days ago, it's time for them to forget. Pop them out. Subtract their count from both **ans **(they no longer know the secret) and **cur **(they can no longer spread it).
  2. **Step 2: Check if anyone finishes their delay today,** Look at the front of the Delay Queue. If those people heard the secret **delay **or more days ago, their waiting period is over. Pop them out. Add their count to **cur **(they are now active spreaders).
  3. **Step 3: Active spreaders create new people:** If **cur > 0**, then **cur **new people hear the secret today. Add **cur **to **ans**. Then push this new group **(today, cur)** into both the Delay Queue and the Forget Queue — because these new people will also need to wait, and they will also eventually forget.
4. At last, we **processing all n  days**, **ans **holds the final answer.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    int peopleAwareOfSecret(int n, int delay, int forget) {
        const int M = 1e9 + 7;
        int cur = 0; //active spreader
        int ans = 1;
        queue<pair<int, int>>delayQ, forgetQ; 
        delayQ.push({1,1});
        forgetQ.push({1, 1});
        for(int i=1; i<=n; i++) {
            //step 1
            if(!forgetQ.empty() && forgetQ.front().first + forget <= i) {
                auto front = forgetQ.front();
                forgetQ.pop();
                auto no = front.second;
                ans = (ans - no + M) % M;
                cur = (cur - no + M) % M;
            
            }

            // step 2:
            if(!delayQ.empty() && delayQ.front().first + delay <= i) {
                auto front = delayQ.front();
                delayQ.pop();
                cur = (cur + front.second) % M;
            }

            // step 3:
            if(cur > 0) {
                ans = (ans + cur) % M;
                delayQ.push({i, cur});
                forgetQ.push({i, cur});
            }
        }
        return ans;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class Solution {
    public int peopleAwareOfSecret(int n, int delay, int forget) {
        final int M = 1000000007;

        int cur = 0; // active spreaders
        int ans = 1;

        Queue<int[]> delayQ = new LinkedList<>();
        Queue<int[]> forgetQ = new LinkedList<>();

        delayQ.offer(new int[]{1, 1});
        forgetQ.offer(new int[]{1, 1});

        for (int i = 1; i <= n; i++) {

            // Step 1: Remove people who forget the secret
            if (!forgetQ.isEmpty() &&
                forgetQ.peek()[0] + forget <= i) {

                int[] front = forgetQ.poll();
                int no = front[1];

                ans = (ans - no + M) % M;
                cur = (cur - no + M) % M;
            }

            // Step 2: Add people who can start spreading
            if (!delayQ.isEmpty() &&
                delayQ.peek()[0] + delay <= i) {

                int[] front = delayQ.poll();
                int no = front[1];

                cur = (cur + no) % M;
            }

            // Step 3: Active spreaders share the secret
            if (cur > 0) {
                ans = (ans + cur) % M;

                delayQ.offer(new int[]{i, cur});
                forgetQ.offer(new int[]{i, cur});
            }
        }

        return ans;
    }
}
```

### index.python Implementation

```index.python
from collections import deque

class Solution:
    def peopleAwareOfSecret(self, n: int, delay: int, forget: int) -> int:
        M = 10**9 + 7

        cur = 0  # active spreaders
        ans = 1

        delayQ = deque()
        forgetQ = deque()

        delayQ.append((1, 1))
        forgetQ.append((1, 1))

        for i in range(1, n + 1):

            # Step 1: Remove people who forget the secret
            if forgetQ and forgetQ[0][0] + forget <= i:
                day, no = forgetQ.popleft()

                ans = (ans - no + M) % M
                cur = (cur - no + M) % M

            # Step 2: Add people who can start spreading
            if delayQ and delayQ[0][0] + delay <= i:
                day, no = delayQ.popleft()

                cur = (cur + no) % M

            # Step 3: Active spreaders share the secret
            if cur > 0:
                ans = (ans + cur) % M

                delayQ.append((i, cur))
                forgetQ.append((i, cur))

        return ans
```

### Complexity Analysis

#### Time Complexity: O(n)

- We loop through each day from 1 to **n **, that's **n **iterations.
- Inside each iteration, we do at most one push and one pop on each queue. Every group of people is pushed into a queue exactly once and popped exactly once across the entire run.
- All queue operations (push, pop, peek) take constant time.
- So the total work across all **n ** days is ***O(n)****.*

#### Space Complexity: O(n)

- Each queue stores one entry per "batch" of new people. In the worst case, new people are discovered on every single day, so each queue can hold up to **n ** entries.
- Each entry stores just two numbers (the day and the count), so each queue takes O(n) space.
- Overall space complexity is ***O(n)***.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/people-aware-of-a-secret)*
