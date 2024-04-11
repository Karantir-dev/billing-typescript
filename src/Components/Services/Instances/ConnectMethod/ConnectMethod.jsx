import { Button, CheckBox, Icon, InputField, Select } from '@components'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './ConnectMethod.module.scss'
import { cloudVpsActions } from '@src/Redux'
import { useDispatch } from 'react-redux'

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

  return (
    <div className={s.list} name={name}>
      {!isWindows && (
        <div className={s.item}>
          <div className={s.item__description}>
            <CheckBox
              type="radio"
              onClick={() => onChangeType('ssh')}
              value={connectionType === 'ssh'}
            />
            <div className={s.item__text_wrapper}>
              <p className={s.item__name}>{t('ssh_key')}</p>
              <p className={s.item__text}>{t('pass_method_ssh')}</p>
            </div>
            <Icon name="Ssh_keys" />
          </div>
          {connectionType === 'ssh' && (
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
      <div className={s.item}>
        <div className={s.item__description}>
          <CheckBox
            type="radio"
            onClick={() => onChangeType('password')}
            value={connectionType === 'password'}
          />
          <div className={s.item__text_wrapper}>
            <p className={s.item__name}>{t('password', { ns: 'vds' })}</p>
            <p className={s.item__text}>
              {t('pass_method_password', { user: isWindows ? 'Administrator' : 'root' })}
            </p>
          </div>
          <Icon name="Lock" />
        </div>
        {connectionType === 'password' && (
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