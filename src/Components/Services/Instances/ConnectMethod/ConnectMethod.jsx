import { Button, CheckBox, Icon, InputField, Select } from '@components'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './ConnectMethod.module.scss'
import { cloudVpsActions } from '@src/Redux'
import { useDispatch } from 'react-redux'
import cn from 'classnames'

export default function ConnectMethod({
  connectionType,
  onChangeType,
  setSSHkey,
  setPassword,
  sshList,
  sshKey,
  errors,
  touched,
  isWindows,
  name,
}) {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()

  const isSSH = connectionType === 'ssh'
  const isPassword = connectionType === 'password'

  const onEnter = (e, callback) => {
    if (e.key === 'Enter') {
      callback()
    }
  }

  return (
    <div className={s.list} name={name}>
      {!isWindows && (
        <div
          className={cn(s.item, { [s.selected]: isSSH })}
          onClick={isSSH ? null : () => onChangeType('ssh')}
          onKeyUp={isSSH ? null : e => onEnter(e, () => onChangeType('ssh'))}
          tabIndex={0}
          role="checkbox"
          aria-checked={isSSH ? true : false}
        >
          <div className={s.item__description}>
            <CheckBox className={s.checkbox} tabIndex={-1} type="radio" value={isSSH} />
            <div className={s.item__text_wrapper}>
              <p className={s.item__name}>{t('ssh_key')}</p>
              <p className={s.item__text}>{t('pass_method_ssh')}</p>
            </div>
            <Icon name="Ssh_keys" />
          </div>
          {isSSH && (
            <div className={s.item__field}>
              <Select
                name="ssh_keys"
                isShadow
                itemsList={sshList}
                placeholder={t('ssh_key')}
                getElement={setSSHkey}
                value={sshKey}
                error={errors.ssh_keys}
              />
              <Button
                label={t('create')}
                isShadow
                size="small"
                onClick={() => {
                  dispatch(cloudVpsActions.setItemForModals({ ssh_rename: true }))
                }}
              />
            </div>
          )}
        </div>
      )}
      <div
        className={cn(s.item, { [s.selected]: isPassword })}
        onClick={isPassword ? null : () => onChangeType('password')}
        onKeyUp={isPassword ? null : e => onEnter(e, () => onChangeType('password'))}
        tabIndex={0}
        role="checkbox"
        aria-checked={isPassword ? true : false}
      >
        <div className={s.item__description}>
          <CheckBox
            className={s.checkbox}
            tabIndex={-1}
            type="radio"
            value={isPassword}
          />
          <div className={s.item__text_wrapper}>
            <p className={s.item__name}>{t('password', { ns: 'vds' })}</p>
            <p className={s.item__text}>
              {t('pass_method_password', { user: isWindows ? 'Administrator' : 'root' })}
            </p>
          </div>
          <Icon name="Lock" />
        </div>
        {isPassword && (
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
              onChange={e => setPassword(e.target.value)}
              generatePasswordValue={value => setPassword(value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

ConnectMethod.propTypes = {
  connectionType: PropTypes.string,
  sshKey: PropTypes.string,
  onChangeType: PropTypes.func,
  setSSHkey: PropTypes.func,
  setPassword: PropTypes.func,
  sshList: PropTypes.array,
}
