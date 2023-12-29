export default function translatePeriodName(periodName, t) {
    let period = ''
  
    switch (periodName) {
      case '1':
        period = t('per month')
        break
      case '3':
        period = t('for three months')
        break
      case '6':
        period = t('half a year')
        break
      case '12':
        period = t('per year')
        break
      case '24':
        period = t('for two years')
        break
      case '36':
        period = t('for three years')
        break
      default:
        period = ''
    }
  
    return period
  }
  