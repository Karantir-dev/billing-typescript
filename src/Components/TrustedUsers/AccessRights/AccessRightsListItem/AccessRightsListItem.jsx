import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  Client,
  Finance,
  Help,
  Home,
  Instruments,
  Reference,
  Services,
  Shevron,
  Statistic,
} from '../../../../images'
import { authSelectors, usersOperations } from '../../../../Redux'

import { Toggle } from '../../..'

import s from './AccessRightsListItem.module.scss'
import { checkIfTokenAlive } from '../../../../utils'

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
  mainListTitle,

  handleClickCategory,
  openedCategory,
  isOpenCategory,
  inserted,
  categoryIsActive,
}) {
  const { t } = useTranslation('trusted_users')
  const sessionId = useSelector(authSelectors.getSessionId)

  let rightState = item?.active?.$ === 'on'

  const mainTitle = mainListTitle ? mainListTitle : allowAll && item?.caption?.$

  const [isAllTurnedOn, setIsAllTurnedOn] = useState(rightState)
  const [currentRightState, setCurrentRightState] = useState(rightState)

  const [selectedSub, setSelectedSub] = useState([])
  const [subList, setSubList] = useState([])

  const selectedSubWithoutFilters = selectedSub

  const [mainFuncName, setMainFuncName] = useState('')

  const dispatch = useDispatch()

  const modifiedList = subList.map(item => {
    return { ...item, isSelected: false }
  })

  useEffect(() => {
    setCurrentRightState(rightState)
  }, [rightState])

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
      setCurrentRightState(!currentRightState)
      try {
        if (allowAll) {
          const map = selectedSubWithoutFilters.map(el => {
            if (allRightsState || isAllTurnedOn) {
              el.active.$ = 'off'
            } else if (!allRightsState || !isAllTurnedOn) {
              el.active.$ = 'on'
            }

            return el
          })

          setSelectedSub([])
          setSelectedSub([...map])

          setAllRightsState
            ? setAllRightsState(!allRightsState)
            : setIsAllTurnedOn(!isAllTurnedOn)
        } else {
          if (allRightsState || isAllTurnedOn) {
            setAllRightsState ? setAllRightsState(false) : setIsAllTurnedOn(false)
          }

          if (subType === 'read' && act === 'suspend') {
            let list =
              selectedSubWithoutFilters.length > 0
                ? selectedSubWithoutFilters
                : selectedSubList

            const filteredArray = list.map(el => {
              el.active.$ = 'on'
              return el
            })

            if (selectedSubWithoutFilters.length > 0) {
              setSelectedSub([])
              setSelectedSub([...filteredArray])
            } else {
              setSelectedSubList([])
              setSelectedSubList([...filteredArray])
            }
          }

          if (subType === 'write' && act === 'resume') {
            let list =
              selectedSubWithoutFilters.length > 0
                ? selectedSubWithoutFilters
                : selectedSubList

            const filteredArray = list.map(el => {
              el.active.$ = 'on'
              return el
            })

            if (selectedSubWithoutFilters.length > 0) {
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

            let list =
              selectedSubWithoutFilters.length > 0
                ? selectedSubWithoutFilters
                : selectedSubList

            const changeArray = list.map(el => {
              if (el.name.$ === item.name.$) {
                el.active.$ = 'on'
              }
              return el
            })

            if (selectedSub.length > 0) {
              setSelectedSub([])
              setSelectedSub([...changeArray])
            } else {
              setSelectedSubList([])
              setSelectedSubList([...changeArray])
            }
            const shouldBeTurnOn =
              selectedSubList?.length > 0
                ? selectedSubList.every(el => el.active.$ === 'on') &&
                  selectedSub.every(el => el.active.$ === 'on')
                : selectedSub.every(el => el.active.$ === 'on') &&
                  typeof selectedSubList === 'undefined'

            setIsAllTurnedOn(shouldBeTurnOn)
            setAllRightsState(shouldBeTurnOn)
          }
        }
      } catch (e) {
        checkIfTokenAlive(`Error in AccessRightsListItem - ${e?.message}`, dispatch)
      }
    })
  }

  const nameWithoutDots = item?.name?.$?.replaceAll('.', '_')

  const hasSubItems = item?.hassubitems?.$ === 'on'

  useEffect(() => {
    let doesEveryTurnedOn =
      selectedSubList?.length > 0
        ? selectedSubList.every(el => el.active.$ === 'on') &&
          selectedSub.every(el => el.active.$ === 'on')
        : selectedSub.every(el => el.active.$ === 'on') &&
          typeof selectedSubList === 'undefined'

    setIsAllTurnedOn(doesEveryTurnedOn)
  }, [selectedSub])

  const renderIcons = icon => {
    switch (icon) {
      case 'customer':
        return <Client />
      case 'mainmenuservice':
        return <Services />
      case 'finance':
        return <Finance />
      case 'support':
        return <Help />
      case 'mainmenutool':
        return <Instruments />
      case 'stat':
        return <Statistic />
      case 'mgrhelp':
        return <Reference />
      case 'dashboard':
        return <Home />
      default:
        return null
    }
  }

  if (Object.prototype.hasOwnProperty.call(item, 'active')) {
    return (
      <div
        data-testid="modal_rihgts_list_item"
        className={cn({
          [s.list_item_wrapper]: true,
          [s.showed]: isOpenCategory,
          [s.opened]: selected,
        })}
      >
        <div
          className={cn({
            [s.list_item]: true,
            [s.opened]: selected,
          })}
        >
          <div
            role="button"
            tabIndex={0}
            onKeyDown={() => null}
            onClick={hasSubItems ? handleClick : null}
            className={cn(s.list_item_subtitle)}
          >
            {t(`trusted_users.rights_alert.${nameWithoutDots}`)}
          </div>
          <div
            className={cn({ [s.isToggleBlock]: !hasSubItems, [s.inserted]: inserted })}
          >
            {hasSubItems ? (
              <div className={cn(s.selectedAllBlock)}>
                {selectedSubWithoutFilters && allowAll && (
                  <div
                    className={cn(s.isToggleBlockSelectAll, { [s.selected]: selected })}
                  >
                    <Toggle
                      func={handleToggleBtns}
                      initialState={allRightsState || isAllTurnedOn}
                      disabled={
                        (!hasAccessToResumeRights && !currentRightState) ||
                        (!hasAccessToSuspendRights &&
                          currentRightState &&
                          !hasAccessToSuspendRightsOnly)
                      }
                    />
                  </div>
                )}
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => null}
                  onClick={hasSubItems ? handleClick : null}
                  className={cn({ [s.shevronInserted]: inserted })}
                >
                  <Shevron className={s.shevron} />
                </div>
              </div>
            ) : (
              <div className={cn(s.withoutSubItem)}>
                <Toggle
                  func={handleToggleBtns}
                  initialState={currentRightState}
                  disabled={
                    (!hasAccessToResumeRights && !currentRightState) ||
                    (!hasAccessToSuspendRights &&
                      currentRightState &&
                      !hasAccessToSuspendRightsOnly)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {selectedSubWithoutFilters && (
          <div
            data-testid="modal_rihgts_sub_list"
            className={cn({
              [s.sub_list]: true,
              [s.selected]: selected,
            })}
          >
            {selectedSubWithoutFilters.map((child, index) => {
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
                  selectedSubList={selectedSubWithoutFilters}
                  setSelectedSubList={setSelectedSub}
                  mainFunc={mainFuncName}
                  mainListTitle={mainTitle}
                  isOpenCategory
                  inserted
                />
              )
            })}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className={cn(s.list_item_title, { [s.opened]: openedCategory === item })}>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={() => null}
          onClick={handleClickCategory}
          className={s.list_item_title_text}
        >
          {renderIcons(nameWithoutDots)}
          {t(`trusted_users.rights_alert.${nameWithoutDots}`)}
        </div>

        <div className={cn(s.selectedAllBlock)}>
          <div className={cn(s.isToggleBlockSelectAll, { [s.selected]: selected })}>
            <Toggle
              func={() => null}
              initialState={categoryIsActive}
              disabled={
                (!hasAccessToResumeRights && !currentRightState) ||
                (!hasAccessToSuspendRights &&
                  currentRightState &&
                  !hasAccessToSuspendRightsOnly)
              }
            />
          </div>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={() => null}
            onClick={handleClickCategory}
            className={cn({ [s.shevronInserted]: inserted })}
          >
            <Shevron className={s.shevron} />
          </div>
        </div>
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
