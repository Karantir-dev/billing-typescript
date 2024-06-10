/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={darkTheme ? '#fff' : '#392955'}
      {...props}
    >
      <path
        d="M5.25 7.5216C5.60356 7.5 6.03944 7.5 6.6 7.5H11.4C11.9605 7.5 12.3964 7.5 12.75 7.5216M5.25 7.5216C4.80876 7.54853 4.49572 7.60912 4.22852 7.74525C3.80515 7.96095 3.46095 8.30512 3.24524 8.7285C3 9.20985 3 9.83985 3 11.1V12.15C3 13.4102 3 14.0401 3.24524 14.5215C3.46095 14.9449 3.80515 15.2891 4.22852 15.5048C4.70982 15.75 5.33988 15.75 6.6 15.75H11.4C12.6601 15.75 13.2901 15.75 13.7715 15.5048C14.1949 15.2891 14.539 14.9449 14.7547 14.5215C15 14.0401 15 13.4102 15 12.15V11.1C15 9.83985 15 9.20985 14.7547 8.7285C14.539 8.30512 14.1949 7.96095 13.7715 7.74525C13.5043 7.60912 13.1912 7.54853 12.75 7.5216M5.25 7.5216V6C5.25 3.92893 6.92893 2.25 9 2.25C11.071 2.25 12.75 3.92893 12.75 6V7.5216"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
