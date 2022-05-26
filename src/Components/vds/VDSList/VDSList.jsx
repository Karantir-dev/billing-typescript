import React from 'react'
import { VDSItem } from '../..'

import s from './VDSList.module.scss'

export default function VDSList({ servers }) {
  return (
    <ul className={s.list}>
      {servers?.map(el => {
        return <VDSItem key={el.id.$} server={el} />
      })}
    </ul>
  )
}
