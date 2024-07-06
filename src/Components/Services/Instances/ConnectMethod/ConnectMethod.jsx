import { Button, CheckBox, Icon, InputField, Select, WarningMessage } from '@components'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { cloudVpsActions } from '@src/Redux'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group'
import animations from './animations.module.scss'
import s from './ConnectMethod.module.scss'

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
  hiddenMode,
  isOpened,
  setIsOpened,
}) {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()

  const isSSH = connectionType === 'ssh'
  const isPassword = connectionType === 'password'

  return (
    <>
      {hiddenMode && (
        <button
          className={s.dropdown_btn}
          type="button"
          onClick={() => setIsOpened(prev => !prev)}
        >
          {t('change_access_method')}{' '}
          <Icon className={cn(s.shevron, { [s.active]: isOpened })} name="Shevron" />
        </button>
      )}
      <CSSTransition in={isOpened} classNames={animations} timeout={150} unmountOnExit>
        <div>
          <div className={s.list} name={name}>
            {!isWindows && (
              <label className={cn(s.item, { [s.selected]: isSSH })} htmlFor="typeSSH">
                <div className={s.item__description}>
                  <CheckBox
                    className={s.checkbox}
                    onClick={isSSH ? null : () => onChangeType('ssh')}
                    type="radio"
                    value={isSSH}
                    id={'typeSSH'}
                  />
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
              </label>
            )}
            <label
              className={cn(s.item, { [s.selected]: isPassword })}
              htmlFor="typePassword"
            >
              <div className={s.item__description}>
                <CheckBox
                  className={s.checkbox}
                  onClick={isPassword ? null : () => onChangeType('password')}
                  type="radio"
                  value={isPassword}
                  id="typePassword"
                />
                <div className={s.item__text_wrapper}>
                  <p className={s.item__name}>{t('password', { ns: 'vds' })}</p>
                  <p className={s.item__text}>
                    {t('pass_method_password', {
                      user: isWindows ? 'Administrator' : 'root',
                    })}
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
            </label>
          </div>
          {hiddenMode && (
            <WarningMessage className={s.warning}>
              {t('new_access_method_warning')}
            </WarningMessage>
          )}
        </div>
      </CSSTransition>
    </>
  )
}

ConnectMethod.propTypes = {
  connectionType: PropTypes.string,
  sshKey: PropTypes.string,
  onChangeType: PropTypes.func,
  setSSHkey: PropTypes.func,
  setPassword: PropTypes.func,
  sshList: PropTypes.array,
  errors: PropTypes.object,
  touched: PropTypes.object,
  isWindows: PropTypes.bool,
  name: PropTypes.string,
  hiddenMode: PropTypes.bool,
  isOpened: PropTypes.bool,
  setIsOpened: PropTypes.func,
}
