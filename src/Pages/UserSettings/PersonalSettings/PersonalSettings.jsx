import React, { useState } from 'react'
import cn from 'classnames'
import dayjs from 'dayjs'
import * as routes from '../../../routes'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { Profile } from '../../../images'
import {
  InputField,
  CustomPhoneInput,
  Select,
  Toggle,
  Button,
  Portal,
  ModalPickPhoto,
} from '../../../Components'
import { BASE_URL } from '../../../config/config'
import { Form, Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { settingsSelectors, settingsOperations, userSelectors } from '../../../Redux'
import { isBase64 } from '../../../utils'
import s from './PersonalSettings.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation(['user_settings', 'other'])

  const [avatarFile, setAvatarFile] = useState()

  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userParams = useSelector(settingsSelectors.getUserParams)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const saveProfileHandler = values => {
    dispatch(settingsOperations?.setPersonalSettings(userInfo?.$id, values))
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('warnings.invalid_email')),
    email_notif: Yup.string().email(t('warnings.invalid_email')),
  })

  return (
    <>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          email: userEdit?.email?.email || '',
          realname: userEdit?.realname?.realname || '',
          phone: userEdit?.phone?.phone || '',

          email_notif: userParams?.email || '',
          telegram_id: userParams?.telegram_id || '',
          timezone: userParams?.timezone || '',
        }}
        onSubmit={saveProfileHandler}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => {
          const getTime = item => {
            dispatch(settingsOperations.getTimeByTimeZone(item))
            setFieldValue('timezone', item)
          }
          return (
            <Form className={s.personalBlock}>
              <div className={s.topBlock}>
                <h2 className={s.settingsTitle}>{t('User Settings')}</h2>
                <label className={s.avatarBlock} htmlFor="avatar">
                  <div className={s.iconBlock}>
                    {userParams?.avatar_view === '/manimg/userdata/img/customer.png' ||
                    !userParams?.avatar_view ? (
                      <Profile className={s.icon} />
                    ) : (
                      <img
                        className={s.img}
                        alt="avatar"
                        src={
                          isBase64(userParams?.avatar_view, { allowMime: true })
                            ? userParams?.avatar_view
                            : `${BASE_URL}${userParams?.avatar_view}`
                        }
                      />
                    )}
                  </div>
                  <div className={s.downloadText}>{t('Upload a photo')}</div>
                  <div className={s.downloadParams}>
                    {t('jpg, png, gif 80x80 up to 64 Kb')}
                  </div>
                  <input
                    hidden
                    accept=".png,.jpg,.jpeg,.gif"
                    id="avatar"
                    name="avatar"
                    type="file"
                    onChange={e => {
                      let file = e.target.files[0]
                      setAvatarFile(file)
                    }}
                  />
                </label>
                <div className={s.formRow}>
                  <InputField
                    disabled={userEdit?.email?.readonly}
                    name="email"
                    label={requiredLabel(t('Email'))}
                    placeholder={t('email_placeholder', { ns: 'auth' })}
                    isShadow
                    className={s.emailInput}
                    error={!!errors.email}
                    touched={!!touched.email}
                  />
                  <InputField
                    disabled={userEdit?.realname?.readonly}
                    name="realname"
                    label={t('Full name', { ns: 'other' })}
                    placeholder={t('Enter your details', { ns: 'other' })}
                    isShadow
                    error={!!errors.email}
                    touched={!!touched.email}
                  />
                </div>
                <div className={s.formRow}>
                  <CustomPhoneInput
                    disabled={userEdit?.phone?.readonly}
                    value={values.phone}
                    wrapperClass={s.phoneInput}
                    labelClass={s.phoneInputLabel}
                    label={t('Phone', { ns: 'other' })}
                    dataTestid="input_phone"
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    name="phone"
                  />
                  <Select
                    label={t('Timezone', { ns: 'other' })}
                    value={values.timezone}
                    getElement={item => getTime(item)}
                    placeholder={t('Timezone', { ns: 'other' })}
                    itemsList={userParams?.timezoneList?.map(({ $, $key }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
                    }))}
                    className={s.select}
                    isShadow
                    additionalPlaceHolder={
                      userParams?.time
                        ? `${t('time', { ns: 'other' })}: ${dayjs(
                            userParams?.time,
                          ).format('HH:mm')}`
                        : null
                    }
                  />
                </div>
              </div>
              <div className={s.bottomBlock}>
                <h2 className={s.settingsTitle}>{t('Notification settings')}</h2>
                {userParams?.telegramLink && userParams?.telegramLink?.length !== 0 && (
                  <div className={s.telegramBlock}>
                    {t('To receive notifications via Telegram, write to our bot')} —{' '}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className={s.telegramLink}
                      href={userParams?.telegramLink}
                    >
                      ZomroNotifier_bot
                    </a>
                  </div>
                )}
                <div className={cn(s.formRow, s.rowMessages)}>
                  <InputField
                    name="email_notif"
                    label={t('Email')}
                    placeholder={t('email_placeholder', { ns: 'auth' })}
                    isShadow
                    className={s.emailInput}
                    error={!!errors.email_notif}
                    touched={!!touched.email_notif}
                  />
                  <InputField
                    name="telegram_id"
                    label={t('Telegram')}
                    placeholder={t('Enter your telegram')}
                    isShadow
                    error={!!errors.email}
                    touched={!!touched.email}
                  />
                </div>
                {userParams?.listCheckBox && (
                  <div className={s.checkBlock}>
                    <div className={s.checkTitle}>
                      <div className={s.notifTitle}>{t('Notification methods')}:</div>
                      <div className={s.column}>email</div>
                      <div className={s.column}>messenger</div>
                      <div className={s.column}>sms</div>
                    </div>
                    {userParams?.listCheckBox?.map(el => (
                      <div key={el.name} className={s.checkRow}>
                        <div className={s.notifName}>{t(el.name)}</div>
                        <div className={s.column}>
                          <Toggle
                            setValue={value =>
                              setFieldValue(`${el.fieldName}_notice_ntemail`, value)
                            }
                            initialState={el?.emailValue === 'on'}
                          />
                        </div>
                        <div className={s.column}>
                          <Toggle
                            setValue={value =>
                              setFieldValue(`${el.fieldName}_notice_ntmessenger`, value)
                            }
                            initialState={el?.messengerValue === 'on'}
                          />
                        </div>
                        <div className={s.column}>
                          <Toggle
                            setValue={value =>
                              setFieldValue(`${el.fieldName}_notice_ntsms`, value)
                            }
                            initialState={el?.smsValue === 'on'}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Button
                  className={s.saveBtn}
                  isShadow
                  size="medium"
                  label={t('Save', { ns: 'other' })}
                  type="submit"
                />
                <button
                  onClick={() => navigate(routes?.HOME)}
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
      <Portal>
        {avatarFile && (
          <ModalPickPhoto avatarFile={avatarFile} setAvatarFile={setAvatarFile} />
        )}
      </Portal>
    </>
  )
}

export function requiredLabel(labelName) {
  return (
    <>
      {labelName} {<span className={s.required_star}>*</span>}
    </>
  )
}
