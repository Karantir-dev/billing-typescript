import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.337 8.682h-6.42L11.77 9.83a1.878 1.878 0 0 1-.219.18h7.122v4.42l-.688-2.425a.663.663 0 0 0-.638-.482H3.317v-3.69h3.798L6.036 6.755a1.861 1.861 0 0 1-.206-.248H2.653a.663.663 0 0 0-.663.664v4.352H.663a.663.663 0 0 0-.638.845l1.913 6.665c.14.487.584.823 1.09.823h15.837c.627 0 1.135-.509 1.135-1.136V9.346a.663.663 0 0 0-.663-.664Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
      <path
        d="M10.051 8.893a.55.55 0 0 0 .779 0l3.08-3.08a.55.55 0 0 0-.389-.94h-1.346V.879a.733.733 0 0 0-.734-.733H9.44a.733.733 0 0 0-.733.733v3.994H7.36a.55.55 0 0 0-.388.94l3.08 3.08Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
    </svg>
  )
}
