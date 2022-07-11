import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import cn from 'classnames'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { EyeClosed, Eye, Padlock } from '../../../images'
import { authOperations } from '../../../Redux'
import * as routes from '../../../routes'

import s from './PasswordChange.module.scss'

export default function PasswordChange() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('user')
  const secret = searchParams.get('secret')

  const [errType, setErrType] = useState('')
  const [passIsShown, setPassIsShown] = useState(false)
  const [passConfirmationIsShown, setPassConfirmationIsShown] = useState(false)

  // redirects to login if query parasms are missing
  useEffect(() => {
    if (!userId || !secret) {
      navigate(routes.LOGIN)
    }
  }, [userId, secret, navigate])

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t('warnings.password_required'))
      .min(6, t('warnings.invalid_pass'))
      .max(48, t('warnings.invalid_pass'))
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, t('warnings.invalid_pass')),
    passConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('warnings.mismatched_password'))
      .required(t('warnings.mismatched_password')),
  })

  const onChangeSuccess = () => {
    navigate(routes.LOGIN, { state: { from: location.pathname } })
  }

  const handleSubmit = ({ password }) => {
    dispatch(
      authOperations.changePassword(
        password,
        userId,
        secret,
        setErrType,
        onChangeSuccess,
      ),
    )
  }

  return (
    <div className={s.form_wrapper}>
      <h3 className={s.form_title}>{t('change.form_title')}</h3>
      <Formik
        initialValues={{
          password: '',
          passConfirmation: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched }) => {
          return (
            <Form className={s.form}>
              {errType && (
                <div className={s.credentials_error}>{t(`warnings.${errType}`)}</div>
              )}
              <div className={s.field_wrapper}>
                <label className={s.label}>{t('password_label')}</label>
                <div className={s.input_wrapper}>
                  <Field
                    className={cn({
                      [s.input]: true,
                      [s.error]: errors.password && touched.password,
                    })}
                    name="password"
                    type={passIsShown ? 'text' : 'password'}
                    placeholder={t('change.pass_placeholder')}
                  />
                  {tabletOrHigher && <Padlock className={s.field_icon} />}
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.password,
                    })}
                    type="button"
                    onClick={() => setPassIsShown(!passIsShown)}
                  >
                    {passIsShown ? (
                      <Eye className={s.icon_eye} />
                    ) : (
                      <EyeClosed className={s.icon_eye} />
                    )}
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <ErrorMessage
                  className={s.error_message}
                  name="password"
                  component="span"
                />
              </div>

              <div className={s.field_wrapper}>
                <label className={s.label}>{t('change.confirmation_label')}</label>
                <div className={s.input_wrapper}>
                  <Field
                    className={cn({
                      [s.input]: true,
                      [s.error]: errors.passConfirmation && touched.passConfirmation,
                    })}
                    name="passConfirmation"
                    type={passConfirmationIsShown ? 'text' : 'password'}
                    placeholder={t('change.confirmation_placeholder')}
                  />
                  {tabletOrHigher && <Padlock className={s.field_icon} />}
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.passConfirmation,
                    })}
                    type="button"
                    onClick={() => setPassConfirmationIsShown(!passConfirmationIsShown)}
                  >
                    {passConfirmationIsShown ? (
                      <Eye className={s.icon_eye} />
                    ) : (
                      <EyeClosed className={s.icon_eye} />
                    )}
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <ErrorMessage
                  className={s.error_message}
                  name="passConfirmation"
                  component="span"
                />
              </div>

              <button className={s.submit_btn} type="submit">
                <span className={s.btn_text}>{t('change.save_btn')}</span>
              </button>
              <Link className={s.reset_pass_link} to={routes.LOGIN}>
                {t('change.cancel_link')}
              </Link>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}