import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

const SvgComponent = props => {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg width={21} height={21} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#a)" fill={darkTheme ? '#75707e' : '#D9D0EB'}>
        <path d="M13.66 5.43a2.715 2.715 0 1 0 0-5.43 2.715 2.715 0 0 0 0 5.43ZM7.486 3.084a2.715 2.715 0 0 0-2.694 3.055h5.387a2.715 2.715 0 0 0-2.693-3.055ZM12.835 10.667h5.845V8.421a1 1 0 0 0-1-1H1.91a1 1 0 0 0-1 1v11.58a1 1 0 0 0 1 .999h15.77a1 1 0 0 0 1-1v-2.246h-5.845a2.186 2.186 0 0 1-2.183-2.183v-2.72c0-1.204.98-2.184 2.184-2.184Z" />
        <path d="M19.271 12.033h-6.436a.819.819 0 0 0-.818.82v2.719c0 .452.366.818.819.818h6.435a.819.819 0 0 0 .82-.819v-2.719a.819.819 0 0 0-.82-.819Zm-5.08 3.14a.961.961 0 1 1 0-1.922.961.961 0 0 1 0 1.922Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h21v21H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SvgComponent
