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
  const currentRightState = item?.active?.$ === 'on'

  console.log(item?.active?.$)

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
        console.log('Error in AccessRightsListItem - ', e.message)
      }
    })
  }

  const handleToggleBtns = () => {
    const act = currentRightState ? 'suspend' : 'resume'
    const type = item.name.$.split('.').slice(0, 1).join('')
    console.log('TYPE', type)

    const res = usersOperations.manageUserRight(userId, item.name.$, sessionId, act, type)

    res.then(data => {
      try {
        console.log('rights changed successfully', data)
      } catch (e) {
        console.log('Error in AccessRightsListItem - ', e.message)
      }
    })
  }

  const hasSubItems = item?.hassubitems?.$ === 'on'

  if (Object.hasOwn(item, 'active')) {
    return (
      <li className={cn({ [s.list_item_wrapper]: true, [s.opened]: open })}>
        <button
          onClick={hasSubItems ? handleClick : null}
          className={cn({ [s.list_item]: true, [s.opened]: open })}
        >
          <p className={s.list_item_subtitle}>{item.caption.$}</p>
          <div>
            {hasSubItems ? (
              <Shevron className={s.shevron} />
            ) : (
              <ToggleButton
                hasAlert={false}
                initialState={currentRightState}
                func={handleToggleBtns}
              />
            )}
          </div>
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
        <p className={s.list_item_title_text}>{item.caption.$}</p>
      </li>
    )
  }
}
