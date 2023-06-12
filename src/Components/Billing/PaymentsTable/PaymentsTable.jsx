import PropTypes from 'prop-types'
import PaymentsTableItem from './PaymentsTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './PaymentsTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['billing', 'other'])
  const { list, downloadPdfHandler, deletePayment, payHandler, setCreatePaymentModal } =
    props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>
          {t('Number', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.third_item)}>
          {t('date', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fourth_item)}>
          {t('Payer', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fifth_item)}>
          {t('Sum', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.sixth_item)}>
          {t('Payment method', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.seventh_item)}>
          {t('status', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.eighth_item)} />
      </div>
      {list?.map(el => {
        const {
          id,
          number,
          create_date,
          status,
          sender_name,
          paymethodamount_iso,
          paymethod_name,
          allowrefund,
        } = el

        return (
          <PaymentsTableItem
            key={id?.$}
            id={id?.$}
            number={number?.$}
            date={create_date?.$}
            status={status?.$}
            payer={sender_name?.$}
            sum={paymethodamount_iso?.$}
            paymethod={paymethod_name?.$}
            allowrefund={allowrefund?.$}
            downloadPdfHandler={downloadPdfHandler}
            deletePayment={deletePayment}
            payHandler={payHandler}
            setCreatePaymentModal={setCreatePaymentModal}
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
