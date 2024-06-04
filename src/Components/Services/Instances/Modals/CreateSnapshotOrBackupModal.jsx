import {
  Button,
  InputField,
  Modal,
  WarningMessage,
  Icon,
  TooltipWrapper,
} from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import { getInstanceMainInfo } from '@utils'

export const CreateSnapshotOrBackupModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const { displayName } = getInstanceMainInfo(item)

  const validationSchema = Yup.object().shape({
    display_name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
  })

  console.log('Item: ', item)

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
          initialValues={{ display_name: '' }}
          validationSchema={validationSchema}
          // uncomment and mb modify code below later

          // onSubmit={values => {
          //   if (values.display_name === '') return closeModal()
          //   onSubmit({ value: values.display_name, elid: item.id.$, closeModal })
          // }}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'create_image'}>
                <div>
                  <InputField
                    inputClassName={s.input}
                    name="display_name"
                    isShadow
                    label={`${t('name', { ns: 'vds' })}:`}
                    placeholder={t('server_placeholder', { ns: 'vds' })}
                    error={!!errors.display_name}
                    touched={!!touched.display_name}
                    isRequired
                    autoComplete="off"
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <div className={s.snapshot_create__footer_wrapper}>
          <div className={s.snapshot_create__footer_block}>
            <div className={s.snapshot_create__field_wrapper}>
              <p className={s.tariff__param_name}>Setup price</p>
              <TooltipWrapper
                wrapperClassName={s.infoBtnCard}
                anchor={'setup_price_hint'}
                content={t('here will be some text')}
              >
                <Icon name="Info" />
              </TooltipWrapper>
            </div>
            <p>0.00</p>

            <div className={s.field_wrapper}>
              <p className={s.tariff__param_name}>Price</p>
            </div>
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
            <button type="button" onClick={closeModal}>
              {t('Cancel')}
            </button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
