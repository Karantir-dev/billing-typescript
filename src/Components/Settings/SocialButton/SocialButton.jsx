import s from './SocialButton.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

export default function SocialButton(props) {
  const { onClick, disabled, children, className, dataTestid, isNotConnected, platform } =
    props

  const { t } = useTranslation('user_settings')

  return (
    <div className={s.socialItem}>
      <button
        data-testid={dataTestid}
        disabled={disabled}
        className={s.link_btn}
        type="button"
        onClick={onClick}
      >
        <div
          className={cn({
            [s.icon_btn]: true,
            [s.notConnected]: isNotConnected,
            [className]: className,
          })}
        >
          {children}
        </div>

        <div className={s.linkTo}>
          {isNotConnected ? t('Link to') : t('disconnect from')} {platform}
        </div>
      </button>
    </div>
  )
}

SocialButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  dataTestid: PropTypes.string,
  platform: PropTypes.string,
  notConnected: PropTypes.bool,
}

SocialButton.defaultProps = {
  onClick: () => null,
  disabled: false,
  notConnected: true,
}
