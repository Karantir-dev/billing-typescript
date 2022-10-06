import React from 'react'
import { useTranslation } from 'react-i18next'
import s from './TipsModal.module.scss'
import { Cross } from '../../../images'
import { Button, InputField } from '../../../Components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { supportOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'

export default function TipsModal({ closeTipsModal, elid, setSuccessModal }) {
  const { t } = useTranslation(['support', 'other', 'billing'])
  const dispatch = useDispatch()

  const paymentHandler = values => {
    const { summ } = values

    dispatch(supportOperations.paySupportTips(elid, summ, setSuccessModal))
    closeTipsModal()
  }

  const validationSchema = Yup.object().shape({
    summ: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .min(1, `${t('Мінімальна сума платежу', { ns: 'billing' })}: 1 EUR`),
  })

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <div className={s.headerTitleBlock}>
          <span className={s.headerText}>{t('Thank support')}</span>
        </div>
        <Cross
          width="17px"
          height="17px"
          onClick={closeTipsModal}
          className={s.crossIcon}
        />
      </div>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          summ: '',
        }}
        onSubmit={paymentHandler}
      >
        {({ values, errors, touched, setFieldValue }) => {
          return (
            <Form className={s.form}>
              <div className={s.fieldsBlock}>
                <InputField
                  label={`${t('Sum', { ns: 'other' })}:`}
                  placeholder={`${t('0.00 EUR')}`}
                  name="summ"
                  isShadow
                  error={!!errors.summ}
                  touched={!!touched.summ}
                  className={s.input_field_wrapper}
                  inputClassName={s.text_area}
                  autoComplete
                  type="text"
                  value={values?.summ}
                  onKeyDown={e => {
                    e.preventDefault()

                    if (
                      (e.keyCode >= 48 && e.keyCode <= 57) ||
                      (e.keyCode >= 96 && e.keyCode <= 105) ||
                      (e.key === ',' &&
                        !values.summ.includes(',') &&
                        !values.summ.includes('.') &&
                        Number(values.summ[0])) ||
                      (e.key === '.' &&
                        !values.summ.includes('.') &&
                        !values.summ.includes(',') &&
                        Number(values.summ[0]))
                    ) {
                      setFieldValue('summ', values.summ + e.key)
                    } else if (e.keyCode === 8 || e.keyCode === 46) {
                      setFieldValue('summ', values?.summ?.slice(0, -1))
                    }
                  }}
                />

                <p className={s.note}>
                  <span>*</span>
                  {t('The transfer amount will be debited from your balance')}
                </p>
              </div>

              <div className={s.btnBlock}>
                <Button
                  className={s.buyBtn}
                  isShadow
                  label={t('THANK YOU', { ns: 'support' })}
                  type="submit"
                />
                <button onClick={closeTipsModal} type="button" className={s.cancelBtn}>
                  {t('Cancel', { ns: 'other' })}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
