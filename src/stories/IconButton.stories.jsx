import React from 'react'
import { IconButton } from '../Components'

export default {
  title: 'Button With Icon',
  component: IconButton,
}

const Template = args => <IconButton {...args} />

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
