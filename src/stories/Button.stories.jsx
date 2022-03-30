import React from 'react'
import { Button } from '../Components'

export default {
  title: 'Button',
  component: Button,
}

const Template = args => <Button {...args} />

export const LightTheme = Template.bind({})
LightTheme.args = {
  label: 'Button',
  size: 'block',
  type: 'button',
  disabled: false,
}

export const DarkTheme = Template.bind({})
DarkTheme.args = {
  label: 'Button',
  size: 'block',
  type: 'button',
  disabled: false,
}
DarkTheme.decorators = [
  Story => (
    <body style={{ backgroundColor: '#ffffff' }} className="dark-theme">
      <Story />
    </body>
  ),
]
