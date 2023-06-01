import { Select } from '@components'

export default {
  title: 'Select',
  component: Select,
}

const Template = args => <Select {...args} />

export const LightTheme = Template.bind({})
LightTheme.args = {
  itemsList: [
    { label: 'red', value: 'red' },
    { label: 'blue', value: 'blue' },
  ],
}

export const DarkTheme = Template.bind({})
DarkTheme.args = {
  itemsList: [
    { label: 'red', value: 'red' },
    { label: 'blue', value: 'blue' },
  ],
}
DarkTheme.decorators = [
  Story => (
    <body style={{ backgroundColor: '#ffffff' }} className="dark-theme">
      <Story />
    </body>
  ),
]
