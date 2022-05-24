import React, { useEffect, useState } from 'react'
import { BreadCrumbs, Button, DomainsZone, InputField } from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './DomainOrderPage.module.scss'
import { Formik, Form } from 'formik'
import { domainsOperations } from '../../../../Redux'

export default function ServicesPage() {
  const { t } = useTranslation(['domains', 'other'])
  const dispatch = useDispatch()

  const location = useLocation()

  const [domains, setDomains] = useState([])

  useEffect(() => {
    dispatch(domainsOperations.getDomainsOrderInfo(setDomains))
  }, [])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Domain name order')}</h1>
      <Formik
        initialValues={{
          value: '',
        }}
        onSubmit={values => console.log(values)}
      >
        {({ errors, touched }) => {
          return (
            <Form className={s.form}>
              <InputField
                name="value"
                type="text"
                label={`${t('Domain name')}:`}
                placeholder={t('Enter domain name')}
                className={s.input}
                inputWrapperClass={s.inputHeight}
                error={!!errors.value}
                touched={!!touched.value}
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
      <DomainsZone domains={domains} />
    </div>
  )
}
