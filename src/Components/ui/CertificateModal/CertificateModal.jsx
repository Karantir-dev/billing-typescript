import { useTranslation } from 'react-i18next'
import s from './CertificateModal.module.scss'
import { Cross, Info, Attention } from '@images'
import { Button, InputField } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { billingOperations } from '@redux'
import { useDispatch } from 'react-redux'

export default function CertificateModal({ closeModal }) {
  const { t } = useTranslation(['container', 'other'])
  const dispatch = useDispatch()
  const [isNotExist, setIsNotExist] = useState(false)

  const validationSchema = Yup.object().shape({
    certificate_code: Yup.string()
      .matches(/^[A-Z0-9]+$/, t('certificate_matches_error', { ns: 'other' }))
      .required(t('enter_certificate_code', { ns: 'other' })),
  })

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>{t('profile.use_certificate')}</span>
          <Cross className={s.crossIcon} onClick={closeModal} />
        </div>
        <Formik
          enableReinitialize
          validateOnMount={false}
          validationSchema={validationSchema}
          initialValues={{
            certificate_code: '',
          }}
          onSubmit={values => {
            dispatch(
              billingOperations.useCertificate({
                coupon: values.certificate_code,
                errorFunc: () => setIsNotExist(true),
                successFunc: () => closeModal()
              }),
            )
          }}
        >
          {({ errors, touched }) => {
            return (
              <Form>
                <div className={s.form}>
                  <div className={s.formBlock}>
                    <div className={s.nsInputBlock}>
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="certificate_code"
                        label={`${t('certificate_code', { ns: 'other' })}:`}
                        placeholder={t('enter_certificate_code', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.certificate_code}
                        touched={!!touched.certificate_code}
                        inputClassName={s.field}
                      />
                      <button type="button" className={s.infoBtn}>
                        <Info />
                        <div className={s.descriptionBlock}>
                          {t('enter_certificate_code', { ns: 'other' })}
                        </div>
                      </button>
                    </div>
                    <div className={s.not_exist}>
                      {isNotExist && (
                        <p className={s.not_exist__content}>
                          <Attention />
                          {t('certificate_not_exist', { ns: 'other' })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={s.btnBlock}>
                  <Button
                    className={s.saveBtn}
                    isShadow
                    size="medium"
                    label={t('Save', { ns: 'other' })}
                    type="submit"
                  />
                  <button onClick={closeModal} type="button" className={s.cancel}>
                    {t('Cancel', { ns: 'other' })}
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}
