function printTree (tree, i = 1) {
  const multiplier = 2
  const itemName = tree.itemName ? tree.itemName : 'null'
  const link = [itemName.padStart(i * multiplier), tree.count].join(':')

  console.log(link)

  const values = Object.values(tree.children)
  values.forEach((item) => {
    printTree(item, i + 1)
  })
}
module.exports = printTree
