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
  WarningMessage,
  Button,
  Incrementer,
  FixedFooter,
} from '@components'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsSelectors } from '@src/Redux'
import { getFlagFromCountryName, useCancelRequest } from '@src/utils'
import cn from 'classnames'
import { Form, Formik } from 'formik'

import s from './CreateInstancePage.module.scss'

const periodList = [
  { value: 30, label: 'month' },
  { value: 1, label: 'day' },
  { value: 0.0416, label: 'hour' },
]

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const tariffs = useSelector(cloudVpsSelectors.getInstancesTariffs)
  const dcList = useSelector(cloudVpsSelectors.getDClist)
  const windowsTag = useSelector(cloudVpsSelectors.getWindowsTag)
  const osList = useSelector(cloudVpsSelectors.getOsList)
  const sshList = useSelector(cloudVpsSelectors.getSshList)
  console.log(windowsTag)
  const [currentDC, setCurrentDC] = useState(dcList?.[0]?.$key)

  const onDCchange = $key => {
    setCurrentDC($key)
  }

  useEffect(() => {
    if (!tariffs) {
      dispatch(
        cloudVpsOperations.getAllTariffsInfo({
          signal,
          setIsLoading,
          needOsList: !osList,
        }),
      )
    }

    if (tariffs && (!osList || !sshList)) {
      dispatch(
        cloudVpsOperations.getOsList({
          signal,
          setIsLoading,
          closeLoader: () => setIsLoading(false),
        }),
      )
    }
  }, [])

  useEffect(() => {
    if (!currentDC && dcList) {
      setCurrentDC(dcList?.[0]?.$key)
    }
  }, [dcList])

  const renderSoftwareOSFields = ({
    fieldName,
    value,
    // eslint-disable-next-line no-unused-vars
    ostempl,
    list,
    onOSchange,
    onRecipeChange,
    OSfieldName,
  }) => {
    // let dataArr = parametersInfo.slist.find(el => el.$name === fieldName)?.val

    const elemsData = {}
    // if (fieldName === 'recipe') {
    //   list = list?.filter(el => el.$depend === ostempl && el.$key !== 'null')
    //   elemsData.null = [{ $key: 'null', $: t('without_software') }]
    // }

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

  return (
    <div>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>
      <section className={s.section}>
        <h3 className={s.section_title}>{t('server_location')}</h3>

        <ul className={s.categories_list}>
          {dcList?.map(({ $key, $ }) => {
            return (
              <li
                className={cn(s.category_item, { [s.selected]: currentDC === $key })}
                key={$key}
              >
                <button
                  className={cn(s.category_btn)}
                  type="button"
                  onClick={() => {
                    onDCchange($key)
                  }}
                >
                  <img
                    className={s.flag}
                    src={require(`@images/countryFlags/${getFlagFromCountryName(
                      $.replace('Fotbo ', ''),
                    )}.png`)}
                    width={20}
                    height={14}
                    alt={$.replace('Fotbo ', '')}
                  />
                  {t($)}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <Formik
        // enableReinitialize
        initialValues={{
          instances_os: osList?.[0]?.$key || '',
          tariff_id: '',
          period: 30,
          network_ipv6: false,
          connectionType: '',
          ssh_keys: '',
          password: '',
          servername: '',
          order_count: '',
        }}
        // validationSchema={validationSchema}
        // onSubmit={onFormSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => {
          const onOSchange = value => {
            setFieldValue('instances_os', value)
          }
          console.log(values.instances_os)
          const onTariffChange = id => {
            setFieldValue('tariff_id', id)
          }

          const isItWindows = osList
            ?.find(el => el.$key === values.instances_os)
            ?.$.toLowerCase()
            .includes('windows')

          const filteredTariffsList = isItWindows
            ? tariffs?.[currentDC].filter(tariff => {
                if (Array.isArray(tariff.flabel.tag)) {
                  return tariff.flabel.tag.some(el => el.$ === windowsTag)
                } else {
                  tariff.flabel.tag.$ === windowsTag
                }
              })
            : tariffs?.[currentDC]

          return (
            <Form>
              <section className={s.section}>
                <h3 className={s.section_title}>{t('server_image')}</h3>

                <div className={s.os_list}>
                  {renderSoftwareOSFields({
                    fieldName: 'instances_os',
                    list: osList,
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
                    list={periodList}
                    value={values.period}
                    onClick={value => setFieldValue('period', value)}
                  />
                </div>

                <ul className={s.tariffs_list}>
                  {filteredTariffsList?.map(tariff => {
                    const calculatePrice = () => {
                      const dailyCost = tariff.prices.price.cost.$
                      const ipDailyDiscount = values.network_ipv6 ? 1 / 30 : 0
                      let price = (dailyCost - ipDailyDiscount) * values.period
                      if (price < 0.01) {
                        price = price.toFixed(3)
                      } else {
                        price = price.toFixed(2)
                      }
                      return price
                    }

                    const price = calculatePrice()

                    return (
                      <TariffCard
                        key={tariff.id.$}
                        tariff={tariff}
                        onClick={() => onTariffChange(tariff.id.$)}
                        price={price}
                        active={values.tariff_id === tariff.id.$}
                      />
                    )
                  })}
                </ul>
              </section>

              <section className={s.section}>
                <h3 className={s.section_title}>Choose Authentication Method</h3>
                {isItWindows ? (
                  <WarningMessage>{t('windows_password_warning')}</WarningMessage>
                ) : (
                  <ConnectMethod
                    connectionType={values.connectionType}
                    sshKey={values.ssh_keys}
                    onChangeType={type => setFieldValue('connectionType', type)}
                    setSSHkey={value => setFieldValue('ssh_keys', value)}
                    setPassword={value => setFieldValue('password', value)}
                    errors={errors}
                    touched={touched}
                    sshList={sshList?.map(el => ({
                      label: el.$,
                      value: el.$key,
                    }))}
                  />
                )}
              </section>

              <section className={s.section}>
                <h3 className={s.section_title}>{t('Server name')}</h3>
                <InputField name="serverName" placeholder={t('serverName')} isShadow />
              </section>

              <FixedFooter isShown={values.tariff_id}>
                {/* {widerThanMobile && (
                  <div className={s.buying_panel_item}>
                    <p>{t('amount')}:</p>
                  </div>
                )} */}
                <Incrementer />

                {/* {widerThanMobile ? (
                  <p className={s.buying_panel_item}>
                    {t('topay', { ns: 'dedicated_servers' })}:
                    <span className={s.tablet_price_sentence}>
                      <span className={s.tablet_price}>
                        {roundToDecimal(values.finalTotalPrice - checkSaleMemory())} EUR
                      </span>
                      {` ${translatePeriodName(period, t)}`}
                    </span>
                  </p>
                ) : (
                  <p className={s.price_wrapper}>
                    <span className={s.price}>
                      €{roundToDecimal(values.finalTotalPrice - checkSaleMemory())}
                    </span>
                    {` ${translatePeriodName(period, t)}`}
                  </p>
                )} */}

                <Button
                  className={s.btn_buy}
                  label={t('buy', { ns: 'other' })}
                  type="submit"
                  isShadow
                  // onClick={() => {
                  //   values.agreement === 'off' &&
                  //     agreementEl.current.scrollIntoView({
                  //       behavior: 'smooth',
                  //     })
                  // }}
                />
              </FixedFooter>
            </Form>
          )
        }}
      </Formik>

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
