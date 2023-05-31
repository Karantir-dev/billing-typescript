import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16.097 4.5H1.944c-.328-.02-.594.245-.614.572v12.313c-.02.327.245.593.573.614H16.056c.328.02.593-.246.614-.573V5.113c.02-.327-.246-.593-.573-.613Zm-4.03 5.583H5.974c-.327.02-.593-.245-.614-.572V7.915c-.02-.327.246-.593.573-.613h6.095c.327-.02.593.245.614.572V9.47c.02.327-.246.593-.573.613ZM15.647 2.25H2.353v1.227h13.294V2.25ZM14.624 0H3.375v1.227h11.25V0Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
    </svg>
  )
}
