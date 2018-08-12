
class FPTree {
  constructor(name, count, parentNode) {
    this.name = name
    this.count = count
    this.parentNode = parentNode
    this.nodeLink = null
    this.children = {}
  }
  increment() {
    this.count += 1
  }

  print(i = 0) {
    console.group(i)
    console.log(this.name, this.count)
    for (let child in this.children) {
      this.children[child].print(i + 1)
    }
    console.groupEnd()
  }

}


function main() {
  let data = {
    001: [...'rzhjp'],
    002: [...'zyxwvuts'], 
    003: ['z'],
    004: [...'rxnos'],
    005: [...'yrxzqtp'],
    006: [...'yzxeqstm']
  }
  
  constructFPTree(Object.values(data), 3)
  
}

main()
function constructFPTree(transactions, minimumSupport) {
  // Scan the transaction database once
  let freqItems = {}

  for (let tx of transactions) {
    for (let item of [...new Set(tx)]) {
      freqItems[item] = freqItems[item] ? freqItems[item] + 1 : 1
    }
  }
  console.log('freqItems', freqItems)
  // Filter items below the minimum level
  for (let key in freqItems) {
    if (freqItems[key] < minimumSupport) {
      delete(freqItems[key])
    }
  }
  
  // Sort in descending order
  let sortedFreqItems = Object.entries(freqItems).sort(([k1,v1], [k2,v2]) => v2 - v1)
  console.log(sortedFreqItems)
 
  let sortedAndFilteredTransactions = transactions.map(tx => {
    let filtered = tx.filter(i => freqItems[i]).map(i => [i, freqItems[i]])
    let sorted = filtered.sort(([k1, v1], [k2, v2]) => v2 - v1)
    return sorted.map(([k, v]) => k)
  })
  console.log('sortedAndFiltered', sortedAndFilteredTransactions)
 
  // Create a root FP-tree
  let root = new FPTree('root', 0, null)
  for (let t of sortedAndFilteredTransactions) {
    insertTree(t, root)
  }
  root.print()
} 

function insertTree([p, ...P], T) {
  if (!p && !P.length) return
  // Check if the tree has the branch
  if (T.name === 'root' && T.children[p]) {
    let node = T.children[p]
    node.increment()
    insertTree(P, node)
  } else {
    // Create a new tree node, set the value to 1,
    // link parents back to T
    let node = new FPTree(p, 1, T)
    T.children[p] = node
    insertTree(P, node)
  }
}
