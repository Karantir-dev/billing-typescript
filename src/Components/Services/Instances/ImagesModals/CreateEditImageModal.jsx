/* eslint-disable no-unused-vars */
import {
  Button,
  CheckBox,
  Icon,
  InputField,
  Modal,
  Select,
  TooltipWrapper,
} from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { formatCountryName, getFlagFromCountryName } from '@src/utils'
import { URL_REGEX } from '@src/utils/constants'
import { useMediaQuery } from 'react-responsive'

export const CreateEditImageModal = ({ item, closeModal, onSubmit, cost }) => {
  const { t } = useTranslation(['cloud_vps', 'other', 'auth', 'domains', 'countries'])
  const isMobile = useMediaQuery({ query: '(max-width: 1023px)' })
  const dispatch = useDispatch()
  const [data, setData] = useState()
  const isCreate = item === 'create'

  const type = data?.image_type?.$.toLowerCase()

  const isImageType = type === 'image' || isCreate

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('Is a required field', { ns: 'other' })),
    min_disk:
      isImageType &&
      Yup.number()
        .min(0, t('value_too_short', { number: 0 }))
        .max(10000, t('value_too_large', { number: 10000 }))
        .required(t('Is a required field', { ns: 'other' })),
    min_ram:
      isImageType &&
      Yup.number()
        .min(0, t('value_too_short', { number: 0 }))
        .max(1000, t('value_too_large', { number: 1000 }))
        .required(t('Is a required field', { ns: 'other' })),
    url: isCreate
      ? Yup.string()
          .required(t('Is a required field', { ns: 'other' }))
          .matches(URL_REGEX, 'http://domain.com')
      : null,
  })

  useEffect(() => {
    if (isCreate) {
      dispatch(cloudVpsOperations.getImageParams({ setData }))
    } else {
      const elid = item[item.idKey]?.$
      dispatch(
        cloudVpsOperations.editImage({ func: 'image', elid, successCallback: setData }),
      )
    }
  }, [])

  const getItemList = list => {
    return data.slist
      .find(el => el.$name === list)
      .val.map(el => ({ label: el.$, value: el.$key }))
  }

  const onSubmitHandler = values => {
    const params = isCreate
      ? {
          pricelist: data.pricelist.$,
          order_period: data.order_period.$,
        }
      : {
          elid: data.id.$,
        }

    onSubmit({ ...values, ...params, successCallback: closeModal })
  }

  return (
    <Modal isOpen={!!item && !!data} closeModal={closeModal} className={s.image_modal}>
      <Modal.Header>
        <p>{isCreate ? t('image.create') : t(`image.edit.${type}`)}</p>
      </Modal.Header>
      <Modal.Body>
        {!!data && (
          <Formik
            initialValues={{
              name: data?.image_name.$ || '',
              region: data?.region.$ || '',
              min_disk: data?.min_disk.$ || '',
              min_ram: data?.min_ram.$ || '',
              disk_format: data?.disk_format.$ || '',
              os_distro: data?.os_distro.$ || '',
              os_version: data?.os_version.$ || '',
              architecture: data?.architecture.$ || '',
              url: data?.url?.$ || '',
              protected: data?.protected.$ || '',
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            {({ values, errors, touched, setFieldValue }) => {
              const onlyDigitsHandler = (e, field) => {
                const value = e.target.value.replace(/\D/g, '')
                setFieldValue(field, value)
              }

              return (
                <Form id={'create_image'}>
                  <div className={s.image_modal_wrapper}>
                    <div className={s.image_modal_fields}>
                      {isCreate && (
                        <Select
                          inputClassName={s.select_bgc}
                          label={`${t('Region')}:`}
                          placeholder={t('Region')}
                          value={values.region}
                          itemsList={getItemList('region').map(el => {
                            const country = formatCountryName(el.label)

                            return {
                              ...el,
                              label: (
                                <span className={s.row}>
                                  <img
                                    src={require(`@images/countryFlags/${getFlagFromCountryName(
                                      country,
                                    )}.png`)}
                                    width={20}
                                    height={14}
                                    alt={country}
                                  />
                                  {el.label}
                                </span>
                              ),
                            }
                          })}
                          getElement={value => setFieldValue('region', value)}
                          isShadow
                          isRequired
                        />
                      )}

                      <InputField
                        inputClassName={s.input}
                        className={s.image_modal_input}
                        name="name"
                        isShadow
                        label={`${t(`image.name.${type}`)}:`}
                        placeholder={t(`image.name.${type}`)}
                        error={!!errors.name}
                        touched={!!touched.name}
                        isRequired
                        autoComplete="off"
                      />
                      {isImageType && (
                        <>
                          <div className={s.fields_row}>
                            <InputField
                              inputClassName={s.input}
                              className={s.image_modal_input}
                              name="min_disk"
                              isShadow
                              labelTooltip={
                                isMobile ? t('image.description.min_disk') : false
                              }
                              labelTooltipPlace="bottom"
                              label={`${t('image.min_disk')}:`}
                              placeholder={t('image.min_disk')}
                              error={!!errors.min_disk}
                              touched={!!touched.min_disk}
                              isRequired
                              autoComplete="off"
                              onChange={e => onlyDigitsHandler(e, 'min_disk')}
                            />
                            <InputField
                              inputClassName={s.input}
                              className={s.image_modal_input}
                              name="min_ram"
                              isShadow
                              labelTooltip={
                                isMobile ? t('image.description.min_ram') : false
                              }
                              labelTooltipPlace="bottom"
                              label={`${t('image.min_ram')}:`}
                              placeholder={t('image.min_ram')}
                              error={!!errors.min_ram}
                              touched={!!touched.min_ram}
                              isRequired
                              autoComplete="off"
                              onChange={e => onlyDigitsHandler(e, 'min_ram')}
                            />
                          </div>
                          {isCreate && (
                            <Select
                              inputClassName={s.select_bgc}
                              label={`${t('image.disk_format')}:`}
                              placeholder={t('image.disk_format')}
                              value={values.disk_format}
                              itemsList={getItemList('disk_format')}
                              getElement={value => setFieldValue('disk_format', value)}
                              isShadow
                              isRequired
                            />
                          )}
                          <div className={s.fields_row}>
                            <Select
                              inputClassName={s.select_bgc}
                              labelTooltip={isMobile ? t('image.description.os') : false}
                              labelTooltipPlace="bottom"
                              name="os_distro"
                              label={`${t('image.os_distro')}:`}
                              placeholder={t('image.os_distro')}
                              value={values.os_distro}
                              itemsList={getItemList('os_distro')}
                              getElement={value => setFieldValue('os_distro', value)}
                              isShadow
                            />
                            <InputField
                              inputClassName={s.input}
                              className={s.image_modal_input}
                              name="os_version"
                              isShadow
                              label={`${t('image.os_version')}:`}
                              placeholder={t('image.os_version')}
                              error={!!errors.os_version}
                              touched={!!touched.os_version}
                              autoComplete="off"
                            />
                            <Select
                              inputClassName={s.select_bgc}
                              label={`${t('image.architecture')}:`}
                              placeholder={t('image.architecture')}
                              value={values.architecture}
                              itemsList={getItemList('architecture')}
                              getElement={value => setFieldValue('architecture', value)}
                              isShadow
                            />
                          </div>
                          {isCreate && (
                            <InputField
                              inputClassName={s.input}
                              className={s.image_modal_input}
                              name="url"
                              isShadow
                              label={`${t('image.url')}:`}
                              placeholder={t('image.url_placeholder')}
                              error={!!errors.url}
                              touched={!!touched.url}
                              isRequired
                              autoComplete="off"
                            />
                          )}
                        </>
                      )}
                      <div className={s.row}>
                        <CheckBox
                          value={values.protected === 'on'}
                          onClick={() => {
                            setFieldValue(
                              'protected',
                              values.protected === 'on' ? 'off' : 'on',
                            )
                          }}
                        />
                        <span>{t('image.protected')}</span>
                        {isMobile && (
                          <TooltipWrapper
                            content={t(`image.description.protected.${type}`)}
                            wrapperClassName={s.label__tooltip}
                            className={s.hint}
                            place="top"
                          >
                            <Icon name="Info" />
                          </TooltipWrapper>
                        )}
                      </div>
                    </div>
                    <div className={s.image_modal_description}>
                      <h3>{t(`image.name.${type}`)}</h3>
                      <p>{t('image.description.image_name')}</p>
                      {isImageType && (
                        <>
                          <h3>{t('image.min_disk')}</h3>
                          <p>{t('image.description.min_disk')}</p>
                          <h3>{t('image.min_ram')}</h3>
                          <p>{t('image.description.min_ram')}</p>
                          <h3>
                            {t('image.os_distro')}, {t('image.os_version')}{' '}
                            {t('and', { ns: 'domains' })} {t('image.architecture')}
                          </h3>
                          <p>{t('image.description.os')}</p>
                        </>
                      )}

                      <h3>{t('image.protected')}</h3>
                      <p>{t(`image.description.protected.${type}`)}</p>
                    </div>
                  </div>
                </Form>
              )
            }}
          </Formik>
        )}
      </Modal.Body>
      <Modal.Footer className={s.snapshot_create__footer_wrapper}>
        {isCreate && (
          <div className={s.snapshot_create__footer_block}>
            <p className={s.tariff__param_name}>{t('Price')}</p>
            <p>€{cost?.stat_cost?.$} / GB / day</p>
          </div>
        )}

        <div className={s.snapshot_create__buttons_wrapper}>
          <Button
            label={isCreate ? t('create_image') : t(`image.edit.${type}`)}
            size={'large'}
            type="submit"
            form={'create_image'}
            isShadow
          />
          <button type="button" className={s.cancel_btn} onClick={closeModal}>
            {t('Cancel')}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
