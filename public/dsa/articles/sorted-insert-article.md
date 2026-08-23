# Sorted Insert

> **Slug:** `sorted-insert-article`  
> **Published:** 2026-08-22T14:46:48.869Z  
> **Updated:** 2026-08-22T14:46:48.874Z  
> **Keywords:** Sorted Insert, Stack, Sorted  
> **Cover Image:** ![Sorted Insert](https://cdn.codehelp.in/media/articles/1787401157160-28597bf4-8.png)

**Description:** Learn how to insert an element into a sorted stack, with a clear approach, example, and time and space complexity analysis.

---

## Problem Statement

You are given a stack of integers that is sorted in ascending order, with the smallest element at the top. Your task is to write a function that inserts a given integer **x** into the stack while maintaining its sorted order.

There is a critical constraint: you are **not allowed to use any loops** (like **for **or **while**). You must solve this problem using only the standard stack operations (**push, pop, peek, isEmpty**) and **recursion**.

> [!NOTE]
> **INFO**
> Example  1
> 
> **Input:** stack = [5,4,2,1], x = 3
> 
> **Output:** 1 2 3 4 5
> 
> **Explanation:** Insert 3 into the sorted stack.

> [!NOTE]
> **INFO**
> Example  2
> 
> **Input:** stack = [10,8,4], x = 9
> 
> **Output:** 4 8 9 10
> 
> **Explanation:** Insert 9 into the sorted stack.

> [!NOTE]
> **INFO**
> Example  3
> 
> **Input:** stack = [5,3,1], x = 0
> 
> **Output:** 0 1 3 5
> 
> **Explanation:** Insert 0 into the sorted stack.

## Constraints

- 1 <= nums.length <= 100
- 0 <= nums[i] <= 1000

## Brute-Force Approach

### Intuition

The most straightforward way to solve this Before we worry about the "no loops" constraint, let's think about the simplest way to solve this.

Since a stack only lets us access the top element, the idea is straightforward: **use a temporary stack to hold elements while we search for the right spot.**

We keep popping elements from the original stack and pushing them onto the temporary stack, as long as the top of the original stack is **smaller than** the value we want to insert. Once we find the right position (the top of the original stack is greater than or equal to our value, or the stack is empty), we push our value. Then, we move everything back from the temporary stack to the original stack.

Think of it like moving books from one pile to another. You pick books off the main pile into a side pile until you find where the new book should go, place it, and then move all the side-pile books back.

### Algorithm

1. First, create a temporary stack to hold the elements that need to be moved while finding the correct position for **x**.
2. Next, compare **x** with the top element of the original stack. While the original stack is not empty and its top element is smaller than **x**, pop that element and push it onto the temporary stack. Continue this process until the correct position for **x** is reached.
3. Once the correct position is found, push **x** onto the original stack. Finally, move all elements from the temporary stack back to the original stack in the same order.
4. After these steps, the stack remains sorted with **x** inserted at its correct position.

## Code

### index.cpp Implementation

```index.cpp
#include <stack>
using namespace std;

void sortedInsertBrute(stack<int>& st, int x) {
    stack<int> temp;

    // Step 1: Move elements smaller than x to temp stack
    while (!st.empty() && st.top() < x) {
        temp.push(st.top());
        st.pop();
    }

    // Step 2: Insert x at the correct position
    st.push(x);

    // Step 3: Move everything back from temp stack
    while (!temp.empty()) {
        st.push(temp.top());
        temp.pop();
    }
}
```

### index.java Implementation

```index.java
import java.util.Stack;

class Solution {
    public void sortedInsertBrute(Stack<Integer> st, int x) {
        Stack<Integer> temp = new Stack<>();

        // Step 1: Move elements smaller than x to temp stack
        while (!st.isEmpty() && st.peek() < x) {
            temp.push(st.pop());
        }

        // Step 2: Insert x at the correct position
        st.push(x);

        // Step 3: Move everything back from temp stack
        while (!temp.isEmpty()) {
            st.push(temp.pop());
        }
    }
}
```

### index.py Implementation

```index.py
def sorted_insert_brute(st: list, x: int) -> None:
    temp = []

    # Step 1: Move elements smaller than x to temp stack
    while st and st[-1] < x:
        temp.append(st.pop())

    # Step 2: Insert x at the correct position
    st.append(x)

    # Step 3: Move everything back from temp stack
    while temp:
        st.append(temp.pop())
```

### Complexity Analysis

#### Time Complexity: O(N)

- In the worst case (inserting at the bottom), we pop all **n** elements into the temporary stack and push them all back.
- That's **n** pops + 1 push + **n** pushes = 2n + 1 operations.
- So the time complexity is ***O(N)***.

#### Space Complexity: O(N)

- The temporary stack can hold up to **n** elements in the worst case (when we insert at the very bottom).
- So the space complexity is ***O(N).***

## Optimal Approach

### Intuition

The brute-force approach uses a temporary stack to store elements while finding the correct position for **x**, but the problem requires us to solve it without using loops. The key idea is to use **recursion as a temporary stack**. When we remove the top element, we store it in a local variable and recursively insert **x** into the remaining stack. Once the recursive call finishes, we push the stored element back onto the stack. The recursion goes deeper until the correct position for **x** is found, when the stack is empty or its top element is greater than or equal to **x**. As the recursive calls return, the previously removed elements are automatically restored in their original order.

### Algorithm

1. First, check the base condition. If the stack is empty or its top element is greater than or equal to **x**, push **x** onto the stack and stop the recursion because the correct position has been found.
2. If the top element is smaller than **x**, **x** needs to be inserted deeper in the stack. Pop the top element and store it in a local variable. Then, recursively call the same function to insert **x **into the remaining stack.
3. Once the recursive call returns, **x** has been placed at its correct position. Push the previously saved element back onto the stack. Continue this process as the recursive calls unwind until all removed elements have been restored.

### Dry Run

//img

### Code

### index.cpp Implementation

```index.cpp
#include <stack>
using namespace std;

void sortedInsert(stack<int>& st, int x) {
    // Base case: found the right spot
    if (st.empty() || st.top() >= x) {
        st.push(x);
        return;
    }

    // Recursive case: pop the top, go deeper, then push it back
    int top = st.top();
    st.pop();

    sortedInsert(st, x);

    st.push(top);
}
```

### index.java Implementation

```index.java
import java.util.Stack;

class Solution {
    public void sortedInsert(Stack<Integer> st, int x) {
        // Base case: found the right spot
        if (st.isEmpty() || st.peek() >= x) {
            st.push(x);
            return;
        }

        // Recursive case: pop the top, go deeper, then push it back
        int top = st.pop();

        sortedInsert(st, x);

        st.push(top);
    }
}
```

### index.python Implementation

```index.python
def sorted_insert(st: list, x: int) -> None:
    # Base case: found the right spot
    if not st or st[-1] >= x:
        st.append(x)
        return

    # Recursive case: pop the top, go deeper, then push it back
    top = st.pop()

    sorted_insert(st, x)

    st.append(top)
```

### Complexity Analysis

#### Time Complexity: O(N)

- In the worst case, we recurse through all **n** elements before finding the right spot (e.g., inserting at the very bottom).
- Each recursive call does O(1) work (one pop, one push).
- So the total time is ***O(N)***.

#### Space Complexity: O(N )

- We don't use any extra data structure, but the **recursion call stack** uses space.
- In the worst case, we go **n** levels deep (one level per element in the stack).
- Each level stores one local variable (the popped element).
- So the call stack uses ***O(N)***.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/sorted-insert-article)*
