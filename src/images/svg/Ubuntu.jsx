import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill={darkTheme ? '#fff' : '#392955'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12.5C22 18.0228 17.5228 22.5 12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5ZM14.2439 5.94351C13.8752 6.58202 14.094 7.39849 14.7325 7.76714C15.371 8.13579 16.1875 7.91701 16.5561 7.2785C16.9248 6.63998 16.706 5.82352 16.0675 5.45487C15.429 5.08622 14.6125 5.30499 14.2439 5.94351ZM5.19999 13.835C5.93729 13.835 6.53498 13.2373 6.53498 12.5C6.53498 11.7627 5.93729 11.165 5.19999 11.165C4.4627 11.165 3.86501 11.7627 3.86501 12.5C3.86501 13.2373 4.4627 13.835 5.19999 13.835ZM14.7325 17.2329C15.371 16.8642 16.1875 17.083 16.5561 17.7215C16.9248 18.36 16.706 19.1765 16.0675 19.5451C15.429 19.9138 14.6125 19.695 14.2439 19.0565C13.8752 18.418 14.094 17.6015 14.7325 17.2329ZM13.5432 6.34656C13.4387 7.08198 13.7798 7.84064 14.4625 8.2348C15.1422 8.62721 15.9654 8.54573 16.5496 8.09288C17.6478 9.23202 18.3232 10.7815 18.3232 12.4888C18.3232 14.2025 17.6427 15.7572 16.5372 16.8976C15.9538 16.4531 15.1374 16.3755 14.4625 16.7651C13.7864 17.1554 13.4454 17.9032 13.5403 18.6318C13.0438 18.7568 12.5241 18.8232 11.9889 18.8232C9.09802 18.8232 6.65946 16.8867 5.89969 14.2401C6.58867 13.9628 7.07502 13.2882 7.07502 12.5C7.07502 11.7096 6.58598 11.0334 5.89399 10.7576C6.64719 8.10075 9.09074 6.15445 11.9889 6.15445C12.5252 6.15445 13.0459 6.2211 13.5432 6.34656ZM10.5979 8.94724L9.4868 7.02274L8.51319 7.58486L9.6243 9.50936L10.5979 8.94724ZM18 13.0621H15.7778V11.9378H18V13.0621ZM8.51321 17.415L9.62432 15.4905L10.5979 16.0526L9.48683 17.9771L8.51321 17.415ZM8.62325 12.4888C8.62325 10.63 10.1301 9.1232 11.9889 9.1232C13.8477 9.1232 15.3545 10.63 15.3545 12.4888C15.3545 14.3476 13.8477 15.8545 11.9889 15.8545C10.1301 15.8545 8.62325 14.3476 8.62325 12.4888Z"
      />
    </svg>
  )
}