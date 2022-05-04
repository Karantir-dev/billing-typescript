import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import s from './AccessRightsAlert.module.scss'

export default function AccessRightsAlert({
  isOpened,
  title,
  list1,
  list2,
  controlAlert,
  dataTestid,
}) {
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
    <>
      <div className={cn({ [s.alert_wrapper]: true, [s.opened]: isOpened })}>
        <div
          className={cn({ [s.alert]: true, [s.scrolled]: scrolledDown })}
          data-testid={dataTestid}
        >
          <div className={s.title_wrapper}>
            <h5 className={s.title}>{title}</h5>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn} onClick={controlAlert}></button>
            </div>
          </div>

          <div className={s.text_wrapper} ref={getAlerEl}>
            <div className={s.list_one}>{list1}</div>
            <div className={s.list_two}>{list2}</div>
          </div>
        </div>
      </div>
    </>
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
