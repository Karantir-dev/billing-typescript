import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { BreadCrumbs, InputField, Button, CheckBox, Select } from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { PRIVACY_URL } from '../../../../config/config'
import { domainsOperations } from '../../../../Redux'
import * as route from '../../../../routes'
import s from './DomainsNsPage.module.scss'

export default function Component({ transfer = false }) {
  const { t } = useTranslation(['domains', 'trusted_users'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const [selectedDomain, setSelectedDomain] = useState([])
  const [initialValues, setInitialValues] = useState({})

  const [differentNS, setDifferentNS] = useState(false)

  const [paymentData, setPaymentData] = useState(null)

  const { state } = location

  useEffect(() => {
    const data = { ...state?.contacts }
    if (transfer) {
      data['period'] = -200
    }
    setSelectedDomain(state?.contacts?.selected_domain?.split(', '))
    dispatch(domainsOperations.getDomainsNS(data))
    dispatch(domainsOperations.getDomainPaymentInfo(data, setPaymentData))
  }, [])

  useEffect(() => {
    const data = {}
    if (selectedDomain?.length > 1 && differentNS) {
      selectedDomain.forEach(el => {
        data[`domainparam_${el}_ns0`] = ''
        data[`domainparam_${el}_ns1`] = ''
        data[`domainparam_${el}_ns2`] = ''
        data[`domainparam_${el}_ns3`] = ''
        data[`domainparam_${el}_ns_additional`] = ''
      })
    } else {
      data['ns0'] = ''
      data['ns1'] = ''
      data['ns2'] = ''
      data['ns3'] = ''
      data['ns_additional'] = ''
    }

    if (paymentData) {
      selectedDomain?.forEach(select => {
        data[`autoprolong_${select}`] = paymentData[`autoprolong_${select}`]?.$
        data[`licence_agreement_${select}`] =
          paymentData[`licence_agreement_${select}`]?.$

        if (transfer) {
          data[`domainparam_${select}_auth_code`] = ''
        }

        const keys = Object.keys(paymentData)

        keys.forEach(key => {
          if (key?.includes('addon') && !key?.includes('sum')) {
            data[key] = paymentData[key]?.$
          }
        })
      })
    }

    setInitialValues(data)
  }, [selectedDomain, differentNS, paymentData])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const sendPaymentDataHandler = values => {
    const data = { ...values, ...state?.contacts }

    if (transfer) {
      data['period'] = -200
    }

    dispatch(domainsOperations.createDomain(data, navigate))
  }

  // const openTermsHandler = link => {
  //   dispatch(domainsOperations?.getTermsOfConditionalText(link))
  // }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Name servers')}</h1>
      <div className={s.instructionNS}>{t('Instruction NS')}</div>
      {selectedDomain?.length > 1 && (
        <div className={s.useFirstCheck}>
          <CheckBox
            initialState={differentNS}
            setValue={setDifferentNS}
            className={s.checkbox}
          />
          <span>{t('Private name servers for each domain')}</span>
        </div>
      )}
      {selectedDomain?.length > 0 && (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={sendPaymentDataHandler}
        >
          {({ errors, touched, values, setFieldValue }) => {
            return (
              <Form className={s.form}>
                <>
                  {differentNS ? (
                    selectedDomain?.map((select, index) => {
                      return (
                        <div key={select} className={s.formBlock}>
                          <div className={s.formBlockTitle}>
                            {
                              state?.contacts?.selected_domain_real_name?.split(', ')[
                                index
                              ]
                            }
                          </div>
                          <div className={s.formFieldsBlock}>
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns0`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns0`]}
                              touched={!!touched[`domainparam_${select}_ns0`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns1`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns1`]}
                              touched={!!touched[`domainparam_${select}_ns1`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns2`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns2`]}
                              touched={!!touched[`domainparam_${select}_ns2`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns3`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns3`]}
                              touched={!!touched[`domainparam_${select}_ns3`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns_additional`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns_additional`]}
                              touched={!!touched[`domainparam_${select}_ns_additional`]}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className={s.formBlock}>
                      <div className={s.formFieldsBlock}>
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns0'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['s0']}
                          touched={!!touched['ns0']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns1'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns1']}
                          touched={!!touched['ns1']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns2'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns2']}
                          touched={!!touched['ns2']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns3'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns3']}
                          touched={!!touched['ns3']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns_additional'}
                          label={`${t('Additional NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns_additional']}
                          touched={!!touched['ns_additional']}
                        />
                      </div>
                    </div>
                  )}
                  <div className={s.formBlock}>
                    <h1 className={s.page_title}>{t('Service parameters')}</h1>

                    {paymentData &&
                      selectedDomain?.map((select, index) => {
                        let defenseSum = '0'
                        let checkBoxName = ''

                        const keys = Object.keys(paymentData)

                        keys.forEach(key => {
                          if (
                            key?.includes('addon') &&
                            key?.includes('sum') &&
                            key?.includes(select)
                          ) {
                            defenseSum = paymentData[key]?.match(/[\d|.|\\+]+/g)[0]
                          } else if (
                            key?.includes('addon') &&
                            !key?.includes('sum') &&
                            key?.includes(select)
                          ) {
                            checkBoxName = key
                          }
                        })

                        const domenName =
                          state?.contacts?.selected_domain_real_name?.split(', ')[index]

                        const sums =
                          paymentData[`domain_${select}_details`]?.$?.match(
                            /[\d|.|\\+]+/g,
                          )

                        return (
                          <div key={select} className={s.formBlock}>
                            <div className={s.formBlockTitle}>{domenName}</div>
                            <div className={s.formFieldsBlock}>
                              {transfer && (
                                <>
                                  <InputField
                                    inputWrapperClass={s.inputHeight}
                                    name={`domainparam_${select}_auth_code`}
                                    label={`${t('Confirmation code')}:`}
                                    placeholder={t('Enter code', { ns: 'other' })}
                                    isShadow
                                    className={s.input}
                                    error={!!errors[`domainparam_${select}_auth_code`]}
                                    touched={!!touched[`domainparam_${select}_auth_code`]}
                                    isRequired
                                  />
                                  <div className={s.confCodeInstruct}>
                                    {t('conf_code_instruction')}
                                  </div>
                                </>
                              )}

                              {!transfer && (
                                <Select
                                  placeholder={t('Not chosen', { ns: 'other' })}
                                  label={`${t('Auto renewal')}:`}
                                  value={values[`autoprolong_${select}`]}
                                  getElement={item =>
                                    setFieldValue(`autoprolong_${select}`, item)
                                  }
                                  isShadow
                                  className={s.select}
                                  itemsList={paymentData[
                                    `autoprolong_${select}_list`
                                  ]?.map(({ $key, $ }) => ({
                                    label: t(`${$.trim()}`),
                                    value: $key,
                                  }))}
                                />
                              )}
                              {checkBoxName && (
                                <div className={s.useFirstCheck}>
                                  <CheckBox
                                    initialState={values[checkBoxName] === 'on'}
                                    setValue={item => {
                                      setFieldValue(checkBoxName, item ? 'on' : 'off')
                                    }}
                                    className={s.checkbox}
                                  />
                                  <span>
                                    {t('Data protection ({{sum}} EUR per year)', {
                                      sum: defenseSum,
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className={s.formBlock}>
                              <h1 className={s.page_title}>{t('Order Details')}</h1>
                              <div className={cn(s.formFieldsBlock, s.flexStart)}>
                                <div className={s.details}>
                                  <div>
                                    {domenName} - {sums[2]} EUR {t('per year')}
                                  </div>
                                  {checkBoxName && (
                                    <div>
                                      {t('Data protection')}:{' '}
                                      {`(${t(values[checkBoxName])})`}
                                    </div>
                                  )}

                                  <div className={s.totalAmount}>
                                    {t('Total payable')}: {sums[3]} EUR
                                  </div>
                                </div>
                                <div className={s.useFirstCheck}>
                                  <CheckBox
                                    initialState={
                                      values[`licence_agreement_${select}`] === 'on'
                                    }
                                    setValue={item => {
                                      setFieldValue(
                                        `licence_agreement_${select}`,
                                        item ? 'on' : 'off',
                                      )
                                    }}
                                    className={s.checkbox}
                                    error={values[`licence_agreement_${select}`] !== 'on'}
                                  />
                                  <span className={s.agreeTerms}>
                                    {t('I have read and agree to the')}
                                    {'\n'}
                                    <a
                                      target="_blank"
                                      href={PRIVACY_URL}
                                      rel="noreferrer"
                                    >{`"${t('Terms of Service')}"`}</a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                  <div className={s.btnBlock}>
                    <Button
                      className={s.saveBtn}
                      isShadow
                      size="medium"
                      label={t('Proceed', { ns: 'other' })}
                      type="submit"
                    />
                    <button
                      onClick={() => navigate(route.DOMAINS)}
                      type="button"
                      className={s.cancel}
                    >
                      {t('Cancel', { ns: 'other' })}
                    </button>
                  </div>
                </>
              </Form>
            )
          }}
        </Formik>
      )}
    </div>
  )
}
