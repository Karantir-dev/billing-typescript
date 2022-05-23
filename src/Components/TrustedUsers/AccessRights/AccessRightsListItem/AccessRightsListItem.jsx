import cn from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Shevron } from '../../../../images'
import { authSelectors, usersOperations } from '../../../../Redux'
import ToggleButton from '../../ToggleButton/ToggleButton'
import ToggleButtonAll from '../../ToggleButton/ToggleButtonAll'

import s from './AccessRightsListItem.module.scss'

export default function AccessRightsListItem({
  allRightsState,
  setAllRightsState,
  item,
  userId,
  handleSelect,
  selected,
  allowAll,
  hasAccessToResumeRights,
  hasAccessToSuspendRights,
  hasAccessToSuspendRightsOnly,
  selectedSubList,
  setSelectedSubList,
  mainFunc,
}) {
  const { t } = useTranslation('trusted_users')
  const sessionId = useSelector(authSelectors.getSessionId)
  let rightState = item?.active?.$ === 'on'

  const [isAllTurnedOn, setIsAllTurnedOn] = useState(rightState)
  const [currentRightState, setCurrentRightState] = useState(rightState)

  const [selectedSub, setSelectedSub] = useState([])
  const [subList, setSubList] = useState([])

  const [mainFuncName, setMainFuncName] = useState('')
  console.log(setMainFuncName)
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
    allowAll && setMainFuncName(item.name.$)

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

  // item.name.$

  const handleToggleBtns = () => {
    const actSingleBtn = currentRightState ? 'suspend' : 'resume'
    const actTurnAllBtns = isAllTurnedOn || allRightsState ? 'suspend' : 'resume'
    const act = allowAll ? actTurnAllBtns : actSingleBtn
    let type = item.name.$.split('.').slice(0, 1).join('')
    let subType = item.name.$.split('#').slice(-1).join('')

    if (type === 'promisepayment') {
      type = type + '.add'
    }

    const res = dispatch(
      usersOperations.manageUserRight(userId, item.name.$, sessionId, act, type),
    )

    res.then(() => {
      try {
        if (allowAll) {
          const map = selectedSub.map(el => {
            if (allRightsState || isAllTurnedOn) {
              el.active.$ = 'off'
            } else if (!allRightsState || !isAllTurnedOn) {
              el.active.$ = 'on'
            }

            return el
          })

          setSelectedSub([])
          setCurrentRightState(!currentRightState)
          setSelectedSub([...map])

          setAllRightsState
            ? setAllRightsState(!allRightsState)
            : setIsAllTurnedOn(!isAllTurnedOn)
        } else {
          setCurrentRightState(!currentRightState)

          if (allRightsState || isAllTurnedOn) {
            setAllRightsState ? setAllRightsState(false) : setIsAllTurnedOn(false)
          }

          if (subType === 'read' && act === 'suspend') {
            let list = selectedSub.length > 0 ? selectedSub : selectedSubList

            const filteredArray = list.map(el => {
              el.active.$ = 'off'
              return el
            })

            if (selectedSub.length > 0) {
              setSelectedSub([])
              setSelectedSub([...filteredArray])
            } else {
              setSelectedSubList([])
              setSelectedSubList([...filteredArray])
            }
          }

          if (act === 'resume') {
            let currentFuncName =
              typeof mainFuncName === mainFuncName ? mainFuncName : mainFunc

            console.log('mainFuncName', currentFuncName)

            res.then(() => {
              dispatch(
                usersOperations.manageUserRight(
                  userId,
                  currentFuncName,
                  sessionId,
                  act,
                  type,
                ),
              )
            })
          }
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

                <ToggleButtonAll
                  disabled={
                    (!hasAccessToResumeRights && !currentRightState) ||
                    (!hasAccessToSuspendRights &&
                      currentRightState &&
                      !hasAccessToSuspendRightsOnly)
                  }
                  hasAlert={false}
                  initialState={allRightsState || isAllTurnedOn}
                  func={handleToggleBtns}
                  size="small"
                  id={'123123'}
                />
              </div>
            )}

            {selectedSub.map((child, index) => {
              return (
                <AccessRightsListItem
                  allRightsState={allRightsState || isAllTurnedOn}
                  setAllRightsState={setAllRightsState || setIsAllTurnedOn}
                  key={index}
                  item={child}
                  userId={userId}
                  handleSelect={handleSubSelect}
                  selected={child.isSelected}
                  hasAccessToResumeRights={hasAccessToResumeRights}
                  hasAccessToSuspendRights={hasAccessToSuspendRights}
                  hasAccessToSuspendRightsOnly={hasAccessToSuspendRightsOnly}
                  selectedSubList={selectedSub}
                  setSelectedSubList={setSelectedSub}
                  mainFunc={mainFuncName}
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
