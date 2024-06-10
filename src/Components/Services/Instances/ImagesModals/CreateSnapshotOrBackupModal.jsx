import {
  Button,
  InputField,
  Modal,
  WarningMessage,
  // Icon,
} from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'
import { getInstanceMainInfo } from '@utils'

export const CreateSnapshotOrBackupModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const { displayName } = getInstanceMainInfo(item)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal}>
      <Modal.Header>
        <p>{t('snapshots.create')}</p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>

        <WarningMessage>{t('snapshots.create_warning')}</WarningMessage>

        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            if (values.name === '') return closeModal()
            onSubmit({
              values: { name: values.name.trim() },
              closeModal,
            })
          }}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'create_image'}>
                <div>
                  <InputField
                    inputClassName={s.input}
                    name="name"
                    isShadow
                    label={`${t('name', { ns: 'vds' })}:`}
                    placeholder={t('server_placeholder', { ns: 'vds' })}
                    error={!!errors.name}
                    touched={!!touched.name}
                    isRequired
                    autoComplete="off"
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer className={s.snapshot_create__footer_wrapper}>
        <div className={s.snapshot_create__footer_block}>
          <p className={s.tariff__param_name}>{t('Price')}</p>
          <p>0.00 / GB / day</p>
        </div>

        <div className={s.snapshot_create__buttons_wrapper}>
          <Button
            label={t('create')}
            size={'large'}
            type="submit"
            form={'create_image'}
            isShadow
          />
          <button type="button" className={s.cancel_btn} onClick={closeModal}>
            {t('Cancel')}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
