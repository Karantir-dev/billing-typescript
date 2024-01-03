import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, CurrentAutoPayments, AutoPaymentForm, Loader } from '@components'
import s from './AutoPayment.module.scss'
import { billingOperations, billingSelectors } from '@redux'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { useCancelRequest } from '@src/utils'

export default function AutoPayment() {
  const navigate = useNavigate()

  const isStripeAvailable = useSelector(billingSelectors.getIsStripeAvailable)
  const isModalCreatePaymentOpened = useSelector(
    billingSelectors.getIsModalCreatePaymentOpened,
  )

  useEffect(() => {
    if (!isStripeAvailable) {
      navigate(`${route.BILLING}/payments`, {
        replace: true,
      })
    }
  }, [isStripeAvailable])

  const dispatch = useDispatch()
  const { t } = useTranslation(['billing', 'other'])

  const [isConfigure, setIsConfigure] = useState(false)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const autoPaymentsList = useSelector(billingSelectors.getAutoPaymentsList)

  useEffect(() => {
    dispatch(billingOperations.getAutoPayments(signal, setIsLoading))
    // dispatch(payersOperations.getPayers({}, signal, setIsLoading))
  }, [])

  useEffect(() => {
    if (isModalCreatePaymentOpened) {
      setIsConfigure(false)
    }
  }, [isModalCreatePaymentOpened])

  const renderInstruction = () => {
    return (
      <>
        <div className={s.autoPayTitle}>
          {t('AutoPaymentText')}
          <br /> <br />
          {t('AutoPaymentText2')}
        </div>
        {autoPaymentsList?.map(el => {
          const { id, image, name, status, maxamount } = el

          const stopAutoPaymentHandler = () => {
            dispatch(billingOperations.stopAutoPayments(id.$, signal, setIsLoading))
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
          isShadow
        />
      </>
    )
  }

  return (
    <>
      <div className={s.autoPayContainer}>
        {isConfigure ? (
          <AutoPaymentForm
            setIsConfigure={setIsConfigure}
            signal={signal}
            setIsLoading={setIsLoading}
          />
        ) : (
          renderInstruction()
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
