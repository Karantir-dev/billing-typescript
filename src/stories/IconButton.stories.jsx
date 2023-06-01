import { Provider } from 'react-redux'
import entireStore from '@redux/store'
import { IconButton } from '@components'

export default {
  title: 'Button With Icon',
  component: IconButton,
}

const Template = args => (
  <Provider store={entireStore.store}>
    <IconButton {...args} />
  </Provider>
)

export const ButtonLight = Template.bind({})

ButtonLight.args = {
  icon: 'calendar',
  type: 'button',
  disabled: false,
}

export const ButtonDark = Template.bind({})

ButtonDark.args = {
  icon: 'calendar',
  type: 'button',
  disabled: false,
}

ButtonDark.decorators = [
  Story => (
    <body style={{ backgroundColor: '#ffffff' }} className="dark-theme">
      <Story />
    </body>
  ),
]
