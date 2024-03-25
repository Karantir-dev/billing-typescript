/* eslint-disable no-unused-vars */
import {
  BreadCrumbs,
  Loader,
  SoftwareOSSelect,
  SoftwareOSBtn,
  CheckBox,
  RadioTypeButton,
  TariffCard,
  ConnectMethod,
  InputField,
  Button,
  Incrementer,
  FixedFooter,
  ScrollToFieldError,
} from '@components'
import * as Yup from 'yup'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsSelectors, userOperations } from '@src/Redux'
import { formatCountryName, getFlagFromCountryName, useCancelRequest } from '@utils'
import cn from 'classnames'
import { ErrorMessage, Form, Formik } from 'formik'
import { PASS_REGEX, PASS_REGEX_ASCII } from '@utils/constants'

import s from './CreateInstancePage.module.scss'

const PERIODS_LIST = [
  { value: 30, label: 'month' },
  { value: 1, label: 'day' },
  { value: 0.0416, label: 'hour' },
]

const IPv4_DAILY_COST = 1 / 30

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps', 'vds', 'auth', 'other'])

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const tariffs = useSelector(cloudVpsSelectors.getInstancesTariffs)
  const dcList = useSelector(cloudVpsSelectors.getDClist)
  const windowsTag = useSelector(cloudVpsSelectors.getWindowsTag)
  const operationSystems = useSelector(cloudVpsSelectors.getOperationSystems)
  const sshList = useSelector(cloudVpsSelectors.getSshList)

  const [currentDC, setCurrentDC] = useState(dcList?.[0])

  useEffect(() => {
    if (!currentDC?.$key && dcList) {
      setCurrentDC(dcList?.[0])
    }
  }, [dcList])

  useEffect(() => {
    if (!tariffs) {
      dispatch(
        cloudVpsOperations.getAllTariffsInfo({
          signal,
          setIsLoading,
          needOsList: !operationSystems,
        }),
      )
    }

    if (tariffs && (!operationSystems || !sshList)) {
      dispatch(
        cloudVpsOperations.getOsList({
          signal,
          setIsLoading,
          closeLoader: () => setIsLoading(false),
          datacenter: currentDC?.$key,
        }),
      )
    }
  }, [])

  const renderSoftwareOSFields = ({
    fieldName,
    value,
    list,
    onOSchange,
    onRecipeChange,
    OSfieldName,
  }) => {
    const elemsData = {}

    list?.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData).map(([name, el]) => {
      if (el.length > 1) {
        const optionsList = el.map(({ $key, $ }) => ({
          value: $key,
          label: $,
        }))

        return (
          <SoftwareOSSelect
            key={optionsList[0].value}
            disabled={el[0].disabled}
            iconName={name.toLowerCase()}
            itemsList={optionsList}
            state={value}
            getElement={value => {
              if (fieldName === OSfieldName) {
                onOSchange(value)
              } else {
                onRecipeChange(value)
              }
            }}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            disabled={el[0].disabled}
            value={el[0].$key}
            state={value}
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={value => {
              if (fieldName === OSfieldName) {
                onOSchange(value)
              } else {
                onRecipeChange(value)
              }
            }}
          />
        )
      }
    })
  }

  const onFormSubmit = async values => {
    const {
      servername,
      password,
      instances_os,
      order_count,
      instances_ssh_keys,
      network_ipv6,
      tariff_id,
      connectionType,
    } = values

    let ipv6_parametr
    if (network_ipv6) {
      ipv6_parametr = await dispatch(
        cloudVpsOperations.getTariffParams({
          signal,
          id: tariff_id,
          datacenter: currentDC?.$key,
          setIsLoading,
        }),
      )
    }

    const orderData = {
      use_ssh_key: connectionType === 'ssh' ? 'on' : 'off',
      pricelist: tariff_id,
      datacenter: currentDC?.$key,
      servername,
      password,
      instances_os,
      order_count,
      instances_ssh_keys,
      ...ipv6_parametr,
    }

    dispatch(
      userOperations.cleanBsketHandler(
        () =>
          dispatch(cloudVpsOperations.setOrderData({ signal, setIsLoading, orderData })),
        signal,
        setIsLoading,
      ),
    )
  }

  const checkIsItWindows = currentOS => {
    return operationSystems?.[currentDC?.$key]
      ?.find(el => el.$key === currentOS)
      ?.$.toLowerCase()
      .includes('windows')
  }

  const validationSchema = Yup.object().shape({
    password: Yup.string().when('connectionType', {
      is: type => type === 'password',
      then: Yup.string()
        .min(8, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .max(48, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(PASS_REGEX_ASCII, t('warnings.invalid_ascii', { ns: 'auth' }))
        .matches(PASS_REGEX, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .required(t('warnings.password_required', { ns: 'auth' })),
    }),
    connectionType: Yup.string().required(t('Is a required field', { ns: 'other' })),
    instances_ssh_keys: Yup.string().when('connectionType', {
      is: type => type === 'ssh',
      then: Yup.string()
        .required(t('Is a required field', { ns: 'other' }))
        .test(
          'ssh_validate',
          t('Is a required field', { ns: 'other' }),
          value => value !== 'none',
        ),
    }),
  })

  return (
    <div className={s.page_padding}>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>

      {tariffs && operationSystems && currentDC && (
        <Formik
          initialValues={{
            instances_os: null,
            tariff_id: null,
            tariffData: null,
            period: 30,
            network_ipv6: false,
            connectionType: '',
            instances_ssh_keys: '',
            password: '',
            servername: '',
            order_count: '1',
          }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => {
            const onDCchange = dc => {
              setCurrentDC(dc)
              setFieldValue('tariff_id', null)
              setFieldValue('instances_os', null)

              if (!operationSystems[dc.$key]) {
                dispatch(
                  cloudVpsOperations.getOsList({
                    signal,
                    setIsLoading,
                    closeLoader: () => setIsLoading(false),
                    datacenter: dc.$key,
                  }),
                )
              }
            }

            const onOSchange = value => {
              setFieldValue('instances_os', value)

              if (checkIsItWindows(value)) {
                setFieldValue('password', '')
                setFieldValue('connectionType', '')
                setFieldValue('instances_ssh_keys', '')
              }
            }

            const isItWindows = checkIsItWindows(values.instances_os)
            const onTariffChange = tariff => {
              setFieldValue('tariff_id', tariff.id.$)
              setFieldValue('tariffData', tariff)
            }

            const filterOSlist = () => {
              let tariffHasWindows

              if (Array.isArray(values.tariffData?.flabel.tag)) {
                tariffHasWindows = values.tariffData.flabel.tag.some(
                  el => el.$ === windowsTag,
                )
              } else {
                tariffHasWindows = values.tariffData?.flabel.tag.$ === windowsTag
              }

              if (tariffHasWindows) {
                return operationSystems[currentDC.$key]
              } else {
                const osList = operationSystems[currentDC.$key]?.map(el => {
                  let newEl = { ...el }
                  if (el.$.toLowerCase().includes('windows')) {
                    newEl.disabled = true
                  }

                  return newEl
                })

                return osList
              }
            }

            /** if we have selected tariff without Windows - we disable this OS */
            const filteredOSlist = filterOSlist()

            /** if we have selected OS Windows - we disable tariffs that don`t support this OS */
            const filteredTariffsList = isItWindows
              ? tariffs[currentDC.$key].map(tariff => {
                  const newTariff = { ...tariff }
                  let supportsWindows
                  if (Array.isArray(tariff.flabel.tag)) {
                    supportsWindows = tariff.flabel.tag.some(el => el.$ === windowsTag)
                  } else {
                    supportsWindows = tariff.flabel.tag.$ === windowsTag
                  }

                  newTariff.disabled = !supportsWindows
                  return newTariff
                })
              : tariffs[currentDC.$key]

            /** data initializing (sets default values) */
            if (!values.instances_os && operationSystems[currentDC.$key]?.[0]?.$key) {
              setFieldValue('instances_os', operationSystems[currentDC.$key]?.[0]?.$key)
            }
            if (!values.instances_ssh_keys && sshList?.[0]?.value) {
              setFieldValue('instances_ssh_keys', sshList?.[0]?.value)
            }
            if (!values.tariff_id && filteredTariffsList?.[0]?.id.$) {
              setFieldValue('tariff_id', filteredTariffsList?.[0]?.id.$)
              setFieldValue('tariffData', filteredTariffsList?.[0])
            }

            const calculatePrice = (tariff, values, period = null, count = 1) => {
              const dailyCost = tariff?.prices.price.cost.$

              period = period ? period : values.period
              let price
              if (values.network_ipv6) price = dailyCost - IPv4_DAILY_COST

              price = dailyCost * period * count

              if (price < 0.01) {
                price = price.toFixed(3)
              } else {
                price = price.toFixed(2)
              }
              return price
            }

            const currentCpu = values.tariffData?.detail.find(el =>
              el.name.$.toLowerCase().includes('cpu'),
            )?.value.$
            const currentDisk = values.tariffData?.detail
              .find(el => el.name.$.toLowerCase() === 'disk space')
              .value.$.replace('.', '')
            const currentCountryName = formatCountryName(currentDC.$)

            return (
              <Form>
                <ScrollToFieldError />
                <section className={s.section}>
                  <h3 className={s.section_title}>{t('server_location')}</h3>

                  <ul className={s.grid}>
                    {dcList?.map(dc => {
                      return (
                        <li
                          className={cn(s.category_item, {
                            [s.selected]: currentDC.$key === dc.$key,
                          })}
                          key={dc.$key}
                        >
                          <button
                            className={cn(s.category_btn)}
                            type="button"
                            onClick={() => onDCchange(dc)}
                          >
                            <img
                              className={s.flag}
                              src={require(`@images/countryFlags/${getFlagFromCountryName(
                                formatCountryName(dc.$),
                              )}.png`)}
                              width={20}
                              height={14}
                              alt={formatCountryName(dc.$)}
                            />
                            {t(formatCountryName(dc.$))}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </section>

                <section className={s.section}>
                  <h3 className={s.section_title}>{t('server_image')}</h3>

                  <div className={s.os_list}>
                    {renderSoftwareOSFields({
                      fieldName: 'instances_os',
                      list: filteredOSlist,
                      value: values.instances_os,
                      onOSchange,
                      OSfieldName: 'instances_os',
                    })}
                  </div>
                </section>

                <section className={s.section}>
                  <h3 className={s.section_title}>{t('Server size')}</h3>

                  <div className={s.period_bar}>
                    <label className={s.ip_checkbox} htmlFor="ipv6">
                      <CheckBox
                        name="network_ipv6"
                        id="ipv6"
                        value={values.network_ipv6}
                        onClick={() => {
                          setFieldValue('network_ipv6', !values.network_ipv6)
                        }}
                      />
                      Enable only IPv6
                      <span className={s.ip_discount}>-1€/mon</span>
                    </label>

                    <RadioTypeButton
                      list={PERIODS_LIST}
                      value={values.period}
                      onClick={value => setFieldValue('period', value)}
                    />
                  </div>

                  <ul className={s.grid}>
                    {filteredTariffsList?.map(tariff => {
                      const price = calculatePrice(tariff, values)

                      return (
                        <TariffCard
                          key={tariff.id.$}
                          tariff={tariff}
                          onClick={() => onTariffChange(tariff)}
                          price={price}
                          active={values.tariff_id === tariff.id.$}
                          disabled={tariff.disabled}
                        />
                      )
                    })}
                  </ul>
                </section>

                <section className={s.section}>
                  <h3 className={s.section_title}>Choose Authentication Method</h3>

                  <ConnectMethod
                    connectionType={values.connectionType}
                    name="connectionType"
                    sshKey={values.instances_ssh_keys}
                    onChangeType={type => setFieldValue('connectionType', type)}
                    setSSHkey={value => setFieldValue('instances_ssh_keys', value)}
                    setPassword={value => setFieldValue('password', value)}
                    errors={errors}
                    touched={touched}
                    sshList={sshList}
                    isWindows={isItWindows}
                  />
                  <ErrorMessage
                    className={s.error_message}
                    name="connectionType"
                    component="span"
                  />
                </section>

                <section className={s.section}>
                  <h3 className={s.section_title}>{t('Server name')}</h3>
                  <div className={s.grid}>
                    <InputField
                      inputWrapperClass={s.input_wrapper}
                      inputClassName={s.input}
                      name="servername"
                      placeholder={t('serverName')}
                      isShadow
                    />
                  </div>
                </section>

                <FixedFooter isShown={values.tariff_id}>
                  <div className={s.footer_container}>
                    <div className={cn(s.footer_parameters, s.footer_item)}>
                      <div className={s.footer_params_row}>
                        <span className={s.footer_params_label}>Location</span>
                        <img
                          className={s.flag}
                          src={require(`@images/countryFlags/${getFlagFromCountryName(
                            currentCountryName,
                          )}.png`)}
                          width={20}
                          height={14}
                          alt={currentCountryName}
                        />
                        {t(currentCountryName)}
                      </div>
                      <div className={s.footer_params_row}>
                        <span className={s.footer_params_label}>CPU</span>
                        {currentCpu}
                      </div>
                      <div className={s.footer_params_row}>
                        <span className={s.footer_params_label}>NVMe</span>
                        {currentDisk}
                      </div>
                    </div>

                    <div className={s.footer_item}>
                      <p className={s.label}>{t('amount', { ns: 'vds' })}:</p>
                      <Incrementer
                        count={values.order_count}
                        setCount={value => setFieldValue('order_count', value)}
                        max={35}
                      />
                    </div>

                    <div className={s.footer_item}>
                      <p className={s.label}>{t('summary', { ns: 'vds' })}:</p>
                      <p className={s.footer_price}>
                        €
                        {calculatePrice(
                          values.tariffData,
                          values,
                          PERIODS_LIST.find(el => el.label === 'day').value,
                          values.order_count,
                        )}
                        /<span className={s.price_period}>{t('day')}</span>
                      </p>
                      <p className={s.footer_hour_price}>
                        (€
                        {calculatePrice(
                          values.tariffData,
                          values,
                          PERIODS_LIST.find(el => el.label === 'hour').value,
                          values.order_count,
                        )}
                        /{t('hour')})
                      </p>
                    </div>

                    <Button
                      className={cn(s.btn_buy, s.footer_item)}
                      label={t('create instanse', { ns: 'other' })}
                      type="submit"
                      isShadow
                      // onClick={() => {
                      //   values.agreement === 'off' &&
                      //     agreementEl.current.scrollIntoView({
                      //       behavior: 'smooth',
                      //     })
                      // }}
                    />
                  </div>
                </FixedFooter>
              </Form>
            )
          }}
        </Formik>
      )}
      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
