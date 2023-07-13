import { useSelector } from 'react-redux'
import { selectors, userSelectors } from '@redux'
import cn from 'classnames'
import { LoaderDots, Icon } from '@components'

import s from './Loader.module.scss'

export default function Loader({ logo = false, shown }) {
  const isLoading = useSelector(selectors.getIsLoadding)
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const userInfoLoading = useSelector(userSelectors.getUserInfoLoading)

  return (
    <div
      className={cn({
        [s.backdrop]: true,
        [s.main_lt]: (logo || userInfoLoading) && !darkTheme,
        [s.main_dt]: (logo || userInfoLoading) && darkTheme,
        [s.shown]: isLoading || userInfoLoading || shown,
      })}
    >
      {(logo || userInfoLoading) && <Icon name="Logo" svgwidth="115" svgheight="53" />}

      <LoaderDots />
    </div>
  )
}
