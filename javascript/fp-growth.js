
const Node = require('./core/node')
const Data = require('./core/data')

function constructTree (transactionDb, minSup = 1) {
  const listOfFrequentItems = collectFrequentItems(transactionDb, minSup)
  console.log('listOfFrequentItems:', listOfFrequentItems)

  const headerTable = constructHeaderTable(listOfFrequentItems)
  console.log('headerTable:', headerTable)

  // Second iteration through the transaction db
  const rootNode = new Node(null, null)
  transactionDb.forEach((transaction) => {
    let currNode = rootNode

    // Remove duplicates, sort it in order
    const validTransaction = [...new Set(transaction)].filter((itemName) => {
      return headerTable[itemName]
    }).sort((a, b) => {
      return headerTable[b][0] - headerTable[a][0]
    })

    validTransaction.forEach((itemName) => {
      if (currNode.itemName === itemName) {
        currNode.increment()
      } else {
        // If the item already exist...
        if (currNode.children[itemName]) {
          currNode.children[itemName].increment()
        } else {
          currNode.children[itemName] = new Node(itemName, currNode)
        }

        if (headerTable[itemName][1]) {
          // Already exist, change to something else
          let item = headerTable[itemName][1]
          while (item.nodeLink) {
            item = item.nodeLink
          }
          item.nodeLink = new Node(itemName, currNode)
        } else {
          // Link to header table pointer
          // Create one if it doesn't exist
          headerTable[itemName][1] = currNode.children[itemName]
        }

        currNode = currNode.children[itemName]
      }
    })
  })

  const conditionalPatternBases = getConditionalPatternBase(headerTable)
  console.log('conditionalPatternBases:', conditionalPatternBases)
  const conditionalFPTree = getConditionalFPTree(conditionalPatternBases)

  return conditionalFPTree
}

function main () {
  const transactionDb = Data.dataset4
  const minSup = 1
  const conditionalFPTree = constructTree(transactionDb, minSup)
  const freqItems = []
  mineTree(conditionalFPTree, freqItems)
}

function mineTree (conditionalFpTree, freqItemList) {
  Object.entries(conditionalFpTree).forEach(([key, store]) => {
    const trans = store.map(({ key }) => key)
    if (Object.entries(constructTree(trans, 3)).length) {
      mineTree(Object.entries(constructTree(trans, 3)), freqItemList)
    }
  })
}

main()

function collectFrequentItems (transactionDb, minimumSupport = 3) {
  const support = transactionDb.reduce((support, transaction) => {
    // Remove duplicate items from the transaction
    return [...new Set(transaction)].reduce((supp, item) => {
      if (!supp[item]) {
        supp[item] = 0
      }
      supp[item] += 1
      return supp
    }, support)
  }, {})

  const listOfFrequentItems = Object.entries(support)
  .filter(([itemName, score]) => {
    return score >= minimumSupport
  }).reduce((header, [itemName, score]) => {
    header[itemName] = score
    return header
  }, {})

  return listOfFrequentItems
}

function constructHeaderTable (listOfFrequentItems) {
  const headerTable = Object.entries(listOfFrequentItems)
  .reduce((headerTable, [itemName, score]) => {
    headerTable[itemName] = [score, null]
    return headerTable
  }, {})
  return headerTable
}

function traverseParent (link) {
  let node = link
  const conditionalPatternBase = []
  // let patterns = []
  do {
    conditionalPatternBase.push(node.itemName)
    // patterns.push(node.itemName)
    node = node.parentLink
  } while (node && node.parentLink)

  return conditionalPatternBase.filter(item => item !== null).reverse()
}

function traverseNodeLink (headerTable, itemName) {
  let link = headerTable[itemName][1]
  const conditionalPatternBases = []
  do {
    const conditionalPatternBase = traverseParent(link.parentLink)
    conditionalPatternBases.push(conditionalPatternBase)
    link = link.nodeLink
  } while (link && (link.nodeLink || link.parentLink))

  const validPatternBases = conditionalPatternBases.filter(item => item.length)// Take only non-empty arrays
  .map((items) => {
    return items.join(',')
  })
  console.log('validPatternBases:', validPatternBases)

  const patternBaseWithCount = validPatternBases.reduce((tree, a) => {
    if (!tree[a]) {
      tree[a] = 0
    }
    tree[a] += 1
    return tree
  }, {})

  return Object.entries(patternBaseWithCount)
  .map(([key, score]) => {
    return { key: key.split(','), score }
  })
}

function getConditionalPatternBase (headerTable) {
  const items = Object.keys(headerTable)
  const conditionalPatternBases = items.reduce((tree, item) => {
    const conditionalPatternBase = traverseNodeLink(headerTable, item)
    if (conditionalPatternBase.length) {
      tree[item] = conditionalPatternBase
    }
    return tree
  }, {})
  return conditionalPatternBases
}

function getConditionalFPTree (conditionalPatternBases) {
  const items = Object.keys(conditionalPatternBases)

  items.map(item => {
    const patternBases = conditionalPatternBases[item].map((item) => {
      return item.key
    })
    const sortedPatternBases = patternBases.sort((a, b) => {
      return b.length - a.length
    })

    console.log('sortedPatternBase:', sortedPatternBases)
    if (sortedPatternBases.length === 1) {
      return sortedPatternBases[0]
    }
    // The conditional FP-tree
    const root = new Node(null, null)
    sortedPatternBases.forEach((items) => {
      let node = root

      items.forEach((item) => {
        if (node.children[item] && node.children[item].itemName === item) {
          node.children[item].increment()
        } else {
          node.children[item] = new Node(item, node)
        }
        node = node.children[item]
      })
    })

    console.log('root', root)

    Object.entries(root).map((item) => {

      // root.children[item]
    })
    // console.log('intersect:', intersect(sortedPatternBases), 'ori:', sortedPatternBases)
  })

  return conditionalPatternBases
}

function intersect (arr) {
  if (arr.length <= 1) {
    return arr[0]
  }
  // Sort the arrays by items count - we only want to find the
  // intersection of the least items in the array
  const sortedArr = arr.sort((a, b) => a.length - b.length)
  const head = sortedArr[0]
  const tail = sortedArr.slice(1)
  return head.filter((item) => {
    return tail.every((i) => new Set(i).has(item))
  })
}
