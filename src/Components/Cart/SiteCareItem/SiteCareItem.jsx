import React from 'react'
import s from './SiteCareItem.module.scss'

export default function Component(props) {
  const { pricelist_name, itemId } = props

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        <span className={s.domainName}>
          {pricelist_name} #{itemId}
        </span>
      </div>
    </div>
  )
}
