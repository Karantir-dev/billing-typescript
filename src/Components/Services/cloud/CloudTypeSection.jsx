/* eslint-disable no-unused-vars */
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import crown from '@images/crown.svg'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { useRef } from 'react'

import s from '../../../Pages/ServicesPage/CloudVPSPage/InstancesPage/CreateInstancePage/CreateInstancePage.module.scss'

export default function CloudTypeSection({ signal, setIsLoading, dcKey, value }) {
  const CATEGORIES = useRef(['premium', 'basic'])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation(['cloud_vps'])
  const navigateToCloud = type => navigate(`${route.CLOUD_VPS_CREATE_INSTANCE}/${type}`)

  return (
    <section className={s.section}>
      <h3 className={s.section_title}>{t('server_type')}</h3>

      <ul className={s.grid}>
        {CATEGORIES.current.map(category => {
          return (
            <li
              key={category}
              className={cn(s.category_item, {
                [s.selected]: category === value,
              })}
            >
              <button
                className={cn(s.category_btn, s.serverType_btn)}
                type="button"
                // onClick={() => {
                //   navigateToCloud('premium')
                //   dispatch(
                //     cloudVpsOperations.getOsList({
                //       signal,
                //       setIsLoading,
                //       closeLoader: () => setIsLoading(false),
                //       datacenter: dcKey,
                //       setSshList: getAllSSHList,
                //       /** we pick last tariff in the list because first one doesn`t have Windows OS */
                //       lastTariffID: premiumTariffs[premiumTariffs.length - 1].id.$,
                //     }),
                //   )
                // }}
              >
                <img
                  className={s.serverType_icon}
                  src={crown}
                  width={20}
                  height={14}
                  alt={'Premium VPS crown'}
                />
                Premium VPS
              </button>
            </li>
          )
        })}
        {/* <li
          className={cn(s.category_item, {
            [s.selected]: isPremiumShouldRender,
          })}
        >
          <button
            className={cn(s.category_btn, s.serverType_btn)}
            type="button"
            onClick={() => {
              navigateToCloud('premium')
              dispatch(
                cloudVpsOperations.getOsList({
                  signal,
                  setIsLoading,
                  closeLoader: () => setIsLoading(false),
                  datacenter: dcKey,
                  setSshList: getAllSSHList,
                  
                  lastTariffID: premiumTariffs[premiumTariffs.length - 1].id.$,
                }),
              )
            }}
          >
            <img
              className={s.serverType_icon}
              src={crown}
              width={20}
              height={14}
              alt={'Premium VPS crown'}
            />
            Premium VPS
          </button>
        </li> */}

        {/* <li
          className={cn(s.category_item, s.serverType_item, {
            [s.selected]: !isPremiumShouldRender,
          })}
        >
          <button
            className={cn(s.category_btn, s.serverType_btn)}
            type="button"
            onClick={() => {
              navigateToCloud('basic')

              dispatch(
                cloudVpsOperations.getOsList({
                  signal,
                  setIsLoading,
                  closeLoader: () => setIsLoading(false),
                  datacenter: dcKey,
                  setSshList: getAllSSHList,
                  lastTariffID: otherTariffs?.[0]?.id.$,
                }),
              )
            }}
          >
            Basic VPS
          </button>
        </li> */}
      </ul>
    </section>
  )
}
