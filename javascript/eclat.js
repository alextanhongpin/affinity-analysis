const { dataset7: transactions } = require('./core/data')

class Eclat {
  constructor ({ minsup = 2 }) {
    this.minsup = minsup
  }
  run (transactions) {
    const vert = this.mapToVerticalFormat(transactions)
    return this.mineFrequentItemsets(vert, 2)
  }
  uniqueItems (items) {
    return [...new Set(items)]
  }
  mapToVerticalFormat (transactions) {
    const vert = transactions.reduce((table, items, tid) =>
      this.uniqueItems(items).reduce((_table, item) => {
        _table[item] !== undefined ? _table[item].push(tid + 1) : _table[item] = [tid + 1]
        return _table
      }, table)
    , {})

    return Object.entries(vert).map(([item, tids]) => {
      return [[item], tids]
    })
  }
  union (arr1, arr2) {
    return this.uniqueItems([...arr1, ...arr2]).sort()
  }
  mineFrequentItemsets (transactions, k = 2) {
    const out = this.frequentItemsets(transactions, k)
    if (!out.length) return []

    return out.concat(this.mineFrequentItemsets(out, k + 1))
  }
  frequentItemsets (transactions, k = 2) {
    let output = []
    let found = {}
    transactions.forEach(([itemset1, tid1], i) => {
      transactions.forEach(([itemset2, tid2], j) => {
        if (i <= j) return
        const combinations = this.union(itemset1, itemset2)
        const tids = this.intersection(tid1, tid2)
        const key = combinations.join(',')
        if (combinations.length >= k && tids.length >= this.minsup && !found[key]) {
          found[key] = true
          output.push([combinations, tids])
        }
      })
    })
    return output
  }
  intersection (arr1, arr2) {
    const [target, compare] = arr1.length > arr2.length ? [arr1, new Set(arr2)] : [arr2, new Set(arr1)]
    return target.filter((item) => {
      return compare.has(item)
    })
  }
}

function main () {
  const eclat = new Eclat({ minsup: 2 })
  const model = eclat.run(transactions)
  console.log(model)
  // [ [ [ 'bread', 'butter' ], [ 1, 4, 8, 9 ] ],
  // [ [ 'bread', 'jam' ], [ 1, 8 ] ],
  // [ [ 'butter', 'jam' ], [ 1, 8 ] ],
  // [ [ 'butter', 'coke' ], [ 2, 4 ] ],
  // [ [ 'bread', 'milk' ], [ 5, 7, 8, 9 ] ],
  // [ [ 'butter', 'milk' ], [ 3, 6, 8, 9 ] ],
  // [ [ 'bread', 'butter', 'jam' ], [ 1, 8 ] ],
  // [ [ 'bread', 'butter', 'milk' ], [ 8, 9 ] ] ]
}

main()
