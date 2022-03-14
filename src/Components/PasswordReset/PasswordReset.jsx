import React from 'react'

import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as routes from '../../routes'
import cn from 'classnames'
import s from './PasswordReset.module.scss'

export function PasswordReset() {
  const tabletOrHigher = useMediaQuery({ query: 'min-width: 768px' })

  //   const handleSubmit = ({ email, password, reCaptcha }) => {
  //     dispatch(authOperations.login(email, password, reCaptcha))
  //   }

  //   const validationSchema = Yup.object().shape({
  //     email: Yup.string().email(t('warnings.wrong_email')).required(t('warnings.email')),
  //   })

  const { t } = useTranslation()
  return (
    <div className={s.form_wrapper}>
      <p>{t('reset.resetTitle')}</p>
      <Formik>
        {() => {
          return (
            <Form className={s.form}>
              <p className={s.reset_sescription}>{t('reset.restDescription')}</p>
              <div className={s.input_wrapper}>
                <p className={s.reset__input_title}>'Email Adress:'</p>
                <Field
                  className={cn({ [s.input]: true })}
                  name="email"
                  type="text"
                  placeholder={t('reset.resetEmail')}
                />
                {/* <input
                  className={s.reset_input}
                  type="text"
                  placeholder={t('reset.resetEmail')}
                /> */}
              </div>

              <button className={s.submit_btn} type="submit">
                <span className={s.btn_text}>{t('reset.resetButton')}</span>
              </button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
