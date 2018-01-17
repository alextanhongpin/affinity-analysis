// ECLAT - Equivalance Class Clustering and Bottom up Lattice Traversal

const { dataset7: transactions } = require('./core/data')

function transpose (transactions) {
  return transactions.reduce((table, transaction, transactionId) => {
    return transaction.reduce((_table, item) => {
      if (_table[item] === undefined) {
        _table[item] = []
      }
      _table[item].push(transactionId + 1)
      return _table
    }, table)
  }, {})
}

function intersect (a, b) {
  const setA = new Set(a)
  return b.filter((item) => {
    return setA.has(item)
  })
}
function union (a, b) {
  return [...new Set([...a, ...b])]
}

function combine (tids, minSup, visited = {}, out = []) {
  let results = []
  tids.forEach((t1, i) => {
    tids.forEach((t2, j) => {
      if (i !== j) {
        const u = intersect(t1[1], t2[1])
        const comb = union(t1[0], t2[0])
        const key = comb.sort().join(',')
        if (u.length >= minSup && !visited[key]) {
          visited[key] = true
          results.push([comb, u])
        }
      }
    })
  })
  if (results.length) {
    out.push(results)
    combine(results, minSup, visited, out)
  }
  return out.reduce((a, b) => a.concat(b), [])
}

function main () {
  const minSup = 2
  const tids = Object.entries(transpose(transactions)).reduce((a, [name, tids]) => {
    a.push([[name], tids])
    return a
  }, [])
  console.log(tids)

  const out = combine(tids, minSup)

  out.forEach((item) => {
    const combination = `{${item[0].join(',')}}`
    console.log(combination, '=>', item[1])
  })
}

main()
