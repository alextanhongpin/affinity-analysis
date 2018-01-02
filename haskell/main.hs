import Data.List

main :: IO()
main = do
  let transactions = [["Mango", "Onion", "Nintendo", "Key-chain", "Eggs", "Yo-yo"],
                      ["Doll", "Onion", "Nintendo", "Key-chain", "Eggs", "Yo-yo"],
                      ["Mango", "Apple", "Key-chain", "Eggs"],
                      ["Mango", "Umbrella", "Corn", "Key-chain", "Yo-yo"],
                      ["Corn", "Onion", "Onion", "Key-chain", "Ice-cream", "Eggs"]]
  
  let items = ["Key-chain", "Yo-yo"]
  print $ support items transactions
  print $ confidence "Key-chain" "Yo-yo" transactions

-- Returns the score of the frequency in which item(s) appears in
-- the transactions
support :: Fractional a => [String] -> [[String]] -> a
support items transactions =
  let n = length items
      den = fromIntegral $ length transactions
      num = fromIntegral $ length [ 1 | rows <- transactions, length (items `intersect` rows) == n]
  in num / den

-- Loop through each transactions
-- For each transaction, loop through each item
-- if all the items are present, increment the count by one
-- else, move to the next transaction
-- return the length of the items found divided by the number of transactions