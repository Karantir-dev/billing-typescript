import { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  BreadCrumbs,
  InputField,
  Button,
  CheckBox,
  Select,
  HintWrapper,
  NsItem,
  Icon,
  Loader,
} from '@components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { domainsOperations, userOperations } from '@redux'
import { DOMAIN_REGEX } from '@utils/constants'
import * as Yup from 'yup'
import * as route from '@src/routes'
import s from './DomainsNsPage.module.scss'
import { roundToDecimal, translatePeriod, useCancelRequest } from '@utils'

export default function Component({ transfer = false }) {
  const { t } = useTranslation(['domains', 'trusted_users', 'auth', 'autoprolong'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [selectedDomain, setSelectedDomain] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({}))

  const [differentNS, setDifferentNS] = useState(false)

  const [paymentData, setPaymentData] = useState(null)

  const { state } = location

  const nsYup = Yup.string().matches(DOMAIN_REGEX, t('ns_format'))

  useEffect(() => {
    const data = { ...state?.contacts }
    if (transfer) {
      data['period'] = -200
    }

    setSelectedDomain(state?.contacts?.selected_domain?.split(', '))
    dispatch(domainsOperations.getDomainsNS({ body: data, signal, setIsLoading }))
    dispatch(
      domainsOperations.getDomainPaymentInfo(data, setPaymentData, signal, setIsLoading),
    )
  }, [])

  useEffect(() => {
    const data = {}
    let shema = {}
    if (selectedDomain?.length > 1 && differentNS) {
      selectedDomain.forEach(el => {
        data[`domainparam_${el}_ns0`] = ''
        data[`domainparam_${el}_ns1`] = ''
        data[`domainparam_${el}_ns2`] = ''
        data[`domainparam_${el}_ns3`] = ''
        data[`domainparam_${el}_ns_additional`] = ''

        shema = {
          ...shema,
          [`domainparam_${el}_ns0`]: nsYup,
          [`domainparam_${el}_ns1`]: nsYup,
          [`domainparam_${el}_ns2`]: nsYup,
          [`domainparam_${el}_ns3`]: nsYup,
          [`domainparam_${el}_ns_additional`]: nsYup,
        }
      })
    } else {
      data['ns0'] = ''
      data['ns1'] = ''
      data['ns2'] = ''
      data['ns3'] = ''
      data['ns_additional'] = ''

      shema = {
        ['ns0']: nsYup,
        ['ns1']: nsYup,
        ['ns2']: nsYup,
        ['ns3']: nsYup,
        ['ns_additional']: nsYup,
      }
    }

    setValidationSchema(Yup.object().shape(shema))

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

    console.log('values that should be sended: ', values)
    for (let key in values) {
      if (key?.includes('licence_agreement_')) {
        console.log('data[key] if key includes licence agreement: ', data[key])
        data[key] = 'on'
      }
    }

    dispatch(
      userOperations.cleanBsketHandler(() =>
        dispatch(domainsOperations.createDomain(data, signal, setIsLoading)),
      ),
    )
  }

  return (
    <>
      <div className={s.page_wrapper}>
        <BreadCrumbs pathnames={parseLocations()} />
        <h1 className={s.page_title}>
          {t('Name servers')}{' '}
          <HintWrapper
            bottom={true}
            popupClassName={s.hintWrapper}
            label={t('Instruction NS')}
          >
            <Icon name="HintHelp" />
          </HintWrapper>
        </h1>
        {selectedDomain?.length > 1 && (
          <div className={s.useFirstCheck}>
            <button
              className={cn(s.btnNsDiff, { [s.selected]: !differentNS })}
              onClick={() => setDifferentNS(false)}
            >
              {t('Apply to all')}
            </button>
            <button
              className={cn(s.btnNsDiff, { [s.selected]: differentNS })}
              onClick={() => setDifferentNS(true)}
            >
              {t('Provide for each domain name')}
            </button>
          </div>
        )}
        {selectedDomain?.length > 0 && (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={sendPaymentDataHandler}
            validationSchema={validationSchema}
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
                            <NsItem
                              setFieldValue={setFieldValue}
                              values={values}
                              select={select}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )
                      })
                    ) : (
                      <div className={s.formBlock}>
                        <NsItem
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          touched={touched}
                        />
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

                          const sums = paymentData[`domain_${select}_details`]?.$?.match(
                            /([\d.]+) EUR/g,
                          ).map(amount => parseFloat(amount))

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
                                      touched={
                                        !!touched[`domainparam_${select}_auth_code`]
                                      }
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
                                      label: translatePeriod($.trim(), $key, t),
                                      value: $key,
                                    }))}
                                  />
                                )}
                                {checkBoxName && (
                                  <div className={s.useFirstCheck}>
                                    <CheckBox
                                      value={values[checkBoxName] === 'on'}
                                      onClick={() => {
                                        setFieldValue(
                                          checkBoxName,
                                          values[checkBoxName] === 'on' ? 'off' : 'on',
                                        )
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
                                    {sums?.length && (
                                      <div>
                                        <p className={s.domainName}>
                                          {domenName}
                                        </p>
                                        <span>
                                          - {roundToDecimal(sums[0])} EUR {t('per year')}
                                        </span>
                                      </div>
                                    )}
                                    {checkBoxName && (
                                      <div>
                                        {t('Data protection')}:{' '}
                                        {`(${t(values[checkBoxName])})`}
                                      </div>
                                    )}
                                    {sums?.length && (
                                      <div className={s.totalAmount}>
                                        {t('Total payable')}: {roundToDecimal(sums[1])}{' '}
                                        EUR
                                      </div>
                                    )}
                                  </div>
                                  {/* <div className={s.useFirstCheck}>
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
                                </div> */}
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
                        onClick={() =>
                          navigate(route.DOMAINS, {
                            replace: true,
                          })
                        }
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

      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
