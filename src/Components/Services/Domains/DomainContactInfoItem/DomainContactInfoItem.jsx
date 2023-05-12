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
  const { t } = useTranslation(['domains', 'other', 'trusted_users'])

  //admin_contact_use_first
  const formik = useFormik({
    initialValues: {
      [`${formType}_contact_select`]: domainsContacts[`${formType}_contact_select`] || '',
      [`${formType}_name`]: domainsContacts[`${formType}_name`]?.$ || '',
      [`${formType}_profiletype`]: domainsContacts[`${formType}_profiletype`] || '',
      [`${formType}_email`]: domainsContacts[`${formType}_email`]?.$ || '',
      [`${formType}_phone`]: domainsContacts[`${formType}_phone`] || '',

      [`${formType}_private`]: domainsContacts[`${formType}_private`] || 'off',

      [`${formType}_firstname`]: domainsContacts[`${formType}_firstname`]?.$ || '',
      [`${formType}_firstname_locale`]:
        domainsContacts[`${formType}_firstname_locale`]?.$ || '',
      [`${formType}_lastname`]: domainsContacts[`${formType}_lastname`]?.$ || '',
      [`${formType}_lastname_locale`]:
        domainsContacts[`${formType}_lastname_locale`]?.$ || '',
      [`${formType}_middlename`]: domainsContacts[`${formType}_middlename`]?.$ || '',
      [`${formType}_middlename_locale`]:
        domainsContacts[`${formType}_middlename_locale`]?.$ || '',

      [`${formType}_location_country`]:
        domainsContacts[`${formType}_location_country`] || '',
      [`${formType}_location_postcode`]:
        domainsContacts[`${formType}_location_postcode`]?.$ || '',
      [`${formType}_location_state`]:
        domainsContacts[`${formType}_location_state`]?.$ || '',
      [`${formType}_location_city`]:
        domainsContacts[`${formType}_location_city`]?.$ || '',
      [`${formType}_location_address`]:
        domainsContacts[`${formType}_location_address`]?.$ || '',
    },
    validationSchema: Yup.object().shape({
      [`${formType}_name`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_firstname`]: Yup.string()
        .matches(LATIN_REGEX, t('Name can only contain Latin letters'))
        .required(t('Is a required field', { ns: 'other' })),
      [`${formType}_firstname_locale`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_lastname`]: Yup.string()
        .matches(LATIN_REGEX, t('Lastname can only contain Latin letters'))
        .required(t('Is a required field', { ns: 'other' })),
      [`${formType}_lastname_locale`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_email`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_phone`]: Yup.string()
        .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
        .required(t('Is a required field', { ns: 'other' })),

      [`${formType}_location_country`]: Yup.string()
        .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
        .required(t('Is a required field', { ns: 'other' })),
      [`${formType}_location_postcode`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_location_state`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_location_city`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
      [`${formType}_location_address`]: Yup.string().required(
        t('Is a required field', { ns: 'other' }),
      ),
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

  const [isOpenOwner] = useState(true)
  const [isOpenAdmin, setIsOpenAdmin] = useState(true)

  return (
    <FormikProvider value={formik}>
      <form ref={refId}>
        <button
          onClick={() => setIsOpenAdmin(!isOpenAdmin)}
          type="button"
          className={s.titleBlock}
        >
          <h2 className={s.category_title}>{t('Administrative contact')}</h2>
          {values.admin_contact_use_first === 'off' && (
            <Shevron className={cn(s.shevronIcon, { [s.isOpen]: isOpenAdmin })} />
          )}
        </button>
        <div className={s.useFirstCheck}>
          <CheckBox
            value={values.admin_contact_use_first === 'on'}
            onClick={() => {
              setFieldValue(
                `${formType}_contact_use_first`,
                values.admin_contact_use_first === 'on' ? 'off' : 'on',
              )
              if (!values.admin_contact_use_first === 'on') {
                setIsOpenAdmin(true)
              }
            }}
            className={s.checkbox}
            error={!!errors.admin_contact_use_first}
          />
          <span>{t('Use "Contact Owner"')}</span>
        </div>
        <div className={cn(s.ownerForm, { [s.isOpen]: isOpenOwner })}>
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
                    label: t(`${$.trim()}`),
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
                    label: t(`${$.trim()}`),
                    value: $key,
                  }),
                )}
              />
              {/* <div className={s.useFirstCheck}>
                      <CheckBox
                        initialState={values?.owner_private === 'on'}
                        setValue={item => {
                          setFieldValue('owner_private', item ? 'on' : 'off')
                        }}
                        className={s.checkbox}
                      />
                      <span>{t('Hide data in WHOIS')}</span>
                    </div> */}
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
