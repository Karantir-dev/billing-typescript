import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DNSItem.module.scss'
import { CheckBox, ServerState, Options } from '@components'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '@redux'
import { isUnpaidOrder } from '@utils'

export default function DNSItem({
  storage,
  pageRights,
  activeServices,
  setActiveServices,
  setElidForProlongModal,
  setElidForEditModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])

  const dispatch = useDispatch()

  const deleteOption = isUnpaidOrder(storage, unpaidItems)

  const isToolsBtnVisible =
    Object.keys(pageRights)?.filter(
      key => key !== 'ask' && key !== 'filter' && key !== 'new',
    ).length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === storage?.id?.$)

  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== storage?.id?.$))
      : setActiveServices([...activeServices, storage])
  }

  const handleToolBtnClick = fn => {
    fn()
  }

  const options = [
    deleteOption,
    {
      label: t('instruction'),
      icon: 'Info',
      disabled: storage?.status?.$ === '1' || !pageRights?.instruction,
      onClick: () => handleToolBtnClick(setElidForInstructionModal),
    },
    {
      label: t('go_to_panel'),
      icon: 'ExitSign',
      disabled:
        storage.transition?.$ !== 'on' ||
        !pageRights?.gotoserver ||
        storage?.status?.$ !== '2',
      onClick: () => dispatch(dedicOperations.goToPanel(storage.id.$)),
    },
    {
      label: t('prolong'),
      icon: 'Clock',
      disabled: storage?.status?.$ === '1' || !pageRights?.prolong,
      onClick: () => handleToolBtnClick(setElidForProlongModal),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !pageRights?.edit || storage?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForEditModal),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled: !pageRights?.history || storage?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForHistoryModal),
    },
  ]

  return (
    <div className={s.item_wrapper}>
      <CheckBox
        className={s.check_box}
        value={isActive}
        onClick={toggleIsActiveHandler}
      />

      <div
        className={cn(s.item, {
          [s.active_server]: isActive,
        })}
      >
        <span className={s.value}>{storage?.id?.$}</span>
        <span className={s.value}>
          {storage?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
            .replace('domains', t('domains', { ns: 'dns' }))
            .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
        </span>
        <span className={s.value}>{storage?.datacentername?.$}</span>
        <span className={s.value}>{storage?.createdate?.$}</span>
        <span className={s.value}>{storage?.expiredate?.$}</span>
        <ServerState className={s.value} server={storage} />

        <span className={s.value}>
          {storage?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>

        {isToolsBtnVisible && <Options options={options} />}
      </div>
    </div>
  )
}

DNSItem.propTypes = {
  storage: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  pageRights: PropTypes.object,
}
