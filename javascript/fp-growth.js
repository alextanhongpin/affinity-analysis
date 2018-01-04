
const words = require('../data/simple.json')

// Frequent Pattern Growth
class FPGrowth {
  constructor (transactions) {
    // Header Table contains the mapping for the
    // frequent items in the transactions for sorting
    this.transactions = transactions
    this.headerTable = {}
    this.table = {}
    this.totalScore = 0
    this.minSupport = 3
  }
  // Step 1: Count all the items in the transactions
  // Step 2: Remove those that are below the minimum support
  generateHeaderTable () {
    this.totalScore = this.transactions.length
    this.headerTable = this.transactions.reduce((headerTable, rows) => {
      return rows.reduce((header, row) => {
        if (!header[row]) {
          header[row] = 0
        }
        header[row] += 1
        return header
      }, headerTable)
    }, {})

    console.log('headerTable before pruning:', this.headerTable)
    this.headerTable = Object.entries(this.headerTable).filter(([label, score]) => {
      return score >= this.minSupport
    }).reduce((a, [key, value]) => {
      a[key] = value
      return a
    }, {})
    console.log('headerTable after pruning', this.headerTable)
  }
  // Step 3: Sort the list according to the count of each item
  sortItems (items) {
    return [...new Set(items)].filter((a) => {
      return this.headerTable[a]
    }).sort((a, b) => {
      const bScore = this.headerTable[b] || 0
      const aScore = this.headerTable[a] || 0
      return bScore - aScore
    })
  }
  // Step 4: Build the tree
  mapFrequentPattern () {
    console.log('sorted', this.transactions.map((row) => this.sortItems(row)).sort())
    this.table = {}
    this.transactions.forEach(row => {
      let items = this.table
      this.sortItems(row).forEach(item => {
        this.totalScore += 1
        if (items[item]) {
          items[item].count += 1
        } else {
          items[item] = { count: 1, next: {} }
        }
        items = items[item].next
      })
    })
  }
  find (items) {
    const sorted = this.sortItems(items)
    let found = {...this.table}
    for (let i = 0; i < sorted.length; i += 1) {
      const item = sorted[i]
      if (found[item]) {
        found = found[item].next
      } else {
        break
      }
    }
    return found
  }
  prune () {
    //
  }
}

console.log(words)
const fp = new FPGrowth(words)
fp.generateHeaderTable()
fp.mapFrequentPattern()
console.log(fp)
console.log(JSON.stringify(fp.table, null, 2))

// console.log('found framework:\n', fp.find(['framework'], null, 2))
