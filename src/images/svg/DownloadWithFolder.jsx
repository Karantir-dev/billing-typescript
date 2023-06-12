export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        className={className}
        fill="#DECBFE"
        d="M19.337 8.682h-6.42L11.77 9.83a1.884 1.884 0 0 1-.219.18h7.122v4.42l-.688-2.425a.663.663 0 0 0-.638-.482H3.317v-3.69h3.798L6.036 6.755a1.86 1.86 0 0 1-.206-.248H2.653a.663.663 0 0 0-.663.663v4.353H.663a.663.663 0 0 0-.638.845l1.913 6.665c.14.487.584.822 1.09.822h15.837c.627 0 1.135-.508 1.135-1.135V9.346a.663.663 0 0 0-.663-.664Z"
      />
      <path
        className={className}
        fill="#DECBFE"
        d="M10.051 8.893a.55.55 0 0 0 .78 0l3.08-3.08a.55.55 0 0 0-.39-.94h-1.346V.879a.733.733 0 0 0-.734-.733H9.44a.733.733 0 0 0-.733.733v3.994H7.361a.55.55 0 0 0-.389.94l3.08 3.08Z"
      />
    </svg>
  )
}
