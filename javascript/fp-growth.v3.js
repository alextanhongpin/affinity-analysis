
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

    console.log('validTransaction:', validTransaction)

    console.log('currNode:', currNode)

    validTransaction.forEach((itemName) => {
      if (currNode.itemName === itemName) {
        currNode.increment()
      } else {
        // If the item already exist...
        if (currNode.children[itemName]) {
          currNode.children[itemName].increment()
        } else {
          currNode.children[itemName] = new Node(itemName, currNode.itemName)
        }

        if (headerTable[itemName][1]) {
          // Already exist, change to something else
          let item = headerTable[itemName][1]
          console.log('check:', item.nodeLink)
          while (item.nodeLink) {
            item = item.nodeLink
          }
          console.log('check_end:', item)
          item.nodeLink = new Node(itemName, currNode.itemName)// currNode.children[itemName]
          console.log('item:', item)
        } else {
          // Link to header table pointer
          // Create one if it doesn't exist
          headerTable[itemName][1] = currNode.children[itemName]
        }
        currNode = currNode.children[itemName]
      }
    })
  })

  console.log('rootNode', JSON.stringify(rootNode, null, 2))
  console.log('headerTable', JSON.stringify(headerTable, null, 2))
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
