import React from 'react'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import s from './ServiceCard.module.scss'

export default function ServiceCard(props) {
  const { title, index, route, iconName, iconWidth, iconHeight } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 1200px)' })
  const desktopOrHigher = useMediaQuery({ query: '(min-width: 1550px)' })

  let graphicIcon = require('../../../images/services/forexbox_graphic.png')

  if (desktopOrHigher) {
    graphicIcon = require('../../../images/services/forexbox_graphic_large.png')
  } else if (tabletOrHigher) {
    graphicIcon = require('../../../images/services/forexbox_graphic_middle.png')
  }

  return (
    <li className={s.card}>
      <div className={s.card_container}>
        <div className={s.container}>
          <span className={s.card_numeric}>{'0' + index}</span>
          <h3 className={s.card_title}>{title}</h3>
          <Link to={route}>
            <span className={s.goto}>Go to</span>
            <span className={s.arrow}>&#10230;</span>
          </Link>

          <div className={s.triangle}>
            {iconName === 'forexbox' && (
              <img
                alt="forexbox_graphic"
                src={iconName && graphicIcon}
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
