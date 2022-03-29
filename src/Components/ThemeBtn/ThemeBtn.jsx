import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { Icon } from '..'
import { actions } from '../../Redux/actions'
import { selectors } from '../../Redux/selectors'

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
      <Icon className={`${s.icon_sun}`} name="sun" />
      <Icon className={`${s.icon_moon}`} name="moon" />
    </button>
  )
}
