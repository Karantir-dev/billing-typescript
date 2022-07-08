import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, CurrentAutoPayments, AutoPaymentForm } from '../../../Components/'
import s from './AutoPayment.module.scss'
import { billingOperations, billingSelectors, payersOperations } from '../../../Redux'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['billing', 'other'])

  const [isConfigure, setIsConfigure] = useState(false)

  const autoPaymentsList = useSelector(billingSelectors.getAutoPaymentsList)

  useEffect(() => {
    dispatch(billingOperations.getAutoPayments())
    dispatch(payersOperations.getPayers())
  }, [])

  const renderInstruction = () => {
    return (
      <>
        <div className={s.autoPayTitle}>{t('AutoPaymentText')}</div>
        {autoPaymentsList?.map(el => {
          const { id, image, name, status, maxamount } = el

          const stopAutoPaymentHandler = () => {
            dispatch(billingOperations.stopAutoPayments(id.$))
          }

          return (
            <CurrentAutoPayments
              key={id.$}
              image={image?.$}
              name={name?.$}
              status={status?.$}
              maxamount={maxamount?.$}
              stopAutoPaymentHandler={stopAutoPaymentHandler}
            />
          )
        })}
        <Button
          dataTestid={'back_btn'}
          size="large"
          className={s.configureBtn}
          label={t('Configure')}
          onClick={() => setIsConfigure(true)}
          type="button"
        />
      </>
    )
  }

  return (
    <div className={s.autoPayContainer}>
      {isConfigure ? (
        <AutoPaymentForm setIsConfigure={setIsConfigure} />
      ) : (
        renderInstruction()
      )}
    </div>
  )
}
