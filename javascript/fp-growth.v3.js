
class Node {
  constructor (itemName, parentLink) {
    this.parentLink = parentLink
    this.itemName = itemName
    this.count = 1
    this.children = {}
    this.nodeLink = null
  }
  increment () {
    this.count += 1
  }
}

function main () {
  const transactionDb = [
    ['M', 'O', 'N', 'K', 'E', 'Y'],
    ['D', 'O', 'N', 'K', 'E', 'Y'],
    ['M', 'A', 'K', 'E'],
    ['M', 'U', 'C', 'K', 'Y'],
    ['C', 'O', 'O', 'K', 'I', 'E']
  ]
  // const transactionDb = [
  //   ['A', 'B', 'D', 'E'],
  //   ['B', 'C', 'E'],
  //   ['A', 'B', 'D', 'E'],
  //   ['A', 'B', 'C', 'E'],
  //   ['A', 'B', 'C', 'D', 'E'],
  //   ['B', 'C', 'D']
  // ]
  // First iteration through the transaction db
  const listOfFrequentItems = collectFrequentItems(transactionDb)
  console.log('listOfFrequentItems:', listOfFrequentItems)

  const headerTable = constructHeaderTable(listOfFrequentItems)
  console.log('headerTable:', headerTable)

  // Second iteration through the transaction db
  const rootNode = new Node(null, null)
  console.log('rootNode', rootNode)
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

  console.log(JSON.stringify(conditionalFPTree, null, 2))
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
    // NodeLink
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
    // Check if the support is still valid
    // if (node.count >= 3) {
    //   // Merge
    //   const out = patterns.concat(node.itemName)
    //   conditionalPatternBase.push(out)
    // }
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
    // const flattenedItems = items.map((item) => {
    //   if (Array.isArray(item)) {
    //     return item.join(',')
    //   }
    //   return item
    // })
    // return i.concat(flattenedItems)
    // if (Array.isArray(item)) {
    //   return item.join
    // }
    return items.join(',')
  }) // Join them

  const output = [...new Set(validPatternBases)].map((item) => item.split(',')) // Remove duplicates
  return output
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
  return items.map(item => {
    const commonItems = intersect(conditionalPatternBases[item])
    return [item, commonItems]
  })
}

function intersect (arr) {
  if (arr.length <= 1) {
    return arr
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
