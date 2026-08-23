# Recent Counter

> **Slug:** `recent-counter`  
> **Published:** 2026-08-15T10:55:43.062Z  
> **Updated:** 2026-08-15T10:55:43.068Z  
> **Keywords:** Recent Counter, Queues  
> **Cover Image:** ![Recent Counter](https://cdn.codehelp.in/media/articles/1786365809589-c6fc60d9-5.png)

**Description:** Learn how to design and implement a Recent Counter using a queue. Understand the working, approach,  example, and time and space complexity with code.

---

## Problem Statement

Implement a class **RecentCounter **to efficiently track and count recent network requests within a specific time window. Each request occurs at a timestamp expressed in milliseconds. Your goal is to design a system that registers these requests and calculates how many of them happened in the last 3000 milliseconds until the current timestamp, inclusive.

### Requirements

The **RecentCounter **class must include the following methods:

1. **Constructor**
2. - **RecentCounter()**: Initializes an empty recent requests counter without any requests initially recorded.
3. **Ping Method**
4. - **int ping(int t)**: Records a new request with timestamp **t** and returns the count of requests that have been made in a 3000-millisecond window up to **t**, i.e., from timestamp **[t - 3000, t]** inclusive.

> [!NOTE]
> **INFO**
> RecentCounter recentCounter = new RecentCounter();
> 
> System.out.println(recentCounter.ping(1));    // Output: 1, requests made: [1]
> 
> System.out.println(recentCounter.ping(100));  // Output: 2, requests made: [1, 100]
> 
> System.out.println(recentCounter.ping(3001)); // Output: 3, requests made: [1, 100, 3001]
> 
> System.out.println(recentCounter.ping(3002)); // Output: 3, requests made: [1, 100, 3001, 3002]

***Note: Each ping call is guaranteed to provide a timestamp t that is strictly greater than any previous call's timestamp, which ensures the sequence of requests is always strictly increasing.***

## Constraints

- 1 <=** nums.length** <= 100
- 0 <=** nums[i] **<= 1000

## Brute-Force Approach

### Intuition

The simplest way to solve this is to just store every single ping we ever receive in a massive list. Since we are asked how many pings happened in the last 3000 milliseconds, every time a new ping **t** arrives, we add it to the list. Then, we look through our entire list from the very beginning and just count the ones that fall in the range** [t - 3000, t]**.

### Algorithm

1. Create a dynamic list (or array) to store all the ping timestamps.
2. Whenever **ping(t)** is called, add the current timestamp **t** to the list.
3. Initialize a **count **variable to **0**.
4. Traverse through all the stored timestamps in the list.
5. For each timestamp, check whether it is greater than or equal to **t - 3000**.
6. If the timestamp falls within this 3000-millisecond window, increment **count**.
7. Return **count**, which represents the number of pings received in the last 3000 milliseconds.

## Code

### index.cpp Implementation

```index.cpp
#include <vector>
using namespace std;

class RecentCounter {
private:
    vector<int> history;

public:
    RecentCounter() {
        // Initializes empty history
    }
    
    int ping(int t) {
        // Step 1: Add the new ping to history
        history.push_back(t);
        
        int count = 0;
        int startTime = t - 3000;
        
        // Step 2: Loop through entire history to count valid pings
        for (int i = 0; i < history.size(); i++) {
            if (history[i] >= startTime) {
                count++;
            }
        }
        
        return count;
    }
};
```

### index.java Implementation

```index.java
import java.util.ArrayList;
import java.util.List;

class RecentCounter {
    private List<Integer> history;

    public RecentCounter() {
        history = new ArrayList<>();
    }
    
    public int ping(int t) {
        history.add(t);
        
        int count = 0;
        int startTime = t - 3000;
        
        for (int i = 0; i < history.size(); i++) {
            if (history.get(i) >= startTime) {
                count++;
            }
        }
        
        return count;
    }
}
```

### index.py Implementation

```index.py
class KQueues:
    def __init__(self, n: int, k: int):
        self.n = n
        self.k = k
        self.arr = [0] * n
        self.front_arr = [0] * k
        self.rear_arr = [0] * k
        
        slot_size = n // k
        for i in range(k):
            self.front_arr[i] = i * slot_size
            self.rear_arr[i] = i * slot_size - 1

    def enqueue(self, queue_num: int, value: int) -> None:
        slot_size = self.n // self.k
        if self.rear_arr[queue_num] == (queue_num + 1) * slot_size - 1:
            print("Queue Overflow!")
            return
            
        self.rear_arr[queue_num] += 1
        self.arr[self.rear_arr[queue_num]] = value

    def dequeue(self, queue_num: int) -> int:
        if self.front_arr[queue_num] > self.rear_arr[queue_num]:
            return -1
            
        value = self.arr[self.front_arr[queue_num]]
        self.front_arr[queue_num] += 1
        
        # Reset pointers if empty
        if self.front_arr[queue_num] > self.rear_arr[queue_num]:
            slot_size = self.n // self.k
            self.front_arr[queue_num] = queue_num * slot_size
            self.rear_arr[queue_num] = queue_num * slot_size - 1
            
        return value

    def is_empty(self, queue_num: int) -> bool:
        return self.front_arr[queue_num] > self.rear_arr[queue_num]

    def front(self, queue_num: int) -> int:
        if self.is_empty(queue_num):
            return -1
        return self.arr[self.front_arr[queue_num]]
```

### Complexity Analysis

#### Time Complexity: O(N)

- Each **ping()** call takes **O(N)** time.
- **N** represents the total number of pings received so far.
- We loop through all previously stored pings to count the valid ones.
- As the number of pings increases, the number of elements we need to check also increases.
- For example, if we have **1,000,000 pings**, the next **ping()** call may need to check **1,000,000 elements**.
- Therefore, the time complexity for each **ping()** call is ***O(N)***.

#### Space Complexity: O(N)

- We are saving every single ping in our list forever.
- The list just keeps growing and growing, which takes up a lot of memory.

## Optimal Approach

### Intuition

The problem states that the timestamps** (t**) will strictly increase. This means the pings arrive naturally sorted in time order. If an old ping (say, at time **1**) is already too old for our current ping (say, at time **3002**), it will *definitely* be too old for all future pings, So why are we keeping it in our list and checking it every single time?

We should just throw away the old pings. The perfect data structure for "first-in, first-out" operations is a **Queue**. We can add new pings to the back of the queue, and whenever we get a new ping, we just kick out any old pings from the front of the queue until all the remaining pings fall inside our 3000ms window. Then, the answer is just the size of the queue.

### Algorithm

1. Firstly, we** create a standard Queue**, Use a queue to store the timestamps of all the pings that are currently within the valid time window. Since a queue follows **FIFO (First In, First Out)**, the oldest ping will always be at the front.
2. **Add the new ping to the queue**, whenever **ping(t)** is called, add the new timestamp **t** to the **back of the queue**. Since timestamps are received in increasing order, the newly added ping will always be the most recent one.
3. **Calculate the cutoff time**, We only need to count pings that occurred within the last **3000 milliseconds**. Therefore, calculate:
**cutoff = t - 3000**.  Any ping with a timestamp **less than cutoff **is too old and should no longer be counted.
4. Next, we check the **oldest ping, **Look at the timestamp at the **front of the queue**. Because of the FIFO property, this is always the oldest ping currently stored.
5. 1. If **front < t - 3000**, the ping is older than the allowed 3000ms window.
  2. Remove it from the queue because it is no longer valid.
6. **Remove all expired pings**, Keep checking the front of the queue and removing expired timestamps until the oldest remaining ping satisfies: **front >= t - 3000**. At this point, there are no expired pings left in the queue.
7. At last, we return the queue size, Now the queue contains **only the pings that occurred within the last 3000 milliseconds**. Therefore, we don't need to count them separately—the **size of the queue is directly the answer**.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
#include <queue>
using namespace std;

class RecentCounter {
private:
    queue<int> q;

public:
    RecentCounter() {
        // Initializes empty queue
    }
    
    int ping(int t) {
        // Step 1: Add new ping to the back of the queue
        q.push(t);
        
        // Step 2: Remove any pings from the front that are too old
        while (!q.empty() && q.front() < t - 3000) {
            q.pop();
        }
        
        // Step 3: The queue now only holds valid pings. Return its size.
        return q.size();
    }
};
```

### index.java Implementation

```index.java
import java.util.LinkedList;
import java.util.Queue;

class RecentCounter {
    private Queue<Integer> q;

    public RecentCounter() {
        q = new LinkedList<>();
    }
    
    public int ping(int t) {
        // Step 1: Add new ping to the back of the queue
        q.add(t);
        
        // Step 2: Remove any pings from the front that are too old
        while (!q.isEmpty() && q.peek() < t - 3000) {
            q.poll();
        }
        
        // Step 3: The queue now only holds valid pings. Return its size.
        return q.size();
    }
}
```

### index.python Implementation

```index.python
from collections import deque

class RecentCounter:
    def __init__(self):
        # We use deque (double-ended queue) for fast pops from the front
        self.q = deque()

    def ping(self, t: int) -> int:
        # Step 1: Add new ping to the back of the queue
        self.q.append(t)
        
        # Step 2: Remove any pings from the front that are too old
        while self.q and self.q[0] < t - 3000:
            self.q.popleft()
            
        # Step 3: The queue now only holds valid pings. Return its size.
        return len(self.q)
```

### Complexity Analysis

#### Time Complexity: O(1)

- Each ping is **added to the queue exactly once**.
- Each ping can be **removed from the queue at most once**.
- Although the **while **loop may run multiple times in a single call, those removals are spread across **multiple ping calls**.
- Therefore, the total number of queue operations across all calls is **linear** in the number of pings.
- So, the **amortized time complexity** of each **ping **call is **O(1)**.

#### Space Complexity: O(W)

Where **W **is the maximum number of pings that can happen within a 3000-millisecond window.

- The queue stores **only pings from the last 3000 milliseconds**.
- Older pings are **removed automatically** from the front of the queue.
- If we receive **1 ping every millisecond**, the queue can contain at most **3000 pings**.
- Therefore, the queue size **does not grow with the total number of pings**.
- Even after millions of pings, the queue holds only the recent **3000 milliseconds of data**.
- Hence, the **space complexity is O(1)** because the maximum queue size is bounded by a fixed time window.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/recent-counter)*
