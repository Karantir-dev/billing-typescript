import { useRef, useState } from 'react'
import { Icon, InputField, LoaderDots, VerificationModal } from '@components'
import { useTranslation } from 'react-i18next'
import s from '../OrderTariff.module.scss'
import cn from 'classnames'
import { ErrorMessage, Form, Formik } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { RECAPTCHA_KEY } from '@config/config'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { authOperations, authSelectors } from '@redux'
import * as Yup from 'yup'
import {
  SPECIAL_CHARACTERS_REGEX,
  CYRILLIC_ALPHABET_PROHIBITED,
  PASS_REGEX,
  PASS_REGEX_ASCII,
  GOOGLE_LOGIN_LINK,
  GOOGLE_REGISTRATION_LINK,
  VK_LOGIN_LINK,
  VK_REGISTRATION_LINK,
} from '@utils/constants'

export default function SecondStep({ toLogin, setToLogin, passStep }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['auth'])

  // false for register, true for login
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false)

  const geoData = useSelector(authSelectors.getGeoData)

  const recaptchaEl = useRef()
  const globalErrMsg = useSelector(authSelectors.getAuthErrorMsg)

  const [errMsg, setErrMsg] = useState(location?.state?.errMsg || '')

  const authSubmitHandle = ({ email, password, reCaptcha }, { setFieldValue }) => {
    const resetRecaptcha = () => {
      recaptchaEl && recaptchaEl?.current?.reset()
      setFieldValue('reCaptcha', '')
    }

    const partner = Cookies.get('billpartner')
    const sesid = Cookies.get('sesid')
    const referrer = Cookies.get('referrer')

    toLogin
      ? dispatch(
          authOperations.login(email, password, reCaptcha, resetRecaptcha, passStep),
        )
      : dispatch(
          authOperations.register(
            {
              name: '',
              email: email,
              password: password,
              passConfirmation: password,
              country: geoData?.clients_country_id,
              state: '',
              reCaptcha,
            },
            partner,
            sesid || referrer,
            setErrMsg,
            passStep,
            resetRecaptcha,
            true,
          ),
        )
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(SPECIAL_CHARACTERS_REGEX, t('warnings.special_characters'))
      .matches(CYRILLIC_ALPHABET_PROHIBITED, t('warnings.cyrillic_prohibited'))
      .email(t('warnings.invalid_email'))
      .required(t('warnings.email_required')),
    password: Yup.string()
      .min(12, t('warnings.invalid_pass', { min: 12, max: 48 }))
      .max(48, t('warnings.invalid_pass', { min: 12, max: 48 }))
      .matches(PASS_REGEX_ASCII, t('warnings.invalid_ascii'))
      .matches(PASS_REGEX, t('warnings.invalid_pass', { min: 12, max: 48 }))
      .required(t('warnings.password_required')),
    reCaptcha: Yup.string()
      .typeError(t('warnings.recaptcha'))
      .required(t('warnings.recaptcha')),
  })

  const isVKAllowed =
    geoData?.clients_country_id === '182' ||
    geoData?.clients_country_id === '80' ||
    geoData?.clients_country_id === '113'
  return (
    <>
      <div className={s.auth}>
        <div className={s.auth_tabs}>
          <button
            className={cn(s.auth_tab, { [s.auth_tab_active]: !toLogin })}
            onClick={() => setToLogin(false)}
          >
            {t('registration')}
          </button>
          <button
            className={cn(s.auth_tab, { [s.auth_tab_active]: toLogin })}
            onClick={() => setToLogin(true)}
          >
            {t('logIn')}
          </button>
        </div>
        <div className={s.auth_container}>
          <Formik
            initialValues={{ email: '', password: '', reCaptcha: '' }}
            onSubmit={authSubmitHandle}
            validationSchema={validationSchema}
          >
            {({ setFieldValue, errors, touched }) => {
              return (
                <>
                  <VerificationModal />
                  <Form id="registration" className={s.auth_form}>
                    {(errMsg || globalErrMsg) && (
                      <div
                        className={s.credentials_error}
                        dangerouslySetInnerHTML={{
                          __html: t(errMsg || globalErrMsg),
                        }}
                      ></div>
                    )}
                    <InputField
                      dataTestid="input_email"
                      label={t(toLogin ? 'email_or_login_label' : 'email_label')}
                      placeholder={t('email_placeholder')}
                      iconLeft="envelope"
                      name="email"
                      error={!!errors.email}
                      touched={!!touched.email}
                      inputAuth
                      autoComplete="on"
                      className={s.auth_field_wrapper}
                      inputClassName={s.auth_field}
                    />

                    <InputField
                      dataTestid="input_password"
                      label={t('password_label')}
                      placeholder={t('password_placeholder')}
                      name="password"
                      type="password"
                      iconLeft="padlock"
                      error={!!errors.password}
                      inputAuth
                      touched={!!touched.password}
                      className={s.auth_field_wrapper}
                      inputClassName={s.auth_field}
                    />

                    {!isCaptchaLoaded && (
                      <div className={s.auth_loader_block}>
                        <LoaderDots classname={s.auth_loader} />
                      </div>
                    )}

                    <ReCAPTCHA
                      className={s.auth_captcha}
                      ref={recaptchaEl}
                      sitekey={RECAPTCHA_KEY}
                      asyncScriptOnLoad={() => setIsCaptchaLoaded(true)}
                      onChange={value => {
                        setFieldValue('reCaptcha', value)
                      }}
                    />

                    <ErrorMessage
                      name="reCaptcha"
                      component="span"
                      className={s.error_message}
                    />
                  </Form>
                </>
              )
            }}
          </Formik>
          <div className={s.auth_divider}>
            <span className={s.auth_divider_text}>Or</span>
          </div>
          <ul className={s.auth_social}>
            <li>
              <a
                href={toLogin ? GOOGLE_LOGIN_LINK : GOOGLE_REGISTRATION_LINK}
                className={cn(s.auth_social_link, s.auth_social_google)}
              >
                {t('continue_with')} <Icon name="Google" width={18} height={18} />
              </a>
            </li>
            {isVKAllowed && (
              <li>
                <a
                  href={toLogin ? VK_LOGIN_LINK : VK_REGISTRATION_LINK}
                  className={cn(s.auth_social_link, s.auth_social_vk)}
                >
                  {t('continue_with')}{' '}
                  <Icon name="Vk" width={18} height={18} color="#fff" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}
