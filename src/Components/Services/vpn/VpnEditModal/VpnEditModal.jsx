import { useTranslation } from 'react-i18next'
import { Select, Button, InputField, Modal } from '@components'
import { Formik, Form } from 'formik'
import { translatePeriod } from '@utils'
import s from './VpnEditModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other', 'domains', 'autoprolong'])

  const { closeModal, editData, sendEditSiteCareHandler, editSiteCareHandler, isOpen } =
    props

  const editHandler = values => {
    const data = { ...values, sok: 'ok' }
    sendEditSiteCareHandler(data, editData?.sitecare_id)
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal}>
      <Modal.Header>
        <span className={s.headerText}>{t('Service editing', { ns: 'domains' })}</span>
      </Modal.Header>
      <Modal.Body>
        <div className={s.statusBlock}>
          <div className={s.statusItem}>
            <span>{t('The service is active until')}:</span>
            <span>{editData?.createdate}</span>
          </div>
          <div className={s.statusItem}>
            <span>{t('Service extended until')}:</span>
            <span>{editData?.expiredate}</span>
          </div>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            autoprolong: editData?.autoprolong || '',
            stored_method: editData?.stored_method || '',
            vpn_password: editData?.vpn_password || '',
            vpn_username: editData?.vpn_username || '',
          }}
          onSubmit={editHandler}
        >
          {({ setFieldValue, values, errors, touched }) => {
            return (
              <Form id="vpn-edit">
                <div className={s.fieldsBlock}>
                  <Select
                    label={`${t('Auto renewal', { ns: 'domains' })}:`}
                    placeholder={t('Not selected')}
                    value={values.autoprolong}
                    getElement={item => {
                      setFieldValue('autoprolong', item)
                      editSiteCareHandler(editData?.sitecare_id, { autoprolong: item })

                      setFieldValue(
                        'stored_method',
                        item && item !== 'null'
                          ? editData?.stored_method_list[0]?.$key
                          : null,
                      )
                    }}
                    isShadow
                    itemsList={editData?.autoprolong_list?.map(({ $key, $ }) => ({
                      label: translatePeriod($, $key, t),
                      value: $key,
                    }))}
                    className={s.select}
                  />

                  {values?.autoprolong && values?.autoprolong !== 'null' && (
                    <Select
                      label={`${t('Payment method', { ns: 'domains' })}:`}
                      placeholder={t('Not selected')}
                      value={values.stored_method}
                      getElement={item => setFieldValue('stored_method', item)}
                      isShadow
                      itemsList={editData?.stored_method_list?.map(({ $key, $ }) => ({
                        label: $.trim(),
                        value: $key,
                      }))}
                      className={s.select}
                    />
                  )}
                  <InputField
                    inputWrapperClass={s.inputHeight}
                    name={'vpn_username'}
                    label={`${t('Login')}:`}
                    disabled
                    isShadow
                    className={s.input}
                    error={!!errors.loginServer}
                    touched={!!touched.loginServer}
                  />
                  <InputField
                    inputWrapperClass={s.inputHeight}
                    name={'vpn_password'}
                    label={`${t('Password')}:`}
                    isShadow
                    className={s.input}
                    error={!!errors.passwordServer}
                    touched={!!touched.passwordServer}
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer column>
        <Button
          className={s.searchBtn}
          isShadow
          size="medium"
          label={t('Save', { ns: 'other' })}
          type="submit"
          form="vpn-edit"
        />
        <button onClick={closeModal} type="button" className={s.clearFilters}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
