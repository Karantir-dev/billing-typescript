/* eslint-disable no-unused-vars */

import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'
import dayjs from 'dayjs'

import { Loader } from '@components'
import { getFlagFromCountryName, useCancelRequest } from '@utils'
import formatCountryName from '@components/Services/Instances/ExternalFunc/formatCountryName'

import s from './InstanceDetailsOverview.module.scss'

export default function InstanceDetailsOverview() {
  const { i18n, t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const location = useLocation()
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const { state: item } = location

  const [instanceInfo, setInstanceInfo] = useState({})

  useEffect(() => {
    const elid = item?.id?.$
    elid &&
      dispatch(
        cloudVpsOperations.getInstanceInfo(
          elid,
          {},
          setInstanceInfo,
          signal,
          setIsLoading,
        ),
      )
  }, [])

  function formatDate() {
    const formattedDate = dayjs(instanceInfo.createdate).format('MMM DD YYYY')

    return `${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}`
  }

  const itemCountry = formatCountryName(item)

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
                <p className={s.item_info}>{instanceInfo?.CPU}</p>
              </div>

              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Storage')}</p>
                <p className={s.item_info}>{instanceInfo?.Disk_space?.replace('.', '')}</p>
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
                  <p className={s.item_info}>{formatDate()}</p>
                )}
              </div>
              {/* Region Block */}
              <div className={s.info_block_item}>
                <p className={s.item_name}>{t('Region')}</p>
                <div className={s.item_info_block}>
                  <img
                    src={require(`@images/countryFlags/${getFlagFromCountryName(
                      item.datacentername.$.split(' ')[1],
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
                const { ip, ip_v6 } = instanceInfo
                return (
                  <div key={el} className={s.network_block_item}>
                    <p className={s.network_item_name}>{el}:</p>
                    <div className={s.network_item}>
                      <span>{el?.includes('v4') ? 'IPv4:' : 'IPv6:'}</span>
                      <p>{el?.includes('v4') ? ip : ip_v6}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
