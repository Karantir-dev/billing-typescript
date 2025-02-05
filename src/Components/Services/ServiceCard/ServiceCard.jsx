import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import s from './ServiceCard.module.scss'

export default function ServiceCard(props) {
  const { title, index, route, iconName, iconWidth, iconHeight, className } = props
  const { t } = useTranslation('other')

  return (
    <div className={cn({ [s.card]: true, [className]: className })} data-service-card>
      <Link to={route}>
        <div className={s.card_container}>
          <div className={s.container}>
            <span className={s.card_numeric}>{index.toString().padStart(2, '0')}</span>
            <h3 className={s.card_title}>{title}</h3>

            <div>
              <span className={s.goto}>{t('follow')}</span>
              <span className={s.arrow}>&#10230;</span>
            </div>

            <div className={s.triangle}>
              <img
                alt={iconName}
                src={iconName && require(`@images/services/${iconName}.webp`)}
                className={cn(s['icon_' + iconName], {
                  [s.forexbox]: iconName === 'forexbox',
                })}
                width={iconWidth}
                height={iconHeight}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

ServiceCard.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number,
  route: PropTypes.string,
  iconName: PropTypes.string,
  iconWidth: PropTypes.string,
  iconHeight: PropTypes.string,
}
