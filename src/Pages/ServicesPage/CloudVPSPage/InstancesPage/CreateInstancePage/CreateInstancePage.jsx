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
  HintWrapper,
  WarningMessage,
} from '@components'
import * as Yup from 'yup'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  cloudVpsActions,
  billingActions,
  cloudVpsOperations,
  cloudVpsSelectors,
  userOperations,
  userSelectors,
} from '@src/Redux'
import {
  formatCountryName,
  getFlagFromCountryName,
  roundToDecimal,
  useCancelRequest,
} from '@utils'
import cn from 'classnames'
import { ErrorMessage, Form, Formik } from 'formik'
import { PASS_REGEX, PASS_REGEX_ASCII, DISALLOW_SPACE } from '@utils/constants'
import { useMediaQuery } from 'react-responsive'
import { Modals } from '@src/Components/Services/Instances/Modals/Modals'

import s from './CreateInstancePage.module.scss'

const IPv4_DAILY_COST = 1 / 30

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps', 'vds', 'auth', 'other', 'countries'])

  const PERIODS_LIST = [
    { id: 'month', value: 30, label: t('month', { ns: 'other' }) },
    { id: 'day', value: 1, label: t('day', { ns: 'cloud_vps' }) },
    { id: 'hour', value: 0.0416, label: t('hour', { ns: 'cloud_vps' }) },
  ]

  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const warningEl = useRef()

  const tariffs = useSelector(cloudVpsSelectors.getInstancesTariffs)
  const dcList = useSelector(cloudVpsSelectors.getDClist)
  const windowsTag = useSelector(cloudVpsSelectors.getWindowsTag)
  const operationSystems = useSelector(cloudVpsSelectors.getOperationSystems)
  const globalSshList = useSelector(cloudVpsSelectors.getSshList)
  const { credit, realbalance } = useSelector(userSelectors.getUserInfo)

  const [sshList, setSshList] = useState()
  const [currentDC, setCurrentDC] = useState()
  const [periodCaptionShown, setPeriodCaptionShown] = useState(false)

  const dataFromSite = JSON.parse(localStorage.getItem('site_cart') || '{}')

  useEffect(() => {
    const formatedList = globalSshList?.map(el => {
      return { value: el.elid.$, label: el.comment.$ }
    })

    formatedList && setSshList(formatedList)
  }, [globalSshList])

  useEffect(() => {
    if (!currentDC?.$key && dcList) {
      const location = dataFromSite.location

      const dcFromSite = dcList.find(el => el.$key === location)
      dcFromSite ? setCurrentDC(dcFromSite) : setCurrentDC(dcList?.[0])
    }
  }, [dcList])

  useEffect(() => {
    if (
      (dataFromSite.location && !tariffs[dataFromSite.location]) ||
      !Object.keys(tariffs).length
    ) {
      dispatch(
        cloudVpsOperations.getAllTariffsInfo({
          signal,
          setIsLoading,
          needOsList: !operationSystems,
          setSshList,
          datacenter: dataFromSite.location || '',
        }),
      )
    } else if (tariffs && (!operationSystems || !sshList)) {
      dispatch(
        cloudVpsOperations.getOsList({
          signal,
          setIsLoading,
          closeLoader: () => setIsLoading(false),
          datacenter: dcList?.[0]?.$key,
          setSshList,
        }),
      )
    }

    return () => {
      localStorage.removeItem('site_cart')
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
          <HintWrapper
            label={t('windows_disabled')}
            key={optionsList[0].value}
            disabled={!el[0].disabled}
            hintDelay={200}
          >
            <SoftwareOSSelect
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
          </HintWrapper>
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
      ssh_keys,
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
      instances_ssh_keys: ssh_keys,
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
        .matches(DISALLOW_SPACE, t('warnings.disallow_space', { ns: 'auth' }))
        .required(t('warnings.password_required', { ns: 'auth' })),
    }),
    connectionType: Yup.string().required(t('Is a required field', { ns: 'other' })),
    ssh_keys: Yup.string().when('connectionType', {
      is: type => type === 'ssh',
      then: Yup.string()
        .required(t('Is a required field', { ns: 'other' }))
        .test(
          'ssh_validate',
          t('Is a required field', { ns: 'other' }),
          value => value !== 'none',
        ),
    }),
    servername: Yup.string().max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
  })

  const setNewSshKey = values => {
    dispatch(
      cloudVpsOperations.editSsh({
        ...values,
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ ssh_rename: false })),
      }),
    )
  }
  const tariffFromSite = tariffs?.[currentDC?.$key]?.find(el =>
    el.title.main.$.toLowerCase().includes(dataFromSite?.name?.toLowerCase()),
  )

  return (
    <div className={s.page_padding}>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>

      {tariffs && operationSystems && currentDC && (
        <Formik
          initialValues={{
            instances_os: null,
            tariff_id: tariffFromSite?.id.$ || null,
            tariffData: tariffFromSite || null,
            period: 30,
            network_ipv6: !!dataFromSite?.network_ipv6 || false,
            connectionType: '',
            ssh_keys: '',
            password: '',
            servername: '',
            order_count: '1',
            notEnoughMoney: '',
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
                setFieldValue('ssh_keys', '')
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

            if (!values.ssh_keys && sshList?.[0]?.value) {
              setFieldValue('ssh_keys', sshList?.[0]?.value)
            }
            if (!values.tariff_id && filteredTariffsList?.[0]?.id.$) {
              setFieldValue('tariff_id', filteredTariffsList?.[0]?.id.$)
              setFieldValue('tariffData', filteredTariffsList?.[0])
            }

            const calculatePrice = (tariff, values, period = null, count = 1) => {
              const dailyCost = tariff?.prices.price.cost.$

              period = period ? period : values.period
              let price = dailyCost
              if (values.network_ipv6) price -= IPv4_DAILY_COST

              price = price * period * count

              if (price < 0.01) {
                price = roundToDecimal(price, 'ceil', 3)
              } else {
                price = roundToDecimal(price)
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

            const finalPrice = calculatePrice(
              values.tariffData,
              values,
              PERIODS_LIST.find(el => el.id === 'day').value,
              values.order_count,
            )

            const totalBalance = credit ? +realbalance + +credit : +realbalance

            if (finalPrice > totalBalance && finalPrice < 1) {
              !values.notEnoughMoney && setFieldValue('notEnoughMoney', true)
            } else {
              values.notEnoughMoney && setFieldValue('notEnoughMoney', false)
            }

            return (
              <Form>
                <ScrollToFieldError />

                {values.notEnoughMoney && (
                  <WarningMessage className={s.warning} ref={warningEl}>
                    {t('not_enough_money', { ns: 'cloud_vps' })}{' '}
                    <button
                      className={s.link}
                      type="button"
                      onClick={() =>
                        dispatch(billingActions.setIsModalCreatePaymentOpened(true))
                      }
                    >
                      {t('top_up', { ns: 'cloud_vps' })}
                    </button>
                  </WarningMessage>
                )}

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
                            {t(formatCountryName(dc.$), { ns: 'countries' })}
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
                  <h3 className={s.section_title}>{t('server_size')}</h3>

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
                      {t('cloud_ipv6')}
                      <span className={s.ip_discount}>
                        -1€/{t('short_month', { ns: 'other' })}
                      </span>
                    </label>

                    <RadioTypeButton
                      withCaption
                      label={t('price_per')}
                      list={PERIODS_LIST}
                      value={values.period}
                      onClick={value => setFieldValue('period', value)}
                    />
                  </div>
                  <button
                    className={cn(s.period_description, {
                      [s.truncated]: !periodCaptionShown,
                    })}
                    type="button"
                    onClick={() => setPeriodCaptionShown(value => !value)}
                    disabled={widerThan1550}
                  >
                    <span className="asterisk">*</span>
                    {t('period_description')}
                  </button>

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
                  <h3 className={s.section_title}>{t('authentication_method')}</h3>

                  <ConnectMethod
                    connectionType={values.connectionType}
                    name="connectionType"
                    sshKey={values.ssh_keys}
                    onChangeType={type => setFieldValue('connectionType', type)}
                    setSSHkey={value => setFieldValue('ssh_keys', value)}
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
                  <h3 className={s.section_title}>{t('server_name', { ns: 'vds' })}</h3>
                  <div className={s.grid}>
                    <InputField
                      inputWrapperClass={s.input_wrapper}
                      inputClassName={s.input}
                      name="servername"
                      placeholder={t('server_name', { ns: 'vds' })}
                      isShadow
                    />
                  </div>
                </section>

                <FixedFooter isShown={values.tariff_id}>
                  <div className={s.footer_container}>
                    <div className={cn(s.footer_parameters, s.footer_item)}>
                      <div className={s.footer_params_row}>
                        <span className={s.footer_params_label}>
                          {t('location', { ns: 'cloud_vps' })}
                        </span>
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
                      <p className={s.label}>{t('amount', { ns: 'vds' })}</p>
                      <Incrementer
                        count={values.order_count}
                        setCount={value => setFieldValue('order_count', value)}
                        max={35}
                      />
                    </div>

                    <div className={s.footer_item}>
                      <p className={s.label}>{t('Sum', { ns: 'other' })}</p>
                      <p className={s.footer_price}>
                        €{finalPrice}/<span className={s.price_period}>{t('day')}</span>
                      </p>
                      <p className={s.footer_hour_price}>
                        (€
                        {calculatePrice(
                          values.tariffData,
                          values,
                          PERIODS_LIST.find(el => el.id === 'hour').value,
                          values.order_count,
                        )}
                        /{t('hour')})
                      </p>
                    </div>

                    <Button
                      className={cn(s.btn_buy, s.footer_item)}
                      label={t('create_instance', { ns: 'cloud_vps' })}
                      type="submit"
                      isShadow
                      onClick={e => {
                        if (values.notEnoughMoney) {
                          e.preventDefault()

                          warningEl.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                          })
                        }
                      }}
                    />
                  </div>
                </FixedFooter>
              </Form>
            )
          }}
        </Formik>
      )}
      <Modals addNewSshSubmit={setNewSshKey} />
      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
