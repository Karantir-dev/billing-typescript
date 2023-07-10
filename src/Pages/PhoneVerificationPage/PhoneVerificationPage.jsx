import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { settingsOperations, userSelectors, usersOperations } from '@redux'
import { Form, Formik } from 'formik'

import TryLimit from './TryLimit/TryLimit'
import FirstStep from './FirstStep/FirstStep'
import SecondStep from './SecondStep/SecondStep'

import s from './PhoneVerificationPage.module.scss'
import * as routes from '@src/routes'
import * as Yup from 'yup'
import 'yup-phone'
import { Icon } from '@components'

export default function Component() {
  const { t } = useTranslation(['user_settings', 'other'])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let { state } = useLocation()

  const userInfo = useSelector(userSelectors.getUserInfo)

  const [validatePhoneData, setValidatePhoneData] = useState(null)
  const [countryCode, setCountryCode] = useState(null)

  const [isTryLimit, setIsTryLimit] = useState(false)
  const [isCodeStep, setIsCodeStep] = useState(false)

  const [timeOut, setTimeOut] = useState(0)

  // const phoneFormSettings = state?.phone ? state?.phone : null
  const isFirst = validatePhoneData?.types && !validatePhoneData?.action_types
  const notHaveNumber = !validatePhoneData?.types && !validatePhoneData?.action_types

  useEffect(() => {
    if (!isCodeStep) {
      dispatch(settingsOperations.fetchValidatePhone(setValidatePhoneData))
    }
  }, [isCodeStep])

  useEffect(() => {
    if (userInfo && userInfo?.$need_phone_validate !== 'true') {
      navigate(routes.SERVICES, {
        replace: true,
      })
    }
  }, [userInfo])

  useEffect(() => {
    if (validatePhoneData) {
      const findCountry = validatePhoneData?.phone_countries?.find(
        e => e?.$key === validatePhoneData?.phone_country,
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setCountryCode(code)
    }
  }, [validatePhoneData])

  useEffect(() => {
    let interval = null
    if (timeOut > 0) {
      interval = setInterval(() => setTimeOut(timeOut - 1), 1000)
    }

    return () => clearInterval(interval)
  }, [timeOut])

  const isTimeOut = timeOut > 0

  const validationSchema = Yup.object().shape({
    phone:
      !isCodeStep && countryCode
        ? Yup.string().phone(countryCode, false, t('Must be a valid phone number'))
        : null,
    code: isCodeStep
      ? Yup.string()
          .min(4, t('code_length'))
          .required(t('Is a required field', { ns: 'other' }))
      : null,
  })

  const navigateToServicePage = () => {
    navigate(routes.SERVICES, {
      replace: true,
    })
  }

  const goToFirstStepHanfler = () => {
    setIsCodeStep(false)
  }

  const validateHandler = values => {
    if (notHaveNumber) {
      return dispatch(
        settingsOperations.fetchValidatePhoneStart(
          { phone: values?.phone },
          null,
          setIsTryLimit,
          setValidatePhoneData,
          setTimeOut,
        ),
      )
    }

    if (isCodeStep) {
      const savePhoneUserEdit = () => {
        dispatch(
          usersOperations.editUserInfo(
            undefined,
            undefined,
            values?.phone,
            undefined,
            userInfo?.$id,
          ),
        )
      }

      return dispatch(
        settingsOperations.fetchValidatePhoneFinish(
          values,
          navigateToServicePage,
          savePhoneUserEdit,
        ),
      )
    }

    if (isFirst) {
      return dispatch(
        settingsOperations.fetchValidatePhoneStart(
          { ...values, sok: 'ok' },
          setIsCodeStep,
          setIsTryLimit,
          null,
          setTimeOut,
        ),
      )
    } else {
      return dispatch(
        settingsOperations.fetchValidatePhoneFirst(
          values,
          setValidatePhoneData,
          setIsCodeStep,
        ),
      )
    }
  }

  const backHandler = () => {
    const prevPage = state?.prevPath ? state?.prevPath : routes.SERVICES
    navigate(prevPage, {
      replace: true,
    })
  }

  const renderScreen = ({
    values,
    handleBlur,
    setFieldValue,
    touched,
    errors,
    handleSubmit,
  }) => {
    if (isTryLimit) {
      return <TryLimit />
    }

    if (!isCodeStep) {
      return (
        <FirstStep
          values={values}
          isFirst={isFirst}
          validatePhoneData={validatePhoneData}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          setCountryCode={setCountryCode}
          backHandler={backHandler}
          isTimeOut={isTimeOut}
          handleSubmit={handleSubmit}
        />
      )
    } else {
      return (
        <SecondStep
          values={values}
          errors={errors}
          touched={touched}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          setCountryCode={setCountryCode}
          backHandler={backHandler}
          goToFirstStepHanfler={goToFirstStepHanfler}
        />
      )
    }
  }

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validationSchema={validationSchema}
      initialValues={{
        phone: validatePhoneData?.phone || '',
        type: validatePhoneData?.type || '',
        action_type: validatePhoneData?.action_type || undefined,
        code: '',
      }}
      onSubmit={validateHandler}
    >
      {data => {
        return (
          <Form className={s.phone_verification_page}>
            {!isCodeStep && (
              <button type="button" onClick={backHandler} className={s.backBtn}>
                {t('Back', { ns: 'other' })}
              </button>
            )}

            <h1 className={s.title}>{t('Phone Verification')}</h1>

            {isTimeOut && (
              <div className={s.timeOutBlock}>
                <Icon name="Attention" />{' '}
                {t('verification_code_timeout', { time: timeOut })}
              </div>
            )}

            {validatePhoneData?.code_count && !isCodeStep && (
              <span className={s.attempts}>
                {t('attempts_to_sent_code', { count: validatePhoneData?.code_count })}
              </span>
            )}

            {renderScreen(data)}
          </Form>
        )
      }}
    </Formik>
  )
}
