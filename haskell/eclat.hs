import qualified Data.Map as Map
import qualified Data.List as List
import qualified Data.Maybe as Maybe
import qualified Data.Set as Set

main :: IO()
main = do
  let minimumSupport = 2 -- minimumSupport is the minimum frequency the items should appear in each transactions
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

  let verticalFormat = toVerticalFormat transactions -- convert the transactions from horizontal to vertical format
  print $ eclat verticalFormat minimumSupport k -- perform a recursive eclat to find all n-frequent itemsets

type Item = String
type ItemRow = [Item]

type ItemSet = Set.Set String
type TIDs = Set.Set Int
type VerticalFormatTransactions = Map.Map ItemSet TIDs

toVerticalFormat :: [ItemRow] -> VerticalFormatTransactions
toVerticalFormat transactions = 
  groupByItem $ concat [[(Set.fromList [item], Set.fromList [tid]) | item <- row ] | (row, tid) <- indexedItem]
  where 
    indexedItem = zip transactions [1..]
    groupByItem a =  Map.fromListWith (Set.union) a


frequentItemsets :: VerticalFormatTransactions -> Int -> Int -> VerticalFormatTransactions
frequentItemsets transactions minimumSupport k =
  aboveMinimumSupportThreshold . mapToList $ [(unionItems, intersectionItems) | 
                                              (item1, ids1) <- Map.toList transactions, 
                                              (item2, ids2) <- Map.toList transactions, 
                                              -- let minimumCombinations = minimum [Set.size item1, Set.size item2],
                                              let unionItems = item1 `Set.union` item2, 
                                              let intersectionItems = ids1 `Set.intersection` ids2, 
                                              Set.size unionItems >= k]
  where 
    aboveMinimumSupportThreshold = Map.filter (\items -> Set.size items >= minimumSupport)
    mapToList = Map.fromList

eclat :: VerticalFormatTransactions -> Int -> Int -> VerticalFormatTransactions
eclat transactions minimumSupport k
  | Map.null transactions = Map.empty 
  | otherwise = let output = frequentItemsets transactions minimumSupport k
                in Map.union output (eclat output minimumSupport (k + 1))
