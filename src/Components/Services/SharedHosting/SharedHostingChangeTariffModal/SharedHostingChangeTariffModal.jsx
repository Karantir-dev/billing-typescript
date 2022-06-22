import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Portal, RadioButton, Button } from '../../..'
import s from './SharedHostingChangeTariffModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other', 'domains'])

  const {
    name,
    closeChangeTariffModalHandler,
    changeTariffData,
    changeTariffInfoVhostHandler,
    changeTariffInfoData,
    changeTariffSaveVhostHandler,
  } = props

  const [tariff, setTariff] = useState(null)

  const setTariffHandler = (name, value) => {
    if (value) {
      changeTariffInfoVhostHandler(value)
      setTariff(value)
    }
  }

  const parsePrice = price => {
    const words = price?.match(/[\d|.|\\+]+/g)
    const amounts = []

    if (words.length > 0) {
      words.forEach(w => {
        if (!isNaN(w)) {
          amounts.push(w)
        }
      })
    } else {
      return
    }

    return {
      sum: amounts[0],
    }
  }

  return (
    <Portal>
      <div className={s.modalBg}>
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <div className={s.headerTitleBlock}>
              <span className={s.headerText}>
                {t('Service editing', { ns: 'domains' })}
              </span>
              <span className={s.vhostName}>({name})</span>
            </div>
            <Cross onClick={closeChangeTariffModalHandler} className={s.crossIcon} />
          </div>
          <div>
            <div className={changeTariffInfoData && s.radioBlock}>
              <div className={s.new_plan}>{t('New tariff plan')}:</div>
              {changeTariffData?.pricelist_list?.map(price => {
                return (
                  <RadioButton
                    setFieldValue={setTariffHandler}
                    selected={tariff}
                    value={price?.$key}
                    label={price?.$}
                    key={price?.$key}
                  />
                )
              })}
            </div>
            {changeTariffInfoData && (
              <div>
                <div className={s.money_info}>
                  {changeTariffInfoData?.money_info?.includes('You will be charged with')
                    ? t(
                        'You will be charged with {{sum}} when upgrading to a new tariff plan',
                        { sum: parsePrice(changeTariffInfoData?.money_info)?.sum },
                      )
                    : t('{{sum}} EUR will be refunded upon plan update', {
                        sum: parsePrice(changeTariffInfoData?.money_info)?.sum,
                      })}
                </div>
                <div className={s.pricInfoBlock}>
                  <span>{t('Current tariff')}:</span>
                  <span>{changeTariffInfoData?.oldpricelist}</span>
                </div>
                <div className={s.pricInfoBlock}>
                  <span>{t('New tariff')}:</span>
                  <span>{changeTariffInfoData?.newpricelist}</span>
                </div>
                <div className={s.pricInfoBlock}>
                  <span>{t('Current value')}:</span>
                  <span>{changeTariffInfoData?.oldprice}</span>
                </div>
                <div className={s.pricInfoBlock}>
                  <span>{t('New value')}:</span>
                  <span>{changeTariffInfoData?.newprice}</span>
                </div>
              </div>
            )}
            <div className={s.btnBlock}>
              <Button
                className={s.searchBtn}
                isShadow
                size="medium"
                label={t('Save', { ns: 'other' })}
                type="button"
                disabled={!changeTariffInfoData}
                onClick={() => changeTariffSaveVhostHandler(tariff)}
              />
              <button
                onClick={closeChangeTariffModalHandler}
                type="button"
                className={s.clearFilters}
              >
                {t('Cancel', { ns: 'other' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
