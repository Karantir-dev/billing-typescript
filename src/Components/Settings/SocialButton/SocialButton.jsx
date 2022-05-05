import React from 'react'
import s from './SocialButton.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

export default function Component(props) {
  const { onClick, disabled, children, className, dataTestid, isNotConnected, platform } =
    props

  const { t } = useTranslation('user_settings')

  return (
    <div className={s.socialItem}>
      <button
        data-testid={dataTestid}
        disabled={disabled}
        className={cn({
          [s.icon_btn]: true,
          [s.notConnected]: isNotConnected,
          [className]: className,
        })}
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
      <div className={s.linkTo}>
        {t('Link to')} {platform}
      </div>
    </div>
  )
}

Component.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  dataTestid: PropTypes.string,
  platform: PropTypes.string,
  notConnected: PropTypes.bool,
}

Component.defaultProps = {
  onClick: () => null,
  disabled: false,
  notConnected: true,
}
