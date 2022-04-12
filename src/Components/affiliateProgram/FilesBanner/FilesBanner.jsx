import React from 'react'
import { useTranslation } from 'react-i18next'

import s from './FilesBanner.module.scss'

export default function Banner() {
  const { t } = useTranslation('affiliate_program')

  return (
    <div className={s.banner}>
      <p className={s.banner_text}>{t('about_section.banners_link_caption')}</p>

      <a className={s.download_link} href="stub" download>
        <span className={s.btn_text}>{t('about_section.banners_download_link')}</span>
      </a>
    </div>
  )
}
