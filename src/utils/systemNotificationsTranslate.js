export default function systemNotificationsTranslate(str, t) {
  const translate = str.replace(
    'The following services were suspended due to no actions from you',
    t('The following services were suspended due to no actions from you'),
  )

  return t(translate.trim())
}
