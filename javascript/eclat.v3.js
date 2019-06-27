// Each row is a transaction and each item is the item purchased.
const X_0 = [
  [1, 3, 4],
  [2, 3, 5],
  [1, 2, 3, 5],
  [2, 5],
  [1, 2, 3, 5]
]
const y_0 = [
  ['1'],
  ['2'],
  ['3'],
  ['5'],
  ['1', '2'],
  ['1', '3'],
  ['1', '5'],
  ['2', '3'],
  ['2', '5'],
  ['3', '5'],
  ['1', '2', '3'],
  ['1', '2', '5'],
  ['1', '3', '5'],
  ['2', '3', '5'],
  ['1', '2', '3', '5']
]

const X_1 = [
  ['p1', 'p3'],
  ['p1', 'p4'],
  ['p2', 'p3', 'p4'],
  ['p2', 'p3']
]
const y_1 = [
  ['p1'],
  ['p2'],
  ['p4'],
  ['p3'],
  ['p2', 'p3']
]


const X_2 = [
  ["a", "b", "c"],
  ["a", "b"],
  ["a", "b", "d"],
  ["b", "e"],
  ["b", "c", "e"],
  ["a", "d", "e"],
  ["a", "c"],
  ["a", "b", "d"],
  ["c", "e"],
  ["a", "b", "d", "e"]
]
const y_2 = [
  ['a', 'c'],
  ['b', 'c'],
  ['c', 'e'],
  ['a', 'd', 'e'],
  ['a', 'b', 'd'],
  ['a', 'd'],
  ['b', 'd'],
  ['d', 'e'],
  ['a', 'e'],
  ['b', 'e'],
  ['a', 'b'],
  ['a'],
  ['b'],
  ['c'],
  ['d'],
  ['e']
]

// Sample datasets for validating the input and output.
const X = [X_0, X_1, X_2]
const y = [y_0, y_1, y_2]


// Transform each transaction row with items to items with transaction id.
// e.g. {0: [item_a, item_b], 1: [item_a]} -> {item_a: [0, 1], item_b: [0]}.
function createFrequentItemSets(data) {
  return data.reduce((acc, row, id) => {
    for (const item of row) {
      const isDefined = acc[item] !== undefined && acc[item] !== null
      if (!isDefined) acc[item] = []
      acc[item].push(id)
    }
    return acc
  }, {})
}


// Finds the intersection between two arrays.
function intersect(a, b) {
  if (b.length > a.length) return intersect(b, a)
  const set = new Set(b)
  return a.filter(i => set.has(i))
}

function bottomUp(cluster, k = 1, minsup = 3) {
  cluster[k + 1] = {}

  const frequentItems = Object.keys(cluster[k]).map(key => key.split(','))
  for (let i = 0; i < frequentItems.length; i += 1) {
    for (let j = i + 1; j < frequentItems.length; j += 1) {
      const [l, r] = [frequentItems[i], frequentItems[j]]
      const newKey = [...new Set(l.concat(r).sort())]
      if (newKey.length > k + 1) continue
      const left = cluster[k][l]
      const right = cluster[k][r]
      const leftAndRight = intersect(left, right)
      if (leftAndRight.length < minsup) continue
      cluster[k + 1][newKey] = leftAndRight
    }
  }
  if (Object.keys(cluster[k + 1]).length) bottomUp(cluster, k + 1, minsup)
}

function Eclat(data, minsup = 3, k = 1) {
  const cluster = {}
  cluster[k] = Object.fromEntries(Object.entries(data)
    .filter(([key, value]) => {
      return value.length >= minsup
    }))

  bottomUp(cluster, k, minsup)

  return cluster
}

function mineFrequentPatterns(eclat) {
  return Object.keys(eclat).flatMap((key) => {
    return Object.keys(eclat[key]).map(k => k.split(','))
  })
}


function deepEqualArray(a, b) {
  if (a.length !== b.length) return false
  const sortStringify = (i) => JSON.stringify(i.sort())
  return sortStringify(a) === sortStringify(b)
}


function main() {
  for (let i = 0; i < X.length; i += 1) {
    const frequentItemSets = createFrequentItemSets(X[i])
    // console.log('frequentItemSets', frequentItemSets)

    const eclat = Eclat(frequentItemSets, 2)
    // console.log('eclat', eclat)
    const y_pred = mineFrequentPatterns(eclat)
    // console.log(y_pred)
    console.log('equal', deepEqualArray(y[i], y_pred))
  }
}

main()
