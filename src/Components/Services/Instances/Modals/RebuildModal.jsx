import {
  Button,
  InputField,
  Modal,
  ConnectMethod,
  SoftwareOSBtn,
  SoftwareOSSelect,
  WarningMessage,
  PageTabBar,
} from '@components'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { generatePassword } from '@utils'

import s from './Modals.module.scss'
import { DISALLOW_SPACE, PASS_REGEX, PASS_REGEX_ASCII } from '@utils/constants'

const RESCUE_TABS_ORDER = ['shr', 'pub']

export const RebuildModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'auth', 'other', 'vds'])
  const dispatch = useDispatch()

  const [data, setData] = useState()
  const allSshList = useSelector(cloudVpsSelectors.getAllSshList)

  const [state, setState] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { zone: 'shr' },
  )

  const isRebuild = item.rebuild_action === 'rebuild'
  const select = isRebuild ? 'select_rebuild' : 'select_boot'
  const depends = isRebuild ? 'image' : state.zone

  const navSections = useMemo(() => {
    const zoneList = data?.slist.find(el => el.$name === 'zone')?.val.map(({ $ }) => $)
    const renderTabs = new Set([...RESCUE_TABS_ORDER, ...(zoneList || [])])

    return [...renderTabs]?.map(zone => ({
      label: t(`rescue_tab.${zone}`),
      allowToRender: true,
      localValue: zone,
      onLocalClick: () => {
        setState({ [select]: '', zone })
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

  const renderSoftwareOSFields = (fieldName, current, depends) => {
    const changeOSHandler = value => {
      setState({ passwordType: '' })
      setState({ [fieldName]: value })
    }

    let dataArr = data?.slist?.find(el => el.$name === fieldName)?.val

    const elemsData = {}
    dataArr = dataArr?.filter(el => el.$depend === depends && el.$key !== 'null')

    dataArr?.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData).map(([name, el]) => {
      if (el.length > 1) {
        const optionsList = el.map(({ $key, $ }) => ({
          value: $key,
          label: $,
        }))

        return (
          <SoftwareOSSelect
            key={optionsList[0].value}
            iconName={name.toLowerCase()}
            svgIcon={name}
            itemsList={optionsList}
            state={current}
            getElement={item => changeOSHandler(item)}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            value={el[0].$key}
            state={current}
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={item => changeOSHandler(item)}
            svgIcon={name}
          />
        )
      }
    })
  }

  const validationSchema = Yup.object().shape({
    password:
      ((!isRebuild && !isWindowsOS) ||
        (isRebuild && (state.passwordType === 'password' || isWindowsOS))) &&
      Yup.string()
        .min(8, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .max(48, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(PASS_REGEX_ASCII, t('warnings.invalid_ascii', { ns: 'auth' }))
        .matches(PASS_REGEX, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
        .matches(DISALLOW_SPACE, t('warnings.disallow_space', { ns: 'auth' }))
        .required(t('warnings.password_required', { ns: 'auth' })),
    password_type:
      isRebuild && Yup.string().required(t('Is a required field', { ns: 'other' })),
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
    setState({ ssh_keys: allSshList?.[0]?.fotbokeyid.$ })
  }, [allSshList])

  return (
    <Modal isOpen={!!item && !!data} closeModal={closeModal} className={s.rebuild_modal}>
      <Modal.Header>
        <p>{t(`rebuild_modal.title.${item.rebuild_action}`)}</p>
      </Modal.Header>
      <Modal.Body className={s.rebuild_modal__body}>
        <Formik
          enableReinitialize
          initialValues={{
            [select]: state?.[select],
            password: state.password || '',
            password_type: state.passwordType,
            ssh_keys: state.ssh_keys || allSshList?.[0]?.fotbokeyid.$,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const submitData = values
            if (isRebuild) {
              submitData.enablessh = state.passwordType === 'ssh' ? 'on' : 'off'
            }
            if (!isRebuild) {
              submitData.zone = state.zone
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
                  {!isRebuild && (
                    <PageTabBar sections={navSections} activeValue={state.zone} />
                  )}
                  <div>
                    <div className={s.rebuild__os_list}>
                      {renderSoftwareOSFields(select, values[select], depends)}
                    </div>
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
                          value: el.fotbokeyid.$,
                        }))}
                        sshKey={values.ssh_keys}
                        isWindows={isWindowsOS}
                      />
                      <ErrorMessage
                        className={s.error_message}
                        name="password_type"
                        component="span"
                      />
                    </div>
                  ) : isWindowsOS ? (
                    <WarningMessage>{t('windows_password_warning')}</WarningMessage>
                  ) : (
                    <InputField
                      inputClassName={s.input}
                      name="password"
                      isShadow
                      type="password"
                      label={`${t('new_password', { ns: 'vds' })}:`}
                      placeholder={t('new_password_placeholder', { ns: 'vds' })}
                      error={!!errors.password}
                      touched={!!touched.password}
                      isRequired
                      autoComplete="off"
                      onChange={e => setState({ password: e.target.value })}
                      generatePasswordValue={value => setState({ password: value })}
                    />
                  )}
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