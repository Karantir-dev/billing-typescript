import React from 'react'

import s from './OstemplVDSbtn.module.scss'

export default function OstemplVDSbtn() {
  // const renderIcon = name => {
  //   switch (name) {
  //     case 'envelope':
  //       return <Envelope className={pos} />
  //     case 'padlock':
  //       return <Padlock className={pos} />
  //     case 'search':
  //       return <Search className={pos} />
  //     case 'person':
  //       return <Person className={pos} />
  //     default:
  //       return null
  //   }
  // }

  return (
    <div>
      <button className={s.btn} type="button"></button>
    </div>
  )
}
