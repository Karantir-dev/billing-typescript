import { Button, InputField, Modal, WarningMessage, WeekdaySelector } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'
import { getInstanceMainInfo } from '@utils'
import { TIME_REGEX } from '@utils/constants'

const convertDaysStringToArray = daysString => {
  const daysMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }

  return daysString
    .trim()
    .split(' ')
    .map(day => daysMap[day])
}

export const CreateEditBackupsSchedules = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const itemDetails = item?.backup_schedule_create || item?.backup_schedule_edit

  const editItemDetails = item?.backup_schedule_edit

  const { displayName } = getInstanceMainInfo(itemDetails)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
    rotation_time: Yup.string()
      .matches(TIME_REGEX, t('Invalid time format', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
    rotation_days: Yup.array()
      .of(Yup.number())
      .min(1, t('At least one day must be selected', { ns: 'other' })),
  })

  return (
    <Modal isOpen={!!itemDetails} closeModal={closeModal}>
      <Modal.Header>
        <p>
          {t(`schedule_backups${item?.backup_schedule_create ? '.create' : '.edit'}`)}
        </p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>

        <WarningMessage>{t('schedule_backups.warning')}</WarningMessage>

        <Formik
          initialValues={{
            name: editItemDetails?.name?.$ || '',
            rotation_time: editItemDetails?.rotation_time?.$ || '',
            rotation_days: editItemDetails?.rotation_days?.$
              ? convertDaysStringToArray(editItemDetails.rotation_days.$)
              : [],
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit({
              values: {
                name: values.name.trim(),
                rotation_days: values?.rotation_days.join(','),
                rotation_time: values?.rotation_time,
                plid: editItemDetails?.instance_id?.$ || itemDetails?.id?.$,
                elid: editItemDetails?.id?.$ || '',
                sok: 'ok',
              },
            })
          }}
        >
          {({ values, setFieldValue, errors, touched }) => {
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

                  <div className={s.backup_schedules}>
                    <WeekdaySelector
                      name="rotation_days"
                      selectedDays={values.rotation_days}
                      setSelectedDays={days => setFieldValue('rotation_days', days)}
                      isRequired
                    />

                    <InputField
                      inputClassName={s.input}
                      labelTooltip={t('rotation_time_descr', { ns: 'cloud_vps' })}
                      labelTooltipPlace="top-start"
                      name="rotation_time"
                      type="time"
                      label={`${t('time', { ns: 'other' })} (GMT+3):`}
                      placeholder={'14:25'}
                      error={!!errors.rotation_time}
                      touched={!!touched.rotation_time}
                      isRequired
                      isShadow
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer className={s.snapshot_create__footer_wrapper}>
        <div className={s.snapshot_create__buttons_wrapper}>
          <Button
            label={t(editItemDetails ? 'edit' : 'create')}
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
