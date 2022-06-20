import cn from 'classnames'
import React from 'react'
// import { useSelector } from 'react-redux'
// import { selectors } from '../../../../Redux'

import s from './SoftwareOSBtn.module.scss'

export default function SoftwareOSBtn({
  // iconName,
  label,
  value,
  state,
  onClick,
}) {
  // const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <div className={cn(s.bg, { [s.selected]: value === state })}>
      <button className={s.btn} onClick={() => onClick(value)} type="button">
        {/* <img
          className={s.img}
          src={require(`../../../../images/soft_os/${
            darkTheme ? iconName + '_dt' : iconName
          }.png`)}
          alt="icon"
        /> */}
        {label}
      </button>
    </div>
  )
}
