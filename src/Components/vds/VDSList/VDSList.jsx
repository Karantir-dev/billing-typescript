import React from 'react'
import { VDSmobileItem } from '../..'

import s from './VDSList.module.scss'

export default function VDSList({ servers, setElidForEditModal }) {
  return (
    <ul className={s.list}>
      {servers?.map(el => {
        return (
          <VDSmobileItem
            key={el.id.$}
            server={el}
            setElidForEditModal={setElidForEditModal}
          />
        )
      })}
    </ul>
  )
}
