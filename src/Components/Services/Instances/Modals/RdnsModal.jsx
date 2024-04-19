import { Button, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import { getInstanceMainInfo, DOMAIN_SPECIAL_CHARACTERS_REGEX } from '@utils'

export const RdnsModal = args => {
  const { item, closeModal, onSubmit } = args
  const { t } = useTranslation(['cloud_vps', 'vds', 'domains', 'other'])
  const { displayName } = getInstanceMainInfo(item)

  const validationSchema = Yup.object().shape({
    rdns_record: Yup.string().matches(
      DOMAIN_SPECIAL_CHARACTERS_REGEX,
      t('warning_domain', { ns: 'vds' }),
    ),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal}>
      <Modal.Header>
        <p>{item?.rdns_record ? 'rDNS' : t('create_rdns_title')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ rdns_record: item?.rdns_record || '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            if (
              values.rdns_record === item?.rdns_record ||
              (values.rdns_record === '' && !item.rdns_record)
            )
              return closeModal()
            onSubmit({ value: values.rdns_record, elid: item.id.$, closeModal })
          }}
        >
          {({ errors, touched }) => (
            <Form id={'edit_rdns_form'}>
              <div>
                <InputField
                  inputClassName={s.input}
                  name="rdns_record"
                  isShadow
                  label={`${t('Domain name', { ns: 'domains' })}:`}
                  placeholder={'example.com'}
                  error={!!errors.rdns_record}
                  touched={!!touched.rdns_record}
                  autoComplete="off"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm')}
          size={'large'}
          type="submit"
          form={'edit_rdns_form'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
