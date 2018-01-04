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
    return items.sort((a, b) => {
      return this.headerTable[b] - this.headerTable[a]
    })
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
}

const words = [['golang', 'string'], ['json', 'golang'], ['golang', 'for'], ['golang', 'file'], ['golang', 'http'], ['map', 'golang'], ['golang', 'array'], ['golang', 'struct'], ['golang', 'example'], ['slice', 'golang'], ['time', 'golang'], ['golang', 'type'], ['golang', 'api'], ['golang', 'server'], ['golang', 'interface'], ['golang', 'github'], ['golang', 'test'], ['golang', 'install'], ['golang', 'package'], ['python'], ['golang', 'error'], ['docker', 'golang'], ['golang', 'channel'], ['golang', 'tutorial'], ['golang', 'set'], ['RISING'], ['golang', '1.9'], ['golang', '1.8.1'], ['golang', 'dep'], ['golang', 'zap'], ['golang', 'chi'], ['golang', '1.8'], ['golang', 'graphql'], ['kubernetes'], ['cobra', 'golang'], ['vscode'], ['jetbrains', 'golang'], ['vscode', 'golang'], ['udemy'], ['golang', 'custom', 'error'], ['golang', 'grpc'], ['aws', 'lambda', 'golang'], ['golang', 'float', 'to', 'string'], ['golang', 'global', 'variables'], ['golang', 'context'], ['golang', 'map', 'reduce'], ['golang', 'microservices'], ['golang', 'firebase'], ['glide', 'golang'], ['golang', 'select', 'channel'], ['golang', 'html', 'parser']]
console.log(words)
const fp = new FPGrowth(words)
fp.generateHeaderTable()
fp.mapFrequentPattern()
console.log(fp)
console.log(JSON.stringify(fp.table, null, 2))

console.log('found golang:', fp.find(['golang'], null, 2))
