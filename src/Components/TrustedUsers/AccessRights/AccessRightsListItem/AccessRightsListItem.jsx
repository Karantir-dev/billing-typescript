// import classNames from 'classnames'
import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
// import { useDispatch } from 'react-redux'
import { Shevron } from '../../../../images'
import { authSelectors } from '../../../../Redux/auth/authSelectors'
import { usersOperations } from '../../../../Redux/users/usersOperations'
import ToggleButton from '../../../ui/ToggleButton/ToggleButton'

import s from './AccessRightsListItem.module.scss'

export default function AccessRightsListItem({ item, userId }) {
  const [open, setOpen] = useState(false)
  const sessionId = useSelector(authSelectors.getSessionId)
  const [subList, setSubList] = useState([])
  // const [subList2, setSubList2] = useState([])

  // const dispatch = useDispatch()

  const handleClick = () => {
    const res = usersOperations.getSubRights(userId, item.name.$, sessionId)

    res.then(data => {
      try {
        const { elem } = data.doc
        if (elem) {
          setSubList(elem)
          setOpen(!open)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  const hasSubItems = item?.hassubitems?.$ === 'on'

  if (Object.hasOwn(item, 'active')) {
    return (
      <li>
        <button
          onClick={hasSubItems ? handleClick : null}
          className={cn({ [s.list_item]: true, [s.opened]: open })}
        >
          <p>{item.caption.$}</p>
          {hasSubItems ? (
            <Shevron className={s.shevron} />
          ) : (
            <ToggleButton hasAlert={false} />
          )}
        </button>

        {open && subList && (
          <div className={s.sub_list}>
            {subList.map((child, index) => {
              console.log(child)
              return <AccessRightsListItem key={index} item={child} userId={userId} />
            })}
          </div>
        )}
      </li>
    )
  } else {
    return (
      <li className={s.list_item_title}>
        <p>{item.caption.$}</p>
      </li>
    )
  }
}
