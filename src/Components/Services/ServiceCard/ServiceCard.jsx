import React from 'react'
import { Link } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
// import { useSelector } from 'react-redux'

// import { selectors } from '../../Redux'

import s from './ServiceCard.module.scss'

export default function ServiceCard(props) {
  const { title, id, route, allowedToRender, iconName, iconWidth, iconHeight } = props

  return (
    <>
      {allowedToRender && (
        <li className={s.card}>
          <div className={s.container}>
            <span className={s.card_numeric}>{'0' + id}</span>
            <h3 className={s.card_title}>{title}</h3>
            <Link to={route}>
              <p className={s.link}>
                <span className={s.goto}>Go to</span>
                <span>&#10230;</span>
              </p>
            </Link>

            <div className={s.triangle}>
              {iconName === 'forexbox' && (
                <img
                  alt="forexbox_graphic"
                  src={
                    iconName && require('../../../images/services/forexbox_graphic.png')
                  }
                  className={s.forexbox_graphic}
                />
              )}

              <img
                alt={iconName}
                src={iconName && require(`../../../images/services/${iconName}.png`)}
                className={s['icon_' + iconName]}
                width={iconWidth}
                height={iconHeight}
              />
            </div>
          </div>
        </li>
      )}
    </>
  )
}
