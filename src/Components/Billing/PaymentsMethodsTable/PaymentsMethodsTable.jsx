import PropTypes from 'prop-types'
import PaymentsMethodsTableItem from './PaymentsMethodsTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './PaymentsMethodsTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['billing', 'other'])
  const { list, reconfigHandler, deleteItemHandler, editItemNameHandler } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>
          {t('Name', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.second_item)}>
          {t('Payment method', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.third_item)}>
          {t('Number of auto-renewable services', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fourth_item)}>
          {t('status', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fifth_item)} />
      </div>
      {list?.map(el => {
        const {
          name,
          fullname,
          num_prolong_items,
          status_msg,
          paymethod_name,
          recurring,
          customname,
        } = el

        return (
          <PaymentsMethodsTableItem
            key={recurring?.$}
            id={recurring?.$}
            customname={customname?.$}
            name={name?.$}
            fullname={fullname?.$}
            num_prolong_items={num_prolong_items?.$}
            status={status_msg?.$}
            paymethod_name={paymethod_name?.$}
            reconfigHandler={reconfigHandler}
            deleteItemHandler={deleteItemHandler}
            editItemNameHandler={editItemNameHandler}
          />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
  setSelctedPayment: PropTypes.func,
  selctedPayment: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  list: [],
}
