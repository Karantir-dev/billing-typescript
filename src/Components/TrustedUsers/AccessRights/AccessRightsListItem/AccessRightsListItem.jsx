import classNames from 'classnames'
import React, { useState } from 'react'

import { ToggleButton } from '../../..'
import AccessRights from '../AccessRights'

import s from './AccessRightsListItem.module.scss'

export default function AccessRightsListItem({ itemTitle, itemChildren, itemText }) {
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  return itemTitle ? (
    <div>
      <button
        className={classNames({
          [s.title_inside_wrapper]: true,
          [s.opened]: isMenuOpened,
        })}
        onClick={handleClick}
      >
        <h5>{itemTitle}</h5>
        <span className={s.arrow_show_more}>&lt;</span>
      </button>
      <ul
        className={classNames({
          [s.sub_list]: true,
          [s.opened]: isMenuOpened,
        })}
      >
        {itemChildren && <AccessRights items={itemChildren} />}
      </ul>
    </div>
  ) : (
    <>
      <div className={s.list_item_wrapper}>
        <p>{itemText}</p>
        <ToggleButton />
      </div>
      {/* <ul className={s.sub_list}>
                    <li> {item.children && <AccessRights items={item.children} />}</li>
                  </ul> */}
    </>
  )
}
