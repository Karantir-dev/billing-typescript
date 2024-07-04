import { replaceAllFn } from '@utils'

export default function parsePaymentInfo(text) {
  const splittedText = text?.replace(/&nbsp;/g, ' ').split('<p>')
  if (splittedText?.length > 0) {
    const minAmount = splittedText[0]?.split('Commission')[0].replace('\n', '')

    const commission = splittedText[0].split('Commission')[1]?.replace('\n', '').trim()

    let infoText = ''

    if (splittedText[1]) {
      let replacedText = splittedText[1]
        ?.replace('<p>', '')
        ?.replace('</p>', '')
        ?.replace('<strong>', '')
        ?.replace('</strong>', '')

      infoText = replaceAllFn(replacedText, '\n', '')
    }
    return { minAmount, infoText, commission }
  }
}
