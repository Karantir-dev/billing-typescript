import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import { authOperations } from '@redux'
import * as routes from '@src/routes'

import s from './PasswordChange.module.scss'
import { InputField, Button } from '@components'

export default function PasswordChange() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('user')
  const secret = searchParams.get('secret')

  const [errType, setErrType] = useState('')

  // redirects to login if query parasms are missing
  useEffect(() => {
    if (!userId || !secret) {
      navigate(routes.LOGIN)
    }
  }, [userId, secret, navigate])

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t('warnings.password_required'))
      .min(12, t('warnings.invalid_pass'), { min: 12, max: 48 })
      .max(48, t('warnings.invalid_pass'), { min: 12, max: 48 })
      .matches(
        /(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\d)/,
        t('warnings.invalid_pass', { min: 12, max: 48 }),
      ),
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
        {({ errors, touched }) => {
          return (
            <Form className={s.form}>
              {errType && (
                <div className={s.credentials_error}>{t(`warnings.${errType}`)}</div>
              )}

              <InputField
                dataTestid="input_password"
                label={t('password_label')}
                placeholder={t('change.pass_placeholder')}
                name="password"
                type="password"
                iconLeft="padlock"
                className={s.field_wrapper}
                error={!!errors.password}
                inputAuth
                autoComplete="off"
                touched={!!touched.password}
              />

              <InputField
                dataTestid="input_password"
                label={t('change.confirmation_label')}
                placeholder={t('change.confirmation_placeholder')}
                name="passConfirmation"
                type="password"
                iconLeft="padlock"
                className={s.field_wrapper}
                error={!!errors.password}
                inputAuth
                autoComplete="off"
                touched={!!touched.password}
              />

              <Button
                type="submit"
                isShadow
                label={t('change.save_btn')}
                className={s.submit_btn}
              />
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
