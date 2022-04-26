import React from 'react'
import DepartmentSelect from './DepartmentSelect/DepartmentSelect'
import MessageInput from '../MessageInput/MessageInput'
import { Cross } from '../../../images'
import { Button, Select, InputField } from '../..'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'
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
    dispatch(supportOperations.createTicket(values, setCreateTicketModal, resetForm))
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
            let checkItemSize = values?.files.filter(el => el?.size >= 10000000)
            return (
              <Form className={s.form}>
                <div className={s.departmentSelect}>
                  {departmentsList?.map(el => {
                    return (
                      <DepartmentSelect
                        key={el.$key}
                        selected={values?.client_department === el.$key}
                        value={el.$key}
                        title={el.$plainval}
                        description={el.$}
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
                <MessageInput
                  message={values.message}
                  filesError={checkItemSize.length !== 0}
                  files={values.files}
                  onChangeFiles={value => setFieldValue('files', value)}
                />
                <Button
                  disabled={checkItemSize.length !== 0}
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
