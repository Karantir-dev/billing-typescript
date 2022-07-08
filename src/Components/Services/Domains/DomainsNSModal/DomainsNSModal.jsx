import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { InputField, Button } from '../../..'
import { Formik, Form } from 'formik'
import s from './DomainsNSModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, closeNSModalHandler, NSData, NSEditDomainHandler } = props

  const editHandler = values => {
    const data = { ...values, sok: 'ok' }
    NSEditDomainHandler(data)
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>
          {t('Name servers')} - {name}
        </span>
        <Cross onClick={closeNSModalHandler} className={s.crossIcon} />
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          ns0: NSData?.ns0 || '',
          ns1: NSData?.ns1 || '',
          ns2: NSData?.ns2 || '',
          ns3: NSData?.ns3 || '',
          ns_additional: NSData?.ns_additional || '',
        }}
        onSubmit={editHandler}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.formBlock}>
                  <div className={s.formFieldsBlock}>
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'ns0'}
                      label={`${t('NS')}:`}
                      placeholder={t('Enter text', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors['s0']}
                      touched={!!touched['ns0']}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'ns1'}
                      label={`${t('NS')}:`}
                      placeholder={t('Enter text', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors['ns1']}
                      touched={!!touched['ns1']}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'ns2'}
                      label={`${t('NS')}:`}
                      placeholder={t('Enter text', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors['ns2']}
                      touched={!!touched['ns2']}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'ns3'}
                      label={`${t('NS')}:`}
                      placeholder={t('Enter text', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors['ns3']}
                      touched={!!touched['ns3']}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name={'ns_additional'}
                      label={`${t('Additional NS')}:`}
                      placeholder={t('Enter text', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors['ns_additional']}
                      touched={!!touched['ns_additional']}
                    />
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
                <button onClick={closeNSModalHandler} type="button" className={s.cancel}>
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
