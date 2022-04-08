import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import ServicesSelect from './ServicesSelect/ServicesSelect'

import NavBar from '../NavBar/NavBar'
import s from './AboutAffiliateProgram.module.scss'
import { Copy } from '../../../images'

export default function AboutAffiliateProgram() {
  const { t } = useTranslation('affiliate_program')
  const descrWrapper = useRef(null)

  const [isDescrOpened, setIsDescrOpened] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  console.log(selectedService)
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
        <div className={s.field_wrapper}>
          <label className={s.label}> {t('about_section.service')}: </label>
          <ServicesSelect setSelectedService={setSelectedService} />
        </div>
        <div className={s.field_wrapper}>
          <label className={s.label}> {t('about_section.referral_link')}: </label>
          <div className={s.copy_field}>
            <span className={cn({ [s.field_text]: true, [s.selected]: false })}>
              adsfgsedfaes
            </span>
            <Copy className={cn({ [s.copy_icon]: true, [s.selected]: false })} />
          </div>
        </div>
        <div className={s.field_wrapper}>
          <label className={s.label}> {t('about_section.promocode')}: </label>
          <div className={s.copy_field}>
            <span className={cn({ [s.field_text]: true, [s.selected]: false })}>
              adrgsdfdef
            </span>
            <Copy className={cn({ [s.copy_icon]: true, [s.selected]: false })} />
          </div>
        </div>
      </div>
    </>
  )
}
