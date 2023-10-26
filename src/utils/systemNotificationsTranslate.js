export default function systemNotificationsTranslate(str, t) {
  let translate = str?.trim().replace(/ {2,}/g, ' ')

  const suspendedText = 'The following services were suspended due to no actions from you'

  if (translate.includes('The ticket was split')) {
    const regex = /"(\d+)"/
    const ticket = translate.match(regex)[0]
    translate = t(translate.split(ticket)[0].trim(), { ticket })
  } else if (translate.includes(suspendedText)) {
    translate = translate.replace(suspendedText, t(suspendedText))
  } else {
    translate = t(translate)
  }

  return translate
}
