import cn from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import BurgerListItem from '../BurgerListItem/BurgerListItem'
import { ArrowSign, Box, Profile, Social, Support, Wallet } from '../../../images'

import s from './ListItems.module.scss'

export default function ListItems(props) {
  const { name, email, isProfile, subList } = props
  let transcriptor = name
  const [isOpened, setIsOpened] = useState(false)
  const { t } = useTranslation('main')

  if (name === 'Услуги') {
    transcriptor = t('burger_menu.services.services')
  } else if (transcriptor === 'Финансы') {
    transcriptor = t('burger_menu.finance.finance')
  } else if (transcriptor === 'Реферальная программа') {
    transcriptor = t('burger_menu.ref_program.ref_program')
  } else if (transcriptor === 'Поддержка') {
    transcriptor = t('burger_menu.support.support')
  } else {
    transcriptor
  }

  const renderIcon = name => {
    switch (name) {
      case 'Услуги':
        return (
          <Box
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      case 'Финансы':
        return (
          <Wallet
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      case 'Реферальная программа':
        return (
          <Social
            className={cn({
              [s.icon]: true,
              [s.active]: isOpened,
            })}
          />
        )
      case 'Поддержка':
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
        name={transcriptor}
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
