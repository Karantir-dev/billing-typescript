import React from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import s from './BreadCrumbs.module.scss'

export default function Component({ pathnames }) {
  const { t } = useTranslation('crumbs')
  pathnames = pathnames.filter(p => p.length !== 0)

  return (
    <div className={s.crumbs}>
      {pathnames?.map((e, index) => {
        const disabled = pathnames?.length === index + 1

        const renderPath = () => {
          let pathes = pathnames.slice()
          if (index === 0) {
            return `/${e}`
          } else if (disabled) {
            return '#'
          }
          pathes?.pop()
          return `/${pathes?.join('/')}`
        }
        return (
          <div className={s.linksBlock} key={e}>
            <Link className={cn(s.links, { [s.disabled]: disabled })} to={renderPath()}>
              {t(e)}
            </Link>
            {pathnames?.length !== index + 1 && '>'}
          </div>
        )
      })}
    </div>
  )
}

Component.propTypes = {
  pathnames: PropTypes.arrayOf(PropTypes.string),
}
