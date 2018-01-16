import qualified Data.List as List
import qualified Data.Map as Map
import qualified Data.Maybe as Maybe

import Data.Function (on)

main :: IO()
 
data Node = EmptyNode | Node { name :: String,
                               count :: Int,
                               node :: Node } deriving (Show)

main = do
  let transactions = [['a', 'b'],
                      ['c', 'd', 'b'],
                      ['a', 'c', 'd', 'e'],
                      ['a', 'd', 'e'],
                      ['a', 'b', 'c'],
                      ['a', 'b', 'c', 'd'],
                      ['a'],
                      ['a', 'b', 'c'],
                      ['a', 'b', 'd'],
                      ['b', 'c', 'e']]

  let headerTable = prepareHeaderTable transactions
  let headerMap = Map.fromList headerTable

  print "Header Map:"
  print headerMap
  print ""

  print "Ordered Itemsets:"
  print $ processTransactions headerMap transactions

  print "Build FP-Tree:"
  let rootNode = Node { name = "null", node = EmptyNode, count = 10 }
  print $ Node { name = "null", node = rootNode, count = 0 }

-- sort utility to compare the score of each items
sortItem :: (Char, Int) -> (Char, Int) -> Ordering
sortItem (_, b1) (_, b2) 
  | b1 < b2 = GT
  | b1 > b2 = LT
  | b1 == b2 = EQ

-- Create a header table that contains a pair of items and the score
prepareHeaderTable :: [[Char]] -> [(Char, Int)]
prepareHeaderTable transactions = 
  let reducedItems = List.sort $ concatMap (List.nub) transactions  
      countOccurencesOf items = List.map (\a -> (head a, length a)) $ List.group items
  in countOccurencesOf reducedItems

-- Process each row by removing duplicates, and sorting the items based on the
-- score by the header table
processRow :: Map.Map Char Int -> [Char] -> [Char]
processRow headerMap row =
  let getScore item = Maybe.fromJust $ Map.lookup item headerMap
      scoreTuple item = (item, getScore item)
      uniqueItems items = List.nub items
      takeItem = map fst
  in
    takeItem $ List.sortBy sortItem $ map scoreTuple $ uniqueItems row

-- Process each transaction by applying the process row for each row
processTransactions :: Map.Map Char Int -> [[Char]] -> [[Char]]
processTransactions headerMap transactions =
  map (processRow headerMap) transactions

-- printTree :: Node
-- printTree node =
