import { useTranslation } from 'react-i18next'
import { Button, InputField, Modal, MessageInput } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { supportOperations } from '@redux'
import { useDispatch } from 'react-redux'

import s from './TipsModal.module.scss'

export default function TipsModal({ closeTipsModal, elid, setSuccessModal }) {
  const { t } = useTranslation(['support', 'other', 'billing'])
  const dispatch = useDispatch()

  const paymentHandler = values => {
    const { summ, message } = values

    dispatch(supportOperations.paySupportTips(elid, summ, message, setSuccessModal))
    closeTipsModal()
  }

  const validationSchema = Yup.object().shape({
    summ: Yup.number()
      .required(t('Is a required field', { ns: 'other' }))
      .min(1, `${t('min_payment_amount', { ns: 'billing' })}: 1 EUR`)
      .max(9999, `${t('max_payment_amount', { ns: 'billing' })}: 9999 EUR`),
  })

  return (
    <Modal closeModal={closeTipsModal} isOpen className={s.modal}>
      <Modal.Header>
        <span className={s.headerText}>{t('Thank support')}</span>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            summ: '',
            message: '',
          }}
          onSubmit={paymentHandler}
        >
          {({ values, errors, touched }) => {
            return (
              <Form className={s.form} id="tips">
                <InputField
                  label={`${t('Sum', { ns: 'other' })}:`}
                  placeholder={`${t('0.00 EUR')}`}
                  name="summ"
                  isShadow
                  error={!!errors.summ}
                  touched={!!touched.summ}
                  className={s.input_field_wrapper}
                  autoComplete="off"
                  type="number"
                  value={values?.summ}
                />

                <p className={s.note}>
                  <span>*</span>
                  {t('The transfer amount will be debited from your balance')}
                </p>

                <label htmlFor="tipsComment" className={s.comment}>
                  {t('Comment')}:
                </label>

                <MessageInput
                  message={values.message}
                  enableFiles={false}
                  fieldId={'tipsComment'}
                />
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer column>
        <Button
          className={s.buyBtn}
          isShadow
          label={t('THANK YOU', { ns: 'support' })}
          type="submit"
          form="tips"
        />
        <button onClick={closeTipsModal} type="button" className={s.cancelBtn}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
