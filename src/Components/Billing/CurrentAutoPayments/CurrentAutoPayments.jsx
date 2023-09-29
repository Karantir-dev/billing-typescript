import PropTypes from 'prop-types'
// import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './CurrentAutoPayments.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['billing', 'other'])
  const { image, name, maxamount, status, stopAutoPaymentHandler } = props

  const getAmountsFromString = string => {
    const words = string.split(' ')
    const amounts = []

    words.forEach(w => {
      if (!isNaN(w)) {
        amounts.push(w)
      }
    })

    if (amounts.length > 0) {
      return (
        <>
          <span>
            {t('Maximum payment amount per month')}: {amounts[0]} €
          </span>
          {amounts.length > 1 && (
            <>
              <br />
              <span>
                {t('Amount left for the month')}: {amounts[1]} €
              </span>
            </>
          )}
        </>
      )
    }
  }

  return (
    <div className={s.item}>
      <div className={s.itemColoumn}>
        <img className={s.itemImg} src={`${process.env.REACT_APP_BASE_URL}${image}`} alt="icon" /> {name}
      </div>
      <div className={s.itemColoumn}>{getAmountsFromString(maxamount)}</div>
      <div className={s.itemColoumn}>{t(status.trim(), { ns: 'other' })}</div>
      <div className={s.itemColoumn}>
        <button onClick={stopAutoPaymentHandler} type="button" className={s.disableBtn}>
          {t('Disable', { ns: 'other' })}
        </button>
      </div>
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
}

Component.defaultProps = {
  list: [],
}
