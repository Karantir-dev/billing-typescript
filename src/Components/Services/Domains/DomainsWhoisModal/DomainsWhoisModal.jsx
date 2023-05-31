import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import s from './DomainsWhoisModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { closeWhoisModalHandler, whoisData } = props

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>{t('Domain Information')}</span>
        <Cross onClick={closeWhoisModalHandler} className={s.crossIcon} />
      </div>
      <div className={s.whoisBlock}>{whoisData}</div>
    </div>
  )
}
