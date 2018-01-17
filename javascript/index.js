
class HeaderTable {
  constructor ({ transactions, minSupport }) {
    this.transactions = transactions
    this.minSupport = minSupport
    this.table = {}
  }
  make () {
    const reduceTransactions = (header, transaction) => {
      return transaction.reduce(this.accumulateScore, header)
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
  accumulateScore (header, item) {
    if (header[item] === undefined) {
      header[item] = 0
    }
    header[item] += 1
    return header
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
  isEqualScore (a, b) {
    return this.itemScore(b) === this.itemScore(a)
  }
  sortItems (items) {
    const filteredItems = this.itemSet(items).filter(item => this.isAboveMin(this.itemScore(item)))
    return filteredItems.sort((a, b) => this.isEqualScore(a, b) ? this.sortByAlphabet(a, b) : this.sortByScore(a, b))
  }
  find (item) {
    return this.table[item]
  }
  ascendParentLink (node, items = []) {
    if (!node) return
    let parent = node
    const count = parent.count

    while (parent && parent.parentLink) {
      parent = parent.parentLink
      if (parent && parent.itemName) {
        items.push(parent.itemName)
      }
    }

    return Array(count).fill(items)
  }
  traverseNodeLink (node, items = []) {
    let next = node
    do {
      items.push(this.ascendParentLink(next))
      next = next && next.nodeLink
    } while (next && (next.nodeLink || next.parentLink))

    return items.reduce((a = [], b = []) => a.concat(b), []).filter((a) => a.length)
  }
  minePrefix (table, item, path = '') {
    const nodeLink = table[item][1]
    const frequentItemsets = this.traverseNodeLink(nodeLink)
    return [path + nodeLink.itemName, frequentItemsets]
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
    return this.children && this.children[item]
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
  }

  run (transactions, prefixPath = '', itemsets = []) {
    const headerTable = new HeaderTable({ transactions, minSupport: this.minSupport })
    headerTable.make()

    if (!transactions) return
    this.root = new Node({ itemName: null })
    this.root = transactions.reduce((root, transaction) => {
      if (!transaction.length) return root
      const sortedFrequentSets = headerTable.sortItems(transaction)
      let node = this.root

      sortedFrequentSets.reduce((node, item) => {
        const hasChild = node.contains(item)
        const newNode = hasChild ? node.increment(item) : node.addChild(item)
        if (!hasChild) this.linkNode(headerTable, item, newNode)
        return newNode
      }, node)

      return node
    }, null)

    Object.keys(headerTable.table).forEach((prefix) => {
      const frequentItemsets = headerTable.minePrefix(headerTable.table, prefix, prefixPath)
      const _prefix = frequentItemsets[0]
      const _frequentItemsets = frequentItemsets[1]
      // console.log(`FrequentItemsets for prefixPath: ${_prefix} =`, _frequentItemsets)
      itemsets.push(_prefix)
      this.run(_frequentItemsets, _prefix, itemsets)
    })

    return itemsets
  }
  linkNode (table, item, nodeLink) {
    table.hasRootNodeLink(item) ? table.setChildNodeLink(item, nodeLink)
                                : table.setRootNodeLink(item, nodeLink)
  }
  print (root = this.root, i = 0) {
    const multiplier = 2
    if (!root) return
    if (root && root.itemName === null) {
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
