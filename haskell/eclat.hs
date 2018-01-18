import qualified Data.Map as Map
import qualified Data.Set as Set

main :: IO()
main = do
  let minSup = 2 -- minSup is the minimum support the items should appear in each transactions
  let k = 2 -- k is the frequent itemsets count. if k is 2, them it should contain a minimum of two items e.g. {bread, butter}

  let transactions = [["bread", "butter", "jam"],
                      ["butter", "coke"],
                      ["butter", "milk"],
                      ["bread", "butter", "coke"],
                      ["bread", "milk"],
                      ["butter", "milk"],
                      ["bread", "milk"],
                      ["bread", "butter", "milk", "jam"],
                      ["bread", "butter", "milk"]]

  let tidList = formatTransactions transactions -- convert the transactions from horizontal to vertical format
  print $ eclat tidList minSup k -- perform a recursive eclat to find all n-frequent itemsets

type Item = String
type Row = [Item]
type Transactions = [Row]

type MinSup = Int
type K = Int

type ItemSet = Set.Set String
type TIDSet = Set.Set Int
type TIDList = Map.Map ItemSet TIDSet

formatTransactions :: Transactions -> TIDList
formatTransactions transactions = 
  groupByItem $ concat [ [ (toSet item, toSet tid) | item <- unique row ] | (row, tid) <- tidList ]
  where 
    tidList = zip transactions [1..]
    groupByItem =  Map.fromListWith Set.union
    toSet a = Set.fromList [a]
    unique = Set.toList . Set.fromList


frequentItemsets :: TIDList -> MinSup -> K -> TIDList
frequentItemsets tidList minSup k =
  satisfyMinSup . toMap $ [(itemSet, tidSet) | 
                          (item1, tid1) <- tids,
                          (item2, tid2) <- tids, 
                          let itemSet = item1 `Set.union` item2, 
                          let tidSet = tid1 `Set.intersection` tid2, 
                          item1 /= item2,
                          Set.size itemSet >= k]
  where 
    tids = Map.toList tidList
    satisfyMinSup = Map.filter (\items -> Set.size items >= minSup)
    toMap = Map.fromList

eclat :: TIDList -> MinSup -> K -> TIDList
eclat tidList minSup k
  | Map.null tidList = Map.empty 
  | otherwise = newTidList `Map.union` eclat newTidList minSup nextK
                where newTidList = frequentItemsets tidList minSup k
                      nextK = k + 1