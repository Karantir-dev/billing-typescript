import { useEffect, useState, useRef, useReducer } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Select, InputField, CheckBox, PayersList } from '@components'
import {
  billingSelectors,
  payersSelectors,
  billingOperations,
  authSelectors,
} from '@redux'

import { OFERTA_URL } from '@config/config'
import * as Yup from 'yup'
import s from './AutoPaymentForm.module.scss'
import { useMediaQuery } from 'react-responsive'
import {
  ADDRESS_SPECIAL_CHARACTERS_REGEX,
  OFFER_FIELD,
  ADDRESS_REGEX,
} from '@utils/constants'

export default function AutoPaymentForm(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation(['billing', 'other', 'payers'])
  const higherThanMobile = useMediaQuery({ query: '(min-width: 768px)' })

  const descrWrapper = useRef(null)

  const [state, setState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const { setIsConfigure, signal, setIsLoading } = props

  const autoPaymentConfig = useSelector(billingSelectors.getAutoPaymentConfig)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const payersData = useSelector(payersSelectors.getPayersData)

  const payersList = useSelector(payersSelectors.getPayersList)
  const geoData = useSelector(authSelectors.getGeoData)

  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isDescrOpened, setIsDescrOpened] = useState(false)

  const recommendedMaxAmount =
    +autoPaymentConfig?.maxamount < 1 ? '1' : autoPaymentConfig?.maxamount

  useEffect(() => {
    if (autoPaymentConfig && autoPaymentConfig?.elem?.length > 0) {
      setSelectedMethod(autoPaymentConfig?.elem[0])
    }
  }, [autoPaymentConfig])

  const getAmountsFromString = string => {
    const words = string?.match(/[\d|.|\\+]+/g)
    const amounts = []

    if (words?.length > 0) {
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

  const validationSchema = Yup.object().shape({
    profile: payersList?.length !== 0 ? Yup.string().required(t('Choose payer')) : null,
    city_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
    address_physical: Yup.string()
      .matches(ADDRESS_SPECIAL_CHARACTERS_REGEX, t('symbols_restricted', { ns: 'other' }))
      .matches(ADDRESS_REGEX, t('address_error_msg', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
    maxamount: Yup.number()
      .positive(
        `${t('The amount must be greater than')} ${
          selectedMethod?.payment_minamount?.$
        } EUR`,
      )
      .min(1, `${t('min_payment_amount', { ns: 'billing' })}: 1 EUR`)
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
    name:
      payersSelectedFields?.profiletype === '2' ||
      payersSelectedFields?.profiletype === '3'
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    person: Yup.string().required(t('Is a required field', { ns: 'other' })),

    [OFFER_FIELD]: payersData.selectedPayerFields?.offer_field
      ? Yup.bool().oneOf([true])
      : null,
  })

  const createAutoPaymentMethodHandler = values => {
    const data = {
      profile: values?.profile || 'add_new',
      maxamount: values?.maxamount,
      paymethod: values?.paymethod,
      country:
        payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
      eu_vat: values?.eu_vat,
      postcode_physical: values?.postcode_physical,
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

    dispatch(
      billingOperations.createAutoPayment(data, setIsConfigure, signal, setIsLoading),
    )
  }

  const toggleDescrHeight = () => {
    if (!isDescrOpened) {
      descrWrapper.current.style.height = descrWrapper.current.scrollHeight + 10 + 'px'
    } else {
      descrWrapper.current.removeAttribute('style')
    }
    setIsDescrOpened(!isDescrOpened)
  }

  return (
    <>
      <div className={s.description_wrapper} ref={descrWrapper}>
        <p className={s.paragraph}>
          {t('Auto payment form instruction', {
            max_pay_amount: recommendedMaxAmount,
            min_amount:
              getAmountsFromString(autoPaymentConfig?.info)?.min_amount || '0.00',
            max_amount:
              getAmountsFromString(autoPaymentConfig?.info)?.max_amount || '0.00',
          })}
        </p>
      </div>
      {!higherThanMobile && (
        <button
          className={s.btn_more}
          type="button"
          onClick={toggleDescrHeight}
          data-testid="btn_more"
        >
          {t(isDescrOpened ? 'collapse' : 'read_more', { ns: 'other' })}
        </button>
      )}
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          profile:
            payersData.selectedPayerFields?.profile ||
            payersList?.[payersList?.length - 1]?.id?.$ ||
            '',
          person:
            payersData.state?.person ?? payersData.selectedPayerFields?.person ?? '',
          maxamount: state.maxamount ?? (recommendedMaxAmount || ''),
          paymethod: selectedMethod?.paymethod?.$ || '',
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
          country:
            payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
          profiletype:
            payersData.state?.profiletype ||
            payersData.selectedPayerFields?.profiletype ||
            payersSelectedFields?.profiletype,
          eu_vat: payersData.state?.euVat || payersData.selectedPayerFields?.eu_vat || '',
          [OFFER_FIELD]: state.isPolicyChecked || false,
        }}
        onSubmit={createAutoPaymentMethodHandler}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <Form
              className={cn(s.form, {
                [s.visible]: payersSelectedFields && !!payersData.selectedPayerFields,
              })}
            >
              <div className={s.payersList}>
                <PayersList signal={signal} setIsLoading={setIsLoading} />
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
                  onChange={e => {
                    const maxamount = e?.target?.value.replace(/[^0-9.]/g, '')
                    setState({ maxamount })
                  }}
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
                          <img
                            src={`${process.env.REACT_APP_BASE_URL}${image?.$}`}
                            alt="icon"
                          />
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
              <div className={s.formFieldsBlock}>
                {payersData.selectedPayerFields?.offer_link && (
                  <div className={s.offerBlock}>
                    <CheckBox
                      name={OFFER_FIELD}
                      value={values[OFFER_FIELD]}
                      onClick={() =>
                        setState({ isPolicyChecked: !state.isPolicyChecked })
                      }
                      className={s.checkbox}
                      error={!!errors[OFFER_FIELD]}
                      touched={!!touched[OFFER_FIELD]}
                    />
                    <div className={s.offerBlockText}>
                      {t('I agree with the terms of the offer', { ns: 'payers' })}
                      <br />
                      <a
                        target="_blank"
                        href={OFERTA_URL}
                        rel="noreferrer"
                        className={s.offerBlockLink}
                      >
                        {payersSelectedFields?.offer_name}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <Button
                dataTestid={'back_btn'}
                size="large"
                className={s.configureBtn}
                label={t('Confirm', { ns: 'other' })}
                onClick={() => null}
                type="submit"
                isShadow
              />
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
