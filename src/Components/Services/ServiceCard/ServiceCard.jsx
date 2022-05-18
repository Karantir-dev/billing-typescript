import React from 'react'
import { Link } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
// import { useSelector } from 'react-redux'

// import { selectors } from '../../Redux'

import s from './ServiceCard.module.scss'

export default function ServiceCard(props) {
  const { title, id, icon, route, allowedToRender } = props

  return (
    <>
      {allowedToRender && (
        <li className={s.card}>
          <div className={s.container}>
            <span className={s.card_numeric}>{id}</span>
            <h3 className={s.card_title}>{title}</h3>
            <Link to={route}>
              <span>Go to</span>
              <span>&lt;</span>
            </Link>
          </div>

          <div>{icon}</div>
        </li>
      )}
    </>
  )
}
