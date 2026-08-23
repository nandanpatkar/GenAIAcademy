# Next Greater Node In Linked List

> **Slug:** `next-greater-node-in-linked-list-article`  
> **Published:** 2026-08-22T17:12:56.638Z  
> **Updated:** 2026-08-22T17:12:56.642Z  
> **Keywords:** Next Greater Node In Linked List, Stacks  
> **Cover Image:** ![Next Greater Node In Linked List](6a89d88ff695d4d77644fcd7)

**Description:** Learn how to find the next greater node in a linked list using stacks, with clear examples, step-by-step logic, and complexity analysis.

---

## Problem Statement

Given the head of a singly linked list, the task is to find the next greater node for each node in the list. The "next greater node" is defined as the first node that appears after the current node, which has a greater value.

The function should return a list of integers describing the next greater values for each node in the linked list. If there isn't a greater node that appears after a given node, the corresponding position in the result list should be 0.

> [!NOTE]
> **INFO**
> Example 1
> Input:   head = [2, 7, 4, 3, 5]
> 
> Output: [7, 0, 5, 5, 0]
> 
> **Explanation:** For each node, next greater node is found sequentially.

> [!NOTE]
> **INFO**
> Example 2
> Input:  head = [1, 7, 5, 1, 9, 2, 5, 1]
> 
> Output: [7, 9, 9, 9, 0, 5, 0, 0]
> 
> **Explanation:** Finding the next greater node for each node in the sequence.

## Optimal Approach

### Intuition

For every node, we need to find the first node to its right that has a greater value.

A brute-force approach would be to traverse all subsequent nodes for every node and find the first greater value. However, this would take O(n²) time.

To solve this efficiently, we first convert the linked list into an array. This allows us to access values using indices. After that, we use a monotonic stack to keep track of indices whose next greater element has not been found yet.

While traversing the array:

- If the current value is greater than the value at the index stored on the top of the stack, then the current value is the next greater node for that index.
- We keep removing such indices from the stack and update their answers.
- Then, we push the current index onto the stack.

Any indices left in the stack after the traversal do not have a greater value on their right, so their answers remain 0.

### Algorithm

**Step 1:** Traverse the linked list and store all node values in an ArrayList.

**Step 2: **Create a result array of the same size as the ArrayList and initialize it with 0.

**Step 3:** Create an empty stack to store indices whose next greater value has not been found yet.

**Step 4: **Traverse the ArrayList from left to right.

**Step 5: **While the stack is not empty and the current value is greater than the value at the index on the top of the stack:

- Set the result for that index to the current value.
- Remove that index from the stack.

**Step 6: **Push the current index onto the stack.

**Step 7: **Continue until all values have been processed.

**Step 8: **Return the result array.

### Code

### C++ Implementation

```cpp
class Solution {
public:
    vector<int> nextLargerNodes(ListNode* head) {
        vector<int> result;
        vector<int> values;
        ListNode* temp = head;
        while (temp) {
            values.push_back(temp->val);
            temp = temp->next;
        }

        stack<int> st;
        result.resize(values.size(), 0);
        
        for (int i = 0; i < values.size(); ++i) {
            while (!st.empty() && values[st.top()] < values[i]) {
                result[st.top()] = values[i];
                st.pop();
            }
            st.push(i);
        }
        
        return result;
    }
};
```

### Java Implementation

```java
class Solution {
    public int[] nextLargerNodes(ListNode head) {
        ArrayList<Integer> values = new ArrayList<>();
        ListNode temp = head;
        while (temp != null) {
            values.add(temp.val);
            temp = temp.next;
        }

        int[] result = new int[values.size()];
        Stack<Integer> st = new Stack<>();
        
        for (int i = 0; i < values.size(); i++) {
            while (!st.isEmpty() && values.get(st.peek()) < values.get(i)) {
                result[st.pop()] = values.get(i);
            }
            st.push(i);
        }
        
        return result;
    }
}
```

### Python Implementation

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def nextLargerNodes(self, head: ListNode) -> list[int]:
        values = []
        temp = head

        while temp:
            values.append(temp.val)
            temp = temp.next

        result = [0] * len(values)
        stack = []

        for i in range(len(values)):
            while stack and values[stack[-1]] < values[i]:
                result[stack.pop()] = values[i]

            stack.append(i)

        return result
```

### Complexity Analysis

#### Time Complexity: O(n)

- Each index is pushed onto the stack once and popped at most once.
- The linked list traversal and array traversal are both linear, resulting in an overall O(n) time complexity.

#### Space Complexity: O(n)

- We use an ArrayList to store the linked list values, a result array to store answers, and a stack to keep track of indices.
- Therefore, the extra space required is O(n).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/next-greater-node-in-linked-list-article)*
