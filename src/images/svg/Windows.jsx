import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill={darkTheme ? '#fff' : '#2E273B'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 3.5H11.5329V12.0292H3V3.5ZM12.4671 3.5H21V12.0292H12.4671V3.5ZM3 12.9671H11.5329V21.5H3V12.9671ZM12.4671 12.9671H21V21.5H12.4671"
      />
    </svg>
  )
}
