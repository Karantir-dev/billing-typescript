import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import s from './ServiceCard.module.scss'
import { useTranslation } from 'react-i18next'

export default function ServiceCard(props) {
  const { title, index, route, iconName, iconWidth, iconHeight } = props
  const { t } = useTranslation('other')

  return (
    <li className={s.card}>
      <div className={s.card_container}>
        <div className={s.container}>
          <span className={s.card_numeric}>{'0' + index}</span>
          <h3 className={s.card_title}>{title}</h3>
          <Link to={route}>
            <span className={s.goto}>{t('follow')}</span>
            <span className={s.arrow}>&#10230;</span>
          </Link>

          <div className={s.triangle}>
            {iconName === 'forexbox' && (
              <img
                alt="forexbox_graphic"
                src={
                  iconName &&
                  require('../../../images/services/forexbox_graphic_large.webp')
                }
                className={s.forexbox_graphic}
              />
            )}

            <img
              alt={iconName}
              src={iconName && require(`../../../images/services/${iconName}.webp`)}
              className={s['icon_' + iconName]}
              width={iconWidth}
              height={iconHeight}
            />
          </div>
        </div>
      </div>
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
