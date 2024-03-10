/* eslint-disable no-unused-vars */

import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import dayjs from 'dayjs'

import { getFlagFromCountryName } from '@utils'

import s from './InstanceDetailsOverview.module.scss'
import cn from 'classnames'

export default function InstanceDetailsOverview() {
  const { i18n, t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const location = useLocation()
  // const params = useParams()

  const { state: item } = location

  const [instanceInfo, setInstanceInfo] = useState({})

  useEffect(() => {
    const elid = item?.id?.$
    elid && dispatch(cloudVpsOperations.getInstanceInfo(elid, {}, setInstanceInfo))
  }, [])

  function formatDate(date) {
    const currentLang = dayjs.locale(i18n.language)
    const months = {
      uk: [
        'Січ',
        'Лют',
        'Бер',
        'Квіт',
        'Трав',
        'Черв',
        'Лип',
        'Серп',
        'Вер',
        'Жовт',
        'Лист',
        'Груд',
      ],
      en: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      ru: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ],
    }

    const day = date.getDate()
    const month = months[currentLang][date.getMonth()]
    const year = date.getFullYear()

    return `${month} ${day}, ${year}`
  }

  return (
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
              <p className={s.item_info}>{instanceInfo?.Disk_space}</p>
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
                <p className={s.item_info}>
                  {formatDate(new Date(instanceInfo?.createdate))}
                </p>
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
                  alt={item.datacentername.$.replace('Fotbo ', '')}
                />
                <p>{item?.datacentername?.$?.replace('Fotbo ', '')}</p>
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
  )
}
