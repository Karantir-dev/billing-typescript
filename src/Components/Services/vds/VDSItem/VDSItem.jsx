import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  //  CheckBox,
  ServerState,
} from '../../..'
import PropTypes from 'prop-types'

import s from './VDSItem.module.scss'

export default function VDSItem({
  server,
  setActiveServer,
  activeServerID,
  activeServices,
  setActiveServices,
}) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    // <div className={s.item_wrapper}>
    //   <CheckBox
    //     initialState={activeServices?.some(service => service?.id?.$ === server?.id?.$)}
    //     func={isChecked => {
    //       isChecked
    //         ? setActiveServices(
    //             activeServices?.filter(item => item?.id?.$ !== server?.id?.$),
    //           )
    //         : setActiveServices([...activeServices, server])
    //     }}
    //   />

    <li className={s.item}>
      <button
        className={cn(s.item_btn, {
          [s.active_server]:
            activeServerID === server?.id?.$ ||
            activeServices?.some(service => service?.id?.$ === server?.id?.$),
        })}
        type="button"
        onClick={() => {
          setActiveServer(server)
          setActiveServices([])
          setActiveServices([server])
        }}
      >
        <span className={s.value}>{server?.id?.$}</span>
        <span className={s.value}>{server?.domain?.$}</span>
        <span className={s.value}>{server?.ip?.$}</span>
        <span className={s.value}>{server?.ostempl?.$}</span>
        <span className={s.value}>
          {server?.pricelist?.$}
          <span className={s.price}>
            {server?.cost?.$?.replace('Month', t('short_month', { ns: 'other' }))}
          </span>
        </span>
        <span className={s.value}>{server?.datacentername?.$}</span>
        <ServerState className={s.value} server={server} />
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>
      </button>
    </li>
    // </div>
  )
}

VDSItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
