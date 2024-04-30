import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { useOutsideAlerter } from '@utils'
import { Icon } from '@components'

import s from './ServicesSelect.module.scss'

export default function ServicesSelect({ setServiseName }) {
  const { t } = useTranslation('affiliate_program', { keyPrefix: 'about_section' })
  const dropdownEl = useRef(null)
  const currentServiceEl = useRef(null)

  const [dropdownOpened, setDropdownOpened] = useState(false)

  const servicesList = [
    { linkName: 'vps', text: t('cloud_vps_option') },
    { linkName: 'big_vds', text: t('cloud_vps_big_option') },
    { linkName: 'dedicated', text: t('dedicated_servers') },
    { linkName: 'virtual', text: t('shared_hosting') },
    { linkName: 'server-for-forex', text: t('servers_for_forex') },
  ]

  const handleBackdropClick = () => {
    setDropdownOpened(false)
    dropdownEl.current.style.height = 0
    dropdownEl.current.style.visibility = 'hidden'
  }

  const handleServiceClick = (linkName, text) => {
    setDropdownOpened(false)
    dropdownEl.current.style.height = 0
    dropdownEl.current.style.visibility = 'hidden'

    if (!currentServiceEl.current.classList.contains(s.selected)) {
      currentServiceEl.current.classList.add(s.selected)
    }

    currentServiceEl.current.textContent = text
    setServiseName(linkName)
  }

  const handleSelectClick = () => {
    const elem = dropdownEl.current
    elem.style.height = elem.scrollHeight + 'px'
    elem.style.visibility = 'visible'

    setDropdownOpened(true)
  }

  useOutsideAlerter(dropdownEl, dropdownOpened, handleBackdropClick)

  return (
    <div className={s.select_wrapper}>
      <div
        className={cn({ [s.select]: true, [s.opened]: dropdownOpened })}
        role="button"
        tabIndex={0}
        onKeyUp={() => {}}
        onClick={handleSelectClick}
        data-testid="custom_select"
      >
        <span className={s.placeholder} ref={currentServiceEl}>
          {t('service_placeholder')}
        </span>
        <Icon name="Shevron" className={s.icon} />
      </div>

      <div
        style={{ visibility: 'hidden' }}
        className={s.dropdown}
        ref={dropdownEl}
        data-testid="services_dropdown"
      >
        {servicesList.map(({ linkName, text }) => {
          return (
            <div
              className={s.service_item}
              key={linkName}
              role="button"
              tabIndex={0}
              onKeyUp={() => {}}
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
