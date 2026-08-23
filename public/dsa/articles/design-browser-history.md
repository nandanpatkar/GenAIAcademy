# Design Browser History

> **Slug:** `design-browser-history`  
> **Published:** 2026-08-22T16:28:41.258Z  
> **Updated:** 2026-08-22T16:28:41.262Z  
> **Keywords:** Design Browser History, Stack  
> **Cover Image:** ![Design Browser History](https://cdn.codehelp.in/media/articles/1787415932093-1b1063db-Design_Browser__History.png)

**Description:** Learn how to design and implement Browser History using stacks, with a clear explanation, step-by-step examples, and complexity analysis.


---

## Problem Statement

Design a browser history system that allows you to manage and navigate through a history of URLs similar to web browser navigation. The system should be initialized with a homepage and should allow the user to visit new URLs, go back a specified number of steps, or move forward if forward history exists.

#### Implement the Following Methods:

- **BrowserHistory(string homepage)**: Initializes the browser history with the homepage URL.
- **void visit(string url)**: Visits a new URL from the current page. This action clears any forward history that exists beyond this point.
- **string back(int steps)**: Goes back in history by the specified number of steps. If the steps exceed the backward history, it moves only to the earliest page. Returns the URL of the current page after moving.
- **string forward(int steps)**: Moves forward in history by the specified number of steps, if possible. If the steps exceed the available forward history, it moves only as far as possible. Returns the URL of the current page after moving.

> [!NOTE]
> **INFO**
> **Example 1**
> Input:  homepage = 'leetcode.com', operations = ['visit(google.com)', 'visit(facebook.com)', 'visit(youtube.com)', 'back(1)', 'back(1)', 'forward(1)', 'visit(linkedin.com)', 'forward(2)', 'back(2)', 'back(7)']
> 
> Output: [null, null, null, facebook.com, google.com, facebook.com, null, linkedin.com, google.com, leetcode.com]
> 
> **Explanation:** Each command executes in sequence with back and forward steps adjusting history correctly.

> [!NOTE]
> **INFO**
> **Example 2**
> Input: homepage = 'a.com', operations = ['visit(b.com)', 'visit(c.com)', 'back(2)', 'visit(d.com)', 'back(1)', 'forward(2)']
> 
> Output:  [null, null, a.com, null, a.com, d.com]
> 
> **Explanation:** Back and visit commands handle forward history clearing.

## Constraints

- 1 <= **homepage.length** <= 20
- 1 <=** url.length** <= 20
- 1 <= **steps **<= 100

## Optimal Approach

### Intuition

Browser history naturally follows the **Last-In-First-Out (LIFO)** behavior of a stack. We maintain the current page along with two stacks: a **back stack** to store pages we can return to and a **forward stack** to store pages we can move forward to after going back. When we visit a new page, the current page is pushed into the back stack and the forward stack is cleared. When we move back, the current page is pushed into the forward stack and the top page from the back stack becomes the current page. Similarly, when we move forward, the current page is pushed into the back stack and the top page from the forward stack becomes the current page.

### Algorithm

1. Firstly, we initialize the **current page** with the given homepage because the browser starts from the homepage. We also create two empty stacks: **backStack **and **forwardStack**.
2. When we **visit a new page**, we first push the current page into the **backStack **because we should be able to return to it using the Back operation. Then, we update the current page with the new URL and clear the **forwardStack **because visiting a new page removes the previous forward history.
3. When the **Back** operation is performed, we move backward one page at a time. For each step, we push the current page into the **forwardStack**so that we can return to it later using Forward. Then, we take the top page from the **backStack **and make it the current page.
4. We continue the Back operation until the required number of steps is completed or the **backStack **becomes empty.
5. When the **Forward** operation is performed, we move forward one page at a time. For each step, we push the current page into the **backStack **because we should be able to return to it using Back. Then, we take the top page from the **forwardStack**and make it the current page.
6. We continue the Forward operation until the required number of steps is completed or the **forwardStack**becomes empty.
7. Finally, we return the **current page** after completing the requested navigation.

### Code

### index.cpp Implementation

```index.cpp
#include <iostream>
#include <string>
#include <stack>

using namespace std;

class BrowserHistory {
private:
    stack<string> backStack;
    stack<string> forwardStack;
    string curr;

public:
    BrowserHistory(string homepage) {
        curr = homepage;
    }
    
    void visit(string url) {
        // Push the current page to back history
        backStack.push(curr);
        // The new URL is now the current page
        curr = url;
        // Clear all forward history
        while (!forwardStack.empty()) {
            forwardStack.pop();
        }
    }
    
    string back(int steps) {
        // Move back as many steps as possible
        while (steps > 0 && !backStack.empty()) {
            forwardStack.push(curr);
            curr = backStack.top();
            backStack.pop();
            steps--;
        }
        return curr;
    }
    
    string forward(int steps) {
        // Move forward as many steps as possible
        while (steps > 0 && !forwardStack.empty()) {
            backStack.push(curr);
            curr = forwardStack.top();
            forwardStack.pop();
            steps--;
        }
        return curr;
    }
};
```

### index.java Implementation

```index.java
import java.util.Stack;

class BrowserHistory {
    private Stack<String> backStack;
    private Stack<String> forwardStack;
    private String curr;

    public BrowserHistory(String homepage) {
        backStack = new Stack<>();
        forwardStack = new Stack<>();
        curr = homepage;
    }
    
    public void visit(String url) {
        // Push the current page to back history
        backStack.push(curr);
        // The new URL is now the current page
        curr = url;
        // Clear all forward history
        forwardStack.clear();
    }
    
    public String back(int steps) {
        // Move back as many steps as possible
        while (steps > 0 && !backStack.isEmpty()) {
            forwardStack.push(curr);
            curr = backStack.pop();
            steps--;
        }
        return curr;
    }
    
    public String forward(int steps) {
        // Move forward as many steps as possible
        while (steps > 0 && !forwardStack.isEmpty()) {
            backStack.push(curr);
            curr = forwardStack.pop();
            steps--;
        }
        return curr;
    }
}
```

### index.py Implementation

```index.py
class BrowserHistory:
    def __init__(self, homepage: str):
        self.back_stack = []
        self.forward_stack = []
        self.curr = homepage

    def visit(self, url: str) -> None:
        # Push the current page to back history
        self.back_stack.append(self.curr)
        # The new URL is now the current page
        self.curr = url
        # Clear all forward history
        self.forward_stack.clear()

    def back(self, steps: int) -> str:
        # Move back as many steps as possible
        while steps > 0 and self.back_stack:
            self.forward_stack.append(self.curr)
            self.curr = self.back_stack.pop()
            steps -= 1
        return self.curr

    def forward(self, steps: int) -> str:
        # Move forward as many steps as possible
        while steps > 0 and self.forward_stack:
            self.back_stack.append(self.curr)
            self.curr = self.forward_stack.pop()
            steps -= 1
        return self.curr
```

### Complexity Analysis

#### Time Complexity: O(N)

- **visit(url)**: **O(1)** on average. In C++, clearing the stack takes O(K) where K is the size of the forward stack. In Java and Python, clearing lists/stacks is very fast, amortized to O(1).
- **back(steps)** / **forward(steps)**: **O(min(steps, N))**, where **N** is the number of elements in the **backStack **or **forwardStack**. In the worst case, we might have to move elements one by one.

#### Space Complexity: O(N)

- **N** is the total number of pages visited.
- The URLs are stored in either **backStack **or **forwardStack**(plus one in **curr**). Therefore, the maximum space we use is directly proportional to the number of URLs visited.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/design-browser-history)*
