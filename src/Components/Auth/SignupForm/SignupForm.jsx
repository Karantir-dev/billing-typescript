import { useRef, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { RECAPTCHA_KEY } from '@config/config'
import ReCAPTCHA from 'react-google-recaptcha'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorMessage, Form, Formik } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { authActions, authOperations, authSelectors } from '@redux'
import {
  SelectOfCountries,
  InputField,
  Button,
  LoginBtnBlock,
  Icon,
  LoaderDots,
} from '@components'
import * as routes from '@src/routes'
import {
  SPECIAL_CHARACTERS_REGEX,
  CYRILLIC_ALPHABET_PROHIBITED,
  PASS_REGEX,
  PASS_REGEX_ASCII,
  GOOGLE_REGISTRATION_LINK,
  VK_REGISTRATION_LINK,
} from '@utils/constants'
import s from './SignupForm.module.scss'

const COUNTRIES_WITH_REGIONS = [233, 108, 14]

export default function SignupForm({ geoCountryId, geoStateId }) {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const recaptchaEl = useRef()

  const globalErrMsg = useSelector(authSelectors.getAuthErrorMsg)

  const [errMsg, setErrMsg] = useState(location?.state?.errMsg || '')
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(authActions.clearAuthErrorMsg())
    }
  }, [])

  const successRegistration = () => {
    navigate(routes.LOGIN, { state: { from: location.pathname }, replace: true })
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(SPECIAL_CHARACTERS_REGEX, t('warnings.special_characters'))
      .required(t('warnings.name_required')),
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
  const referrer = Cookies.get('referrer')

  const handleSubmit = async (values, { setFieldValue }) => {
    const resetRecaptcha = () => {
      recaptchaEl && recaptchaEl?.current?.reset()
      setFieldValue('reCaptcha', '')
    }

    dispatch(
      authOperations.register(
        values,
        partner,
        sesid || referrer,
        setErrMsg,
        successRegistration,
        resetRecaptcha,
      ),
    )
  }

  const isVKAllowed =
    geoCountryId === '182' || geoCountryId === '80' || geoCountryId === '113'

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
              {(errMsg || globalErrMsg) && (
                <div
                  className={s.credentials_error}
                  dangerouslySetInnerHTML={{
                    __html: t(errMsg || globalErrMsg),
                  }}
                ></div>
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
                autoComplete="new-password"
              />

              <SelectOfCountries
                // setErrMsg={setErrMsg}
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

              {!isCaptchaLoaded && (
                <div className={s.loaderBlock}>
                  <LoaderDots classname={s.loader} />
                </div>
              )}

              {/* <GoogleReCaptcha
                onChange={value => {
                  setFieldValue('reCaptcha', value)
                }}
              /> */}

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
          {/* <li>
            <a href={FACEBOOK_REGISTRATION_LINK}>
              <Icon name="Facebook" />
            </a>
          </li> */}
          <li>
            <a href={GOOGLE_REGISTRATION_LINK}>
              <Icon name="Google" />
            </a>
          </li>
          {isVKAllowed && (
            <li>
              <a href={VK_REGISTRATION_LINK}>
                <Icon name="Vk" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
