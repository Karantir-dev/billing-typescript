import React from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import { userSelectors, selectors } from '../../../Redux'
import { Logo } from './../../../images'
import s from './Loader.module.scss'

export default function Loader({ logo = false }) {
  const isLoading = useSelector(selectors.getIsLoadding)
  const userInfoLoading = useSelector(userSelectors.getUserInfoLoading)

  return (
    <div
      className={cn({
        [s.backdrop]: true,
        [s.main]: logo,
        [s.shown]: isLoading || userInfoLoading,
      })}
    >
      {logo && <Logo />}

      <div className={s.loader}>
        <div className={`${s.loader_circle} ${s.first}`}></div>
        <div className={`${s.loader_circle} ${s.second}`}></div>
        <div className={s.loader_circle}></div>
      </div>
    </div>
  )
}
