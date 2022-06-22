export default function translatePeriod(string, t) {
  let period = ''

  if (string.includes('three months')) {
    period = string
      .replace('three months', t('for three months'))
      .replace('for', t('for'))
  } else if (string.includes('month')) {
    period = string.replace('month', t('month')).replace('per', t('for'))
  } else if (string.includes('three years')) {
    period = string.replace('three years', t('for three years')).replace('for', t('for'))
  } else if (string.includes('two years')) {
    period = string.replace('two years', t('for two years')).replace('for', t('for'))
  } else if (string.includes('half a year')) {
    period = string.replace(
      'half a year',
      t('half a year', { ns: 'other' }).toLowerCase(),
    )
  } else if (string.includes('per year')) {
    period = string.replace('per year', t('per year'))
  } else if (string.includes('Disabled')) {
    period = string.replace('Disabled', t('Disabled'))
  }

  return period
}
