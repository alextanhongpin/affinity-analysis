
// createHeader returns a dictionary with the frequency of the items
// in the transactions
function createHeader (transactions) {
  const reduceRow = (header, item) => {
    if (!header[item]) {
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
    return header[item]
  })
  return filteredItems.sort((a, b) => {
    return header[b] - header[a]
  })
}

function sortTransactions (transactions, header) {
  return transactions.map(row => sortRow(row, header))
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
  const header = createHeader(transactions)
  console.log(header)

  const prunnedHeader = pruneHeader(header, 3)
  console.log(prunnedHeader)

  const sortedTransactions = sortTransactions(transactions, prunnedHeader)
  console.log(sortedTransactions)
  // let tree = {
  //   root: {}
  // }

  let links = {}

  // root
  const tree = {
    start: {},
    links: {
      a: {}
    }
  }

  for (let i = 0; i < sortedTransactions.length; i += 1) {
    for (let j = 0; j < sortedTransactions[i].length; j += 1) {
      const rows = sortedTransactions[i]
      const curr = rows[j]
      const next = j + 1 < rows.length ? rows[j + 1] : null

      if (j === 0) {
        if (!tree.start[curr]) {
          tree.start[curr] = {}
        }
        if (!tree.start[curr][next]) {
          tree.start[curr][next] = {count: 0}
        }
        tree.start[curr][next].count += 1
      } else {
        const prev = rows[j - 1]
        if (!tree.links[curr]) {
          tree.links[curr] = {}
        }
        if (!tree.links[curr][next]) {
          tree.links[curr][next] = { prev, count: 0 }
        }
        tree.links[curr][next].count += 1
      }
    }
  }

  console.log(tree)
  // sortedTransactions.forEach((row) => {
  //   let dict = tree.root
  //   row.forEach((item, i) => {
  //     if (!dict[item]) {
  //       dict[item] = {
  //         count: 0,
  //         next: null,
  //         prev: i - 1 > -1 ? row[i - 1] : null
  //       }
  //     }
  //           // Link similar items through pointers
  //     if (!links[item]) {
  //       links[item] = []
  //     }
  //     links[item].push(dict[item])
  //     dict[item].count += 1
  //     if (i !== row.length - 1) {
  //       dict[item].next = {}
  //     }
  //     dict = dict[item].next
  //   })
  // })

  console.log(JSON.stringify(tree, null, 2))
  console.log(JSON.stringify(links, null, 2))
}
main()
