import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import s from './ServiceCardDesktop.module.scss'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

export default function ServiceCard(props) {
  const { title, index, route, iconName, className } = props
  const { t } = useTranslation('other')

  return (
    <li className={cn({ [s.card]: true, [className]: className })}>
      <Link to={route}>
        <div className={s.card_container}>
          <div className={s.container}>
            <span className={s.card_numeric}>{'0' + index}</span>
            <h3 className={s.card_title}>{title}</h3>

            <div>
              <span className={s.goto}>{t('follow')}</span>
              <span className={s.arrow}>&#10230;</span>
            </div>

            <div className={s.triangle}>
              <img
                alt={iconName}
                src={iconName && require(`../../../images/services/${iconName}.webp`)}
                className={cn(s.icon, { [s.forebox]: iconName === 'forexbox' })}
                // width={iconWidth}
                // height={iconHeight}
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
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