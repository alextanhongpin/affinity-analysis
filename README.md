## FP-Growth

1. Calculate the support count of each item in S
2. Sort items in decreasing support counts
3. Read transaction n

if has overlapping prefix:

4. Increment the frequency count for each overlapped item
5. Create new nodes for none overlapped items
6. Set the frequency count to one

else:

4. Create new nodes labelled with the items in t
5. Set the frequency count to 1
6. Create pointers to common items

Repeat until there are not more items.

Additional a FP-Tree uses pointers connecting between nodes that have the same items creating a singly linked list.

These pointers are used to access individual items in the tree much faster.


### Best Scenario

There is only a single node, because all transactions have the same set of items.

### Worst case

Multiple nodes where every transaction has a unique set of items.

## Reference

- https://arxiv.org/pdf/1701.09042.pdf
- https://www.cs.sfu.ca/~wangk/pub/pakdd02.pdf
- http://data-mining.philippe-fournier-viger.com/introduction-high-utility-itemset-mining/
- http://www.philippe-fournier-viger.com/MICAI2015_EFIM_High_Utility_Itemset_Mining.pdf
- https://link.springer.com/book/10.1007/978-3-030-04921-8
- http://data-mining.philippe-fournier-viger.com/tutorial-how-to-discover-hidden-patterns-in-text-documents/

