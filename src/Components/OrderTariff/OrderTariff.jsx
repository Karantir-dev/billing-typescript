import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import s from './OrderTariff.module.scss'
import { useEffect, useReducer, useState } from 'react'
import { ErrorPayment, Icon, Steps } from '@components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors, cartOperations, payersSelectors } from '@redux'
import { FirstStep, SecondStep, ThirdStep, FourthStep } from './Steps'
import * as route from '@src/routes'
import { roundToDecimal } from '@utils'

export default function OrderTariff({ isConfigToggle, isShowTariffInfo, isClonePage }) {
  const { t } = useTranslation(['cart', 'auth', 'billing', 'other'])
  const { state } = useLocation()
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)
  const payersData = useSelector(payersSelectors.getPayersData)

  const [isAuth, _setIsAuth] = useState(sessionId)
  const [count, setCount] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [periods, setPeriods] = useState([])
  const [parameters, setParameters] = useState()
  const [toLogin, setToLogin] = useState(false)
  const [isFree, setIsFree] = useState(false)

  const [payMethodState, setPayMethodState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const service = searchParams.get('service')
  const id = searchParams.get('id')
  const referrer = searchParams.get('referrer')

  useEffect(() => {
    const params = {}

    for (const key of searchParams.keys()) {
      params[key] = searchParams.get(key)
    }

    const errorHandler = () =>
      isClonePage
        ? navigate(`${route.CLOUD_VPS_CREATE_INSTANCE}/premium`)
        : setIsError(true)

    dispatch(
      cartOperations.getTariffInfo(
        params,
        setParameters,
        setPeriods,
        errorHandler,
        isClonePage,
      ),
    )
  }, [])

  useEffect(() => {
    const price = +parameters?.list?.find(item => item.$name === 'pricelist_summary')
      .elem[0].cost.price.cost.$

    setTotalPrice(roundToDecimal(price * count))
  }, [parameters, count])

  const changeFieldHandler = (field, value, isUpdatePrice) => {
    if (!isUpdatePrice) {
      setParameters(params => ({ ...params, [field]: value }))
      return
    }
    const { register, ostempl, recipe, domain, server_name } = parameters

    const period = field === 'period' ? value.$ : parameters.order_period.$

    const params = {
      service,
      id,
      ostempl: ostempl?.$,
      recipe: recipe?.$,
      period,
      autoprolong: parameters.autoprolong.$,
      domain: domain?.$,
      server_name: server_name?.$,
    }

    for (const key in register) {
      params[register[key]] = key === field ? value : parameters[key]
    }
    dispatch(cartOperations.getTariffParameters(params, setParameters))
  }

  const [passedSteps, setPassedSteps] = useState({ 0: false })

  const passStep = title => {
    const thisStep = steps.filter(el => !el.hide).findIndex(el => el.title === title)
    setPassedSteps(prev => ({ ...prev, [thisStep]: true }))
  }

  const steps = [
    {
      title: t('tariff_configuration', { ns: 'cart' }),
      body: (
        <FirstStep
          parameters={parameters}
          setParameters={setParameters}
          service={service}
          periods={periods}
          changeFieldHandler={changeFieldHandler}
          count={count}
          setCount={setCount}
          passStep={() => passStep(t('tariff_configuration', { ns: 'cart' }))}
          totalPrice={totalPrice}
          isConfigToggle={isConfigToggle}
          isShowTariffInfo={isShowTariffInfo}
        />
      ),
      nextButton: {
        form: 'tariff-config',
      },
    },
    {
      hide: isAuth,
      openOnce: true,
      title: t('registration', { ns: 'cart' }),
      body: (
        <div className={s.mw}>
          <SecondStep
            toLogin={toLogin}
            setToLogin={setToLogin}
            passStep={() => passStep(t('registration', { ns: 'cart' }))}
          />
        </div>
      ),
      nextButton: {
        form: 'registration',
        label: toLogin ? t('logIn', { ns: 'auth' }) : t('registration', { ns: 'cart' }),
      },
    },
    {
      title: t('Payer', { ns: 'cart' }),
      body: (
        <div className={s.mw}>
          <ThirdStep passStep={() => passStep(t('Payer', { ns: 'cart' }))} />
        </div>
      ),
      isLoading: !payersData.selectedPayerFields,
      nextButton: {
        form: 'payer',
      },
    },
    {
      title: t('Payment method', { ns: 'billing' }),
      isUpdateOnOpen: true,
      isLoading: !payMethodState.cartData || !payMethodState.paymentsMethodList?.length,
      body: (
        <div className={s.mw}>
          <FourthStep
            state={payMethodState}
            setState={setPayMethodState}
            parameters={parameters}
            service={service}
            id={id}
            count={count}
            isFree={isFree}
            setIsFree={setIsFree}
          />
        </div>
      ),
      nextButton: {
        form: 'pay',
        label: isFree ? t('Activate', { ns: 'billing' }) : t('Pay', { ns: 'billing' }),
      },
    },
  ]

  if (isError) {
    return (
      <ErrorPayment
        title={t('url_error', { ns: 'billing' })}
        text={t('url_error_text', { ns: 'billing' })}
        isSupport={false}
      />
    )
  }

  const backLink = state?.backLink ? `/services/${state?.backLink}` : route.SERVICES

  return (
    <div>
      {isClonePage ? (
        <Link to={backLink} className={s.backLink}>
          <Icon name="ArrowSign" />
          {t('Back', { ns: 'other' })}
        </Link>
      ) : (
        <a
          href={
            referrer
              ? `${process.env.REACT_APP_SITE_URL}${referrer}`
              : process.env.REACT_APP_SITE_URL
          }
          className={s.backLink}
        >
          <Icon name="ArrowSign" />
          {t('Back', { ns: 'other' })}
        </a>
      )}

      {parameters && (
        <Steps
          steps={steps.filter(el => !el.hide)}
          passedSteps={passedSteps}
          setPassedSteps={setPassedSteps}
        />
      )}
    </div>
  )
}
