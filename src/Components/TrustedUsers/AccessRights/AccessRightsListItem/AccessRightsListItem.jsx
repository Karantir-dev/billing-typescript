import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Shevron } from '../../../../images'
import { authSelectors, usersOperations } from '../../../../Redux'
import ToggleButton from '../../ToggleButton/ToggleButton'

import s from './AccessRightsListItem.module.scss'

export default function AccessRightsListItem({
  item,
  userId,
  handleSelect,
  selected,
  allowAll,
  hasAccessToResumeRights,
  hasAccessToSuspendRights,
  hasAccessToSuspendRightsOnly,
}) {
  const { t } = useTranslation('trusted_users')
  const [selectedSub, setSelectedSub] = useState([])
  const sessionId = useSelector(authSelectors.getSessionId)
  const [subList, setSubList] = useState([])
  let rightState = item?.active?.$ === 'on'
  const [currentRightState, setCurrentRightState] = useState(rightState)
  const [allowAllRightState, setAllowAllRightState] = useState(rightState)

  const dispatch = useDispatch()

  const modifiedList = subList.map(item => {
    return { ...item, isSelected: false }
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

      dispatch(
        usersOperations.getSubRights(
          changedUserId,
          item.name.$,
          sessionId,
          setSelectedSub,
          setSubList,
        ),
      )
    } else {
      handleSubSelect(item)
      handleSelect(item)
    }
  }

  const handleAllowAllBtn = () => {
    const act = currentRightState ? 'suspend' : 'resume'
    let type = item.name.$.split('.').slice(0, 1).join('')
    if (type === 'promisepayment') {
      type = type + '.add'
    }

    const res = dispatch(
      usersOperations.manageUserRight(userId, item.name.$, sessionId, act, type),
    )

    res.then(() => {
      try {
        const map = selectedSub.map(el => {
          if (currentRightState) {
            el.active.$ = 'off'
          } else if (!currentRightState) {
            el.active.$ = 'on'
          }

          return el
        })

        console.log(map)

        setSelectedSub([])
        setCurrentRightState(!currentRightState)
        setSelectedSub([...map])
      } catch (e) {
        console.log('Error in AccessRightsListItem - ', e.message)
      }
    })
  }

  const handleToggleBtns = () => {
    const act = currentRightState ? 'suspend' : 'resume'
    let type = item.name.$.split('.').slice(0, 1).join('')
    if (type === 'promisepayment') {
      type = type + '.add'
    }

    const res = dispatch(
      usersOperations.manageUserRight(userId, item.name.$, sessionId, act, type),
    )

    res.then(() => {
      setAllowAllRightState(false)

      // setCurrentRightState(!currentRightState)
    })

    // res.then(() => {
    //   try {
    //     if (allowAll) {
    //       const map = selectedSub.map(el => {
    //         if (currentRightState) {
    //           el.active.$ = 'off'
    //         } else if (!currentRightState) {
    //           el.active.$ = 'on'
    //         }

    //         return el
    //       })

    //       console.log(map)

    //       setSelectedSub([])
    //       setCurrentRightState(!currentRightState)
    //       setSelectedSub([...map])
    //     } else {
    //       setCurrentRightState(!currentRightState)
    //     }
    //   } catch (e) {
    //     console.log('Error in AccessRightsListItem - ', e.message)
    //   }
    // })
  }

  const nameWithoutDots = item.name.$.replaceAll('.', '_')

  const hasSubItems = item?.hassubitems?.$ === 'on'

  useEffect(() => {
    console.log(allowAllRightState)
  }, [allowAllRightState])

  if (Object.hasOwn(item, 'active')) {
    return (
      <div
        data-testid="modal_rihgts_list_item"
        className={cn({
          [s.list_item_wrapper]: true,
          [s.opened]: selected,
        })}
      >
        <div
          role="button"
          tabIndex={0}
          onKeyDown={() => null}
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
                disabled={
                  (!hasAccessToResumeRights && !currentRightState) ||
                  (!hasAccessToSuspendRights &&
                    currentRightState &&
                    !hasAccessToSuspendRightsOnly)
                }
                hasAlert={false}
                initialState={currentRightState}
                func={handleToggleBtns}
                size="small"
              />
            )}
          </div>
        </div>

        {selectedSub && (
          <div
            data-testid="modal_rihgts_sub_list"
            className={cn({ [s.sub_list]: true, [s.selected]: selected })}
          >
            {allowAll && (
              <div className={cn({ [s.allow_all_item]: true })}>
                <p className={s.list_item_subtitle}>{t('trusted_users.Allow_all')}</p>

                <ToggleButton
                  disabled={
                    (!hasAccessToResumeRights && !currentRightState) ||
                    (!hasAccessToSuspendRights &&
                      currentRightState &&
                      !hasAccessToSuspendRightsOnly)
                  }
                  hasAlert={false}
                  initialState={allowAllRightState}
                  func={handleAllowAllBtn}
                  size="small"
                />
              </div>
            )}

            {selectedSub.map((child, index) => {
              return (
                <AccessRightsListItem
                  key={index}
                  item={child}
                  userId={userId}
                  handleSelect={handleSubSelect}
                  selected={child.isSelected}
                  hasAccessToResumeRights={hasAccessToResumeRights}
                  hasAccessToSuspendRights={hasAccessToSuspendRights}
                  hasAccessToSuspendRightsOnly={hasAccessToSuspendRightsOnly}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div data-testid="modal_rihgts_list_item" className={s.list_item_title}>
        <p className={s.list_item_title_text}>
          {t(`trusted_users.rights_alert.${nameWithoutDots}`)}
        </p>
      </div>
    )
  }
}

AccessRightsListItem.propTypes = {
  item: PropTypes.object,
  handleSelect: PropTypes.func,
  userId: PropTypes.string,
  hasAccessToResumeRights: PropTypes.bool,
  hasAccessToSuspendRights: PropTypes.bool,
  selected: PropTypes.bool,
  allowAll: PropTypes.bool,
  hasAccessToSuspendRightsOnly: PropTypes.bool,
}
