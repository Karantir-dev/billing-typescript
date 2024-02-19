import PropTypes from 'prop-types'
import { ThemeBtn, LangBtn, Icon } from '@components'
import s from './AuthPageHeader.module.scss'

export default function AuthPageHeader(props) {
  const { onLogoClick } = props
  return (
    <header className={s.header}>
      <div className={`container ${s.flex}`}>
        <Icon name="Logo"
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
  onLogoClick: () => window.open(process.env.REACT_APP_SITE_URL),
}

AuthPageHeader.propTypes = {
  onLogoClick: PropTypes.func,
}
