/* eslint-disable no-unused-vars */
import {
  Button,
  Icon,
  InputField,
  Modal,
  PasswordMethod,
  SoftwareOSBtn,
  SoftwareOSSelect,
  WarningMessage,
} from '@components'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'

export const RebuildModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [data, setData] = useState()

  const [state, setState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const isRebuild = item.rebuild_action === 'rebuild'

  const sshList = isRebuild ? data?.slist.find(el => el.$name === 'ssh_keys')?.val : null

  const select = isRebuild ? 'select_rebuild' : 'select_boot'
  const depends = isRebuild ? 'image' : 'pub'

  const windowsOS = data?.slist
    ?.find(el => el.$name === select)
    ?.val.filter(el => el.$.includes('Windows'))

  useEffect(() => {
    dispatch(
      cloudVpsOperations.rebuildInstance({
        action: item.rebuild_action,
        elid: item.id.$,
        successCallback: setData,
        errorCallback: closeModal,
      }),
    )
  }, [])

  const renderSoftwareOSFields = (fieldName, current, depends) => {
    const changeOSHandler = value => setState({ [fieldName]: value })

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
      (!isRebuild || state.passwordType === 'password') &&
      Yup.string()
        .min(6, t('warnings.invalid_pass', { ns: 'auth', min: 6, max: 48 }))
        .max(48, t('warnings.invalid_pass', { ns: 'auth', min: 6, max: 48 }))
        .matches(
          /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
          t('warnings.invalid_pass', { ns: 'auth', min: 6, max: 48 }),
        )
        .required(t('warnings.password_required', { ns: 'auth' })),
    password_type:
      isRebuild && Yup.string().required(t('warnings.password_required', { ns: 'auth' })),
    ssh_keys:
      state.passwordType === 'ssh' &&
      Yup.string()
        .required(t('warnings.password_required', { ns: 'auth' }))
        .test('ssh_validate', t('warnings.password_required'), value => value !== 'none'),
  })

  return (
    <Modal
      isOpen={!!item && !!data}
      closeModal={closeModal}
      isClickOutside
      className={s.rebuild_modal}
    >
      <Modal.Header>
        <p>Rebuild</p>
      </Modal.Header>
      <Modal.Body className={s.rebuild_modal__body}>
        <Formik
          enableReinitialize
          initialValues={{
            [select]: state?.[select] || data?.[select]?.$,
            password: state.password || '',
            password_type: state.passwordType,
            ssh_keys: state.ssh_keys || sshList?.[0].$key,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const submitData = values
            if (isRebuild) {
              submitData.enablessh = state.passwordType === 'ssh' ? 'on' : 'off'
            }
            onSubmit(submitData)
          }}
        >
          {({ values, errors, touched }) => {
            const isWindowsOS = !!windowsOS.find(el => el.$key === values[select])

            return (
              <Form id={'rebuild'}>
                <div className={s.body}>
                  {isRebuild && (
                    <WarningMessage>
                      All data currently on the instance disk will be permanently deleted.
                    </WarningMessage>
                  )}
                  <p className={s.body__text}>Select boot source</p>
                  <div className={s.rebuild__os_list}>
                    {renderSoftwareOSFields(select, values[select], depends)}
                  </div>

                  {isWindowsOS ? (
                    <WarningMessage>
                      Please create an instance and go to the console to set a password
                    </WarningMessage>
                  ) : (
                    <>
                      {isRebuild ? (
                        <div>
                          <PasswordMethod
                            state={state}
                            setState={setState}
                            errors={errors}
                            touched={touched}
                            sshList={sshList.map(el => ({
                              label: el.$,
                              value: el.$key,
                            }))}
                            values={values}
                          />
                          <ErrorMessage
                            className={s.error_message}
                            name="password_type"
                            component="span"
                          />
                        </div>
                      ) : (
                        <InputField
                          inputClassName={s.input}
                          name="password"
                          isShadow
                          type="password"
                          label={`${t('new_password')}:`}
                          placeholder={t('new_password_placeholder')}
                          error={!!errors.password}
                          touched={!!touched.password}
                          isRequired
                          autoComplete="off"
                        />
                      )}
                    </>
                  )}
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={isRebuild ? 'Rebuild' : 'Rescue'}
          size="small"
          type="submit"
          form={'rebuild'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
