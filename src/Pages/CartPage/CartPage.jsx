import Div100vh from 'react-div-100vh'
import { useSearchParams } from 'react-router-dom'
import { AuthPageHeader } from '@pages'
import s from './CartPage.module.scss'
import cn from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { ErrorPayment, Icon, Steps } from '@components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors, cartOperations, payersSelectors } from '@redux'
import { FirstStep, SecondStep, ThirdStep, FourthStep } from './Steps'
import { SITE_URL } from '@config/config'

export default function CartPage() {
  const { t } = useTranslation(['cart', 'auth', 'billing', 'other'])

  const [isError, setIsError] = useState(false)
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)
  const payersData = useSelector(payersSelectors.getPayersData)
  const payersList = useSelector(payersSelectors.getPayersList)

  const [isAuth, _setIsAuth] = useState(sessionId)
  const [count, setCount] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [periods, setPeriods] = useState([])
  const [parameters, setParameters] = useState()
  const [toLogin, setToLogin] = useState(false)

  const [payMethodState, setPayMethodState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const service = searchParams.get('service')
  const id = searchParams.get('id')

  useEffect(() => {
    const params = {}

    for (const key of searchParams.keys()) {
      params[key] = searchParams.get(key)
    }

    dispatch(cartOperations.getTariffInfo(params, setParameters, setPeriods, setIsError))
  }, [])

  useEffect(() => {
    const price = +parameters?.orderinfo?.$?.match(/Total amount: (.+?)(?= EUR)/)[1]

    setTotalPrice(price * count)
  }, [parameters, count])

  const changeFieldHandler = (field, value, isUpdatePrice) => {
    if (!isUpdatePrice) {
      setParameters(params => ({ ...params, [field]: value }))
      return
    }
    const { register, ostempl, recipe } = parameters

    const period = field === 'period' ? value.$ : parameters.period.$
    const params = {
      service,
      period,
      id,
      ostempl: ostempl?.$,
      recipe: recipe?.$,
      autoprolong: parameters.autoprolong.$,
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
        form: payersList?.length ? null : 'payer',
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
          />
        </div>
      ),
      nextButton: {
        form: 'pay',
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

  return (
    <Div100vh className={cn(s.wrapper)}>
      <AuthPageHeader sessionId={sessionId} />

      <div className="container">
        <a href={document.referrer || SITE_URL} className={s.backLink}>
          <Icon name="ArrowSign" />
          {t('Back', { ns: 'other' })}
        </a>

        {parameters && (
          <Steps
            steps={steps.filter(el => !el.hide)}
            passedSteps={passedSteps}
            setPassedSteps={setPassedSteps}
          />
        )}
      </div>
    </Div100vh>
  )
}
