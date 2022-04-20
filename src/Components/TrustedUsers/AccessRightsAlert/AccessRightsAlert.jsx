import cn from 'classnames'
import React, { useRef } from 'react'
// import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { useOutsideAlerter } from '../../../utils'

import s from './AccessRightsAlert.module.scss'

export default function AccessRightsAlert({
  isOpened,
  title,
  list1,
  list2,
  controlAlert,
  dataTestid,
}) {
  //   const { t } = useTranslation('trusted_users')
  const getAlerEl = useRef(null)
  // const getAlerElTitle = useRef(null)

  useOutsideAlerter(getAlerEl, isOpened, controlAlert)

  // const onScroll = e => {
  //   console.log(e.target.scrollHeight)
  //   getAlerElTitle.current.style.top = getAlerElTitle.current.scrollHeight + 200 + 'px'
  //   console.log(getAlerElTitle.current.style.top)
  // }

  return (
    <>
      <div className={cn({ [s.alert_wrapper]: true, [s.opened]: isOpened })}>
        <div className={s.alert} ref={getAlerEl} data-testid={dataTestid}>
          <div className={s.title_wrapper}>
            <h5 className={s.title}>{title}</h5>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn} onClick={controlAlert}></button>
            </div>
          </div>

          <div className={s.text_wrapper}>
            {list1}
            {list2}
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
