import React from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import { selectors } from '../../Redux/selectors'
import logo_dt from '../../images/logo-dt.svg'
import logo_lt from '../../images/logo-lt.svg'
import s from './Loader.module.scss'

export function Loader({ logo = false }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const isLoading = useSelector(selectors.getIsLoadding)
  console.log(isLoading)

  return (
    <div className={cn({ [s.backdrop]: true, [s.main]: logo, [s.shown]: isLoading })}>
      {logo && (
        <img
          width="200px"
          className="loader__logo"
          src={darkTheme ? logo_dt : logo_lt}
          alt="logo"
          onload="this.style.opacity = '1'"
        />
      )}

      <div className={s.loader}>
        <div className={`${s.loader_circle} ${s.first}`}></div>
        <div className={`${s.loader_circle} ${s.second}`}></div>
        <div className={s.loader_circle}></div>
      </div>
    </div>
  )
}
