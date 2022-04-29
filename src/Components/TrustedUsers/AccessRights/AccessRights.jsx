import React, { useState } from 'react'

import s from './AccessRights.module.scss'
import AccessRightsListItem from './AccessRightsListItem/AccessRightsListItem'

export default function AccessRights({ items, userId }) {
  const modifiedList = items.map(item => {
    const newObj = JSON.parse(JSON.stringify(item))

    newObj.isSelected = false

    return newObj
  })

  const [listArr, setListArr] = useState(modifiedList)

  const handleSelect = item => {
    const filter = listArr.map(el => {
      if (item.name.$ === el.name.$) {
        const act = item.name.$
        console.log(act)
        return { ...el, isSelected: !el.isSelected }
      } else {
        return { ...el, isSelected: false }
      }
    })

    setListArr([...filter])
  }

  return (
    <ul className={s.list}>
      {listArr.map((item, index) => {
        return (
          <div className={s.access_rights} key={index}>
            <AccessRightsListItem
              handleSelect={handleSelect}
              item={item}
              userId={userId}
              selected={item.isSelected}
              allowAll={true}
            />
          </div>
        )
      })}
    </ul>
  )
}

// activation promised payment
