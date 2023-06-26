import { useTranslation } from 'react-i18next'
import { Button, CustomPhoneInput, Select } from '@components'

import s from './FirstStep.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['user_settings', 'other'])

  const {
    values,
    handleBlur,
    setFieldValue,
    setCountryCode,
    validatePhoneData,
    backHandler,
    isFirst,
    isTimeOut,
    handleSubmit,
  } = props

  const notHaveNumber = !validatePhoneData?.types && !validatePhoneData?.action_types
  const types = isFirst ? validatePhoneData?.types : validatePhoneData?.action_types

  const renderBtnTitle = () => {
    if (notHaveNumber) {
      return t('SET A PHONE')
    } else if (isFirst) {
      return t('GET A CODE')
    } else {
      return t('CHOOSE')
    }
  }

  return (
    <>
      {isFirst || notHaveNumber ? (
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
          onEnterKeyPress={handleSubmit}
          name="phone"
        />
      ) : null}

      {validatePhoneData?.action_types || validatePhoneData?.types ? (
        <Select
          value={isFirst ? values.type : values.action_type}
          label={`${isFirst ? t('Verification method') : t('Choose an option')}:`}
          placeholder={''}
          getElement={item => setFieldValue(isFirst ? 'type' : 'action_type', item)}
          isShadow
          itemsList={types?.map(el => {
            return {
              label: t(el?.$),
              value: el.$key,
            }
          })}
          className={s.select}
        />
      ) : null}

      {isFirst && (
        <span className={s.typeDescription}>
          {values.type === '0' ? t('automated_call_text') : t('sms_text')}
        </span>
      )}

      <div className={s.btnBlock}>
        <Button
          className={s.saveBtn}
          isShadow
          size="medium"
          label={renderBtnTitle()}
          disabled={isTimeOut}
          type="submit"
        />
        <button onClick={backHandler} type="button" className={s.cancel}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </div>
    </>
  )
}
