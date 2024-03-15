/* eslint-disable no-unused-vars */
import { CheckBox, Icon, InputField, Select } from '@components'
import s from './PasswordMethod.module.scss'
import { useTranslation } from 'react-i18next'

export default function PasswordMethod({
  state,
  setState,
  sshList,
  values,
  errors,
  touched,
}) {
  const { t } = useTranslation(['cloud_vps'])
  return (
    <div className={s.list}>
      <div className={s.item}>
        <div className={s.item__description}>
          <CheckBox
            type="radio"
            onClick={() => setState({ passwordType: 'ssh' })}
            value={state.passwordType === 'ssh'}
          />
          <div className={s.item__text_wrapper}>
            <p className={s.item__name}>{t('ssh_key')}</p>
            <p className={s.item__text}>{t('pass_method_ssh')}</p>
          </div>
          <Icon name="Ssh_keys" />
        </div>
        {state.passwordType === 'ssh' && (
          <div className={s.item__field}>
            <Select
              isShadow
              itemsList={sshList}
              placeholder={t('ssh_key')}
              getElement={item => {
                setState({ ssh_keys: item })
              }}
              value={values.ssh_keys}
              error={errors.ssh_keys}
            />
          </div>
        )}
      </div>
      <div className={s.item}>
        <div className={s.item__description}>
          <CheckBox
            type="radio"
            onClick={() => setState({ passwordType: 'password' })}
            value={state.passwordType === 'password'}
          />
          <div className={s.item__text_wrapper}>
            <p className={s.item__name}>{t('password', { ns: 'vds' })}</p>
            <p className={s.item__text}>{t('pass_method_password')}</p>
          </div>
          <Icon name="Lock" />
        </div>
        {state.passwordType === 'password' && (
          <div className={s.item__field}>
            <InputField
              name="password"
              isShadow
              type="password"
              placeholder={t('new_password_placeholder', { ns: 'vds' })}
              error={!!errors.password}
              touched={!!touched.password}
              isRequired
              autoComplete="off"
              onChange={e => setState({ password: e.target.value })}
              generatePasswordValue={value => setState({ password: value })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
