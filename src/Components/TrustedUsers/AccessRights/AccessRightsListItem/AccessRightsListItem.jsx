// import classNames from 'classnames'
import cn from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
// import { useDispatch } from 'react-redux'
import { Shevron } from '../../../../images'
import { authSelectors, usersOperations } from '../../../../Redux'
import ToggleButton from '../../../ui/ToggleButton/ToggleButton'

import s from './AccessRightsListItem.module.scss'

export default function AccessRightsListItem({ item, userId, handleSelect, selected }) {
  console.log('selected, new rerender after state changes in parent', selected)

  const { t } = useTranslation('trusted_users')
  const [selectedSub, setSelectedSub] = useState(selected)
  const sessionId = useSelector(authSelectors.getSessionId)
  const [subList, setSubList] = useState([])
  const currentRightState = item?.active?.$ === 'on'

  const modifiedList = subList.map(item => {
    const newObj = JSON.parse(JSON.stringify(item))

    newObj.isSelected = false

    return newObj
  })

  const handleClick = () => {
    // selectedSub.length > 0 ? handleSubSelect(item) : handleSelect(item)
    handleSubSelect(item)
    handleSelect(item)
    if (!selected) {
      const res = usersOperations.getSubRights(userId, item.name.$, sessionId)

      res.then(data => {
        try {
          const { elem } = data.doc
          setSelectedSub(elem)
          setSubList(elem)

          // setOpen(!open)
        } catch (e) {
          console.log('Error in AccessRightsListItem - ', e.message)
        }
      })
    } else {
      handleSubSelect(item)
      handleSelect(item)
      // selectedSub.length > 0 ? handleSubSelect(item) : handleSelect(item)
    }
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

  const handleSubSelect = newItem => {
    const filter = modifiedList.map(el => {
      if (newItem.name.$ === el.name.$) {
        const act = newItem.name.$
        console.log(act)
        return { ...el, isSelected: !el.isSelected }
      } else {
        return { ...el, isSelected: false }
      }
    })

    console.log(filter)
    setSelectedSub([...filter])
  }

  const nameWithoutDots = item.name.$.replaceAll('.', '_')

  const hasSubItems = item?.hassubitems?.$ === 'on'

  if (Object.hasOwn(item, 'active')) {
    return (
      <li
        className={cn({
          [s.list_item_wrapper]: true,
          [s.opened]: selected,
        })}
      >
        <button
          onClick={hasSubItems ? handleClick : null}
          className={cn({ [s.list_item]: true, [s.opened]: selected })}
        >
          <p className={s.list_item_subtitle}>
            {t(`trusted_users.rights_alert.${nameWithoutDots}`)}
          </p>
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

        {selectedSub && modifiedList && (
          <div className={cn({ [s.sub_list]: true, [s.selected]: selectedSub })}>
            {modifiedList.map((child, index) => {
              return (
                <AccessRightsListItem
                  key={index}
                  item={child}
                  userId={userId}
                  handleSelect={handleSubSelect}
                  selected={child.isSelected}
                />
              )
            })}
          </div>
        )}

        {/* {selectedSub && modifiedList && (
          <div className={cn({ [s.sub_list]: true, [s.selected]: selectedSub })}>
            {modifiedList.map((child, index) => {
              return (
                <AccessRightsListItem
                  key={index}
                  item={child}
                  userId={userId}
                  handleSelect={handleSubSelect}
                  selected={child.isSelected}
                />
              )
            })}
          </div>
        )} */}
      </li>
    )
  } else {
    return (
      <li className={s.list_item_title}>
        <p className={s.list_item_title_text}>
          {t(`trusted_users.rights_alert.${nameWithoutDots}`)}
        </p>
      </li>
    )
  }
}
