import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg width={17} height={17} xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={darkTheme ? '#DECBFE' : '#AE9CCD'}>
        <path d="M1.614 6.607h7.829v1.84c0 .427.484.666.823.42l5.442-3.965a.518.518 0 0 0 0-.838L10.266.1a.519.519 0 0 0-.823.419v1.84h-7.83a.518.518 0 0 0-.517.518v3.212c0 .286.232.518.518.518Z" />
        <path d="M15.403 10.394h-7.83v-1.84a.519.519 0 0 0-.823-.419L1.31 12.1a.518.518 0 0 0 0 .838l5.441 3.964c.341.248.824.006.824-.419v-1.84h7.829a.518.518 0 0 0 .518-.518v-3.212a.518.518 0 0 0-.518-.518Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h17v17H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
