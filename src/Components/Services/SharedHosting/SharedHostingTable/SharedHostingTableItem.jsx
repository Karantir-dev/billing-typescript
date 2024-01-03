import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { CheckBox, ServerState, Options } from '@components'
import s from './SharedHostingTable.module.scss'
import { isUnpaidOrder } from '@src/utils'

export default function Component(props) {
  const {
    id,
    domain,
    tariff,
    expiredate,
    cost,
    setSelctedItem,
    // selected,
    el,
    historyVhostHandler,
    instructionVhostHandler,
    platformVhostHandler,
    prolongVhostHandler,
    editVhostHandler,
    changeTariffVhostHandler,
    setElidForProlongModal,
    ip,
    datacentername,
    rights,
    activeServices,
    setActiveServices,
    setIdForDeleteModal,
    unpaidItems,
  } = props
  const { t } = useTranslation(['domains', 'other', 'vds', 'dedicated_servers'])
  const mobile = useMediaQuery({ query: '(max-width: 1599px)' })

  const isActive = activeServices?.some(service => service?.id?.$ === id)
  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== id))
      : setActiveServices([...activeServices, el])
  }

  const deleteOption = isUnpaidOrder(el, unpaidItems)

  const options = [
    deleteOption,
    {
      label: t('instruction', { ns: 'vds' }),
      icon: 'Info',
      disabled: !rights?.instruction || el?.status?.$ === '1',
      onClick: instructionVhostHandler,
    },
    {
      label: t('go_to_panel', { ns: 'vds' }),
      icon: 'ExitSign',
      disabled: el.transition?.$ !== 'on' || el?.status?.$ !== '2' || !rights?.gotoserver,
      onClick: platformVhostHandler,
    },
    {
      label: t('prolong', { ns: 'vds' }),
      icon: 'Clock',
      disabled: !rights?.prolong || el?.status?.$ === '1',
      onClick: () => {
        prolongVhostHandler()
        setElidForProlongModal([id])
      },
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !rights?.edit,
      onClick: () => editVhostHandler(),
    },
    {
      label: t('trusted_users.Change tariff', { ns: 'trusted_users' }),
      icon: 'ChangeTariff',
      disabled: !rights?.changepricelist || el?.status?.$ === '1',
      onClick: changeTariffVhostHandler,
    },
    {
      label: t('history', { ns: 'vds' }),
      icon: 'Refund',
      disabled: !rights?.history,
      onClick: historyVhostHandler,
    },
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled:
        el?.status?.$ === '5' || el?.scheduledclose?.$ === 'on' || !rights?.delete,
      onClick: () => setIdForDeleteModal([id]),
      isDelete: true,
    },
  ]

  return (
    <div className={s.item_container}>
      {!mobile && (
        <>
          <CheckBox
            className={s.check_box}
            value={isActive}
            onClick={toggleIsActiveHandler}
          />
        </>
      )}

      <div
        data-testid="archive_item"
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={() => setSelctedItem(id)}
        className={cn(s.item, { [s.selected]: false })}
      >
        {mobile && (
          <CheckBox
            className={s.check_box}
            value={isActive}
            onClick={toggleIsActiveHandler}
          />
        )}

        {mobile && <div className={s.line} />}

        <div className={s.tableBlockFirst}>
          {mobile && <div className={s.item_title}>{t('Id')}:</div>}
          <div className={cn(s.item_text, s.first_item)}>{id}</div>
        </div>
        <div className={s.tableBlockSecond}>
          {mobile && <div className={s.item_title}>{t('Domain name')}:</div>}
          <div className={cn(s.item_text, s.second_item, { [s.inactive]: !domain })}>
            {domain ? domain : t('Not provided', { ns: 'dedicated_servers' })}
          </div>
        </div>
        <div className={s.tableBlockThird}>
          {mobile && <div className={s.item_title}>{t('IP address')}:</div>}
          <div className={cn(s.item_text, s.second_item, { [s.inactive]: !ip })}>
            {ip ? ip : t('Not provided', { ns: 'dedicated_servers' })}
          </div>
        </div>
        <div className={s.tableBlockFourth}>
          {mobile && <div className={s.item_title}>{t('Tariff')}:</div>}
          <div className={cn(s.item_text, s.third_item)}>{tariff}</div>
        </div>
        <div className={s.tableBlockFifth}>
          {mobile && <div className={s.item_title}>{t('Data center')}:</div>}
          <div
            className={cn(s.item_text, s.third_item, { [s.inactive]: !datacentername })}
          >
            {datacentername
              ? datacentername
              : t('Not provided', { ns: 'dedicated_servers' })}
          </div>
        </div>
        <div className={s.tableBlockSixth}>
          {mobile && <div className={s.item_title}>{t('Valid until')}:</div>}
          <div className={cn(s.item_text, s.fourth_item)}>{expiredate}</div>
        </div>
        <div className={s.tableBlockSeventh}>
          {mobile && <div className={s.item_title}>{t('status', { ns: 'other' })}:</div>}
          <ServerState server={el} />
        </div>
        <div className={s.tableBlockEighth}>
          {mobile && <div className={s.item_title}>{t('Price')}:</div>}
          <div className={cn(s.item_text, s.seventh_item)}>
            {cost.replace('Month', t('Month', { ns: 'other' }))}
          </div>
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
  activeServices: PropTypes.array,
  setActiveServices: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
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
