const parseLang = lang => {
  switch (lang) {
    case 'en':
      return ''
    case 'ka':
      return 'ge'
    case 'kk':
      return 'kz'
    case 'ru':
      return 'rus'
    case 'uk':
      return 'ua'

    default:
      return ''
  }
}

export default parseLang
