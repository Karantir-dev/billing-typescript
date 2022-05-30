import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  Button,
  DomainsZone,
  InputField,
  DomainsPickUpZones,
} from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { domainsOperations } from '../../../../Redux'
import * as Yup from 'yup'
import s from './DomainOrderPage.module.scss'

export default function ServicesPage() {
  const { t } = useTranslation(['domains', 'other'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const [domains, setDomains] = useState([])
  const [pickUpDomains, setPickUpDomains] = useState([])

  const [selectedDomains, setSelectedDomains] = useState([])
  const [selectedDomainsNames, setSelectedDomainsNames] = useState([])

  useEffect(() => {
    dispatch(domainsOperations.getDomainsOrderName(setDomains))
  }, [])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const validationSchema = Yup.object().shape({
    domain_name: Yup.string().required(t('Is a required field', { ns: 'other' })),
  })

  const setDomainsNameHandler = values => {
    values['selected_pricelist'] = selectedDomains?.join(', ')
    values['sv_field'] = 'ok_whois'
    selectedDomains.forEach(el => (values[`select_pricelist_${el}`] = 'on'))
    dispatch(domainsOperations.getDomainsOrderName(setPickUpDomains, values, true))
  }

  const registerDomainHandler = () => {
    const selected_domain = selectedDomainsNames?.map(d => d?.domain?.$)
    const selected_domain_names = selectedDomainsNames?.map(
      d => d?.checkbox?.input?.$name,
    )

    const data = {
      domain_name: pickUpDomains?.domain_name,
      'zoom-domain_name': pickUpDomains?.domain_name,
      checked_domain: pickUpDomains?.checked_domain?.$,
      selected_domain: selected_domain.join(', '),
      sv_field: selected_domain_names.join(', '),
    }

    selected_domain_names?.forEach(n => {
      data[n] = 'on'
    })

    dispatch(domainsOperations.registerDomainsOrderName(data, navigate))
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Domain name order')}</h1>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          domain_name: '',
        }}
        onSubmit={setDomainsNameHandler}
      >
        {({ errors, touched }) => {
          return (
            <Form className={s.form}>
              <InputField
                name="domain_name"
                type="text"
                label={`${t('Domain name')}:`}
                placeholder={t('Enter domain name')}
                className={s.input}
                inputWrapperClass={s.inputHeight}
                error={!!errors.domain_name}
                touched={!!touched.domain_name}
                isShadow
              />
              <Button
                className={s.searchBtn}
                isShadow
                size="medium"
                label={t('Pick up')}
                type="submit"
              />
            </Form>
          )
        }}
      </Formik>
      {pickUpDomains?.list?.length > 0 ? (
        <DomainsPickUpZones
          setSelectedDomains={setSelectedDomainsNames}
          selectedDomains={selectedDomainsNames}
          domains={pickUpDomains?.list}
          selected={pickUpDomains?.selected}
          registerDomainHandler={registerDomainHandler}
        />
      ) : (
        <DomainsZone
          setSelectedDomains={setSelectedDomains}
          selectedDomains={selectedDomains}
          domains={domains}
        />
      )}
    </div>
  )
}
