import React from 'react'
import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Button, InputField, IconButton } from '../..'
import s from './SupportFilter.module.scss'

export default function MainPage() {
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <Formik
          enableReinitialize
          initialValues={{
            search: '',
          }}
          onSubmit={() => null}
        >
          {({ errors, touched }) => {
            return (
              <Form className={s.form}>
                <InputField
                  name="search"
                  placeholder={t('search', { ns: 'other' })}
                  isShadow
                  height={46}
                  iconRight="search"
                  className={s.searchInput}
                  //   onChange={e => console.log(e.target.value)}
                  error={!!errors.email}
                  touched={!!touched.email}
                />
                <IconButton
                  onClick={() => null}
                  icon="filter"
                  className={s.calendarBtn}
                />
              </Form>
            )
          }}
        </Formik>
      </div>
      {params?.path === 'requests' && (
        <Button
          className={s.newTicketBtn}
          isShadow
          size="medium"
          label={t('new ticket')}
          type="button"
        />
      )}
    </div>
  )
}
