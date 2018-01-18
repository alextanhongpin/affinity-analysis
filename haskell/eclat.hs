import qualified Data.Map as Map
import qualified Data.List as List
import qualified Data.Maybe as Maybe
import qualified Data.Set as Set

main :: IO()
main = do
  let newline = putStr "\n"
  let minimumSupport = 2

  let transactions = [["bread", "butter", "jam"],
                      ["butter", "coke"],
                      ["butter", "milk"],
                      ["bread", "butter", "coke"],
                      ["bread", "milk"],
                      ["butter", "milk"],
                      ["bread", "milk"],
                      ["bread", "butter", "milk", "jam"],
                      ["bread", "butter", "milk"]]
  let itemsWithTransactionId = concat [[(tid, item) | item <- List.nub row ] | (tid, row) <- zip [1..] transactions]
  print "Items with ID:"
  newline
  print itemsWithTransactionId

  newline

  print "Invert Indices:"
  let inverted = invertIndices itemsWithTransactionId
  print inverted
  
  newline
  
  print $ eclat inverted minimumSupport

sortBySnd :: (Int, String) -> (Int, String) -> Ordering
sortBySnd (_, a) (_, b)
  | a > b = GT
  | a < b = LT
  | otherwise = EQ

groupBySnd :: (Int, String) -> (Int, String) -> Bool
groupBySnd (_, a) (_, b)
  | a == b = True
  | otherwise = False

foldItems :: [(Int, String)] -> [Int]
foldItems [] = []
foldItems [(tid, item)] = [tid]
foldItems ((tid, item):xs) = tid:foldItems xs

sortByItems :: ([String], [Int]) -> ([String], [Int]) -> Ordering
sortByItems (a, _) (b, _) 
  | a > b = GT
  | a < b = LT
  | otherwise = EQ

groupByItems :: ([String], [Int]) -> ([String], [Int]) -> Bool
groupByItems (a, _) (b, _) 
  | a == b = True
  | otherwise = False

invertIndices :: [(Int, String)] -> [([String], [Int])]
invertIndices transactions =
  map (\items -> ([takeFirst items], foldItems items)) $ groupAndSortItems transactions
  where
    sortItems = List.sortBy sortBySnd
    groupItems = List.groupBy groupBySnd
    groupAndSortItems = groupItems . sortItems
    takeFirst items = snd $ head items

frequentItemsets :: [([String], [Int])] -> Int -> [([String], [Int])]
frequentItemsets transactions minimumSupport =
  removeDuplicate $ applyFilter [(uniqueItems union, intersection) | 
    (item1, ids1) <- transactions, 
    (item2, ids2) <- transactions, 
    let sortedItem1 = List.sort item1,
    let sortedItem2 = List.sort item2,
    sortedItem1 /= sortedItem2,
    let union = item1 `List.union` item2,
    let intersection = ids1 `List.intersect` ids2]
  where 
    applyFilter = List.filter (\(_, items) -> length items >= minimumSupport)
    groupItems = List.groupBy groupByItems
    sortItems = List.sortBy sortByItems
    groupAndSortItems = groupItems . sortItems
    removeDuplicate items = map head $ groupAndSortItems items
    uniqueItems = Set.toList . Set.fromList

eclat :: [([String], [Int])] -> Int -> [([String], [Int])]
eclat [] _ = []
eclat transactions minimumSupport = 
  let output = frequentItemsets transactions minimumSupport
  in output ++ frequentItemsets output minimumSupport