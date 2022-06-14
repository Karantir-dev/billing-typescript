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
import * as route from '../../../../routes'
import * as Yup from 'yup'
import s from './DomainOrderPage.module.scss'

export default function ServicesPage({ transfer = false }) {
  const { t } = useTranslation(['domains', 'other'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const [domains, setDomains] = useState([])
  const [pickUpDomains, setPickUpDomains] = useState([])

  const [selectedDomains, setSelectedDomains] = useState([])
  const [selectedDomainsNames, setSelectedDomainsNames] = useState([])

  useEffect(() => {
    if (transfer) {
      const dataTransfer = { domain_action: 'transfer' }
      dispatch(domainsOperations.getDomainsOrderName(setDomains, dataTransfer))
    } else {
      dispatch(domainsOperations.getDomainsOrderName(setDomains))
    }
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
    if (transfer) {
      values['domain_action'] = 'transfer'
    }
    dispatch(domainsOperations.getDomainsOrderName(setPickUpDomains, values, true))
  }

  const registerDomainHandler = () => {
    const selected_domain_names = selectedDomainsNames?.map(
      d => d?.checkbox?.input?.$name,
    )

    const checkedDomain = pickUpDomains?.checked_domain?.$?.split(', ')
    const newCheckedDomains = []

    const selected_domain = []
    selected_domain_names?.forEach(el => {
      const newString = el.replace('select_domain_', '')
      selected_domain?.push(newString)
      checkedDomain.forEach(checked => {
        const check = checked.substring(0, checked.length - 1) + '1'
        if (checked?.includes(newString)) {
          newCheckedDomains.push(check)
        }
      })
    })

    const selected_domain_real_name = selectedDomainsNames?.map(d => d?.domain?.$)

    const data = {
      domain_name: pickUpDomains?.domain_name,
      'zoom-domain_name': pickUpDomains?.domain_name,
      checked_domain: newCheckedDomains?.join(', '),
      selected_domain: selected_domain.join(', '),
      selected_domain_real_name: selected_domain_real_name.join(', '),
    }

    selected_domain_names?.forEach(n => {
      data[n] = 'on'
    })

    if (transfer) {
      data['domain_action'] = 'transfer'
    }

    navigate &&
      navigate(
        transfer ? route.DOMAINS_TRANSFER_CONTACT_INFO : route.DOMAINS_CONTACT_INFO,
        { state: { domainInfo: data } },
      )
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>
        {transfer ? t('Domain name transfer') : t('Domain name order')}
      </h1>
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
                label={t(transfer ? 'Check' : 'Pick up')}
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
          transfer={transfer}
        />
      ) : (
        <DomainsZone
          setSelectedDomains={setSelectedDomains}
          selectedDomains={selectedDomains}
          domains={domains}
          transfer={transfer}
        />
      )}
    </div>
  )
}
