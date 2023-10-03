import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import dayjs from 'dayjs'
import { Link, useNavigate } from 'react-router-dom'
import {
  InputField,
  CustomPhoneInput,
  Select,
  Button,
  Portal,
  ModalPickPhoto,
  ToggleBlock,
  HintWrapper,
  ScrollToFieldError,
  Icon,
  CheckBox,
} from '@components'
import { Form, Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { settingsSelectors, settingsOperations, userSelectors } from '@redux'
import { isBase64 } from '@utils'
import s from './PersonalSettings.module.scss'
import * as routes from '@src/routes'
import * as Yup from 'yup'
import 'yup-phone'

export default function Component({ isComponentAllowedToEdit, signal, setIsLoading }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation(['user_settings', 'other'])

  const dropdownDescription = useRef(null)

  const [avatarFile, setAvatarFile] = useState()
  const [countryCode, setCountryCode] = useState(null)

  const userEdit = useSelector(settingsSelectors.getUserEdit)
  const userParams = useSelector(settingsSelectors.getUserParams)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const saveProfileHandler = values => {
    dispatch(
      settingsOperations?.setPersonalSettings(
        userInfo?.$id,
        values,
        signal,
        setIsLoading,
      ),
    )
  }

  const confirmEmailHandler = values => {
    dispatch(settingsOperations?.setupEmailConfirm(userInfo?.$id, values))
  }

  useEffect(() => {
    if (userEdit) {
      const findCountry = userEdit?.phone_countries?.find(
        e => e?.$key === userEdit?.phone_country,
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setCountryCode(code)
    }
  }, [userEdit])

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('warnings.invalid_email', { ns: 'auth' })),
    email_notif: Yup.string().email(t('warnings.invalid_email', { ns: 'auth' })),
    phone: Yup.string().phone(countryCode, false, t('Must be a valid phone number')),
  })

  const emailStatusRender = statusText => {
    let newText = statusText?.toLowerCase()

    if (
      statusText?.toLowerCase().includes('email') &&
      statusText?.toLowerCase().includes('is not confirmed')
    ) {
      newText = (
        <>
          <p className={s.emailError}>
            Email {userParams?.email} {t('is not confirmed')}.{' '}
            {t('All notifications are disabled')}.
          </p>
          <p>
            {t('The confirmation email has been sent to')} {userParams?.email}.
          </p>
          <p>{t('Click "send confirmation" for resending')}.</p>
        </>
      )
    } else if (
      statusText?.toLowerCase().includes('email') &&
      statusText?.toLowerCase().includes('is confirmed')
    ) {
      newText = (
        <p className={s.emailSucces}>
          Email {userParams?.email} {t('is confirmed')}.
        </p>
      )
    } else if (
      statusText?.toLowerCase().includes('email') &&
      statusText?.toLowerCase().includes('has been sent')
    ) {
      newText = (
        <p>
          {t('The confirmation email has been sent to')} {userParams?.email}.
        </p>
      )
    }

    return newText
  }

  const confirmEmailBtnRender = (statusText, email) => {
    if (
      statusText?.toLowerCase().includes('email') &&
      statusText?.toLowerCase().includes('is confirmed') &&
      userParams?.email === email
    ) {
      return false
    }

    return true
  }

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
          sendemail: userParams?.sendemail === 'on',
          setgeoip: userParams?.setgeoip === 'on',
        }}
        onSubmit={saveProfileHandler}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => {
          const getTime = item => {
            dispatch(settingsOperations.getTimeByTimeZone(item))
            setFieldValue('timezone', item)
          }

          const isConfirmEmailBtnRender = confirmEmailBtnRender(
            userParams?.email_confirmed_status,
            values.email_notif,
          )

          return (
            <Form className={s.personalBlock}>
              <ScrollToFieldError />
              <div className={s.topBlock}>
                <h2 className={s.settingsTitle}>{t('User Settings')}</h2>
                <label className={s.avatarBlock} htmlFor="avatar">
                  <div className={s.iconBlock}>
                    {userParams?.avatar_view === '/manimg/userdata/img/customer.png' ||
                    !userParams?.avatar_view ? (
                      <Icon name="Profile" className={s.icon} />
                    ) : (
                      <img
                        className={s.img}
                        alt="avatar"
                        src={
                          isBase64(userParams?.avatar_view, { allowMime: true })
                            ? userParams?.avatar_view
                            : `${process.env.REACT_APP_BASE_URL}${userParams?.avatar_view}`
                        }
                      />
                    )}
                  </div>
                  <div className={s.downloadBlockText}>
                    <div className={s.downloadText}>{t('Upload a photo')}</div>
                    <div className={s.downloadParams}>
                      {t('jpg, png, gif 80x80 up to 64 Kb')}
                    </div>
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
                    background
                    disabled={userEdit?.email?.readonly}
                    name="email"
                    label={`${t('Email')}:`}
                    placeholder={t('email_placeholder', { ns: 'auth' })}
                    isShadow
                    className={cn(s.emailInput, s.input)}
                    error={!!errors.email}
                    touched={!!touched.email}
                    isRequired
                    inputWrapperClass={s.field}
                    inputClassName={s.field_bg}
                  />
                  <InputField
                    background
                    disabled={userEdit?.realname?.readonly}
                    name="realname"
                    label={`${t('Full name', { ns: 'other' })}:`}
                    placeholder={t('Enter your details', { ns: 'other' })}
                    isShadow
                    className={s.input}
                    error={!!errors.email}
                    touched={!!touched.email}
                    inputWrapperClass={s.field}
                    inputClassName={s.field_bg}
                  />
                </div>
                <div className={s.formRow}>
                  <CustomPhoneInput
                    containerClass={cn(s.phoneInputContainer, s.field)}
                    inputClass={cn(s.phoneInputClass, s.field_bg)}
                    disabled={userEdit?.phone?.readonly}
                    value={values.phone}
                    wrapperClass={s.phoneInput}
                    labelClass={s.phoneInputLabel}
                    setCountryCode={setCountryCode}
                    label={`${t('Phone for notifications', { ns: 'other' })}:`}
                    dataTestid="input_phone"
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    name="phone"
                    buttonClass={s.phoneInputButton}
                  />

                  <Select
                    label={`${t('Timezone', { ns: 'other' })}:`}
                    value={values.timezone}
                    getElement={item => getTime(item)}
                    placeholder={t('Timezone', { ns: 'other' })}
                    itemsList={userParams?.timezoneList?.map(({ $, $key }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
                    }))}
                    className={cn(s.select, s.input)}
                    isShadow
                    additionalPlaceHolder={
                      userParams?.time
                        ? `${t('time', { ns: 'other' })}: ${dayjs(
                            userParams?.time,
                          ).format('HH:mm')}`
                        : null
                    }
                    background
                    inputClassName={s.field_bg}
                  />
                </div>

                <div className={s.formRow}>
                  <div className={s.phoneBlock}>
                    <CustomPhoneInput
                      containerClass={cn(s.phoneInputContainer, s.field)}
                      inputClass={cn(s.phoneInputClass, s.field_bg)}
                      disabled={true}
                      value={
                        userInfo?.verefied_phone !== 'Verify'
                          ? userInfo?.verefied_phone
                          : values.phone
                      }
                      wrapperClass={s.phoneInputVerif}
                      labelClass={s.phoneInputLabel}
                      label={`${t('Main number')}:`}
                      buttonClass={s.phoneInputButton}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      name="verefied_phone"
                    />
                    <button type="button" className={s.infoBtn}>
                      <Icon name="Info" />
                      <div ref={dropdownDescription} className={s.descriptionBlock}>
                        {userInfo?.verefied_phone !== 'Verify'
                          ? t('after_verified_number')
                          : t('before_verified_number', { btn: t('Verify number') })}
                      </div>
                    </button>
                  </div>
                </div>

                {userInfo?.$need_phone_validate === 'true' && (
                  <div className={s.formRow}>
                    <Link
                      className={s.phoneVerificationLink}
                      to={routes.PHONE_VERIFICATION}
                      state={{
                        prevPath: location.pathname,
                        phone: userEdit?.phone?.phone,
                      }}
                    >
                      <Icon name="PhoneVerificationIcon" />{' '}
                      <span>{t('Verify number')}</span>
                    </Link>
                  </div>
                )}
              </div>
              <div className={s.bottomBlock}>
                <h2 className={s.settingsTitle}>{t('Security notification settings')}</h2>

                <div className={cn(s.formRow, s.rowMessages)}>
                  <div className={s.emailBlock}>
                    <InputField
                      name="email_notif"
                      label={`${t('Email')}:`}
                      placeholder={t('security_email_placeholder', {
                        ns: 'user_settings',
                      })}
                      isShadow
                      className={cn(s.emailInput, s.notifEmail)}
                      error={!!errors.email_notif}
                      touched={!!touched.email_notif}
                      inputWrapperClass={s.field}
                      inputClassName={s.field_bg}
                    />

                    {isConfirmEmailBtnRender &&
                      values?.email_notif?.length > 0 &&
                      !errors.email_notif && (
                        <button
                          className={s.confirmBtn}
                          onClick={() => confirmEmailHandler(values)}
                          type="button"
                        >
                          {t('Send confirmation', { ns: 'other' })}
                        </button>
                      )}
                  </div>

                  <div className={s.emailStatus}>
                    {emailStatusRender(userParams?.email_confirmed_status)}
                  </div>

                  <div className={s.securNotification}>
                    <div className={s.securNotifnEmailBlock}>
                      <div className={s.securNotifText}>
                        {t('Send e-mail messages about authorization')}
                      </div>

                      <HintWrapper
                        popupClassName={s.hintWrapper}
                        label={t('Confirm your email to activate the functionality')}
                        disabled={!isConfirmEmailBtnRender}
                      >
                        <CheckBox
                          value={values.sendemail}
                          onClick={() => {
                            setFieldValue('sendemail', !values.sendemail)
                          }}
                          disabled={isConfirmEmailBtnRender}
                          type="switcher"
                        />
                      </HintWrapper>
                    </div>
                    <div className={s.securNotifnGeoBlock}>
                      <div className={s.geoIpBlock}>
                        <div className={s.securNotifText}>
                          {t('Use GeoIP (region tracking by IP)')}
                        </div>
                        <HintWrapper
                          bottom
                          wrapperClassName={s.hintWrapperGeo}
                          popupClassName={s.hintPopUpWrapperGeoIp}
                          label={t('geo_ip_info')}
                        >
                          <Icon name="Info" />
                        </HintWrapper>
                      </div>

                      <HintWrapper
                        popupClassName={s.hintWrapper}
                        label={t('Confirm your email to activate the functionality')}
                        disabled={!isConfirmEmailBtnRender}
                      >
                        <CheckBox
                          value={values.setgeoip}
                          onClick={() => {
                            setFieldValue('setgeoip', !values.setgeoip)
                          }}
                          disabled={isConfirmEmailBtnRender}
                          type="switcher"
                        />
                      </HintWrapper>
                    </div>
                  </div>
                </div>
                <div className={s.bottomBlock}>
                  <h2 className={s.settingsTitle}>
                    {t('Setting up Telegram notifications')}
                  </h2>

                  {userParams?.telegramLink && userParams?.telegramLink?.length !== 0 && (
                    <div className={s.telegramBlock}>
                      {t('To receive notifications using Telegram')}

                      <div className={s.listTelegram}>
                        1. {t('Enter your login in the form below')}
                      </div>

                      <div className={s.listTelegram}>
                        2. {t('Write to our bot')} -{' '}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className={s.telegramLink}
                          href={userParams?.telegramLink}
                        >
                          ZomroNotifier_bot
                        </a>
                      </div>
                    </div>
                  )}

                  <div className={cn(s.formRow, s.rowMessages)}>
                    <InputField
                      name="telegram_id"
                      label={`${t('Telegram')}:`}
                      placeholder={t('Enter your telegram')}
                      isShadow
                      className={cn(s.input, s.notifEmail)}
                      error={!!errors.email}
                      touched={!!touched.email}
                      inputWrapperClass={s.field}
                      inputClassName={s.field_bg}
                    />
                  </div>
                </div>
                {userParams?.listCheckBox && (
                  <div className={s.checkBlock}>
                    <div className={s.checkTitle}>
                      <div className={s.notifTitle}>{t('Notification methods')}:</div>
                      <div className={s.columnBlock}>
                        <div className={s.column}>email</div>
                        <div className={s.column}>messenger</div>
                        {/* <div className={s.column}>sms</div> */}
                      </div>
                    </div>
                    {userParams?.listCheckBox?.map(el => (
                      <ToggleBlock
                        key={el.name}
                        item={el}
                        setFieldValue={setFieldValue}
                        values={values}
                      />
                    ))}
                  </div>
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
      <Portal>
        {avatarFile && (
          <ModalPickPhoto avatarFile={avatarFile} setAvatarFile={setAvatarFile} />
        )}
      </Portal>
    </>
  )
}
