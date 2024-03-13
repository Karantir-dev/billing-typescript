/* eslint-disable no-unused-vars */
import { useMediaQuery } from 'react-responsive'
import s from '../InstancesList/InstancesList.module.scss'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import SshItem from './SshItem'
// import InstanceItemMobile from './InstanceItemMobile'
import { useState } from 'react'
import { CheckBox, Icon } from '@components'
import { Modals } from '../Modals/Modals'
import no_vds from '@images/services/no_vds.png'
import { useTranslation } from 'react-i18next'
const headCells = [
  { name: 'Name', isSort: true, key: 'comment' },
  { name: 'Created at', isSort: true, key: 'cdate' },
  { name: 'Fingerprint', isSort: false, key: 'fingerprint' },
]

export default function SshList({
  ssh,
  setSortHandler,
  sortBy,
  editInstance,
}) {
  const { t } = useTranslation(['vds', 'other'])
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
        <th key={cell.name}>
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
        <img className={s.no_vds} src={no_vds} alt="no_vds" />
        <p className={s.no_vds_title}>{t('no_servers_yet')}</p>
      </div>
    )
  }

  return (
    <>
      {widerThan768 ? (
        <table>
          <thead>
            <tr>
              {/* <th>
                <CheckBox />
              </th> */}
              {renderHeadCells()}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ssh.map(item => (
              <SshItem
                key={item.elid.$}
                item={item}
                editInstance={editInstance}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className={s.mobile__list}>
          {/* {ssh.map(item => (
            <InstanceItemMobile
              key={item.elid.$}
              item={item}
            />
          ))} */}
          here going to be mobile component
        </div>
      )}
    </>
  )
}
