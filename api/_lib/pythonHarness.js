export const RESULT_MARKER = "__LC_RESULT__";

const encode = (value) => Buffer.from(value, "utf8").toString("base64");

export function buildPythonHarness(config, userCode) {
  const config64 = encode(JSON.stringify(config));
  const code64 = encode(userCode);
  return `# Generated Code Lab judge harness.
import base64, contextlib, io, json, math, random, time, traceback
# Starter code carries LeetCode's type hints (List[int], Optional[TreeNode]),
# so the names they use have to exist before the submission is compiled.
from typing import Any, Deque, Dict, List, Optional, Set, Tuple, Union

class ListNode:
    def __init__(self, val=0, next=None): self.val, self.next = val, next
class TreeNode:
    def __init__(self, val=0, left=None, right=None): self.val, self.left, self.right = val, left, right
class Node:
    def __init__(self, val=0, children=None, neighbors=None):
        self.val, self.children = val, children or []
        self.neighbors = neighbors or []
        self.left = self.right = self.next = self.random = self.prev = self.child = None

def _decode_linked(values):
    dummy, cursor = ListNode(), None
    cursor = dummy
    for value in values or []:
        cursor.next = ListNode(value); cursor = cursor.next
    return dummy.next

def _decode_tree(values, node_class=TreeNode):
    if not values: return None
    nodes = [None if value is None else node_class(value) for value in values]
    children = iter(nodes[1:])
    for node in nodes:
        if node is not None:
            node.left = next(children, None); node.right = next(children, None)
    return nodes[0]

def _find_tree_node(root, wanted):
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is None: continue
        if node.val == wanted: return node
        queue.extend([node.left, node.right])
    return None

def _normal(value):
    if isinstance(value, ListNode):
        result, seen = [], set()
        while value is not None and id(value) not in seen and len(result) < 10000:
            seen.add(id(value)); result.append(value.val); value = value.next
        return result
    if isinstance(value, (TreeNode, Node)) and hasattr(value, 'left'):
        result, queue = [], [value]
        while queue and len(result) < 10000:
            node = queue.pop(0)
            if node is None: result.append(None); continue
            result.append(node.val); queue.extend([node.left, node.right])
        while result and result[-1] is None: result.pop()
        return result
    if isinstance(value, dict): return {str(key): _normal(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)): return [_normal(item) for item in value]
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)): return str(value)
    if value is None or isinstance(value, (str, int, float, bool)): return value
    return repr(value)

def _decode(name, value, serializers):
    kind = serializers.get(name)
    if kind == 'linked-list': return _decode_linked(value)
    if kind == 'linked-list-list': return [_decode_linked(item) for item in value or []]
    if kind == 'binary-tree': return _decode_tree(value)
    if kind == 'perfect-tree-node': return _decode_tree(value, Node)
    return value

def _unordered(value):
    if isinstance(value, list): return sorted([_unordered(item) for item in value], key=lambda item: json.dumps(item, sort_keys=True))
    if isinstance(value, dict): return {key: _unordered(item) for key, item in value.items()}
    return value

def _sort_key(item):
    return json.dumps(item, sort_keys=True, default=str)

def _frequency_sorted(actual, expected):
    if not isinstance(actual, str): return False
    if sorted(actual) != sorted(expected or ''): return False
    runs = []
    for char in actual:
        if runs and runs[-1][0] == char: runs[-1][1] += 1
        else: runs.append([char, 1])
    if len(set(char for char, _ in runs)) != len(runs): return False
    counts = [count for _, count in runs]
    return all(counts[index] >= counts[index+1] for index in range(len(counts)-1))

def _reorganized(actual, expected):
    if not isinstance(actual, str): return False
    if expected == '': return actual == ''
    if sorted(actual) != sorted(expected or ''): return False
    return all(actual[index] != actual[index-1] for index in range(1, len(actual)))

def _valid_knight_tour(actual, expected):
    if expected == []: return actual == []
    if not isinstance(actual, list) or not actual: return False
    size = len(actual)
    if any(not isinstance(row, list) or len(row) != size for row in actual): return False
    position = {}
    for row_index, row in enumerate(actual):
        for col_index, step in enumerate(row):
            if not isinstance(step, int) or step in position: return False
            position[step] = (row_index, col_index)
    if sorted(position) != list(range(size * size)) or position[0] != (0, 0): return False
    jumps = {(1,2),(2,1),(-1,2),(-2,1),(1,-2),(2,-1),(-1,-2),(-2,-1)}
    for step in range(size * size - 1):
        (r1, c1), (r2, c2) = position[step], position[step+1]
        if (r2-r1, c2-c1) not in jumps: return False
    return True

def _next_levels(root):
    levels, level = [], [root] if root else []
    while level:
        values, cursor = [node.val for node in level], level[0]
        for wanted in values[1:]:
            cursor = cursor.next
            if cursor is None or cursor.val != wanted: return None
        if cursor.next is not None: return None
        levels.append(values)
        level = [child for node in level for child in (node.left, node.right) if child is not None]
    return levels

def _equal(actual, expected, judge, call_args):
    comparator = judge.get('comparator', 'deep-equal')
    if comparator == 'float':
        rel, abs_ = judge.get('relativeTolerance', 1e-6), judge.get('absoluteTolerance', 1e-6)
        if isinstance(expected, list):
            if not isinstance(actual, list) or len(actual) != len(expected): return False
            return all(math.isclose(float(a), float(b), rel_tol=rel, abs_tol=abs_) for a, b in zip(actual, expected))
        return math.isclose(float(actual), float(expected), rel_tol=rel, abs_tol=abs_)
    if comparator == 'unordered': return _unordered(actual) == _unordered(expected)
    if comparator == 'unordered-outer':
        # The collection order is free, but each element keeps its own order
        # (permutations, board layouts, partitions).
        if not isinstance(actual, list) or not isinstance(expected, list): return False
        return sorted(actual, key=_sort_key) == sorted(expected, key=_sort_key)
    if comparator == 'any-of': return any(actual == option for option in (expected or []))
    if comparator == 'any-of-unordered': return any(_unordered(actual) == _unordered(option) for option in (expected or []))
    if comparator == 'node-value':
        # The solution returns a tree node; only its value identifies the answer.
        if isinstance(actual, list): return bool(actual) and actual[0] == expected
        return actual == expected
    if comparator == 'frequency-sorted-string': return _frequency_sorted(actual, expected)
    if comparator == 'reorganized-string': return _reorganized(actual, expected)
    if comparator == 'valid-knight-tour': return _valid_knight_tour(actual, expected)
    if comparator == 'prefix-mutation':
        name, prefix = judge.get('mutationParameter'), expected.get('mutatedPrefix', [])
        return actual == expected.get('returnValue') and _normal(call_args.get(name, []))[:len(prefix)] == prefix
    if comparator == 'mutation':
        mutated = _normal(call_args.get(judge.get('mutationParameter')))
        # An emptied structure serialises as [], matching how it was supplied.
        if mutated is None: mutated = []
        return mutated == expected
    if comparator == 'next-pointers': return _next_levels(call_args.get(judge.get('mutationParameter', 'root'))) == expected
    if comparator == 'balanced-bst':
        root = _decode_tree(actual)
        def inspect(node):
            if node is None: return ([], 0, True)
            left, left_h, left_ok = inspect(node.left); right, right_h, right_ok = inspect(node.right)
            return (left + [node.val] + right, max(left_h, right_h) + 1, left_ok and right_ok and abs(left_h - right_h) <= 1)
        inorder, _, balanced = inspect(root)
        return balanced and inorder == call_args.get('nums', [])
    if comparator == 'no-triples-counts':
        return isinstance(actual, str) and actual.count('a') == call_args.get('a', call_args.get('A', 0)) and actual.count('b') == call_args.get('b', call_args.get('B', 0)) and 'aaa' not in actual and 'bbb' not in actual
    if comparator == 'rearranged-no-adjacent':
        source = call_args.get(judge.get('sourceParameter'), [])
        return isinstance(actual, list) and sorted(actual) == sorted(source) and all(actual[index] != actual[index-1] for index in range(1, len(actual)))
    if comparator == 'group-sizes':
        sizes = call_args.get(judge.get('sourceParameter'), [])
        if not isinstance(actual, list): return False
        flat = [person for group in actual for person in group]
        return sorted(flat) == list(range(len(sizes))) and all(all(0 <= person < len(sizes) and sizes[person] == len(group) for person in group) for group in actual)
    return actual == expected

exec(compile(base64.b64decode('${code64}'), '<submission>', 'exec'), globals())
_CONFIG = json.loads(base64.b64decode('${config64}'))

def _run_case(case):
    entry, serializers = _CONFIG['entrypoint'], _CONFIG.get('serializers', {})
    started, captured, call_args = time.perf_counter(), io.StringIO(), {}
    try:
        with contextlib.redirect_stdout(captured):
            if entry['kind'] == 'solution-method':
                raw = case.get('input', {})
                call_args = {name: _decode(name, raw.get(name), serializers) for name in entry.get('parameters', []) if serializers.get(name) != 'tree-node-ref'}
                for name in entry.get('parameters', []):
                    if serializers.get(name) == 'tree-node-ref': call_args[name] = _find_tree_node(call_args.get('root'), raw.get(name))
                instance = globals()[entry.get('className', 'Solution')]()
                actual = _normal(getattr(instance, entry['methodName'])(*[call_args[name] for name in entry.get('parameters', [])]))
            elif entry['kind'] == 'class-operations':
                payload, actual, instance = case.get('input', {}), [], None
                operations, arguments = payload.get('operations', []), payload.get('arguments', [])
                op_serializers = _CONFIG.get('operationSerializers', {})
                for index, operation in enumerate(operations):
                    raw_args = arguments[index] if index < len(arguments) else []
                    args = [_decode(f'{index}.{arg_index}', value, op_serializers) for arg_index, value in enumerate(raw_args)]
                    if index == 0: instance = globals()[entry['className']](*args); actual.append(None)
                    else: actual.append(_normal(getattr(instance, operation)(*args)))
            elif entry['kind'] == 'linked-list-cycle':
                # 'pos' is the index the tail links back to (-1 for no cycle).
                raw = case.get('input', {})
                head = _decode_linked(raw.get('head'))
                nodes, cursor = [], head
                while cursor is not None:
                    nodes.append(cursor); cursor = cursor.next
                position = raw.get('pos', -1)
                if nodes and position is not None and position >= 0: nodes[-1].next = nodes[position]
                call_args = {'head': head}
                instance = globals()[entry.get('className', 'Solution')]()
                returned = getattr(instance, entry['methodName'])(head)
                if isinstance(returned, bool): actual = returned
                elif returned is None: actual = -1
                else: actual = next((index for index, node in enumerate(nodes) if node is returned), -1)
            elif entry['kind'] == 'clone-graph':
                raw = case.get('input', {})
                adjacency = raw.get('adjList') or raw.get('edges') or []
                built = {index + 1: Node(index + 1) for index in range(len(adjacency))}
                for index, neighbours in enumerate(adjacency):
                    built[index + 1].neighbors = [built[value] for value in neighbours]
                source = built.get(1)
                call_args = {'node': source}
                instance = globals()[entry.get('className', 'Solution')]()
                clone = getattr(instance, entry['methodName'])(source)
                if clone is None: actual = []
                else:
                    seen, stack = {}, [clone]
                    while stack:
                        current = stack.pop()
                        if current.val in seen: continue
                        seen[current.val] = current
                        stack.extend(neighbour for neighbour in current.neighbors if neighbour.val not in seen)
                    actual = [sorted(neighbour.val for neighbour in seen[key].neighbors) for key in sorted(seen)]
            elif entry['kind'] == 'multilevel-flatten':
                raw = case.get('input', {})
                built = [Node(value) for value in raw.get('values', [])]
                for index, node in enumerate(built):
                    node.child = None
                    node.next = built[index + 1] if index + 1 < len(built) else None
                    node.prev = built[index - 1] if index else None
                for parent, child in raw.get('childLinks', []):
                    head_child = built[child]
                    if head_child.prev is not None: head_child.prev.next = None
                    head_child.prev = None
                    built[parent].child = head_child
                for left, right in raw.get('cuts', []):
                    built[left].next = None
                    built[right].prev = None
                source = built[0] if built else None
                call_args = {'head': source}
                instance = globals()[entry.get('className', 'Solution')]()
                flattened = getattr(instance, entry['methodName'])(source)
                actual, seen = [], set()
                while flattened is not None and id(flattened) not in seen:
                    seen.add(id(flattened)); actual.append(flattened.val); flattened = flattened.next
            elif entry['kind'] == 'codec-roundtrip':
                call_args = {'root': _decode('root', case.get('input', {}).get('root'), serializers)}
                codec = globals()[entry['className']]()
                actual = _normal(codec.deserialize(codec.serialize(call_args['root'])))
            else: raise ValueError('This problem does not have an executable entrypoint.')
        # A problem that returns a node serialises an empty answer as [], not None.
        if actual is None and entry.get('returnSerializer'): actual = []
        passed = _equal(actual, case.get('expected'), _CONFIG.get('judge', {}), call_args)
        return {'id': case['id'], 'status': 'passed' if passed else 'wrong_answer', 'passed': passed, 'input': case.get('input'), 'expected': case.get('expected'), 'actual': actual, 'stdout': captured.getvalue()[-8000:], 'runtimeMs': round((time.perf_counter()-started)*1000, 3), 'hidden': case.get('hidden', False)}
    except Exception as error:
        return {'id': case['id'], 'status': 'runtime_error', 'passed': False, 'input': case.get('input'), 'expected': case.get('expected'), 'actual': None, 'stdout': captured.getvalue()[-8000:], 'error': str(error), 'traceback': traceback.format_exc(limit=4)[-8000:], 'runtimeMs': round((time.perf_counter()-started)*1000, 3), 'hidden': case.get('hidden', False)}

_cases = [_run_case(case) for case in _CONFIG['tests']]
_summary = {'passed': sum(case['passed'] for case in _cases), 'failed': sum(not case['passed'] for case in _cases), 'total': len(_cases)}
print('${RESULT_MARKER}' + json.dumps({'status': 'completed', 'cases': _cases, 'summary': _summary}, separators=(',', ':')))
`;
}
