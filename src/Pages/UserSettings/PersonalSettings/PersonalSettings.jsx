import React from 'react'
import cn from 'classnames'
import { Profile } from '../../../images'
import { InputField, CustomPhoneInput, Select, Toggle, Button } from '../../../Components'

import { Form, Formik } from 'formik'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import s from './PersonalSettings.module.scss'
import { settingsSelectors } from '../../../Redux'

export default function Component() {
  // const dispatch = useDispatch()
  const { t } = useTranslation(['user_settings', 'other'])
  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userParams = useSelector(settingsSelectors.getUserParams)

  console.log(userParams)

  return (
    <Formik
      enableReinitialize
      // validationSchema={validationSchema}
      initialValues={{
        email: userEdit?.email?.email || '',
        realname: userEdit?.realname?.realname || '',
        phone: userEdit?.phone?.phone || '',

        telegram_id: userParams?.telegram_id || '',
        timezone: userParams?.timezone || '',
      }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form className={s.personalBlock}>
            <div className={s.topBlock}>
              <h2 className={s.settingsTitle}>{t('User Settings')}</h2>
              <label className={s.avatarBlock} htmlFor="avatar">
                <div className={s.iconBlock}>
                  <Profile className={s.icon} />
                </div>
                <div className={s.downloadText}>{t('Upload a photo')}</div>
                <div className={s.downloadParams}>
                  {t('jpg, png, gif 80x80 up to 64 Kb')}
                </div>
                <input
                  hidden
                  accept="image/*"
                  id="avatar"
                  name="avatar"
                  type="file"
                  onChange={() => null}
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
                  getElement={item => setFieldValue('timezone', item)}
                  placeholder={t('Timezone', { ns: 'other' })}
                  itemsList={userParams?.timezoneList?.map(({ $, $key }) => ({
                    label: t(`${$.trim()}`, { ns: 'other' }),
                    value: $key,
                  }))}
                  className={s.select}
                  isShadow
                />
              </div>
            </div>
            <div className={s.bottomBlock}>
              <h2 className={s.settingsTitle}>{t('Notification settings')}</h2>
              <div className={s.telegramBlock}>
                {t('To receive notifications via Telegram, write to our bot')} —{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={s.telegramLink}
                  href="https://t.me/testzomro_bot"
                >
                  ZomroNotifier_bot
                </a>
              </div>
              <div className={cn(s.formRow, s.rowMessages)}>
                <InputField
                  disabled={userEdit?.email?.readonly}
                  name="email"
                  label={t('Email')}
                  placeholder={t('email_placeholder', { ns: 'auth' })}
                  isShadow
                  className={s.emailInput}
                  error={!!errors.email}
                  touched={!!touched.email}
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
            </div>
            <div>
              <Button
                className={s.saveBtn}
                isShadow
                size="medium"
                label={t('Save', { ns: 'other' })}
                type="submit"
              />
              <button onClick={() => null} type="button" className={s.cancel}>
                {t('Cancel', { ns: 'other' })}
              </button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export function requiredLabel(labelName) {
  return (
    <>
      {labelName} {<span className={s.required_star}>*</span>}
    </>
  )
}
