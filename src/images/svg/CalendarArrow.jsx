export default function SvgComponent(props) {
  return (
    <svg
      width={6}
      height={11}
      viewBox="0 0 6 11"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 5.5a.499.499 0 0 1-.146.353l-5 5a.5.5 0 1 1-.707-.707L4.793 5.5.147.853A.5.5 0 1 1 .854.146l5 5A.498.498 0 0 1 6 5.5Z" />
    </svg>
  )
}
