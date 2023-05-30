import cn from 'classnames'
import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { useOutsideAlerter } from '../../../utils'

import s from './Alert.module.scss'

export default function Alert({
  isOpened,
  title,
  mainBtn,
  text,
  controlAlert,
  dataTestid,
}) {
  const getAlerEl = useRef()

  useOutsideAlerter(getAlerEl, isOpened, controlAlert)

  return (
    <>
      <div className={cn({ [s.alert_wrapper]: true, [s.opened]: isOpened })}>
        <div className={s.alert} ref={getAlerEl} data-testid={dataTestid}>
          <div className={s.title_wrapper}>
            <h5 className={s.modal_title}>{title}</h5>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn} onClick={controlAlert}></button>
            </div>
          </div>

          <div className={s.modal_content}>
            <p className={s.alert_text}>{text}</p>
          </div>

          <div className={s.control_btns_container}>
            {mainBtn}
          </div>
        </div>
      </div>
    </>
  )
}

Alert.propTypes = {
  isOpened: PropTypes.bool,
  title: PropTypes.string,
  mainBtn: PropTypes.object,
  text: PropTypes.string,
  controlAlert: PropTypes.func,
  dataTestid: PropTypes.string,
}
