# Asteroid Collision

> **Slug:** `asteroid-collision`  
> **Published:** 2026-08-22T17:20:57.634Z  
> **Updated:** 2026-08-22T17:20:57.638Z  
> **Keywords:** Asteroid Collision, Stacks  
> **Cover Image:** ![Asteroid Collision](6a89da6cf695d4d77644fcf1)

**Description:** Learn how to solve the Asteroid Collision problem using stacks, with clear examples, step-by-step logic, real-life analogy, and time and space complexity analysis.

---

## Problem Description

You are given a list of integers called ***asteroids*** that represent asteroids aligned in a row. Each integer's value indicates the size and movement direction of an asteroid. A positive value means the asteroid moves to the right, while a negative value means it moves to the left. The magnitude of the integer represents the size of the asteroid.

When two asteroids move towards each other, they may collide:

- A collision occurs between an asteroid moving to the right (+) and an asteroid moving to the left (-).
- During a collision, the smaller asteroid explodes.
- If both asteroids have the same size, they both explode.
- Asteroids moving in the same direction never collide.

Your task is to determine and return the state of the asteroids after all possible collisions have occurred. Return the remaining asteroids in their original order.

> [!NOTE]
> **INFO**
> Example 1
> Input:   asteroids = [5, 10, -5]
> 
> Output: [5, 10]
> 
> **Explanation:** The 10 and -5 collide resulting in 10, leaving 5 and 10 intact.

> [!NOTE]
> **INFO**
> Example 2
> Input:  asteroids = [8, -8]
> 
> Output: []
> 
> **Explanation:** 8 and -8 are of the same size, so both explode.

## Optimal Approach

### Intuition

When simulating asteroid collisions, we need to carefully check for opposing directions:

- A collision only happens if a **right-moving asteroid (positive)** meets a **left-moving asteroid (negative)**.
- The smaller asteroid is destroyed, or both explode if they are equal.
- A **stack** is the natural choice here:
- - It allows us to dynamically track the last asteroid in line.
  - When a new asteroid arrives, we can check if it collides with the stack’s top asteroid.
  - This **Last-In-First-Out (LIFO)** behavior matches how collisions occur.

Thus, we can use a stack to efficiently simulate all collisions until the final state is reached.

## Algorithm

1. Initialize an empty stack.
2. For each asteroid in the input list:
3. - Set a flag `alive = true`.
  - While `alive` is true and the stack is not empty and the asteroid is moving left while the top of the stack is moving right:
  - - Compare sizes:
    - - If `abs(asteroid)` > `stack.top()`: pop from the stack (top asteroid destroyed), continue checking.
      - If `abs(asteroid)` == `stack.top()`: pop from the stack (both destroyed), set `alive = false`, stop.
      - Else: incoming asteroid destroyed (`alive = false`), stop.
  - If still `alive`, push asteroid onto the stack.
4. Build the result vector from the stack in reverse order.
5. Return the result.

### Code

### C++ Code Implementation

```c++ code
class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        stack<int> stack;
        
        for (int asteroid : asteroids) {
            bool alive = true;
            while (!stack.empty() && asteroid < 0 && stack.top() > 0) {
                if (stack.top() < -asteroid) {
                    stack.pop();
                    continue;
                } else if (stack.top() == -asteroid) {
                    stack.pop();
                }
                alive = false;
                break;
            }
            if (alive) {
                stack.push(asteroid);
            }
        }
        
        vector<int> result(stack.size());
        for (int i = stack.size() - 1; i >= 0; --i) {
            result[i] = stack.top();
            stack.pop();
        }
        
        return result;
    }
};
```

### Java Code Implementation

```java code
class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Stack<Integer> stack = new Stack<>();
        
        for (int asteroid : asteroids) {
            boolean alive = true;
            while (!stack.isEmpty() && asteroid < 0 && stack.peek() > 0) {
                if (stack.peek() < -asteroid) {
                    stack.pop();
                    continue;
                } else if (stack.peek() == -asteroid) {
                    stack.pop();
                }
                alive = false;
                break;
            }
            if (alive) {
                stack.push(asteroid);
            }
        }
        
        int[] result = new int[stack.size()];
        for (int i = stack.size() - 1; i >= 0; --i) {
            result[i] = stack.pop();
        }
        
        return result;
    }
}
```

### Python code Implementation

```python code
class Solution:
    def asteroidCollision(self, asteroids):
        st = []

        for asteroid in asteroids:
            alive = True

            while st and asteroid < 0 and st[-1] > 0:

                if st[-1] < -asteroid:
                    st.pop()
                    continue

                elif st[-1] == -asteroid:
                    st.pop()

                alive = False
                break

            if alive:
                st.append(asteroid)

        return st
```

## Complexity Analysis

#### Time Complexity: O(N)

- We iterate through all `N` asteroids one by one.
- For each asteroid, we may perform collisions (pops) with elements in the stack.
- Important observation: each asteroid is pushed at most once and popped at most once from the stack.
- Therefore, the total number of operations (push + pop) is bounded by `2N`.

#### Space Complexity: O(N)

- A stack is used to store surviving asteroids.
- In the worst case, if no collisions occur (for example, if all asteroids move in the same direction), all `N` asteroids will be stored in the stack.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/asteroid-collision)*
