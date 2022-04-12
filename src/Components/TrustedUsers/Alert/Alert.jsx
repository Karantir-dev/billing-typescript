import cn from 'classnames'
import React from 'react'

import s from './Alert.module.scss'

export default function Alert({ isOpened, title, mainBtn, text, controlAlert }) {
  return (
    <>
      <div className={cn({ [s.alert_wrapper]: true, [s.opened]: isOpened })}>
        <div className={s.alert}>
          <div className={s.title_wrapper}>
            <h5>{title}</h5>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn} onClick={controlAlert}></button>
            </div>
          </div>
          <p className={s.alert_text}>{text}</p>
          <div className={s.control_btns_container}>
            {mainBtn}

            <button className={s.cancel_btn} onClick={controlAlert}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
