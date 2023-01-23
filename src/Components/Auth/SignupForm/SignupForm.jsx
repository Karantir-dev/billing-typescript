import React, { useRef, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { RECAPTCHA_KEY } from '../../../config/config'
import ReCAPTCHA from 'react-google-recaptcha'

// import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ErrorMessage, Form, Formik } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import { authOperations } from '../../../Redux'
import { SelectOfCountries, InputField, Button, LoginBtnBlock } from '../..'
import * as routes from '../../../routes'
import { Facebook, Google, Vk } from './../../../images'

import s from './SignupForm.module.scss'
import classNames from 'classnames'

const FACEBOOK_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=facebook&project=4&currency=153&rparams='
const VK_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=vkontakte&project=4&currency=153&rparams='
const GOOGLE_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=google&project=4&currency=153&rparams='

const COUNTRIES_WITH_REGIONS = [233, 108, 14]

export default function SignupForm({ geoCountryId, geoStateId }) {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const recaptchaEl = useRef()

  const [seconds, setSeconds] = useState(20)

  // const { executeRecaptcha } = useGoogleReCaptcha()

  const [errMsg, setErrMsg] = useState(location?.state?.errMsg || '')
  // const [socialLinks, setSocialLinks] = useState({})

  const successRegistration = () => {
    navigate(routes.LOGIN, { state: { from: location.pathname } })
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@#$_%^\\&*()\]~+/}[{=?|"<>:;]+$/g, t('warnings.special_characters'))
      .required(t('warnings.name_required')),
    email: Yup.string()
      .matches(/^[^!#$%^&*()\]~/}[{=?|"<>':;+]+$/g, t('warnings.special_characters'))
      .email(t('warnings.invalid_email'))
      .required(t('warnings.email_required')),
    password: Yup.string()
      .min(12, t('warnings.invalid_pass'))
      .max(48, t('warnings.invalid_pass'))
      .matches(/(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\d)/, t('warnings.invalid_pass'))
      .required(t('warnings.password_required')),
    passConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('warnings.mismatched_password'))
      .required(t('warnings.mismatched_password')),
    reCaptcha: Yup.string()
      .typeError(t('warnings.recaptcha'))
      .required(t('warnings.recaptcha')),
    country: Yup.number()
      .min(1, t('warnings.country_required'))
      .required(t('warnings.country_required')),
    region: Yup.number().when('country', {
      is: val => COUNTRIES_WITH_REGIONS.includes(val),
      then: Yup.number()
        .min(1, t('warnings.region_required'))
        .required(t('warnings.region_required')),
      otherwise: Yup.number(),
    }),
  })
  const partner = Cookies.get('billpartner')
  const sesid = Cookies.get('sesid')

  const handleSubmit = async (values, { setFieldValue }) => {
    const resetRecaptcha = () => {
      recaptchaEl && recaptchaEl?.current?.reset()
      setFieldValue('reCaptcha', '')
    }

    // if (executeRecaptcha) {
    //   const newToken = await executeRecaptcha('signup')
    //   values.reCaptcha = newToken
    // }

    dispatch(
      authOperations.register(
        values,
        partner,
        sesid,
        setErrMsg,
        successRegistration,
        resetRecaptcha,
      ),
    )
  }

  const timer = s => {
    if (s - 1 <= 0) {
      window.location.href = 'https://cp.omro.host/'
    } else {
      setSeconds(s => s - 1)
    }
  }

  useEffect(() => {
    if (geoCountryId === '182') {
      setInterval(() => timer(seconds), 1000)
    }
  }, [geoCountryId])

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = 'https://cp.omro.host/signup'
    }
  }, [seconds])

  if (geoCountryId === '182') {
    return (
      <div className={s.form_wrapper}>
        <LoginBtnBlock />
        <div className={classNames(s.form, s.rusForm)}>
          <span className={s.rusText}>
            {t('rus_hello_1')} <a href="https://cp.omro.host/signup">{'cp.omro.host'}</a>.{' '}
            {t('rus_hello_2')}
          </span>

          <div className={s.redirectBlock}>
            <span>
              {t('20_sec_omro', {
                sec: seconds <= 0 ? '0' : seconds,
              })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={s.form_wrapper}>
      <LoginBtnBlock />

      <Formik
        initialValues={{
          name: location?.state?.name || '',
          email: location?.state?.email || '',
          password: '',
          passConfirmation: '',
          reCaptcha: '',
          country: 0,
          region: 0,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, setFieldTouched, errors, touched }) => {
          return (
            <Form className={s.form}>
              {errMsg && (
                <div className={s.credentials_error}>{t(`warnings.${errMsg}`)}</div>
              )}

              <InputField
                dataTestid="input_name"
                label={t('name_label')}
                placeholder={t('name_placeholder')}
                iconLeft="person"
                name="name"
                error={!!errors.name}
                touched={!!touched.name}
                className={s.input_field_wrapper}
                inputAuth
              />

              <InputField
                dataTestid="input_email"
                label={t('email_label')}
                placeholder={t('email_placeholder')}
                iconLeft="envelope"
                name="email"
                error={!!errors.email}
                touched={!!touched.email}
                className={s.input_field_wrapper}
                autoComplete="off"
                inputAuth
              />

              <InputField
                dataTestid="input_password"
                label={t('password_label')}
                placeholder={t('password_placeholder')}
                iconLeft="padlock"
                name="password"
                error={!!errors.password}
                touched={!!touched.password}
                type="password"
                className={s.input_field_wrapper}
                inputAuth
                autoComplete="new-password"
              />

              <InputField
                dataTestid="input_passConfirmation"
                label={t('passConfirmation_label')}
                placeholder={t('passConfirmation_placeholder')}
                iconLeft="padlock"
                name="passConfirmation"
                error={!!errors.passConfirmation}
                touched={!!touched.passConfirmation}
                type="password"
                className={s.input_field_wrapper}
                inputAuth
              />

              <SelectOfCountries
                setErrMsg={setErrMsg}
                // setSocialLinks={setSocialLinks}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                geoCountryId={geoCountryId}
                geoStateId={geoStateId}
                autoDetectCounty={true}
                errors={errors}
                touched={touched}
                disabled
              />

              {/* <GoogleReCaptcha
                onChange={value => {
                  setFieldValue('reCaptcha', value)
                }}
              /> */}

              <ReCAPTCHA
                className={s.captcha}
                ref={recaptchaEl}
                sitekey={RECAPTCHA_KEY}
                onChange={value => {
                  setFieldValue('reCaptcha', value)
                }}
              />

              <ErrorMessage
                className={s.error_message}
                name="reCaptcha"
                component="span"
              />

              <Button
                dataTestid="btn_form_submit"
                className={s.submit_btn}
                label={t('register')}
                type="submit"
                isShadow
              />
            </Form>
          )
        }}
      </Formik>

      <div>
        <p className={s.social_title}>{t('register_with')}</p>
        <ul className={s.social_list}>
          <li>
            <a href={FACEBOOK_LINK}>
              <Facebook />
            </a>
          </li>
          <li>
            <a href={GOOGLE_LINK}>
              <Google />
            </a>
          </li>
          <li>
            <a href={VK_LINK}>
              <Vk />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
