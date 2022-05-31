import React, { useEffect, useState } from 'react'
import { BreadCrumbs, InputField, Button, CheckBox } from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Formik, Form } from 'formik'
import s from './DomainsNsPage.module.scss'
import { domainsOperations } from '../../../../Redux'

export default function ServicesPage() {
  const { t } = useTranslation(['domains', 'trusted_users'])
  const dispatch = useDispatch()

  const location = useLocation()

  const [selectedDomain, setSelectedDomain] = useState([])
  const [initialValues, setInitialValues] = useState({})

  const [differentNS, setDifferentNS] = useState(false)

  const { state } = location

  useEffect(() => {
    setSelectedDomain(state?.contacts?.selected_domain?.split(', '))
    dispatch(domainsOperations.getDomainPaymentInfo(state?.contacts))
  }, [])

  useEffect(() => {
    const data = {}
    if (selectedDomain.length > 1 && differentNS) {
      selectedDomain.forEach(el => {
        data[`domainparam_${el}_ns0`] = ''
        data[`domainparam_${el}_ns1`] = ''
        data[`domainparam_${el}_ns2`] = ''
        data[`domainparam_${el}_ns3`] = ''
        data[`domainparam_${el}_ns_additional`] = ''
      })
    } else {
      data['ns0'] = ''
      data['ns1'] = ''
      data['ns2'] = ''
      data['ns3'] = ''
      data['ns_additional'] = ''
    }
    setInitialValues(data)
  }, [selectedDomain, differentNS])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Name servers')}</h1>
      <div className={s.instructionNS}>{t('Instruction NS')}</div>
      {selectedDomain.length > 1 && (
        <div className={s.useFirstCheck}>
          <CheckBox
            initialState={differentNS}
            setValue={setDifferentNS}
            className={s.checkbox}
          />
          <span>{t('Private name servers for each domain')}</span>
        </div>
      )}
      {selectedDomain?.length > 0 && (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={values => console.log(values)}
        >
          {({ errors, touched }) => {
            return (
              <Form className={s.form}>
                <>
                  {differentNS ? (
                    selectedDomain?.map((select, index) => {
                      return (
                        <div key={select} className={s.formBlock}>
                          <div className={s.formBlockTitle}>
                            {
                              state?.contacts?.selected_domain_real_name?.split(', ')[
                                index
                              ]
                            }
                          </div>
                          <div className={s.formFieldsBlock}>
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns0`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns0`]}
                              touched={!!touched[`domainparam_${select}_ns0`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns1`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns1`]}
                              touched={!!touched[`domainparam_${select}_ns1`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns2`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns2`]}
                              touched={!!touched[`domainparam_${select}_ns2`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns3`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns3`]}
                              touched={!!touched[`domainparam_${select}_ns3`]}
                            />
                            <InputField
                              inputWrapperClass={s.inputHeight}
                              name={`domainparam_${select}_ns_additional`}
                              label={`${t('NS')}:`}
                              placeholder={t('Enter text', { ns: 'other' })}
                              isShadow
                              className={s.input}
                              error={!!errors[`domainparam_${select}_ns_additional`]}
                              touched={!!touched[`domainparam_${select}_ns_additional`]}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className={s.formBlock}>
                      <div className={s.formFieldsBlock}>
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns0'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['s0']}
                          touched={!!touched['ns0']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns1'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns1']}
                          touched={!!touched['ns1']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns2'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns2']}
                          touched={!!touched['ns2']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns3'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns3']}
                          touched={!!touched['ns3']}
                        />
                        <InputField
                          inputWrapperClass={s.inputHeight}
                          name={'ns_additional'}
                          label={`${t('NS')}:`}
                          placeholder={t('Enter text', { ns: 'other' })}
                          isShadow
                          className={s.input}
                          error={!!errors['ns_additional']}
                          touched={!!touched['ns_additional']}
                        />
                      </div>
                    </div>
                  )}
                  <div className={s.formBlock}>
                    <h1 className={s.page_title}>{t('Service parameters')}</h1>
                    <div className={s.formFieldsBlock}>
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'ns0'}
                        label={`${t('NS')}:`}
                        placeholder={t('Enter text', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors['s0']}
                        touched={!!touched['ns0']}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'ns1'}
                        label={`${t('NS')}:`}
                        placeholder={t('Enter text', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors['ns1']}
                        touched={!!touched['ns1']}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'ns2'}
                        label={`${t('NS')}:`}
                        placeholder={t('Enter text', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors['ns2']}
                        touched={!!touched['ns2']}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'ns3'}
                        label={`${t('NS')}:`}
                        placeholder={t('Enter text', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors['ns3']}
                        touched={!!touched['ns3']}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'ns_additional'}
                        label={`${t('NS')}:`}
                        placeholder={t('Enter text', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors['ns_additional']}
                        touched={!!touched['ns_additional']}
                      />
                    </div>
                  </div>
                  <div className={s.btnBlock}>
                    <Button
                      className={s.saveBtn}
                      isShadow
                      size="medium"
                      label={t('Proceed', { ns: 'other' })}
                      type="submit"
                    />
                    <button onClick={() => null} type="button" className={s.cancel}>
                      {t('Cancel', { ns: 'other' })}
                    </button>
                  </div>
                </>
              </Form>
            )
          }}
        </Formik>
      )}
    </div>
  )
}

// domainparam_bla_loo____________ac_ns0:
// domainparam_bla_loo____________ac_ns1:
// domainparam_bla_loo____________ac_ns2:
// domainparam_bla_loo____________ac_ns3:
// domainparam_bla_loo____________ac_ns_additional:
