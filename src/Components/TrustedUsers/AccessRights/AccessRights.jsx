import React, { useState } from 'react'
import PropTypes from 'prop-types'

import s from './AccessRights.module.scss'
import AccessRightsListItem from './AccessRightsListItem/AccessRightsListItem'

export default function AccessRights({
  items,
  userId,
  hasAccessToResumeRights,
  hasAccessToSuspendRights,
  hasAccessToSuspendRightsOnly,
}) {
  const modifiedList = items.map(item => {
    return { ...item, isSelected: false }
  })

  const [listArr, setListArr] = useState(modifiedList)

  const [openedCategory, setOpenedCategory] = useState({})

  const handleSelect = item => {
    const filter = listArr.map(el => {
      if (item.name.$ === el.name.$) {
        return { ...el, isSelected: !el.isSelected }
      } else {
        return { ...el, isSelected: false }
      }
    })

    setListArr([...filter])
  }

  const checkCategoryIndex = () => {
    const categories = []
    listArr?.forEach(e => {
      if (!Object.prototype.hasOwnProperty.call(e, 'active')) {
        categories?.push(e)
      } else {
        if (!categories[categories?.length - 1].subCateg) {
          categories[categories?.length - 1].subCateg = []
        }

        if (!categories[categories?.length - 1]?.subCateg?.includes(e?.name?.$)) {
          categories[categories?.length - 1].subCateg?.push(e?.name?.$)
        }
      }
    })
    let newList = []

    categories?.forEach(el => {
      newList = listArr?.map(e => {
        if (e?.name?.$ === el?.name?.$) {
          return el
        } else {
          return e
        }
      })
    })

    return newList
  }

  return (
    <div role="list" aria-labelledby="rights-heading" className={s.list}>
      {checkCategoryIndex().map((item, index) => {
        const handleClickCategory = () => {
          if (!Object.prototype.hasOwnProperty.call(item, 'active')) {
            if (item === openedCategory) {
              setOpenedCategory({})
            } else {
              setOpenedCategory(item)
            }
          }
        }

        const isActiveCategory = []

        item?.subCateg?.forEach(sub => {
          checkCategoryIndex()?.forEach(i => {
            if (i?.name?.$ === sub) {
              isActiveCategory?.push(i?.active?.$ === 'on')
            }
          })
        })

        console.log(isActiveCategory)

        return (
          <div
            role="listitem"
            data-testid="trusted_users_rights_item"
            className={s.access_rights}
            key={index}
          >
            <AccessRightsListItem
              hasAccessToSuspendRightsOnly={hasAccessToSuspendRightsOnly}
              hasAccessToResumeRights={hasAccessToResumeRights}
              hasAccessToSuspendRights={hasAccessToSuspendRights}
              handleSelect={handleSelect}
              item={item}
              userId={userId}
              selected={item.isSelected}
              isOpenCategory={openedCategory?.subCateg?.includes(item?.name?.$)}
              openedCategory={openedCategory}
              handleClickCategory={handleClickCategory}
              allowAll={true}
              categoryIsActive={!isActiveCategory?.includes(false)}
            />
          </div>
        )
      })}
    </div>
  )
}

AccessRights.propTypes = {
  items: PropTypes.array,
  userId: PropTypes.string,
  hasAccessToResumeRights: PropTypes.bool,
  hasAccessToSuspendRights: PropTypes.bool,
  hasAccessToSuspendRightsOnly: PropTypes.bool,
}
