# k Queues in an Array

> **Slug:** `k-queues-in-an-array`  
> **Published:** 2026-08-10T12:14:07.356Z  
> **Updated:** 2026-08-10T12:14:07.364Z  
> **Keywords:** K Queues in an Array, Queues  
> **Cover Image:** ![k Queues in an Array](6a79c07b4ec8f3318bcef6e7)

**Description:** Learn how to implement K Queues in an Array, with a clear explanation of multiple queue management, step-by-step examples, and complexity analysis.


---

## Problem Statement

Your task is to design a data structure that can manage multiple queues efficiently within a single shared array. This allows for operations on several queues without interference, by utilizing the array space effectively.

Given **k** queues and a shared array of total size **N**, your implementation should support the following operations:

1. **enqueue(int queueNum, int value)**: Insert the **value **into the queue identified by **queueNum**.
2. **dequeue(int queueNum)**: Remove and return the front element from the specified queue. If the queue is empty, return **-1**.
3. **isEmpty(int queueNum)**: Check if the specified queue is empty. Return **true **if it is empty, otherwise return **false**.
4. **front(int queueNum)**: Retrieve the front element from the specified queue. If the queue is empty, return **-1**.

> [!NOTE]
> **INFO**
> Example  1
> 
> **Input:** k = 3, N = 10, operations = [enqueue(1, 5), enqueue(2, 10), enqueue(3, 15), dequeue(1), front(2), isEmpty(3), dequeue(3), front(3)]
> 
> **Output:** [5, 10, false, 15, -1]
> 
> **Explanation:** Each operation is applied sequentially to get results.

> [!NOTE]
> **INFO**
> Example  2
> 
> **Input:** k = 3, N = 6, operations = [enqueue(1, 7), enqueue(1, 8), enqueue(2, 10), enqueue(3, 20), front(1), front(3), dequeue(2)]
> 
> **Output:** [7, 20, 10]
> 
> **Explanation:** Queues manage data separately in the shared array.

> [!NOTE]
> **INFO**
> Example  3
> 
> **Input:** k = 2, N = 5, operations = [enqueue(1, 1), enqueue(1, 2), enqueue(2, 3), dequeue(1), dequeue(1), dequeue(1), isEmpty(1), isEmpty(2)]
> 
> **Output:** [1, 2, -1, true, false]
> 
> **Explanation:** Operations yield the results according to queue management.

## Constraints

- 1 <= **nums.length** <= 100
- 0 <= **nums[i] **<= 1000

## Brute-Force Approach

### Intuition

The most straightforward way to solve this is to just chop the array into **k** equal pieces. So, if we have an array of size 30 and 3 queues, Queue 0 gets indices 0 to 9, Queue 1 gets 10 to 19, and so on. We just need to keep track of the **front **and **rear **for each queue within its specific boundaries.

While it's super easy to code, the huge downside is space wastage. One queue might fill up its chunk completely while the rest of the array sits completely empty, leading to unnecessary overflow errors.

### Algorithm

1. Firstly , we create three arrays of size **k **as **front**, **rear**, and **size **to track the state of each queue.
2. Next, we check for any queue **i**, its valid indices are from **i * (N/k)** up to **(i+1) * (N/k) - 1**.
3. After that we check for enqueue(), check** **if the queue's **rear **has reached its boundary. If not, increment **rear **and place the item in the array.
4. Furthermore, we check for** dequeue(), **if the queue is empty. If not, take the item at **front **and increment **front **.
*(Note: This can also be implemented using circular queues within the fixed chunks for better space use within the chunk, but it still wastes cross-queue space).*

## Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <vector>
using namespace std;

class KQueues {
private:
    int n, k;
    vector<int> arr;
    vector<int> frontArr;
    vector<int> rearArr;

public:
    KQueues(int n, int k) {
        this->n = n;
        this->k = k;
        arr.resize(n);
        frontArr.resize(k);
        rearArr.resize(k);
        
        // Divide the array into k equal slots
        int slotSize = n / k;
        for (int i = 0; i < k; i++) {
            frontArr[i] = i * slotSize;
            rearArr[i] = i * slotSize - 1;
        }
    }

    void enqueue(int queueNum, int value) {
        int slotSize = n / k;
        // Check if the rear has reached the end of its allocated slot
        if (rearArr[queueNum] == (queueNum + 1) * slotSize - 1) {
            cout << "Queue Overflow!" << endl;
            return;
        }
        
        rearArr[queueNum]++;
        arr[rearArr[queueNum]] = value;
    }

    int dequeue(int queueNum) {
        // If front has crossed rear, the queue is empty
        if (frontArr[queueNum] > rearArr[queueNum]) {
            return -1;
        }
        
        int value = arr[frontArr[queueNum]];
        frontArr[queueNum]++;
        
        // Reset pointers if the queue becomes empty to reuse space
        if (frontArr[queueNum] > rearArr[queueNum]) {
            int slotSize = n / k;
            frontArr[queueNum] = queueNum * slotSize;
            rearArr[queueNum] = queueNum * slotSize - 1;
        }
        
        return value;
    }

    bool isEmpty(int queueNum) {
        return frontArr[queueNum] > rearArr[queueNum];
    }

    int front(int queueNum) {
        if (isEmpty(queueNum)) {
            return -1;
        }
        return arr[frontArr[queueNum]];
    }
};
```

### index.java Implementation

```index.java
class KQueues {
    private int n;
    private int k;
    private int[] arr;
    private int[] frontArr;
    private int[] rearArr;

    public KQueues(int n, int k) {
        this.n = n;
        this.k = k;
        this.arr = new int[n];
        this.frontArr = new int[k];
        this.rearArr = new int[k];

        int slotSize = n / k;
        for (int i = 0; i < k; i++) {
            frontArr[i] = i * slotSize;
            rearArr[i] = i * slotSize - 1;
        }
    }

    public void enqueue(int queueNum, int value) {
        int slotSize = n / k;
        if (rearArr[queueNum] == (queueNum + 1) * slotSize - 1) {
            System.out.println("Queue Overflow!");
            return;
        }

        rearArr[queueNum]++;
        arr[rearArr[queueNum]] = value;
    }

    public int dequeue(int queueNum) {
        if (frontArr[queueNum] > rearArr[queueNum]) {
            return -1;
        }

        int value = arr[frontArr[queueNum]];
        frontArr[queueNum]++;

        // Reset pointers if empty
        if (frontArr[queueNum] > rearArr[queueNum]) {
            int slotSize = n / k;
            frontArr[queueNum] = queueNum * slotSize;
            rearArr[queueNum] = queueNum * slotSize - 1;
        }

        return value;
    }

    public boolean isEmpty(int queueNum) {
        return frontArr[queueNum] > rearArr[queueNum];
    }

    public int front(int queueNum) {
        if (isEmpty(queueNum)) {
            return -1;
        }
        return arr[frontArr[queueNum]];
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

#### Time Complexity: O(1)

- **enqueue: **Uses simple calculations to find the correct array position and inserts the element directly → **O(1)**.
- **dequeue:** Calculates the position and removes the element directly without shifting → **O(1)**.
- **isEmpty**: Checks a simple condition to determine whether the queue is empty → **O(1)**.
- **front**: Directly accesses the front element using its index → **O(1)**.
- No loops or element shifting are required in any operation.
- Therefore, **all queue operations take constant time: O(1)**.

#### Space Complexity: O(N)

- We use **one large array of size N** to store all the elements.
- We use **two additional arrays of size k** to store the **front and rear pointers**.
- Therefore, the total space required is **O(N + k)**.
- Since **N** is much larger than **k**, the dominant factor is **N**.
- Hence, the overall **space complexity is O(N)**.
- However, this approach can lead to **wasted space** because each queue has a fixed-size chunk.
- A queue may become **full/overflow** even when other chunks still have unused spaces.

## Optimal Approach

### Intuition

To solve the problem of wasted space, we need a way to let any of the **k** queues use any available free spot in our array **N**. This means we can't restrict queues to fixed blocks of memory. Instead, we have to dynamically link the elements of a queue together, much like a Linked List, but strictly using array indices as our "pointers."

To achieve this, we need to keep track of two major things:

1. Which array indices belong to which queue, and in what order?
2. Where are the remaining empty spots in the array?

We can manage this elegantly using three auxiliary arrays:

- **front[k]**: Stores the starting index for each of the **k** queues.
- **rear[k]**: Stores the ending index for each of the **k** queues, allowing us to easily append new items.
- **next[N]**: This array is the core of the logic and does double duty:
- - When an index **i** is empty, **next[i]** points to the *next available free spot* in the array.
  - When an index **i** is occupied by a queue, **next[i]** points to the *index of the next element* in that specific queue. We also maintain a single integer **freeSpot **to track the very first available empty index in our array. By linking indices together, we ensure absolute 100% space utilization.

### Algorithm

1. We initialize both front and rear arrays with -1 to indicate that all k queues are initially empty. The next array is then used to maintain a linked list of all the free positions in the main array.
2. For every index i, we set **next[i] = i + 1** so that all available positions are connected sequentially, and the last position is set to -1 because there are no more free spaces after it. Finally, freeSpot is set to 0, pointing to the first available position in the array.
3. enqueue(queueNum, value), now, to insert an element, we first check whether freeSpot == -1, which means the array is full and no space is available. Otherwise, we take the position pointed to by freeSpot and store it in index. We then move freeSpot to the next available position using freeSpot = next[index] and store the new value in arr[index]. If the queue is empty, we set front[queueNum] = index; otherwise, we connect the previous rear element to the new element using next[rear[queueNum]] = index. The new element is then marked as the last element by setting next[index] = -1, and rear[queueNum] is updated to index.
4. dequeue(queueNum), To remove an element, we check whether front[queueNum] == -1, which means the queue is empty and there is nothing to remove. Otherwise, we store the index of the front element in index and move the queue's front pointer to the next element using front[queueNum] = next[index]. Since the removed position is now available, we add it back to the free-space list by setting next[index] = freeSpot and then updating freeSpot = index. The value stored at arr[index] is then returned.
5. front(queueNum), To access the front element without removing it, we check whether front[queueNum] == -1. If the queue is empty, we return -1; otherwise, we use the index stored in front[queueNum] to return the corresponding value from the main array using arr[front[queueNum]].

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <vector>
using namespace std;

class KQueues {
private:
    int n;
    int k;
    int freeSpot;
    vector<int> arr;
    vector<int> frontArr;
    vector<int> rearArr;
    vector<int> nextArr;

public:
    KQueues(int n, int k) {
        this.n = n;
        this.k = k;
        freeSpot = 0;
        
        arr.resize(n);
        nextArr.resize(n);
        frontArr.resize(k, -1);
        rearArr.resize(k, -1);

        // Initialize the next array to point to the next free slot
        for (int i = 0; i < n; i++) {
            nextArr[i] = i + 1;
        }
        // The last slot has no next free slot
        nextArr[n - 1] = -1;
    }

    void enqueue(int queueNum, int value) {
        // If no free spots are left, the array is full
        if (freeSpot == -1) {
            cout << "Queue Overflow!" << endl;
            return;
        }

        // 1. Grab the first available free spot
        int index = freeSpot;

        // 2. Update the freeSpot pointer to the next available spot
        freeSpot = nextArr[index];

        // 3. Insert our actual value into the array
        arr[index] = value;

        // 4. Link the new element to the specific queue
        if (frontArr[queueNum] == -1) {
            // It's the very first element in this queue
            frontArr[queueNum] = index;
        } else {
            // Link it to the end of the existing queue
            nextArr[rearArr[queueNum]] = index;
        }

        // 5. Update the next pointer and the rear of the queue
        nextArr[index] = -1; // -1 means it's the end of this queue
        rearArr[queueNum] = index;
    }

    int dequeue(int queueNum) {
        // If the front is -1, the queue is completely empty
        if (frontArr[queueNum] == -1) {
            return -1;
        }

        // 1. Find the index we need to pop
        int index = frontArr[queueNum];

        // 2. Move the front pointer of the queue to the next element
        frontArr[queueNum] = nextArr[index];

        // 3. Give this spot back to the free pool!
        nextArr[index] = freeSpot;
        freeSpot = index;

        // 4. Return the popped value
        return arr[index];
    }

    bool isEmpty(int queueNum) {
        return frontArr[queueNum] == -1;
    }

    int front(int queueNum) {
        if (frontArr[queueNum] == -1) {
            return -1;
        }
        return arr[frontArr[queueNum]];
    }
};
```

### index.java Implementation

```index.java
class KQueues {
    private int n;
    private int k;
    private int freeSpot;
    private int[] arr;
    private int[] frontArr;
    private int[] rearArr;
    private int[] nextArr;

    public KQueues(int n, int k) {
        this.n = n;
        this.k = k;
        this.freeSpot = 0;

        arr = new int[n];
        nextArr = new int[n];
        frontArr = new int[k];
        rearArr = new int[k];

        // Initially, all queues are empty
        for (int i = 0; i < k; i++) {
            frontArr[i] = -1;
            rearArr[i] = -1;
        }

        // Link all free spots together
        for (int i = 0; i < n; i++) {
            nextArr[i] = i + 1;
        }
        nextArr[n - 1] = -1;
    }

    public void enqueue(int queueNum, int value) {
        if (freeSpot == -1) {
            System.out.println("Queue Overflow!");
            return;
        }

        int index = freeSpot;
        freeSpot = nextArr[index];
        arr[index] = value;

        if (frontArr[queueNum] == -1) {
            frontArr[queueNum] = index;
        } else {
            nextArr[rearArr[queueNum]] = index;
        }

        nextArr[index] = -1;
        rearArr[queueNum] = index;
    }

    public int dequeue(int queueNum) {
        if (frontArr[queueNum] == -1) {
            return -1;
        }

        int index = frontArr[queueNum];
        frontArr[queueNum] = nextArr[index];

        // Return the slot back to the free pool
        nextArr[index] = freeSpot;
        freeSpot = index;

        return arr[index];
    }

    public boolean isEmpty(int queueNum) {
        return frontArr[queueNum] == -1;
    }

    public int front(int queueNum) {
        if (frontArr[queueNum] == -1) {
            return -1;
        }
        return arr[frontArr[queueNum]];
    }
}
```

### index.python Implementation

```index.python
class KQueues:
    def __init__(self, n: int, k: int):
        self.n = n
        self.k = k
        self.free_spot = 0
        
        self.arr = [0] * n
        self.front_arr = [-1] * k
        self.rear_arr = [-1] * k
        
        # Link all spots together initially
        self.next_arr = [i + 1 for i in range(n)]
        self.next_arr[n - 1] = -1

    def enqueue(self, queue_num: int, value: int) -> None:
        if self.free_spot == -1:
            print("Queue Overflow!")
            return
            
        # 1. Grab first free spot
        index = self.free_spot
        
        # 2. Update free spot pointer
        self.free_spot = self.next_arr[index]
        
        # 3. Insert the value
        self.arr[index] = value
        
        # 4. Link it to the specific queue
        if self.front_arr[queue_num] == -1:
            self.front_arr[queue_num] = index
        else:
            self.next_arr[self.rear_arr[queue_num]] = index
            
        # 5. Mark as end of queue
        self.next_arr[index] = -1
        self.rear_arr[queue_num] = index

    def dequeue(self, queue_num: int) -> int:
        if self.front_arr[queue_num] == -1:
            return -1
            
        # Find index to pop
        index = self.front_arr[queue_num]
        
        # Move front forward
        self.front_arr[queue_num] = self.next_arr[index]
        
        # Add the old index back to free pool
        self.next_arr[index] = self.free_spot
        self.free_spot = index
        
        return self.arr[index]

    def is_empty(self, queue_num: int) -> bool:
        return self.front_arr[queue_num] == -1

    def front(self, queue_num: int) -> int:
        if self.front_arr[queue_num] == -1:
            return -1
        return self.arr[self.front_arr[queue_num]]
```

### Complexity Analysis

#### Time Complexity: O(1)

- **enqueue():** **O(1)**. All operations are simple array lookups and updates. No shifting required.
- **dequeue(), isEmpty(), front()**: **O(1)**.

#### Space Complexity: O(N + K)

- We use arrays of size **N** for both **arr **and **next **because they store the actual elements and maintain the links between available positions and queue elements.
- We use arrays of size **k** for **front **and **rear **because we need to store the front and rear positions of each of the **k** queues.
- This is an efficient use of space because all queues share the same **N**-sized array instead of having separate fixed-size spaces.
- As long as there is an empty position in the **N**-sized array, **any queue can use that position**, regardless of which queue it belongs to.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/k-queues-in-an-array)*
