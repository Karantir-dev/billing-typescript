import React from 'react'

import { useMediaQuery } from 'react-responsive'

import s from './ForexItem.module.scss'
import { Delete } from '../../../images'

export default function ForexItem(props) {
  const { pricelist_name, deleteItemHandler } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  return (
    <>
      <div className={s.server_item}>
        <div className={s.tarif_info}>
          <div className={s.priceList}>
            {!tabletOrHigher && (
              <div className={s.control_bts_wrapper}>
                {typeof deleteItemHandler === 'function' && (
                  <button
                    className={s.btn_delete}
                    type="button"
                    onClick={deleteItemHandler}
                  >
                    <Delete />
                  </button>
                )}
              </div>
            )}

            <div className={s.server_info}>
              <span className={s.domainName}>{pricelist_name}</span>
            </div>

            {typeof deleteItemHandler === 'function' && tabletOrHigher && (
              <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
                <Delete />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
