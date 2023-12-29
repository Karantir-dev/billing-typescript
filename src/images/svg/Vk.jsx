export default function SvgComponent({ color = '#4C75A3', ...props }) {
  return (
    <svg
      width={32}
      height={32}
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0Zm9.39 21.846-2.76.038s-.594.118-1.373-.42c-1.034-.71-2.006-2.552-2.764-2.317-.758.236-.746 1.895-.746 1.895a.914.914 0 0 1-.17.543c-.16.137-.356.223-.564.247H15.79s-2.737.162-5.127-2.335c-2.627-2.712-4.94-8.129-4.94-8.129s-.137-.314.012-.526c.128-.183.446-.203.606-.21.69-.033 2.766-.02 2.766-.02.174-.004.29.005.506.1a.82.82 0 0 1 .414.446c.32.795.69 1.569 1.11 2.316 1.234 2.132 1.808 2.598 2.227 2.37.609-.332.421-3.012.421-3.012s0-.975-.307-1.407a1.387 1.387 0 0 0-.912-.478c-.166-.023.108-.408.461-.58.531-.262 1.47-.262 2.577-.262.488-.018.975.031 1.449.148 1.019.246.673 1.193.673 3.471 0 .729-.132 1.756.394 2.105.227.146.78.021 2.164-2.328a18.03 18.03 0 0 0 1.148-2.421.88.88 0 0 1 .273-.335.712.712 0 0 1 .403-.07l3.107-.02s.933-.112 1.084.311c.152.423-.35 1.474-1.619 3.158-2.084 2.779-2.316 2.526-.585 4.124 1.652 1.535 1.996 2.282 2.053 2.375.686 1.133-.758 1.223-.758 1.223Z"
        fill={color}
      />
    </svg>
  )
}
