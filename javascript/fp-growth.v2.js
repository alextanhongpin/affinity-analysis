
// TODO: Make it modular
// const fpg = new FPGrowth().setMinSupport(0.2).setNumPartitions(10)
// model = fpg.run(transactions)
// model.freqItemsets.collect().forEach((...))
// model.generateAssociationRules(minConfidence).collect().forEach((rule) => rule.consequent, rule.antecedent, rule.confidence)
const { dataset2: transactions } = require('./core/data')
const FPGrowth = require('./index')

function main () {
  const fpg = new FPGrowth({ minSupport: 3 })
  const model = fpg.run(transactions)
  fpg.print()
  console.log('model', model, model.length)
}

main()
