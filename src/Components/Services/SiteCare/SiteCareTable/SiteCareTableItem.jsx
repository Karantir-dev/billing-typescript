import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ServerState, CheckBox, Options } from '@components'
import { creteTicketOption, isUnpaidOrder, useOutsideAlerter } from '@utils'
import s from './SiteCareTable.module.scss'

export default function Component(props) {
  const {
    id,
    tariff,
    expiredate,
    cost,
    setSelctedItem,
    selected,
    el,
    datacentername,
    historySiteCareHandler,
    prolongSiteCareHandler,
    editSiteCareHandler,
    deleteSiteCareHandler,
    item_status,
    rights,
    setDeleteIds,
    unpaidItems,
  } = props
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const mobile = useMediaQuery({ query: '(max-width: 1549px)' })

  const [isOpened, setIsOpened] = useState(false)
  const dropDownEl = useRef()

  const closeMenuHandler = () => {
    setIsOpened(!isOpened)
  }

  useOutsideAlerter(dropDownEl, isOpened, closeMenuHandler)

  const isActive = selected?.includes(el)
  const toggleIsActiveHandler = () => setSelctedItem(!isActive, el)

  const deleteOption = isUnpaidOrder(el, unpaidItems)
  const createTicketOption = creteTicketOption(id)

  const options = [
    deleteOption,
    {
      label: t('prolong', { ns: 'vds' }),
      icon: 'Clock',
      disabled: el?.status?.$ === '5' || !rights?.prolong,
      onClick: () => prolongSiteCareHandler(id),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !rights?.edit,
      onClick: () => editSiteCareHandler(id),
    },

    {
      label: t('history', { ns: 'vds' }),
      icon: 'Refund',
      disabled: !rights?.history,
      onClick: () => historySiteCareHandler(id),
    },
    createTicketOption,
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled:
        !rights?.delete ||
        item_status?.$orig === '5_open' ||
        el?.scheduledclose?.$ === 'on' ||
        el?.status?.$ === '5',
      onClick: () => {
        deleteSiteCareHandler(id)
        setDeleteIds(id)
      },
      isDelete: true,
    },
  ]

  return (
    <div className={s.item}>
      <div className={s.checkBoxColumn}>
        <CheckBox
          className={s.check_box}
          value={isActive}
          onClick={toggleIsActiveHandler}
        />
      </div>
      <div className={s.columnsWithoutCheckBox}>
        <div className={s.tableBlockFirst}>
          {mobile && <div className={s.item_title}>{t('Id')}:</div>}
          <div className={cn(s.item_text, s.first_item)}>{id}</div>
        </div>
        <div className={s.tableBlockSecond}>
          {mobile && <div className={s.item_title}>{t('Tariff')}:</div>}
          <div className={cn(s.item_text, s.third_item)}>{tariff}</div>
        </div>
        <div className={s.tableBlockThird}>
          {mobile && <div className={s.item_title}>{t('Data center')}:</div>}
          <div className={cn(s.item_text, s.third_item)}>{datacentername}</div>
        </div>
        <div className={s.tableBlockFourth}>
          {mobile && <div className={s.item_title}>{t('Valid until')}:</div>}
          <div className={cn(s.item_text, s.fourth_item)}>{expiredate}</div>
        </div>
        <div className={s.tableBlockFifth}>
          {mobile && <div className={s.item_title}>{t('State')}:</div>}
          <ServerState server={el} />
        </div>
        <div className={s.tableBlockSixth}>
          {mobile && <div className={s.item_title}>{t('Price')}:</div>}
          <div className={cn(s.item_text, s.seventh_item)}>{cost}</div>
        </div>
        <div className={s.dots}>
          <Options options={options} />
        </div>
      </div>
    </div>
  )
}
Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  unread: PropTypes.bool,
  setSelctedTicket: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
  rights: PropTypes.object,
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelctedTicket: () => null,
  selected: null,
}
