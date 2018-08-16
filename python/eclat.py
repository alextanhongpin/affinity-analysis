from functools import reduce


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

    items = reduce(lambda x, y: set(x) | set(y), dataset)

    db = vertical_format(dataset)
    print('db', db)
    solution = {}
    eclat(set(), items, db, 2, solution)
    print('solution')
    for s in solution:
        print(s, '=>', solution[s])

def vertical_format(txs):
    # Holds the vertical format data - the key will be the items, and the value will be a unique set of transaction ids
    vert_txs = {}
    for tid, tx_i in enumerate(txs):
        for i in tx_i:
            vert_txs[i] = vert_txs.get(i, set()) | set([tid])
    return vert_txs


def eclat(prefix, items, db, min_sup=2, solution={}, k = 2):
    items_copy = items.copy()
    for item in items:
        if item in prefix: continue
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
