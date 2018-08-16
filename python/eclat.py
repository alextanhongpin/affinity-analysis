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

    (db, items) = vertical_format(dataset)
    print('db', db)
    solution = {}
    eclat(set(), items, db, 2, solution)
    print('solution')
    for s in solution:
        print(s, '=>', solution[s])


def vertical_format(db):
    '''converts the db transactions into unique set of transaction ids for each items'''
    # Holds the vertical format data - the key will be the items, and the value will be a unique set of transaction ids
    vert = {}

    # Holds a unique set of items
    items = set()

    # Iterate through each transactions in the database
    for tid, txs in enumerate(db):

        # Append each item to the set
        items = items | set(txs)

        # For each item in transactions....
        for t in txs:
            # Append the transaction ids into the vertical format dictionary
            vert[t] = vert.get(t, set()) | set([tid])
    return (vert, items)


def eclat(prefix, items, db, min_sup=2, solution={}, k = 2):
    for item in items:
        if item in prefix: continue
        new_prefix = prefix | set([item])
        (tids, freq) = frequency(new_prefix, db)
        if freq >= min_sup:
            if len(new_prefix) >= k:
                solution[frozenset(new_prefix)] = tids
            eclat(new_prefix, items - set([item]), db, min_sup, solution)

def frequency(prefix, db):
    # Transaction ids for each item with the prefix
    tids = [db[item] for item in prefix]
    # Find the intersection of all the transaction ids for each items
    intersect_tids = reduce(lambda x, y: x & y, tids)
    return (intersect_tids, len(intersect_tids))

main()
