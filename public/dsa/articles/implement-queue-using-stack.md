# Implement Queue using Stack

> **Slug:** `implement-queue-using-stack`  
> **Published:** 2026-08-16T14:32:46.654Z  
> **Updated:** 2026-08-16T14:32:46.660Z  
> **Keywords:** Implement Queue using Stack, Queue, Stack, Implementation  
> **Cover Image:** ![Implement Queue using Stack](https://cdn.codehelp.in/media/articles/1786277387720-5a01240f-3.png)

**Description:** Learn how to implement a queue using stacks, with a clear explanation of FIFO behaviour, step-by-step examples, and time and space complexity.

---

## Problem Statement

In this problem, you are required to implement a **queue** using two **stacks**. A queue is a data structure that follows the First In First Out (FIFO) principle, ensuring that the first element added will be the first one to be removed.

You need to create a class ***MyQueue*** that correctly mimics the behavior of a queue using stack operations. The operations to be implemented include

- ***void push(int x)***: This method will add the element ***x*** to the back of the queue.
- ***int pop()***: This method will remove and return the front element of the queue.
- ***int peek()***: This method will return the front element of the queue without removing it.
- ***boolean empty()***: This method will check if the queue is empty and return ***true*** if it is, otherwise ***false***.

> [!NOTE]
> **INFO**
> Example  1
> 
> Input: operations = ['push', 'push', 'peek', 'pop', 'empty'], values = [1, 2, '', '', '']
> 
> Output:  ['', '', '1', '1', 'false']
> 
> `Explanation:` Elements are pushed in order and first element is peeked then popped.

> [!NOTE]
> **INFO**
> Example  2
> 
> Input: operations = ['push', 'pop', 'empty'], values = [3, '', '']
> 
> Output:  ['', '3', 'true']
> 
> `Explanation:`Single element is pushed and then popped, queue becomes empty.

> [!NOTE]
> **INFO**
> Example  3
> 
> Input: operations = ['push', 'push', 'push', 'pop', 'peek'], values = [10, 20, 30, '', '']
> 
> Output:   ['', '', '', '10', '20']
> 
> `Explanation:` Multiple elements pushed in order, then the first is popped, and the next is peeked.

## Constraints

- 1 <= **nums.length** <= 100
- 0 <= **nums[i] **<= 1000

## Brute-Force Approach

### Intuition

We think about this way, since we need our queue to give us the oldest element first, let's just make sure the oldest element is always sitting right at the top of our main stack (`stack1`). To do this, every time a new element comes in, we pour all the current items from `stack1` into `stack2`. Then, we put our new element at the very bottom of `stack1`. Finally, we bring everything back from `stack2`. It takes a bit of effort every time we push, but it makes popping super easy because the oldest element is right there on top.

### Algorithm

1. **push(x): **We need to make sure the new item goes to the bottom. So, we'll shift everything from **stack1 **over to **stack2**. Then we drop our new item **x** into **stack1.** After that, we just shift everything from **stack2** back on top of it.
2. **pop()**: because we did the hard work during the push, the oldest item is just sitting there at the top of **stack1**. We just pop it!
3. **peek(): **Same as pop, just look at the top element of `**stack1,** without removing it.
4. **empty():** The whole queue is empty if `stack1` has nothing inside.

## Code

### index.cpp Implementation

```index.cpp
class MyQueue {
    stack<int> s1, s2;
public:
    MyQueue() {}
    
    void push(int x) {
        while (!s1.empty()) {
            s2.push(s1.top());
            s1.pop();
        }
        s1.push(x);
        while (!s2.empty()) {
            s1.push(s2.top());
            s2.pop();
        }
    }
    
    int pop() {
        int val = s1.top();
        s1.pop();
        return val;
    }
    
    int peek() {
        return s1.top();
    }
    
    bool empty() {
        return s1.empty();
    }
};
```

### index.java Implementation

```index.java
import java.util.Stack;

class MyQueue {
    Stack<Integer> s1 = new Stack<>();
    Stack<Integer> s2 = new Stack<>();

    public MyQueue() {}

    public void push(int x) {
        while (!s1.isEmpty()) {
            s2.push(s1.pop());
        }
        s1.push(x);
        while (!s2.isEmpty()) {
            s1.push(s2.pop());
        }
    }

    public int pop() {
        return s1.pop();
    }

    public int peek() {
        return s1.peek();
    }

    public boolean empty() {
        return s1.isEmpty();
    }
}
```

### index.py Implementation

```index.py
class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []

    def push(self, x: int) -> None:
        while self.s1:
            self.s2.append(self.s1.pop())
        self.s1.append(x)
        while self.s2:
            self.s1.append(self.s2.pop())

    def pop(self) -> int:
        return self.s1.pop()

    def peek(self) -> int:
        return self.s1[-1]

    def empty(self) -> bool:
        return not self.s1
```

### Complexity Analysis

#### Time Complexity

- **Push(): O(N)** because we transfer elements back and forth between the two stacks.
- **Pop(), Peek(), Empty(): O(1), **because the oldest element is always at the top of the stack.

#### Space Complexity: O(N)

- Space complexity ***O(N)***, because we use an additional stack to hold up to **N** elements.

## Optimal Approach

### Intuition

Instead of doing all that heavy lifting during the **push** operation, why not make pushing fast and only do the extra work when we really have to? So, the basic idea as a stack works in LIFO (Last-In, First-Out), which is the exact opposite of what a queue does. If you pop elements from one stack and push them into a second stack, you completely reverse their order.

So, we can keep pushing items normally into our first stack. We only transfer them to the second stack when someone asks for a **pop() **or **peek()**, and our second stack happens to be empty. Once they are moved over to the second stack, the oldest item is conveniently sitting right on top.

### Algorithm

1. **push(): ** For this, things are  straightforward. We just throw the new element **x **directly into **stack1**. No moving things around.
2. **pop(): ** Now we need to give back the oldest element. First, we check if **stack2** has anything in it. If it does, great, we just pop the top item and return it. But if `**stack2** is completely empty, we take everything from **stack1 **and push it all into **stack2.** Once they are transferred, we can finally pop from **stack2**.
3. **peek(): **This is basically the same as pop. If **stack2** is empty, we do the transfer from **stack1**. Then, we just look at the top element of **stack2** instead of removing it.
4. **empty(): **The overall queue is only truly empty if **both** `**stack1 **and **stack2** are completely empty.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
#include <stack>
using namespace std;

class MyQueue {
public:
    stack<int> s1, s2;
    
    MyQueue() {}

    void push(int x) {
        s1.push(x);
    }

    int pop() {
        if (!s2.empty()) {
            int popValue = s2.top();
            s2.pop();
            return popValue;
        } else {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
            int popValue = s2.top();
            s2.pop();
            return popValue;
        }
    }

    int peek() {
        if (!s2.empty()) {
            return s2.top();
        } else {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
            return s2.top();
        }
    }

    bool empty() {
        return s1.empty() && s2.empty();
    }
};
```

### index.java Implementation

```index.java
import java.util.Stack;

class MyQueue {
    Stack<Integer> s1 = new Stack<>();
    Stack<Integer> s2 = new Stack<>();

    public MyQueue() {}

    public void push(int x) {
        s1.push(x);
    }

    public int pop() {
        if (!s2.isEmpty()) {
            return s2.pop();
        } else {
            while (!s1.isEmpty()) {
                s2.push(s1.pop());
            }
            return s2.pop();
        }
    }

    public int peek() {
        if (!s2.isEmpty()) {
            return s2.peek();
        } else {
            while (!s1.isEmpty()) {
                s2.push(s1.pop());
            }
            return s2.peek();
        }
    }

    public boolean empty() {
        return s1.isEmpty() && s2.isEmpty();
    }
}
```

### index.python Implementation

```index.python
class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []

    def push(self, x: int) -> None:
        self.s1.append(x)

    def pop(self) -> int:
        if self.s2:
            return self.s2.pop()
        else:
            while self.s1:
                self.s2.append(self.s1.pop())
            return self.s2.pop()

    def peek(self) -> int:
        if self.s2:
            return self.s2[-1]
        else:
            while self.s1:
                self.s2.append(self.s1.pop())
            return self.s2[-1]

    def empty(self) -> bool:
        return not self.s1 and not self.s2
```

### Complexity Analysis

#### Time Complexity

- **Push(): O(1)** because we are just pushing an element in **stack1.**
- **Pop() **and** Peek(): **Amortized** O(1)**, because there is a possibility that all the elements are already present in **stack2 **so we just need to pop and return the top element of `**stack2**.
- **Empty(): O(1), ** because we verify if both the stacks are empty to determine if the queue is empty.

#### Space Complexity: O(N)

- As space complexity is ***O(N), ***because each stack holds an element at most once, so there would be** N** elements (elements of **stack1** + elements of **stack2**).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/implement-queue-using-stack)*
