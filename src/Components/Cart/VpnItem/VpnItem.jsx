import React from 'react'
import s from './VpnItem.module.scss'

export default function Component(props) {
  const { pricelist_name, itemId } = props

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        <div className={s.domainInfo}>
          <span className={s.domainName}>
            {pricelist_name} #{itemId}
          </span>
        </div>
      </div>
    </div>
  )
}
