import cn from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import BurgerListItem from '../BurgerListItem/BurgerListItem'
import { ArrowSign, Box, Profile, Social, Support, Wallet } from '../../../../../images'

import s from './ListItems.module.scss'

export default function ListItems(props) {
  const { name, email, isProfile, subList, controlMenu } = props
  const [isOpened, setIsOpened] = useState(false)
  const { t } = useTranslation('container')

  const renderIcon = name => {
    switch (name) {
      case 'services':
        return (
          <Box
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      case 'finance':
        return (
          <Wallet
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      case 'ref_program':
        return (
          <Social
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      case 'support':
        return (
          <Support
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      default:
        return <Profile className={s.profile_icon} />
    }
  }

  return (
    <div
      className={s.list_items_wrapper}
      role="button"
      tabIndex={0}
      onKeyDown={() => null}
      onClick={() => setIsOpened(!isOpened)}
    >
      <BurgerListItem
        controlMenu={controlMenu}
        name={isProfile ? name : t(`burger_menu.${name}.${name}`)}
        arrow={
          <ArrowSign
            className={cn({
              [s.arrow_icon]: true,
              [s.closed]: isOpened,
            })}
          />
        }
        svg={renderIcon(name)}
        subList={subList}
        isProfile={isProfile}
        email={email}
        isListOpened={isOpened}
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
