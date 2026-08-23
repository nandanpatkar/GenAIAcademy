# Merge Two Sorted Lists

> **Slug:** `merge-two-sorted-lists`  
> **Published:** 2026-06-26T17:01:17.856Z  
> **Updated:** 2026-06-26T17:01:17.934Z  
> **Keywords:** Linked List, Sorted Lists, Merge Two Sorted List  
> **Cover Image:** ![Merge Two Sorted Lists](https://cdn.codehelp.in/media/articles/1782403404211-932951be-WhatsApp_Image_2026-06-25_at_9.30.31_PM.jpeg)

**Description:** Learn how to merge two sorted linked lists. Explore both brute-force and optimal two-pointer approaches with explanations and code implementations.

---

## Problem Statement

You are given the heads of two sorted linked lists, ***list1*** and ***list2***. Your task is to merge these two lists into a single linked list that is also sorted in non-decreasing order. The merged list should be constructed by arranging the nodes from the original lists without the need for creating new nodes. The function must return the head of the newly formed linked list.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:** list1 = [1,2,4], list2 = [1,3,4]
> **Output:**  [1,1,2,3,4,4]
> **Explanation: **Nodes are merged in sorted order.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** list1 = [], list2 = []
> **Output:**  []
> **Explanation: B**oth lists are empty.

> [!NOTE]
> **INFO**
> Example 3
> 
> **Input:   **list1 = [], list2 = [0]
> **Output:**  []
> **Explanation: **Only one list has elements.

## Constraints

- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.

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

Since both linked lists are already sorted, we can take advantage of this property instead of storing all values separately and sorting again. We use two pointers, one for each list, and compare the current nodes step by step. The smaller node is directly attached to the merged list, and the corresponding pointer moves forward.
This way, the merged list is built in sorted order while traversing both lists only once.
If one list gets exhausted before the other, we simply attach the remaining nodes because they are already sorted.

### Algorithm

1. First, check the base cases. If the left linked list is empty, return the right linked list directly. Similarly, if the right linked list is empty, return the left linked list.
2. Create a dummy node `ans` at the start. This dummy node acts as a placeholder node, which helps in building the merged linked list easily without handling the first node separately. Also, maintain a pointer `mptr` that always points to the last node of the merged linked list.
3. Traverse both linked lists together while both `left` and `right` are not `NULL`. Compare the values of the current nodes of both linked lists.
4. If `left->val <= right->val`, attach the current node of the left linked list to `mptr->next`, then move the `left` pointer one step ahead. Otherwise, attach the current node of the right linked list to `mptr->next`, then move the `right` pointer one step ahead.
5. After attaching a node from either linked list, move the `mptr` pointer one step ahead so that it always points to the last node of the merged linked list. Continue this process until one of the linked lists becomes empty.
6. Once the loop ends, one linked list may still contain some remaining nodes. Since both linked lists are already sorted, directly attach the remaining nodes to `mptr->next`.
7. Finally, return `ans->next` because `ans` is only a dummy placeholder node and the actual merged linked list starts from the next node.

### Dry Run





### Code

### index.cpp Implementation

```index.cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* left, ListNode* right) {
        if (left == 0) return right;
        if (right == 0) return left;

        ListNode* ans = new ListNode(-1);
        ListNode* mptr = ans;

        while (left && right) {
            if (left->val <= right->val) {
                mptr->next = left;
                mptr = left;
                left = left->next;
            } else {
                mptr->next = right;
                mptr = right;
                right = right->next;
            }
        }

        if (left) {
            mptr->next = left;
        }

        if (right) {
            mptr->next = right;
        }

        return ans->next;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode mergeTwoLists(ListNode left, ListNode right) {

        if (left == null) return right;

        if (right == null) return left;

        ListNode ans = new ListNode(-1);
        ListNode mptr = ans;

        while (left != null && right != null) {

            if (left.val <= right.val) {
                mptr.next = left;
                mptr = left;
                left = left.next;
            } else {
                mptr.next = right;
                mptr = right;
                right = right.next;
            }
        }

        if (left != null) {
            mptr.next = left;
        }

        if (right != null) {
            mptr.next = right;
        }

        return ans.next;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def mergeTwoLists(self, left, right):
        if left is None:
            return right

        if right is None:
            return left

        ans = ListNode(-1)
        mptr = ans

        while left and right:
            if left.val <= right.val:
                mptr.next = left
                mptr = left
                left = left.next
            else:
                mptr.next = right
                mptr = right
                right = right.next

        if left:
            mptr.next = left

        if right:
            mptr.next = right

        return ans.next
```

### Complexity Analysis

#### Time Complexity: **O(N + M)**

- We traverse both linked lists only once using the `left` and `right` pointers.
- During each iteration, only one node is processed and attached to the merged linked list.
- Every node from both linked lists is visited exactly one time.
- The comparison and attachment operations take constant time `O(1)` for each node.
- Therefore, if:  - `N` = number of nodes in the first linked list
  - `M` = number of nodes in the second linked list

then the overall time complexity becomes:` O(N + M)`

#### Space Complexity: O(N)

- No extra data structure such as an array, vector, or list is used.
- The merging is done by reusing the existing nodes of the linked lists.
- - **ans, mptr, left, right**
- Since the extra memory used does not depend on the input size, the auxiliary space complexity is:** O(1).**

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
*Extracted from CodeHelp (https://www.codehelp.in/articles/merge-two-sorted-lists)*
