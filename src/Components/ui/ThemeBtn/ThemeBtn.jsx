import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import PropTypes from 'prop-types'

import { selectors, actions } from '../../../Redux'
import { Moon, Sun } from '../../../images'

import s from './ThemeBtn.module.scss'

export default function ThemeBtn({ burgerType, authType, mainType }) {
  const dispatch = useDispatch()
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const body = document.querySelector('body')

  darkTheme ? body.classList.add('dark-theme') : body.classList.remove('dark-theme')

  return (
    <button
      className={cn({
        [s.btn]: true,
        [s.turnedOn]: darkTheme,
        [s.turnedOff]: !darkTheme,
        [s.burger_type]: burgerType,
        [s.auth_type]: authType,
        [s.main_type]: mainType,
      })}
      type="button"
      onClick={() => dispatch(actions.changeTheme())}
    >
      <Sun className={s.icon_sun} />
      <Moon className={s.icon_moon} />
    </button>
  )
}

ThemeBtn.propTypes = {
  burgerType: PropTypes.bool,
  authType: PropTypes.bool,
  mainType: PropTypes.bool,
}
