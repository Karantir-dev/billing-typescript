import roundToDecimal from './roundToDecimal'

export default function translatePeriodText(sentence, t) {
  const priceRegex = /(\d+\.\d+) EUR/
  const priceMatch = sentence.match(priceRegex)

  const withFormatedPrice = sentence.replace(
    priceMatch[1],
    roundToDecimal(+priceMatch[1]),
  )

  const labelArr = withFormatedPrice.split('EUR ')

  const label =
    labelArr[0] +
    'EUR ' +
    t(labelArr[1]?.replace(')', ''), {ns: 'autoprolong'}) +
    (sentence.includes(')') ? ')' : '')
    
  return label.replace('EUR)EUR ', 'EUR')
}
