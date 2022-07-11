export default function translatePeriod(string, t) {
  let period = ''

  if (string.includes('three months')) {
    period = string
      .replace('three months', t('for three months', { ns: 'other' }))
      .replace('for', t('for', { ns: 'other' }))
  } else if (string.includes('month')) {
    period = string
      .replace('month', t('month', { ns: 'other' }))
      .replace('per', t('for', { ns: 'other' }))
  } else if (string.includes('three years')) {
    period = string
      .replace('three years', t('for three years', { ns: 'other' }))
      .replace('for', t('for', { ns: 'other' }))
  } else if (string.includes('two years')) {
    period = string
      .replace('two years', t('for two years', { ns: 'other' }))
      .replace('for', t('for', { ns: 'other' }))
  } else if (string.includes('half a year')) {
    period = string.replace(
      'half a year',
      t('half a year', { ns: 'other' }).toLowerCase(),
    )
  } else if (string.includes('per year')) {
    period = string.replace('per year', t('per year', { ns: 'other' }))
  } else if (string.includes('Disabled')) {
    period = string.replace('Disabled', t('Disabled', { ns: 'other' }))
  } else {
    period = t(string)
  }

  return period
}
