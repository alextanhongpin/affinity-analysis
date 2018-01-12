const { dataset6 } = require('./core/data')
const Node = require('./core/node')
const HeaderTable = require('./core/header-table')

function sortAndFilterRow (row, headerTable) {
  return [...new Set(row)] // Remove duplicate
  .filter(item => headerTable[item] !== null && headerTable[item] !== undefined)
  .sort((a, b) => {
    // Sort alphabetically first
    if (headerTable[a][0] === headerTable[b][0]) {
      return a > b
    }
    return headerTable[b][0] - headerTable[a][0]
  })
}

function linkHeaderToNode (headerTable, itemName, nodeLink) {
  if (!headerTable[itemName][1]) {
    headerTable[itemName][1] = nodeLink
  } else {
    let node = headerTable[itemName][1]
    while (node.nodeLink) {
      node = node.nodeLink
    }
    node.nodeLink = nodeLink
  }
}

function constructConditionalFPTree (transactionDb, headerTable) {
  const rootNode = new Node(null, null)
  transactionDb.forEach(row => {
    let root = rootNode
    sortAndFilterRow(row, headerTable).forEach(item => {
      const child = root.children[item]
      if (child && child.itemName === item) {
        child.increment()
      } else {
        root.children[item] = new Node(item, root)
        linkHeaderToNode(headerTable, item, root.children[item])
      }

      root = root.children[item]
    })
  })
  return rootNode
}

function constructConditionalPatternBase (fpTree) {

}

function main () {
  // Variables initialization
  const minimumSupport = 3
  const transactionDb = dataset6

  const headerTable = HeaderTable(transactionDb, minimumSupport)
  const fpTree = constructConditionalFPTree(transactionDb, headerTable)

  console.log('headerTable:', headerTable)
  console.log('fpTree:', fpTree)
}

main()
