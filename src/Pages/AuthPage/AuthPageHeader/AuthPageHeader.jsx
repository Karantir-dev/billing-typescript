import React from 'react'
import PropTypes from 'prop-types'
import { Logo } from '../../../images'
import { ThemeBtn, LangBtn } from '../../../Components'
import { SITE_URL } from '../../../config/config'
import s from './AuthPageHeader.module.scss'

export default function AuthPageHeader(props) {
  const { onLogoClick } = props
  return (
    <header className={s.header}>
      <div className={`container ${s.flex}`}>
        <Logo
          onClick={() => onLogoClick && onLogoClick()}
          svgwidth="105"
          svgheight="48"
        />
        <div className={s.btns_wrapper}>
          <ThemeBtn authType />
          <LangBtn authType />
        </div>
      </div>
    </header>
  )
}

AuthPageHeader.defaultProps = {
  onLogoClick: () => window.open(SITE_URL),
}

AuthPageHeader.propTypes = {
  onLogoClick: PropTypes.func,
}
