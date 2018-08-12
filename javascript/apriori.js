function apriori(transactions, support) {
  // Initialization
  let occurences = {}
  
  // Split symbol
  let symbol = '-'  

  // Holds the score of each itemsets
  let score = {}
  for (let transaction of transactions) {
    for (let t of transaction) {
      if (!occurences[t]) {
        occurences[t] = 0
      }
      occurences[t] += 1
    }
  }
  for (let o in occurences) {
    if (occurences[o] < support) {
      delete(occurences[o])
    } else {
      score[o] = occurences[o]
    }
  }
  
  let itemsets = Object.keys(occurences).map(i => [Number(i)])
  let list = [itemsets]
  let k = 2

  while (list[list.length - 1].length) { 
    let candidates = generateCandidates(list[list.length - 1], k)
    let counter = {}
    for (let t of transactions) {
      for (let c of candidates) {
        if (isSubset(t, c)) {
          let key = c.join(symbol)
          if (!counter[key]) {
            counter[key] = 0
          }
          counter[key] += 1
        }
      }
    }
    let result = []
    for (let c in counter) {
      if (counter[c] >= support) {
        result.push(c.split(symbol).map(Number))
        score[c] = counter[c]
      }
    }
    list.push(result)
    k += 1
  }
  // We can pop the last item, since it is empty
  list.pop()
  return [list, score]
}

// Generate candidates,
// The max for n = 4 would be n * (n - 1) / 2 = 6
// See the handshake problem
function generateCandidates(itemsets, k) {
  let result = []
  for (let i = 0; i < itemsets.length; i += 1) {
     let a = itemsets[i].sort()

     for (let j = i + 1; j < itemsets.length; j += 1) {
       let b = itemsets[j].sort()
       if (compareArray(a.slice(0, k - 2), b.slice(0, k - 2))) {
          let candidate = [...new Set(a.concat(b))]
          result.push(candidate)
       }
     }
  }
  return result
}

function compareArray(a, b) {
  if (a.length !== b.length) {
    return false
  }
  a.sort()
  b.sort()
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function isSubset(set, subset) {
  if (subset.length > set.length) {
    return false 
  }
  return subset.every(el => set.includes(el))
}

function main() {
  let transactions = [
    [1,2,3,4],
    [1,2,4],
    [1,2],
    [2,3,4],
    [2,3],
    [3,4],
    [2,4]
  ]
  // This does not work LOL
  //let transactions = [
   //["🍎", "🍊", "🍌", "🍉"],
   //["🍎", "🍊", "🍉"],
   //["🍎", "🍊"],
   //["🍊", "🍌", "🍉"],
   //["🍊", "🍌"],
   //["🍌", "🍉"],
   //["🍊", "🍉"],
  //]
  //console.log('result', apriori(transactions, 3))
  let [list, scores] = apriori(transactions, 3)
  console.log('list', list)
  console.log('scores', scores)
  console.log(generateRules(list, scores))
}

// Association rules P -> H, means if someone purchase P, they will most likely purchase H. P is the antecedent, H the consequent.
// Confidence(P|H) = Support(P|H) / Support(P)
function generateRules(list, scores, minimumConfidence = 0.7) {
  let ruleList = []

  // Take only list with more than one items
  for (let i = 1; i < list.length; i += 1) {
    let frequentItemsets = list[i]
      if (i > 1) {
        rulesFromConsequent(frequentItemsets, scores, ruleList, minimumConfidence)
      } else {
        calculateConfidence(frequentItemsets, scores, ruleList, minimumConfidence)
      }
  } 
  return ruleList 
}

function rulesFromConsequent(frequentItemsets, scores, ruleList, minimumConfidence) {
  let m = frequentItemsets[0].length
  if (frequentItemsets.length > (m + 1)) {
    let l = generateCandidates(frequentItemsets, m + 1)
    l = calculateConfidence(frequentItemsets, scores, ruleList, minimumConfidence)
    if (len(l) > 1) {
      rulesFromConsequent(frequentItemsets, scores, ruleList, minimumConfidence)
    }
  }
}

function calculateConfidence(frequentItemsets, scores, ruleList, minimumConfidence) {
  let pruned = []
  console.log('frequentItemsets', frequentItemsets)
  for (let consequent of frequentItemsets) {
    let confidence = scores[consequent.join('-')]/scores[consequent[0]]
    if (confidence > minimumConfidence) {
      ruleList.push([consequent[0], consequent.join('-'), confidence])
      pruned.push(consequent)
    }
  }
  return pruned
}

main()
