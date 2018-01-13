const { dataset5 } = require('./core/data')
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

function constructConditionalPatternBase (headerTable, items, prefix, prefs = []) {
  const itemName = prefix
  const conditionalPatternBases = traverseNodeLink(headerTable[itemName][1])

  const prefixPath = prefs && prefs.length ? prefs : [itemName]
  // console.log(`${prefixPath} CondPatternBase`, conditionalPatternBases)

  const _headerTable = HeaderTable(conditionalPatternBases, 3)
  const fpTree = constructConditionalFPTree(conditionalPatternBases, _headerTable)
  console.log()
  console.log(`${prefixPath} FP-Tree`)
  printTree(fpTree)

  const frequentList = Object.keys(_headerTable)
  const frequentListWithScore = Object.entries(_headerTable)
  console.log(`${prefixPath} F-list: ${frequentListWithScore.map((item) => item[0] + ':' + item[1][0])}`)
  console.log()

  items.push([prefixPath.concat(frequentList), prefixPath])

  frequentList.forEach((itemNm) => {
    const newPrefs = [itemName, itemNm].concat(prefs)
    constructConditionalPatternBase(_headerTable, items, itemNm, newPrefs)
  })
}

function ascendParentLink (node) {
  const conditionalPatternBase = []
  let currNode = node
  do {
    currNode = currNode.parentLink
    if (currNode.itemName) {
      conditionalPatternBase.push(currNode.itemName)
    }
  } while (currNode && currNode.parentLink)
  return conditionalPatternBase
}

function traverseNodeLink (node) {
  const conditionalPatternBases = []
  let currNode = node
  do {
    const count = currNode.count
    const conditionalPatternBase = ascendParentLink(currNode)
    for (let i = 0; i < count; i += 1) {
      conditionalPatternBases.push(conditionalPatternBase)
    }
    currNode = currNode.nodeLink
  } while (currNode && (currNode.nodeLink || currNode.parentLink))

  // const conditionalPatternBase = ascendParentLink(currNode)
  // conditionalPatternBases.push(conditionalPatternBase)

  return conditionalPatternBases.filter(i => i.length)
}

function main () {
  // Variables initialization
  const minimumSupport = 3
  const transactionDb = dataset5

  const headerTable = HeaderTable(transactionDb, minimumSupport)
  const fpTree = constructConditionalFPTree(transactionDb, headerTable)
  printTree(fpTree)
  const items = []
  const prefixPaths = Object.keys(headerTable)
  prefixPaths.forEach((prefix) => {
    constructConditionalPatternBase(headerTable, items, prefix)
  })

  const flattenedItems = items.reduce((a, b) => a.concat(b), []).map((items) => {
    return [...new Set(items.sort())].join(',')
  })
  const unique = [...new Set(flattenedItems)].map((item) => item.split(','))
  console.log('items:', unique, unique.length)
}
function printTree (tree, i = 1) {
  const multiplier = 2
  if (!tree.itemName) {
    console.log('null'.padStart(i * multiplier) + ':' + tree.count)
  } else {
    console.log(tree.itemName.padStart(i * multiplier) + ':' + tree.count)
  }
  const keys = Object.keys(tree.children)
  keys.forEach((item) => {
    printTree(tree.children[item], i + 1)
  })
}
main()
