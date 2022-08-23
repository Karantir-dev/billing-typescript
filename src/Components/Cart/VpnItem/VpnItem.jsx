import React from 'react'
import s from './VpnItem.module.scss'

export default function Component(props) {
  const { cost, discount_percent, fullcost, pricelist_name, itemId } = props

  return (
    <div className={s.domainItem}>
      <img src={require('./../../../images/cart/vpn.png')} alt="vpn" />
      <div className={s.priceList}>
        <div className={s.domainInfo}>
          <span className={s.domainName}>
            {pricelist_name} #{itemId}
          </span>
        </div>
        <div className={s.costBlock}>
          <div className={s.cost}>{cost} EUR</div>
          {discount_percent && (
            <div className={s.discountBlock}>
              <span className={s.discountPerCent}>-{discount_percent}</span>
              <span className={s.fullcost}>{fullcost} EUR</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
