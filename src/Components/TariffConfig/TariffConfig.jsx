import { useTranslation } from 'react-i18next'
import s from './TariffConfig.module.scss'
import { Form, Formik } from 'formik'
import { Icon, Select, SoftwareOSBtn, SoftwareOSSelect, InputField } from '@components'
import * as Yup from 'yup'
import { DOMAIN_REGEX, translatePeriodName, translatePeriodText } from '@utils'

export default function TariffConfig({
  parameters,
  setParameters,
  service,
  changeFieldHandler,
  onSubmit,
}) {
  const { t } = useTranslation(['vds', 'dedicated_servers'])

  const renderSoftwareOSFields = (fieldName, state, ostempl) => {
    const changeOSHandler = value =>
      fieldName === 'ostempl'
        ? setParameters(params => ({
            ...params,
            [fieldName]: { $: value },
            recipe: { $: 'null' },
          }))
        : setParameters(params => ({
            ...params,
            [fieldName]: { $: value },
          }))

    let dataArr = parameters?.slist.find(el => el.$name === fieldName)?.val
    const elemsData = {}
    if (fieldName === 'recipe') {
      dataArr = dataArr.filter(el => el.$depend === ostempl && el.$key !== 'null')
      elemsData.null = [{ $key: 'null', $: t('without_software') }]
    }

    dataArr.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData).map(([name, el]) => {
      if (el.length > 1) {
        const optionsList = el.map(({ $key, $ }) => ({
          value: $key,
          label: $,
        }))

        return (
          <SoftwareOSSelect
            key={optionsList[0].value}
            iconName={name.toLowerCase()}
            itemsList={optionsList}
            state={state}
            getElement={changeOSHandler}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            value={el[0].$key}
            state={state}
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={changeOSHandler}
          />
        )
      }
    })
  }

  const getPortSpeed = () => {
    const temp = parameters?.slist?.find(el => el.$name === 'Port_speed')?.val
    const value = Array.isArray(temp) ? temp?.[0].$ : temp?.$
    return value ? value : ''
  }

  const getOptionsListExtended = fieldName => {
    if (parameters && parameters.slist) {
      const optionsList = parameters.slist.find(elem => elem.$name === fieldName)?.val
      let firstItem = 0

      return optionsList
        ?.filter(el => el?.$)
        ?.map(({ $key, $, $period }, index) => {
          let label = ''
          let withSale = false
          let words = []

          if (fieldName === 'Memory') {
            words = $?.match(/[\d|.|\\+]+/g)

            if (words?.length > 0 && index === 0) {
              firstItem = words[0]
            }

            if (words?.length > 0 && Number(words[0]) === firstItem * 2) {
              withSale = true
            }
          }

          if (withSale && words?.length > 0) {
            label = (
              <span className={s.selectWithSale}>
                <div className={s.sale55Icon}>-55%</div>
                <span className={s.saleSpan}>
                  {`${words[0]} Gb (`}
                  <span className={s.memorySale}>
                    {Number(words[1] / 0.45).toFixed(2)}
                  </span>
                  {` ${Number(words[1]).toFixed(2)} EUR/${translatePeriodName(
                    $period,
                    t,
                  )})`}
                </span>
              </span>
            )
          } else if (fieldName === 'Memory') {
            label = `${words[0]} Gb (${words[1]} EUR/${translatePeriodName($period, t)})`
          } else if ($.includes('EUR ')) {
            label = translatePeriodText($.trim(), t)
          } else {
            label = t($.trim())
          }

          return {
            value: $key,
            label: label,
            sale: withSale,
            newPrice: Number(words[1]).toFixed(2),
            oldPrice: (Number(words[1]) + words[1] * 0.55).toFixed(2),
          }
        })
    }
    return []
  }

  const getControlPanelList = fieldName => {
    const optionsList = parameters.slist.find(elem => elem.$name === fieldName)?.val

    return optionsList?.map(({ $key, $ }) => {
      let label = translatePeriodText($.trim(), t)

      label = t(label?.split(' (')[0]) + ' (' + label?.split(' (')[1]
      return { value: $key, label: label }
    })
  }

  const validationSchema = Yup.object().shape({
    domain: Yup.string().matches(DOMAIN_REGEX, t('warning_domain', { ns: 'vds' })),
  })

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        ostempl: parameters?.ostempl?.$,
        autoprolong: parameters?.autoprolong?.$,
        domain: parameters?.domain?.$ || '',
        CPU_count: parameters?.CPU_count,
        Memory: parameters?.Memory,
        Disk_space: parameters?.Disk_space,
        Port_speed: getPortSpeed(),
        Control_panel: parameters?.Control_panel,
        IP_addresses_count: parameters?.IP_addresses_count,
        agreement: 'on',
        recipe: parameters?.recipe?.$,
        server_name: parameters?.server_name?.$ || '',
      }}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched }) => {
        return (
          <Form id="tariff-config">
            {(service === 'vds' || service === 'dedic') && (
              <>
                <p className={s.section_title}>{t('os', { ns: 'dedicated_servers' })}</p>
                <div className={s.software_OS_List}>
                  {renderSoftwareOSFields('ostempl', values.ostempl)}
                </div>
                <p className={s.section_title}>
                  {t('recipe', { ns: 'dedicated_servers' })}
                </p>
                <div className={s.software_OS_List}>
                  {renderSoftwareOSFields('recipe', values.recipe, values.ostempl)}
                </div>
              </>
            )}

            <p className={s.section_title}>{t('characteristics')}</p>
            <div className={s.parameters_list}>
              {'Memory' in parameters && (
                <Select
                  itemsList={getOptionsListExtended('Memory')}
                  value={values.Memory}
                  saleIcon={
                    <Icon
                      name="SaleFiftyFive"
                      style={{ marginLeft: 7, position: 'absolute', top: -10 }}
                    />
                  }
                  label={`${t('memory')}:`}
                  getElement={value => {
                    changeFieldHandler('Memory', value, true)
                  }}
                  isShadow
                />
              )}
              {'Control_panel' in parameters && (
                <Select
                  value={values.Control_panel}
                  itemsList={getControlPanelList('Control_panel')}
                  getElement={value => {
                    changeFieldHandler('Control_panel', value, true)
                  }}
                  label={`${t('license_to_panel')}:`}
                  isShadow
                />
              )}
              {'Disk_space' in parameters && (
                <Select
                  value={values.Disk_space}
                  itemsList={getOptionsListExtended('Disk_space')}
                  getElement={value => {
                    changeFieldHandler('Disk_space', value, true)
                  }}
                  label={`${t('disk_space')}:`}
                  isShadow
                />
              )}

              {'CPU_count' in parameters && (
                <Select
                  value={values.CPU_count}
                  itemsList={getOptionsListExtended('CPU_count')}
                  getElement={value => {
                    changeFieldHandler('CPU_count', value, true)
                  }}
                  label={`${t('processors')}:`}
                  isShadow
                />
              )}
              {'Port_speed' in parameters && (
                <InputField
                  name="Port_speed"
                  label={`${t('port_speed')}:`}
                  isShadow
                  disabled
                />
              )}
              {values.autoprolong && (
                <Select
                  value={values.autoprolong}
                  itemsList={getOptionsListExtended('autoprolong')}
                  getElement={value => {
                    changeFieldHandler('autoprolong', { $: value })
                  }}
                  label={`${t('autoprolong')}:`}
                  isShadow
                />
              )}
              {(service === 'vds' || service === 'dedic') && (
                <InputField
                  name="domain"
                  label={`${t('domain_name', { ns: 'dedicated_servers' })}:`}
                  placeholder={t('domain_placeholder', { ns: 'dedicated_servers' })}
                  error={!!errors.domain}
                  touched={!!touched.domain}
                  isShadow
                  value={values.domain}
                  onChange={e => changeFieldHandler('domain', { $: e.target.value })}
                />
              )}
              {'server_name' in parameters && (
                <InputField
                  label={`${t('server_name')}:`}
                  placeholder={`${t('server_placeholder')}`}
                  name="server_name"
                  isShadow
                  error={!!errors.server_name}
                  touched={!!touched.server_name}
                  className={s.input_field_wrapper}
                  inputClassName={s.text_area}
                  autoComplete="off"
                  type="text"
                  value={values.server_name}
                  onChange={e => changeFieldHandler('server_name', { $: e.target.value })}
                />
              )}
              {'IP_addresses_count' in parameters &&
                (parameters?.ipList?.length === 1 ? (
                  <InputField
                    name="IP_addresses_count"
                    label={`${t('count_ip', { ns: 'dedicated_servers' })}:`}
                    isShadow
                    disabled
                  />
                ) : (
                  <Select
                    height={50}
                    value={values?.IP_addresses_count}
                    getElement={item =>
                      changeFieldHandler('IP_addresses_count', item, true)
                    }
                    isShadow
                    label={`${t('count_ip', { ns: 'dedicated_servers' })}:`}
                    itemsList={parameters?.ipList?.map(el => {
                      return {
                        label: `${el?.value}
                ${t('pcs.', {
                  ns: 'vds',
                })}
                (${el?.cost} EUR)`,
                        value: el?.value?.toString(),
                      }
                    })}
                    className={s.select}
                  />
                ))}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
