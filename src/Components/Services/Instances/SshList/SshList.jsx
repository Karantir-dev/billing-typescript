import { useMediaQuery } from 'react-responsive'
import s from './SshList.module.scss'
import SshItem from './SshItem'
import SshItemMobile from './SshItemMobile'
import no_vds from '@images/services/no_vds.png'
import { useTranslation } from 'react-i18next'

export default function SshList({ ssh }) {
  const { t } = useTranslation(['cloud_vps'])
  const headCells = [
    { name: t('Name'), isSort: false, key: 'comment' },
    { name: t('Created at'), isSort: false, key: 'cdate' },
    { name: t('Fingerprint'), isSort: false, key: 'fingerprint' },
  ]

  const widerThan768 = useMediaQuery({ query: '(min-width: 768px)' })

  const renderHeadCells = () =>
    headCells.map(cell => {
      return (
        <th key={cell.name} className={s.th}>
          {cell.name}
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
              <SshItem key={item.elid.$} item={item} />
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
