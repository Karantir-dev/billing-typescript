import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'
import { authOperations, authSelectors } from '../../../Redux'
import { VerificationModal, Button, InputField, LoginBtnBlock } from '../..'
import * as routes from '../../../routes'
import { RECAPTCHA_KEY } from '../../../config/config'
import { Facebook, Google, Vk } from '../../../images'

import s from './LoginForm.module.scss'

const FACEBOOK_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=facebook'
const VK_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=vkontakte'
const GOOGLE_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=google'

export default function LoginForm() {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const location = useLocation()
  const formVisibility = useSelector(authSelectors.getTotpFormVisibility)
  const recaptchaEl = useRef()

  // const redirectID = location?.state?.redirect

  const [errMsg, setErrMsg] = useState(location?.state?.errMsg || '')
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false)
  // const [socialLinks, setSocialLinks] = useState({})

  // useEffect(() => {
  //   dispatch(authOperations.getLoginSocLinks(setSocialLinks))
  // }, [])

  const handleSubmit = ({ email, password, reCaptcha }, { setFieldValue }) => {
    const resetRecaptcha = () => {
      recaptchaEl && recaptchaEl?.current?.reset()
      setFieldValue('reCaptcha', '')
    }

    dispatch(authOperations.login(email, password, reCaptcha, setErrMsg, resetRecaptcha))
  }

  const handleUserKeyPress = e => {
    if (e.keyCode === 9) {
      e.preventDefault()
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/^[^!#$%^&*()\]~/}[{=?|"<>':;]+$/g, t('warnings.special_characters'))
      .required(t('warnings.email_required')),
    password: Yup.string().required(t('warnings.password_required')),
    reCaptcha: Yup.string().nullable().required(t('warnings.recaptcha')),
  })

  useEffect(() => {
    if (formVisibility === 'shown') {
      window.addEventListener('keydown', handleUserKeyPress)
    }

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [formVisibility])

  return (
    <div className={s.form_wrapper}>
      <LoginBtnBlock login />
      <Formik
        initialValues={{ email: '', password: '', reCaptcha: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, errors, touched }) => {
          const resetRecaptcha = () => {
            recaptchaEl && recaptchaEl?.current?.reset()
            setFieldValue('reCaptcha', '')
          }

          return (
            <>
              <VerificationModal resetRecaptcha={resetRecaptcha} />
              <Form className={s.form}>
                {errMsg && (
                  <div className={s.credentials_error}>
                    {t(`warnings.${errMsg}`, {
                      value: location?.state?.value || '',
                    })}
                  </div>
                )}
                {location.state?.from === routes.CHANGE_PASSWORD && !errMsg && (
                  <div className={s.changed_pass}>{t('changed_pass')}</div>
                )}
                {location.state?.from === routes.REGISTRATION && !errMsg && (
                  <div className={s.changed_pass}>{t('registration_success')}</div>
                )}

                <InputField
                  dataTestid="input_email"
                  label={t('email_or_login_label')}
                  placeholder={t('email_placeholder')}
                  iconLeft="envelope"
                  name="email"
                  error={!!errors.email}
                  touched={!!touched.email}
                  className={s.input_field_wrapper}
                  inputAuth
                  autoComplete="on"
                />

                <InputField
                  dataTestid="input_password"
                  label={t('password_label')}
                  placeholder={t('password_placeholder')}
                  name="password"
                  type="password"
                  iconLeft="padlock"
                  className={s.input_field_wrapper}
                  error={!!errors.password}
                  inputAuth
                  touched={!!touched.password}
                />

                {!isCaptchaLoaded && (
                  <div className={s.loaderBlock}>
                    <div className={s.loader}>
                      <div className={`${s.loader_circle} ${s.first}`}></div>
                      <div className={`${s.loader_circle} ${s.second}`}></div>
                      <div className={s.loader_circle}></div>
                    </div>
                  </div>
                )}

                <ReCAPTCHA
                  className={s.captcha}
                  ref={recaptchaEl}
                  sitekey={RECAPTCHA_KEY}
                  asyncScriptOnLoad={() => setIsCaptchaLoaded(true)}
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
                  label={t('logIn')}
                  type="submit"
                  isShadow
                />

                <Link className={s.reset_pass_link} to={routes.RESET_PASSWORD}>
                  {t('forgot_password')}
                </Link>
              </Form>
            </>
          )
        }}
      </Formik>

      <div>
        <p className={s.social_title}>{t('login_with')}</p>
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
