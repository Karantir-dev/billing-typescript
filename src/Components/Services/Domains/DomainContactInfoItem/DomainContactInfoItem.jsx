import React, { useImperativeHandle, useState } from 'react'
import { InputField, CustomPhoneInput, Select, CheckBox } from '../../../../Components'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { FormikProvider, useFormik } from 'formik'

import { BASE_URL } from '../../../../config/config'
import * as Yup from 'yup'
import s from './DomainContactInfoItem.module.scss'
import { LATIN_REGEX } from '../../../../utils/constants'
import { Shevron } from '../../../../images'

export default function Component(props) {
  const { onChange, refId, formType, domainsContacts } = props
  const { t } = useTranslation(['domains', 'other', 'trusted_users', 'payers'])

  const owner = formType === 'owner'

  // fields //
  const contact_use_first = `${formType}_contact_use_first`
  const name = `${formType}_name`
  const contact_select = `${formType}_contact_select`
  const profiletype = `${formType}_profiletype`
  const email = `${formType}_email`
  const phone = `${formType}_phone`
  const privateForm = `${formType}_private`
  const firstname = `${formType}_firstname`
  const firstname_locale = `${formType}_firstname_locale`
  const lastname = `${formType}_lastname`
  const lastname_locale = `${formType}_lastname_locale`
  const middlename = `${formType}_middlename`
  const middlename_locale = `${formType}_middlename_locale`
  const location_country = `${formType}_location_country`
  const location_postcode = `${formType}_location_postcode`
  const location_state = `${formType}_location_state`
  const location_city = `${formType}_location_city`
  const location_address = `${formType}_location_address`

  const [isOpen, setIsOpen] = useState(owner)

  const openHandler = () => {
    setIsOpen(!isOpen)
  }

  const formik = useFormik({
    initialValues: {
      [contact_use_first]: owner ? undefined : domainsContacts[contact_use_first],
      [contact_select]: domainsContacts[contact_select] || '',
      [name]: domainsContacts[name]?.$ || '',
      [profiletype]: domainsContacts[profiletype] || '',
      [email]: domainsContacts[email]?.$ || '',
      [phone]: domainsContacts[phone] || '',
      [privateForm]: domainsContacts[privateForm] || 'off',
      [firstname]: domainsContacts[firstname]?.$ || '',
      [firstname_locale]: domainsContacts[firstname_locale]?.$ || '',
      [lastname]: domainsContacts[lastname]?.$ || '',
      [lastname_locale]: domainsContacts[lastname_locale]?.$ || '',
      [middlename]: domainsContacts[middlename]?.$ || '',
      [middlename_locale]: domainsContacts[middlename_locale]?.$ || '',
      [location_country]: domainsContacts[location_country] || '',
      [location_postcode]: domainsContacts[location_postcode]?.$ || '',
      [location_state]: domainsContacts[location_state]?.$ || '',
      [location_city]: domainsContacts[location_city]?.$ || '',
      [location_address]: domainsContacts[location_address]?.$ || '',
    },
    validationSchema: Yup.object().shape({
      [name]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [firstname]: owner
        ? Yup.string()
            .matches(LATIN_REGEX, t('Name can only contain Latin letters'))
            .required(t('Is a required field', { ns: 'other' }))
        : Yup.string()
            .matches(LATIN_REGEX, t('Name can only contain Latin letters'))
            .when(contact_use_first, {
              is: 'off',
              then: Yup.string().required(t('Is a required field', { ns: 'other' })),
            }),
      [firstname_locale]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [lastname]: owner
        ? Yup.string()
            .matches(LATIN_REGEX, t('Lastname can only contain Latin letters'))
            .required(t('Is a required field', { ns: 'other' }))
        : Yup.string()
            .matches(LATIN_REGEX, t('Lastname can only contain Latin letters'))
            .when(contact_use_first, {
              is: 'off',
              then: Yup.string().required(t('Is a required field', { ns: 'other' })),
            }),
      [lastname_locale]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [email]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [phone]: owner
        ? Yup.string()
            .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
            .required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string()
              .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
              .required(t('Is a required field', { ns: 'other' })),
          }),
      [location_country]: owner
        ? Yup.string()
            .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
            .required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string()
              .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
              .required(t('Is a required field', { ns: 'other' })),
          }),
      [location_postcode]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [location_state]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [location_city]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
      [location_address]: owner
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: Yup.string().required(t('Is a required field', { ns: 'other' })),
          }),
    }),
    onSubmit: () => {
      watchForm()
    },
  })

  const { values, setFieldValue, errors, touched, handleBlur } = formik

  useImperativeHandle(refId, () => ({
    Submit: async () => {
      await formik.submitForm()
    },
  }))

  function watchForm() {
    if (onChange) {
      onChange({
        values: formik.values,
        validated: formik.isSubmitting ? Object.keys(formik.errors).length === 0 : false,
      })
    }
  }

  return (
    <FormikProvider value={formik}>
      <form ref={refId}>
        <button
          disabled={!owner && values[contact_use_first] === 'on'}
          onClick={openHandler}
          type="button"
          className={s.titleBlock}
        >
          <h2 className={s.category_title}>{t(`${formType}_contact`)}</h2>
          {(owner || values[contact_use_first] === 'off') && (
            <Shevron className={cn(s.shevronIcon, { [s.isOpen]: isOpen })} />
          )}
        </button>
        {!owner && (
          <div className={s.useFirstCheck}>
            <CheckBox
              value={values[contact_use_first] === 'on'}
              onClick={() => {
                console.log(values[contact_use_first])
                setFieldValue(
                  contact_use_first,
                  values[contact_use_first] === 'on' ? 'off' : 'on',
                )
                if (values[contact_use_first] !== 'on') {
                  setIsOpen(false)
                } else {
                  setIsOpen(true)
                }
              }}
              className={s.checkbox}
              error={!!errors[contact_use_first]}
            />
            <span>{t('Use "Contact Owner"')}</span>
          </div>
        )}
        <div className={cn(s.ownerForm, { [s.isOpen]: isOpen })}>
          <div className={s.formBlock}>
            <div className={s.formFieldsBlock}>
              <Select
                placeholder={t('Not chosen', { ns: 'other' })}
                label={`${t('Use contact')}:`}
                value={values[`${formType}_contact_select`]}
                getElement={item => console.log(item)}
                isShadow
                className={s.select}
                itemsList={domainsContacts[`${formType}_contact_select_list`]?.map(
                  ({ $key, $ }) => ({
                    label: t(`${$.trim()}`, { ns: 'payers' }),
                    value: $key,
                  }),
                )}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={`${formType}_name`}
                label={`${t('Profile name')}:`}
                placeholder={t('Enter data', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[`${formType}_name`]}
                touched={!!touched[`${formType}_name`]}
                isRequired
                disabled={domainsContacts[`${formType}_name`]?.$readonly === 'yes'}
              />
              <Select
                placeholder={t('Not chosen', { ns: 'other' })}
                label={`${t('Contact type')}:`}
                value={values.owner_profiletype}
                getElement={item => setFieldValue('owner_profiletype', item)}
                isShadow
                className={s.select}
                itemsList={domainsContacts?.owner_profiletype_list?.map(
                  ({ $key, $ }) => ({
                    label: t(`${$.trim()}`, { ns: 'payers' }),
                    value: $key,
                  }),
                )}
              />
            </div>
          </div>

          <div className={s.formBlock}>
            <div className={s.formBlockTitle}>{t('Contact person details')}</div>
            <div className={s.formFieldsBlock}>
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_firstname_locale"
                label={`${t('Name', { ns: 'other' })}:`}
                placeholder={t('Enter name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_firstname_locale}
                touched={!!touched.owner_firstname_locale}
                isRequired
                disabled={domainsContacts?.owner_firstname_locale?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_firstname"
                label={`${t('Name', { ns: 'other' })} (EN):`}
                placeholder={t('Enter name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_firstname}
                touched={!!touched.owner_firstname}
                isRequired
                disabled={domainsContacts?.owner_firstname?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_lastname_locale"
                label={`${t('Surname', { ns: 'other' })}:`}
                placeholder={t('Enter surname', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_lastname_locale}
                touched={!!touched.owner_lastname_locale}
                isRequired
                disabled={domainsContacts?.owner_lastname_locale?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_lastname"
                label={`${t('Surname', { ns: 'other' })} (EN):`}
                placeholder={t('Enter surname', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_lastname}
                touched={!!touched.owner_lastname}
                isRequired
                disabled={domainsContacts?.owner_lastname?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_middlename_locale"
                label={`${t('Middle name', { ns: 'other' })}:`}
                placeholder={t('Enter middle name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_middlename_locale}
                touched={!!touched.owner_middlename_locale}
                disabled={domainsContacts?.owner_middlename_locale?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_middlename"
                label={`${t('Middle name', { ns: 'other' })} (EN):`}
                placeholder={t('Enter middle name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_middlename}
                touched={!!touched.owner_middlename}
                disabled={domainsContacts?.owner_middlename?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                type="email"
                name="owner_email"
                label={`${t('Email')}:`}
                placeholder={t('Enter email', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_email}
                touched={!!touched.owner_email}
                isRequired
                disabled={domainsContacts?.owner_email?.$readonly === 'yes'}
              />
              <CustomPhoneInput
                containerClass={s.phoneInputContainer}
                inputClass={s.phoneInputClass}
                value={values.owner_phone}
                wrapperClass={s.phoneInput}
                labelClass={s.phoneInputLabel}
                label={`${t('Phone', { ns: 'other' })}:`}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                name="owner_phone"
                isRequired
                disabled={domainsContacts?.owner_email?.$readonly === 'yes'}
              />
            </div>
          </div>

          <div className={s.formBlock}>
            <div className={s.formBlockTitle}>{t('Contact address')}</div>
            <div className={s.formFieldsBlock}>
              <Select
                placeholder={t('Not chosen', { ns: 'other' })}
                label={`${t('The country', { ns: 'other' })}:`}
                value={values.owner_location_country}
                getElement={item => setFieldValue('owner_location_country', item)}
                isShadow
                className={s.select}
                itemsList={domainsContacts?.owner_location_country_list?.map(
                  ({ $key, $, $image }) => ({
                    label: (
                      <div className={s.countrySelectItem}>
                        {$key !== 'null' && (
                          <img src={`${BASE_URL}${$image}`} alt="flag" />
                        )}
                        {t(`${$.trim()}`)}
                      </div>
                    ),
                    value: $key,
                  }),
                )}
                isRequired
                error={errors?.owner_location_country}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_location_postcode"
                label={`${t('Index', { ns: 'other' })}:`}
                placeholder={t('Enter index', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_location_postcode}
                touched={!!touched.owner_location_postcode}
                isRequired
                disabled={domainsContacts?.owner_location_postcode?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_location_state"
                label={`${t('Region', { ns: 'other' })}:`}
                placeholder={t('Enter region', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_location_state}
                touched={!!touched.owner_location_state}
                isRequired
                disabled={domainsContacts?.owner_location_state?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_location_city"
                label={`${t('City', { ns: 'other' })}:`}
                placeholder={t('Enter city', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_location_city}
                touched={!!touched.owner_location_city}
                isRequired
                disabled={domainsContacts?.owner_location_city?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name="owner_location_address"
                label={`${t('The address', { ns: 'other' })}:`}
                placeholder={t('Enter address', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors.owner_location_address}
                touched={!!touched.owner_location_address}
                isRequired
                disabled={domainsContacts?.owner_location_address?.$readonly === 'yes'}
              />
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  )
}
