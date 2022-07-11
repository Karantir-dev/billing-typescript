import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Select, InputField, CheckBox } from '../../../Components/'
import {
  billingSelectors,
  payersSelectors,
  payersOperations,
  billingOperations,
} from '../../../Redux'
import { BASE_URL } from '../../../config/config'
import * as Yup from 'yup'
import s from './AutoPaymentForm.module.scss'

export default function Component(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation(['billing', 'other', 'payers'])

  const { setIsConfigure } = props

  const autoPaymentConfig = useSelector(billingSelectors.getAutoPaymentConfig)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const payersList = useSelector(payersSelectors.getPayersList)

  const [selectedMethod, setSelectedMethod] = useState(null)
  const [newPayer, setNewPayer] = useState(false)

  useEffect(() => {
    const data = {
      country: payersSelectLists?.country[0]?.$key,
      profiletype: payersSelectLists?.profiletype[0]?.$key,
    }

    dispatch(payersOperations.getPayerModalInfo(data))
  }, [])

  useEffect(() => {
    if (autoPaymentConfig && autoPaymentConfig?.elem?.length > 0) {
      setSelectedMethod(autoPaymentConfig?.elem[0])
    }
  }, [autoPaymentConfig])

  const offerTextHandler = () => {
    dispatch(payersOperations.getPayerOfferText(payersSelectedFields?.offer_link))
  }

  const getAmountsFromString = string => {
    const words = string?.match(/[\d|.|\\+]+/g)
    const amounts = []

    if (words.length > 0) {
      words.forEach(w => {
        if (!isNaN(w)) {
          amounts.push(w)
        }
      })
    } else {
      return
    }

    return {
      max_pay_amount: amounts[0],
      min_amount: amounts[2],
      max_amount: amounts[3],
    }
  }

  const payers = newPayer
    ? [
        ...payersList,
        { name: { $: t('Add new payer', { ns: 'payers' }) }, id: { $: 'add_new' } },
      ]
    : payersList

  const validationSchema = Yup.object().shape({
    profile: Yup.string().required(t('Choose payer')),
    maxamount: Yup.number()
      .positive(
        `${t('The amount must be greater than')} ${
          selectedMethod?.payment_minamount?.$
        } EUR`,
      )
      .min(
        selectedMethod?.payment_minamount?.$,
        `${t('The amount must be greater than')} ${
          selectedMethod?.payment_minamount?.$
        } EUR`,
      )
      .max(
        selectedMethod?.payment_maxamount?.$ > 0
          ? selectedMethod?.payment_maxamount?.$
          : null,
        selectedMethod?.payment_maxamount?.$ > 0
          ? `${t('The amount must be less than')} ${
              selectedMethod?.payment_maxamount?.$
            } EUR`
          : null,
      )
      .required(t('Enter amount')),
    paymethod: Yup.string().required(t('Select a Payment Method')),
    person: newPayer
      ? Yup.string().required(t('Is a required field', { ns: 'other' }))
      : null,
    [payersSelectedFields?.offer_field]: newPayer ? Yup.bool().oneOf([true]) : null,
  })

  const createAutoPaymentMethodHandler = values => {
    const data = {
      profile: values?.profile,
      maxamount: values?.maxamount,
      paymethod: values?.paymethod,
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profiletype: payersSelectedFields?.profiletype || '',
      person: values?.person?.length > 0 ? values?.person : null,
      [payersSelectedFields?.offer_field]: values[payersSelectedFields?.offer_field]
        ? 'on'
        : 'off',
    }

    dispatch(billingOperations.createAutoPayment(data, setIsConfigure))
  }

  return (
    <>
      <div className={s.autoPayTitle}>
        {t('Auto payment form instruction', {
          max_pay_amount: autoPaymentConfig?.maxamount || '0.00',
          min_amount: getAmountsFromString(autoPaymentConfig?.info)?.min_amount || '0.00',
          max_amount: getAmountsFromString(autoPaymentConfig?.info)?.max_amount || '0.00',
        })}
      </div>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          profile: payersList[payersList?.length - 1]?.id?.$ || 'add_new',
          person: '',
          maxamount: autoPaymentConfig?.maxamount || '',
          paymethod: selectedMethod?.paymethod?.$ || '',
          [payersSelectedFields?.offer_field]: false,
        }}
        onSubmit={createAutoPaymentMethodHandler}
      >
        {({ values, setFieldValue, errors, touched }) => {
          const setPayerHandler = val => {
            setFieldValue('profile', val)
            if (val === 'add_new') {
              setNewPayer(true)
            } else {
              setNewPayer(false)
            }
          }

          return (
            <Form className={s.form}>
              <div className={cn(s.formFieldsBlock, s.first)}>
                <Select
                  label={`${t('Payer')}:`}
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
              </div>
              <div className={cn(s.formFieldsBlock, s.first)}>
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
                            setFieldValue(`${payersSelectedFields?.offer_field}`, item)
                          }
                          className={s.checkbox}
                          error={!!errors[payersSelectedFields?.offer_field]}
                        />
                        <div className={s.offerBlockText}>
                          {t('I agree with the terms of the offer', { ns: 'payers' })}
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
              <div className={s.formFieldsBlock}>
                <InputField
                  inputWrapperClass={s.inputHeight}
                  name="maxamount"
                  label={`${t('Amount of payment')}:`}
                  placeholder={t('Not limited')}
                  isShadow
                  className={s.inputPerson}
                  error={!!errors.maxamount}
                  touched={!!touched.maxamount}
                />
                <Select
                  placeholder={t('Not chosen', { ns: 'other' })}
                  value={values.paymethod}
                  getElement={item => setFieldValue('paymethod', item)}
                  isShadow
                  className={s.selectPlatform}
                  itemsList={autoPaymentConfig?.elem?.map(
                    ({ name, payment_minamount, paymethod, image }) => ({
                      label: (
                        <div className={s.selectedItem}>
                          <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                          <div>
                            <span>{name?.$}</span>
                            <span>
                              {t('Payment amount from')} {payment_minamount?.$} EUR
                            </span>
                          </div>
                        </div>
                      ),
                      value: paymethod?.$,
                    }),
                  )}
                />
              </div>
              <Button
                dataTestid={'back_btn'}
                size="large"
                className={s.configureBtn}
                label={t('Confirm', { ns: 'other' })}
                onClick={() => null}
                type="submit"
              />
            </Form>
          )
        }}
      </Formik>
    </>
  )
}