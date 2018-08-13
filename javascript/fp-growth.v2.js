
class FPTree {
  constructor (name, count, parentNode) {
    this.name = name
    this.count = count
    this.parentNode = parentNode
    // this.nodeLink = null
    this.children = {}
  }
  increment () {
    this.count += 1
  }

  print (i = 0) {
    console.log(''.padStart(i * 2), `${this.name}:${this.count}`)
    for (let child in this.children) {
      this.children[child].print(i + 1)
    }
  }
}

function main () {
  let data = {
    '001': [...'rzhjp'],
    '002': [...'zyxwvuts'],
    '003': ['z'],
    '004': [...'rxnos'],
    '005': [...'yrxzqtp'],
    '006': [...'yzxeqstm']
  }

  let [ fpTree, headerTable ] = constructFPTree(Object.values(data), 3)

  fpTree.print()

  let frequentItemsets = fpGrowth(headerTable, [])
  console.log('frequentItemsets', frequentItemsets)
}

main()

function conditionalPatternBase (node, path = []) {
  if (node && node.name === 'root') return path
  path.push(node.name)
  return conditionalPatternBase(node.parentNode, path)
}

function fpGrowth (tree, a = [], result = []) {
  for (let ai in tree) {
    let results = []
    let beta = a.concat(ai)

    // Push the solution
    result.push(beta)

    for (let prefix in tree[ai]) {
      let path = tree[ai][prefix]
      let pattern = conditionalPatternBase(path.parentNode)
      
      // Repeat it for the number of count
      results.push(...Array(path.count).fill(pattern))
    }
    if (results.length) {
      let [_, headerTable] = constructFPTree(results, 3)
      fpGrowth(headerTable, beta, result)
    }
  }
  return result
}

function constructFPTree (transactions, minimumSupport) {
  // Scan the transaction database once
  let freqItems = {}

  for (let tx of transactions) {
    for (let item of [...new Set(tx)]) {
      freqItems[item] = freqItems[item] ? freqItems[item] + 1 : 1
    }
  }
  // console.log('freqItems', freqItems)
  // Filter items below the minimum level
  for (let key in freqItems) {
    if (freqItems[key] < minimumSupport) {
      delete (freqItems[key])
    }
  }

  // Sort in descending order
  let sortedFreqItems = Object.entries(freqItems)
    .sort(([k1, v1], [k2, v2]) =>
      v2 === v1
        ? k2 === k1
          ? 0
          : k2 > k1 ? -1 : 1
        : v2 > v1 ? 1 : -1
    )
  // console.log('sortedFreqItems', sortedFreqItems)

  let sortedAndFilteredTransactions = transactions.map(tx => {
    let filtered = tx.filter(i => freqItems[i])
      .map(i => [i, freqItems[i]])

    // Sort by score, if they are the same, sort alphabetically
    let sorted = filtered.sort(([k1, v1], [k2, v2]) =>
      v2 === v1
        ? k2 === k1
          ? 0
          : k2 > k1 ? -1 : 1
        : v2 > v1 ? 1 : -1
    ).map(([k, v]) => k)
    return sorted
  })
  // console.log('sortedAndFiltered', sortedAndFilteredTransactions)

  // Create header table
  let headerTable = {}

  // Create a root FP-tree
  let root = new FPTree('root', 0, null)
  for (let t of sortedAndFilteredTransactions) {
    insertTree(t, root, headerTable)
  }
  // root.print()
  // console.log('headerTable', headerTable)
  return [ root, headerTable ]
}

function insertTree ([p, ...P], T, headerTable) {
  if (!p) return

  // Check if the tree has the branch
  if (T.children[p]) {
    let node = T.children[p]
    node.increment()
    insertTree(P, node, headerTable)
  } else {
    // Create a new tree node, set the value to 1,
    // link parents back to T
    let node = new FPTree(p, 1, T)
    T.children[p] = node

    // Create a link to the header table to ease traversing later
    headerTable[p] = headerTable[p]
      ? [...headerTable[p], node] // Append to existing item at the end
      : [node]

    insertTree(P, node, headerTable)
  }
}
