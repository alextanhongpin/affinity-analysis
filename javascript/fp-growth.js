// const transactions = [
//   ['a', 'b'],
//   ['b', 'c', 'd'],
//   ['a', 'c', 'd', 'e'],
//   ['a', 'd', 'e'],
//   ['a', 'b', 'c'],
//   ['a', 'b', 'c', 'd'],
//   ['a'],
//   ['a', 'b', 'c'],
//   ['a', 'b', 'd'],
//   ['b', 'c', 'e']
// ]

// FrequentPatternGrowth
class FPGrowth {
  constructor (transactions) {
    // Header Table contains the mapping for the
    // frequent items in the transactions for sorting
    this.transactions = transactions
    this.headerTable = {}
    this.table = {}
    this.totalScore = 0
  }
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
  }
  sortItems (items) {
    // [...new Set(items)]
    // return items.sort((a, b) => {
    //   return this.headerTable[b] - this.headerTable[a]
    // })
    return items
  }
  mapFrequentPattern () {
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
    const sorted = items // this.sortItems(items)
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
}

const words = [
  'hello',
  'hoi',
  'awesome',
  'alter',
  'crazy',
  'increase',
  'decrease',
  'paper',
  // FP?
  'already',
  'already',
  'already',
  'already',
  'already'
].map(word => [...new Set(word.split(''))])

console.log(words)
const fp = new FPGrowth(words)
fp.generateHeaderTable()
fp.mapFrequentPattern()
console.log(fp)
console.log(JSON.stringify(fp.table, null, 2))
console.log('found:', JSON.stringify(fp.find('hell'.split('')), null, 2))
console.log('found al:', fp.find('al'.split(''), null, 2))
