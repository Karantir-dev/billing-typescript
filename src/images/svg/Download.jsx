export default function SvgComponent(props) {
  return (
    <svg width={16} height={15} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15 13.42H.79a.79.79 0 0 0 0 1.58H15a.789.789 0 1 0 0-1.58ZM7.894 0a.79.79 0 0 0-.79.79v8.36L4.509 6.545a.793.793 0 0 0-1.122 1.12l3.948 3.948a.79.79 0 0 0 1.12 0l3.948-3.947a.792.792 0 1 0-1.12-1.121L8.683 9.15V.79a.79.79 0 0 0-.79-.79Z"
        fill="#B3A9C1"
      />
    </svg>
  )
}
