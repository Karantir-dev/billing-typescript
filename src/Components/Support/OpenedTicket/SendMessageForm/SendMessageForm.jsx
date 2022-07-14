import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { supportOperations } from '../../../../Redux'
import MessageInput from '../../MessageInput/MessageInput'
import * as Yup from 'yup'
import { Button } from '../../../'
import { Form, Formik } from 'formik'
import * as route from '../../../../routes'
import s from './SendMessageForm.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()

  const validationSchema = Yup.object().shape({
    message: Yup.string().required(t('Is a required field')),
  })

  const sendMessageHandle = (values, { resetForm }) => {
    dispatch(supportOperations.sendMessage(params?.id, values))
    resetForm()
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{ message: '', files: [] }}
      onSubmit={sendMessageHandle}
    >
      {({ values, setFieldValue }) => {
        let checkItemSize = values?.files.filter(el => el?.size >= 10000000)
        return (
          <Form className={s.form}>
            <div className={s.fieldsBlock}>
              <MessageInput
                message={values?.message}
                filesError={checkItemSize.length !== 0}
                files={values.files}
                onChangeFiles={value => setFieldValue('files', value)}
              />
            </div>
            <div className={s.btnsBlock}>
              <Button
                dataTestid='btn_form_submit'
                disabled={checkItemSize.length !== 0}
                size="large"
                className={s.submit_btn}
                label={t('Send', { ns: 'other' })}
                type="submit"
                isShadow
              />
              <NavLink className={s.link} to={`${route.SUPPORT}/${params.path}`}>
                {t('Cancel', { ns: 'other' })}
              </NavLink>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
