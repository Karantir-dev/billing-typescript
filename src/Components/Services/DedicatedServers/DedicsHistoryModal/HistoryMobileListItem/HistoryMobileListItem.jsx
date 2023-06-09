import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { historyTranslateFn } from '@utils'

import s from './HistoryMobileListItem.module.scss'

export default function HistoryMobileListItem({ history }) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    <li className={s.item}>
      <span className={s.label}>{t('date', { ns: 'other' })}:</span>
      <span className={s.value}>{history?.changedate?.$}</span>
      <span className={s.label}>{t('Changing', { ns: 'other' })}:</span>
      <span className={s.value}>{historyTranslateFn(history?.desc?.$, t)}</span>

      <span className={s.label}>{t('user_name')}:</span>
      <span className={s.value}>
        {history?.user?.$?.replace(String.fromCharCode(39), '') ===
        'Providers employee or system'
          ? t('Provider employee or system', { ns: 'dedicated_servers' })
          : history?.user?.$}
        :
      </span>
      <span className={s.label}>{t('ip_address')}:</span>
      <span className={s.value}>
        {history?.ip?.$?.trim() === '-'
          ? t('Not provided', { ns: 'dedicated_servers' })
          : history?.ip?.$}
      </span>
    </li>
  )
}

HistoryMobileListItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
}
