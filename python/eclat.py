from functools import reduce
from random import shuffle

def main():
    dataset = [['bread', 'butter', 'jam'],
               ['butter', 'coke'],
               ['butter', 'milk'],
               ['bread', 'butter', 'coke'],
               ['bread', 'milk'],
               ['butter', 'milk'],
               ['bread', 'milk'],
               ['bread', 'butter', 'milk', 'jam'],
               ['bread', 'butter', 'milk']]

    # Shuffle to ensure the results are not purely deterministic on order
    # Note that this will change the transaction ids
    shuffle(dataset)
    print('dataset', dataset)

    items = reduce(lambda x, y: set(x) | set(y), dataset)

    db = vertical_format(dataset)
    print('db', db)
    solution = {}
    eclat(set(), items, db, 2, solution)
    print('solution')

    sorted_keys = sorted(solution, key=lambda k: len(solution[k]), reverse=True)
    pr = lambda x: ', '.join([str(i) for i in sorted(x)])
    for key in sorted_keys:
        print('{{{}}} => {{{}}}'.format(pr(key), 
                                        pr(solution[key])))

def vertical_format(db):
    # Holds the vertical format data - the key will be the items, and the value will be a unique set of transaction ids
    result = {}
    for id, row in enumerate(db):
        for i in row:
            result[i] = result.get(i, set()) | set([id])
    return result


def eclat(prefix, items, db, min_sup=2, solution={}, k = 2):
    items_copy = items.copy()
    for item in items:
        new_prefix = prefix | set([item])
        (tids, freq) = frequency(new_prefix, db)
        if freq >= min_sup:
            if len(new_prefix) >= k:
                solution[frozenset(new_prefix)] = tids
            # Remove items for each iteration, to avoid duplications
            items_copy.discard(item)
            eclat(new_prefix, items_copy, db, min_sup, solution)

def frequency(prefix, db):
    # Transaction ids for each item with the prefix
    tids = [db[item] for item in prefix]
    # Find the intersection of all the transaction ids for each items
    intersect_tids = reduce(lambda x, y: x & y, tids)
    return (intersect_tids, len(intersect_tids))

main()
