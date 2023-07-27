import { useState } from 'react'
import { Button, Icon, ModalCreatePayment } from '@components'
import s from './PromotionBanner.module.scss'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import * as route from '@src/routes'

export default function PromotionBanner({ closeBanner, type }) {
  const { t } = useTranslation('billing')
  const navigate = useNavigate()

  const [createPaymentModal, setCreatePaymentModal] = useState(false)

  const btnClickHandler = () => {
    if (type === 'first') {
      setCreatePaymentModal(true)
    } else {
      navigate(route.SHARED_HOSTING_ORDER, { state: { isVhostOrderAllowed: true } })
    }
  }

  const closeBannerHandler = () => {
    if (type === 'second') {
        localStorage.setItem('isBannerClosed', 'true')
    }
    closeBanner()
  }

  return (
    <>
      {type && (
        <div className={cn(s.banner, s[type])}>
          <div className={s.banner__content}>
            <h2 className={s.banner__title}>
              {type === 'first' ? (
                t('promotion_vhost_title_1')
              ) : type === 'second' ? (
                t('promotion_vhost_title_2')
              ) : (
                <>
                  {t('promotion_vhost_title_3')}
                  {type === 'third' && (
                    <>
                      <br />
                      <Link
                        className={s.banner__title_link}
                        to={`${route.SUPPORT}/requests`}
                        state={{ openModal: true }}
                      >
                        {t('Support service')}
                      </Link>
                    </>
                  )}
                </>
              )}
            </h2>
            {(type === 'first' || type === 'third') && (
              <p className={s.banner__description}>
                {type === 'first'
                  ? t('promotion_vhost_description_1')
                  : t('promotion_vhost_description_3')}
              </p>
            )}
            {(type === 'first' || type === 'second') && (
              <div className={s.banner__footer}>
                <Button
                  size="medium"
                  className={s.banner__btn}
                  label={
                    type === 'first'
                      ? t('promotion_vhost_btn_1')
                      : t('promotion_vhost_btn_2')
                  }
                  onClick={btnClickHandler}
                />
              </div>
            )}
          </div>
          <button onClick={closeBannerHandler} className={s.banner__close}>
            <Icon name="Cross" />
          </button>
        </div>
      )}

      {createPaymentModal && (
        <ModalCreatePayment setCreatePaymentModal={setCreatePaymentModal} />
      )}
    </>
  )
}
