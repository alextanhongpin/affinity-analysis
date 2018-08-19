def set_enumeration(prefix, items):
    items_copy = items.copy()
    for i in items:
        if i in prefix: continue
        items_copy.remove(i)
        # print(sorted(prefix), sorted(prefix | set(i)))
        yield (sorted(prefix), sorted(prefix | set(i)))
        yield from set_enumeration(prefix | set(i), items_copy)

def main():
    A = ['a', 'b', 'c', 'd']
    result = 'digraph mygraph {\n  node [shape=plaintext]\n'
    for (root, branch) in set_enumeration(set(), A):
        result += '  "{{{}}}" -> "{{{}}}"'.format(', '.join(root), ', '.join(branch))
        result += '\n'
    result += '}'
    print(result)
    with open('set_enumeration.dot', 'w') as file:
        file.write(result)

main()
