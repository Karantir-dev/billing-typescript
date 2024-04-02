import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, useFormikContext } from 'formik'
import { Button, CheckBox, Modal, PayersList } from '@components'
import {
  billingOperations,
  billingSelectors,
  payersSelectors,
  authSelectors,
} from '@redux'
import { OFERTA_URL, PRIVACY_URL } from '@config/config'
import * as Yup from 'yup'

import s from './ModalCreatePaymentMethod.module.scss'
import { checkIfTokenAlive } from '@utils'
import { OFFER_FIELD } from '@utils/constants'

export default function Component(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['billing', 'other', 'payers', 'cart', 'domains'])

  const { setCreatePaymentModal } = props

  const [isPolicyChecked, setIsPolicyChecked] = useState(false)

  const payersList = useSelector(payersSelectors.getPayersList)

  // const paymentsMethodList = useSelector(billingSelectors.getPaymentsMethodList)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const isStripeAvailable = useSelector(billingSelectors.getIsStripeAvailable)
  const payersData = useSelector(payersSelectors.getPayersData)

  const geoData = useSelector(authSelectors.getGeoData)

  const paymentsCurrency = useSelector(billingSelectors.getPaymentsCurrencyList)

  const createPaymentMethodHandler = values => {
    const data = {
      postcode_physical: values?.postcode_physical,
      eu_vat: values?.eu_vat,
      cnp: values?.cnp,
      city_legal: values?.city_physical,
      city_physical: values?.city_physical,
      address_legal: values?.address_physical,
      address_physical: values?.address_physical,
      postcode: values?.postcode_physical,
      city: values?.city_physical,
      address: values?.address_physical,
      country_physical:
        payersData.selectedPayerFields?.country ||
        payersData.selectedPayerFields?.country_physical ||
        payersSelectedFields?.country ||
        payersSelectedFields?.country_physical ||
        '',
      country_legal:
        payersData.selectedPayerFields?.country ||
        payersData.selectedPayerFields?.country_physical ||
        payersSelectedFields?.country ||
        payersSelectedFields?.country_physical ||
        '',
      profile: values?.profile || 'add_new',
      paymethod: isStripeAvailable.paymethod.$,
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      profiletype: values?.profiletype || '',
      person:
        (payersList && payersList.find(e => e?.id?.$ === values?.profile)?.name?.$) ||
        values?.person ||
        ' ',
      director:
        (payersList && payersList.find(e => e?.id?.$ === values?.profile)?.name?.$) ||
        values?.person ||
        ' ',
      name: '',
      [OFFER_FIELD]: values[OFFER_FIELD] ? 'on' : 'off',
    }

    if (values.profiletype && values.profiletype !== '1') {
      data.jobtitle = 'jobtitle'
      data.rdirector = 'rdirector'
      data.rjobtitle = 'rjobtitle'
      data.ddirector = 'ddirector'
      data.djobtitle = 'djobtitle'
      data.baseaction = 'baseaction'
      data.name = values?.name || ''
    }

    dispatch(billingOperations.finishAddPaymentMethod(data))
  }

  const validationSchema = Yup.object().shape({
    profile: payersList?.length !== 0 ? Yup.string().required(t('Choose payer')) : null,
    slecetedPayMethod: Yup.string().required(t('Select a Payment Method')),
    [OFFER_FIELD]: payersData.selectedPayerFields?.offer_field
      ? Yup.bool().oneOf([true])
      : null,
  })

  return (
    <div className={s.modalBg}>
      <Modal
        closeModal={() => setCreatePaymentModal(false)}
        isOpen
        className={cn(s.modal, {
          [s.visible]: payersSelectedFields && !!payersData.selectedPayerFields,
        })}
      >
        <Modal.Header>
          <span className={s.headerText}>{t('New payment method')}</span>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{
              profile:
                payersData.selectedPayerFields?.profile ||
                payersList?.[payersList?.length - 1]?.id?.$ ||
                '',
              slecetedPayMethod: isStripeAvailable?.paymethod?.$,
              name: payersData.state?.name || payersData.selectedPayerFields?.name || '',
              address_physical:
                payersData.state?.addressPhysical ??
                payersData.selectedPayerFields?.address_physical ??
                '',
              city_physical:
                payersData.state?.cityPhysical ??
                (payersData.selectedPayerFields?.city_physical ||
                  geoData?.clients_city ||
                  ''),
              person:
                payersData.state?.person ?? payersData.selectedPayerFields?.person ?? '',
              country:
                payersSelectedFields?.country ||
                payersSelectedFields?.country_physical ||
                '',
              profiletype:
                payersData.state?.profiletype ||
                payersData.selectedPayerFields?.profiletype ||
                payersSelectedFields?.profiletype,
              eu_vat:
                payersData.state?.euVat || payersData.selectedPayerFields?.eu_vat || '',
              cnp: payersData.state?.cnp || payersData.selectedPayerFields?.cnp || '',
              [OFFER_FIELD]: isPolicyChecked || false,
              payment_currency: {
                title: paymentsCurrency?.payment_currency_list?.filter(
                  e => e?.$key === paymentsCurrency?.payment_currency,
                )[0]?.$,
                value: paymentsCurrency?.payment_currency,
              },
            }}
            onSubmit={createPaymentMethodHandler}
          >
            {({ values, touched, errors }) => {
              const getFieldErrorNames = formikErrors => {
                const transformObjectToDotNotation = (obj, prefix = '', result = []) => {
                  Object.keys(obj).forEach(key => {
                    const value = obj[key]
                    if (!value) return

                    const nextKey = prefix ? `${prefix}.${key}` : key
                    if (typeof value === 'object') {
                      transformObjectToDotNotation(value, nextKey, result)
                    } else {
                      result.push(nextKey)
                    }
                  })

                  return result
                }

                return transformObjectToDotNotation(formikErrors)
              }

              const ScrollToFieldError = ({
                scrollBehavior = { behavior: 'smooth', block: 'center' },
              }) => {
                const { submitCount, isValid, errors } = useFormikContext()

                useEffect(() => {
                  if (isValid) return

                  const fieldErrorNames = getFieldErrorNames(errors)
                  if (fieldErrorNames.length <= 0) return

                  const element = document.querySelector(
                    `input[name='${fieldErrorNames[0]}']`,
                  )
                  if (!element) return

                  try {
                    element.scrollIntoView(scrollBehavior)
                  } catch (e) {
                    checkIfTokenAlive(e?.message, dispatch)
                  }
                }, [submitCount])

                return null
              }

              // const stripeMethod = paymentsMethodList?.find(
              //   e => e?.paymethod?.$ === isStripeAvailable.paymethod.$,
              // )

              return (
                <Form id="create-payment">
                  <ScrollToFieldError />
                  <div className={s.addPayerBlock}>
                    <div className={s.field_wrapper}>
                      <label className={s.label}>
                        {t('Payment method', { ns: 'other' })}
                      </label>
                      <div className={s.stripeCard}>
                        <img
                          src={`${process.env.REACT_APP_BASE_URL}${isStripeAvailable?.image?.$}`}
                          alt="icon"
                        />
                        <div className={s.stripeDescr}>
                          <span>Stripe</span>
                          <span>
                            {t('Payment amount from 1.00 EUR. ', {
                              ns: 'cart',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={s.payersList}>
                      <PayersList />
                    </div>
                    {payersData.selectedPayerFields?.offer_link && (
                      <div className={s.offerBlock}>
                        <CheckBox
                          name={OFFER_FIELD}
                          value={values[OFFER_FIELD]}
                          onClick={() => setIsPolicyChecked(prev => !prev)}
                          className={s.checkbox}
                          error={!!errors[OFFER_FIELD]}
                          touched={!!touched[OFFER_FIELD]}
                        />
                        <div className={s.offerBlockText}>
                          {t('I agree with', {
                            ns: 'payers',
                          })}{' '}
                          <a
                            target="_blank"
                            href={OFERTA_URL}
                            rel="noreferrer"
                            className={s.offerBlockLink}
                          >
                            {t('Terms of Service', { ns: 'domains' })}
                          </a>{' '}
                          {t('and', { ns: 'domains' })}{' '}
                          <a
                            target="_blank"
                            href={PRIVACY_URL}
                            rel="noreferrer"
                            className={s.offerBlockLink}
                          >
                            {t('Terms of the offer', { ns: 'domains' })}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className={s.warn}>
                      <span>{t('click_finish_btn')}</span>
                    </div>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={s.saveBtn}
            isShadow
            size="medium"
            label={t('Proceed', { ns: 'other' })}
            type="submit"
            form="create-payment"
          />
        </Modal.Footer>
      </Modal>
    </div>
  )
}
