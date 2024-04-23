import { Button, Modal, WarningMessage, TariffCard } from '@components'
import { Form, Formik } from 'formik'
import { Trans, useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  billingActions,
  cloudVpsOperations,
  cloudVpsSelectors,
  userSelectors,
} from '@redux'
import { getInstanceMainInfo } from '@utils'

export const ResizeModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const [tariffs, setTariffs] = useState()
  const [notEnoughMoney, setNotEnoughMoney] = useState(false)
  const [fundsErrorData, setFundsErrorData] = useState(null)

  const instancesTariffs = useSelector(cloudVpsSelectors.getInstancesTariffs)
  const { displayName } = getInstanceMainInfo(item)

  const warningEl = useRef()

  const { credit, realbalance } = useSelector(userSelectors.getUserInfo)

  const totalBalance = credit ? +realbalance + +credit : +realbalance

  const datacenter = item.datacenter.$

  useEffect(() => {
    if (!instancesTariffs[datacenter]) {
      dispatch(
        cloudVpsOperations.getAllTariffsInfo({
          datacenter,
        }),
      )
    }

    dispatch(cloudVpsOperations.getTariffsListToChange(item.id.$, setTariffs, closeModal))
  }, [])

  const onFormSubmit = values => {
    const errorCallback = errorData => {
      let requiredAmount
      let deficit

      errorData.param.forEach(el => {
        if (el.$name === 'amount') {
          requiredAmount = el.$
        } else if (el.$name === 'deficit') {
          deficit = el.$
        }
      })

      setFundsErrorData({ requiredAmount, deficit })
    }

    onSubmit(values, errorCallback)
  }

  return (
    <Modal
      isOpen={!!item && !!tariffs && !!instancesTariffs[datacenter]}
      closeModal={closeModal}
      className={s.resize_modal}
    >
      <Modal.Header>
        <p> {t('choose_flavor')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik initialValues={{ pricelist: '' }} onSubmit={onFormSubmit}>
          {({ values, setFieldValue }) => {
            const tariffsList = instancesTariffs[datacenter]?.filter(el =>
              tariffs.find(tariff => tariff.$key === el.id.$),
            )

            const checkIfEnoughMoney = currentTariffId => {
              const currentPrice = +tariffsList.find(
                el => el.pricelist.$ === currentTariffId,
              )?.prices?.price?.cost?.$
              console.log('currentPrice', currentPrice)
              console.log('totalBalance', totalBalance)

              if (currentPrice > totalBalance) {
                !notEnoughMoney && setNotEnoughMoney(true)
              } else {
                notEnoughMoney && setNotEnoughMoney(false)
              }
            }

            return (
              <Form id={'resize'}>
                <div className={s.body}>
                  <WarningMessage>{t('resize_warning')}</WarningMessage>
                  <p className={s.body__text_small}>{t('resize_notes')}</p>

                  {notEnoughMoney && (
                    <WarningMessage className={s.warning} ref={warningEl}>
                      {t('not_enough_money', { ns: 'cloud_vps' })}{' '}
                      <button
                        className={s.link}
                        type="button"
                        onClick={() =>
                          dispatch(billingActions.setIsModalCreatePaymentOpened(true))
                        }
                      >
                        {t('top_up', { ns: 'cloud_vps' })}
                      </button>
                    </WarningMessage>
                  )}

                  {fundsErrorData && (
                    <WarningMessage className={s.warning}>
                      <Trans
                        t={t}
                        i18nKey="insufficient_funds"
                        components={{
                          button: (
                            <button
                              className={s.link}
                              type="button"
                              onClick={() =>
                                dispatch(
                                  billingActions.setIsModalCreatePaymentOpened(true),
                                )
                              }
                            />
                          ),
                        }}
                        values={{ price: fundsErrorData.requiredAmount }}
                      />
                    </WarningMessage>
                  )}

                  <p>{t('prices_excluding_tax')}</p>

                  <ul className={s.tariffs_list}>
                    {tariffsList.map(item => {
                      return (
                        <TariffCard
                          key={item.id.$}
                          tariff={item}
                          onClick={() => {
                            setFieldValue('pricelist', item.id.$)
                            setFundsErrorData(null)
                            checkIfEnoughMoney(item.id.$)
                          }}
                          active={values.pricelist === item.id.$}
                          price={item.prices.price.cost.$}
                        />
                      )
                    })}
                  </ul>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm')}
          size="small"
          type="submit"
          form={'resize'}
          isShadow
          onClick={e => {
            if (notEnoughMoney) {
              e.preventDefault()

              warningEl.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          }}
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
