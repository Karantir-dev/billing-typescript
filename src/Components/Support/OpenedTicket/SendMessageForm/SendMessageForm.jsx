import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { supportOperations } from '../../../../Redux'
import * as Yup from 'yup'
import cn from 'classnames'
import { Clip, Cross } from '../../../../images'
import { Button } from '../../../'
import { Field, Form, Formik } from 'formik'
import * as route from '../../../../routes'
import s from './SendMessageForm.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()

  const validationSchema = Yup.object().shape({
    message: Yup.string().required(),
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
      {({ values, setFieldValue }) => (
        <Form className={s.form}>
          <div className={s.fieldsBlock}>
            <Field
              className={s.textarea}
              type="text"
              name="message"
              placeholder={t('Enter your message...')}
              as="textarea"
            />
            <div className={s.filesContainer}>
              <label htmlFor="files">
                <div
                  className={cn(s.filesBlock, {
                    [s.notEmpty]: values?.files?.length > 0,
                  })}
                >
                  <Clip />
                  {values?.files?.length === 0 ? (
                    <div className={s.filesInfo}>
                      <span>{t('The maximum number of files is 5.')}</span>
                      <span>{t('Maximum size - 95.5 MB')}</span>
                    </div>
                  ) : null}
                </div>
                <input
                  hidden
                  disabled={values?.files?.length === 5}
                  id="files"
                  name="files"
                  type="file"
                  onChange={e =>
                    e?.target?.files?.length !== 0 &&
                    setFieldValue('files', values.files.concat(e.target.files[0]))
                  }
                />
              </label>
              {values?.files?.map((el, index) => (
                <div className={s.fileItem} key={index}>
                  {el?.name}
                  <button
                    type="button"
                    onClick={() => {
                      let newArr = values.files
                        .slice(0, index)
                        .concat(values.files.slice(index + 1, values.files.length))
                      setFieldValue('files', newArr)
                    }}
                    className={s.fileDeleteItem}
                  >
                    <Cross />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={s.btnsBlock}>
            <Button
              size="large"
              className={s.submit_btn}
              label={t('Send', { ns: 'other' })}
              type="submit"
            />
            <NavLink className={s.link} to={`${route.SUPPORT}/${params.path}`}>
              {t('Cancel', { ns: 'other' })}
            </NavLink>
          </div>
        </Form>
      )}
    </Formik>
  )
}
