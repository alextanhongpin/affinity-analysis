val transactions: List[List[String]] = List(
  List("bread", "butter", "jam"),
  List("butter", "coke"),
  List("butter", "milk"),
  List("bread", "butter", "coke"),
  List("bread", "milk"),
  List("butter", "milk"),
  List("bread", "milk"),
  List("bread", "butter", "milk", "jam"),
  List("bread", "butter", "milk")
)

// Assign transaction ids (tid) to each item in the row
val itemsWithTid = transactions.indices flatMap { i => {
  transactions(i) map { item =>
    (item, i + 1)
  }
}}

// Group the items by name
val groupedItems = itemsWithTid groupBy {_._1} map {
  case (k, v) => (Set(k), (v map { _._2 }).toSet)
}

type ItemSets = Set[String]
type TIDSets = Set[Int]
type FrequentItems = List[(ItemSets, TIDSets)]

def frequentItemsets(items: FrequentItems, k: Int, minSup: Int): FrequentItems = {
  val rng = items.indices

  var m = scala.collection.mutable.Map[Set[String], Boolean]()
  val out = for (i <- rng; j <- rng if i <= j) yield {
    val i1 = items(i)
    val i2 = items(j)

    val itemSet = i1._1 union i2._1
    val tidSet = i1._2 intersect i2._2

    val isValid = itemSet.size >= k && tidSet.size >= minSup && !m.contains(itemSet)
    m put (itemSet, true)
    if (isValid) Some(itemSet, tidSet) else None
  }
  out.toList.flatten
}

def eclat (xs: FrequentItems, k: Int = 2): FrequentItems = {
  // @tailrec
  def mineFrequentPatterns(items: FrequentItems, k: Int, acc: FrequentItems): FrequentItems = {
    items match {
      case Nil => List()
      case xs => {
        val out = frequentItemsets(xs, k, 2)
        out ::: mineFrequentPatterns(out, k + 1, acc)
      }
    }
  }
  mineFrequentPatterns(xs, 2, List())
}

println(eclat(groupedItems.toList))