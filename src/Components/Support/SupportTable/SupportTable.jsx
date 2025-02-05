import SupportTableItem from './SupportTableItem'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './SupportTable.module.scss'
import { CheckBox } from '@src/Components'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const { list, setSelectedTickets, selectedTickets } = props

  const isAllSelected = list.length === selectedTickets.length

  const toggleAllSelectedHandler = () => {
    isAllSelected ? setSelectedTickets([]) : setSelectedTickets(list)
  }

  return (
    <div className={s.table}>
      <div className={s.tableHeaderWrapper}>
        <div className={s.tableCheckboxWrapper}>
          <CheckBox
            className={s.tableCheckbox}
            value={isAllSelected}
            onClick={toggleAllSelectedHandler}
          />
          <span className={s.tableCheckboxText}>{t('Choose all', { ns: 'other' })}</span>
        </div>

        <div className={s.tableHeader}>
          <span className={cn(s.title_text, s.first_item)}>{t('request_id')}:</span>
          <span className={cn(s.title_text, s.second_item)}>
            {t('theme', { ns: 'other' })}:
          </span>
          <span className={cn(s.title_text, s.third_item)}>
            {t('date', { ns: 'other' })}:
          </span>
          <span className={cn(s.title_text, s.fourth_item)}>
            {t('status', { ns: 'other' })}:
          </span>
          <span className={cn(s.title_text, s.fifth_item)} />
        </div>
      </div>
      {list?.map(el => {
        const { tstatus, last_message, name, id, unread } = el
        const isSelected = selectedTickets.find(ticket => ticket?.id?.$ === id?.$)

        const onItemClick = () => {
          isSelected
            ? setSelectedTickets(list => list.filter(item => item !== el))
            : setSelectedTickets([...selectedTickets, el])
        }

        return (
          <SupportTableItem
            key={id?.$}
            theme={name?.$}
            date={last_message?.$}
            status={tstatus?.$}
            id={id?.$}
            unread={unread?.$ === 'on'}
            setSelectedTickets={onItemClick}
            selected={!!isSelected}
          />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
  setSelectedTickets: PropTypes.func,
  selectedTickets: PropTypes.array,
}

Component.defaultProps = {
  list: [],
}
