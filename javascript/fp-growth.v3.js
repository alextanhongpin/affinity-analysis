function constructSupport (transactionDb) {
  const frequentItems = transactionDb.reduce((tree, transaction) => {
    return transaction.reduce((tree, item) => {
      if (!tree[item]) {
        tree[item] = 0
      }
      tree[item] += 1
      return tree
    }, tree)
  }, {})
  return frequentItems
}

function getSetOfFrequentItems (transactionDb) {
  // The set of frequent items, F
  const frequentItems = transactionDb.reduce((f, item) => {
    f[item.sort().join('')] = true
    return f
  }, {})
  return Object.keys(frequentItems).map((item) => {
    return item.split('')
  })
}

// function constructListOfFrequentItems (frequentItems, minimumSupport = 1) {
//   return Object.entries(frequentItems).filter(([name, score]) => {
//     return score >= minimumSupport
//   }).reduce((frequentItems, [name, score]) => {
//     frequentItems[name] = score
//     return frequentItems
//   }, {})
// }

function sortAsListOfFrequentItems (support, frequentItems) {
  // Sort F in support-descending order as FList, the list of frequent items
  return frequentItems.map(transaction => {
    return transaction.sort((a, b) => {
      if (support[a] === support[b]) {
        return b - a
      }
      return support[b] - support[a]
    })
  })
}

class Node {
  constructor (itemName, parentLink) {
    // Each node of the item-prefix subtree consists of three fields
    this.itemName = itemName
    this.parentLink = parentLink
    this.count = 1
    this.nodeLink = null
    this.children = {}
  }
  increment () {
    this.count += 1
  }
}

function insertTree (p, P, T) {
  const N = T.children[p]
  if (N) {
    N.increment()
  } else {
    const newN = new Node(p.itemName)
    newN.parentNode = T
  }
}

function constructFPTree (transactionDb, minimumSupport = 1) {
  // Collect F, the set of frequent items
  const setOfFrequentItems = getSetOfFrequentItems(transactionDb)
  console.log('setOfFrequentItems:', setOfFrequentItems)

  const listOfFrequentItems = sortAsListOfFrequentItems(constructSupport(transactionDb), transactionDb)
  console.log('listOfFrequentItems:', listOfFrequentItems)

  // Create the root of an FP-tree, T and label it as null
  const T = new Node(null)

  return T
}

function main () {
  const transactionDb = [
    ['a', 'b', 'd', 'e'],
    ['b', 'c', 'e'],
    ['a', 'b', 'd', 'e'],
    ['a', 'b', 'c', 'e'],
    ['a', 'b', 'c', 'd', 'e'],
    ['b', 'c', 'd']
  ]

  const fpTree = constructFPTree(transactionDb, 3)
  console.log('fpTree:', fpTree)
}

main()
