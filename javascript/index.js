
class HeaderTable {
  constructor ({ transactions, minSupport }) {
    this.transactions = transactions
    this.minSupport = minSupport
    this.table = {}
  }
  make () {
    const reduceTransaction = (_header, item) => {
      if (_header[item] === undefined) {
        _header[item] = 0
      }
      _header[item] += 1
      return _header
    }

    const reduceTransactions = (header, transaction) => {
      return transaction.reduce(reduceTransaction, header)
    }
    const filterMinItems = ([key, score]) => {
      return this.isAboveMin(score)
    }
    const flattenTable = (_table, [key, score]) => {
      const nodeLink = null
      _table[key] = [score, nodeLink]
      return _table
    }
    const table = this.transactions.reduce(reduceTransactions, {})
    this.table = Object.entries(table).filter(filterMinItems).reduce(flattenTable, {})
  }
  isAboveMin (score) {
    return score >= this.minSupport
  }

  hasRootNodeLink (item) {
    return this.find(item)[1] !== null
  }
  setRootNodeLink (item, nodeLink) {
    const node = this.find(item)
    node[1] = nodeLink
  }
  setChildNodeLink (item, nodeLink) {
    let child = this.find(item)[1]
    while (child.nodeLink) {
      child = child.nodeLink
    }
    child.nodeLink = nodeLink
  }
  itemScore (item) {
    return this.table[item] && this.table[item][0]
  }
  itemSet (items) {
    return [...new Set(items)]
  }
  sortByAlphabet (a, b) {
    return a > b
  }
  sortByScore (a, b) {
    return this.itemScore(b) - this.itemScore(a)
  }
  sortItems (items) {
    const filteredItems = this.itemSet(items).filter(item => this.isAboveMin(this.itemScore(item)))
    return filteredItems.sort((a, b) => a === b ? this.sortByAlphabet(a, b) : this.sortByScore(a, b))
  }
  find (item) {
    return this.table[item]
  }
  ascendParentLink (node, items = []) {
    let parent = node.parentLink
    const count = parent.count
    while (parent.parentLink) {
      items.push(parent.itemName)
      parent = parent.parentLink
    }
    return Array(count).fill(items)
  }
  traverseNodeLink (node, items = []) {
    let next = node.nodeLink
    while (next && (next.nodeLink || next.parentLink)) {
      items.push(this.ascendParentLink(next))
      next = next.nodeLink
    }
    return items.reduce((a, b) => a.concat(b), [])
  }
  minePrefix () {
    const items = Object.keys(this.table)
    items.forEach((item) => {
      const nodeLink = this.table[item][1]
      const prefixPaths = this.traverseNodeLink(nodeLink)
      console.log('pref:', nodeLink.itemName, prefixPaths)
    })
  }
}

class Node {
  constructor ({ itemName, parentLink = null }) {
    this.count = 1
    this.itemName = itemName
    this.parentLink = parentLink
    this.nodeLink = null
    this.children = {}
  }
  contains (item) {
    return this.children[item]
  }
  increment (item) {
    const child = this.children[item]
    child.count += 1
    return child
  }
  addChild (item) {
    this.children[item] = new Node({ itemName: item, parentLink: this })
    return this.children[item]
  }
}

class FPGrowth {
  constructor ({ minSupport }) {
    this.minSupport = minSupport
    this.headerTable = {}
    this.root = new Node({ itemName: 'null' })
  }

  run (transactions) {
    this.headerTable = new HeaderTable({ transactions, minSupport: this.minSupport })
    this.headerTable.make()

    this.root = transactions.reduce((root, transaction) => {
      const sortedFrequentSets = this.headerTable.sortItems(transaction)
      let node = this.root

      sortedFrequentSets.reduce((node, item) => {
        const hasChild = node.contains(item)
        const newNode = hasChild ? node.increment(item) : node.addChild(item)
        if (!hasChild) this.linkNode(item, newNode)
        return newNode
      }, node)

      return node
    }, null)

    console.log(this.headerTable.minePrefix())

    return transactions
  }
  linkNode (item, nodeLink) {
    const table = this.headerTable
    table.hasRootNodeLink(item) ? table.setChildNodeLink(item, nodeLink)
                                : table.setRootNodeLink(item, nodeLink)
  }
  print (root = this.root, i = 0) {
    const multiplier = 2
    if (!root) return
    if (root && root.itemName === 'null') {
      console.log('FP-Tree:')
      console.log('null')
      return this.print(root.children, i + multiplier)
    }
    Object.values(root).forEach((node) => {
      const itemName = `'-${node.itemName}`.padStart(i * multiplier)
      const count = node.count
      console.log(`${itemName}:${count}`)

      this.print(node.children, i + 1)
    })
  }
}

module.exports = FPGrowth
