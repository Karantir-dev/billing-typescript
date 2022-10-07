export default function translateSupportPaymentError(str, t) {
  console.log(str)
  const value1 = str.match(
    /insufficient funds to complete the operation. Required amount (.+?)(?=.) Your current balance/,
  )?.[1]
  const value2 = str.match(/Your current balance: (.+?)(?=,)/)?.[1]
  const value3 = str.match(/credit limit (.+?)(?=)/)?.[1]

  let translate = t('payment_insufficient_money', {
    value1: t(value1?.trim()),
    value2: t(value2),
    value3: t(value3),
    ns: 'support',
  })

  return translate
}
