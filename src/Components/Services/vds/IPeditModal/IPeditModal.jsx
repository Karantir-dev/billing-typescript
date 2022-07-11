import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button, InputField } from '../../../'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../../Redux'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import { DOMAIN_REGEX } from '../../../../utils'

import s from './IPeditModal.module.scss'

export default function IPeditModal({ serverID, id, closeFn, setElements }) {
  const { t } = useTranslation(['vds', 'other', 'dedicated_servers'])
  const dispatch = useDispatch()

  const [initialState, setInitialState] = useState()

  useEffect(() => {
    dispatch(vdsOperations.getEditIPInfo(serverID, id, setInitialState))
  }, [])

  const handleSubmit = values => {
    dispatch(
      vdsOperations.changeDomainName(serverID, id, values.domain, closeFn, setElements),
    )
  }

  const validationSchema = Yup.object().shape({
    domain: Yup.string()
      .matches(DOMAIN_REGEX, t('warning_domain'))
      .required(t('warning_domain')),
  })

  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>

      <p className={s.title}>
        <span className={s.bold}>
          {t('ip_address')} — {initialState?.domain_name.$.split('(')[0]}
        </span>
        {'(' + initialState?.domain_name.$.split('(')[1]}
      </p>

      <Formik
        enableReinitialize
        initialValues={{
          domain: initialState?.domain.$ || '',
          mask: initialState?.mask.$ || '',
          gateway: initialState?.gateway.$ || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => {
          return (
            <Form className={s.form}>
              <InputField
                name="domain"
                inputClassName={s.input}
                label={`${t('domain', { ns: 'dedicated_servers' })}:`}
                error={!!errors.domain}
                touched={!!touched.domain}
                isShadow
                isRequired
              />
              <InputField
                name="mask"
                inputClassName={s.input}
                label={`${t('mask', { ns: 'dedicated_servers' })}:`}
                error={!!errors.mask}
                touched={!!touched.mask}
                isShadow
                disabled
              />
              <InputField
                name="gateway"
                inputClassName={s.input}
                label={`${t('gateway', { ns: 'dedicated_servers' })}:`}
                error={!!errors.gateway}
                touched={!!touched.gateway}
                isShadow
                disabled
              />

              <Button
                className={s.save_btn}
                type="submit"
                isShadow
                label={t('Save', { ns: 'other' })}
              />
            </Form>
          )
        }}
      </Formik>

      <button className={s.cancel_btn} type="button" onClick={closeFn}>
        {t('Cancel', { ns: 'other' })}
      </button>
    </div>
  )
}