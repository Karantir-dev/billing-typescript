import { Select, TariffConfig } from '@components'
import { useTranslation } from 'react-i18next'
import s from '../CartPage.module.scss'
import cn from 'classnames'

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
}) {
  const { t } = useTranslation(['dedicated_servers', 'cart', 'vds'])

  return (
    <>
      <div className={cn(s.service, s.mw)}>
        <div>
          <p className={s.service_title}>
            {parameters?.messages.msg.title.split(' - ')[1].split('/')?.[0]}
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
                value={parameters?.period.$}
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
                    setCount(+event.target.value > 50 ? 50 : value)
                  }}
                  onBlur={event => {
                    if (event.target.value < 1) setCount(1)
                  }}
                  type="number"
                  min={1}
                  max={50}
                />
                <button
                  className={cn(s.count_btn, s.count_btn_increment)}
                  onClick={() => {
                    setCount(prev => +prev + 1)
                  }}
                  disabled={+count >= 50}
                ></button>
              </div>
            </div>
          )}
        </div>
      </div>
      <TariffConfig
        parameters={parameters}
        setParameters={setParameters}
        service={service}
        changeFieldHandler={changeFieldHandler}
        onSubmit={passStep}
      />
      {Number(totalPrice) > 0 ? (
        <div className={s.service_price}>
          {t('Total', { ns: 'cart' })}:<b>{totalPrice.toFixed(2)} EUR</b>
        </div>
      ) : null}
    </>
  )
}
