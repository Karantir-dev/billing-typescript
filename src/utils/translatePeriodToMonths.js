import { useTranslation } from 'react-i18next'

export default function translatePeriodToMonths(count) {
  const { t } = useTranslation(['other'])

  if (count === '1') return t('month count 1')
  if (count === '3' || count === '24') return t('month count 3/24')
  if (count === '6' || count === '12' || count === '36') return t('month count 6/12/36')

  return ''
}
