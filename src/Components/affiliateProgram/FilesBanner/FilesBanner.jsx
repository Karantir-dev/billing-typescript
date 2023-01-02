import React from 'react'
import { useTranslation } from 'react-i18next'
import i18n from './../../../i18n'

import s from './FilesBanner.module.scss'

export default function Banner({ dataTestid }) {
  const { t } = useTranslation('affiliate_program')

  const isEnglishInterface = i18n.language === 'en'

  return (
    <div className={s.banner} data-testid={dataTestid}>
      <p className={s.banner_text}>{t('about_section.banners_link_caption')}</p>

      <a
        className={s.download_link}
        href={isEnglishInterface ? '/banners.zip' : '/banners.zip'}
        download
      >
        <span className={s.btn_text}>{t('about_section.banners_download_link')}</span>
      </a>
    </div>
  )
}
