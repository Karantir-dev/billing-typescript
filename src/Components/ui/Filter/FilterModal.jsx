import { forwardRef } from 'react'
import { Formik, Form } from 'formik'
import { InputField, Button, Icon, Portal, CheckBox } from '@components'
import s from './Filter.module.scss'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

export default forwardRef(function FilterModal(
  {
    isFiltersOpened,
    filterState,
    closeFilterModal,
    setFiltersHandler,
    clearFilterValues,
    fields,
    isFiltered,
  },
  ref,
) {
  const { t } = useTranslation(['filter'])

  return (
    <div ref={ref} className={cn(s.filters_modal, { [s.opened]: isFiltersOpened })}>
      <Formik
        initialValues={filterState}
        onSubmit={values => {
          closeFilterModal()
          setFiltersHandler(values)
        }}
      >
        {({ setFieldValue, values, errors, touched, dirty }) => {
          return (
            <Form>
              <div className={s.formHeader}>
                <h2>{t('filter')}</h2>
                <Icon name="Cross" onClick={closeFilterModal} className={s.crossIcon} />
              </div>
              <div className={cn(s.form)}>
                <div className={s.fieldsBlock}>
                  {fields.map(field => {
                    if (field.type === 'checkbox') {
                      return (
                        <span className={s.checkbox_field} key={field.label}>
                          <CheckBox
                            value={values[field.value] === field.checkboxValues.checked}
                            onClick={() => {
                              setFieldValue(
                                field.value,
                                values[field.value] === field.checkboxValues.checked
                                  ? ''
                                  : field.checkboxValues.checked,
                              )
                            }}
                          />
                          <span>{t(field.label)}</span>
                        </span>
                      )
                    }
                    return (
                      <InputField
                        key={field.label}
                        inputWrapperClass={s.inputHeight}
                        inputClassName={s.input_bgc}
                        name={field.value}
                        label={`${t(field.label)}:`}
                        placeholder={`${t(field.label)}`}
                        isShadow
                        className={s.input}
                        error={!!errors[field.value]}
                        touched={!!touched[field.value]}
                      />
                    )
                  })}
                </div>
              </div>
              <div className={cn(s.btnBlock)}>
                <Button
                  className={s.searchBtn}
                  isShadow
                  size="medium"
                  label={t('search')}
                  type="submit"
                  onClick={e => {
                    if (!dirty) {
                      e.preventDefault()
                      closeFilterModal()
                    }
                  }}
                />
                <button
                  onClick={() => {
                    closeFilterModal()
                    isFiltered && setFiltersHandler(clearFilterValues)
                  }}
                  type="button"
                  className={s.clearFilters}
                >
                  {t('clear_filter')}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
      <Portal>
        <div className={cn(s.filter_backdrop, { [s.opened]: isFiltersOpened })}></div>
      </Portal>
    </div>
  )
})
