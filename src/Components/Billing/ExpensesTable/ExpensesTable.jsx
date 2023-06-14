import PropTypes from 'prop-types'
import ExpensesTableItem from './ExpensesTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './ExpensesTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['billing', 'other'])
  const { list } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>
          {t('Name', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.third_item)}>
          {t('date', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fourth_item)}>
          {t('Sum', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fifth_item)}>
          {t('Paid in payments', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.sixth_item)}>
          {t('Tax', { ns: 'other' })}:
        </span>
      </div>
      {list?.map(el => {
        const { id, payments, realdate, paymethod_name, amount, locale_name, taxamount } =
          el

        return (
          <ExpensesTableItem
            key={id?.$}
            id={id?.$}
            name={locale_name?.$}
            number={payments?.$}
            date={realdate?.$}
            sum={amount?.$}
            paymethod={paymethod_name?.$}
            tax={taxamount?.$}
          />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
}

Component.defaultProps = {
  list: [],
}
