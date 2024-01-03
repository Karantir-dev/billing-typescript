import { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  InputField,
  Button,
  Select,
  SocialButton,
  ModalTwoStepVerification,
  Icon,
  CheckBox,
} from '@components'
import { Form, Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  settingsSelectors,
  settingsOperations,
  userSelectors,
  authOperations,
  authSelectors,
} from '@redux'
import { ipRegex } from '@utils'
import * as Yup from 'yup'
import * as routes from '@src/routes'
import s from './AccessSettings.module.scss'
import { toast } from 'react-toastify'

export default function Component({ isComponentAllowedToEdit }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation(['user_settings', 'other', 'auth'])
  const location = useLocation()
  const existingSocial = location?.state?.isCurrentSocialExist

  const userParams = useSelector(settingsSelectors.getUserParams)
  const twoStepVerif = useSelector(settingsSelectors.getTwoStepVerif)
  const userInfo = useSelector(userSelectors.getUserInfo)
  const geoData = useSelector(authSelectors.getGeoData)
  const clientCountryId = geoData.clients_country_id

  const [isModal, setIsModal] = useState(false)

  const setSettingsHandler = (values, { setFieldValue }) => {
    dispatch(settingsOperations?.setPasswordAccess(userInfo?.$id, values, setFieldValue))
  }
  const handleSocialLinkClick = values => {
    dispatch(settingsOperations?.changeSocialLinkStatus(userInfo?.$id, values))
  }

  const validationSchema = Yup.object().shape({
    passwd: Yup.string()
      .min(12, t('warnings.invalid_pass', { ns: 'auth', min: 12, max: 48 }))
      .max(48, t('warnings.invalid_pass', { ns: 'auth', min: 12, max: 48 }))
      .matches(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        t('Password must contain at least one uppercase and lowercase letter', {
          ns: 'other',
        }),
      ),
    confirm: Yup.string().oneOf(
      [Yup.ref('passwd')],
      t('Passwords do not match', { ns: 'other' }),
    ),
    disable_totp: Yup.string().min(
      6,
      t('Password must contain at least 6 characters', { ns: 'other' }),
    ),
  })

  const onKeyDown = keyEvent => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault()
    }
  }

  const openTwoStepVerifHandler = () => {
    dispatch(settingsOperations?.setTotp())
    setIsModal(true)
  }

  useEffect(() => {
    if (existingSocial === 'denied') {
      toast.error(t('existing social network'), {
        position: 'bottom-right',
        toastId: 'customId',
      })
    } else if (existingSocial === 'success') {
      toast.success(t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
    }

    navigate(routes?.USER_SETTINGS + '/access', { replace: true })
  }, [])

  return (
    <>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          old_passwd: '',
          passwd: '',
          confirm: '',
          atype: userParams?.atype || '',

          atallowIp: '',
          allowIpList: userParams?.addr?.length > 0 ? userParams?.addr?.split(' ') : [],
          disable_totp: '',
          vkontakte_status: userParams?.vkontakte_status || '',
          facebook_status: userParams?.facebook_status || '',
          google_status: userParams?.google_status || '',
          secureip: userParams?.secureip === 'on',
        }}
        onSubmit={setSettingsHandler}
      >
        {({ errors, touched, values, setFieldValue, setFieldError, setFieldTouched }) => {
          const addIpHandler = event => {
            setFieldTouched('atallowIp', true, false)
            if (event.key === 'Enter') {
              if (values.allowIpList.indexOf(event.target.value) != -1) {
                setFieldError('atallowIp', `${t('Value cannot be repeated')}`)
                return
              }

              if (ipRegex().test(event.target.value)) {
                setFieldValue('atallowIp', '')
                setFieldValue(
                  'allowIpList',
                  values.allowIpList.concat(event.target.value),
                )
                return
              }

              return setFieldError(
                'atallowIp',
                `${t('You have entered an invalid IP address')}`,
              )
            }
          }

          const addIpHandlerPlus = () => {
            setFieldTouched('atallowIp', true, false)
            if (values.allowIpList.indexOf(values?.atallowIp) != -1) {
              setFieldError('atallowIp', `${t('Value cannot be repeated')}`)
              return
            }

            if (ipRegex().test(values?.atallowIp)) {
              setFieldValue('atallowIp', '')
              setFieldValue('allowIpList', values.allowIpList.concat(values?.atallowIp))
              return
            }

            return setFieldError(
              'atallowIp',
              `${t('You have entered an invalid IP address')}`,
            )
          }

          const deleteIpHandler = index => {
            let newArr = values.allowIpList
              .slice(0, index)
              .concat(values.allowIpList.slice(index + 1, values.allowIpList.length))
            setFieldValue('allowIpList', newArr)
          }

          const { google_status, facebook_status, vkontakte_status } = values
          const socialState = { google_status, facebook_status, vkontakte_status }

          const onInputItemsChange = text => {
            let value = text.replace(/\D/g, '')
            if (value.length === 0) {
              value = ''
            }
            setFieldValue('disable_totp', value)
          }

          return (
            <Form onKeyDown={onKeyDown} className={s.personalBlock}>
              <div className={s.block}>
                <h2 className={s.settingsTitle}>{t('Change Password')}</h2>
                <div className={cn(s.formRow, s.passwordsColumn)}>
                  <InputField
                    background
                    name="old_passwd"
                    type="password"
                    label={`${t('Old Password')}:`}
                    placeholder={t('Enter old password')}
                    isShadow
                    className={cn(s.oldpassInput, s.input, s.icon)}
                    inputClassName={s.inputClass}
                    error={!!errors.old_passwd}
                    touched={!!touched.old_passwd}
                  />
                  <InputField
                    background
                    name="passwd"
                    type="password"
                    label={`${t('New Password')}:`}
                    placeholder={t('Enter a new password')}
                    isShadow
                    className={cn(s.input, s.icon)}
                    inputClassName={s.inputClass}
                    error={!!errors.passwd}
                    touched={!!touched.passwd}
                  />
                </div>
                <div className={s.formRow}>
                  <InputField
                    background
                    name="confirm"
                    type="password"
                    label={`${t('Password confirmation')}:`}
                    placeholder={t('Confirm your password')}
                    isShadow
                    className={cn(s.input, s.icon)}
                    inputClassName={s.inputClass}
                    error={!!errors.confirm}
                    touched={!!touched.confirm}
                  />
                </div>
              </div>
              <div className={s.block}>
                <h2 className={s.settingsTitle}>{t('Access limitation')}</h2>
                <div className={s.formRow}>
                  <div className={s.ipsForm}>
                    <Select
                      value={values.atype}
                      getElement={item => setFieldValue('atype', item)}
                      itemsList={userParams?.ipTypeList?.map(({ $, $key }) => ({
                        label: t(`${$.trim()}`),
                        value: $key,
                      }))}
                      className={cn(s.select, s.input)}
                      inputClassName={s.inputClass}
                      isShadow
                      background
                    />
                    {values.atype === 'atallow' && (
                      <InputField
                        background
                        name="atallowIp"
                        placeholder={t('Set trusted IPs')}
                        isShadow
                        className={s.trustedIp}
                        error={!!errors.atallowIp}
                        touched={!!touched.atallowIp}
                        iconRight="plus"
                        onKeyDown={addIpHandler}
                        onPlusClick={addIpHandlerPlus}
                      />
                    )}
                  </div>
                  <div className={s.bindIp}>
                    <div className={s.bindIpText}>{t('Bind session to IP')}</div>
                    <CheckBox
                      value={values.secureip}
                      onClick={() => setFieldValue('secureip', !values.secureip)}
                      type="switcher"
                    />
                  </div>
                </div>
                {values.atype === 'atallow' && (
                  <div className={s.selectedIp}>
                    {values?.allowIpList?.map((el, index) => {
                      return (
                        <div className={s.selectedItem} key={index}>
                          <div>{el}</div>
                          <Icon name="Cross" onClick={() => deleteIpHandler(index)} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className={s.block}>
                <h2 className={s.settingsTitle}>{t('Login via social networks')}</h2>
                <div className={s.socialRow}>
                  <SocialButton
                    onClick={
                      values?.google_status === 'off'
                        ? () => {
                            localStorage.setItem('connect_social_in_settings', 'true')
                            dispatch(authOperations.getRedirectLink('google'))
                          }
                        : () => {
                            setFieldValue('google_status', 'off')
                            handleSocialLinkClick({
                              ...socialState,
                              google_status: 'off',
                            })
                          }
                    }
                    isNotConnected={values?.google_status === 'off'}
                    platform="Google"
                  >
                    <Icon name="Google" className={s.googleIcon} />
                  </SocialButton>

                  {/* <SocialButton
                    onClick={
                      values?.facebook_status === 'off'
                        ? () => {
                            localStorage.setItem('connect_social_in_settings', 'true')
                            dispatch(authOperations.getRedirectLink('facebook'))
                          }
                        : () => {
                            setFieldValue('facebook_status', 'off')
                            handleSocialLinkClick({
                              ...socialState,
                              facebook_status: 'off',
                            })
                          }
                    }
                    isNotConnected={values?.facebook_status === 'off'}
                    platform="Facebook"
                  >
                    <Icon name="FacebookSmall" />
                  </SocialButton> */}

                  {(clientCountryId === '182' ||
                    clientCountryId === '80' ||
                    clientCountryId === '113') && (
                    <SocialButton
                      onClick={
                        values?.vkontakte_status === 'off'
                          ? () => {
                              localStorage.setItem('connect_social_in_settings', 'true')
                              dispatch(authOperations.getRedirectLink('vkontakte'))
                            }
                          : () => {
                              setFieldValue('facebook_status', 'off')
                              handleSocialLinkClick({
                                ...socialState,
                                vkontakte_status: 'off',
                              })
                            }
                      }
                      isNotConnected={values?.vkontakte_status === 'off'}
                      platform="Вконтакте"
                    >
                      <Icon name="VkSmall" />
                    </SocialButton>
                  )}
                </div>
              </div>
              <div className={s.block}>
                <h2 className={s.settingsTitle}>{t('2-Step Verification')}</h2>
                {userParams?.status_totp === 'on' ? (
                  <div className={s.twoStepVerif}>
                    <InputField
                      background
                      label={t('Disable 2-Step Verification')}
                      type="text"
                      name="disable_totp"
                      value={values?.disable_totp}
                      onChange={e => onInputItemsChange(e?.target?.value)}
                      placeholder={t('Enter password')}
                      isShadow
                      className={s.trustedIp}
                      error={!!errors.disable_totp}
                      touched={!!touched.disable_totp}
                    />
                  </div>
                ) : (
                  <button
                    onClick={openTwoStepVerifHandler}
                    type="button"
                    className={s.verification}
                  >
                    {t('Enable 2-Step Verification')}
                  </button>
                )}
              </div>
              <div className={s.btnBlock}>
                <Button
                  className={cn({
                    [s.saveBtn]: true,
                    [s.shown]: true,
                  })}
                  isShadow
                  size="medium"
                  label={t('Save', { ns: 'other' })}
                  type="submit"
                  disabled={!isComponentAllowedToEdit}
                />
                <button
                  onClick={() =>
                    navigate(routes?.HOME, {
                      replace: true,
                    })
                  }
                  type="button"
                  className={s.cancel}
                >
                  {t('Cancel', { ns: 'other' })}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>

      {isModal && twoStepVerif && (
        <ModalTwoStepVerification closeModal={setIsModal} isOpen />
      )}
    </>
  )
}
