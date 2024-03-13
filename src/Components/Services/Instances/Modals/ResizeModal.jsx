/* eslint-disable no-unused-vars */
import { Button, Icon, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'
import { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsSelectors } from '@redux'

export const ResizeModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const dispatch = useDispatch()
  const [tariffs, setTariffs] = useState()
  const instancesTariffs = useSelector(cloudVpsSelectors.getInstancesTariffs)

  useEffect(() => {
    dispatch(cloudVpsOperations.getTariffsListToChange(item.id.$, setTariffs, closeModal))
  }, [])

  return (
    <Modal isOpen={!!item && !!tariffs} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p> {t('choose_flavor')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {item.id.$}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ pricelist: '' }}
          onSubmit={values =>
            dispatch(
              cloudVpsOperations.changeTariff({
                elid: item.id.$,
                pricelist: values.pricelist,
                successCallback: closeModal,
              }),
            )
          }
        >
          {({ values, setFieldValue }) => {
            return (
              <Form id={'resize'}>
                <div className={s.body}>
                  <WarningMessage>{t('resize_warning')}</WarningMessage>
                  <p className={s.body__text_small}>{t('resize_notes')}</p>

                  <div className={s.tariff_list}>
                    {instancesTariffs[item.datacenter.$]
                      ?.filter(el => tariffs.find(tariff => tariff.$key === el.id.$))
                      .map(item => {
                        return (
                          <button
                            type="button"
                            key={item.id.$}
                            onClick={() => setFieldValue('pricelist', item.id.$)}
                            className={cn(s.tariff, {
                              [s.tariff_active]: values.pricelist === item.id.$,
                            })}
                          >
                            <p className={s.tariff__name}>{item.title.main.$}</p>
                            <div className={s.tariff__params}>
                              {item.detail.map(el => {
                                return (
                                  <Fragment key={el.name.$}>
                                    <p className={s.tariff__param_name}>{t(el.name.$)}</p>
                                    <p className={s.tariff__param_value}>
                                      {t(el.value.$)}
                                    </p>
                                  </Fragment>
                                )
                              })}
                            </div>
                            <p className={s.tariff__price}>{item.prices.price.cost.$}€</p>
                          </button>
                        )
                      })}
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button label={t('Resize')} size="small" type="submit" form={'resize'} isShadow />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
