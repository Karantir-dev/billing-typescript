import { Form, Formik } from 'formik'
import React from 'react'
import { Cross } from '../../../../images'
import { Button, InputField, Select } from '../../../'

import s from './DeleteVerificationModal.module.scss'
import { useTranslation } from 'react-i18next'

export default function DeleteVerificationModal({ initState, closeFn }) {
  const { t } = useTranslation(['vds', 'other'])

  const handleFormSubmit = () => {}
  console.log(initState)

  const getOptionsList = () => {
    const optionsList = initState.slist[0].val

    return optionsList.map(({ $key, $ }) => ({
      value: $key,
      label: t($.trim()),
    }))
  }

  return (
    <div className={s.modal}>
      <button className={s.icon_cross} onClick={closeFn} type="button">
        <Cross />
      </button>

      <p className={s.title}>
        {t('delete_verification_title')}
        {initState.elid.$}
      </p>

      <p className={s.description}>{t('delete_verification_desc')}</p>

      <Formik
        initialValues={{ number: initState.phone.$, method: initState.type.$ }}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <Form className={s.form}>
              <InputField
                inputClassName={s.input}
                name="number"
                isShadow
                label={`${t('phone_number')}:`}
                error={!!errors.passwd}
                touched={!!touched.passwd}
              />

              <Select
                itemsList={getOptionsList()}
                value={values.method}
                getElement={value => setFieldValue('method', value)}
                label={`${t('confirmation_method')}:`}
                isShadow
              />

              {/* <InputField
                inputClassName={s.input}
                name="confirm"
                isShadow
                type="password"
                label={`${t('confirmation')}:`}
                placeholder={t('confirmation_placeholder')}
                error={!!errors.confirm}
                touched={!!touched.confirm}
              /> */}

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
