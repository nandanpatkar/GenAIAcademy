# Sort Linked List

> **Slug:** `sort-linked-list`  
> **Published:** 2026-06-25T16:50:37.215Z  
> **Updated:** 2026-06-25T16:50:37.222Z  
> **Keywords:** Sort Linked List, Sort, linked list sorting  
> **Cover Image:** ![Sort Linked List](6a3d5c587b2386948e75fa25)

**Description:** Learn how to sort a linked list in ascending order. Explore both brute-force and optimal merge sort approaches with explanations.

---

## Problem Statement

You are given a singly linked list where each node contains an integer value. Your task is to sort this linked list in ascending order and return the head of the sorted list.

A singly linked list is a linear data structure where each element is a node. Each node holds a value and a link to the next node in the sequence.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:**  list = []
> **Output:**  []
> **Explanation: **Empty list remains empty after sorting.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** list = [4, 2, 1, 3]
> **Output:**  [1, 2, 3, 4]
> **Explanation: **Unsorted list is sorted to ascending order.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:   **list = [-1, 5, 3, 4, 0]
> **Output:**  [-1, 0, 3, 4, 5]
> **Explanation: **Unsorted list with negative numbers is sorted.

## Constraints

- 1 <= nums.length <= 100
- 0 <= nums[i] <= 1000

## Real-Life Analogy

Suppose you are organizing a grand wedding. In a wedding, there are two sides: one is the **bride’s side** with her guest list **(list1)**, and the other is the **groom’s side** with his guest list **(list2)**. Both lists **(list1 and list2)** are already sorted by age (from youngest to oldest).

Now, when printing the final seating arrangement, you don’t want to separate the lists, as you want one single combined list where all the guests are still arranged in proper age order.
So, you start comparing:

- Look at the first guest from the **bride’s list** and the first guest from the **groom’s list.**
- Whichever guest is younger goes first into the seating plan.
- Then move to the next guest in that list.
- Repeat this until you’ve gone through both lists.


**e.g:  Bride’s List:** (which is **list1**) Age wise list: **12 → 25 → 40 → 60**
**Groom’s List **(which is **list2**): Age wise list: **15 → 30 → 35 → 70**
Hence, **Merging** into the final seating: **12 → 15 → 25 → 30 → 35 → 40 → 60 → 70**

**Conclusion**: In the end, by carefully comparing the ages from both the bride’s list and the groom’s list, you managed to merge them into a single, perfectly ordered seating plan. 
Nobody was left out, nobody was misplaced and the final arrangement flowed smoothly from the youngest guest to the oldest.
This is exactly what happens when we **merge two sorted linked lists**
We don’t create new guests (no new nodes).
We simply **splice together** the existing guests from both sides into one sorted chain.
Just like the wedding became more joyful with everyone sitting together in order, the linked list problem ensures that the two separate sorted lists become **one harmonious, sorted list**.

## Brute-Force Approach

### Intuition

A simple way to merge two sorted linked lists is to ignore the linked structure at first and treat them like normal collections of values. We traverse both lists, collect all node values into an array, and then sort this array because the combined values may not remain ordered. After sorting, we create a completely new linked list by inserting nodes one by one from the sorted array. Finally, we return the head of this newly constructed sorted list.

### Algorithm

1. Since we have** two sorted linked lists**: As list 1 **(head → (1 → 3 → 5 …))** and list 2 **(head → (2 → 4 → 6 …),** as understood that in brute force way is to ignore that they are linked lists, and instead: Traverse both lists completely and collect all the values in an array or list, **e.g: list 1 = [1, 3, 5] and list 2 = [2, 4, 6] output: [1, 3, 5, 2, 4, 6]. **
2. Sort this array/list since it may not be sorted after merging, after the sorting, output is [1, 2, 3, 4, 5, 6].
3. As you sort the list, now recreate a new linked list using this sorted array. Hence use construct new nodes: **1 → 2 → 3 → 4 → 5 → 6.**
4. Return the head of the new list.

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class ListNode {
public:
    int val;
    ListNode* next;

    ListNode(int x) {
        val = x;
        next = nullptr;
    }
};

class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {

        vector<int> values;

        // collect values from list1
        while (list1 != nullptr) {
            values.push_back(list1->val);
            list1 = list1->next;
        }

        // collect values from list2
        while (list2 != nullptr) {
            values.push_back(list2->val);
            list2 = list2->next;
        }

        // sort values
        sort(values.begin(), values.end());

        // build new linked list
        ListNode* dummy = new ListNode(-1);
        ListNode* current = dummy;

        for (int val : values) {
            current->next = new ListNode(val);
            current = current->next;
        }

        return dummy->next;
    }
};
```

### index.java Implementation

```index.java
import java.util.*;

class ListNode {
    int val;
    ListNode next;

    ListNode() {}

    ListNode(int val) {
        this.val = val;
    }

    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

        List<Integer> values = new ArrayList<>();

        while (list1 != null) {
            values.add(list1.val);
            list1 = list1.next;
        }

        while (list2 != null) {
            values.add(list2.val);
            list2 = list2.next;
        }

        Collections.sort(values);

        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;

        for (int val : values) {
            current.next = new ListNode(val);
            current = current.next;
        }

        return dummy.next;
    }
}

public class Main {
    public static void main(String[] args) {

        // Create list1: 1 -> 3 -> 5
        ListNode list1 = new ListNode(1);
        list1.next = new ListNode(3);
        list1.next.next = new ListNode(5);

        // Create list2: 2 -> 4 -> 6
        ListNode list2 = new ListNode(2);
        list2.next = new ListNode(4);
        list2.next.next = new ListNode(6);

        Solution obj = new Solution();
        ListNode result = obj.mergeTwoLists(list1, list2);

        // Print result
        while (result != null) {
            System.out.print(result.val + " ");
            result = result.next;
        }
    }
}
```

### index.py Implementation

```index.py
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1, list2):
        values = []

        # collect values from list1
        while list1:
            values.append(list1.val)
            list1 = list1.next

        # collect values from list2
        while list2:
            values.append(list2.val)
            list2 = list2.next

        # sort values
        values.sort()

        # build new linked list
        dummy = ListNode(-1)
        current = dummy

        for val in values:
            current.next = ListNode(val)
            current = current.next

        return dummy.next
```

### Complexity Analysis

#### Time Complexity: **O(N log N)**

- Firstly, we collect the values from both the lists.
- Going through list1 takes O(n), and going through list2 takes O(m).
- Adding into an ArrayList is basically O(1) per element, so overall this step is just O(n+ m).
- Now sort, Collections.sort first copies the list into an array O(N).
- After that, it sorts the array using TimSort, which takes O(N log N) in the worst and average case, and O(N) in the best case (if already sorted). Then it writes the sorted values back into the list, which is another O(N), so this step is dominated by O(N log N).
- So overall, the total time complexity is:
- - **O(n + m) + O(N log N) + O(N) = O(N log N)**

#### Space Complexity: O(N)

- We use an ArrayList to store all the node values — that’s O(N) space.
- When we call  **Collections.sort**, Java internally makes another array and some temporary buffers for TimSort — that’s again around O(N).
- Finally, we are building a new linked list from scratch, which also takes O(N) space.
- So in total, even though we have multiple pieces using memory, everything still adds up to linear space.
- That means overall space is O(N).

### Optimal Approach Two Pointer Technique

### Intuition

Instead of sorting the strings, we can check whether two words are anagrams by counting how many times each letter appears. The main idea is that if both words have the same characters appearing the same number of times, they must be anagrams. To do this efficiently, we can use a single HashMap (or frequency table).
As we go through the first word, we increase the count for each character. Then, as we go through the second word, we decrease the count. If at the end all counts are back to zero, it means both words contain identical letters with equal frequencies, confirming they are anagrams.

### Algorithm

1. Create a dummy node at the start, as this dummy acts as a “placeholder” to make attaching nodes easier so we don’t worry about whether it’s the first node or not. Now, Maintaining a **current** **pointer**, which will always point to the last node of the merged list.
2. After this, Traverse Both lists together. While both lists are not empty, Compare the values of the current nodes of** list1 **and** list2. **So, whichever is smaller you attach it to the** current.next. **Now**, **move that list’s pointer ahead. And move the current ahead too.
3. Hence one of the lists is empty, attach remains nodes as the other list may still have nodes left. Since, the lists ar already sorted, you can directly attach the **remaining** **nodes** to **current.next**.
4. At last, **Return** the result as the merged lists starts from **dummy.next** (because dummy was just a placeholder).

### Dry Run

// image

### Code

### index.cpp Implementation

```index.cpp
#include <bits/stdc++.h>
using namespace std;

class ListNode {
public:
    int val;
    ListNode* next;

    ListNode(int v) {
        val = v;
        next = nullptr;
    }
};

class Solution {
public:

    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(-1);
        ListNode* current = &dummy;

        while (l1 && l2) {
            if (l1->val < l2->val) {
                current->next = l1;
                l1 = l1->next;
            } else {
                current->next = l2;
                l2 = l2->next;
            }
            current = current->next;
        }

        current->next = (l1 ? l1 : l2);
        return dummy.next;
    }

    ListNode* mergeTwoListsWithTrace(ListNode* l1, ListNode* l2) {
        cout << "=== START MERGE TRACE ===\n";
        cout << "list1: " << toString(l1) << "\n";
        cout << "list2: " << toString(l2) << "\n";

        ListNode dummy(-1);
        ListNode* current = &dummy;

        int step = 0;

        while (l1 && l2) {
            step++;
            cout << "Step " << step
                 << ": compare " << l1->val << " and " << l2->val << " -> ";

            if (l1->val < l2->val) {
                cout << "pick list1(" << l1->val << ")\n";
                current->next = l1;
                l1 = l1->next;
            } else {
                cout << "pick list2(" << l2->val << ")\n";
                current->next = l2;
                l2 = l2->next;
            }

            current = current->next;
            cout << "Merged so far: " << toString(dummy.next) << "\n";
        }

        if (l1) {
            cout << "Attach remaining list1: " << toString(l1) << "\n";
            current->next = l1;
        } else if (l2) {
            cout << "Attach remaining list2: " << toString(l2) << "\n";
            current->next = l2;
        }

        cout << "FINAL: " << toString(dummy.next) << "\n";
        cout << "=== END MERGE TRACE ===\n";

        return dummy.next;
    }

    string toString(ListNode* head) {
        if (!head) return "(empty)";
        string res;

        while (head) {
            res += to_string(head->val);
            if (head->next) res += " -> ";
            head = head->next;
        }

        return res;
    }
};

// Helper
ListNode* build(vector<int> arr) {
    ListNode dummy(0);
    ListNode* cur = &dummy;

    for (int x : arr) {
        cur->next = new ListNode(x);
        cur = cur->next;
    }

    return dummy.next;
}

// Demo
int main() {
    Solution sol;

    ListNode* l1 = build({1, 1, 2, 4, 9});
    ListNode* l2 = build({1, 3, 4, 10});

    sol.mergeTwoListsWithTrace(l1, l2);

    return 0;
}
```

### index.java Implementation

```index.java
class Solution {

    static class ListNode {
        int val;
        ListNode next;

        ListNode(int v) {
            val = v;
        }
    }

    // Original merge function
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }

        if (list1 != null) current.next = list1;
        else current.next = list2;

        return dummy.next;
    }

    // Trace version
    public static ListNode mergeTwoListsWithTrace(ListNode list1, ListNode list2) {
        System.out.println("=== START MERGE TRACE ===");
        System.out.println("list1: " + toString(list1));
        System.out.println("list2: " + toString(list2));

        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;
        int step = 0;

        while (list1 != null && list2 != null) {
            step++;

            System.out.printf("Step %d: compare %d and %d -> ",
                    step, list1.val, list2.val);

            if (list1.val < list2.val) {
                System.out.printf("pick list1(%d)%n", list1.val);
                current.next = list1;
                list1 = list1.next;
            } else {
                System.out.printf("pick list2(%d)%n", list2.val);
                current.next = list2;
                list2 = list2.next;
            }

            current = current.next;
            System.out.println("Merged so far: " + toString(dummy.next));
        }

        if (list1 != null) {
            System.out.println("Attach remaining list1: " + toString(list1));
            current.next = list1;
        } else if (list2 != null) {
            System.out.println("Attach remaining list2: " + toString(list2));
            current.next = list2;
        }

        System.out.println("FINAL: " + toString(dummy.next));
        System.out.println("=== END MERGE TRACE ===");

        return dummy.next;
    }

    // Helpers
    static ListNode build(int... a) {
        ListNode dummy = new ListNode(0), cur = dummy;
        for (int v : a) {
            cur.next = new ListNode(v);
            cur = cur.next;
        }
        return dummy.next;
    }

    static String toString(ListNode head) {
        if (head == null) return "(empty)";
        StringBuilder sb = new StringBuilder();

        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(" -> ");
            head = head.next;
        }

        return sb.toString();
    }

    // Demo
    public static void main(String[] args) {
        ListNode l1 = build(1, 1, 2, 4, 9);
        ListNode l2 = build(1, 3, 4, 10);

        mergeTwoListsWithTrace(l1, l2);
    }
}
```

### index.py Implementation

```index.py
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:

    def mergeTwoLists(self, l1, l2):
        dummy = ListNode(-1)
        current = dummy

        while l1 and l2:
            if l1.val < l2.val:
                current.next = l1
                l1 = l1.next
            else:
                current.next = l2
                l2 = l2.next
            current = current.next

        current.next = l1 if l1 else l2
        return dummy.next

    def mergeTwoListsWithTrace(self, l1, l2):
        print("=== START MERGE TRACE ===")
        print("list1:", self.to_string(l1))
        print("list2:", self.to_string(l2))

        dummy = ListNode(-1)
        current = dummy
        step = 0

        while l1 and l2:
            step += 1
            print(f"Step {step}: compare {l1.val} and {l2.val} -> ", end="")

            if l1.val < l2.val:
                print(f"pick list1({l1.val})")
                current.next = l1
                l1 = l1.next
            else:
                print(f"pick list2({l2.val})")
                current.next = l2
                l2 = l2.next

            current = current.next
            print("Merged so far:", self.to_string(dummy.next))

        if l1:
            print("Attach remaining list1:", self.to_string(l1))
            current.next = l1
        elif l2:
            print("Attach remaining list2:", self.to_string(l2))
            current.next = l2

        print("FINAL:", self.to_string(dummy.next))
        print("=== END MERGE TRACE ===")

        return dummy.next

    def to_string(self, head):
        if not head:
            return "(empty)"
        res = []
        while head:
            res.append(str(head.val))
            head = head.next
        return " -> ".join(res)


# Demo
def build(arr):
    dummy = ListNode()
    cur = dummy
    for x in arr:
        cur.next = ListNode(x)
        cur = cur.next
    return dummy.next


l1 = build([1, 1, 2, 4, 9])
l2 = build([1, 3, 4, 10])

sol = Solution()
sol.mergeTwoListsWithTrace(l1, l2)
```

### Complexity Analysis

#### Time Complexity: **O(N)**

- We are traversing both the lists exactly once.
- In every iteration of the **while** loop, we move either **list1** or **list2** forward.
- Eventually, all the **n + m** nodes are visited once, where **n** is the size of **list1** and **m** is the size of **list2**.

#### Space Complexity: O(K)

- We only use a **dummy** node (1 pointer) and a **current** pointer (1 pointer).
- We also use temporary references to traverse the input lists (**list1** and **list2**).
- Hence, no new arrays are created, No extra linked lists are created, No recursion stack is used since the approach is iterative.
- The merged list reuses the existing nodes by adjusting links in-place.

### 



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/sort-linked-list)*
