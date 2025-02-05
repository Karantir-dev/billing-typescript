import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  
  return (
    <svg
      width={16}
      height={16}
      fill={darkTheme ? '#fff' : '#392955'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m15.644 6.644-1.872-.46a6.033 6.033 0 0 0-.394-.956l.956-1.594a.466.466 0 0 0-.065-.571L12.937 1.73a.466.466 0 0 0-.571-.065l-1.594.956c-.31-.16-.628-.29-.956-.394L9.366.356A.481.481 0 0 0 8.906 0H7.031a.481.481 0 0 0-.46.356l-.45 1.872a6.037 6.037 0 0 0-.955.394l-1.594-.956A.466.466 0 0 0 3 1.73L1.669 3.062a.466.466 0 0 0-.066.572l.956 1.594c-.159.31-.29.628-.393.956l-1.81.46a.462.462 0 0 0-.356.45v1.875c0 .215.15.403.356.45l1.81.46c.103.327.234.646.393.955l-.956 1.594A.466.466 0 0 0 1.67 13L3 14.331c.15.15.384.178.572.066l1.594-.956c.309.159.628.29.956.393l.45 1.81a.481.481 0 0 0 .46.356h1.874c.216 0 .403-.15.46-.356l.45-1.81c.328-.103.646-.234.956-.393l1.594.956a.467.467 0 0 0 .572-.066L14.268 13a.467.467 0 0 0 .066-.572l-.956-1.594c.16-.309.29-.628.394-.956l1.872-.46a.462.462 0 0 0 .356-.45V7.095a.462.462 0 0 0-.356-.45Zm-7.675 3.731a2.345 2.345 0 1 1 .001-4.69 2.345 2.345 0 0 1-.001 4.69Z" />
    </svg>
  )
}
