import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { useParams, useSearchParams } from 'react-router-dom'
import { Icon } from '../Icon'

import authOperations from '../../Redux/auth/authOperations'
import * as Yup from 'yup'
import * as routes from '../../routes'
import cn from 'classnames'
import s from './PasswordChange.module.scss'
import { Form, Formik } from 'formik'

export function PasswordChange() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [searchParams, setSearchParams] = useSearchParams()

  const [userId, setUserId] = useState('')
  const [secretKey, setSecretKey] = useState('')

  useEffect(() => {
    setUserId(searchParams.get('user'))
    setSecretKey(searchParams.get('secret'))
  }, [userId])

  // console.log(userId)
  // console.log(secretKey)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t('change.warnings.emptyPass'))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        t('change.warnings.invalidPass'),
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      t('change.warnings.notMatchPass'),
    ),
  })

  // const handleParams = () => {
  //   setUserId(searchParams.get('user'))
  //   setSecretKey(searchParams.get('secret'))
  // }

  const handleSubmit = (password, userId, secretKey) => {
    dispatch(authOperations.chengePassword(password, userId, secretKey))
    console.log(password, userId, secretKey)
  }

  return (
    <div className={s.form_wrapper}>
      <h3 className={s.form_title}>{t('change.passChangeTitle')}</h3>
      <Formik
        initialValues={{ password: '', confirmPassword: '', userId: '', secretKey: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, handleChange, handleBlur }) => {
          values.userId = userId
          values.secretKey = secretKey
          return (
            <Form className={s.form}>
              <div className={s.field_wrapper}>
                <label htmlFor="pass" className={s.label}>
                  {t('change.password')}
                </label>
                <div className={s.input_wrapper}>
                  {tabletOrHigher && (
                    <Icon
                      className={s.field_icon}
                      name="padlock"
                      width={19}
                      height={19}
                    />
                  )}
                  <input
                    className={cn({
                      [s.input]: true,
                      [s.error]: errors.password,
                    })}
                    id="pass"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('change.changePass')}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                  />
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.password,
                    })}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      className={s.icon_eye}
                      name={showPassword ? 'closed-eye' : 'eye'}
                      width={21}
                      height={21}
                    ></Icon>
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <span className={s.error_message}>{errors.password}</span>
              </div>

              <div className={s.field_wrapper}>
                <label htmlFor="confPass" className={s.label}>
                  {t('change.confirmation')}
                </label>
                <div className={s.input_wrapper}>
                  {tabletOrHigher && (
                    <Icon
                      className={s.field_icon}
                      name="padlock"
                      width={19}
                      height={19}
                    />
                  )}
                  <input
                    className={cn({
                      [s.input]: true,
                      [s.error]: errors.confirmPassword,
                    })}
                    id="confPass"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('change.confPass')}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                  />
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.confirmPassword,
                    })}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      className={s.icon_eye}
                      name={showConfirmPassword ? 'closed-eye' : 'eye'}
                      width={21}
                      height={21}
                    ></Icon>
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <span className={s.error_message}>{errors.confirmPassword}</span>
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
