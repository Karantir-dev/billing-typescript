/* eslint-disable no-unused-vars */
import { Button, Icon, InputField, Modal, WarningMessage, TariffCard } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'
import { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { getInstanceMainInfo } from '@utils'

export const ResizeModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const dispatch = useDispatch()
  const [tariffs, setTariffs] = useState()
  const instancesTariffs = useSelector(cloudVpsSelectors.getInstancesTariffs)
  const { displayName } = getInstanceMainInfo(item)

  useEffect(() => {
    dispatch(cloudVpsOperations.getTariffsListToChange(item.id.$, setTariffs, closeModal))
  }, [])

  return (
    <Modal
      isOpen={!!item && !!tariffs}
      closeModal={closeModal}
      className={s.resize_modal}
      isClickOutside
    >
      <Modal.Header>
        <p> {t('choose_flavor')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik initialValues={{ pricelist: '' }} onSubmit={onSubmit}>
          {({ values, setFieldValue }) => {
            return (
              <Form id={'resize'}>
                <div className={s.body}>
                  <WarningMessage>{t('resize_warning')}</WarningMessage>
                  <p className={s.body__text_small}>{t('resize_notes')}</p>

                  <ul className={s.tariffs_list}>
                    {instancesTariffs[item.datacenter.$]
                      ?.filter(el => tariffs.find(tariff => tariff.$key === el.id.$))
                      .map(item => {
                        return (
                          <TariffCard
                            key={item.id.$}
                            tariff={item}
                            onClick={() => setFieldValue('pricelist', item.id.$)}
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
        <Button label={t('Resize')} size="small" type="submit" form={'resize'} isShadow />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
