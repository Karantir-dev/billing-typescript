import { Form, Formik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, InputField, Modal } from '@components'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '@redux'
import cn from 'classnames'

import s from './PasswordChange.module.scss'

export default function PasswordChange({ id, names, closeModal, isOpen }) {
  const { t } = useTranslation(['vds', 'other', 'auth'])
  const [namesOpened, setNamesOpened] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const namesBlock = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!namesOpened) {
      namesBlock.current.style.height =
        namesBlock.current.firstElementChild.scrollHeight + 'px'
      !firstRender && namesBlock.current.firstElementChild.scrollIntoView()
    } else {
      const openedHeight =
        namesBlock.current.scrollHeight > 220
          ? 220 + 'px'
          : namesBlock.current.scrollHeight + 'px'
      namesBlock.current.style.height = openedHeight
    }
  }, [namesOpened])

  useEffect(() => {
    setFirstRender(false)
  }, [])

  const handleFormSubmit = values => {
    if (id.length > 1) {
      dispatch(vdsOperations.groupChangePassword(id, values.passwd, values.confirm))
    } else {
      dispatch(vdsOperations.changePassword(id[0], values.passwd, values.confirm))
    }
    closeModal()
  }

  const validationSchema = Yup.object().shape({
    passwd: Yup.string()
      .min(6, t('warnings.invalid_pass', { ns: 'auth', min: 8, max: 48 }))
      .max(48, t('warnings.invalid_pass', { ns: 'auth', min: 8, max: 48 }))
      .matches(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        t('warnings.invalid_pass', { ns: 'auth', min: 8, max: 48 }),
      )
      .required(t('warnings.password_required', { ns: 'auth' })),
    confirm: Yup.string()
      .oneOf([Yup.ref('passwd')], t('warnings.mismatched_password', { ns: 'auth' }))
      .required(t('warnings.mismatched_password', { ns: 'auth' })),
  })

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} className={s.modal}>
      <Modal.Header>
        <p className={s.title}>{t('password_change')}</p>
      </Modal.Header>
      <Modal.Body>
        <div className={s.names_wrapper}>
          <p className={cn(s.names_block, { [s.opened]: namesOpened })} ref={namesBlock}>
            {names.map((name, idx) => {
              return (
                <span className={s.name_item} key={name}>
                  {name}
                  {names.length - 1 === idx ? '' : ','}
                </span>
              )
            })}
          </p>

          {names.length > 1 && (
            <button
              className={s.btn_more}
              type="button"
              onClick={() => setNamesOpened(!namesOpened)}
            >
              {namesOpened
                ? t('collapse', { ns: 'other' })
                : t('and_more', { ns: 'other', value: names.length - 1 })}
            </button>
          )}
        </div>
        <p className={s.description}>{t('password_change_desc')}</p>
        <Formik
          initialValues={{ passwd: '', confirm: '' }}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
        >
          {({ errors, touched }) => {
            return (
              <Form id={id}>
                <div className={s.inputs_block}>
                  <InputField
                    inputClassName={s.input}
                    name="passwd"
                    isShadow
                    type="password"
                    label={`${t('new_password')}:`}
                    placeholder={t('new_password_placeholder')}
                    error={!!errors.passwd}
                    touched={!!touched.passwd}
                    isRequired
                    autoComplete="off"
                  />

                  <InputField
                    inputClassName={s.input}
                    name="confirm"
                    isShadow
                    type="password"
                    label={`${t('confirmation')}:`}
                    placeholder={t('confirmation_placeholder')}
                    error={!!errors.confirm}
                    touched={!!touched.confirm}
                    isRequired
                    autoComplete="off"
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer column>
        <Button
          className={s.btn_save}
          isShadow
          type="submit"
          label={t('Save', { ns: 'other' })}
          form={id}
        />
        <button className={s.btn_cancel} onClick={closeModal} type="button">
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
