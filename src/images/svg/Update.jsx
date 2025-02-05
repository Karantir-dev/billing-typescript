import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg
      height={25}
      width={25}
      viewBox="0 0 32 32"
      fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      {...props}
    >
      <path
        d="M25.883,6.086l-2.82,2.832C24.953,10.809,26,13.324,26,16c0,5.516-4.484,10-10,10v-2l-4,4l4,4v-2
				c7.719,0,14-6.281,14-14C30,12.254,28.539,8.734,25.883,6.086z"
      />
      <path
        d="M20,4l-4-4v2C8.281,2,2,8.281,2,16c0,3.746,1.461,7.266,4.117,9.914l2.82-2.832
				C7.047,21.191,6,18.676,6,16c0-5.516,4.484-10,10-10v2L20,4z"
      />
    </svg>
  )
}
