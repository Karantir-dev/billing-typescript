import { ErrorBoundary } from 'react-error-boundary'
import {
  BreadCrumbs,
  Loader,
  CheckBox,
  RadioTypeButton,
  TariffCard,
  ConnectMethod,
  InputField,
  Button,
  Incrementer,
  FixedFooter,
  ScrollToFieldError,
  WarningMessage,
  TooltipWrapper,
  Icon,
  Error,
  OsList,
  CountryButton,
  CloudTypeSection,
  PageTabBar,
  SoftwareOSBtn,
  SoldOutModal,
} from '@components'
import * as Yup from 'yup'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
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
  checkIfHasWindows,
  formatCountryName,
  getFlagFromCountryName,
  getImageIconName,
  roundToDecimal,
  useCancelRequest,
} from '@utils'
import cn from 'classnames'
import { ErrorMessage, Form, Formik } from 'formik'
import {
  PASS_REGEX,
  PASS_REGEX_ASCII,
  DISALLOW_SPACE,
  BASIC_TYPE,
  PREMIUM_TYPE,
  DISALLOW_PASS_SPECIFIC_CHARS,
  DC_WITH_BASICS,
  IMAGES_TYPES,
  CLOUD_DC_NAMESPACE,
} from '@utils/constants'
import { useMediaQuery } from 'react-responsive'
import { Modals } from '@components/Services/Instances/Modals/Modals'
import * as route from '@src/routes'

import s from './CreateInstancePage.module.scss'

const IPv4_DAILY_COST = 1 / 30
const IPv4_MONTHLY_COST = 1

export default function CreateInstancePage() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps', 'vds', 'auth', 'other', 'countries'])
  const [searchParams, setSearchParams] = useSearchParams()

  const [cloudType, setCloudType] = useState(searchParams.get('type') || PREMIUM_TYPE)
  const isBasic = cloudType === BASIC_TYPE

  useEffect(() => {
    setCloudType(prev => {
      if (searchParams.get('type') !== prev) {
        return searchParams.get('type')
      } else {
        return prev
      }
    })
  }, [searchParams])

  const location = useLocation()

  const switchCloudType = type => {
    setSearchParams({ type }, { state: location.state })
    setCloudType(type)
  }

  const launchData = {
    dcLabel: location.state?.dcLabel,
    imageId: location.state?.imageId,
    min_ram: location.state?.min_ram,
    min_disk: location.state?.min_disk,
  }

  const dcLabelFromLaunch = launchData?.dcLabel
  const dcIdFromLaunch = CLOUD_DC_NAMESPACE[dcLabelFromLaunch]

  const dataFromSite = JSON.parse(localStorage.getItem('site_cart') || '{}')

  const imageIdFromLaunch = launchData?.imageId
  const isLaunchMode = imageIdFromLaunch && dcLabelFromLaunch
  const [imagesCurrentTab, setImagesCurrentTab] = useState(
    imageIdFromLaunch ? IMAGES_TYPES.own : IMAGES_TYPES.public,
  )

  const PERIODS_LIST = [
    { id: 'month', value: 30, label: t('month', { ns: 'other' }) },
    { id: 'day', value: 1, label: t('day', { ns: 'cloud_vps' }) },
    { id: 'hour', value: 0.0416, label: t('hour', { ns: 'cloud_vps' }) },
  ]

  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const warningEl = useRef()

  const [currentDC, setCurrentDC] = useState()

  const premiumTariffs = useSelector(cloudVpsSelectors.getPremiumTariffs)
  const basicTariffs = useSelector(cloudVpsSelectors.getBasicTariffs)
  const certainTypeTariffs = isBasic ? basicTariffs : premiumTariffs

  const filterSuitableTariffsForLaunch = () => {
    const filteredList = certainTypeTariffs?.[currentDC?.$key]?.filter(el => {
      const ram = parseInt(
        el.detail.find(param => param.name.$.toLowerCase().includes('memory'))?.value?.$,
      )

      const disk = parseInt(
        el.detail.find(param => param.name.$.toLowerCase().includes('disk space'))?.value
          ?.$,
      )

      return +launchData.min_ram <= ram && +launchData.min_disk <= disk
    })

    const filteredTariffs = { ...certainTypeTariffs }
    filteredTariffs[currentDC?.$key] = filteredList
    return filteredTariffs
  }

  /** If it is Launch mode - filter tariffs by min ram and min disk */
  const tariffs = isLaunchMode
    ? filterSuitableTariffsForLaunch(certainTypeTariffs?.[currentDC?.$key])
    : certainTypeTariffs

  // if (isLaunchMode) {
  //   tariffsToRender = useMemo(
  //     filterSuitableTariffsForLaunch(tariffs?.[currentDC?.$key]),
  //     [tariffs?.[currentDC?.$key]],
  //   )
  // } else {
  //   tariffs
  // }

  const operationSystems = useSelector(cloudVpsSelectors.getOperationSystems)

  const dcList = useSelector(cloudVpsSelectors.getDClist)
  const filteredDcList = isBasic
    ? dcList?.filter(el => DC_WITH_BASICS.includes(el.$key))
    : dcList
  const windowsTag = useSelector(cloudVpsSelectors.getWindowsTag)
  const soldOutTag = useSelector(cloudVpsSelectors.getSoldOutTag)

  const allSshCount = useSelector(cloudVpsSelectors.getSshCount)
  const allSshList = useSelector(cloudVpsSelectors.getAllSshList)

  const { credit, realbalance } = useSelector(userSelectors.getUserInfo)

  const [showCaption, setShowCaption] = useState(false)

  const [isSoldOutModalOpened, setSoldOutModalOpened] = useState(false)

  const publicImages = operationSystems?.[currentDC?.$key]?.[IMAGES_TYPES.public]
  const ownImages = operationSystems?.[currentDC?.$key]?.[IMAGES_TYPES.own]

  const [isConnectMethodOpened, setIsConnectMethodOpened] = useState(
    imagesCurrentTab === IMAGES_TYPES.own ? false : true,
  )

  useEffect(() => {
    if (!currentDC?.$key && dcList) {
      const dcLocation = dataFromSite.location

      const dcFromSite = dcList.find(el => el.$key === dcLocation)
      const dcFromLaunch = dcList.find(el => +el.$key === +dcIdFromLaunch)

      if (dcFromLaunch) {
        setCurrentDC(dcFromLaunch)
      } else if (dcFromSite) {
        setCurrentDC(dcFromSite)
      } else {
        setCurrentDC(dcList?.[0])
      }
    }
  }, [dcList])

  const getAllSSHList = list => {
    const p_cnt = list.length
    dispatch(
      cloudVpsOperations.getSshKeys({
        p_cnt,
        setAllSshItems: list => dispatch(cloudVpsActions.setAllSshList(list)),
      }),
    )
  }

  const getOsListHandler = (cloudType, needSshList = false) => {
    // це скоріше всього можна буде прибрати
    const isBasic = cloudType === BASIC_TYPE

    const haveOS = operationSystems?.[currentDC?.$key]

    if (!haveOS) {
      const lastTariffID = getLastTariffID(isBasic)

      return dispatch(
        cloudVpsOperations.getOsList({
          signal,
          setIsLoading,
          closeLoader: () => setIsLoading(false),
          datacenter: currentDC?.$key,
          setSshList: needSshList ? getAllSSHList : null,
          lastTariffID,
        }),
      )
    }
  }

  const getLastTariffID = isBasic => {
    const tariffs = isBasic ? basicTariffs : premiumTariffs
    const list = tariffs?.[currentDC?.$key]
    const lastTariffID = list?.[list?.length - 1]?.id?.$
    return lastTariffID
  }

  /** First render useEffect */
  useEffect(() => {
    const dcId = dataFromSite.location || dcIdFromLaunch || undefined
    if (
      /** if we don`t have tariffs list for current DC */
      !tariffs?.[dcId]?.length
    ) {
      dispatch(
        cloudVpsOperations.getAllTariffsInfo({
          signal,
          setIsLoading,
          needOsList: !operationSystems?.[dcId],
          setSshList: getAllSSHList,
          datacenter: dcId,
          isBasic,
        }),
      )

      /** if we have tariffs but don`t have OSs for them or ssh keys */
    } else if (tariffs?.[dcId] && (!operationSystems?.[dcId] || !allSshList.length)) {
      getOsListHandler(cloudType, true)
    }

    /** Cleans data from site when we leave the page */
    return () => {
      localStorage.removeItem('site_cart')
    }
  }, [])

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
    return operationSystems?.[currentDC?.$key][imagesCurrentTab]
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
        .matches(
          DISALLOW_PASS_SPECIFIC_CHARS,
          t('warnings.disallow_hash', { ns: 'auth' }),
        )
        .required(t('warnings.password_required', { ns: 'auth' })),
    }),
    connectionType:
      imagesCurrentTab === IMAGES_TYPES.public
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
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
        p_cnt: allSshCount + 1,
        setAllSshItems: list => dispatch(cloudVpsActions.setAllSshList(list)),
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ ssh_rename: false })),
      }),
    )
  }

  const tariffFromSite = tariffs?.[currentDC?.$key]?.find(el =>
    el.title.$.toLowerCase().includes(dataFromSite?.name?.toLowerCase()),
  )

  const toggleCaptionHandler = value => {
    setShowCaption(prev => (value === prev ? false : value))
  }

  return (
    <div className={s.page_padding}>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <SoldOutModal
        className={s.sold_out_modal}
        isOpened={isSoldOutModalOpened}
        closeFn={() => setSoldOutModalOpened(false)}
      />

      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>
      <ErrorBoundary
        FallbackComponent={Error}
        onError={err => console.log('ErrorBoundary', err)}
      >
        {tariffs?.[currentDC?.$key] && operationSystems?.[currentDC?.$key] && (
          <Formik
            initialValues={{
              instances_os:
                imageIdFromLaunch ||
                operationSystems?.[currentDC.$key]?.[imagesCurrentTab]?.[0]?.$key,
              tariff_id: tariffFromSite?.id.$ || tariffs?.[currentDC?.$key]?.[0]?.id.$,
              tariffData: tariffFromSite || tariffs?.[currentDC?.$key]?.[0],
              period: 30,
              network_ipv6: !!dataFromSite?.network_ipv6 || false,
              connectionType: '',
              ssh_keys: '',
              password: '',
              servername: '',
              order_count: '1',
              notEnoughMoney: false,
            }}
            validationSchema={validationSchema}
            onSubmit={onFormSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => {
              useEffect(() => {
                setFieldValue('ssh_keys', allSshList?.[0]?.elid.$)
              }, [allSshList])

              const selectFirstImage = tab => {
                setFieldValue(
                  'instances_os',
                  operationSystems?.[currentDC.$key]?.[tab]?.[0]?.$key,
                )
              }

              /** Sets first OS from the list when DC changes */
              useEffect(() => {
                if (currentDC.$key) {
                  selectFirstImage(imagesCurrentTab)
                }
              }, [currentDC.$key])

              const onTariffChange = tariff => {
                if (tariff) {
                  setFieldValue('tariff_id', tariff.id.$)
                  setFieldValue('tariffData', tariff)
                }
              }

              const isItWindows = checkIsItWindows(values.instances_os)

              /** if we have selected OS Windows - we disable tariffs that don`t support this OS */
              const disableWindowsOnlyTariffs = isItWindows => {
                return isItWindows
                  ? tariffs[currentDC.$key].map(tariff => {
                      const newTariff = { ...tariff }
                      let supportsWindows
                      if (Array.isArray(tariff.flabel.tag)) {
                        supportsWindows = tariff.flabel.tag.some(
                          el => el.$ === windowsTag,
                        )
                      } else {
                        supportsWindows = tariff.flabel.tag.$ === windowsTag
                      }

                      newTariff.disabled = !supportsWindows
                      return newTariff
                    })
                  : tariffs[currentDC.$key]
              }

              const tariffsListToRender = disableWindowsOnlyTariffs(isItWindows)

              const onDCchange = async dc => {
                if (!tariffs[dc.$key]) {
                  await dispatch(
                    cloudVpsOperations.getAllTariffsInfo({
                      signal,
                      setIsLoading,
                      datacenter: dc.$key,
                      needOsList: !operationSystems[dc.$key],
                      needDcList: false,
                      isBasic,
                    }),
                  )
                }

                setCurrentDC(dc)
              }

              useEffect(() => {
                if (!tariffFromSite) {
                  onTariffChange(tariffsListToRender[0])
                } else {
                  localStorage.removeItem('site_cart')
                }
              }, [currentDC?.$key, cloudType])

              const onOSchange = value => {
                setFieldValue('instances_os', value)

                if (checkIsItWindows(value)) {
                  const tariffsBasedOnOs = disableWindowsOnlyTariffs(true)
                  const firstAvailableTariff = tariffsBasedOnOs.find(el => !el.disabled)

                  let tariffHasWindows = checkIfHasWindows(values.tariffData, windowsTag)

                  values.connectionType === 'ssh' && setFieldValue('connectionType', '')
                  setFieldValue('ssh_keys', '')
                  if (!tariffHasWindows) {
                    onTariffChange(firstAvailableTariff)
                  }
                }
              }

              const calculatePrice = (tariff, values, period = null, count = 1) => {
                const dailyCost = tariff?.prices.price.cost.$
                const monthlyCost = tariff?.prices.price.cost.month

                period = period ? period : values.period

                let price = dailyCost

                if (period === 30) {
                  price = monthlyCost
                }

                if (values.network_ipv6) {
                  if (period === 30) {
                    price -= IPv4_MONTHLY_COST
                  } else {
                    price -= IPv4_DAILY_COST
                  }
                }

                if (period === 30) {
                  price = price * count
                } else {
                  price = price * period * count
                }

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

              const imagesTabs = [
                {
                  localValue: IMAGES_TYPES.public,
                  onLocalClick: () => {
                    setImagesCurrentTab(IMAGES_TYPES.public)
                    setIsConnectMethodOpened(true)
                    selectFirstImage(IMAGES_TYPES.public)
                  },
                  label: t('Public'),
                  allowToRender: true,
                },
                {
                  localValue: IMAGES_TYPES.own,
                  onLocalClick: () => {
                    setImagesCurrentTab(IMAGES_TYPES.own)
                    setFieldValue('connectionType', '')
                    setIsConnectMethodOpened(false)
                    selectFirstImage(IMAGES_TYPES.own)
                  },
                  label: t('Your images'),
                  allowToRender: true,
                },
              ]

              const launchImage = isLaunchMode
                ? ownImages.find(el => el.$key === imageIdFromLaunch)
                : null

              const imagesToRender =
                imagesCurrentTab === IMAGES_TYPES.public ? publicImages : ownImages

              const isSoldOut = values.tariffData?.flabel.tag.some(
                el => el.$ === soldOutTag,
              )

              return (
                <Form>
                  <ScrollToFieldError />
                  {tariffsListToRender?.length > 0 ? (
                    <>
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

                      <CloudTypeSection
                        isLaunchMode={isLaunchMode}
                        premiumTariffs={premiumTariffs?.[currentDC.$key]}
                        basicTariffs={basicTariffs?.[currentDC.$key]}
                        value={cloudType}
                        switchCloudType={switchCloudType}
                      />

                      <section className={s.section}>
                        <h3 className={s.section_title}>{t('server_location')}</h3>

                        <ul className={s.grid}>
                          {isLaunchMode ? (
                            <CountryButton
                              currentItem={currentDC}
                              item={currentDC}
                              onChange={onDCchange}
                              disabled
                            />
                          ) : (
                            filteredDcList?.map(dc => {
                              return (
                                <CountryButton
                                  key={dc.$key}
                                  currentItem={currentDC}
                                  item={dc}
                                  onChange={onDCchange}
                                />
                              )
                            })
                          )}
                        </ul>
                        {isLaunchMode && (
                          <div className={s.dc_link}>
                            <Link className={s.link} to={route.CLOUD_VPS_IMAGES}>
                              {t('move_the_image', { ns: 'cloud_vps' })}
                            </Link>
                            <TooltipWrapper
                              content={t('Hint', { ns: 'other' })}
                              wrapperClassName={cn(s.tooltip)}
                            >
                              <Icon name="Info" />
                            </TooltipWrapper>
                          </div>
                        )}
                      </section>

                      <section className={s.section}>
                        <h3 className={s.section_title}>{t('server_image')}</h3>

                        {isLaunchMode ? (
                          ''
                        ) : (
                          <PageTabBar
                            sections={imagesTabs}
                            activeValue={imagesCurrentTab}
                          />
                        )}

                        <div className={s.os_list}>
                          {isLaunchMode ? (
                            <SoftwareOSBtn
                              value={imageIdFromLaunch}
                              state={imageIdFromLaunch}
                              iconName={getImageIconName(launchImage?.$)}
                              label={launchImage?.$}
                              imageData={launchImage}
                              disabled
                            />
                          ) : (
                            <OsList
                              list={imagesToRender}
                              value={values.instances_os}
                              onOSchange={onOSchange}
                            />
                          )}
                        </div>

                        {isItWindows && (
                          <WarningMessage className={s.notice_wrapper}>
                            {t('windows_os_notice')}
                          </WarningMessage>
                        )}
                      </section>

                      <section className={s.section}>
                        <h3 className={s.section_title}>{t('server_size')}</h3>

                        <div className={s.period_bar}>
                          <div className={s.ip_wrapper}>
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
                            <TooltipWrapper
                              content={t('hint_description.ip')}
                              className={s.hintPopup}
                              disabled={!widerThan1550}
                            >
                              <button
                                type="button"
                                onClick={() => toggleCaptionHandler('ip')}
                              >
                                <Icon name="Info" />
                              </button>
                            </TooltipWrapper>
                          </div>

                          <RadioTypeButton
                            withCaption
                            label={t('price_per')}
                            list={PERIODS_LIST}
                            value={values.period}
                            onClick={value => setFieldValue('period', value)}
                            captionText={t('hint_description.period')}
                            popupClassName={s.hintPopup}
                            toggleCaption={() => toggleCaptionHandler('period')}
                          />
                        </div>
                        {!widerThan1550 && showCaption && (
                          <div
                            className={cn(s.period_description, {
                              [s.truncated]: !showCaption,
                            })}
                          >
                            <span className="asterisk">*</span>
                            {t(`hint_description.${showCaption}`)}
                          </div>
                        )}

                        <ul className={s.grid}>
                          {tariffsListToRender?.map(tariff => {
                            const price = calculatePrice(tariff, values)
                            const isSoldOut = tariff.flabel.tag.some(
                              el => el.$ === soldOutTag,
                            )
                            return (
                              <TariffCard
                                key={tariff.id.$}
                                tariff={tariff}
                                onClick={() => {
                                  isSoldOut && setSoldOutModalOpened(true)
                                  onTariffChange(tariff)
                                }}
                                price={price}
                                active={values.tariff_id === tariff.id.$}
                                disabled={tariff.disabled}
                                isSoldOut={isSoldOut}
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
                          sshList={allSshList.map(el => ({
                            label: el.comment.$,
                            value: el.elid.$,
                          }))}
                          isWindows={isItWindows}
                          hiddenMode={imagesCurrentTab === IMAGES_TYPES.own}
                          isOpened={isConnectMethodOpened}
                          setIsOpened={setIsConnectMethodOpened}
                        />
                        <ErrorMessage
                          className={s.error_message}
                          name="connectionType"
                          component="span"
                        />
                      </section>

                      <section className={s.section}>
                        <h3 className={s.section_title}>
                          {t('server_name', { ns: 'vds' })}
                        </h3>
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
                                src={require(
                                  `@images/countryFlags/${getFlagFromCountryName(
                                    currentCountryName,
                                  )}.png`,
                                )}
                                width={20}
                                height={14}
                                alt={currentCountryName}
                              />
                              {t(currentCountryName, { ns: 'countries' })}
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
                            <p className={s.label}>
                              {t('amount_servers', { ns: 'vds' })}
                            </p>
                            <Incrementer
                              count={values.order_count}
                              setCount={value => setFieldValue('order_count', value)}
                              max={35}
                            />
                          </div>

                          <div className={s.footer_item}>
                            <p className={s.label}>{t('Sum', { ns: 'other' })}</p>
                            <p className={s.footer_price}>
                              €{finalPrice}/
                              <span className={s.price_period}>{t('day')}</span>
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
                            <div className={s.exlude_vat}>
                              <span className="asterisk">*</span>
                              {t('excluding_vat')}
                              <TooltipWrapper
                                wrapperClassName={s.exlude_vat_hint}
                                className={s.exlude_vat_hint_popup}
                                content={t('exlude_vat_hint')}
                              >
                                <Icon name="Info" />
                              </TooltipWrapper>
                            </div>
                          </div>

                          <Button
                            className={cn(s.btn_buy, s.footer_item)}
                            label={
                              isSoldOut
                                ? t('to_order', { ns: 'other' })
                                : t('create_instance', { ns: 'cloud_vps' })
                            }
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
                    </>
                  ) : (
                    <section className={s.section}>
                      <h3 className={s.section_title}>{t('server_image')}</h3>
                      <div className={s.os_list}>
                        <SoftwareOSBtn
                          value={imageIdFromLaunch}
                          state={imageIdFromLaunch}
                          iconName={getImageIconName(launchImage?.$)}
                          label={launchImage?.$}
                          imageData={launchImage}
                          disabled
                        />
                      </div>
                      <WarningMessage>
                        {t('no_tariffs_for_launch', { ns: 'cloud_vps' })}
                      </WarningMessage>
                    </section>
                  )}
                </Form>
              )
            }}
          </Formik>
        )}
        <Modals addNewSshSubmit={setNewSshKey} />
        {isLoading && <Loader local shown={isLoading} />}
      </ErrorBoundary>
    </div>
  )
}
