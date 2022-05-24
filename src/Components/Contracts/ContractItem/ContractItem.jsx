import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { DownloadWithFolder, Print } from '../../../images'
import { useOutsideAlerter } from '../../../utils'

import s from './ContractItem.module.scss'

export default function ContractItem(props) {
  const {
    contractNumber,
    clientName,
    contractName,
    id,
    signDate,
    endDate,
    companyName,
    status,
    selectedContract,
    setSelectedContract,
  } = props

  const [dropDown, setDropDown] = useState(false)

  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })
  const desktop = useMediaQuery({ query: '(max-width: 1549px)' })

  const dropDownRef = useRef(null)

  const dropdownHandler = () => {
    setDropDown(!dropDown)
  }

  useOutsideAlerter(dropDownRef, dropDown, dropdownHandler)

  const { t } = useTranslation(['contracts', 'other', 'billing'])

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => null}
        className={cn({ [s.card]: true, [s.selected]: selectedContract })}
        onClick={() => setSelectedContract(id)}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={dropdownHandler}
          onKeyDown={() => null}
          className={cn({ [s.three_dots]: true, [s.mobile]: !mobile })}
        >
          <span className={cn({ [s.dot]: true, [s.active]: dropDown })}></span>
          <span className={cn({ [s.dot]: true, [s.active]: dropDown })}></span>
          <span className={cn({ [s.dot]: true, [s.active]: dropDown })}></span>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={() => null}
            onClick={e => e.stopPropagation()}
            className={cn({
              [s.list]: true,
              [s.opened]: dropDown,
            })}
            ref={dropDownRef}
          >
            <button className={cn({ [s.btn]: true })}>
              <Print className={s.icon} />
              <p className={s.btn_text}>{t('print')}</p>
            </button>

            <button
              className={cn({
                [s.btn]: true,
              })}
            >
              <DownloadWithFolder className={s.icon} />
              <p className={s.btn_text}>{t('Download', { ns: 'billing' })}</p>
            </button>
          </div>
        </div>

        <div className={cn({ [s.card_item_wrapper]: true, [s.first_cell]: true })}>
          {desktop && (
            <span className={s.item_title}>{t('Number', { ns: 'other' })}:</span>
          )}
          <span className={s.item_text}>{contractNumber}</span>
        </div>
        <div className={cn({ [s.card_item_wrapper]: true, [s.second_cell]: true })}>
          {desktop && <span className={s.item_title}>{t('signdate')}:</span>}
          <span className={s.item_text}>{signDate}</span>
        </div>
        <div className={cn({ [s.card_item_wrapper]: true, [s.third_cell]: true })}>
          {desktop && <span className={s.item_title}>{t('enddate')}:</span>}
          <span className={s.item_text}>{endDate ? endDate : '-'}</span>
        </div>
        <div className={cn({ [s.card_item_wrapper]: true, [s.fourth_cell]: true })}>
          {desktop && (
            <span className={s.item_title}>{t('Payer', { ns: 'other' })}:</span>
          )}
          <span className={s.item_text}>{clientName}</span>
        </div>
        <div className={cn({ [s.card_item_wrapper]: true, [s.fifth_cell]: true })}>
          {desktop && <span className={s.item_title}>{t('company')}:</span>}
          <span className={s.item_text}>{companyName}</span>
        </div>
        <div className={cn({ [s.card_item_wrapper]: true, [s.sixth_cell]: true })}>
          {desktop && <span className={s.item_title}>{t('contract_name')}:</span>}
          <span className={s.item_text}>{contractName}</span>
        </div>
        <div className={cn({ [s.card_item_wrapper]: true, [s.seventh_cell]: true })}>
          {desktop && (
            <span className={s.item_title}>{t('status', { ns: 'other' })}:</span>
          )}
          <span className={cn({ [s.status]: true, [s.text]: true })}>
            {t(`${status}`)}
          </span>
        </div>
      </div>
    </>
  )
}
