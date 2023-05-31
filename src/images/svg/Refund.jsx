import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width={15}
      height={16}
      viewBox="0 0 15 16"
      fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      {...props}
    >
      <path d="M9.188 7.646v.645H2.812v-1.11h5.566C7.655 6.686 7.08 6.05 6.716 5.324H2.812v-1.11h3.53c-.11-.602-.08-1.221.09-1.814H2a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.29a6.756 6.756 0 0 1-2.812-.644Zm0 6.541H2.812v-1.11h6.376v1.11Zm0-2.968H2.812v-1.11h6.376v1.11Z" />
      <path d="M10.836 0A3.641 3.641 0 0 0 7.2 3.638a3.641 3.641 0 0 0 3.636 3.638 3.641 3.641 0 0 0 3.636-3.638A3.641 3.641 0 0 0 10.836 0Zm1.428 4.972-1.674-.844a.549.549 0 0 1-.302-.49V.728h1.096V3.3l1.373.691-.493.981Z" />
    </svg>
  )
}
