function removeDuplicateRows (transactions) {
  let setRows = {}
  let uniqueItems = []
  transactions.forEach((rows) => {
    const key = [...new Set(rows)].sort().join(',')
    if (!setRows[key]) {
      uniqueItems.push(rows)
    }
    setRows[key] = true
  })
  return uniqueItems
}
// createHeader returns a dictionary with the frequency of the items
// in the transactions
function createHeader (transactions) {
  const reduceRow = (header, item) => {
    if (header[item] === null || header[item] === undefined) {
      header[item] = 0
    }
    header[item] += 1
    return header
  }
  const reduceTransactions = (header, rows) => {
    return rows.reduce(reduceRow, header)
  }
  return transactions.reduce(reduceTransactions, {})
}

// pruneHeader removes keys with values below the minimum support
function pruneHeader (header, minSupport = 1) {
  const selectAboveMin = ([ key, score ]) => {
    return score >= minSupport
  }
  const reduceObject = (obj, [ key, score ]) => {
    obj[key] = score
    return obj
  }
  return Object.entries(header).filter(selectAboveMin).reduce(reduceObject, {})
}

// sortRow will sort each rows in the transactions based on the header score
function sortRow (items, header) {
  const uniqueItems = [...new Set(items)]
  const filteredItems = uniqueItems.filter(item => {
    return header[item] !== undefined && header[item] !== null
  })

  return filteredItems.sort((a, b) => {
    // If the score is the same, sort by alphabets
    if (header[b] === header[a]) {
      return b.charCodeAt(0) - a.charCodeAt(0)
    }
    return header[b] - header[a]
  })
}

// sortTransactions
function sortTransactions (transactions, header) {
  return transactions.map(row => sortRow(row, header))
}

// createTree
function createTree (transactions) {
  const tree = {}

  for (let i = 0; i < transactions.length; i += 1) {
    const rows = transactions[i]

    for (let j = 0; j < rows.length; j += 1) {
      const prevPrevIndex = j - 2
      const prevIndex = j - 1
      const currIndex = j
      const nextIndex = j + 1

      const prevPrev = rows && rows[prevPrevIndex] ? rows[prevPrevIndex] : null
      const prev = rows && rows[prevIndex] ? rows[prevIndex] : null
      const curr = rows[currIndex]
      const next = rows && rows[nextIndex] ? rows[nextIndex] : null

      if (!tree[prev]) {
        tree[prev] = {}
      }

      if (!tree[prev][curr]) {
        tree[prev][curr] = { count: 0, next, prevPrev }
      }
      tree[prev][curr].count += 1
    }
  }

  return tree
}

function main () {
  const transactions = [['a', 'b', 'c'],
  ['a', 'd', 'e'],
  ['b', 'c', 'd'],
  ['a', 'b', 'c', 'd'],
  ['b', 'c'],
  ['a', 'b', 'd'],
  ['d', 'e'],
  ['a', 'b', 'c', 'd'],
  ['c', 'd', 'e'],
  ['a', 'b', 'c']]
  const header = createHeader(removeDuplicateRows(transactions))
  console.log('header:', header)

  const prunnedHeader = pruneHeader(header, 3)
  console.log('prunnedHeader:', prunnedHeader)

  const sortedTransactions = sortTransactions(transactions, prunnedHeader)
  console.log('sortedTransactions:', sortedTransactions)

  // root
  const tree = createTree(sortedTransactions)

  console.log('tree:', JSON.stringify(tree, null, 2))

  for (let k in tree) {
    for (let j in tree[k]) {
      if (tree[k][j].count > 1) {
        console.log(tree[k][j].next, j)
      }
    }
  }
}
main()
