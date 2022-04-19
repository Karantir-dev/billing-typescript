import React from 'react'
import DepartmentSelect from './DepartmentSelect/DepartmentSelect'
import cn from 'classnames'
import { Cross, Clip } from '../../../images'
import { Button, Select, InputField } from '../..'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import { supportSelectors, supportOperations } from '../../../Redux'
import * as Yup from 'yup'
import s from './CreateTicketModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const { setCreateTicketModal } = props
  const dispatch = useDispatch()

  const departmentsList = useSelector(supportSelectors.getDepartments)
  const servicesList = useSelector(supportSelectors.getServices)

  const validationSchema = Yup.object().shape({
    message: Yup.string().required(),
    subject: Yup.string().required(t('Is a required field')),
  })

  const sendMessageHandle = (values, { resetForm }) => {
    dispatch(supportOperations.createTicket(values, setCreateTicketModal))
    resetForm()
  }

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <h2>{t('New support request')}</h2>
          <button className={s.crossBtn} onClick={() => setCreateTicketModal(false)}>
            <Cross />
          </button>
        </div>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            message: '',
            files: [],
            client_department: departmentsList[0]?.$key || '',
            ticket_item: 'null',
            subject: '',
          }}
          onSubmit={sendMessageHandle}
        >
          {({ values, setFieldValue, errors, touched }) => {
            return (
              <Form className={s.form}>
                <div className={s.departmentSelect}>
                  {departmentsList?.map(el => {
                    return (
                      <DepartmentSelect
                        key={el.$key}
                        selected={values?.client_department === el.$key}
                        value={el.$key}
                        title={el.$}
                        setValue={value => setFieldValue('client_department', value)}
                      />
                    )
                  })}
                </div>
                <Select
                  height={52}
                  value={values.ticket_item}
                  getElement={item => setFieldValue('ticket_item', item)}
                  isShadow
                  label={t('Specify what the question is about')}
                  itemsList={servicesList.map(el => {
                    return { label: t(el.label), value: el.value }
                  })}
                  className={s.select}
                />
                <InputField
                  label={t('Request subject:')}
                  placeholder={t('Enter the subject of your request')}
                  name="subject"
                  isShadow
                  error={!!errors.subject}
                  touched={!!touched.subject}
                  className={s.input_field_wrapper}
                  autoComplete
                />
                <label htmlFor={'message'} className={s.label}>
                  {t('Message')}:
                </label>
                <div className={s.fieldsBlock}>
                  <Field
                    className={s.textarea}
                    type="text"
                    id="message"
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
                  {/* <ErrorMessage
                    className={s.error_message}
                    name={'message'}
                    component="span"
                  /> */}
                </div>
                <Button
                  size="large"
                  className={s.submit_btn}
                  label={t('Send', { ns: 'other' })}
                  type="submit"
                />
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}
