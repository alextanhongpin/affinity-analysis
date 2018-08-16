def main():
    threshold = 2
    dataset = [['bread', 'butter', 'jam'],
        ['butter', 'coke'],
        ['butter', 'milk'],
        ['bread', 'butter', 'coke'],
        ['bread', 'milk'],
        ['butter', 'milk'],
        ['bread', 'milk'],
        ['bread', 'butter', 'milk', 'jam'],
        ['bread', 'butter', 'milk']]
    print(dataset)
    s = {}
    items = frozenset()
    for (tid, txs) in enumerate(dataset):
        for t in txs:
            s[t] = s[t] | frozenset([tid]) if s.get(t) else frozenset([tid])
        items = items | frozenset(txs)
    print(s, items)

# def eclat(prefix, items):
#     if len(items) == 0: return
    
#     for i in items:
    

main()
