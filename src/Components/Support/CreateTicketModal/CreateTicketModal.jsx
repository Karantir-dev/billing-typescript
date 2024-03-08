import DepartmentSelect from './DepartmentSelect/DepartmentSelect'
import MessageInput from '../MessageInput/MessageInput'
import { Button, Select, InputField, Modal } from '@components'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Formik, ErrorMessage } from 'formik'
import { supportSelectors, supportOperations } from '@redux'
import * as Yup from 'yup'
import s from './CreateTicketModal.module.scss'
import { useEffect, useState } from 'react'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const { setCreateTicketModal } = props
  const dispatch = useDispatch()

  const departmentsList = useSelector(supportSelectors.getDepartments)
  const servicesList = useSelector(supportSelectors.getServices)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false)

  const validationSchema = Yup.object().shape({
    message: Yup.string().required(t('Is a required field')),
    subject: Yup.string().required(t('Is a required field')),
    client_department: Yup.string().required(t('Select a department')),
  })

  const sendMessageHandle = (values, { resetForm }) => {
    dispatch(supportOperations.createTicket(values, setCreateTicketModal, resetForm))
  }

  return (
    <Modal closeModal={() => setCreateTicketModal(false)} isOpen className={s.modal}>
      <Modal.Header>
        <h2 className={s.title}>{t('New support request')}</h2>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            message: '',
            files: [],
            client_department: '',
            ticket_item: props.relatedService ?? 'null',
            subject: '',
          }}
          onSubmit={sendMessageHandle}
        >
          {/* here */}
          {({ values, setFieldValue, errors, touched }) => {
            let checkItemSize = values?.files.filter(el => el?.size >= 10000000)

            useEffect(() => {
              setIsSubmitDisabled(!!checkItemSize.length)
            }, [checkItemSize.length])

            return (
              <Form id="create-ticket">
                <div className={s.departmentSelect}>
                  {departmentsList?.map(el => {
                    const checkboxId = `selectDepartment_${el.$key}`
                    return (
                      <DepartmentSelect
                        key={el.$key}
                        selected={values?.client_department === el.$key}
                        value={el.$key}
                        title={el.$plainval}
                        description={el.$}
                        setValue={value => setFieldValue('client_department', value)}
                        checkboxId={checkboxId}
                      />
                    )
                  })}
                </div>
                <ErrorMessage
                  className={s.error_department}
                  name={'client_department'}
                  component="span"
                />
                <Select
                  height={52}
                  value={values.ticket_item}
                  getElement={item => setFieldValue('ticket_item', item)}
                  isShadow
                  label={`${t('Specify what the question is about')}:`}
                  itemsList={servicesList.map(el => {
                    return { label: t(el.label), value: el.value }
                  })}
                  className={s.select}
                  disabled={servicesList.length <= 1}
                />
                <InputField
                  label={t('Request subject:')}
                  placeholder={t('Enter the subject of your request')}
                  name="subject"
                  isShadow
                  error={!!errors.subject}
                  touched={!!touched.subject}
                  className={s.input_field_wrapper}
                  autoComplete="off"
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
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          isShadow
          disabled={isSubmitDisabled}
          size="large"
          className={s.submit_btn}
          label={t('Send', { ns: 'other' })}
          type="submit"
          form="create-ticket"
        />
      </Modal.Footer>
    </Modal>
  )
}
