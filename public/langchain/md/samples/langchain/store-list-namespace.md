> [!NOTE] Where this runs in the docs
>
> [Stores](lc:oss/python/langgraph/stores)

```python store-list-namespace.py
from collections.abc import Sequence

from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

# Seed some data
store.put(("alice", "memories"), "mem-1", {"text": "Likes hiking"})
store.put(("alice", "memories"), "mem-2", {"text": "Dislikes loud music"})

# Return up to 100 items stored under ("alice", "memories").
items = store.search(("alice", "memories"), limit=100)

page_size = 50
offset = 0
while True:
    page = store.search(("alice", "memories"), limit=page_size, offset=offset)
    if not page:
        break
    for item in page:
        pass
    offset += page_size

# All namespaces that start with ("alice",), truncated to two levels deep.
namespaces = store.list_namespaces(prefix=("alice",), max_depth=2)

if __name__ == "__main__":
    assert len(items) == 2
    assert namespaces == [("alice", "memories")]
    print("✓ store list-namespace operations work correctly")
```
