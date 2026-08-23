# Implement stack using queue

> **Slug:** `implement-stack-using-queue`  
> **Published:** 2026-08-09T12:40:54.986Z  
> **Updated:** 2026-08-09T12:40:54.993Z  
> **Keywords:** Implement Stack using queue, stack, queues  
> **Cover Image:** ![Implement stack using queue](https://cdn.codehelp.in/media/articles/1786276400296-ab88af03-2.png)

**Description:** Learn how to implement a stack using a queue, with a  explanation, step-by-step examples, and time and space complexity analysis.

---

## Problem Statement

In this problem, you need to design a stack using two queues. A stack is a data structure where elements are accessed in a Last-In-First-Out (LIFO) order. You must implement the following operations using queue operations:

- **push(x)**: Insert the element ***x*** onto the stack.
- **pop()**: Remove and return the element at the top of the stack.
- **top()**: Return the top element of the stack without removing it.
- **empty()**: Return ***true*** if the stack is empty; otherwise, return ***false***.

The operations you can perform on a queue include enqueueing (adding an element to the back), dequeueing (removing an element from the front), checking if the queue is empty, and determining the queue's size.

> [!NOTE]
> **INFO**
> Example 1
> 
> Input: operations = `['push', 'push', 'top', 'pop', 'empty']`, values =`[1, 2, '', '', '']`
> 
> Output:`['', '', '2', '2', 'false']`
> 
> `Explanation: `Elements are pushed in order. The last element is peeked and then popped.

> [!NOTE]
> **INFO**
> Example 2
> 
> Input: operations = ['push', 'pop', 'empty'], values = [3, '', '']
> 
> Output: ['', '3', 'true']
> 
> `Explanation:` Single element is pushed and then popped, making the stack empty.

> [!NOTE]
> **INFO**
> Example  3
> 
> Input: operations = ['push', 'push', 'push', 'pop', 'top'], values = [10, 20, 30, '', '']
> 
> Output:  ['', '', '', '30', '20']
> 
> `Explanation:` Elements are pushed in LIFO order, then the last element is popped and top is checked.

## Constraints

- 1  <=** nums.length** <= 100
- 0 <= **nums[i] **<= 100

## Brute-Force Approach

### Intuition

We can simulate a stack using two queues, **q1** and **q2**.

**q1 ** will always hold the stack elements in LIFO order (with the top of the stack at the front of **q1**).

When a new element **x ** is pushed:

1. Enqueue **x ** into an empty helper queue **q2**.
2. Move all existing elements from **q1 ** to **q2** one by one.
3. Swap the names of **q1 **and **q2**.

This ensures that the latest element **x**, is always sitting at the front of **q1, **making **pop** and **top** operations instant **O(1) **operations.

### Approach

1. Firstly, we maintain two queues, **q1** which is the main queue and **q2** which is a temporary helper queue. Now we perform the **push(x)** operation by first enqueuing **x** into **q2**. Then we move every element currently in **q1** into **q2**, one at a time, so they end up sitting behind **x**. After that, we swap **q1** and **q2**, so **q1** becomes the main queue again, now with **x** sitting at its front. This whole **push** operation takes O(N) time, since it has to move every existing element.
2. For the **pop()** operation, since the top of the stack is always sitting at the front of **q1**, we simply dequeue and return the front element of **q1**. This takes O(1) time.
3. For the **top()** operation, we just return the front element of **q1** without removing it, which also takes O(1) time.
4. For the **empty()** operation, we return true if **q1** is empty, otherwise we return false. This takes **O(1)** time.

## Code

### index.cpp Implementation

```index.cpp
#include <queue>
using namespace std;

class MyStack {
private:
    queue<int> q1; // Main queue holding stack elements
    queue<int> q2; // Temporary helper queue

public:
    MyStack() {}

    // Push element x onto stack
    void push(int x) {
        // Step 1: Enqueue new element x into helper queue q2
        q2.push(x);

        // Step 2: Move all elements from q1 to q2 (behind x)
        while (!q1.empty()) {
            q2.push(q1.front());
            q1.pop();
        }

        // Step 3: Swap q1 and q2 so q1 has x at the front
        swap(q1, q2);
    }

    // Removes and returns top element
    int pop() {
        int topElement = q1.front();
        q1.pop();
        return topElement;
    }

    // Returns top element without removing
    int top() {
        return q1.front();
    }

    // Returns whether the stack is empty
    bool empty() {
        return q1.empty();
    }
};
```

### index.java Implementation

```index.java
import java.util.LinkedList;
import java.util.Queue;

class MyStack {
    private Queue<Integer> q1; // Main queue holding stack elements
    private Queue<Integer> q2; // Temporary helper queue

    public MyStack() {
        q1 = new LinkedList<>();
        q2 = new LinkedList<>();
    }

    // Push element x onto stack
    public void push(int x) {
        // Step 1: Enqueue new element x into helper queue q2
        q2.add(x);

        // Step 2: Move all elements from q1 to q2 (behind x)
        while (!q1.isEmpty()) {
            q2.add(q1.remove());
        }

        // Step 3: Swap q1 and q2
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
    }

    // Removes and returns top element
    public int pop() {
        return q1.remove();
    }

    // Returns top element without removing
    public int top() {
        return q1.peek();
    }

    // Returns whether the stack is empty
    public boolean empty() {
        return q1.isEmpty();
    }
}
```

### index.py Implementation

```index.py
from collections import deque

class MyStack:

    def __init__(self):
        self.q1 = deque()  # Main queue holding stack elements
        self.q2 = deque()  # Temporary helper queue

    def push(self, x: int) -> None:
        # Step 1: Enqueue new element x into helper queue q2
        self.q2.append(x)

        # Step 2: Move all elements from q1 to q2 (behind x)
        while self.q1:
            self.q2.append(self.q1.popleft())

        # Step 3: Swap q1 and q2
        self.q1, self.q2 = self.q2, self.q1

    def pop(self) -> int:
        # Removes and returns top element from front of q1
        return self.q1.popleft()

    def top(self) -> int:
        # Returns top element without removing
        return self.q1[0]

    def empty(self) -> bool:
        # Returns True if stack is empty
        return len(self.q1) == 0
```

### Complexity Analysis

#### Time Complexity

- **push(x): O(N), **where N is the current number of elements in the stack. We transfer N elements from q1 to q2 during every push.
- pop(): O(1), because the top element is always sitting at the front of q1.
- top(): O(1), because we simply read the front element of q1.
- empty(): O(1), because we check if q1 is empty.

#### Space Complexity: O(N)

- We store **N** elements total in the queues. The auxiliary space required is ***O(N)***.

## Optimal Approach

### Intuition

Instead of using two queues, we can make a **single queue behave like a stack** by rearranging its elements after every **push**.

When we push a new element **x **into the queue:

1. Add **x** to the rear of the queue.
2. Let the current queue size be **sz**.
3. Rotate the queue by dequeuing the first **sz -1** elements and enqueuing them back into the rear.
4. This brings the newly added element **x** to the **front** of the queue.

Now, the front of the queue always represents the **top of the stack**.

Therefore, **pop**, **top**, and **empty** can be performed directly using standard queue operations, while only the **push** operation requires rearranging the elements.

### Algorithm

- Firstly, we maintain a single queue **q**, there's no second helper queue needed this time. Now we perform the **push(x)**operation by first enqueuing **x** at the back of the queue, just like a normal queue insert. Then we note the queue's current size, **sz**, which includes the **x** we just added. We then rotate the queue **sz - 1** times, each rotation means dequeuing the front element and immediately enqueuing it back at the rear. After **sz - 1** rotations, every element that was ahead of **x** has cycled all the way around to sit behind it, so **x **ends up at the front. This **push** operation takes **O(N) **time because of the rotation.
- For the **pop()** operation, since the most recently pushed element is always kept at the front, we simply dequeue and return it — a plain O(1) queue removal.
- For the **top()** operation, we return the front element without removing it, which also takes O(1) time.
- For the **empty()** operation, we return true if the queue is empty, otherwise we return false. This takes O(1) time.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
#include <queue>

class MyStack {
public:
    std::queue<int> q;

    MyStack() {
    }

    void push(int x) {
        q.push(x);

        for (int i = 0; i < (int)q.size() - 1; ++i) {
            int top = q.front();
            q.pop();
            q.push(top);
        }
    }

    int pop() {
        int top = q.front();
        q.pop();
        return top;
    }

    int top() {
        return q.front();
    }

    bool empty() {
        return q.empty();
    }
};
```

### index.java Implementation

```index.java
import java.util.LinkedList;
import java.util.Queue;

class MyStack {

    private Queue<Integer> q;

    public MyStack() {
        q = new LinkedList<>();
    }

    public void push(int x) {
        q.add(x);

        int size = q.size();

        for (int i = 0; i < size - 1; i++) {
            q.add(q.remove());
        }
    }

    public int pop() {
        return q.remove();
    }

    public int top() {
        return q.peek();
    }

    public boolean empty() {
        return q.isEmpty();
    }
}
```

### index.python Implementation

```index.python
from collections import deque


class MyStack:

    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        self.q.append(x)

        size = len(self.q)

        for _ in range(size - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return len(self.q) == 0
```

### Complexity Analysis

#### Time Complexity

- push(x): O(N), where N is the number of elements in the queue. This is because we rotate the elements after every push operation.
- pop(): O(1), because we are removing an element from the front of the queue.
- top(): O(1), because we are returning the element from the front of the queue.
- empty(): O(1), because we are checking whether the queue is empty or not.

#### Space Complexity: O(N)

- The space complexity is **O(N)**, where N is the number of elements in the stack (queue).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/implement-stack-using-queue)*
