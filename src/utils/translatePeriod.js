export default function translatePeriod(string, t) {
  let period

  if (string === 'Disabled') {
    period = t(`${string}`, 'autoprolong')
  } else {
    const currencyRegex = /[A-Z]{3}/
    const currency = string.match(currencyRegex)
    const splittedText = string.split(currency)
    splittedText[1] = t(`${splittedText[1]?.trim()}`, { ns: 'autoprolong' })
    period = splittedText.join(`${currency} `)
  }

  return period
}
