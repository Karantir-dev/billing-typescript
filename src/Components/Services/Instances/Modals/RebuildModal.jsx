import {
  Button,
  InputField,
  Modal,
  ConnectMethod,
  WarningMessage,
  PageTabBar,
  OsList,
} from '@components'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { generatePassword, getInstanceMainInfo } from '@utils'

import s from './Modals.module.scss'
import {
  DISALLOW_SPACE,
  PASS_REGEX,
  PASS_REGEX_ASCII,
  DISALLOW_PASS_SPECIFIC_CHARS,
  IMAGES_TYPES,
} from '@utils/constants'

const RESCUE_TABS_ORDER = [IMAGES_TYPES.public, IMAGES_TYPES.own, IMAGES_TYPES.shared]

export const RebuildModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'auth', 'other', 'vds'])
  const dispatch = useDispatch()

  const { displayName } = getInstanceMainInfo(item)

  const [data, setData] = useState()
  const allSshList = useSelector(cloudVpsSelectors.getAllSshList)

  const [isConnectMethodOpened, setIsConnectMethodOpened] = useState(false)

  const isRebuild = item.rebuild_action === 'rebuild'
  const isBootFromIso = item.rebuild_action === 'boot_from_iso'

  const select = isRebuild
    ? 'select_rebuild'
    : isBootFromIso
      ? 'select_boot_from_iso'
      : 'select_boot'

  const [state, setState] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { zone: IMAGES_TYPES.own },
  )

  const navSections = useMemo(() => {
    const zoneList = data?.slist.find(el => el.$name === 'zone')?.val.map(({ $ }) => $)

    /* Filter `RESCUE_TABS_ORDER` leaving only those that are present in `zoneList` */
    const filteredRescueTabsOrder = RESCUE_TABS_ORDER.filter(tab =>
      zoneList?.includes(tab),
    )

    setState({ zone: filteredRescueTabsOrder?.[0] })

    /* Combine the filtered `RESCUE_TABS_ORDER` and all unique elements from `zoneList` */
    const renderTabs = new Set([...filteredRescueTabsOrder, ...(zoneList || [])])

    return [...renderTabs]?.map(zone => ({
      label: t(`rescue_tab.${zone}`),
      allowToRender: true,
      localValue: zone,
      onLocalClick: () => {
        setState({ [select]: '', zone })

        setIsConnectMethodOpened(zone === IMAGES_TYPES.own ? false : true)
      },
    }))
  }, [data])

  const windowsOS = data?.slist
    ?.find(el => el.$name === select)
    ?.val.filter(el => el.$.includes('Windows'))

  const isWindowsOS = !!windowsOS?.find(el =>
    state[select] ? el.$key === state[select] : el.$key === data[select].$,
  )

  useEffect(() => {
    dispatch(
      cloudVpsOperations.rebuildInstance({
        action: item.rebuild_action,
        elid: item.id.$,
        successCallback: value => {
          setData(value)
          if (isRebuild) {
            const p_cnt = value?.slist.find(el => el.$name === 'ssh_keys')?.val.length
            dispatch(
              cloudVpsOperations.getSshKeys({
                p_cnt,
                setAllSshItems: list => dispatch(cloudVpsActions.setAllSshList(list)),
              }),
            )
          }
        },
        errorCallback: closeModal,
      }),
    )
  }, [])

  const validationSchema = Yup.object().shape({
    password:
      ((!isRebuild &&
        !isWindowsOS &&
        state.zone !== IMAGES_TYPES.shared &&
        !isBootFromIso) ||
        (isRebuild &&
          (state.passwordType === 'password' || isWindowsOS) &&
          state.zone === IMAGES_TYPES.public &&
          !isBootFromIso)) &&
      Yup.string()
        .min(8, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .max(48, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(PASS_REGEX_ASCII, t('warnings.invalid_ascii', { ns: 'auth' }))
        .matches(PASS_REGEX, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(DISALLOW_SPACE, t('warnings.disallow_space', { ns: 'auth' }))
        .matches(
          DISALLOW_PASS_SPECIFIC_CHARS,
          t('warnings.disallow_hash', { ns: 'auth' }),
        )
        .when('zone', {
          is: IMAGES_TYPES.public,
          then: schema =>
            schema.required(t('warnings.password_required', { ns: 'auth' })),
        }),
    password_type:
      isRebuild &&
      state.zone === IMAGES_TYPES.public &&
      Yup.string().required(t('Is a required field', { ns: 'other' })),
    ssh_keys:
      state.passwordType === 'ssh' &&
      Yup.string()
        .required(t('Is a required field', { ns: 'other' }))
        .test(
          'ssh_validate',
          t('Is a required field', { ns: 'other' }),
          value => value !== 'none',
        ),
    [select]: Yup.string().required(t('Is a required field', { ns: 'other' })),
  })

  useEffect(() => {
    setState({ ssh_keys: allSshList?.[0]?.fleio_key_uuid.$ })
  }, [allSshList])

  const changeOSHandler = value => {
    setState({ passwordType: '' })
    setState({ [select]: value })
  }

  return (
    <Modal isOpen={!!item && !!data} closeModal={closeModal} className={s.rebuild_modal}>
      <Modal.Header>
        <p>{t(`rebuild_modal.title.${item.rebuild_action}`)}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>
      </Modal.Header>
      <Modal.Body className={s.rebuild_modal__body}>
        <Formik
          enableReinitialize
          initialValues={{
            [select]: state?.[select],
            password: state.password || '',
            password_type: state.passwordType,
            ssh_keys: state.ssh_keys || allSshList?.[0]?.fleio_key_uuid.$,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const submitData = values
            submitData.zone = state.zone

            if (isRebuild) {
              submitData.enablessh = state.passwordType === 'ssh' ? 'on' : 'off'
            }

            if (isWindowsOS && !isRebuild) {
              submitData.password = generatePassword({
                length: 10,
                includeLowerCase: true,
                includeNumber: true,
                includeUpperCase: true,
              })
            }
            onSubmit(submitData)
          }}
        >
          {({ values, errors, touched }) => {
            const allImages = data?.slist?.find(el => el.$name === select)?.val

            const osListToRender = useMemo(
              () =>
                allImages?.filter(el => el.$depend === state.zone && el.$key !== 'null'),
              [state.zone],
            )

            return (
              <Form id={'rebuild'}>
                <div className={s.body}>
                  {isRebuild && (
                    <WarningMessage>
                      {t(`rebuild_modal.warning.${item.rebuild_action}`)}
                    </WarningMessage>
                  )}
                  <p className={s.body__text}>
                    {t(`rebuild_modal.text.${item.rebuild_action}`)}
                  </p>

                  <PageTabBar sections={navSections} activeValue={state.zone} />
                  <p>{t(`rebuild_modal.os_description.${state.zone}`)}</p>

                  <div>
                    <div className={s.rebuild__os_list}>
                      <OsList
                        value={values[select]}
                        list={osListToRender}
                        onOSchange={changeOSHandler}
                      />
                    </div>

                    {isWindowsOS && (
                      <WarningMessage>{t('windows_os_notice')}</WarningMessage>
                    )}

                    <ErrorMessage
                      className={s.error_message}
                      name={[select]}
                      component="span"
                    />
                  </div>

                  {isRebuild ? (
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
                        isWindows={isWindowsOS}
                        hiddenMode={state.zone === IMAGES_TYPES.own}
                        isOpened={isConnectMethodOpened}
                        setIsOpened={setIsConnectMethodOpened}
                      />
                      <ErrorMessage
                        className={s.error_message}
                        name="password_type"
                        component="span"
                      />
                    </div>
                  ) : isWindowsOS ? (
                    <WarningMessage>{t('windows_password_warning')}</WarningMessage>
                  ) : state.zone === IMAGES_TYPES.public && !isBootFromIso ? (
                    <InputField
                      className={s.rescue_pass_input}
                      name="password"
                      isShadow
                      type="password"
                      label={`${t('temp_password', { ns: 'cloud_vps' })}:`}
                      placeholder={t('new_password_placeholder', { ns: 'vds' })}
                      error={!!errors.password}
                      touched={!!touched.password}
                      isRequired={state.zone === IMAGES_TYPES.public}
                      autoComplete="off"
                      onChange={e => setState({ password: e.target.value })}
                      generatePasswordValue={value => setState({ password: value })}
                    />
                  ) : null}
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
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
