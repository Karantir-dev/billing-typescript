import {
  Button,
  Modal,
  WarningMessage,
  TariffCard,
  ScrollToFieldError,
  TooltipWrapper,
  Icon,
} from '@components'
import { ErrorMessage, Form, Formik } from 'formik'
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
import { getInstanceMainInfo, roundToDecimal } from '@utils'
import * as Yup from 'yup'

export const ResizeModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const [tariffsForResize, setTariffsForResize] = useState()
  const [notEnoughMoney, setNotEnoughMoney] = useState(false)
  const [fundsErrorData, setFundsErrorData] = useState(null)

  const [price, setPrice] = useState(0)

  const premiumTariffs = useSelector(cloudVpsSelectors.getPremiumTariffs)
  const basicTariffs = useSelector(cloudVpsSelectors.getBasicTariffs)

  let allTariffs
  if (premiumTariffs && basicTariffs) {
    let commonObj = { ...premiumTariffs }
    for (const basicKey in basicTariffs) {
      if (commonObj?.[basicKey]) {
        commonObj[basicKey] = commonObj[basicKey].concat(basicTariffs[basicKey])
      } else {
        commonObj[basicKey] = basicTariffs[basicKey]
      }
    }

    allTariffs = commonObj
  }

  const { displayName } = getInstanceMainInfo(item)

  const warningEl = useRef()
  const errorEl = useRef()

  const { credit, realbalance } = useSelector(userSelectors.getUserInfo)

  const totalBalance = credit ? +realbalance + +credit : +realbalance

  const datacenter = item.datacenter.$
  const currentTariffPrice = item.item_cost.$

  useEffect(() => {
    if (!allTariffs?.[datacenter]) {
      dispatch(
        cloudVpsOperations.getAllTariffsInfo({
          datacenter,
        }),
      )
    }

    dispatch(
      cloudVpsOperations.getTariffsListToChange(
        item.id.$,
        setTariffsForResize,
        closeModal,
      ),
    )
  }, [])

  const onFormSubmit = values => {
    const errorCallback = errorData => {
      let requiredAmount

      errorData.param.forEach(el => {
        if (el.$name === 'amount') {
          requiredAmount = el.$
        }
      })

      setFundsErrorData({ requiredAmount })
      errorEl.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    onSubmit(values, errorCallback)
  }

  const validateSchema = Yup.object().shape({
    pricelist: Yup.string().required(t('choose_tariff')),
  })

  return (
    <Modal
      isOpen={!!item && !!tariffsForResize && !!allTariffs?.[datacenter]}
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
        <Formik
          initialValues={{ pricelist: '' }}
          onSubmit={onFormSubmit}
          validationSchema={validateSchema}
        >
          {({ values, setFieldValue }) => {
            const filledTariffsList = allTariffs?.[datacenter]?.filter(el =>
              tariffsForResize.some(tariff => tariff.$key === el.id.$),
            )

            const checkIfEnoughMoney = price => {
              setNotEnoughMoney(price && +price > totalBalance)
            }

            return (
              /** Attribute "name" here is just for scrolling errorMessage into view */
              <Form id={'resize'} name="pricelist">
                <ScrollToFieldError
                  scrollBehavior={{ behavior: 'smooth', block: 'end' }}
                />
                <div className={s.body}>
                  <WarningMessage className={s.without_margin}>
                    {t('resize_warning')}
                  </WarningMessage>
                  <p className={s.body__text_small}>{t('resize_notes')}</p>

                  {notEnoughMoney && (
                    <WarningMessage className={s.without_margin} ref={warningEl}>
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
                    <WarningMessage
                      className={s.without_margin}
                      type="error"
                      ref={errorEl}
                    >
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
                    {filledTariffsList.map(item => {
                      const tariffPrice = item.prices.price.cost.$
                      return (
                        <TariffCard
                          key={item.id.$}
                          tariff={item}
                          onClick={() => {
                            const pricesDifference = roundToDecimal(
                              +tariffPrice - +currentTariffPrice,
                            )
                            setFieldValue('pricelist', item.id.$)
                            setPrice(pricesDifference)
                            setFundsErrorData(null)
                            checkIfEnoughMoney(pricesDifference)
                          }}
                          active={values.pricelist === item.id.$}
                          price={tariffPrice}
                        />
                      )
                    })}
                  </ul>
                  <ErrorMessage
                    className={s.error_message}
                    name="pricelist"
                    component="span"
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer className={s.footer}>
        <div className={s.price_block}>
          <div className={s.label_wrapper}>
            <span className={s.amount_label}>{t('upgrade_cost')}</span>
            <TooltipWrapper
              className={s.hint_wrapper}
              content={t('resize_explanation')}
              hintDelay={100}
            >
              <Icon name="Info" />
            </TooltipWrapper>
          </div>
          <p className={s.price}>€{price}</p>
        </div>

        <div className={s.btns_wrapper}>
          <Button
            className={s.btn_confirm}
            label={t('Confirm')}
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
        </div>
      </Modal.Footer>
    </Modal>
  )
}
