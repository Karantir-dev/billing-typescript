import s from './DomainsTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ServerState, CheckBox, Options } from '@components'
import { isUnpaidOrder } from '@utils'

export default function Component(props) {
  const {
    id,
    domain,
    tariff,
    expiredate,
    cost,
    setSelctedItem,
    selected,
    el,
    editDomainHandler,
    renewDomainHandler,
    historyDomainHandler,
    whoisDomainHandler,
    NSDomainHandler,
    rights,
    unpaidItems,
  } = props
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const mobile = useMediaQuery({ query: '(max-width: 1549px)' })

  const isActive = selected?.includes(el)
  const toggleIsActiveHandler = () => setSelctedItem(!isActive, el)

  const deleteOption = isUnpaidOrder(el, unpaidItems)

  const options = [
    deleteOption,
    {
      label: t('prolong', { ns: 'vds' }),
      icon: 'Clock',
      disabled: !rights?.prolong,
      onClick: () => renewDomainHandler(id),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !rights?.edit,
      onClick: () => editDomainHandler(id),
    },
    {
      label: t('history', { ns: 'vds' }),
      icon: 'Refund',
      disabled: !rights?.history,
      onClick: () => historyDomainHandler(id),
    },
    {
      label: t('whois'),
      icon: 'Whois',
      disabled: !rights?.whois,
      onClick: () => whoisDomainHandler(id),
    },
    {
      label: t('View/change the list of name servers'),
      icon: 'DomainsListName',
      disabled: !rights?.ns,
      onClick: () => NSDomainHandler(id),
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
          {mobile && <div className={s.item_title}>{t('Domain name')}:</div>}
          <div className={cn(s.item_text, s.second_item)}>{domain}</div>
        </div>
        <div className={s.tableBlockThird}>
          {mobile && <div className={s.item_title}>{t('Tariff')}:</div>}
          <div className={cn(s.item_text, s.third_item)}>{tariff}</div>
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
          <div className={cn(s.item_text, s.seventh_item)}>
            {cost.replace('Year', t('Year', { ns: 'other' }))}
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
  selected: PropTypes.array,
  rights: PropTypes.object,
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelctedTicket: () => null,
  selected: [],
}
