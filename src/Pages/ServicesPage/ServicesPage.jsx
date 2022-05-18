import React from 'react'
import ServicesList from '../../Components/Services/ServicesList/ServicesList'
// import { useTranslation } from 'react-i18next'
// import { useSelector } from 'react-redux'

// import { selectors } from '../../Redux'

import s from './ServicesPage.module.scss'

export default function ServicesPage() {
  return (
    <div className={s.wrapper}>
      <ServicesList />
    </div>
  )
}
