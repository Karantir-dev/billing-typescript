import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { Cross, Check } from '../../images'
import { Select, InputField, Button, CheckBox, DomainItem, DedicItem } from '..'
import { cartOperations, payersOperations, payersSelectors } from '../../Redux'
import * as Yup from 'yup'
import s from './Cart.module.scss'
import { BASE_URL } from '../../config/config'

export default function Component() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation([
    'cart',
    'other',
    'payers',
    'billing',
    'dedicated_servers',
  ])

  const [newPayer, setNewPayer] = useState(false)
  const [paymentsMethodList, setPaymentsMethodList] = useState([])

  const [cartData, setCartData] = useState(null)

  const [isClosing, setIsClosing] = useState(false)

  const payersList = useSelector(payersSelectors.getPayersList)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  useEffect(() => {
    const data = {
      country: payersSelectLists?.country[0]?.$key,
      profiletype: payersSelectLists?.profiletype[0]?.$key,
    }

    dispatch(cartOperations.getBasket(setCartData, setPaymentsMethodList))

    dispatch(payersOperations.getPayerModalInfo(data))
  }, [])

  const validationSchema = Yup.object().shape({
    profile: Yup.string().required(t('Choose payer')),
    slecetedPayMethod: Yup.object().required(t('Select a Payment Method')),
    person: newPayer
      ? Yup.string().required(t('Is a required field', { ns: 'other' }))
      : null,
    [payersSelectedFields?.offer_field]: newPayer ? Yup.bool().oneOf([true]) : null,
  })

  const offerTextHandler = () => {
    dispatch(payersOperations.getPayerOfferText(payersSelectedFields?.offer_link))
  }

  const payers = newPayer
    ? [
        ...payersList,
        { name: { $: t('Add new payer', { ns: 'payers' }) }, id: { $: 'add_new' } },
      ]
    : payersList

  const setPromocodeToCart = promocode => {
    dispatch(
      cartOperations.setBasketPromocode(promocode, setCartData, setPaymentsMethodList),
    )
  }

  const deleteBasketItemHandler = item_id => {
    dispatch(cartOperations.deleteBasketItem(item_id, setCartData, setPaymentsMethodList))
  }

  const closeBasketHamdler = basket_id => {
    dispatch(cartOperations.clearBasket(basket_id))
  }

  const payBasketHandler = values => {
    const data = {
      billorder: cartData?.billorder,
      amount: cartData?.total_sum,
      profile: values?.profile,
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

    if (values?.slecetedPayMethod?.action?.button?.$name === 'fromsubaccount') {
      data['clicked_button'] = 'fromsubaccount'
    }
    dispatch(cartOperations.setPaymentMethods(data, navigate))
  }

  const renderItems = () => {
    const domainsList = cartData?.elemList?.filter(
      elem => elem['item.type']?.$ === 'domain',
    )

    const dedicList = cartData?.elemList?.filter(elem => elem['item.type']?.$ === 'dedic')

    return (
      <>
        {domainsList?.length > 0 && (
          <>
            <div className={s.formBlockTitle}>{t('Domain registration')}:</div>
            {domainsList?.map(el => {
              const { id, desc, cost, fullcost, discount_percent } = el
              return (
                <DomainItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  fullcost={fullcost?.$}
                  discount_percent={discount_percent?.$}
                  deleteItemHandler={
                    domainsList?.length > 1 ? () => deleteBasketItemHandler(id?.$) : null
                  }
                />
              )
            })}
          </>
        )}

        {dedicList?.length > 0 && (
          <>
            <div className={s.formBlockTitle}>
              {t('dedicated_server', { ns: 'dedicated_servers' })}:
            </div>
            {dedicList?.map(el => {
              const { id, desc, cost, fullcost, discount_percent, pricelist_name } = el
              return (
                <DedicItem
                  key={id?.$}
                  desc={desc?.$}
                  cost={cost?.$}
                  fullcost={fullcost?.$}
                  discount_percent={discount_percent?.$}
                  pricelist_name={pricelist_name?.$}
                  deleteItemHandler={
                    dedicList?.length > 1 ? () => deleteBasketItemHandler(id?.$) : null
                  }
                />
              )
            })}
          </>
        )}
      </>
    )
  }

  return (
    <div className={cn(s.modalBg, { [s.closing]: isClosing })}>
      {!isClosing ? (
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <span className={s.headerText}>{t('Payment')}</span>
            <Cross onClick={() => setIsClosing(true)} className={s.crossIcon} />
          </div>
          <div className={s.itemsBlock}>{renderItems()}</div>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{
              profile: payersList[payersList?.length - 1]?.id?.$ || 'add_new',
              slecetedPayMethod: undefined,
              person: '',
              promocode: '',
              [payersSelectedFields?.offer_field]: false,
            }}
            onSubmit={payBasketHandler}
          >
            {({ values, setFieldValue, touched, errors }) => {
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
                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Promo code')}:</div>
                    <div className={cn(s.formFieldsBlock, s.first)}>
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="promocode"
                        placeholder={t('Enter promo code', { ns: 'other' })}
                        isShadow
                        className={s.inputPerson}
                        error={!!errors.promocode}
                        touched={!!touched.promocode}
                        isRequired
                      />
                      <button
                        onClick={() => setPromocodeToCart(values?.promocode)}
                        disabled={values?.promocode?.length === 0}
                        type="button"
                        className={s.promocodeBtn}
                      >
                        {t('Apply', { ns: 'other' })}
                      </button>
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Payer')}:</div>
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
                    <div className={s.formBlockTitle}>{t('Payment method')}:</div>
                    <div className={s.formFieldsBlock}>
                      {paymentsMethodList?.map(method => {
                        const { image, name, paymethod_type, paymethod } = method

                        let paymentName = name?.$
                        let balance = ''

                        if (paymentName?.includes('Account balance')) {
                          balance = paymentName?.match(/[\d|.|\\+]+/g)
                          paymentName = t('Account balance')
                        }

                        return (
                          <button
                            onClick={() => {
                              setFieldValue('slecetedPayMethod', method)
                            }}
                            type="button"
                            className={cn(s.paymentMethodBtn, {
                              [s.selected]:
                                paymethod_type?.$ ===
                                  values?.slecetedPayMethod?.paymethod_type?.$ &&
                                paymethod?.$ === values?.slecetedPayMethod?.paymethod?.$,
                            })}
                            key={name?.$}
                          >
                            <img src={`${BASE_URL}${image?.$}`} alt="icon" />
                            <span>
                              {paymentName}
                              {balance?.length > 0 && (
                                <>
                                  <br />{' '}
                                  <span className={s.balance}>
                                    {Number(balance).toFixed(2)} EUR
                                  </span>
                                </>
                              )}
                            </span>
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

                  <div className={s.infotext}>
                    {t('Payment using text')}{' '}
                    {values?.slecetedPayMethod &&
                      values?.slecetedPayMethod?.payment_minamount && (
                        <span>
                          {t('Payment amount')}
                          {values?.slecetedPayMethod?.payment_minamount?.$} EUR
                        </span>
                      )}
                  </div>

                  <div className={s.totalSum}>
                    {t('Total')}: <b>{cartData?.total_sum} EUR</b>
                  </div>

                  <div className={s.btnBlock}>
                    <Button
                      disabled={
                        Number(values.amount) <
                          values?.slecetedPayMethod?.payment_minamount?.$ ||
                        !values?.slecetedPayMethod
                      }
                      className={s.saveBtn}
                      isShadow
                      size="medium"
                      label={t('Pay', { ns: 'billing' })}
                      type="submit"
                    />
                    <button
                      onClick={() => setIsClosing(true)}
                      type="button"
                      className={s.cancel}
                    >
                      {t('Close', { ns: 'other' })}
                    </button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      ) : (
        <div className={s.modalCloseBlock}>
          <div className={s.closeText}>
            {t('After closing your order will be automatically deleted')}
          </div>
          <div className={s.btnCloseBlock}>
            <Button
              onClick={() => closeBasketHamdler(cartData?.billorder)}
              className={s.saveBtn}
              isShadow
              size="medium"
              label={t('OK')}
              type="button"
            />
            <button onClick={() => setIsClosing(false)} type="button" className={s.close}>
              {t('Cancel', { ns: 'other' })}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
