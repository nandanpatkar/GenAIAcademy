# First Non-Repeating Character in a Stream

> **Slug:** `first-non-repeating-character-in-a-stream-article`  
> **Published:** 2026-08-16T11:43:21.595Z  
> **Updated:** 2026-08-16T11:43:21.600Z  
> **Keywords:** First Non-Repeating Character in a Stream, Queues, Frequency Map  
> **Cover Image:** ![First Non-Repeating Character in a Stream](6a81a2124ec8f3318bcefb3b)

**Description:** Learn how to find the first non-repeating character in a stream using a queue and frequency map, with clear examples, step-by-step explanation.

---

## Problem Statement

You are tasked with designing a system that processes a continuous stream of characters. At any given point in the stream, your system must be able to efficiently identify and return the *first* character that has appeared only once so far. If all characters encountered up to that point have repeated, or if the stream is empty, your system should indicate that no such character exists (e.g., by returning a special placeholder character like **_**).

The system should expose a way to feed new characters into the stream and a way to query the current first non-repeating character.

> [!NOTE]
> **INFO**
> Example  1
> Input:   Input stream: `mmsissii`
> 
> Output: m_ssii__
> 
> **Explanation:** 1. 'm': Stream `m`, non-repeating: `m`. 2. 'm': Stream `mm`, 'm' repeats, non-repeating: `_`. 3. 's': Stream `mms`, non-repeating: `s`. 4. 'i': Stream `mmsi`, non-repeating: `s`. 5. 's': Stream `mmsis`, 's' repeats, non-repeating: `i`. 6. 's': Stream `mmsiss`, 's' repeats again, non-repeating: `i`. 7. 'i': Stream `mmsissi`, 'i' repeats, non-repeating: `_`.

> [!NOTE]
> **INFO**
> Example  2
> Input: Input stream: `sjxapwnyzerinsug`
> 
> Output: sssssssssssssjjj
> 
> **Explanation:** Each character is processed in order, and the first non-repeating character is output after every step.

## Constraints

- 1 <=** nums.length** <= 100
- 0 <=** nums[i]** <= 1000

## Brute-Force Approach

### Intuition

To find the first non-repeating character at any moment, we need to keep track of two things:

1. How many times each character has appeared in the stream.
2. The order in which characters appeared for the first time.

A frequency array helps us quickly determine whether a character is appearing for the first time, second time, or multiple times. Additionally, we maintain a list containing only the characters that currently appear exactly once, preserving their insertion order.

When a character appears for the first time, it is added to the list of unique characters. When the same character appears again, it is no longer unique, so it is removed from the list. This ensures that the front of the list always represents the first non-repeating character in the stream.

By combining frequency tracking with an ordered list of unique characters, we can efficiently update the stream and retrieve the answer at any time.

### Algorithm

1. First,  we initialize a frequency array to keep track of how many times each character appears. Along with this, maintain a linked list containing the characters that currently appear exactly once, keeping them in the order in which they first appeared.
2. Next, A map is also used to store the iterator of each character in the linked list so that a character can be removed efficiently when it becomes repeated.
3. Then we  process each incoming character one by one. If the character appears for the first time, increment its frequency, add it to the linked list, and store its iterator in the map. If it appears for the second time, increment its frequency, remove it from the linked list using the stored iterator, and erase its entry from the map. If it has already appeared more than once, simply increment its frequency.
4. To find the first non-repeating character at any point, check the linked list. If it is empty, return **'_'**; otherwise, the first element of the linked list is the first non-repeating character.
5. We continue applying the same process for every incoming character.

### Code

### C++ Implementation

```cpp
class FirstNonRepeatingCharacterStream {
private:
    std::array<int, 26> freq;
    std::list<char> unique_chars_order;
    std::array<std::list<char>::iterator, 26> char_to_iterator_map;

public:
    FirstNonRepeatingCharacterStream() {
        freq.fill(0);
        for (int i = 0; i < 26; ++i) {
            char_to_iterator_map[i] = unique_chars_order.end();
        }
    }

    void addChar(char ch) {
        int index = ch - 'a';

        if (freq[index] == 0) {
            freq[index] = 1;
            unique_chars_order.push_back(ch);
            char_to_iterator_map[index] = std::prev(unique_chars_order.end());
        }
        else if (freq[index] == 1) {
            freq[index] = 2;
            unique_chars_order.erase(char_to_iterator_map[index]);
            char_to_iterator_map[index] = unique_chars_order.end();
        }
        else {
            freq[index]++;
        }
    }

    char getFirstNonRepeating() {
        if (unique_chars_order.empty()) {
            return '_';
        }
        else {
            return unique_chars_order.front();
        }
    }
};
```

### Java Implementation

```java
class FirstNonRepeatingCharacterStream {

    private int[] freq;
    private Node[] charToNodeMap;
    private Node head;
    private Node tail;

    private static class Node {
        char ch;
        Node prev;
        Node next;

        Node(char ch) {
            this.ch = ch;
        }
    }

    public FirstNonRepeatingCharacterStream() {
        freq = new int[26];
        charToNodeMap = new Node[26];
    }

    public void addChar(char ch) {
        int index = ch - 'a';

        if (freq[index] == 0) {
            freq[index] = 1;

            Node newNode = new Node(ch);
            charToNodeMap[index] = newNode;

            if (head == null) {
                head = tail = newNode;
            } else {
                tail.next = newNode;
                newNode.prev = tail;
                tail = newNode;
            }
        }
        else if (freq[index] == 1) {
            freq[index] = 2;

            Node node = charToNodeMap[index];

            if (node.prev != null) {
                node.prev.next = node.next;
            } else {
                head = node.next;
            }

            if (node.next != null) {
                node.next.prev = node.prev;
            } else {
                tail = node.prev;
            }

            charToNodeMap[index] = null;
        }
        else {
            freq[index]++;
        }
    }

    public char getFirstNonRepeating() {
        if (head == null) {
            return '_';
        }

        return head.ch;
    }
}
```

### Python Implementation

```python
class FirstNonRepeatingCharacterStream:

    class Node:
        def __init__(self, ch):
            self.ch = ch
            self.prev = None
            self.next = None

    def __init__(self):
        self.freq = [0] * 26
        self.char_to_node_map = [None] * 26
        self.head = None
        self.tail = None

    def addChar(self, ch):
        index = ord(ch) - ord('a')

        if self.freq[index] == 0:
            self.freq[index] = 1

            new_node = self.Node(ch)
            self.char_to_node_map[index] = new_node

            if self.head is None:
                self.head = self.tail = new_node
            else:
                self.tail.next = new_node
                new_node.prev = self.tail
                self.tail = new_node

        elif self.freq[index] == 1:
            self.freq[index] = 2

            node = self.char_to_node_map[index]

            if node.prev is not None:
                node.prev.next = node.next
            else:
                self.head = node.next

            if node.next is not None:
                node.next.prev = node.prev
            else:
                self.tail = node.prev

            self.char_to_node_map[index] = None

        else:
            self.freq[index] += 1

    def getFirstNonRepeating(self):
        if self.head is None:
            return '_'

        return self.head.ch
```

### Complexity Analysis

#### Time Complexity: O(1)

- The **addChar()** operation performs a constant number of operations, such as updating the frequency, accessing the map, inserting into the linked list, or removing an element using its stored iterator.
- Each of these operations takes **O(1)** time.
- The **getFirstNonRepeating()** operation directly accesses the first element of the linked list, so it also takes **O(1)** time.
- Therefore, the time complexity of both operations is ***O(1)****.*

#### Space Complexity: O(1)

- The frequency array stores counts for only **26 lowercase English letters**, so it uses **O(1)** space.
- The linked list can contain at most **26 unique characters** at any time, so it also uses **O(1)** space.
- The hash map stores at most **26 character-to-iterator mappings**, which requires **O(1)** space.
- Since the amount of extra space is bounded by the fixed alphabet size, the overall space complexity is ***O(1)****.*



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/first-non-repeating-character-in-a-stream-article)*
