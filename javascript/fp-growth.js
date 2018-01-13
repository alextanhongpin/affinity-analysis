const { dataset3: data } = require('./core/data')
const Node = require('./core/node')
const HeaderTable = require('./core/header-table')
const printTree = require('./core/print')

function sortAndFilterRow (row, headerTable) {
  return [...new Set(row)] // Remove duplicate
  .filter(item => {
    const score = headerTable[item]
    const isFrequent = score !== null && score !== undefined
    return isFrequent
  })
  .sort((a, b) => {
    const scoreA = headerTable[a][0]
    const scoreB = headerTable[b][0]

    if (scoreA === scoreB) {
      // Sort alphabetically in ascending order
      return a > b
    }
    // Sort by score, from highest to lowest
    return scoreB - scoreA
  })
}

function linkHeaderToNode (headerTable, itemName, nodeLink) {
  const currNodeLink = headerTable[itemName][1]
  if (!currNodeLink) {
    headerTable[itemName][1] = nodeLink
    return
  }
  let node = currNodeLink
  while (node.nodeLink) {
    node = node.nodeLink
  }
  node.nodeLink = nodeLink
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

function constructConditionalPatternBase (headerTable, items, itemName, prefs = []) {
  const conditionalPatternBases = traverseNodeLink(headerTable[itemName][1])
  const prefixPath = prefs && prefs.length ? prefs : [itemName]

  const _headerTable = HeaderTable(conditionalPatternBases, 3)
  const fpTree = constructConditionalFPTree(conditionalPatternBases, _headerTable)
  console.log(`FP-Tree for ${prefixPath}:`)
  printTree(fpTree)

  const frequentList = Object.keys(_headerTable)
  const frequentListWithScore = Object.entries(_headerTable)
  console.log(`F-list for ${prefixPath}: ${frequentListWithScore.map((item) => item[0] + ':' + item[1][0])}`)
  console.log()

  appendFrequentItems(items, prefixPath, frequentList)

  frequentList.forEach((itemNm) => {
    const newPrefs = [itemName, itemNm].concat(prefs)
    constructConditionalPatternBase(_headerTable, items, itemNm, newPrefs)
  })
}

function fpSet (items) {
  return [...new Set(items)].sort().join(',')
}

function appendFrequentItems (items, prefixPath, frequentList) {
  const union = fpSet(prefixPath.concat(frequentList))
  const prefix = fpSet(prefixPath)
  items.add(union)
  items.add(prefix)
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
    if (conditionalPatternBase.length) {
      Array(count).fill(conditionalPatternBase).forEach((patternBase) => {
        conditionalPatternBases.push(patternBase)
      })
    }
    currNode = currNode.nodeLink
  } while (currNode && (currNode.nodeLink || currNode.parentLink))

  return conditionalPatternBases
}

function main () {
  const minimumSupport = 3
  const transactionDb = data

  const headerTable = HeaderTable(transactionDb, minimumSupport)
  const fpTree = constructConditionalFPTree(transactionDb, headerTable)

  printTree(fpTree)

  const items = new Set()
  const prefixPaths = Object.keys(headerTable)
  prefixPaths.forEach((prefix) => {
    constructConditionalPatternBase(headerTable, items, prefix)
  })

  const itemsArr = [...items]
  const frequentItems = itemsArr.map((i) => sortAndFilterRow(i.split(','), headerTable))
  console.log('frequentItems:', frequentItems, frequentItems.length)
}

main()
