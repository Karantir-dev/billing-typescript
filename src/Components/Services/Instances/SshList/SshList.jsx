import { useMediaQuery } from 'react-responsive'
import s from './SshList.module.scss'
import cn from 'classnames'
import SshItem from './SshItem'
import SshItemMobile from './SshItemMobile'
import { Icon } from '@components'
import no_vds from '@images/services/no_vds.png'
import { useTranslation } from 'react-i18next'

export default function SshList({ ssh, setSortHandler, sortBy, editSsh }) {
  const { t } = useTranslation(['cloud_vps'])
  const headCells = [
    { name: t('Name'), isSort: false, key: 'comment' },
    { name: t('Created at'), isSort: false, key: 'cdate' },
    { name: t('Fingerprint'), isSort: false, key: 'fingerprint' },
  ]

  const widerThan768 = useMediaQuery({ query: '(min-width: 768px)' })

  const renderHeadCells = () =>
    headCells.map(cell => {
      const isActiveSort = sortBy?.replace(/[+-]/g, '') === cell.key

      const changeSortHandler = () => {
        if (isActiveSort && sortBy[0] === '-') {
          setSortHandler(`+${cell.key}`)
        } else {
          setSortHandler(`-${cell.key}`)
        }
      }

      const isDesc = isActiveSort && sortBy[0] === '+'

      return (
        <th key={cell.name} className={s.th}>
          {cell.isSort ? (
            <button
              className={cn(s.sort, { [s.sort_active]: isActiveSort })}
              onClick={changeSortHandler}
            >
              {cell.name} <Icon name={`Sort_${isDesc ? 'z_a' : 'a_z'}`} />
            </button>
          ) : (
            <>{cell.name}</>
          )}
        </th>
      )
    })

  if (!ssh?.length) {
    return (
      <div className={s.no_vds_wrapper}>
        <img className={s.no_vds} src={no_vds} alt={t('no_ssh_yet')} />
        <p className={s.no_vds_title}>{t('no_ssh_yet')}</p>
      </div>
    )
  }

  return (
    <>
      {widerThan768 ? (
        <table className={s.table}>
          <thead className={s.thead}>
            <tr className={s.tr}>
              {/* <th>
                <CheckBox />
              </th> */}
              {renderHeadCells()}
              <th className={s.th}></th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {ssh.map(item => (
              <SshItem key={item.elid.$} item={item} editSsh={editSsh} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className={s.mobile__list}>
          {ssh.map(item => (
            <SshItemMobile key={item.elid.$} item={item} />
          ))}
        </div>
      )}
    </>
  )
}
