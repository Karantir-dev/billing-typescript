import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { useOutsideAlerter } from '../../../../utils'
import { Shevron } from '../../../../images'

import s from './ServicesSelect.module.scss'

export default function ServicesSelect({ setServiseName }) {
  const { t } = useTranslation('affiliate_program', { keyPrefix: 'about_section' })
  const dropdownEl = useRef(null)
  const currentServiceEl = useRef(null)

  const [dropdownOpened, setDropdownOpened] = useState(false)

  const servicesList = [
    { linkName: 'vds', text: t('vds') },
    { linkName: 'big_vds', text: t('big_vds') },
    { linkName: 'dedicated', text: t('dedicated_servers') },
    { linkName: 'virtual', text: t('shared_hosting') },
  ]

  const handleBackdropClick = () => {
    setDropdownOpened(false)
    dropdownEl.current.removeAttribute('style')
  }

  const handleServiceClick = (linkName, text) => {
    setDropdownOpened(false)
    dropdownEl.current.removeAttribute('style')

    if (!currentServiceEl.current.classList.contains(s.selected)) {
      currentServiceEl.current.classList.add(s.selected)
    }

    currentServiceEl.current.textContent = text
    setServiseName(linkName)
  }

  const handleSelectClick = () => {
    dropdownEl.current.style.height = dropdownEl.current.scrollHeight + 'px'
    setDropdownOpened(true)
  }

  useOutsideAlerter(dropdownEl, dropdownOpened, handleBackdropClick)

  return (
    <div className={s.select_wrapper}>
      <div
        className={cn({ [s.select]: true, [s.opened]: dropdownOpened })}
        role="button"
        tabIndex={0}
        onKeyUp={() => null}
        onClick={handleSelectClick}
      >
        <span className={s.placeholder} ref={currentServiceEl}>
          {t('service_placeholder')}
        </span>
        <Shevron className={s.icon} />
      </div>

      <div className={s.dropdown} ref={dropdownEl}>
        {servicesList.map(({ linkName, text }) => {
          return (
            <div
              className={s.service_item}
              key={linkName}
              role="button"
              tabIndex={0}
              onKeyUp={() => null}
              onClick={() => handleServiceClick(linkName, text)}
            >
              {text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
