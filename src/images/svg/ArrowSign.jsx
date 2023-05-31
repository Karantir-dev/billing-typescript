import Gradient from './Gradient'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width={15}
      height={11}
      viewBox="0 0 15 11"
      fill="none"
      stroke={darkTheme ? '#fff' : '#392955'}
      {...props}
    >
      <path d="m1 1 6.623 8L14 1" strokeWidth={1.5} />
      <Gradient />
    </svg>
  )
}
