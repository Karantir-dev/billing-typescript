import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { settingsOperations, userSelectors } from '../../Redux'
import { Form, Formik } from 'formik'

import TryLimit from './TryLimit/TryLimit'
import FirstStep from './FirstStep/FirstStep'
import SecondStep from './SecondStep/SecondStep'

import s from './PhoneVerificationPage.module.scss'
import * as routes from '../../routes'
import * as Yup from 'yup'
import 'yup-phone'

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

  const phoneFormSettings = state?.phone ? state?.phone : null

  useEffect(() => {
    if (!isCodeStep) {
      dispatch(settingsOperations.fetchValidatePhone(setValidatePhoneData))
    }
  }, [isCodeStep])

  useEffect(() => {
    if (userInfo && userInfo?.$need_phone_validate !== 'true') {
      navigate(routes.SERVICES)
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

  const isFirst = validatePhoneData?.types && !validatePhoneData?.action_types

  const validationSchema = Yup.object().shape({
    phone: isFirst
      ? Yup.string().phone(countryCode, false, t('Must be a valid phone number'))
      : null,
    code: isCodeStep
      ? Yup.string()
          .min(4, t('code_length'))
          .required(t('Is a required field', { ns: 'other' }))
      : null,
  })

  const navigateToServicePage = () => {
    navigate(routes.SERVICES)
  }

  const goToFirstStepHanfler = () => {
    setIsCodeStep(false)
  }

  const validateHandler = values => {
    if (isCodeStep) {
      return dispatch(
        settingsOperations.fetchValidatePhoneFinish(values, navigateToServicePage),
      )
    }

    if (isFirst) {
      return dispatch(
        settingsOperations.fetchValidatePhoneStart(values, setIsCodeStep, setIsTryLimit),
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
    navigate(prevPage)
  }

  const renderScreen = ({ values, handleBlur, setFieldValue, touched, errors }) => {
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
        phone: phoneFormSettings || userInfo?.$phone || '',
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
