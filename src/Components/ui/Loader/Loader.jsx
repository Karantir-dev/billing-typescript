import { useSelector } from 'react-redux'
import { selectors, userSelectors } from '@redux'
import cn from 'classnames'
import { LoaderDots, Icon } from '@components'

import s from './Loader.module.scss'

export default function Loader({ logo = false, shown, local = false, transparent = false, staticPos = false, halfScreen = false, className }) {
  const isLoading = useSelector(selectors.getIsLoading)
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const userInfoLoading = useSelector(userSelectors.getUserInfoLoading)

  return (
    <div
      className={cn({
        [s.backdrop]: true,
        [s.main_lt]: (logo || userInfoLoading) && !darkTheme,
        [s.main_dt]: (logo || userInfoLoading) && darkTheme,
        [s.shown]: isLoading || userInfoLoading || shown,
        [s.local]: local,
        [s.transparent]: transparent,
        [s.static]: staticPos,
        [s.halfScreen]: halfScreen,
      }, className)}
    >
      {(logo || userInfoLoading) && <Icon name="Logo" svgwidth="115" svgheight="53" />}

      <LoaderDots />
    </div>
  )
}
