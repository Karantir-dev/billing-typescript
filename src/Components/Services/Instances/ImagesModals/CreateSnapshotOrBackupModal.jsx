import { Button, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'
import { getInstanceMainInfo } from '@utils'

export const CreateSnapshotOrBackupModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const itemDetails =
    item?.snapshot_create || item?.backup_create || item?.backup_schedule_create
  const { displayName } = getInstanceMainInfo(itemDetails)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
  })

  const type = item?.snapshot_create ? 'snapshot' : 'backup'

  return (
    <Modal isOpen={!!itemDetails} closeModal={closeModal}>
      <Modal.Header>
        <p>{t(`${type}.create`)}</p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>

        <WarningMessage>{t(`${type}.create_warning`)}</WarningMessage>

        <Formik
          initialValues={{ name: '', rotation_time: '', rotation_days: [] }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit({
              values: {
                name: values.name.trim(),
                rotation_days: values.rotation_days.join(','),
                rotation_time: values.rotation_time,
                plid: itemDetails.id.$,
                sok: 'ok',
              },
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
                    label={`${t(`image.name.${type}`)}:`}
                    placeholder={t(`image.name.${type}`)}
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
          <p>
            {itemDetails?.stat_cost?.$} EUR / GB / {t('day')}
          </p>
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
