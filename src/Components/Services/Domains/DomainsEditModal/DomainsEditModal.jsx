import React, { useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Cross, Shevron } from '../../../../images'
import { InputField, Button, Select, CustomPhoneInput, CheckBox } from '../../..'
import { Formik, Form } from 'formik'
import s from './DomainsEditModal.module.scss'
import { BASE_URL } from '../../../../config/config'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, closeEditModalHandler, editData, editSaveDomainHandler } = props

  const [isOpenProfile, setIsOpenProfile] = useState(false)

  const initialValues = {
    autoprolong: editData?.autoprolong || '',
    stored_method: editData?.stored_method || '',
    domain: editData?.domain || '',
    service_profile_owner: editData?.service_profile_owner || '',

    email: editData?.email || '',
    lastname: editData?.lastname || '',
    lastname_locale: editData?.lastname_locale || '',
    firstname: editData?.firstname || '',
    firstname_locale: editData?.firstname_locale || '',

    location_address: editData?.location_address || '',
    location_city: editData?.location_city || '',
    location_country: editData?.location_country || '',
    location_postcode: editData?.location_postcode || '',
    location_state: editData?.location_state || '',
    middlename: editData?.middlename || '',
    middlename_locale: editData?.middlename_locale || '',
    name: editData?.name || '',
    phone: editData?.phone || '',

    private: editData?.private || '',
    profiletype: editData?.profiletype || '',
  }

  if (editData?.addon) {
    initialValues[editData?.addon] = editData[editData?.addon]?.$
  }

  return (
    <div className={cn(s.modalBg, { [s.profileOpened]: isOpenProfile })}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>
            {t('Service editing')} - {name}
          </span>
          <Cross onClick={closeEditModalHandler} className={s.crossIcon} />
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={values => editSaveDomainHandler(values, isOpenProfile)}
        >
          {({ errors, touched, values, setFieldValue, handleBlur }) => {
            return (
              <Form>
                <div className={s.form}>
                  <div className={s.formBlock}>
                    <h2 className={s.category_title}>{t('Main')}</h2>
                    <div className={s.formFieldsBlock}>
                      <Select
                        label={`${t('Auto renewal')}:`}
                        placeholder={t('Not selected')}
                        value={values.autoprolong}
                        getElement={item => setFieldValue('autoprolong', item)}
                        isShadow
                        itemsList={editData?.autoprolong_list?.map(({ $key, $ }) => ({
                          label: $.trim(),
                          value: $key,
                        }))}
                        className={s.select}
                      />
                      {values?.autoprolong && values?.autoprolong !== 'null' && (
                        <Select
                          label={`${t('Payment method')}:`}
                          placeholder={t('Not selected')}
                          value={values.stored_method}
                          getElement={item => setFieldValue('stored_method', item)}
                          isShadow
                          itemsList={editData?.stored_method_list?.map(({ $key, $ }) => ({
                            label: $.trim(),
                            value: $key,
                          }))}
                          className={s.select}
                        />
                      )}
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'domain'}
                        label={`${t('Domain name')}:`}
                        placeholder={t('Enter text', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.domain}
                        touched={!!touched.domain}
                      />
                      <div className={s.dates}>
                        <div>
                          {t('Date of creation')}: {editData?.createdate}
                        </div>
                        <div>
                          {t('Valid until')}: {editData?.expiredate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={null}
                    onClick={() => setIsOpenProfile(!isOpenProfile)}
                    className={s.category_title}
                  >
                    {t('Service profiles')}
                    <Shevron
                      className={cn(s.shevronIcon, { [s.isOpen]: isOpenProfile })}
                    />
                  </div>

                  <div className={cn(s.ownerForm, { [s.isOpen]: isOpenProfile })}>
                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>1. {t('Main parameters')}</div>
                      <div className={s.profileWarn}>
                        {t('This profile is used by one or several services')}
                      </div>
                      <div className={s.formFieldsBlock}>
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="name"
                          label={`${t('Profile name')}:`}
                          placeholder={t('Enter data', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.name}
                          touched={!!touched.name}
                          isRequired
                        />
                        <Select
                          placeholder={t('Not chosen', { ns: 'other' })}
                          label={`${t('Contact type')}:`}
                          value={values.profiletype}
                          getElement={item => setFieldValue('profiletype', item)}
                          isShadow
                          className={s.select}
                          disabled
                          itemsList={editData?.profiletype_list?.map(({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }))}
                        />
                        <div className={s.useFirstCheck}>
                          <CheckBox
                            initialState={editData?.private === 'on'}
                            setValue={item => {
                              setFieldValue('private', item ? 'on' : 'off')
                            }}
                            className={s.checkbox}
                          />
                          <span>{t('Hide data in WHOIS')}</span>
                        </div>
                      </div>
                    </div>

                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>
                        2. {t('Contact person details')}
                      </div>
                      <div className={s.formFieldsBlock}>
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="firstname_locale"
                          label={`${t('Name', { ns: 'other' })}:`}
                          placeholder={t('Enter name', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.firstname_locale}
                          touched={!!touched.firstname_locale}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="firstname"
                          label={`${t('Name', { ns: 'other' })} (EN):`}
                          placeholder={t('Enter name', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.firstname}
                          touched={!!touched.firstname}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="lastname_locale"
                          label={`${t('Surname', { ns: 'other' })}:`}
                          placeholder={t('Enter surname', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.lastname_locale}
                          touched={!!touched.lastname_locale}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="lastname"
                          label={`${t('Surname', { ns: 'other' })} (EN):`}
                          placeholder={t('Enter surname', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.lastname}
                          touched={!!touched.lastname}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="middlename_locale"
                          label={`${t('Middle name', { ns: 'other' })}:`}
                          placeholder={t('Enter middle name', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.middlename_locale}
                          touched={!!touched.middlename_locale}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="middlename"
                          label={`${t('Middle name', { ns: 'other' })} (EN):`}
                          placeholder={t('Enter middle name', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.middlename}
                          touched={!!touched.middlename}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          type="email"
                          name="email"
                          label={`${t('Email')}:`}
                          placeholder={t('Enter email', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.email}
                          touched={!!touched.email}
                          isRequired
                        />
                        <CustomPhoneInput
                          containerClass={s.phoneInputContainer}
                          inputClass={s.phoneInputClass}
                          value={values.phone}
                          wrapperClass={s.phoneInput}
                          labelClass={s.phoneInputLabel}
                          label={`${t('Phone', { ns: 'other' })}:`}
                          handleBlur={handleBlur}
                          setFieldValue={setFieldValue}
                          name="phone"
                          isRequired
                        />
                      </div>
                    </div>

                    <div className={s.formBlock}>
                      <div className={s.formBlockTitle}>3. {t('Contact address')}</div>
                      <div className={s.formFieldsBlock}>
                        <Select
                          placeholder={t('Not chosen', { ns: 'other' })}
                          label={`${t('The country', { ns: 'other' })}:`}
                          value={values.location_country}
                          getElement={item => setFieldValue('location_country', item)}
                          isShadow
                          className={s.select}
                          itemsList={editData?.location_country_list?.map(
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
                          error={errors?.location_country}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="location_postcode"
                          label={`${t('Index', { ns: 'other' })}:`}
                          placeholder={t('Enter index', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.location_postcode}
                          touched={!!touched.location_postcode}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="location_state"
                          label={`${t('Region', { ns: 'other' })}:`}
                          placeholder={t('Enter region', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.location_state}
                          touched={!!touched.location_state}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="location_city"
                          label={`${t('City', { ns: 'other' })}:`}
                          placeholder={t('Enter city', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.location_city}
                          touched={!!touched.location_city}
                          isRequired
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name="location_address"
                          label={`${t('The address', { ns: 'other' })}:`}
                          placeholder={t('Enter address', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors.location_address}
                          touched={!!touched.location_address}
                          isRequired
                        />
                      </div>
                    </div>
                  </div>

                  {editData?.isAddon && (
                    <div className={s.formBlock}>
                      <h2 className={s.category_title}>{t('Additionally')}</h2>
                      <div className={s.formFieldsBlock}>
                        <div className={s.useFirstCheck}>
                          <CheckBox
                            initialState={editData[editData?.addon]?.$ === 'on'}
                            setValue={item => {
                              setFieldValue(editData?.addon, item ? 'on' : 'off')
                            }}
                            className={s.checkbox}
                          />
                          <span>
                            {t('Data protection ({{sum}} EUR per year)', { sum: '0.00' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    onClick={closeEditModalHandler}
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
      </div>
    </div>
  )
}
