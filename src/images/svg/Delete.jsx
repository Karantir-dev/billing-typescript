import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={17}
      height={20}
      fill={darkTheme ? '#decbfe' : '#ae9ccd'}
      {...props}
    >
      <path d="M14.8 2.6h-3.4V2c0-1-.8-1.9-1.8-1.9H7.2C6.2.1 5.3 1 5.3 2v.6H2C1 2.6.5 3.3.5 4v1.2c0 .4.2.7.6.7h14.6c.4 0 .6-.3.6-.7V4.1c0-.8-.6-1.5-1.5-1.5ZM6.6 2c0-.4.2-.6.6-.6h2.4c.4 0 .6.2.6.6v.6H6.6V2ZM1.6 7.2c-.1 0-.2 0-.2.2L2 18c0 1 .9 1.7 1.9 1.7H13c1 0 1.8-.8 1.9-1.7l.5-10.6-.2-.2H1.6Zm9.2 1.5a.6.6 0 1 1 1.3 0v8a.6.6 0 1 1-1.3 0v-8Zm-3 0a.6.6 0 1 1 1.2 0v8a.6.6 0 1 1-1.2 0v-8Zm-3 0a.6.6 0 1 1 1.1 0v8a.6.6 0 1 1-1.2 0v-8Z" />
    </svg>
  )
}
