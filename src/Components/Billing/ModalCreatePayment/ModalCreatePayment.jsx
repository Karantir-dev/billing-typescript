import React, { useEffect } from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import { Cross } from '../../../images'
import { Button, Select, InputField } from '../..'
import {
  billingOperations,
  billingSelectors,
  payersOperations,
  payersSelectors,
} from '../../../Redux'
import s from './ModalCreatePayment.module.scss'
import { BASE_URL } from '../../../config/config'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['billing', 'other'])

  const { setCreatePaymentModal } = props

  const payersList = useSelector(payersSelectors.getPayersList)
  const payersCount = useSelector(payersSelectors.getPayersCount)

  const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const paymentsCurrencyList = useSelector(billingSelectors.getPaymentsCurrencyList)

  console.log(paymentsMethodList, paymentsCurrencyList)

  useEffect(() => {
    const dataPayers = {
      p_cnt: payersCount,
    }
    dispatch(payersOperations.getPayers(dataPayers))

    dispatch(billingOperations.getPaymentMethod())
  }, [])

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>{t('Replenishment')}</span>
          <Cross onClick={() => setCreatePaymentModal(false)} className={s.crossIcon} />
        </div>
        <Formik
          enableReinitialize
          initialValues={{ profile: payersList[payersList?.length - 1]?.id?.$ || '' }}
          onSubmit={values => console.log(values)}
        >
          {({ values, setFieldValue, touched, errors }) => {
            // errors, touched, setFieldValue, values, handleBlur
            return (
              <Form className={s.form}>
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>1. {t('Payer\'s choice')}</div>
                  <div className={s.formFieldsBlock}>
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      value={values.profile}
                      getElement={item => setFieldValue('profile', item)}
                      isShadow
                      className={s.select}
                      itemsList={payersList?.map(({ name, id }) => ({
                        label: t(`${name?.$?.trim()}`),
                        value: id?.$,
                      }))}
                    />
                  </div>
                </div>
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>2. {t('Payment method')}</div>
                  <div className={s.formFieldsBlock}>
                    {paymentsMethodList?.map(method => {
                      const { paymethod, image, name } = method
                      return (
                        <button
                          type="button"
                          className={s.paymentMethodBtn}
                          key={paymethod?.$}
                        >
                          <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                          <span>{name?.$}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className={cn(s.formBlock, s.last)}>
                  <div className={s.formBlockTitle}>3. {t('Top-up amount')}</div>
                  <div className={s.formFieldsBlock}>
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="person"
                      placeholder={'0.00'}
                      isShadow
                      className={s.input}
                      error={!!errors.person}
                      touched={!!touched.person}
                      isRequired
                    />
                  </div>
                </div>
                <div className={s.infotext}>
                  {t('Payment using text')} <span>{t('Minimum payment amount')}</span>
                </div>

                <div className={s.btnBlock}>
                  <Button
                    className={s.saveBtn}
                    isShadow
                    size="medium"
                    label={t('Pay')}
                    type="submit"
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}
