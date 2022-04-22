import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import { ServicesSelect, FilesBanner } from '../../../Components'
import { Copy } from '../../../images'
import { affiliateSelectors } from '../../../Redux'
import { affiliateProgramOperations } from '../../../Redux/affiliateProgram/operations'

import animations from './animations.module.scss'
import s from './AboutAffiliateProgram.module.scss'

export default function AboutAffiliateProgram() {
  const { t } = useTranslation(['affiliate_program'])
  const dispatch = useDispatch()
  const higherThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const higherThan1550px = useMediaQuery({ query: '(min-width: 1550px)' })
  const descrWrapper = useRef(null)
  const refLinkEl = useRef(null)
  const promocodeEl = useRef(null)
  const referralLink = useSelector(affiliateSelectors.getRefLink)
  const promocode = useSelector(affiliateSelectors.getPromocode)

  const [isDescrOpened, setIsDescrOpened] = useState(false)
  const [serviceSelected, setServiceSelected] = useState(false)
  const [promocodeCopied, setPromocodeCopied] = useState(false)
  const [refLinkCopied, setRefLinkCopied] = useState(false)

  useEffect(() => {
    if (referralLink) {
      return
    }
    dispatch(affiliateProgramOperations.getReferralLink())
  }, [])

  const showPrompt = fn => {
    fn(true)

    setTimeout(() => {
      fn(false)
    }, 2000)
  }

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

      showPrompt(setRefLinkCopied)
      navigator.clipboard.writeText(el.current.textContent)
    } else {
      showPrompt(setPromocodeCopied)
      navigator.clipboard.writeText(el.current.textContent)
    }
  }

  return (
    <>
      <p className={s.description_title}> {t('about_section_title')} </p>

      <div className={s.notebook_wrapper}>
        <div className={s.tablet_wrapper}>
          <div className={s.description_wrapper} ref={descrWrapper}>
            <p className={s.paragraph}> {t('about_section.description_1')} </p>
            <p className={s.paragraph}> {t('about_section.description_2')} </p>
          </div>

          {!higherThanMobile && (
            <button
              className={s.btn_more}
              type="button"
              onClick={toggleDescrHeight}
              data-testid="btn_more"
            >
              {t('read_more', { ns: 'other' })}
            </button>
          )}

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
        </div>
        {higherThan1550px && <FilesBanner dataTestid="descktop_banner" />}
      </div>

      <p className={s.link_title}>{t('about_section.referral_link')}</p>

      <div className={s.fields_list}>
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
            data-testid={'ref_link_field'}
          >
            <span
              className={cn(s.field_text, { [s.selected]: serviceSelected })}
              ref={refLinkEl}
            >
              {t('about_section.referral_link')}
            </span>
            <Copy className={cn(s.copy_icon, { [s.selected]: serviceSelected })} />

            <CSSTransition
              in={refLinkCopied}
              classNames={animations}
              timeout={150}
              unmountOnExit
            >
              <div className={s.copy_prompt}>
                <div className={s.prompt_pointer}></div>
                {t('about_section.link_copied')}
              </div>
            </CSSTransition>
          </div>
        </div>

        <div className={s.field_wrapper}>
          <label className={s.label}>{t('about_section.promocode')}:</label>
          <div
            className={s.copy_field}
            onClick={() => handleCopyText(promocodeEl)}
            role="button"
            tabIndex={0}
            onKeyUp={() => null}
            data-testid="promocode_field"
          >
            <span className={cn(s.field_text, s.selected)} ref={promocodeEl}>
              {promocode}
            </span>
            <Copy className={cn(s.copy_icon, s.selected)} />
            <CSSTransition
              in={promocodeCopied}
              classNames={animations}
              timeout={150}
              unmountOnExit
            >
              <div className={s.copy_prompt}>
                <div className={s.prompt_pointer}></div>
                {t('about_section.promocode_copied')}
              </div>
            </CSSTransition>
          </div>
        </div>
      </div>

      {!higherThan1550px && <FilesBanner dataTestid="mobile_banner" />}
    </>
  )
}
