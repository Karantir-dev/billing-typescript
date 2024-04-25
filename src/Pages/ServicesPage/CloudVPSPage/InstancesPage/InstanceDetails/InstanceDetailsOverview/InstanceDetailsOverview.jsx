import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { CopyText, Loader } from '@components'
import { getFlagFromCountryName, useCancelRequest, formatCountryName } from '@utils'

import s from './InstanceDetailsOverview.module.scss'

export default function InstanceDetailsOverview() {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const location = useLocation()
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const { state: item } = location

  const [instanceInfo, setInstanceInfo] = useState({})

  const elid = item?.id?.$
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  useEffect(() => {
    elid &&
      dispatch(
        cloudVpsOperations.getInstanceInfo(elid, setInstanceInfo, signal, setIsLoading),
      )
  }, [])

  const itemCountry = formatCountryName(item)

  useEffect(() => {
    dispatch(cloudVpsOperations.getInstanceInfo(elid, setInstanceInfo))
  }, [itemForModals])

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
                <p className={s.item_info}>{item?.name?.$}</p>
              </div>

              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Memory')}</p>
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
                <p className={s.item_info}>{instanceInfo?.fotbo_id}</p>
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
                  <p>{itemCountry}</p>
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

                        <CopyText text={isIpv4 ? ip : ip_v6} />
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
