import cn from 'classnames'
// { useState }
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import BurgerListItem from '../BurgerListItem/BurgerListItem'
import { Icon } from '@components'

import s from './ListItems.module.scss'

export default function ListItems(props) {
  const { name, email, isProfile, subList, controlMenu, id, activeList, setActiveList } =
    props

  const currentItem = activeList.filter(item => {
    return item.listId === id
  })

  const { t } = useTranslation('container')

  const renderIcon = name => {
    switch (name) {
      case 'services':
        return (
          <Icon
            name="Box"
            className={cn({
              [s.icon]: true,
              [s.active]: currentItem[0].active,
            })}
          />
        )
      case 'finance':
        return (
          <Icon
            name="Wallet"
            className={cn({
              [s.icon]: true,
              [s.active]: currentItem[0].active,
            })}
          />
        )
      case 'ref_program':
        return (
          <Icon
            name="Social"
            className={cn({
              [s.icon]: true,
              [s.active]: currentItem[0].active,
            })}
          />
        )
      case 'support':
        return (
          <Icon
            name="Support"
            className={cn({
              [s.icon]: true,
              [s.active]: currentItem[0].active,
            })}
          />
        )
      default:
        return (
          <Icon name="Profile" svgwidth="31" svgheight="31" className={s.profile_icon} />
        )
    }
  }

  const handleClick = () => {
    const mutatedList = activeList.map(item => {
      if (item.listId === id) {
        return item
      } else {
        return { ...item, active: false }
      }
    })

    setActiveList(
      mutatedList.map(item => {
        if (item.listId === id) {
          return { ...item, active: !item.active }
        } else {
          return item
        }
      }),
    )
  }

  return (
    <div
      className={s.list_items_wrapper}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={handleClick}
    >
      <BurgerListItem
        controlMenu={controlMenu}
        name={isProfile ? name : t(`burger_menu.${name}.${name}`)}
        arrow={
          <Icon
            name="ArrowSign"
            className={cn({
              [s.arrow_icon]: true,
              [s.closed]: currentItem[0].active,
            })}
          />
        }
        svg={renderIcon(name)}
        subList={subList}
        isProfile={isProfile}
        email={email}
        isListOpened={currentItem[0].active}
      />
    </div>
  )
}

ListItems.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  isProfile: PropTypes.bool,
  subList: PropTypes.array,
}
