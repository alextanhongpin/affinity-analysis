class Node {
  constructor (itemName, parentLink) {
    this.parentLink = parentLink
    this.itemName = itemName
    this.count = 1
    this.children = {}
    this.nodeLink = null
  }
  increment () {
    this.count += 1
  }
}

module.exports = Node
