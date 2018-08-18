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

    dataset = [['mp3-player', 'usb-charger', 'book-dct', 'book-ths'],
               ['mp3-player', 'usb-charger'],
               ['usb-charger', 'mp3-player', 'book-dct', 'book-ths'],
               ['usb-charger'],
               ['book-dct', 'book-ths']]

    items = reduce(lambda x, y: frozenset(x) | frozenset(y), dataset)
    items = [frozenset([i]) for i in items]
    db = vertical_format(dataset)

    n = 10000
    def run_eclat():
        solution = {}
        eclat(frozenset(), set(items), db, 2, solution)
        return solution
    (elapsed, solution) = benchmark(n, run_eclat)

    print('found {} solutions:'.format(len(solution)), elapsed)
    print_solution(solution)
    print()

    def run_eclat2():
        solution = {}
        eclat2(items, db, 2, solution)
        return solution
    (elapsed, solution) = benchmark(n, run_eclat2)

    print('found {} solutions:'.format(len(solution)), elapsed)
    print_solution(solution)

def benchmark(n, fn):
    times = [0 for i in range(n)]
    result = None
    for i in range(n):
        t0 = time.time()
        result = fn()
        t1 = time.time()
        times[i] = (t1 - t0)
    return (sum(times) / n * 1000, result)


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
        id_set = set([id])
        # Let the empty set hold all value, so that intersection with any empty prefix will return itself
        result[frozenset()] |= id_set
        for i in row:
            key = frozenset([i])
            result[key] = result.get(key, set()) | id_set
    return result


def eclat(prefix, items, db, minsup = 2, solution = {}):
    db = db.copy()
    items_copy = items.copy()
    for item in items:
        items_copy.discard(item)
        union_items = prefix | item
        intersection_tids = db[prefix] & db[item]
        if len(intersection_tids) >= minsup:
            db[union_items] = intersection_tids
            solution[union_items] = intersection_tids
            eclat(union_items, items_copy, db, minsup, solution)

def eclat2(R, tid, minsup = 2, S = {}):
    for i, X in enumerate(R):
        if len(tid[X]) >= minsup:
            S[X] = tid[X]
        E = []
        for j, Y in enumerate(R):
            if j <= i: continue
            tid[X | Y] = tid[X] & tid[Y]
            if len(tid[X | Y]) >= minsup:
                E.append(X | Y)
            eclat2(E, tid, minsup, S)

main()
