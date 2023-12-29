export default function translatePeriodText(sentence, t) {
  const labelArr = sentence.split('EUR ')

  return (
    labelArr[0] +
    'EUR ' +
    t(labelArr[1]?.replace(')', '')) +
    (sentence.includes(')') ? ')' : '')
  )
}
