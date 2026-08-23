# Stock Span Problem

> **Slug:** `stock-span-problem`  
> **Published:** 2026-08-22T17:07:50.919Z  
> **Updated:** 2026-08-22T17:07:50.923Z  
> **Keywords:** Stock Span Problem, Stacks  
> **Cover Image:** ![Stock Span Problem](https://cdn.codehelp.in/media/Stock Span Problem.png)

**Description:** Learn how to solve the Stock Span Problem using stacks, with clear examples, step-by-step logic, and time and space complexity analysis.

---

## Problem Statement

The Stock Span Problem is a well-known financial problem that involves calculating the span of stock prices based on daily price data. The span of a stock's price on a given day is defined as the maximum number of consecutive days (including the current day) leading up to the current day for which the stock price has been less than or equal to the price on that day.

To solve this, you need to create a data structure StockSpanner that efficiently computes the span for each day's stock price when queried.

#### Methods:

- StockSpanner(): Initializes the StockSpanner object.
- int next(int price): Takes today's stock price as input and returns the span for this price.

> [!NOTE]
> **INFO**
> Example 1
> Input:  prices = [100, 80, 60, 70, 60, 75, 85]
> 
> Output: [1, 1, 1, 2, 1, 4, 6]
> 
> **Explanation:** Each day has a calculated span based on previous days with lower or equal prices.

> [!NOTE]
> **INFO**
> Example 2
> Input: prices = [90, 85, 70, 80, 75, 85, 100]
> 
> Output: [1, 1, 1, 2, 1, 5, 7]
> 
> **Explanation:** Span values calculated based on prices starting from today and going backwards.

## Optimal Approach

### Intuition

A straightforward approach would be to look backward from the current day and count how many consecutive prices are less than or equal to the current price. However, doing this for every query would be inefficient.

Instead, we use a monotonic stack to store previously seen stock prices along with their spans.

For each new price:

- If the prices on top of the stack are less than or equal to the current price, they will always be included in the current span.
- Therefore, we can remove them from the stack and directly add their stored spans to the current span.
- This allows us to skip multiple previous days at once instead of checking them one by one.

The stack stores pairs of (price, span), where:

- price represents a stock price.
- span represents the span already calculated for that price.

This makes the computation very efficient because each price is pushed and popped at most once.

### Algorithm

**Step 1:** Create an empty stack that stores pairs of (price, span).

**Step 2: **For each call to next(price), initialize span as 1 because the current day is always included in its own span.

**Step 3:** While the stack is not empty and the price at the top of the stack is less than or equal to the current price:

- Add the stored span of the top element to the current span.
- Remove the top element from the stack.

**Step 4: **After processing all smaller or equal prices, push the pair (price, span) onto the stack.

**Step 5: **Return the calculated span.

### Code

### C++ Implementation

```cpp
class StockSpanner {
public:
    stack<pair<int, int>> st;

    StockSpanner() {
        // Stack is initialized empty
    }
    
    int next(int price) {
        int ans = 1;
        
        // Aggregate spans while prices on the stack are <= current price
        while(!st.empty() && st.top().first <= price) {
            ans += st.top().second;
            st.pop();
        }

        // Push the current price and calculated span
        st.push({price, ans});
        return ans;
    }
};
```

### Java Implementation

```java
class StockSpanner {
    Stack<int[]> st;

    public StockSpanner() {
        st = new Stack<>();
    }
    
    public int next(int price) {
        int ans = 1;

        // Aggregate spans while prices on the stack are <= current price
        while (!st.isEmpty() && st.peek()[0] <= price) {
            ans += st.pop()[1];
        }
        
        // Push the current price and calculated span
        st.push(new int[]{price, ans});
        return ans;
    }
}
```

### Python Implementation

```python
class StockSpanner:

    def __init__(self):
        self.st = []

    def next(self, price: int) -> int:
        span = 1

        # Aggregate spans while prices on the stack are <= current price
        while self.st and self.st[-1][0] <= price:
            span += self.st.pop()[1]

        # Push the current price and calculated span
        self.st.append((price, span))

        return span
```

### Complexity Analysis

#### Time Complexity: O(1) Amortized

- Although a single call to next() may remove multiple elements from the stack, each stock price is pushed onto the stack once and popped at most once.
- Therefore, across all operations, the total work is linear, giving an amortized O(1) time complexity per query.

#### Space Complexity: O(n)

- In the worst case, if stock prices keep decreasing, all prices and their spans will remain in the stack**.**
- Overall it takes  O(n) extra space.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/stock-span-problem)*
