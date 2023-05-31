import SupportArchiveTableItem from './SupportArchiveTableItem'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './SupportArchiveTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const { list, setSelctedTicket, selctedTicket } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('request_id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>
          {t('theme', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.third_item)}>
          {t('date', { ns: 'other' })}:
        </span>
      </div>

      {list?.map(el => {
        const { tstatus, last_message, name, id, unread } = el
        let onItemClick = () => setSelctedTicket(el)

        return (
          <SupportArchiveTableItem
            key={id?.$}
            theme={name?.$}
            date={last_message?.$}
            status={tstatus?.$}
            id={id?.$}
            unread={unread?.$ === 'on'}
            setSelctedTicket={onItemClick}
            selected={selctedTicket?.id?.$ === id?.$}
          />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
  setSelctedTicket: PropTypes.func,
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  list: [],
}
