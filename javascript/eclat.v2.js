let { dataset7: dataset } = require('./core/data')

let threshold = 2
function eclat (prefix, items, database) {
  if (!items.size) return

  let frequent = []
  for (let item of items) {
    if (prefix.has(item)) continue
    let newPrefix = union(prefix, [item])
    let freq = frequency(database, newPrefix)
    if (freq >= threshold) {
      frequent.push([newPrefix, item])
    }
  }

  for (let [newPrefix, item] of frequent) {
    console.log(newPrefix)
    items.delete(item)
    eclat(newPrefix, new Set([...items]), database)
  }
}

function frequency (database, prefix) {
  // If the prefix size is 3, it means we need to have a counter of 3 items to indicate there is intersection in three arrays
  let size = prefix.size
  let counter = {}
  for (let p of prefix) {
    for (let i of database[p]) {
      counter[i] = counter[i] ? counter[i] + 1 : 1
    }
  }
  return Object.values(counter).filter(i => i >= size).length
}

function main () {
  // dataset = [
  //   [...'abc'],
  //   [...'acdef'],
  //   [...'abc'],
  //   [...'de']
  // ]
  // [a, ac, acb, ab, c, cb, b, e, ed, d]
  let database = {}
  dataset.forEach((transactions, tid) => {
    transactions.forEach(transaction => {
      database[transaction] = database[transaction] ? database[transaction].concat([tid]) : [tid]
    })
  })
  let frequent = eclat(new Set(), new Set(Object.keys(database)), database)
  console.log('frequent', frequent)
}

function union (a, b) {
  return new Set([...a, ...b])
}
main()
// References
// http://mlwiki.org/index.php/Eclat
// http://www.borgelt.net/doc/eclat/eclat.html
