import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../../../Redux'

import s from './SoftwareOSBtn.module.scss'
import { SOFTWARE_ICONS_LIST } from '../../../../utils/constants'

export default function SoftwareOSBtn({ iconName, label, value, state, onClick }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const inList = SOFTWARE_ICONS_LIST?.includes(iconName)

  const renderImg = () => {
    if (inList) {
      return require(`../../../../images/soft_os/${
        darkTheme ? iconName + '_dt' : iconName
      }.png`)
    }

    if (iconName === 'Rocky') {
      return require('../../../../images/soft_os/Rocky_Linux.png')
    }

    return require(`../../../../images/soft_os/linux-logo${darkTheme ? '_dt' : ''}.png`)
  }

  return (
    <div className={cn(s.bg, { [s.selected]: value === state })}>
      <button className={s.btn} onClick={() => onClick(value)} type="button">
        <img
          className={cn(s.img, `${iconName === 'null' ? s.without : ''}`, {
            [s.notInList]: !inList,
          })}
          src={renderImg()}
          alt="icon"
        />

        {label}
      </button>
    </div>
  )
}
