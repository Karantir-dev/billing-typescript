import { Form, Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button, InputField } from '../../..'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../../Redux'

import s from './PasswordChange.module.scss'

export default function PasswordChange({ id, name, closeFn }) {
  const { t } = useTranslation(['vds', 'other', 'auth'])
  const dispatch = useDispatch()

  const handleFormSubmit = values => {
    dispatch(vdsOperations.changePassword(id, values.passwd, values.confirm))
    closeFn()
  }

  const validationSchema = Yup.object().shape({
    passwd: Yup.string()
      .min(6, t('warnings.invalid_pass', { ns: 'auth' }))
      .max(48, t('warnings.invalid_pass', { ns: 'auth' }))
      .matches(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        t('warnings.invalid_pass', { ns: 'auth' }),
      )
      .required(t('warnings.password_required', { ns: 'auth' })),
    confirm: Yup.string()
      .oneOf([Yup.ref('passwd')], t('warnings.mismatched_password', { ns: 'auth' }))
      .required(t('warnings.mismatched_password', { ns: 'auth' })),
  })

  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>
      <p className={s.title}>{t('password_change')}</p> <p className={s.name}>{name}</p>
      <p className={s.description}>{t('password_change_desc')}</p>
      <Formik
        initialValues={{ passwd: '', confirm: '' }}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched }) => {
          return (
            <Form className={s.form}>
              <InputField
                inputClassName={s.input}
                name="passwd"
                isShadow
                type="password"
                label={`${t('new_password')}:`}
                placeholder={t('new_password_placeholder')}
                error={!!errors.passwd}
                touched={!!touched.passwd}
                isRequired
              />

              <InputField
                inputClassName={s.input}
                name="confirm"
                isShadow
                type="password"
                label={`${t('confirmation')}:`}
                placeholder={t('confirmation_placeholder')}
                error={!!errors.confirm}
                touched={!!touched.confirm}
                isRequired
              />

              <Button
                className={s.btn_save}
                isShadow
                type="submit"
                label={t('Save', { ns: 'other' })}
              />
            </Form>
          )
        }}
      </Formik>
      <button className={s.btn_cancel} onClick={closeFn} type="button">
        {t('Cancel', { ns: 'other' })}
      </button>
    </div>
  )
}
