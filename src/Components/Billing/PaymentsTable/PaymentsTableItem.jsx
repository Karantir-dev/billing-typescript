import { useRef, useState } from 'react'
import s from './PaymentsTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useOutsideAlerter } from '@utils'
import { TooltipWrapper, Icon } from '@components'
import { useDispatch } from 'react-redux'
import { billingActions, billingOperations } from '@src/Redux'

export default function Component(props) {
  const {
    id,
    number,
    date,
    status,
    payer,
    sum,
    paymethod,
    downloadPdfHandler,
    deletePayment,
    payHandler,
    allowrefund,
  } = props
  const { t } = useTranslation(['billing', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })
  const dispatch = useDispatch()

  const dropDownEl = useRef()
  const [isOpened, setIsOpened] = useState(false)

  const datetimeSeparate = string => {
    let date = dayjs(string).format('DD MMM YYYY')
    return date
  }

  const closeMenuHandler = () => {
    setIsOpened(!isOpened)
  }

  useOutsideAlerter(dropDownEl, isOpened, closeMenuHandler)

  const renderStatus = string => {
    const status = t(string.trim())
    let color = '#11A63A'
    if (string.trim() === 'Payment in progress') {
      color = '#ED801B'
    } else if (string.trim() === 'Paid') {
      color = '#45A884'
    } else if (string.trim() === 'Canceled') {
      color = '#FA6848'
    }
    return {
      status,
      color,
    }
  }

  const downloadHandler = () => {
    downloadPdfHandler(id, number)
    setIsOpened(false)
  }

  const deleteHandler = () => {
    deletePayment(id)
    setIsOpened(false)
  }

  const payRedirectHandler = () => {
    payHandler(id, number, paymethod)
    setIsOpened(false)
  }

  const renderDesktopLastColumn = () => {
    return (
      <div className={cn(s.item_text, s.eighth_item)}>
        <Icon
          name="MoreDots"
          onClick={() => setIsOpened(!isOpened)}
          className={s.dotIcons}
        />

        <div
          role="button"
          tabIndex={0}
          onKeyDown={() => null}
          onClick={e => e.stopPropagation()}
          className={cn({
            [s.list]: true,
            [s.opened]: isOpened,
          })}
          ref={dropDownEl}
        >
          {status.trim() !== 'Paid' && status.trim() !== 'Canceled' && (
            <button
              className={s.settings_btn}
              onClick={() => {
                setIsOpened(false)
                if (
                  (status.trim() === 'New' &&
                    paymethod?.trim().toLowerCase() !== 'select') ||
                  (status.trim() === 'Payment in progress' &&
                    paymethod?.trim().toLowerCase() === 'yookassa')
                ) {
                  return payRedirectHandler()
                }
                if (allowrefund === 'off') {
                  return dispatch(
                    billingOperations.payPayment(id, () =>
                      dispatch(billingActions.setIsModalCreatePaymentOpened(true)),
                    ),
                  )
                } else {
                  return payRedirectHandler()
                }
              }}
            >
              <Icon name="Pay" />
              <p className={s.setting_text}>{t('Pay')}</p>
            </button>
          )}
          <button className={s.settings_btn} onClick={downloadHandler}>
            <Icon name="Download" />
            <p className={s.setting_text}>{t('Download')}</p>
          </button>
          {status.trim() === 'New' && (
            <button className={s.settings_btn} onClick={deleteHandler}>
              <Icon name="Delete" />
              <p className={s.setting_text}>{t('Delete')}</p>
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderMobileLastColumn = () => {
    return (
      <div className={s.btnsBlock}>
        {status.trim() !== 'Paid' && (
          <button
            onClick={() => {
              if (
                status.trim() === 'New' &&
                paymethod?.trim().toLowerCase() !== 'select'
              ) {
                return payRedirectHandler()
              }
              if (allowrefund === 'off') {
                return dispatch(
                  billingOperations.payPayment(id, () =>
                    dispatch(billingActions.setIsModalCreatePaymentOpened(true)),
                  ),
                )
              } else {
                return payRedirectHandler()
              }
            }}
            className={s.mobileBtn}
          >
            <Icon name="Pay" />
            <div>{t('Pay')}</div>
          </button>
        )}
        <button onClick={downloadHandler} className={s.mobileBtn}>
          <Icon name="Download" />
          <div>{t('Download')}</div>
        </button>
        {status.trim() === 'New' && (
          <button onClick={deleteHandler} className={s.mobileBtn}>
            <Icon name="Delete" />
            <div>{t('Delete')}</div>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={s.item}>
      <div className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('Id')}:</div>}
        <div className={cn(s.item_text, s.first_item)}>{id}</div>
      </div>
      <div className={s.tableBlockSecond}>
        {mobile && <div className={s.item_title}>{t('Number', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.second_item)}>{number}</div>
      </div>
      <div className={s.tableBlockThird}>
        {mobile && <div className={s.item_title}>{t('date', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.third_item)}>{datetimeSeparate(date)}</div>
      </div>
      <div className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('Payer', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.fourth_item)}>{t(payer)}</div>
      </div>
      <div className={s.tableBlockFifth}>
        {mobile && <div className={s.item_title}>{t('Sum', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.fifth_item)}>{t(sum)}</div>
      </div>
      <div className={s.tableBlockSixth}>
        {mobile && (
          <div className={s.item_title}>{t('Payment method', { ns: 'other' })}:</div>
        )}
        <TooltipWrapper disabled={t(paymethod).length < 10} content={t(paymethod)}>
          <div className={cn(s.item_text, s.sixth_item)}>{t(paymethod)}</div>
        </TooltipWrapper>
      </div>
      <div className={s.tableBlockSeventh}>
        {mobile && <div className={s.item_title}>{t('status', { ns: 'other' })}:</div>}
        <div
          style={{ color: renderStatus(status).color }}
          className={cn(s.item_text, s.seventh_item)}
        >
          {renderStatus(status).status}
        </div>
      </div>
      <div className={s.tableBlockEighth}>
        {mobile ? (
          <div className={s.mobileBlock}>
            <div className={s.line} />
            {renderMobileLastColumn()}
          </div>
        ) : (
          renderDesktopLastColumn()
        )}
      </div>
    </div>
  )
}
Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  unread: PropTypes.bool,
  setSelctedTicket: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelctedTicket: () => null,
  selected: null,
}
