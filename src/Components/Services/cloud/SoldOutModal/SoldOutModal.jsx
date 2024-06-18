import { Icon, Modal } from '@src/Components'
import { Trans, useTranslation } from 'react-i18next'
import * as route from '@src/routes'
import s from './SoldOutModal.module.scss'

export default function SoldOutModal({ isOpened, closeFn }) {
  const { t } = useTranslation(['cloud_vps'])
  return (
    <Modal isOpen={isOpened} isClickOutside closeModal={closeFn}>
      <Modal.Header>
        <div className={s.header_wrapper}>
          <Icon name="Warning_triangle" /> <span className={s.header}>Warning</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <p className={s.message}>{t('sold_out_messsage', { ns: 'cloud_vps' })}</p>
        <p className={s.description}>
          <Trans
            t={t}
            i18nKey="sold_out_description"
            components={{
              a: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a className={s.link} href={route.USER_SETTINGS_PERSONAL} />
              ),
            }}
          />
        </p>
      </Modal.Body>
    </Modal>
  )
}
