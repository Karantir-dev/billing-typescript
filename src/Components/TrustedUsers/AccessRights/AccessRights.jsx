// import classNames from 'classnames'
import React from 'react'
// import ToggleButton from '../../ui/ToggleButton/ToggleButton'
// import ControlBtn from '../ControlBtn/ControlBtn'

import s from './AccessRights.module.scss'
import AccessRightsListItem from './AccessRightsListItem/AccessRightsListItem'

export default function AccessRights({ items }) {
  // const [isMenuOpened, setIsMenuOpened] = useState(false)

  // const handleClick = () => {
  //   setIsMenuOpened(!isMenuOpened)
  // }

  return (
    <ul className={s.list}>
      {items.map((item, index) => {
        return (
          <div className={s.access_rights} key={index}>
            <AccessRightsListItem item={item} />
          </div>
        )
      })}
    </ul>
  )
}
