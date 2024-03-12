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
  const { t } = useTranslation()
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
            <p className={s.item__name}>SSH Key</p>
            <p className={s.item__text}>
              Подключитесь к вашему экземпляру с помощью пары ключей SSH
            </p>
          </div>
          <Icon name="Ssh_keys" />
        </div>
        {state.passwordType === 'ssh' && (
          <div className={s.item__field}>
            <Select
              isShadow
              itemsList={sshList}
              placeholder="SSH Keys"
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
            <p className={s.item__name}>Password</p>
            <p className={s.item__text}>
              Подключитесь к вашему экземпляру как пользователь root через пароль
            </p>
          </div>
          <Icon name="Lock" />
        </div>
        {state.passwordType === 'password' && (
          <div className={s.item__field}>
            <InputField
              name="password"
              isShadow
              type="password"
              placeholder={t('new_password_placeholder')}
              error={!!errors.password}
              touched={!!touched.password}
              isRequired
              autoComplete="off"
              onChange={() => setState({ password: event.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
