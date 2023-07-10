import * as icons from '@images'

export default function Icon({ name, ...props }) {
  const { [name]: Icon } = icons

  return <>{Icon && <Icon {...props} />}</>
}
