import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import s from './AccessRightsAlert.module.scss'
import { Button } from '../..'

export default function AccessRightsAlert({ isOpened, title, list1, controlAlert }) {
  const getAlerEl = useRef(null)
  const [scrolledDown, setScrolledDown] = useState(false)

  const handleScroll = e => {
    const alertScrollTop = e.target.scrollTop
    const alertOffsetHeight = e.target.offsetHeight
    const alertScrollHeight = e.target.scrollHeight

    if (alertScrollTop + alertOffsetHeight >= alertScrollHeight) {
      setScrolledDown(!scrolledDown)
    } else {
      setScrolledDown(false)
    }
  }

  useEffect(() => {
    getAlerEl.current.addEventListener('scroll', handleScroll)

    return () => {
      if (getAlerEl.current) {
        getAlerEl.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className={cn({ [s.alert_wrapper]: true, [s.opened]: isOpened })}>
      <div
        data-testid="trusted_users_rights_alert"
        className={cn({ [s.alert]: true, [s.scrolled]: scrolledDown })}
      >
        <div className={s.title_wrapper}>
          <h5 className={s.title}>{title}</h5>
          <div className={s.close_btn_wrapper}>
            <button
              className={s.close_btn}
              data-testid="trusted_users_rights_btn"
              onClick={controlAlert}
            ></button>
          </div>
        </div>

        <div className={s.text_wrapper} ref={getAlerEl}>
          <div data-testid="trusted_users_rights_list" className={s.list_one}>
            {list1}
          </div>
        </div>

        <div className={s.footer_wrapper}>
          <Button onClick={controlAlert} label="OK" isShadow />
        </div>
      </div>
    </div>
  )
}

AccessRightsAlert.propTypes = {
  isOpened: PropTypes.bool,
  title: PropTypes.string,
  list1: PropTypes.object,
  list2: PropTypes.object,
  controlAlert: PropTypes.func,
  dataTestid: PropTypes.string,
}
