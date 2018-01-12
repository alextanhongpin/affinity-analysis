function construct (transactionDb) {
  return transactionDb.reduce((table, row) => {
    return row.reduce((table, item) => {
      if (table[item] === null || table[item] === undefined) {
        table[item] = 0
      }
      table[item] += 1
      return table
    }, table)
  }, {})
}

function prune (headerTable, minimumSupport = 1) {
  return Object.entries(headerTable).filter(([itemName, score]) => {
    return score >= minimumSupport
  }).reduce((table, [itemName, score]) => {
    table[itemName] = score
    return table
  }, {})
}

function headerTableWithNodeLink (headerTable) {
  return Object.entries(headerTable).reduce((headerTable, [itemName, score]) => {
    headerTable[itemName] = [score, null]
    return headerTable
  }, headerTable)
}

module.exports = (transactionDb, minimumSupport) => {
  const headerTable = construct(transactionDb)
  const prunnedHeaderTable = prune(headerTable, minimumSupport)
  return headerTableWithNodeLink(prunnedHeaderTable)
}
