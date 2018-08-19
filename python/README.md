# Eclat

Eclat algorithm stands for *Equivalence Class Clustering and bottom up Lattice Traversal*.

## Horizontal Data Format

Each row in the table here represents a transaction by a user (e.g. a purchase in a supermarket). Here we represent the items as name (bread, butter), but this is normally represented as SKU (Stock Keeping Unit), which is a number assigned to a product by a retail store to identify the price and product options.


| TID | Item Set |
| --- | ----- |
| 1 | bread, butter, jam |
| 2 | butter, coke |
| 3 | butter, milk |
| 4 | bread, butter, coke |
| 5 | bread, milk |
| 6 | butter, milk |
| 7 | bread, milk |
| 8 | bread, butter, milk, jam |
| 9 | bread, butter, milk |

## Vertical Data Format

While _apriori_ and _FP-Growth_ normally uses the horizontal data format, Eclat uses the vertical data format, which is basically a representing each row by item and the transaction ids where the item exists:

| Item | TID Set |
| ---- | ------- |
| bread | 1, 4, 5, 7, 8, 9 |
| butter | 1, 2, 3, 4, 6, 8, 9 |
| milk | 3, 5, 6, 7, 8, 9 |
| coke | 2, 4 |
| jam | 1, 8 |

This is basically the frequent 1-itemsets. 
In python, this can be represented as a dictionary of sets:

```python
vert = {
	'bread': set([1, 4, 5, 7, 8, 9]),
	# ...
}
```

A set is makes it easier later to find the intersection of the transaction ids.


## Frequent 2-itemsets

If our `min_sup = 2`, then the last two rows can be excluded, since they did not meet the minimum support.

| Item Set | TID Set |
| -------- | ------- |
| {bread, butter} | 1, 4, 8, 9 |
| {bread, milk} | 5, 7, 8, 9 |
| {bread, jam} | 1, 8 |
| {butter, milk} | 3, 6, 8, 9 |
| {butter, coke} | 2, 4 |
| {butter, jam} | 1, 8 |
| {milk, jam} | 8 |
| {bread, coke} | 4 |

## Frequent 3-itemsets

| Item Set | TID Set | 
| -------- | ------- |
| {bread, butter, milk} | 8, 9 |
| {bread, butter, jam} | 1, 8 |

## Run

```
$ python eclat.py
```

Output:

```
frozenset({'bread', 'milk'}) => {8, 4, 6, 7}
frozenset({'bread', 'milk', 'butter'}) => {8, 7}
frozenset({'bread', 'butter'}) => {0, 8, 3, 7}
frozenset({'bread', 'butter', 'jam'}) => {0, 7}
frozenset({'bread', 'jam'}) => {0, 7}
frozenset({'milk', 'butter'}) => {8, 2, 5, 7}
frozenset({'coke', 'butter'}) => {1, 3}
frozenset({'butter', 'jam'}) => {0, 7}
```


## Resources
http://www.philippe-fournier-viger.com/spmf/index.php?link=algorithms.php
https://pdfs.semanticscholar.org/3290/153e8a024b7d9da47f2d7f38c6c054d178b6.pdf
http://ceur-ws.org/Vol-126/schmidtthieme.pdf
