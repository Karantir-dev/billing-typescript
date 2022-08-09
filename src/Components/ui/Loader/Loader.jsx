import React from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import { selectors, userSelectors } from '../../../Redux'
import { Logo } from './../../../images'
import s from './Loader.module.scss'

export default function Loader({ logo = false, shown }) {
  const isLoading = useSelector(selectors.getIsLoadding)
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const userInfoLoading = useSelector(userSelectors.getUserInfoLoading)

  return (
    <div
      className={cn({
        [s.backdrop]: true,
        [s.main_lt]: (logo || userInfoLoading) && !darkTheme,
        [s.main_dt]: (logo || userInfoLoading) && darkTheme,
        [s.shown]: isLoading || userInfoLoading || shown,
      })}
    >
      {(logo || userInfoLoading) && <Logo svgwidth="115" svgheight="53" />}

      <div className={s.loader}>
        <div className={`${s.loader_circle} ${s.first}`}></div>
        <div className={`${s.loader_circle} ${s.second}`}></div>
        <div className={s.loader_circle}></div>
      </div>
    </div>
  )
}
