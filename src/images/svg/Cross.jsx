import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill={darkTheme ? '#fff' : '#392955'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15.677.328a1.083 1.083 0 0 0-1.552 0l-6.122 6.12L1.88.328a1.083 1.083 0 0 0-1.552 0 1.082 1.082 0 0 0 0 1.552L6.45 8 .328 14.12a1.082 1.082 0 0 0 0 1.552c.219.219.503.328.765.328.263 0 .569-.11.766-.328l6.122-6.12 6.122 6.12c.219.219.503.328.765.328.263 0 .569-.11.766-.328a1.082 1.082 0 0 0 0-1.552L9.51 8l6.123-6.12c.48-.437.48-1.137.043-1.552Z" />
    </svg>
  )
}
