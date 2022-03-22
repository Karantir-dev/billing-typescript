import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import cn from 'classnames'
import { ErrorMessage, Field, Form, Formik } from 'formik'

import { Icon } from '../Icon'
import { authOperations } from '../../Redux/auth/authOperations'
import * as routes from '../../routes'

import s from './PasswordChange.module.scss'

export function PasswordChange() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('user')
  const secret = searchParams.get('secret')

  const [errType, setErrType] = useState('')
  const [passIsShown, setPassIsShown] = useState(false)
  const [confirmationPassIsShown, setConfirmationPassIsShown] = useState(false)

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
    confirmationPass: Yup.string()
      .oneOf([Yup.ref('password')], t('warnings.mismatched_password'))
      .required(t('warnings.mismatched_password')),
  })

  const onChangeSuccess = () => {
    navigate(routes.LOGIN)
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
      <h3 className={s.form_title}>{t('change.passChangeTitle')}</h3>
      <Formik
        initialValues={{
          password: '',
          confirmationPass: '',
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
                <label className={s.label}>{t('change.password')}</label>
                <div className={s.input_wrapper}>
                  <Field
                    className={cn({
                      [s.input]: true,
                      [s.error]: errors.password && touched.password,
                    })}
                    name="password"
                    type={passIsShown ? 'text' : 'password'}
                    placeholder={t('change.changePass')}
                  />
                  {tabletOrHigher && (
                    <Icon
                      className={s.field_icon}
                      name="padlock"
                      width={19}
                      height={19}
                    />
                  )}
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.password,
                    })}
                    type="button"
                    onClick={() => setPassIsShown(!passIsShown)}
                  >
                    <Icon
                      className={s.icon_eye}
                      name={passIsShown ? 'closed-eye' : 'eye'}
                      width={21}
                      height={21}
                    ></Icon>
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
                <label className={s.label}>{t('change.confirmation')}</label>
                <div className={s.input_wrapper}>
                  <Field
                    className={cn({
                      [s.input]: true,
                      [s.error]: errors.confirmationPass && touched.confirmationPass,
                    })}
                    name="confirmationPass"
                    type={confirmationPassIsShown ? 'text' : 'password'}
                    placeholder={t('change.confPass')}
                  />
                  {tabletOrHigher && (
                    <Icon
                      className={s.field_icon}
                      name="padlock"
                      width={19}
                      height={19}
                    />
                  )}
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.confirmationPass,
                    })}
                    type="button"
                    onClick={() => setConfirmationPassIsShown(!confirmationPassIsShown)}
                  >
                    <Icon
                      className={s.icon_eye}
                      name={confirmationPassIsShown ? 'closed-eye' : 'eye'}
                      width={21}
                      height={21}
                    ></Icon>
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <ErrorMessage
                  className={s.error_message}
                  name="confirmationPass"
                  component="span"
                />
              </div>

              <button className={s.submit_btn} type="submit">
                <span className={s.btn_text}>{t('change.save')}</span>
              </button>
              <Link className={s.reset_pass_link} to={routes.LOGIN}>
                {t('change.cancel')}
              </Link>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
