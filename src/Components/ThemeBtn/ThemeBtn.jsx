import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions } from '../../Redux/actions'
import { selectors } from '../../Redux/selectors'

import { Moon, Sun } from './../../images'

import s from './ThemeBtn.module.scss'

export default function ThemeBtn() {
  const dispatch = useDispatch()
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const body = document.querySelector('body')

  darkTheme ? body.classList.add('dark-theme') : body.classList.remove('dark-theme')

  return (
    <button
      className={`${s.btn} ${darkTheme ? s.turnedOn : s.turnedOff}`}
      type="button"
      onClick={() => dispatch(actions.changeTheme())}
    >
      <Sun className={s.icon_sun} />
      <Moon className={s.icon_moon} />
    </button>
  )
}
