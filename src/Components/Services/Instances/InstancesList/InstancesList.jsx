import { useMediaQuery } from 'react-responsive'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import InstanceItem from './InstanceItem'
import InstanceItemMobile from './InstanceItemMobile'
import { Icon } from '@components'
import no_vds from '@images/services/no_vds.png'
import { useTranslation } from 'react-i18next'
import { CLOUD_SORT_LIST } from '@utils/constants'

export default function InstancesList({
  instances,
  changeSort,
  checkSortItem,
  editInstance,
  isFiltered,
}) {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const widerThan768 = useMediaQuery({ query: '(min-width: 768px)' })

  const renderHeadCells = () =>
    CLOUD_SORT_LIST.map(cell => {
      const { isActive, icon } = checkSortItem(cell.value)
      const changeSortHandler = () => changeSort(cell.value)

      return (
        <th key={cell.label} className={s.th}>
          {cell.isSort ? (
            <button
              className={cn(s.sort, { [s.sort_active]: isActive })}
              onClick={changeSortHandler}
            >
              {t(cell.label)} <Icon name={icon} />
            </button>
          ) : (
            <>{t(cell.label)}</>
          )}
        </th>
      )
    })

  if (!instances?.length) {
    return (
      <div className={s.no_vds_wrapper}>
        <img className={s.no_vds} src={no_vds} alt="no_vds" />
        <p className={s.no_vds_title}>
          {t(isFiltered ? 'no_servers_yet_filtered' : 'no_servers_yet', { ns: 'vds' })}
        </p>
      </div>
    )
  }

  return (
    <>
      {widerThan768 ? (
        <table className={s.table}>
          <thead className={s.thead}>
            <tr className={s.tr}>
              {/* <th className={s.th}>
                <CheckBox />
              </th> */}
              {renderHeadCells()}
              <th className={s.th}></th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {instances.map(item => (
              <InstanceItem key={item.id.$} item={item} editInstance={editInstance} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className={s.mobile__list}>
          {instances.map(item => (
            <InstanceItemMobile key={item.id.$} item={item} />
          ))}
        </div>
      )}
    </>
  )
}
