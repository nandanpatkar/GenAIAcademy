#!/usr/bin/env python3
"""Runs one scraped reference solution against a list of inputs.

Used by build_tuf_practice.py, one subprocess per problem so a hanging or
crashing solution only loses that problem. Reads a JSON job on stdin:

  {"code": str, "method": str, "parameters": [str], "serializers": {name: kind},
   "cases": [{"id": str, "input": {name: value}}]}

and prints {"ok": bool, "error"?: str, "results": [{"id", "ok", "value"?,
"mutated"?, "error"?}]} — values normalised exactly as the judge harness
(api/_lib/pythonHarness.js) normalises them, so they can be used as expected
outputs there.
"""
import contextlib
import copy
import io
import json
import math
import sys
import traceback
from typing import Any, Deque, Dict, List, Optional, Set, Tuple, Union  # noqa: F401  (solutions use these names)


class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next

    # takeUforward's node classes call the value `data`.
    @property
    def data(self):
        return self.val

    @data.setter
    def data(self, value):
        self.val = value


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

    @property
    def data(self):
        return self.val

    @data.setter
    def data(self, value):
        self.val = value


def decode_linked(values):
    dummy = cursor = ListNode()
    for value in values or []:
        cursor.next = ListNode(value)
        cursor = cursor.next
    return dummy.next


def decode_tree(values):
    if not values:
        return None
    nodes = [None if value is None else TreeNode(value) for value in values]
    children = iter(nodes[1:])
    for node in nodes:
        if node is not None:
            node.left = next(children, None)
            node.right = next(children, None)
    return nodes[0]


def normal(value):
    if isinstance(value, ListNode):
        result, seen = [], set()
        while value is not None and id(value) not in seen and len(result) < 10000:
            seen.add(id(value))
            result.append(value.val)
            value = value.next
        return result
    if isinstance(value, TreeNode):
        result, queue = [], [value]
        while queue and len(result) < 10000:
            node = queue.pop(0)
            if node is None:
                result.append(None)
                continue
            result.append(node.val)
            queue.extend([node.left, node.right])
        while result and result[-1] is None:
            result.pop()
        return result
    if isinstance(value, dict):
        return {str(key): normal(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [normal(item) for item in value]
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return str(value)
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    raise TypeError(f"unsupported result type {type(value).__name__}")


def decode(name, value, serializers):
    kind = serializers.get(name)
    if kind == "linked-list":
        return decode_linked(value)
    if kind == "binary-tree":
        return decode_tree(value)
    return value


def main():
    job = json.load(sys.stdin)
    namespace = {"__name__": "__tuf_reference__", "ListNode": ListNode, "TreeNode": TreeNode}
    namespace.update({name: globals()[name] for name in ("Any", "Deque", "Dict", "List", "Optional", "Set", "Tuple", "Union")})
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compile(job["code"], "reference.py", "exec"), namespace)
    except Exception as error:  # the scraped code did not even load
        print(json.dumps({"ok": False, "error": f"load: {error}"}))
        return
    # Solutions that define their own node classes must still receive ours.
    namespace["ListNode"], namespace["TreeNode"] = ListNode, TreeNode

    solution_class = namespace.get("Solution")
    if solution_class is None:
        print(json.dumps({"ok": False, "error": "no Solution class"}))
        return
    wanted = job["method"].replace("_", "").lower()
    methods = [name for name in dir(solution_class) if not name.startswith("_") and callable(getattr(solution_class, name))]
    method = next((name for name in methods if name.replace("_", "").lower() == wanted), None)
    if method is None and len(methods) == 1:
        method = methods[0]
    if method is None:
        print(json.dumps({"ok": False, "error": f"method {job['method']} not found in {methods}"}))
        return

    results = []
    for case in job["cases"]:
        try:
            raw = case["input"]
            args = {name: decode(name, copy.deepcopy(raw.get(name)), job["serializers"]) for name in job["parameters"]}
            before = {name: normal(value) for name, value in args.items() if isinstance(value, list)}
            with contextlib.redirect_stdout(io.StringIO()):
                value = getattr(solution_class(), method)(*[args[name] for name in job["parameters"]])
            mutated = {name: normal(args[name]) for name in before if normal(args[name]) != before[name]}
            results.append({"id": case["id"], "ok": True, "value": normal(value), "mutated": mutated})
        except Exception as error:
            results.append({"id": case["id"], "ok": False, "error": "".join(traceback.format_exception_only(type(error), error)).strip()[:300]})
    print(json.dumps({"ok": True, "results": results}))


if __name__ == "__main__":
    main()
