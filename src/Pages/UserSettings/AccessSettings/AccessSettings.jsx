import React from 'react'
import cn from 'classnames'
import { InputField, Button, Select, Toggle, SocialButton } from '../../../Components'
import { Form, Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { settingsSelectors, settingsOperations, userSelectors } from '../../../Redux'
import * as Yup from 'yup'
import * as routes from '../../../routes'
import s from './AccessSettings.module.scss'
import { FacebookSmall, GoogleSmall, VkSmall } from '../../../images'

export default function Component() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation(['user_settings', 'other'])

  const userParams = useSelector(settingsSelectors.getUserParams)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const setSettingsHandler = values => {
    dispatch(settingsOperations?.setPasswordAccess(userInfo?.$id, values))
  }

  const validationSchema = Yup.object().shape({
    passwd: Yup.string()
      .min(6, t('Password must contain at least 6 characters', { ns: 'other' }))
      .max(48, t('Password must contain no more than 48 characters', { ns: 'other' }))
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
  })

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        old_passwd: '',
        passwd: '',
        confirm: '',
        atype: userParams?.atype || '',
      }}
      onSubmit={setSettingsHandler}
    >
      {({ errors, touched, values, setFieldValue }) => {
        return (
          <Form className={s.personalBlock}>
            <div className={s.block}>
              <h2 className={s.settingsTitle}>{t('Change Password')}</h2>
              <div className={s.formRow}>
                <InputField
                  background
                  name="old_passwd"
                  type="password"
                  label={`${t('Old Password')}:`}
                  placeholder={t('Enter old password')}
                  isShadow
                  className={cn(s.oldpassInput, s.input)}
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
                  className={s.input}
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
                  className={s.input}
                  error={!!errors.confirm}
                  touched={!!touched.confirm}
                />
              </div>
            </div>
            <div className={s.block}>
              <h2 className={s.settingsTitle}>{t('Access limitation')}</h2>
              <div className={s.formRow}>
                <Select
                  value={values.atype}
                  getElement={item => setFieldValue('atype', item)}
                  itemsList={userParams?.ipTypeList?.map(({ $, $key }) => ({
                    label: t(`${$.trim()}`),
                    value: $key,
                  }))}
                  className={cn(s.select, s.input)}
                  isShadow
                  background
                />
                <div className={s.bindIp}>
                  <div className={s.bindIpText}>{t('Bind session to IP')}</div>
                  <Toggle
                    setValue={value => setFieldValue('secureip', value)}
                    initialState={userParams?.secureip === 'on'}
                  />
                </div>
              </div>
            </div>
            <div className={s.block}>
              <h2 className={s.settingsTitle}>{t('Login via social networks')}</h2>
              <div className={s.socialRow}>
                <SocialButton isNotConnected platform="Google">
                  <GoogleSmall />
                </SocialButton>
                <SocialButton isNotConnected platform="Facebook"> 
                  <FacebookSmall />
                </SocialButton>
                <SocialButton isNotConnected platform="Vk">
                  <VkSmall />
                </SocialButton>
              </div>
            </div>
            <div className={s.block}>
              <h2 className={s.settingsTitle}>{t('2-Step Verification')}</h2>
              <button type="button" className={s.verification}>
                {t('Enable 2-Step Verification')}
              </button>
            </div>
            <div className={s.block}>
              <h2 className={s.settingsTitle}>{t('Security notification settings')}</h2>
              <div className={s.securNotification}>
                <div className={s.securNotifnEmailBlock}>
                  <div className={s.securNotifText}>
                    {t('Send e-mail messages about authorization')}
                  </div>
                  <Toggle
                    setValue={value => setFieldValue('sendemail', value)}
                    initialState={userParams?.sendemail === 'on'}
                  />
                </div>
                <div className={s.securNotifnGeoBlock}>
                  <div className={s.securNotifText}>
                    {t('Use GeoIP (region tracking by IP)')}
                  </div>
                  <Toggle
                    setValue={value => setFieldValue('setgeoip', value)}
                    initialState={userParams?.setgeoip === 'on'}
                  />
                </div>
              </div>
            </div>
            <div className={s.btnBlock}>
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
  )
}
