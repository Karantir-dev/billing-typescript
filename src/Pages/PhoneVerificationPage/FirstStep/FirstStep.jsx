import React from 'react'

import { useTranslation } from 'react-i18next'
import { Button, CustomPhoneInput, Select } from '../../../Components'

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
  } = props

  const types = isFirst ? validatePhoneData?.types : validatePhoneData?.action_types

  return (
    <>
      {isFirst && (
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
      )}

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
          label={isFirst ? t('GET A CODE') : t('CHOOSE')}
          type="submit"
        />
        <button onClick={backHandler} type="button" className={s.cancel}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </div>
    </>
  )
}
