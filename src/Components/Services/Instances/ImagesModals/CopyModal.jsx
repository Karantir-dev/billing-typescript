import {
  Button,
  InputField,
  Modal,
  Select,
  CheckBox,
  // Icon,
} from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'

import { useState } from 'react'

export const CopyModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
  })

  const [isShouldDelete, setIsShouldDelete] = useState(false)

  return (
    <Modal isOpen={!!item} closeModal={closeModal}>
      <Modal.Header>
        <p>{t('copy modal title')}</p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '', shouldDeleteSource: false /*,dataCenter*/ }}
          validationSchema={validationSchema}
          onSubmit={values => {
            if (values.name === '') return closeModal()
            onSubmit({
              values: { name: values.name.trim() /*dataCenter, shouldDeleteSource*/ },
              closeModal,
            })
          }}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'create_image_copy'}>
                <div className={s.copy_modal__wrapper}>
                  {/* Doesn't work at all, not yet */}
                  <Select
                    className={s.sort_select}
                    placeholder={t('select dc')}
                    label={`${t('select dc')}:`}
                    name={'dataCenter'}
                    isShadow
                    itemsList={['1', '2', '3'].map(el => {
                      return {
                        el,
                      }
                    })}
                    itemIcon
                    getElement={'smth'}
                    // value={'1'}
                    disableClickActive={false}
                  />

                  <InputField
                    className={s.copy_modal__input_wrapper}
                    name="name"
                    isShadow
                    label={`${t('name', { ns: 'vds' })}:`}
                    placeholder={t('server_placeholder', { ns: 'vds' })}
                    error={!!errors.name}
                    touched={!!touched.name}
                    isRequired
                    autoComplete="off"
                  />

                  <div className={s.copy_modal__checkbox_wrapper}>
                    <CheckBox
                      value={isShouldDelete}
                      id={'shouldDeleteSource'}
                      name={'shouldDeleteSource'}
                      onClick={() => setIsShouldDelete(!isShouldDelete)}
                      className={s.checkbox}
                    />
                    <label htmlFor="shouldDeleteSource">
                      Delete source image (move image)
                    </label>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer className={s.copy_modal__footer_wrapper}>
        <button type="button" className={s.cancel_btn} onClick={closeModal}>
          {t('Cancel')}
        </button>
        <Button
          label={t('create')}
          size={'large'}
          type="submit"
          form={'create_image_copy'}
          isShadow
        />
      </Modal.Footer>
    </Modal>
  )
}
