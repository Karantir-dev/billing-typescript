import React, { useRef, useState } from 'react'
import * as Yup from 'yup'
import { RECAPTCHA_KEY } from '../../../config/config'
import ReCAPTCHA from 'react-google-recaptcha'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ErrorMessage, Form, Formik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'

import { authOperations } from '../../../Redux'
import { SelectOfCountries, InputField, Button } from '../..'
import * as routes from '../../../routes'
import { Facebook, Google, Vk } from './../../../images'

import s from './SignupForm.module.scss'

const COUNTRIES_WITH_REGIONS = [233, 108, 14]

export default function SignupForm() {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const recaptchaEl = useRef()

  const [errMsg, setErrMsg] = useState('')

  const successRegistration = () => {
    navigate(routes.LOGIN, { state: { from: location.pathname } })
  }

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
      is: val => COUNTRIES_WITH_REGIONS.includes(val),
      then: Yup.number()
        .min(1, t('warnings.region_required'))
        .required(t('warnings.region_required')),
      otherwise: Yup.number(),
    }),
  })

  const handleSubmit = (values, { setFieldValue }) => {
    const resetRecaptcha = () => {
      recaptchaEl.current.reset()
      setFieldValue('reCaptcha', '')
    }

    dispatch(
      authOperations.register(values, setErrMsg, successRegistration, resetRecaptcha),
    )
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
                autoComplete
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
              />

              <SelectOfCountries
                setErrMsg={setErrMsg}
                setFieldValue={setFieldValue}
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

              <Button
                dataTestid="btn_form_submit"
                className={s.submit_btn}
                label={t('register')}
                type="submit"
              />
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
