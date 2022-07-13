import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, ErrorMessage } from 'formik'
import { Check, Cross } from '../../../images'
import { Button, Select, InputField, CheckBox, PaymentCurrencyBtn } from '../..'
import {
  billingOperations,
  billingSelectors,
  payersOperations,
  payersSelectors,
} from '../../../Redux'
import s from './ModalCreatePayment.module.scss'
import { BASE_URL } from '../../../config/config'
import * as Yup from 'yup'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['billing', 'other', 'payers', 'cart'])

  const { setCreatePaymentModal } = props

  const payersList = useSelector(payersSelectors.getPayersList)

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const paymentsCurrency = useSelector(billingSelectors.getPaymentsCurrencyList)

  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [newPayer, setNewPayer] = useState(false)

  useEffect(() => {
    dispatch(billingOperations.getPayers())
  }, [])

  const offerTextHandler = () => {
    dispatch(payersOperations.getPayerOfferText(payersSelectedFields?.offer_link))
  }

  const createPaymentMethodHandler = values => {
    const data = {
      profile: values?.profile,
      amount: values?.amount,
      payment_currency: values?.payment_currency?.value,
      paymethod: values?.slecetedPayMethod?.paymethod?.$,
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profiletype: payersSelectedFields?.profiletype || '',
      person: values?.person || '',
      name: values?.person,
      [payersSelectedFields?.offer_field]: values[payersSelectedFields?.offer_field]
        ? 'on'
        : 'off',
    }

    dispatch(billingOperations.createPaymentMethod(data, setCreatePaymentModal))
  }

  const validationSchema = Yup.object().shape({
    profile: Yup.string().required(t('Choose payer')),
    amount: Yup.number()
      .positive(`${t('The amount must be greater than')} ${minAmount} EUR`)
      .min(minAmount, `${t('The amount must be greater than')} ${minAmount} EUR`)
      .max(
        maxAmount > 0 ? maxAmount : null,
        maxAmount > 0 ? `${t('The amount must be less than')} ${maxAmount} EUR` : null,
      )
      .required(t('Enter amount')),
    slecetedPayMethod: Yup.object().required(t('Select a Payment Method')),
    person: newPayer
      ? Yup.string().required(t('Is a required field', { ns: 'other' }))
      : null,
    [payersSelectedFields?.offer_field]: newPayer ? Yup.bool().oneOf([true]) : null,
  })

  const payers = newPayer
    ? [
        ...payersList,
        { name: { $: t('Add new payer', { ns: 'payers' }) }, id: { $: 'add_new' } },
      ]
    : payersList

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>{t('Replenishment')}</span>
          <Cross onClick={() => setCreatePaymentModal(false)} className={s.crossIcon} />
        </div>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            profile: payersList[payersList?.length - 1]?.id?.$ || 'add_new',
            amount: '',
            slecetedPayMethod: undefined,
            person: '',
            [payersSelectedFields?.offer_field]: false,
            payment_currency: {
              title: paymentsCurrency?.payment_currency_list?.filter(
                e => e?.$key === paymentsCurrency?.payment_currency,
              )[0]?.$,
              value: paymentsCurrency?.payment_currency,
            },
          }}
          onSubmit={createPaymentMethodHandler}
        >
          {({ values, setFieldValue, touched, errors }) => {
            const parsePaymentInfo = text => {
              const splittedText = text?.split('<p>')
              const minAmount = splittedText[0]?.replace('\n', '')
              const infoText = splittedText[1]
                ?.replace('<p>', '')
                ?.replace('</p>', '')
                ?.replace('<strong>', '')
                ?.replace('</strong>', '')
                ?.replaceAll('\n', '')

              return { minAmount, infoText }
            }

            const parsedText =
              values?.slecetedPayMethod &&
              parsePaymentInfo(values?.slecetedPayMethod?.desc?.$)

            const setPayerHandler = val => {
              setFieldValue('profile', val)
              if (val === 'add_new') {
                setNewPayer(true)
              } else {
                setNewPayer(false)
              }
            }

            return (
              <Form>
                <div className={s.form}>
                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>1. {t('Payers choice')}</div>
                    <div className={cn(s.formFieldsBlock, s.first)}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        value={values.profile}
                        getElement={item => setPayerHandler(item)}
                        isShadow
                        className={s.select}
                        itemsList={payers?.map(({ name, id }) => ({
                          label: t(`${name?.$?.trim()}`),
                          value: id?.$,
                        }))}
                      />
                      {!newPayer && (
                        <button
                          onClick={() => setPayerHandler('add_new')}
                          type="button"
                          className={s.addNewPayerBtn}
                        >
                          {t('Add new payer', { ns: 'payers' })}
                        </button>
                      )}
                      {newPayer && (
                        <>
                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name="person"
                            label={`${t('The contact person', { ns: 'payers' })}:`}
                            placeholder={t('Enter data', { ns: 'other' })}
                            isShadow
                            className={s.inputPerson}
                            error={!!errors.person}
                            touched={!!touched.person}
                            isRequired
                          />
                          {payersSelectedFields?.offer_link && (
                            <div className={s.offerBlock}>
                              <CheckBox
                                initialState={values[payersSelectedFields?.offer_field]}
                                setValue={item =>
                                  setFieldValue(
                                    `${payersSelectedFields?.offer_field}`,
                                    item,
                                  )
                                }
                                className={s.checkbox}
                                error={!!errors[payersSelectedFields?.offer_field]}
                              />
                              <div className={s.offerBlockText}>
                                {t('I agree with the terms of the offer', {
                                  ns: 'payers',
                                })}
                                <br />
                                <button
                                  onClick={offerTextHandler}
                                  type="button"
                                  className={s.offerBlockLink}
                                >
                                  {payersSelectedFields?.offer_name}
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>2. {t('Payment method')}</div>
                    <div className={s.formFieldsBlock}>
                      {paymentsMethodList?.map(method => {
                        const {
                          paymethod,
                          image,
                          name,
                          payment_minamount,
                          payment_maxamount,
                        } = method
                        return (
                          <button
                            onClick={() => {
                              setFieldValue('slecetedPayMethod', method)
                              setMinAmount(Number(payment_minamount?.$))
                              setMaxAmount(Number(payment_maxamount?.$))
                            }}
                            type="button"
                            className={cn(s.paymentMethodBtn, {
                              [s.selected]:
                                paymethod?.$ === values?.slecetedPayMethod?.paymethod?.$,
                            })}
                            key={paymethod?.$}
                          >
                            <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                            <span>{name?.$}</span>
                            <Check className={s.iconCheck} />
                          </button>
                        )
                      })}
                    </div>
                    <ErrorMessage
                      className={s.error_message}
                      name={'slecetedPayMethod'}
                      component="span"
                    />
                  </div>
                  <div className={cn(s.formBlock, s.last)}>
                    <div className={s.formBlockTitle}>3. {t('Top-up amount')}</div>
                    <div className={s.formFieldsBlock}>
                      <div className={s.inputAmountBlock}>
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="amount"
                          placeholder={'0.00'}
                          isShadow
                          value={values.amount}
                          onChange={e =>
                            setFieldValue(
                              'amount',
                              e?.target?.value.replace(/[^0-9.]/g, ''),
                            )
                          }
                          className={s.input}
                          error={!!errors.amount}
                          touched={!!touched.amount}
                          isRequired
                        />
                        {paymentsCurrency && paymentsCurrency?.payment_currency_list && (
                          <PaymentCurrencyBtn
                            list={paymentsCurrency?.payment_currency_list}
                            currentValue={values?.payment_currency?.title}
                            setValue={item => {
                              setFieldValue('payment_currency', item)
                              dispatch(
                                billingOperations.getPaymentMethod({
                                  payment_currency: item?.value,
                                }),
                              )
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={s.infotext}>
                    {/* {t('Payment using text')} */}
                    {values?.slecetedPayMethod && (
                      <div>
                        <span>{t(`${parsedText?.minAmount}`, { ns: 'cart' })}</span>
                        {parsedText?.infoText && (
                          <p>{t(`${parsedText?.infoText}`, { ns: 'cart' })}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className={s.btnBlock}>
                  <Button
                    disabled={
                      Number(values.amount) <
                      values?.slecetedPayMethod?.payment_minamount?.$
                    }
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
