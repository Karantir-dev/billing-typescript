import { Icon, Select, TariffConfig } from '@components'
import { useTranslation } from 'react-i18next'
import s from '../OrderTariff.module.scss'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { getPortSpeed } from '@utils'

export default function FirstStep({
  parameters,
  setParameters,
  service,
  periods,
  changeFieldHandler,
  count,
  setCount,
  passStep,
  totalPrice,
  isConfigToggle,
  isShowTariffInfo,
}) {
  const { t } = useTranslation(['dedicated_servers', 'cart', 'vds'])
  const [isConfigOpened, setIsConfigOpened] = useState(!isConfigToggle)
  const [isFormError, setIsFormError] = useState(false)
  const [tariffInfo, setTariffInfo] = useState({})

  useEffect(() => {
    if (service === 'vds' && isShowTariffInfo) {
      const orderInfo = parameters.orderinfo.$.split('<br/>')

      const domain_name = parameters.domain?.$ || t('not_set', { ns: 'vds' })
      const server_name = parameters.server_name?.$ || t('not_set', { ns: 'vds' })
      const cpu_count =
        orderInfo.find(info => info.includes('CPU count')).replace('CPU count', '') +
        ' core Intel Xeon'
      const ram = orderInfo
        .find(info => info.includes('Memory'))
        .split(' - ')[0]
        .replace('Memory', '')
      const drive = orderInfo
        .find(info => info.includes('Disk space'))
        .split(' - ')[0]
        .replace('Disk space', '')
      const os = parameters.slist
        .find(el => el.$name === 'ostempl')
        ?.val.find(el => el.$key === parameters.ostempl?.$)?.$
      const software =
        parameters.recipe?.$ !== 'null'
          ? parameters.slist
              .find(el => el.$name === 'recipe')
              ?.val.find(el => el.$key === parameters.recipe?.$)?.$
          : t('not_set', { ns: 'vds' })
      const license = orderInfo
        .find(info => info.includes('Control panel'))
        .split(' - ')[0]
        .replace('Control panel', '')
        .replace('Without a license', t('Without a license'))
      const port_speed = getPortSpeed(parameters).split(' (')[0]
      const ip_count = orderInfo
        .find(info => info.includes('IP-addresses count'))
        .replace('IP-addresses count', '')
        .replace('Unit', t('Unit'))
      const autoprolong =
        parameters.autoprolong?.$ === 'null'
          ? t('off', { ns: 'cart' })
          : `${parameters.autoprolong?.$} ${t('short_month', { ns: 'other' })}`

      setTariffInfo({
        domain_name,
        server_name,
        cpu_count,
        ram,
        drive,
        os,
        software,
        license,
        port_speed,
        ip_count,
        autoprolong,
      })
    }
  }, [parameters])

  return (
    <>
      <div className={cn(s.service_wrapper, s.mw)}>
        <div className={s.service}>
          <div>
            <p className={s.service_title}>
              {parameters?.messages.msg.title.split('/')?.[0]}
            </p>
            <p className={s.service_subtitle}>{t(service, { ns: 'cart' })}</p>
          </div>
          <div className={s.service_options}>
            {periods.length > 1 && (
              <div className={s.service_option}>
                <Select
                  className={s.period_select}
                  inputClassName={s.field_bgs}
                  label={`${t('payment_period', { ns: 'dedicated_servers' })}:`}
                  itemsList={periods.map(el => {
                    return {
                      label: t(el.$, {
                        ns: 'dedicated_servers',
                      }),
                      value: el.$key,
                    }
                  })}
                  value={parameters?.order_period.$}
                  getElement={value => changeFieldHandler('period', { $: value }, true)}
                  isShadow
                />
              </div>
            )}

            {service === 'vds' && (
              <div className={s.service_option}>
                <label className={s.label}>{t('amount', { ns: 'vds' })}</label>
                <div className={s.count_wrapper}>
                  <button
                    className={cn(s.count_btn, s.count_btn_decrement)}
                    onClick={() => {
                      setCount(prev => +prev - 1)
                    }}
                    disabled={+count <= 1}
                  ></button>
                  <input
                    className={cn(s.count_input, s.field_bgs)}
                    value={count}
                    onChange={event => {
                      const value =
                        event.target.value.length > 1
                          ? event.target.value.replace(/^0/, '')
                          : event.target.value
                      setCount(+event.target.value > 35 ? 35 : +value)
                    }}
                    onBlur={event => {
                      if (event.target.value < 1) setCount(1)
                    }}
                    type="number"
                    min={1}
                    max={35}
                  />
                  <button
                    className={cn(s.count_btn, s.count_btn_increment)}
                    onClick={() => {
                      setCount(prev => +prev + 1)
                    }}
                    disabled={+count >= 35}
                  ></button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={s.tariff_info}>
          {isShowTariffInfo && service === 'vds' && (
            <div className={s.config_desc}>
              <ul className={s.config_desc_list}>
                <li className={cn(s.config_desc_item, s.config_desc_item_bold)}>
                  {t('server_name')}: {tariffInfo.server_name}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>vCPU:</span>{' '}
                  {tariffInfo.cpu_count}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>
                    {t('memory', { ns: 'vds' })}:
                  </span>{' '}
                  {tariffInfo.ram}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>
                    {t('disk_space', { ns: 'vds' })}:
                  </span>{' '}
                  {tariffInfo.drive}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>{t('os')}:</span>{' '}
                  {tariffInfo.os}
                </li>
              </ul>
              <ul className={s.config_desc_list}>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>
                    {t('Preinstalled software')}:
                  </span>{' '}
                  {tariffInfo.software}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>
                    {t('license', { ns: 'vds' })}:
                  </span>{' '}
                  {tariffInfo.license}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>{t('port_speed')}:</span>{' '}
                  {tariffInfo.port_speed}{' '}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>
                    {t('IP-addresses count')}:
                  </span>{' '}
                  {tariffInfo.ip_count}{' '}
                </li>
                <li className={s.config_desc_item}>
                  <span className={s.config_desc_item_bold}>{t('Domain name')}:</span>{' '}
                  {tariffInfo.domain_name}
                </li>
              </ul>
              {parameters.autoprolong?.$ && (
                <p className={cn(s.config_desc_item, s.config_desc_item_autoprolong)}>
                  <span className={s.config_desc_item_bold}>{t('autoprolong')}:</span>{' '}
                  {tariffInfo.autoprolong}
                </p>
              )}
            </div>
          )}
        </div>
        {isConfigToggle && (
          <div className={s.toggle_config_wrapper}>
            <button
              className={s.toggle_config}
              onClick={() => setIsConfigOpened(prev => !prev)}
            >
              <Icon name="Settings" /> {t('edit', { ns: 'cart' })}
            </button>
            {isFormError && !isConfigOpened && (
              <span className={s.config_error}>{t('form_invalid', { ns: 'cart' })}</span>
            )}
          </div>
        )}
      </div>

      <div className={cn({ [s.config_hidden]: !isConfigOpened })}>
        <TariffConfig
          parameters={parameters}
          setParameters={setParameters}
          service={service}
          changeFieldHandler={changeFieldHandler}
          onSubmit={passStep}
          setIsFormError={setIsFormError}
        />
      </div>

      {Number(totalPrice) > 0 ? (
        <div className={s.service_price}>
          {t('Total', { ns: 'cart' })}:<b>{totalPrice} EUR</b>
        </div>
      ) : null}
    </>
  )
}
