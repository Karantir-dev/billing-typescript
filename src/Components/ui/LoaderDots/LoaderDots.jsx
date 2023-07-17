import classNames from 'classnames'
import s from './LoaderDots.module.scss'

export default function Component({ classname }) {
  return (
    <div className={classNames(s.loader, classname)}>
      <div className={`${s.loader_circle} ${s.first}`}></div>
      <div className={`${s.loader_circle} ${s.second}`}></div>
      <div className={s.loader_circle}></div>
    </div>
  )
}
