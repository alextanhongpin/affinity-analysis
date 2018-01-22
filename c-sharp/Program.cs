using System;
using System.Linq; // Required for concat
using System.Collections.Generic; // Required for list

namespace c_sharp
{
    class Program
    {
        static void Main(string[] args)
        {
            List<List<string>> transactions = new List<List<string>>(){
                new List<string>(){"bread", "butter", "jam"},
                new List<string>(){"butter", "coke"},
                new List<string>(){"butter", "milk"},
                new List<string>(){"bread", "butter", "coke"},
                new List<string>(){"bread", "milk"},
                new List<string>(){"butter", "milk"},
                new List<string>(){"bread", "milk"},
                new List<string>(){"bread", "butter", "milk", "jam"},
                new List<string>(){"bread", "butter", "milk"}
            };

            var frequentItemsets = CreateTable(transactions);
            var items = Eclat(frequentItemsets, 2, 2);


            foreach (var item in items) {
                DisplayTIDSet(item.TIDSet);
                DisplayItemSet(item.ItemSet);
            }

        }

        public class FrequentItemsets 
        {
            public HashSet<string> ItemSet;
            public HashSet<int> TIDSet;
        }

        static List<FrequentItemsets> Eclat (List<FrequentItemsets> frequentItemsets, int k, int minSup) {
            if (frequentItemsets.Count == 0) {
                return new List<FrequentItemsets>();
            }
            var newFrequentItemsets = MineFrequentItemsets(frequentItemsets, k, minSup);
            return new List<FrequentItemsets>(newFrequentItemsets.Concat(Eclat(newFrequentItemsets, k + 1, minSup)));
        }

        static List<FrequentItemsets> MineFrequentItemsets(List<FrequentItemsets> frequentItemsets, int k, int minSup) {
            var newList = new List<FrequentItemsets>();
            var cache = new Dictionary<string, bool>();
            int i = 0;

            foreach (var item1 in frequentItemsets) {
                i += 1;
                int j = 0;
                foreach (var item2 in frequentItemsets) {
                    j += 1;
                    if (i <= j) {
                        // Create a new hashset with items
                        var itemSet = new HashSet<string>(item1.ItemSet);
                        var tidSet = new HashSet<int>(item1.TIDSet);

                        itemSet.UnionWith(item2.ItemSet);
                        tidSet.IntersectWith(item2.TIDSet);

                        // DisplayItemSet(itemSet);
                        // DisplayTIDSet(tidSet);
                        var key = string.Join(",", itemSet.OrderBy(str => str));

                        if (itemSet.Count >= k && tidSet.Count >= minSup && !cache.ContainsKey(key)) {
                            newList.Add(new FrequentItemsets() {
                                TIDSet = tidSet,
                                ItemSet = itemSet,
                            });
                            cache.Add(key, true);
                        }
                    }
                }
            }
            return newList;
        }

        static List<FrequentItemsets> CreateTable(List<List<string>> transactions) {
            var hashMap = new Dictionary<string, FrequentItemsets>();
            int i = 0;

            foreach (List<string> row in transactions) {
                i += 1;
                foreach (string item in row) {                 
                    var prevValue = new FrequentItemsets();
                    if (hashMap.TryGetValue(item, out prevValue)) {
                        prevValue.TIDSet.Add(i);
                        hashMap[item] = prevValue;
                    } else {
                        hashMap.Add(item, new FrequentItemsets(){
                            TIDSet = new HashSet<int>(){ i },
                            ItemSet = new HashSet<string>() { item },
                        });
                    }
                }
            }
            return new List<FrequentItemsets>(hashMap.Values);
        }

        private static void DisplayTIDSet(HashSet<int> set) {
            Console.Write("TID Set: {");
            foreach (int i in set)
            {
                Console.Write(" {0}", i);
            }
            Console.WriteLine(" }");
        }

        private static void DisplayItemSet(HashSet<string> set) {
            Console.Write("Item Set: {");
            foreach (string i in set)
            {
                Console.Write(" {0}", i);
            }
            Console.WriteLine(" }");
        }
    }
}
