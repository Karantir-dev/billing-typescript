import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import ServicesSelect from './ServicesSelect/ServicesSelect'

import NavBar from '../NavBar/NavBar'
import s from './AboutAffiliateProgram.module.scss'
import { Copy } from '../../../images'
import { useDispatch } from 'react-redux'
import { affiliateProgramOperations } from '../../../Redux/affiliateProgram/operations'
import * as route from '../../../routes'

export default function AboutAffiliateProgram() {
  const { t } = useTranslation('affiliate_program')
  const dispatch = useDispatch()
  const descrWrapper = useRef(null)
  const refLinkEl = useRef(null)
  const promocodeEl = useRef(null)

  const [referralLink, setReferralLink] = useState('')
  const [promocode, setPromocode] = useState('')
  const [isDescrOpened, setIsDescrOpened] = useState(false)

  const [serviceSelected, setServiceSelected] = useState(false)

  useEffect(() => {
    dispatch(affiliateProgramOperations.getReferralLink(setReferralLink, setPromocode))
  }, [])

  const toggleDescrHeight = () => {
    if (!isDescrOpened) {
      descrWrapper.current.style.height = descrWrapper.current.scrollHeight + 25 + 'px'
    } else {
      descrWrapper.current.removeAttribute('style')
    }
    setIsDescrOpened(!isDescrOpened)
  }

  const handleRefLinkCreating = linkName => {
    const arr = referralLink.split('')
    arr.splice(18, 0, linkName)
    refLinkEl.current.textContent = arr.join('')
    setServiceSelected(true)
  }

  const handleCopyText = el => {
    if (el.current === refLinkEl.current) {
      if (!serviceSelected) {
        return
      }

      navigator.clipboard.writeText(el.current.textContent)
    } else {
      navigator.clipboard.writeText(el.current.textContent)
    }
  }

  const navBarSections = [
    { route: route.AFFILIATE_PROGRAM_ABOUT, label: t('about_section_title') },
    { route: route.AFFILIATE_PROGRAM_INCOME, label: t('income_section_title') },
    { route: route.AFFILIATE_PROGRAM_STATISTICS, label: t('statistics_section_title') },
  ]
  return (
    <>
      <div style={{ padding: '30px' }}>
        <NavBar sections={navBarSections} />
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
          <ServicesSelect setServiseName={handleRefLinkCreating} />
        </div>

        <div className={s.field_wrapper}>
          <label className={s.label}> {t('about_section.referral_link')}: </label>
          <div
            className={s.copy_field}
            onClick={() => handleCopyText(refLinkEl)}
            role="button"
            tabIndex={0}
            onKeyUp={() => null}
          >
            <span
              className={cn({ [s.field_text]: true, [s.selected]: serviceSelected })}
              ref={refLinkEl}
            >
              {t('about_section.referral_link')}
            </span>
            <Copy
              className={cn({ [s.copy_icon]: true, [s.selected]: serviceSelected })}
            />

            <div className={s.copy_prompt}>{t('about_section.link_copied')}</div>
          </div>
        </div>

        <div className={s.field_wrapper}>
          <label className={s.label}> {t('about_section.promocode')}: </label>
          <div
            className={s.copy_field}
            onClick={() => handleCopyText(promocodeEl)}
            role="button"
            tabIndex={0}
            onKeyUp={() => null}
          >
            <span
              className={cn({ [s.field_text]: true, [s.selected]: true })}
              ref={promocodeEl}
            >
              {promocode}
            </span>
            <Copy className={cn({ [s.copy_icon]: true, [s.selected]: true })} />

            <div className={s.copy_prompt}>{t('about_section.promocode_copied')}</div>
          </div>
        </div>
      </div>
    </>
  )
}
