import PropTypes from 'prop-types'
import VpnTableItem from './VpnTableItem'
import cn from 'classnames'
import { CheckBox } from '@components'
import { useTranslation } from 'react-i18next'
import s from './VpnTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])
  const {
    list,
    selctedItem,
    setSelctedItem,
    historySiteCareHandler,
    prolongSiteCareHandler,
    editSiteCareHandler,
    deleteSiteCareHandler,
    rights,
    setDeleteIds,
    instructionVhostHandler,
  } = props

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(list)
      return
    }
    setSelctedItem([])
  }

  const isAllActive = list?.length && list?.length === selctedItem?.length
  const toggleIsAllActiveHandler = () => setSelectedAll(!isAllActive)

  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <div className={s.checkBoxColumn}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
          />
        </div>
        <div className={s.headerColumnsWithoutCheckBox}>
          <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
          <span className={cn(s.title_text, s.second_item)}>{t('Tariff')}:</span>
          <span className={cn(s.title_text, s.third_item)}>{t('Data center')}:</span>
          <span className={cn(s.title_text, s.fourth_item)}>{t('Valid until')}:</span>
          <span className={cn(s.title_text, s.fifth_item)}>{t('State')}:</span>
          <span className={cn(s.title_text, s.sixth_item)}>{t('Price')}:</span>
          <div style={{ flexBasis: '2%' }} />
        </div>
      </div>
      {list?.map(el => {
        const { id, pricelist, real_expiredate, item_status, cost, datacentername } = el

        const addSelectedItem = (val, ids) => {
          if (val) {
            setSelctedItem(s => [...s, ids])
            return
          }
          setSelctedItem(s => s.filter(el => el !== ids))
        }

        return (
          <VpnTableItem
            key={id?.$}
            id={id?.$}
            tariff={pricelist?.$}
            expiredate={real_expiredate?.$}
            status={item_status?.$}
            item_status={item_status}
            cost={cost?.$}
            setSelctedItem={addSelectedItem}
            selected={selctedItem}
            datacentername={datacentername?.$}
            el={el}
            historySiteCareHandler={historySiteCareHandler}
            prolongSiteCareHandler={prolongSiteCareHandler}
            editSiteCareHandler={editSiteCareHandler}
            deleteSiteCareHandler={deleteSiteCareHandler}
            rights={rights}
            setDeleteIds={setDeleteIds}
            instructionVhostHandler={instructionVhostHandler}
          />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
  setSelctedPayment: PropTypes.func,
  selctedPayment: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  rights: PropTypes.object,
}

Component.defaultProps = {
  list: [],
}
