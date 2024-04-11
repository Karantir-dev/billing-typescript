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
      <g clipPath="url(#clip0_12496_4265)">
        <path
          d="M20.3892 13.7943C21.2413 13.7274 21.9295 14.2966 21.9951 15.1672C22.0606 16.0712 21.4379 16.8078 20.5859 16.8748C19.7666 16.9418 19.0456 16.3056 18.9801 15.4685C18.9145 14.5645 19.5044 13.8948 20.3892 13.7943Z"
        />
        <path
          d="M10.0337 20.9263C10.0337 20.0557 10.6891 19.386 11.4756 19.386C12.2622 19.386 13.0159 20.1227 13.0159 20.9598C13.0159 21.7634 12.3605 22.4665 11.6067 22.5C10.6564 22.5 10.0337 21.8973 10.0337 20.9263Z"
        />
        <path
          d="M12.3605 11.1492C12.2294 11.2161 12.1638 11.1157 12.1311 11.0152C10.9185 8.70488 11.279 5.79183 13.4092 4.0507C13.9663 3.58194 15.015 3.48149 15.4738 3.95025C15.6704 4.11767 15.7032 4.31857 15.7359 4.55295C15.8015 5.0552 15.8998 5.55745 16.2275 5.95925C16.588 6.39453 17.0468 6.56195 17.5712 6.52847C18.03 6.52847 18.4888 6.4615 18.7837 6.99723C18.9476 7.29858 18.882 8.4705 18.6199 8.70488C18.4888 8.80533 18.3905 8.73836 18.2921 8.70488C17.5384 8.40353 16.7519 8.40353 15.9653 8.53746C15.7032 8.57095 15.5721 8.50398 15.5721 8.20263C15.5393 7.70038 15.441 7.23161 15.1788 6.79633C14.6872 5.89228 13.7696 5.8588 13.1798 6.69588C12.6882 7.36555 12.5571 8.16915 12.426 8.97275C12.2949 9.67589 12.3277 10.4125 12.3605 11.1492Z"
        />
        <path
          d="M13.1796 11.6514C13.1141 11.551 13.1468 11.4505 13.2452 11.3836C15.1131 9.64244 17.8987 9.3076 20.0617 11.0153C20.6188 11.484 20.9793 12.455 20.6843 13.0242C20.5532 13.2586 20.3894 13.3591 20.1928 13.426C19.7339 13.6269 19.3079 13.8278 19.013 14.2631C18.718 14.6984 18.6525 15.2007 18.7836 15.7364C18.8819 16.1717 19.0457 16.6404 18.6197 17.0422C18.3903 17.2766 17.2761 17.4775 16.9811 17.2766C16.85 17.1762 16.8828 17.0757 16.9156 16.9418C17.0139 16.1047 16.8173 15.3346 16.5223 14.598C16.424 14.3301 16.4568 14.1962 16.719 14.1292C17.1778 13.9953 17.6038 13.7609 17.9315 13.426C18.6525 12.7229 18.4886 11.8189 17.5382 11.4171C16.7845 11.0822 15.998 11.1492 15.2442 11.2162C14.5232 11.2496 13.835 11.4505 13.1796 11.6514Z"
        />
        <path
          d="M12.7535 12.522C12.8518 12.4215 12.9174 12.455 13.0157 12.522C15.1786 13.8613 16.2929 16.5065 15.3097 19.0847C15.0475 19.7543 14.1955 20.424 13.5728 20.2566C13.3106 20.1896 13.1796 20.0557 13.0485 19.8883C12.7535 19.4865 12.4258 19.1182 11.9342 18.9507C11.4099 18.7833 10.9511 18.8838 10.4923 19.1516C10.099 19.386 9.70575 19.6874 9.21418 19.386C8.91923 19.2186 8.42766 18.1806 8.52597 17.8458C8.59151 17.7119 8.7226 17.7119 8.85369 17.7119C9.67298 17.5779 10.3284 17.1761 10.9511 16.6404C11.1477 16.473 11.3116 16.473 11.4754 16.7074C11.7376 17.1092 12.0653 17.444 12.4913 17.6784C13.3434 18.1806 14.1627 17.7453 14.261 16.7408C14.3593 15.9038 14.0644 15.1671 13.8022 14.4305C13.5073 13.7608 13.1468 13.1247 12.7535 12.522Z"
        />
        <path
          d="M11.7049 12.7229C11.5738 13.3926 11.2788 14.0288 10.8856 14.598C9.70578 16.4061 8.00165 17.1427 5.90427 16.9418C5.15052 16.8748 4.52785 16.2387 4.46231 15.6025C4.42954 15.3346 4.49508 15.1337 4.65894 14.9328C4.88834 14.6315 5.08497 14.3636 5.18329 13.9953C5.37992 13.2586 5.11774 12.6559 4.5934 12.1202C3.87242 11.3836 3.97074 10.7139 4.8228 10.1782C4.92111 10.1112 5.0522 10.0442 5.18329 9.97727C5.37992 9.87682 5.54378 9.87682 5.60932 10.1112C5.90427 10.8813 6.49416 11.4505 7.14959 11.9193C7.37899 12.1202 7.37899 12.2541 7.18236 12.4885C6.7891 12.9238 6.5597 13.4595 6.52693 14.0622C6.46138 14.7989 6.88742 15.2676 7.60839 15.2676C8.0672 15.2676 8.49323 15.1002 8.88649 14.8993C9.90241 14.3636 10.6889 13.5935 11.4427 12.7899C11.541 12.7564 11.5738 12.6894 11.7049 12.7229Z"
        />
        <path
          d="M6.33061 5.6914C6.39615 5.6914 6.56001 5.72488 6.72387 5.75836C7.93642 5.99275 8.69017 5.55746 9.08343 4.38555C9.34561 3.61543 9.90273 3.38105 10.6237 3.78285C10.6565 3.78285 10.6565 3.81633 10.6892 3.81633C11.443 4.25161 11.443 4.31858 10.9842 4.98825C10.5909 5.52398 10.3943 6.12668 10.296 6.76286C10.2304 7.13118 10.0994 7.19814 9.77164 7.06421C9.24729 6.86331 8.69017 6.86331 8.13305 7.06421C7.51039 7.26511 7.24822 7.83433 7.44485 8.47051C7.70702 9.30759 8.428 9.67591 9.05066 10.1112C9.67332 10.5465 10.3943 10.7809 11.0825 11.0822C11.1808 11.1157 11.3447 11.1157 11.3119 11.2831C11.2791 11.3836 11.1481 11.3836 11.017 11.3836C9.54224 11.4505 8.13305 11.2161 6.98604 10.2116C5.90458 9.30759 5.11806 8.20264 5.24914 6.66241C5.34746 6.16016 5.70795 5.79185 6.33061 5.6914Z"
        />
        <path
          d="M3.64311 15.1002C2.85659 15.2007 2.07007 14.531 2.00453 13.6939C1.93899 12.8903 2.59442 12.0867 3.34817 12.0197C4.20023 11.9193 4.98675 12.522 5.0523 13.3256C5.08507 14.0957 4.59349 15.0332 3.64311 15.1002Z"
        />
        <path
          d="M17.4073 3.18016C18.2265 3.11319 19.0131 3.78286 19.0786 4.61994C19.1442 5.42354 18.4887 6.19365 17.7022 6.26062C16.8501 6.32759 16.0964 5.6914 16.0308 4.85432C15.9653 4.01724 16.5552 3.24712 17.4073 3.18016Z"
        />
        <path
          d="M8.85392 3.81632C8.95223 4.68689 8.36234 5.42352 7.47751 5.55745C6.72376 5.6579 5.93724 5.02172 5.83892 4.28509C5.74061 3.31407 6.26496 2.61092 7.14979 2.51047C7.96908 2.41002 8.7556 3.04621 8.85392 3.81632Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_12496_4265">
          <rect width="20" height="20" fill="white" transform="translate(2 2.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}