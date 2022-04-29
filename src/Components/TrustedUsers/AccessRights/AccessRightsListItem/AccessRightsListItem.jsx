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

export default function AccessRightsListItem({
  item,
  userId,
  handleSelect,
  selected,
  allowAll,
}) {
  const { t } = useTranslation('trusted_users')
  const [selectedSub, setSelectedSub] = useState([])
  const sessionId = useSelector(authSelectors.getSessionId)
  const [subList, setSubList] = useState([])
  let rightState = item?.active?.$ === 'on'
  const [currentRightState, setCurrentRightState] = useState(rightState)

  const modifiedList = subList.map(item => {
    const newObj = JSON.parse(JSON.stringify(item))
    newObj.isSelected = false

    return newObj
  })

  const handleSubSelect = newItem => {
    const filter = modifiedList.map(el => {
      if (newItem.name.$ === el.name.$) {
        return { ...el, isSelected: !newItem.isSelected }
      } else {
        return { ...el, isSelected: false }
      }
    })

    setSelectedSub([...filter])
  }

  const handleClick = () => {
    handleSelect(item)

    if (!selected) {
      const changedUserId =
        item.name.$ === 'rights2.user' && item.caption.$ === 'Functions'
          ? `${userId}/user/rights2.user`
          : userId

      const res = usersOperations.getSubRights(changedUserId, item.name.$, sessionId)

      res.then(data => {
        try {
          const { elem } = data.doc
          setSelectedSub(elem)
          setSubList(elem)
        } catch (e) {
          console.log('Error in AccessRightsListItem - ', e.message)
        }
      })
    } else {
      handleSubSelect(item)
    }
  }

  const handleToggleBtns = () => {
    const act = currentRightState ? 'suspend' : 'resume'
    let type = item.name.$.split('.').slice(0, 1).join('')
    if (type === 'promisepayment') {
      type = type + '.add'
    }
    console.log('TYPE', type)

    const res = usersOperations.manageUserRight(userId, item.name.$, sessionId, act, type)

    res.then(data => {
      try {
        console.log('rights changed successfully', data)

        if (allowAll) {
          const map = selectedSub.map(el => {
            if (el?.active?.$ === 'on') {
              el.active.$ = 'off'
            } else if (el?.active?.$ === 'off') {
              el.active.$ = 'on'
            }

            return el
          })

          setSelectedSub([])
          setCurrentRightState(!currentRightState)
          setSelectedSub([...map])
        }
      } catch (e) {
        console.log('Error in AccessRightsListItem - ', e.message)
      }
    })
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
                size="small"
              />
            )}
          </div>
        </button>

        {selectedSub && (
          <div className={cn({ [s.sub_list]: true, [s.selected]: selected })}>
            {allowAll && (
              <>
                <div className={cn({ [s.allow_all_item]: true })}>
                  <p className={s.list_item_subtitle}>{t('trusted_users.Allow_all')}</p>

                  <ToggleButton
                    hasAlert={false}
                    initialState={currentRightState}
                    func={handleToggleBtns}
                    size="small"
                  />
                </div>
              </>
            )}

            {selectedSub.map((child, index) => {
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
