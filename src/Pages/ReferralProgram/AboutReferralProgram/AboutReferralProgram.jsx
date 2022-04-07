import React from 'react'
import { useTranslation } from 'react-i18next'

import NavBar from '../NavBar/NavBar'
// import s from './AboutReferralProgram.module.scss'

export default function AboutReferralProgram() {
  const { t } = useTranslation('referral_program')
  return (
    <>
      <div style={{ padding: '30px' }}>
        <NavBar />
        <p> {t('about_section_title')} </p>
        <p> {t('about_section.description_1')} </p>
        <p> {t('about_section.description_2')} </p>
        <ul>
          <li>
            <span>15%</span>
            <span> {t('about_section.virtual_servers')} </span>
          </li>
          <li>
            <span>40%</span>
            <span> {t('about_section.shared_hosting')} </span>
          </li>
          <li>
            <span>15%</span>
            <span> {t('about_section.dedicated_servers')} </span>
          </li>
        </ul>
        <p>{t('about_section.referral_link')}</p>
      </div>
    </>
  )
}
