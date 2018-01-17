const dataset1 = [
  ['M', 'O', 'N', 'K', 'E', 'Y'],
  ['D', 'O', 'N', 'K', 'E', 'Y'],
  ['M', 'A', 'K', 'E'],
  ['M', 'U', 'C', 'K', 'Y'],
  ['C', 'O', 'O', 'K', 'I', 'E']
]

const dataset2 = [
  ['A', 'B', 'D', 'E'],
  ['B', 'C', 'E'],
  ['A', 'B', 'D', 'E'],
  ['A', 'B', 'C', 'E'],
  ['A', 'B', 'C', 'D', 'E'],
  ['B', 'C', 'D']
]

const dataset3 = [
  ['a', 'b'],
  ['b', 'c', 'd'],
  ['a', 'c', 'd', 'e'],
  ['a', 'd', 'e'],
  ['a', 'b', 'c'],
  ['a', 'b', 'c', 'd'],
  ['a'],
  ['a', 'b', 'c'],
  ['a', 'b', 'd'],
  ['b', 'c', 'e']
]

const dataset4 = [
  ['i1', 'i2', 'i5'],
  ['i2', 'i4'],
  ['i2', 'i3'],
  ['i1', 'i2', 'i4'],
  ['i1', 'i3'],
  ['i2', 'i3'],
  ['i1', 'i3'],
  ['i1', 'i2', 'i3', 'i5'],
  ['i1', 'i2', 'i3']
]

const dataset5 = [
  ['r', 'z', 'h', 'j', 'p'],
  ['z', 'y', 'x', 'w', 'v', 'u', 't', 's'],
  ['z'],
  ['r', 'x', 'n', 'o', 's'],
  ['y', 'r', 'x', 'z', 'q', 't', 'p'],
  ['y', 'z', 'x', 'e', 'q', 's', 't', 'm']
]

const dataset6 = [
  ['E', 'A', 'D', 'B'],
  ['D', 'A', 'C', 'E', 'B'],
  ['C', 'A', 'B', 'E'],
  ['B', 'A', 'D'],
  ['D'],
  ['D', 'B'],
  ['A', 'D', 'E'],
  ['B', 'C']
]

const dataset7 = [
  ['bread', 'butter', 'jam'],
  ['butter', 'coke'],
  ['butter', 'milk'],
  ['bread', 'butter', 'coke'],
  ['bread', 'milk'],
  ['butter', 'milk'],
  ['bread', 'milk'],
  ['bread', 'butter', 'milk', 'jam'],
  ['bread', 'butter', 'milk']
]
// Expected Result with ECLAT:
// {bread,butter} => [ 1, 4, 8, 9 ]
// {bread,jam} => [ 1, 8 ]
// {bread,milk} => [ 5, 7, 8, 9 ]
// {butter,jam} => [ 1, 8 ]
// {butter,coke} => [ 2, 4 ]
// {butter,milk} => [ 3, 6, 8, 9 ]
// {bread,butter,jam} => [ 1, 8 ]
// {bread,butter,milk} => [ 8, 9 ]

module.exports = {
  dataset1,
  dataset2,
  dataset3,
  dataset4,
  dataset5,
  dataset6,
  dataset7
}
