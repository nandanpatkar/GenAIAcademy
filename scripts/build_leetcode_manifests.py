#!/usr/bin/env python3
"""Build deterministic public/server LeetCode judge manifests from the Python corpus.

The source repository is intentionally loose: statements live in module strings and
solutions use a mixture of Python 2 and Python 3.  This builder extracts only data it
can prove, applies a small set of audited overrides, and emits a coverage report so a
bad extraction cannot silently become a judge case.
"""

from __future__ import annotations

import ast
import json
import re
import subprocess
import sys
from leetcode_curated_cases import ADDITIONAL_CURATED
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "src" / "data" / "leetcode"
README = SOURCE_ROOT / "README.md"
PUBLIC_OUTPUT = SOURCE_ROOT / "problemManifests.json"
SERVER_OUTPUT = ROOT / "api" / "_data" / "leetcodeManifests.json"
REPORT_OUTPUT = ROOT / "docs" / "LEETCODE_JUDGE_COVERAGE.md"


CURATED = {
    1: {
        "entrypoint": {"kind": "solution-method", "className": "Solution", "methodName": "twoSum", "parameters": ["nums", "target"]},
        "visibleTests": [
            {"id": "example-1", "input": {"nums": [2, 7, 11, 15], "target": 9}, "expected": [0, 1]},
            {"id": "example-2", "input": {"nums": [3, 2, 4], "target": 6}, "expected": [1, 2]},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"nums": [3, 3], "target": 6}, "expected": [0, 1]}],
    },
    26: {
        "judge": {"comparator": "prefix-mutation", "mutationParameter": "nums"},
        "visibleTests": [
            {"id": "example-1", "input": {"nums": [1, 1, 2]}, "expected": {"returnValue": 2, "mutatedPrefix": [1, 2]}},
            {"id": "example-2", "input": {"nums": [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]}, "expected": {"returnValue": 5, "mutatedPrefix": [0, 1, 2, 3, 4]}},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"nums": []}, "expected": {"returnValue": 0, "mutatedPrefix": []}}],
    },
    53: {
        "visibleTests": [
            {"id": "example-1", "input": {"nums": [-2, 1, -3, 4, -1, 2, 1, -5, 4]}, "expected": 6},
            {"id": "example-2", "input": {"nums": [1]}, "expected": 1},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"nums": [-7, -2, -5]}, "expected": -2}],
    },
    67: {
        "visibleTests": [
            {"id": "example-1", "input": {"a": "11", "b": "1"}, "expected": "100"},
            {"id": "example-2", "input": {"a": "1010", "b": "1011"}, "expected": "10101"},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"a": "0", "b": "0"}, "expected": "0"}],
    },
    70: {
        "visibleTests": [
            {"id": "example-1", "input": {"n": 2}, "expected": 2},
            {"id": "example-2", "input": {"n": 3}, "expected": 3},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"n": 5}, "expected": 8}],
    },
    94: {
        "entrypoint": {"kind": "solution-method", "className": "Solution", "methodName": "inorderTraversal", "parameters": ["root"]},
        "serializers": {"root": "binary-tree"},
        "visibleTests": [
            {"id": "example-1", "input": {"root": [1, None, 2, 3]}, "expected": [1, 3, 2]},
            {"id": "example-2", "input": {"root": []}, "expected": []},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"root": [1]}, "expected": [1]}],
    },
    146: {
        "entrypoint": {"kind": "class-operations", "className": "LRUCache"},
        "visibleTests": [{
            "id": "example-1",
            "input": {"operations": ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], "arguments": [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]},
            "expected": [None, None, None, 1, None, -1, None, -1, 3, 4],
        }],
        "hiddenTests": [{"id": "hidden-1", "input": {"operations": ["LRUCache", "put", "get"], "arguments": [[1], [1, 9], [1]]}, "expected": [None, None, 9]}],
    },
    1189: {
        "visibleTests": [
            {"id": "example-1", "input": {"text": "nlaebolko"}, "expected": 1},
            {"id": "example-2", "input": {"text": "loonbalxballpoon"}, "expected": 2},
            {"id": "example-3", "input": {"text": "leetcode"}, "expected": 0},
        ],
        "hiddenTests": [{"id": "hidden-1", "input": {"text": "balloonballoonballoon"}, "expected": 3}],
    },
}
CURATED.update(ADDITIONAL_CURATED)


PROBE_RUNNER = r'''
import contextlib, io, json, math, sys

class ListNode:
    def __init__(self, val=0, next=None): self.val, self.next = val, next
class TreeNode:
    def __init__(self, val=0, left=None, right=None): self.val, self.left, self.right = val, left, right
class Node:
    def __init__(self, val=0, children=None): self.val, self.children = val, children or []

def linked(values):
    dummy = ListNode(); cursor = dummy
    for value in values or []: cursor.next = ListNode(value); cursor = cursor.next
    return dummy.next
def tree(values):
    if not values: return None
    nodes = [None if value is None else TreeNode(value) for value in values]
    children = iter(nodes[1:])
    for node in nodes:
        if node is not None: node.left = next(children, None); node.right = next(children, None)
    return nodes[0]
def normal(value):
    if isinstance(value, ListNode):
        output, seen = [], set()
        while value is not None and id(value) not in seen and len(output) < 1000:
            seen.add(id(value)); output.append(value.val); value = value.next
        return output
    if isinstance(value, TreeNode):
        output, queue = [], [value]
        while queue and len(output) < 1000:
            node = queue.pop(0)
            if node is None: output.append(None); continue
            output.append(node.val); queue.extend([node.left, node.right])
        while output and output[-1] is None: output.pop()
        return output
    if isinstance(value, dict): return {str(key): normal(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)): return [normal(item) for item in value]
    if value is None or isinstance(value, (str, int, float, bool)): return value
    return repr(value)

payload = json.loads(sys.stdin.read())
scope = globals()
with contextlib.redirect_stdout(io.StringIO()): exec(payload['source'], scope)
entry, inputs, serializers = payload['entrypoint'], payload['input'], payload.get('serializers', {})
if entry['kind'] == 'solution-method':
    args = {}
    for name in entry.get('parameters', []):
        value = inputs.get(name)
        args[name] = linked(value) if serializers.get(name) == 'linked-list' else tree(value) if serializers.get(name) == 'binary-tree' else value
    with contextlib.redirect_stdout(io.StringIO()): result = getattr(scope[entry.get('className', 'Solution')](), entry['methodName'])(*[args[name] for name in entry.get('parameters', [])])
    print(json.dumps({'result': normal(result), 'mutations': {name: normal(value) for name, value in args.items()}}, allow_nan=False))
elif entry['kind'] == 'class-operations':
    operations, arguments = inputs['operations'], inputs['arguments']; output, instance = [], None
    with contextlib.redirect_stdout(io.StringIO()):
        for index, operation in enumerate(operations):
            if index == 0: instance = scope[entry['className']](*arguments[index]); output.append(None)
            else: output.append(normal(getattr(instance, operation)(*arguments[index])))
    print(json.dumps({'result': output, 'mutations': {}}, allow_nan=False))
'''


def read_catalog():
    text = README.read_text(encoding="utf-8", errors="ignore")
    catalog = {}
    pattern = re.compile(r"\|\s*(\d+)\s*\|\s*\[([^\]]+)\][^|]*\|[^|]*\|\s*([^|\n]+)\s*\|")
    for number, title, difficulty in pattern.findall(text):
        catalog[int(number)] = {"title": title.strip(), "difficulty": difficulty.strip()}
    return catalog


def statement_from(source):
    try:
        tree = ast.parse(source)
        return ast.get_docstring(tree, clean=False) or ""
    except SyntaxError:
        match = re.search(r"(?:'''|\"\"\")([\s\S]*?)(?:'''|\"\"\")", source)
        return match.group(1) if match else ""


def normalized_python3_source(source):
    normalized = source.expandtabs(4)
    normalized = re.sub(r"(?m)^(\s*)print\s+([^\n]+)$", r"\1print(\2)", normalized)
    normalized = normalized.replace("xrange(", "range(").replace("sys.maxint", "sys.maxsize")
    normalized = normalized.replace(".iteritems()", ".items()").replace(".itervalues()", ".values()")
    return normalized


def solution_entrypoint(source):
    try:
        tree = ast.parse(source)
    except SyntaxError:
        tree = None
    if tree:
        solution = next((node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "Solution"), None)
        if solution:
            methods = [node for node in solution.body if isinstance(node, ast.FunctionDef) and not node.name.startswith("_")]
            if methods:
                method = methods[0]
                params = [arg.arg for arg in method.args.args if arg.arg != "self"]
                return {"kind": "solution-method", "className": "Solution", "methodName": method.name, "parameters": params}
        ignored = {"Node", "ListNode", "TreeNode", "RandomListNode", "SegmentTree", "SegementTree"}
        classes = [node for node in tree.body if isinstance(node, ast.ClassDef) and node.name not in ignored]
        if classes:
            return {"kind": "class-operations", "className": classes[-1].name}
    match = re.search(r"class\s+Solution(?:\([^)]*\))?\s*:[\s\S]*?\n\s+def\s+(\w+)\s*\(([^)]*)\)", source)
    if match:
        params = [item.strip().split("=")[0].strip() for item in match.group(2).split(",") if item.strip() and item.strip() != "self"]
        return {"kind": "solution-method", "className": "Solution", "methodName": match.group(1), "parameters": params}
    return {"kind": "unsupported"}


def split_top_level(text):
    parts, start, depth, quote, escaped = [], 0, 0, None, False
    for index, char in enumerate(text):
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
        elif char in "'\"":
            quote = char
        elif char in "[({":
            depth += 1
        elif char in "])}":
            depth -= 1
        elif char == "," and depth == 0:
            parts.append(text[start:index].strip())
            start = index + 1
    parts.append(text[start:].strip())
    return [part for part in parts if part]


def parse_literal(value):
    value = value.strip().rstrip(",")
    value = re.sub(r"\bnull\b", "None", value, flags=re.I)
    value = re.sub(r"\btrue\b", "True", value, flags=re.I)
    value = re.sub(r"\bfalse\b", "False", value, flags=re.I)
    try:
        return ast.literal_eval(value)
    except (ValueError, SyntaxError):
        if re.fullmatch(r"-?\d+", value):
            return int(value)
        if re.fullmatch(r"-?\d+\.\d+", value):
            return float(value)
        return None


def extract_examples(statement, parameters):
    normalized = statement.replace("\t", " ")
    pattern = re.compile(
        r"Input\s*:\s*([\s\S]*?)\n\s*Output\s*:\s*([^\n]+)", re.I
    )
    tests = []
    for index, match in enumerate(pattern.finditer(normalized), 1):
        raw_input = " ".join(line.strip() for line in match.group(1).splitlines()).strip()
        raw_output = match.group(2).split("Explanation:")[0].strip()
        expected = parse_literal(raw_output)
        if expected is None and raw_output.lower() not in {"none", "null"}:
            continue
        values = {}
        pieces = split_top_level(raw_input)
        assignment_mode = all("=" in piece for piece in pieces)
        if assignment_mode:
            for piece in pieces:
                name, raw_value = piece.split("=", 1)
                value = parse_literal(raw_value)
                if value is None and raw_value.strip().lower() not in {"none", "null"}:
                    values = {}
                    break
                values[name.strip()] = value
        elif len(parameters) == 1:
            value = parse_literal(raw_input)
            if value is not None or raw_input.lower() in {"none", "null"}:
                values[parameters[0]] = value
        elif len(pieces) == len(parameters):
            parsed = [parse_literal(piece) for piece in pieces]
            if all(value is not None for value in parsed):
                values = dict(zip(parameters, parsed))
        if values and all(name in values for name in parameters):
            tests.append({"id": f"example-{index}", "input": values, "expected": expected})
    return tests


def inferred_serializers(source, entrypoint):
    serializers = {}
    if entrypoint.get("kind") != "solution-method":
        return serializers
    parameters = entrypoint.get("parameters", [])
    hints = type_hints(source, parameters)
    for name in parameters:
        hint = hints.get(name, "").lower()
        if name == "root" and "TreeNode" in source:
            serializers[name] = "binary-tree"
        elif name in {"p", "q", "node1", "node2"} and "root" in parameters and "TreeNode" in source:
            serializers[name] = "tree-node-ref"
        elif ("treenode" in hint or name in {"p", "q"}) and "TreeNode" in source:
            serializers[name] = "binary-tree"
        elif name == "lists" and "ListNode" in source:
            serializers[name] = "linked-list-list"
        elif ("listnode" in hint or name in {"head", "headA", "headB", "l1", "l2"}) and "ListNode" in source:
            serializers[name] = "linked-list"
    return serializers


def starter_code(source, entrypoint):
    if entrypoint.get("kind") == "solution-method":
        params = ", ".join(["self", *entrypoint.get("parameters", [])])
        return f"class {entrypoint.get('className', 'Solution')}:\n    def {entrypoint['methodName']}({params}):\n        pass\n"
    if entrypoint.get("kind") == "codec-roundtrip":
        return f"class {entrypoint.get('className', 'Codec')}:\n    def serialize(self, root):\n        pass\n\n    def deserialize(self, data):\n        pass\n"
    if entrypoint.get("kind") == "class-operations":
        try:
            tree = ast.parse(source)
            cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == entrypoint["className"])
            lines = [f"class {cls.name}:"]
            for method in [node for node in cls.body if isinstance(node, ast.FunctionDef) and (node.name == "__init__" or not node.name.startswith("_"))]:
                args = [arg.arg for arg in method.args.args]
                lines.extend([f"    def {method.name}({', '.join(args)}):", "        pass", ""])
            return "\n".join(lines).rstrip() + "\n"
        except (SyntaxError, StopIteration):
            pass
    return "# This legacy problem requires a custom class entrypoint.\n"


def candidate_values(name, type_hint=""):
    hint = type_hint.lower().replace(" ", "")
    if "list[listnode" in hint: return [[[1, 4], [1, 3], [2, 6]], [[1], [2]], []]
    if "listnode" in hint: return [[1, 2, 3], [1], []]
    if "treenode" in hint: return [[1, None, 2], [1], []]
    named = {
        "s": ["abc", "a", ""], "p": ["a*", ".*", "a"], "word": ["AB", "A", ""],
        "digits": ["23", "2", ""], "text": ["leetcode", "abc", ""], "path": ["/a/./b/../c/", "/", "/home/"],
        "target": [3, 1, 0], "k": [2, 1, 3], "n": [3, 1, 2], "m": [3, 1, 2],
        "nums": [[1, 2, 3], [3, 1, 2], [1]], "nums1": [[1, 3], [1], []], "nums2": [[2], [2, 4], [1]],
        "height": [[1, 8, 6, 2, 5, 4, 8, 3, 7], [1, 1], [1, 2, 1]], "prices": [[7, 1, 5, 3, 6, 4], [1], [3, 2, 1]],
        "candidates": [[2, 3, 6, 7], [2, 3, 5], [1]], "intervals": [[[1, 3], [2, 6]], [[1, 2]], []],
        "matrix": [[[1, 2], [3, 4]], [[1]], [[0]]], "grid": [[[1, 2], [3, 4]], [[1]], [[0]]],
        "obstacleGrid": [[[0, 0], [0, 0]], [[0]], [[1]]], "board": [[['A', 'B'], ['C', 'D']], [['A']], []],
        "root": [[1, None, 2], [1], []], "head": [[1, 2, 3], [1], []], "l1": [[1, 2], [1], []], "l2": [[3, 4], [2], []],
        "lists": [[[1, 4], [1, 3], [2, 6]], [[1], [2]], []],
    }
    if name in named: return named[name]
    if "list[list[str" in hint: return [[['a']], [['a', 'b']], []]
    if "list[list[int" in hint: return [[[1, 2], [3, 4]], [[1]], []]
    if "list[str" in hint: return [["a", "b"], ["a"], []]
    if "list[int" in hint: return [[1, 2, 3], [1], []]
    if "str" in hint: return ["abc", "a", ""]
    if "bool" in hint: return [True, False, True]
    if "float" in hint: return [1.0, 2.5, 0.0]
    return [2, 1, 3]


def type_hints(source, parameters):
    hints = {}
    for name in parameters:
        match = re.search(rf":type\s+{re.escape(name)}\s*:\s*([^\n]+)", source)
        hints[name] = match.group(1).strip() if match else ""
    return hints


def probe_reference(source, manifest):
    entry = manifest["entrypoint"]
    if entry.get("kind") != "solution-method":
        return []
    probe_source = source if manifest["extraction"]["python3Compatible"] else normalized_python3_source(source)
    try:
        ast.parse(probe_source)
    except SyntaxError:
        return []
    parameters = entry.get("parameters", [])
    hints = type_hints(source, parameters)
    cases = []
    for variant in range(3):
        inputs = {name: candidate_values(name, hints.get(name, ""))[variant] for name in parameters}
        payload = {"source": probe_source, "entrypoint": entry, "serializers": manifest.get("serializers", {}), "input": inputs}
        try:
            completed = subprocess.run([sys.executable, "-c", PROBE_RUNNER], input=json.dumps(payload), text=True, capture_output=True, timeout=1.5)
            if completed.returncode != 0: continue
            output = json.loads(completed.stdout.strip().splitlines()[-1])
            comparator = manifest.get("judge", {}).get("comparator")
            expected = output["result"]
            if comparator == "mutation":
                expected = output["mutations"][manifest["judge"]["mutationParameter"]]
            cases.append({"id": f"generated-{variant + 1}", "input": inputs, "expected": expected})
        except (subprocess.TimeoutExpired, ValueError, KeyError, json.JSONDecodeError):
            continue
    return cases


def class_operation_probe(source, manifest):
    entry = manifest["entrypoint"]
    if entry.get("kind") != "class-operations":
        return []
    probe_source = source if manifest["extraction"]["python3Compatible"] else normalized_python3_source(source)
    try:
        tree = ast.parse(probe_source)
        cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == entry["className"])
    except (SyntaxError, StopIteration):
        return []
    methods = [node for node in cls.body if isinstance(node, ast.FunctionDef) and not node.name.startswith("_")]
    constructor = next((node for node in cls.body if isinstance(node, ast.FunctionDef) and node.name == "__init__"), None)
    init_names = [arg.arg for arg in constructor.args.args if arg.arg != "self"] if constructor else []
    mutators = {"put", "push", "add", "insert", "set", "update", "setValue", "addWord"}
    ordered = sorted(methods, key=lambda method: (method.name not in mutators, method.lineno))
    operations = [entry["className"]]
    arguments = [[candidate_values(name)[0] for name in init_names]]
    for method in ordered[:6]:
        names = [arg.arg for arg in method.args.args if arg.arg != "self"]
        operations.append(method.name)
        arguments.append([candidate_values(name)[0] for name in names])
    if len(operations) == 1:
        return []
    case_input = {"operations": operations, "arguments": arguments}
    payload = {"source": probe_source, "entrypoint": entry, "serializers": {}, "input": case_input}
    try:
        completed = subprocess.run([sys.executable, "-c", PROBE_RUNNER], input=json.dumps(payload), text=True, capture_output=True, timeout=1.5)
        if completed.returncode != 0: return []
        output = json.loads(completed.stdout.strip().splitlines()[-1])
        return [{"id": "generated-operations", "input": case_input, "expected": output["result"]}]
    except (subprocess.TimeoutExpired, ValueError, KeyError, json.JSONDecodeError):
        return []


def merge(base, override):
    result = dict(base)
    for key, value in override.items():
        if key == "judge":
            result[key] = {**result.get(key, {}), **value}
        else:
            result[key] = value
    return result


def build():
    catalog = read_catalog()
    manifests = []
    for path in sorted(SOURCE_ROOT.rglob("*.py")):
        match = re.match(r"(\d+)", path.name)
        if not match:
            continue
        number = int(match.group(1))
        source = path.read_text(encoding="utf-8", errors="ignore")
        entrypoint = solution_entrypoint(source)
        statement = statement_from(source)
        visible = extract_examples(statement, entrypoint.get("parameters", [])) if entrypoint.get("kind") == "solution-method" else []
        metadata = catalog.get(number, {})
        manifest = {
            "id": number,
            "sourcePath": str(path.relative_to(ROOT)).replace("\\", "/"),
            "title": metadata.get("title", f"Problem {number}"),
            "difficulty": metadata.get("difficulty", "Unknown"),
            "language": "python3",
            "entrypoint": entrypoint,
            "starterCode": starter_code(source, entrypoint),
            "serializers": inferred_serializers(source, entrypoint),
            "judge": {"comparator": "deep-equal", "timeoutMs": 5000},
            "visibleTests": visible[:3],
            "hiddenTests": visible[3:] or ([{**visible[-1], "id": "hidden-1"}] if visible else []),
            "extraction": {"source": "curated" if number in CURATED else "statement", "python3Compatible": True},
        }
        method_name = entrypoint.get("methodName", "")
        rtype_void = bool(re.search(r":rtype:\s*(?:void|None)\b", source, re.I))
        if rtype_void and entrypoint.get("parameters"):
            mutation_name = entrypoint["parameters"][0]
            manifest["judge"] = {"comparator": "mutation", "mutationParameter": mutation_name, "timeoutMs": 5000}
        elif method_name in {"threeSum", "fourSum", "permute", "permuteUnique", "subsets", "subsetsWithDup", "combinationSum", "combinationSum2", "generateParenthesis", "groupAnagrams", "letterCombinations", "removeInvalidParentheses"}:
            manifest["judge"]["comparator"] = "unordered"
        try:
            ast.parse(source)
        except SyntaxError:
            manifest["extraction"]["python3Compatible"] = False
        manifest = merge(manifest, CURATED.get(number, {}))
        manifest["starterCode"] = starter_code(source, manifest["entrypoint"])
        if not manifest.get("visibleTests"):
            generated = probe_reference(source, manifest) or class_operation_probe(source, manifest)
            if generated:
                manifest["visibleTests"] = generated[:2]
                manifest["hiddenTests"] = [{**generated[-1], "id": "hidden-generated"}]
                manifest["extraction"]["source"] = "reference-probe"
        manifest["judgeAvailable"] = bool(manifest.get("visibleTests")) and manifest["entrypoint"].get("kind") != "unsupported"
        manifests.append(manifest)

    public = {
        "schemaVersion": 1,
        "problems": [{key: value for key, value in item.items() if key != "hiddenTests"} for item in manifests],
    }
    server = {"schemaVersion": 1, "problems": manifests}
    PUBLIC_OUTPUT.write_text(json.dumps(public, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    SERVER_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SERVER_OUTPUT.write_text(json.dumps(server, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    available = [item for item in manifests if item["judgeAvailable"]]
    compatible = [item for item in manifests if item["extraction"]["python3Compatible"]]
    report = [
        "# LeetCode judge coverage",
        "",
        "This report is generated by `npm run build:leetcode`.",
        "",
        f"- Numbered problems: **{len(manifests)}**",
        f"- Problems with executable visible cases: **{len(available)}**",
        f"- Problems with server-side cases: **{sum(bool(item['hiddenTests']) for item in manifests)}**",
        f"- Python 3-compatible reference files: **{len(compatible)}**",
        f"- Problems requiring metadata/test curation: **{len(manifests) - len(available)}**",
        "",
        "## Problems requiring curation",
        "",
    ]
    report.extend(
        f"- {item['id']}. {item['title']} (`{item['sourcePath']}`)"
        for item in manifests if not item["judgeAvailable"]
    )
    REPORT_OUTPUT.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Generated {len(manifests)} manifests; {len(available)} have executable test cases.")


if __name__ == "__main__":
    build()
