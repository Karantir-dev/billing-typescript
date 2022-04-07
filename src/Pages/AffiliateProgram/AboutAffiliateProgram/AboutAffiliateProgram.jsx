import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import NavBar from '../NavBar/NavBar'
import s from './AboutAffiliateProgram.module.scss'

export default function AboutAffiliateProgram() {
  const { t } = useTranslation('affiliate_program')
  const descrWrapper = useRef(null)

  const [isDescrOpened, setIsDescrOpened] = useState(false)

  const toggleDescrHeight = () => {
    if (!isDescrOpened) {
      descrWrapper.current.style.height = descrWrapper.current.scrollHeight + 25 + 'px'
    } else {
      descrWrapper.current.removeAttribute('style')
    }
    setIsDescrOpened(!isDescrOpened)
  }

  return (
    <>
      <div style={{ padding: '30px' }}>
        <NavBar />

        <p className={s.description_title}> {t('about_section_title')} </p>
        <div className={s.description_wrapper} ref={descrWrapper}>
          <p className={s.paragraph}> {t('about_section.description_1')} </p>
          <p className={s.paragraph}> {t('about_section.description_2')} </p>
        </div>

        <button className={s.btn_more} type="button" onClick={toggleDescrHeight}>
          {t('about_section.read_more')}
        </button>

        <ul className={s.percents_list}>
          <li className={s.percents_item}>
            <span className={s.percent}>15%</span>
            <span className={s.percents_categories}>
              {t('about_section.virtual_servers')}
            </span>
          </li>
          <li className={s.percents_item}>
            <span className={s.percent}>40%</span>
            <span className={s.percents_categories}>
              {t('about_section.shared_hosting')}
            </span>
          </li>
          <li className={s.percents_item}>
            <span className={s.percent}>15%</span>
            <span className={s.percents_categories}>
              {t('about_section.dedicated_servers')}
            </span>
          </li>
        </ul>

        <p className={s.link_title}>{t('about_section.referral_link')}</p>
      </div>
    </>
  )
}
