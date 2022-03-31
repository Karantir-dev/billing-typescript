import React, { useEffect, useRef } from 'react'
import * as Yup from 'yup'
import { RECAPTCHA_KEY } from '../../config/config'
import Cookies from 'js-cookie'
import ReCAPTCHA from 'react-google-recaptcha'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ErrorMessage, Form, Formik } from 'formik'
import { Link } from 'react-router-dom'

import { authOperations } from '../../Redux/auth/authOperations'
import InputField from '../InputField/InputField'
import SelectOfCountries from '../SelectOfCountries/SelectOfCountries'
import * as routes from '../../routes'
import { Facebook, Google, Vk } from './../../images'

import s from './SignupForm.module.scss'

export default function SignupForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const recaptchaEl = useRef()

  useEffect(() => {
    const referalID = Cookies.get('billpartner')
    console.log(referalID)
    // Cookies.set('billpartner', referalID)
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g, t('warnings.special_characters'))
      .required(t('warnings.name_required')),
    email: Yup.string()
      .email(t('warnings.invalid_email'))
      .required(t('warnings.email_required')),
    password: Yup.string()
      .min(6, t('warnings.invalid_pass'))
      .max(48, t('warnings.invalid_pass'))
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, t('warnings.invalid_pass'))
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
      is: val => [233, 108, 14].includes(val),
      then: Yup.number()
        .min(1, t('warnings.region_required'))
        .required(t('warnings.region_required')),
      otherwise: Yup.number(),
    }),
  })

  const handleSubmit = values => {
    dispatch(authOperations.register(values))
  }

  return (
    <div className={s.form_wrapper}>
      <div className={s.auth_links_wrapper}>
        <Link className={s.auth_link} to={routes.LOGIN}>
          {t('logIn')}
        </Link>
        <span className={s.current_auth_link}>{t('registration')}</span>
      </div>

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          passConfirmation: '',
          reCaptcha: '',
          country: 0,
          region: 0,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, validateField, setFieldTouched, errors, values, touched }) => {
          return (
            <Form className={s.form}>
              {/* {errMsg && (
                <div className={s.credentials_error}>{t(`warnings.${errMsg}`)}</div>
              )} */}

              <InputField
                label="name"
                icon="person"
                error={!!errors.name}
                touched={!!touched.name}
              />

              <InputField
                label="email"
                icon="envelope"
                error={!!errors.email}
                touched={!!touched.email}
                autoComplete
              />

              <InputField
                label="password"
                icon="padlock"
                error={!!errors.password}
                touched={!!touched.password}
                inputValue={!!values.password}
              />

              <InputField
                label="passConfirmation"
                icon="padlock"
                error={!!errors.passConfirmation}
                touched={!!touched.passConfirmation}
                inputValue={!!values.passConfirmation}
              />

              <SelectOfCountries
                setFieldValue={setFieldValue}
                validateField={validateField}
                setFieldTouched={setFieldTouched}
                errors={errors}
                touched={touched}
              />

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

              <button className={s.submit_btn} type="submit">
                <span className={s.btn_text}>{t('register')}</span>
              </button>
            </Form>
          )
        }}
      </Formik>

      <div>
        <p className={s.social_title}>{t('register_with')}</p>
        <ul className={s.social_list}>
          <li>
            <Facebook />
          </li>
          <li>
            <Google />
          </li>
          <li>
            <Vk />
          </li>
        </ul>
      </div>
    </div>
  )
}
