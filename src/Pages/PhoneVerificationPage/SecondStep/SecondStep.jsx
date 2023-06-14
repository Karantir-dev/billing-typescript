import { useTranslation } from 'react-i18next'
import { Button, CustomPhoneInput, InputField } from '@components'

import s from './SecondStep.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['user_settings', 'other'])

  const {
    values,
    handleBlur,
    setFieldValue,
    setCountryCode,
    backHandler,
    errors,
    touched,
    goToFirstStepHanfler,
  } = props

  return (
    <>
      <CustomPhoneInput
        containerClass={s.phoneInputContainer}
        inputClass={s.phoneInputClass}
        value={values.phone}
        wrapperClass={s.phoneInput}
        labelClass={s.phoneInputLabel}
        setCountryCode={setCountryCode}
        label={`${t('Phone', { ns: 'other' })}:`}
        dataTestid="input_phone"
        handleBlur={handleBlur}
        setFieldValue={setFieldValue}
        name="phone"
        disabled
      />

      <InputField
        background
        name="code"
        maxLength={4}
        label={`${t('Verification code')}:`}
        placeholder={'0000'}
        isShadow
        className={s.input}
        error={!!errors.email}
        touched={!!touched.email}
      />

      <span className={s.typeDescription}>
        {t('not_receive_confirmation_code_1')}{' '}
        <button type="button" onClick={goToFirstStepHanfler}>
          {t('Another way')}
        </button>{' '}
        {t('not_receive_confirmation_code_2')}
      </span>

      <div className={s.btnBlock}>
        <Button
          className={s.saveBtn}
          isShadow
          size="medium"
          label={t('VERIFY')}
          type="submit"
        />
        <button onClick={backHandler} type="button" className={s.cancel}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </div>
    </>
  )
}
