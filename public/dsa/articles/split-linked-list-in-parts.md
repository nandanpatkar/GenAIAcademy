# Split linked list in parts

> **Slug:** `split-linked-list-in-parts`  
> **Published:** 2026-07-09T14:30:35.331Z  
> **Updated:** 2026-07-09T14:30:35.339Z  
> **Keywords:** Split Linked list in parts, split linkedlist, linkedlist  
> **Cover Image:** ![Split linked list in parts](6a4fb06b2e81bcf6527875db)

**Description:** Learn how to split a linked list into parts using an efficient approach, with examples, explanation, code implementation, and complexity analysis.

---

## Problem Statement

You are given the **head **of a singly linked list and an integer **k**. Your task is to split the linked list into **k** consecutive parts.

The parts should be as equal in size as possible. If the total number of nodes is **n**, each part will have a base size of **n / k**. The first **n % k** parts will each receive one extra node. The length of any two parts should differ by no more than 1. The longer parts must come before the shorter parts.

The output should be an array (or list) of the **k** heads of the split parts. Parts that have no nodes should be represented as **null**.

> [!NOTE]
> **INFO**
> Example 1
> 
> **Input:** head = [1,2,3,4,5,6,7,8,9,10], k = 3
> **Output:**  [[1,2,3,4],[5,6,7],[8,9,10]]
> **Explanation:** The list has 10 nodes. 10 / 3 = 3 with a remainder of 1. So, the first part gets 3 + 1 = 4 nodes, and the other two parts get 3 nodes each.

> [!NOTE]
> **INFO**
> Example 2
> 
> **Input:** head = [1,2,3], k = 5
> **Output: **[[1],[2],[3],[],[]]
> **Explanation:**The list has 3 nodes. The first 3 parts get 1 node each, and the remaining 2 parts are empty (null).

## Real-Life Analogy

Imagine a school is organizing students into **k different buses** for a picnic trip.
All the students are standing in a single line, one behind another, just like nodes in a linked list.

The teacher has two important rules while dividing them:

1. Every bus should carry **almost the same number of students**.
2. If some buses must carry one extra student, those extra students should go to the **earlier buses first**.

Suppose there are **10 students** and **3 buses**.

- Each bus should get at least **10 / 3 = 3** students.
- There is **10 % 3 = 1** extra student remaining.

So:

- The **first bus** gets ** 4** students.
- The next two buses get ** 3 **students each.

The teacher starts from the front of the line:

- She sends the first group of students into Bus 1 and cuts the line there.
- Then she continues with the remaining students for Bus 2.
- Finally, the last group goes into Bus 3.

If there are more buses than students, some buses simply leave empty, represented as ** null**.

So:

- The long student line represents the **linked list**.
- Each bus represents one **part** of the split list.
- The teacher carefully dividing students equally is exactly how we split the linked list into ** k** consecutive parts.

## Brute-Force Approach

### Intuition

A simple way to solve the problem is to first store all nodes of the linked list inside an array or vector. Once all nodes are stored, it becomes easier to calculate the size of each part and split them accordingly.

Using the array, we can directly access nodes by index instead of traversing the linked list repeatedly. Then we break connections at the required positions to form separate linked list parts.

### **Algorithm**

1. Firstly, we traverse the linked list and store every node inside a vector. Let, N = total number of nodes, baseSize = N / k and extraNodes = N % k.
2. Next we create an answer vector of size k initialized with nullptr. As start forming each part:  - The first extraNodes parts will contain baseSize + 1 nodes.
  - Remaining parts will contain baseSize nodes.
3. For every part:  - Store the starting node in the answer vector.
  - Move to the last node of that part using vector indexing.
  - Break the link by setting the last node’s next pointer to nullptr.
4. At last, return the answer vector containing all split parts.

### **Dry Run**

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    vector<ListNode*> splitListToParts(ListNode* head, int k) {
        vector<ListNode*> nodes;

        ListNode* temp = head;

        // Store all nodes in vector
        while (temp) {
            nodes.push_back(temp);
            temp = temp->next;
        }

        int N = nodes.size();

        int baseSize = N / k;
        int extraNodes = N % k;

        vector<ListNode*> ans(k, nullptr);

        int index = 0;

        for (int i = 0; i < k && index < N; i++) {

            ans[i] = nodes[index];

            int currentPartSize = baseSize + (extraNodes > 0 ? 1 : 0);

            extraNodes--;

            int lastNodeIndex = index + currentPartSize - 1;

            index += currentPartSize;

            // Break the link
            if (lastNodeIndex + 1 < N) {
                nodes[lastNodeIndex]->next = nullptr;
            }
        }

        return ans;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode[] splitListToParts(ListNode head, int k) {

        ArrayList<ListNode> nodes = new ArrayList<>();

        ListNode temp = head;

        // Store all nodes in ArrayList
        while (temp != null) {
            nodes.add(temp);
            temp = temp.next;
        }

        int N = nodes.size();

        int baseSize = N / k;
        int extraNodes = N % k;

        ListNode[] ans = new ListNode[k];

        int index = 0;

        for (int i = 0; i < k && index < N; i++) {

            ans[i] = nodes.get(index);

            int currentPartSize = baseSize + (extraNodes > 0 ? 1 : 0);

            extraNodes--;

            int lastNodeIndex = index + currentPartSize - 1;

            index += currentPartSize;

            // Break the link
            if (lastNodeIndex + 1 < N) {
                nodes.get(lastNodeIndex).next = null;
            }
        }

        return ans;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def splitListToParts(self, head, k):
        nodes = []

        temp = head

        # Store all nodes in list
        while temp:
            nodes.append(temp)
            temp = temp.next

        N = len(nodes)

        baseSize = N // k
        extraNodes = N % k

        ans = [None] * k

        index = 0

        for i in range(k):

            if index >= N:
                break

            ans[i] = nodes[index]

            currentPartSize = baseSize + (1 if extraNodes > 0 else 0)

            extraNodes -= 1

            lastNodeIndex = index + currentPartSize - 1

            index += currentPartSize

            # Break the link
            if lastNodeIndex + 1 < N:
                nodes[lastNodeIndex].next = None

        return ans
```

### Complexity Analysis

#### Time Complexity: **O(N + K)**

- Traversing the linked list and storing nodes into the vector takes **O(N)**.
- Splitting the nodes into `k` parts takes **O(K)**.
- Since vector indexing works in constant time **O(1),** no extra traversal is needed.
- Therefore, overall time complexity becomes: **O(N + K).**

### **Space Complexity: O(N + K)**

- We use a vector to store all **N** nodes of the linked list → O(**N).**
- We also use an answer vector of size **k -> O(K)**.
- Therefore, the total space complexity becomes: O(**N+ K).**

## Optimal Approach

### Intuition

Since the linked list needs to be divided into **k** consecutive parts as equally as possible, the first step is to know the total number of nodes present in the linked list.

If the total number of nodes is N:

- Every part should contain at least **N / k** nodes.
- The first **N % k** parts will contain one extra node so that the size difference between any two parts remains at most **1**.

After determining the required size of each part, we traverse the linked list and split it part-by-part by breaking the links appropriately.

### **Algorithm**

1. We first traverse the linked list to count the total number of nodes, say **N**. Our goal is to divide these nodes into ** K **parts such that each part has almost equal size, and the difference between any two parts is at most **1**.
2. To do this, we calculate:

- - **idealPartSize = N / k** → minimum number of nodes each part should contain.
  - **extraNodes = N % k** → remaining nodes that cannot be equally distributed.

1. The first **extraNodes **parts will contain  **idealPartSize + 1** nodes, while the remaining parts will contain **idealPartSize **nodes.
2. Now, we traverse the linked list again to split it into parts. For every part, we store the current node as the starting node of that part and determine its size based on whether extra nodes are still remaining or not.
3. Then, we move the pointer to the last node of the current part, store the next node for the upcoming part, and break the connection by setting**: it->next = nullptr.**
4. We repeat this process for all **k** parts and store their head nodes in the answer vector. If **k** is greater than **N**, some parts will remain empty and will contain **nullptr**.
5. Finally, we return the vector containing all **k** separated parts.

### **Code**

### index.cpp Implementation

```index.cpp
class Solution {
public:
    vector<ListNode*> splitListToParts(ListNode* head, int k) {
        int N = 0;
        auto it = head;

        while (it) {
            N++;
            it = it->next;
        }

        // Determine size of each part
        int idealPartSize = N / k;
        int extraNodes = N % k;

        vector<ListNode*> ans(k, nullptr);

        it = head;

        for (int i = 0; i < k && it; i++) {

            ans[i] = it;

            int actualCurrentPartSize =
                idealPartSize + (extraNodes-- > 0 ? 1 : 0);

            // Move till end of current part
            for (int j = 0; j < actualCurrentPartSize - 1; j++) {
                it = it->next;
            }

            // Break the list
            auto nextPartStarting = it->next;
            it->next = nullptr;
            it = nextPartStarting;
        }

        return ans;
    }
};
```

### index.java Implementation

```index.java
class Solution {
    public ListNode[] splitListToParts(ListNode head, int k) {

        int N = 0;
        ListNode it = head;

        while (it != null) {
            N++;
            it = it.next;
        }

        // Determine size of each part
        int idealPartSize = N / k;
        int extraNodes = N % k;

        ListNode[] ans = new ListNode[k];

        it = head;

        for (int i = 0; i < k && it != null; i++) {

            ans[i] = it;

            int actualCurrentPartSize =
                    idealPartSize + (extraNodes-- > 0 ? 1 : 0);

            // Move till end of current part
            for (int j = 0; j < actualCurrentPartSize - 1; j++) {
                it = it.next;
            }

            // Break the list
            ListNode nextPartStarting = it.next;
            it.next = null;
            it = nextPartStarting;
        }

        return ans;
    }
}
```

### index.py Implementation

```index.py
class Solution:
    def splitListToParts(self, head, k):

        N = 0
        it = head

        while it:
            N += 1
            it = it.next

        # Determine size of each part
        idealPartSize = N // k
        extraNodes = N % k

        ans = [None] * k

        it = head

        for i in range(k):

            if not it:
                break

            ans[i] = it

            actualCurrentPartSize = (
                idealPartSize + (1 if extraNodes > 0 else 0)
            )

            if extraNodes > 0:
                extraNodes -= 1

            # Move till end of current part
            for _ in range(actualCurrentPartSize - 1):
                it = it.next

            # Break the list
            nextPartStarting = it.next
            it.next = None
            it = nextPartStarting

        return ans
```

### Complexity Analysis

#### Time Complexity: **O( N + K)**

- We traverse the linked list once to count the total number of nodes →**O(N)** .
- We traverse the linked list again to split it into **k** parts. Every node is visited only once during splitting → **O(N)** .
- Initializing the answer vector of size **k** takes** O(K)** time.
- Therefore, the total time complexity becomes:** O(N + K)**, Where:** N = total number of nodes in the linked list** and **K = number of parts.**

#### **Space Complexity:***** *****O(K)**

- We only use a few extra variables such as: **N**,** idealPartSize**, **extraNodes** and pointers like **it.**
- The only additional space used is the answer vector storing **k** head pointers.
- Therefore, the overall auxiliary space complexity is: O(K).



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/split-linked-list-in-parts)*
