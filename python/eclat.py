from functools import reduce
from random import shuffle
import time

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
    # shuffle(dataset)
    # print('dataset', dataset)


    # dataset = [['mp3-player', 'usb-charger', 'book-dct', 'book-ths'],
    #            ['mp3-player', 'usb-charger'],
    #            ['usb-charger', 'mp3-player', 'book-dct', 'book-ths'],
    #            ['usb-charger'],
    #            ['book-dct', 'book-ths']]

    items = reduce(lambda x, y: frozenset(x) | frozenset(y), dataset)
    solution = {}
    db = vertical_format(dataset)
    t0 = time.time()
    eclat(frozenset(), items, db, 2, solution)
    t1 = time.time()

    print('found {} solutions:'.format(len(solution)), (t1 - t0) * 1000)
    print_solution(solution)


def print_solution(solution):
    sorted_keys = sorted(solution, key=lambda k: len(k), reverse=True)
    pr = lambda x: ', '.join([str(i) for i in sorted(x)])
    for key in sorted_keys:
        print('{{{}}} => {{{}}}'.format(pr(key),
                                        pr(solution[key])))

def vertical_format(db):
    # Holds the vertical format data - the key will be the items, and the value will be a unique set of transaction ids
    result = {}
    result[frozenset()] = set()
    for id, row in enumerate(db):
        # Let the empty set hold all value, so that intersection with any empty prefix will return itself
        result[frozenset()] |= set([id])
        for i in row:
            key = frozenset([i])
            result[key] = result.get(key, set()) | set([id])
    return result


def eclat(prefix, items, db, min_sup=2, solution={}):
    items_copy = set(items)
    for item in items:
        items_copy.discard(item)

        item_set = frozenset([item])
        new_prefix = prefix | item_set
        tids = db[prefix] & db[item_set]

        if len(tids) >= min_sup:
            db[new_prefix] = tids
            solution[new_prefix] = tids
            eclat(new_prefix, items_copy, db, min_sup, solution)

main()
