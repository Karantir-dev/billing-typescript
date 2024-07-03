import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { CopyText, Loader } from '@components'
import {
  getFlagFromCountryName,
  useCancelRequest,
  formatCountryName,
  cutDcSuffix,
} from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import s from './InstanceDetailsOverview.module.scss'

export default function InstanceDetailsOverview() {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const { item } = useCloudInstanceItemContext()

  const [instanceInfo, setInstanceInfo] = useState({})

  const elid = item?.id?.$
  const itemCountry = formatCountryName(item)

  useEffect(() => {
    dispatch(
      cloudVpsOperations.getInstanceInfo(elid, setInstanceInfo, signal, setIsLoading),
    )
  }, [])

  return (
    <>
      <div className={s.content}>
        <div className={s.leftBlock}>
          <div className={s.block_wrapper}>
            <h3 className={s.block_title}>{t('Instance specifications')}</h3>

            <div className={s.info_block_wrapper}>
              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Image')}</p>
                <p className={s.item_info}>{item?.instances_os?.$}</p>
              </div>

              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Flavor')}</p>
                <p className={s.item_info}>{cutDcSuffix(item?.name?.$)}</p>
              </div>

              <div className={s.info_block_item}>
                <p className={s.item_name}>RAM</p>
                <p className={s.item_info}>{instanceInfo?.Memory?.replace('.', '')}</p>
              </div>

              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Virtual CPUs')}</p>
                <p className={s.item_info}>{instanceInfo?.CPU_count}</p>
              </div>

              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Storage')}</p>
                <p className={s.item_info}>
                  {instanceInfo?.Disk_space?.replace('.', '')}
                </p>
              </div>
            </div>
          </div>

          {/* Othe Details Block */}
          <div className={s.block_wrapper}>
            <h3 className={s.block_title}>{t('Other details')}</h3>

            <div className={s.info_block_wrapper}>
              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('UUID')}</p>
                <p className={s.item_info}>{instanceInfo?.instances_uuid}</p>
              </div>
              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Created at')}</p>
                {instanceInfo?.createdate && (
                  <p className={s.item_info}>{instanceInfo.createdate}</p>
                )}
              </div>
              {/* Region Block */}
              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Region')}</p>
                <div className={s.item_info_block}>
                  <img
                    src={require(`@images/countryFlags/${getFlagFromCountryName(
                      itemCountry,
                    )}.png`)}
                    width={20}
                    height={14}
                    alt={itemCountry}
                  />
                  <p>{t(itemCountry)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.rightBlock}>
          <div className={s.block_wrapper}>
            <h3 className={s.block_title}>{t('Network Details')}</h3>

            <div className={s.info_block_wrapper}>
              {instanceInfo?.network?.map(el => {
                const { ip, ip_v6, rdns_record } = instanceInfo

                const isIpv4 = el?.includes('IPv4')

                const shouldRenderNetworkBlock = (isIpv4 && !!ip) || el?.includes('IPv6')

                return shouldRenderNetworkBlock ? (
                  <div key={el} className={s.network_block_item}>
                    <p className={s.network_item_name}>{el}:</p>
                    <div className={s.network_item}>
                      <div className={s.network_info}>
                        <p className={s.ip_text}>{isIpv4 ? ip : ip_v6}</p>

                        <CopyText
                          text={isIpv4 ? ip : ip_v6}
                          promptText={t('ip_address_copied')}
                        />
                      </div>
                      <button
                        className={s.network_rdns}
                        type="button"
                        onClick={() => {
                          dispatch(
                            cloudVpsActions.setItemForModals({
                              rdns_edit: {
                                rdns_record,
                                ...item,
                              },
                            }),
                          )
                        }}
                      >
                        rDNS
                      </button>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
