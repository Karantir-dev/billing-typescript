import { Button, Modal, ConnectMethod, WarningMessage } from '@components'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'

import s from './ImagesModals.module.scss'
import {
  DISALLOW_SPACE,
  PASS_REGEX,
  PASS_REGEX_ASCII,
  DISALLOW_PASS_SPECIFIC_CHARS,
  IMAGES_TYPES,
} from '@utils/constants'

export const RestoreModal = ({ item, closeModal, onSubmit, instanceId }) => {
  const { t } = useTranslation(['cloud_vps', 'auth', 'other', 'vds'])
  const dispatch = useDispatch()
  const [isConnectOpened, setIsConnectOpened] = useState(false)
  const allSshList = useSelector(cloudVpsSelectors.getAllSshList)
  const isWindows = item.os_distro?.$.toLowerCase().includes('windows')

  const [state, setState] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { zone: IMAGES_TYPES.own },
  )

  useEffect(() => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'image',
        elid: item.elid.$,
        successCallback: data => {
          const select_rebuild = data.fleio_id.$
          setState({ select_rebuild })
        },
      }),
    )
    dispatch(
      cloudVpsOperations.rebuildInstance({
        action: 'rebuild',
        elid: instanceId,
        successCallback: value => {
          const p_cnt = value?.slist.find(el => el.$name === 'ssh_keys')?.val.length
          dispatch(
            cloudVpsOperations.getSshKeys({
              p_cnt,
              setAllSshItems: list => dispatch(cloudVpsActions.setAllSshList(list)),
            }),
          )
        },
        errorCallback: closeModal,
      }),
    )
  }, [])

  useEffect(() => {
    setState({ ssh_keys: allSshList?.[0]?.fleio_key_uuid.$ })
  }, [allSshList])

  useEffect(() => {
    if (!isConnectOpened) {
      setState({ passwordType: '' })
    }
  }, [isConnectOpened])

  const validationSchema = Yup.object().shape({
    password:
      state.passwordType === 'password' &&
      Yup.string()
        .required(t('Is a required field', { ns: 'other' }))
        .min(8, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .max(48, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(PASS_REGEX_ASCII, t('warnings.invalid_ascii', { ns: 'auth' }))
        .matches(PASS_REGEX, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(DISALLOW_SPACE, t('warnings.disallow_space', { ns: 'auth' }))
        .matches(
          DISALLOW_PASS_SPECIFIC_CHARS,
          t('warnings.disallow_hash', { ns: 'auth' }),
        ),

    ssh_keys:
      state.passwordType === 'ssh' &&
      Yup.string()
        .required(t('Is a required field', { ns: 'other' }))
        .test(
          'ssh_validate',
          t('Is a required field', { ns: 'other' }),
          value => value !== 'none',
        ),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal} className={s.restore_modal}>
      <Modal.Header>
        <p>{t('rebuild_modal.title.restore')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{item.name.$}</span>
        </p>
      </Modal.Header>
      <Modal.Body className={s.restore_modal__body}>
        <Formik
          enableReinitialize
          initialValues={{
            select_rebuild: state.select_rebuild,
            password: state.password || '',
            password_type: state.passwordType,
            ssh_keys: state.ssh_keys || allSshList?.[0]?.fleio_key_uuid.$,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const submitData = values
            submitData.enablessh = state.passwordType === 'ssh' ? 'on' : 'off'
            onSubmit(submitData)
          }}
        >
          {({ values, errors, touched }) => {
            return (
              <Form id={'rebuild'}>
                <div className={s.body}>
                  <WarningMessage>{t('rebuild_modal.warning.rebuild')}</WarningMessage>
                  <div>
                    <ConnectMethod
                      connectionType={state.passwordType}
                      onChangeType={type => setState({ passwordType: type })}
                      setSSHkey={value => setState({ ssh_keys: value })}
                      setPassword={value => setState({ password: value })}
                      errors={errors}
                      touched={touched}
                      sshList={allSshList.map(el => ({
                        label: el.comment.$,
                        value: el.fleio_key_uuid.$,
                      }))}
                      sshKey={values.ssh_keys}
                      hiddenMode
                      isOpened={isConnectOpened}
                      setIsOpened={setIsConnectOpened}
                      isWindows={isWindows}
                    />
                    <ErrorMessage
                      className={s.error_message}
                      name="password_type"
                      component="span"
                    />
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm')}
          size="small"
          type="submit"
          form={'rebuild'}
          isShadow
        />
        <button type="button" onClick={closeModal} className={s.cancel_btn}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
