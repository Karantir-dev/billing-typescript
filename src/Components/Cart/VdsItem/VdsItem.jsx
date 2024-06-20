import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@components'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { cutDcSuffix, translatePeriodToMonths } from '@utils'
import s from './VdsItem.module.scss'

export default function VdsItem({ el, deleteItemHandler }) {
  const { t } = useTranslation(['vds', 'virtual_hosting', 'cloud_vps'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const dropdownEl = useRef()
  const infoEl = useRef()

  const [dropOpened, setDropOpened] = useState(false)
  const controlPanel = el?.desc?.$?.includes('Control panel')
  const IPaddresses = el?.desc?.$?.includes('IP-addresses')
  const hasBasePrice = el?.desc?.$?.includes('base price')

  const tariffName = cutDcSuffix(el?.pricelist_name?.$)

  const onShevronClick = () => {
    if (!dropOpened) {
      dropdownEl.current.style.height = dropdownEl.current.scrollHeight + 'px'
      if (!tabletOrHigher) {
        //
      } else {
        infoEl.current.style.marginBottom = '5px'
      }
    } else {
      dropdownEl.current.style.height = '0'
      infoEl.current.style.marginBottom = '0'
    }
    setDropOpened(!dropOpened)
  }

  const getTranslatedText = regex => {
    let text = el?.desc?.$?.match(regex)?.[1]
    if (text) {
      if (text?.includes('EUR')) {
        text = text.replace(text.split('EUR ')[1], t(text.split('EUR ')[1].trim()))
      } else {
        text = t(text)
      }
    }

    return text
  }

  const getTranslatedCP = string => {
    let partText = ''
    if (typeof string === 'string') {
      string?.match(/^(.+?)(?= - \d+?\.)/g)?.[0]
    }

    return typeof partText === 'string' && partText
      ? string.replace(partText, t(partText))
      : string
  }

  const IPaddressesCountText = el?.desc?.$?.match(/IP-addresses count(.+?)(?=<br\/>)/)
  const portSpeedCountText = el?.desc?.$?.match(
    /(Port speed|Outgoing traffic)(.+?)(?=<br\/>|$)/,
  )

  return (
    <div className={s.items_wrapper}>
      <div className={s.server_item}>
        {!(el.count > 1) && (
          <button
            className={cn(s.shevron_btn, { [s.opened]: dropOpened })}
            type="button"
            onClick={onShevronClick}
          >
            <Icon
              name="Shevron"
              width={11}
              className={cn({ [s.shevron]: true, [s.opened]: dropOpened })}
            />
          </button>
        )}

        <div className={s.main_info_wrapper} ref={infoEl}>
          <div>
            <p className={s.tariff_name}>{tariffName} </p>
            <div className={s.periodInfo}>
              <span>
                {t('Period', { ns: 'other' })}:
                {/* For cloud VPS we set default period - a day */}
                {el['item.type']?.$ === 'instances'
                  ? ' ' + t('day', { ns: 'cloud_vps' })
                  : ` ${el['item.period']?.$} ${translatePeriodToMonths(
                      el['item.period']?.$,
                    )}`}
              </span>
              <span>
                {t('amount', { ns: 'vds' })}: {el?.count} {t('pcs.', { ns: 'vds' })}
              </span>
            </div>
          </div>

          {!tabletOrHigher && (
            <div className={s.control_bts_wrapper}>
              {typeof deleteItemHandler === 'function' && (
                <button
                  className={s.btn_delete}
                  type="button"
                  onClick={deleteItemHandler}
                >
                  <Icon name="Delete" />
                </button>
              )}
            </div>
          )}
        </div>
        {!(el.count > 1) && (
          <div className={s.dropdown} ref={dropdownEl}>
            {hasBasePrice && (
              <span className={s.value}>
                <b>{t('processors')}:</b>{' '}
                {getTranslatedText(/CPU count(.+?)(?=<br\/>)/)?.trim()}, &nbsp;
              </span>
            )}

            {hasBasePrice && (
              <span className={s.value}>
                <b>{t('memory')}:</b> {getTranslatedText(/Memory(.+?)(?=<br\/>)/)}, &nbsp;
              </span>
            )}

            {hasBasePrice && (
              <span className={s.value}>
                <b>{t('disk_space')}:</b> {getTranslatedText(/Disk space(.+?)(?=<br\/>)/)}
                , &nbsp;
              </span>
            )}

            {IPaddresses && IPaddressesCountText?.length > 0 && (
              <span className={s.value}>
                <b>{t('IPcount')}:</b>{' '}
                {IPaddressesCountText?.length > 1 && IPaddressesCountText[1]
                  ? IPaddressesCountText[1].replace('Unit', t('Unit'))
                  : ''}
                , &nbsp;
              </span>
            )}

            {hasBasePrice && portSpeedCountText?.length > 0 && (
              <span className={s.value}>
                <b>{t('port_speed')}:</b>{' '}
                {portSpeedCountText?.length > 1 && portSpeedCountText[2]
                  ? portSpeedCountText[2]
                  : ''}
                , &nbsp;
              </span>
            )}

            {controlPanel && (
              <span className={s.value}>
                <b>{t('license_to_panel')}:</b>{' '}
                {getTranslatedCP(getTranslatedText(/Control panel (.+?)(?=$|<br\/>)/))}{' '}
                &nbsp;
              </span>
            )}

            {el?.desc?.$.includes('Service limits') && (
              <span className={s.value}>
                <b>{t('Service limits')}:</b> {t('port_speed_limits')} &nbsp;
              </span>
            )}

            {el?.desc?.$.includes('public-v4') && (
              <span className={s.value}>
                <b>IPv4</b> &nbsp;
              </span>
            )}
          </div>
        )}
      </div>

      {typeof deleteItemHandler === 'function' && tabletOrHigher && (
        <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
          <Icon name="Delete" />
        </button>
      )}
    </div>
  )
}
