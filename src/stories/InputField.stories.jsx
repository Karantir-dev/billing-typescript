import React from 'react'
import { InputFieldNew } from '../Components'
import { Formik, Form } from 'formik'

export default {
  title: 'Input field',
  component: InputFieldNew,
}

const Template = args => <InputFieldNew {...args} />

export const InputFieldLight = Template.bind({})

InputFieldLight.args = {
  name: 'inputfield',
  placeholder: 'Input field',
}

InputFieldLight.decorators = [
  InputField => (
    <Formik initialValues={{ inputfield: '' }}>
      {({ errors, touched }) => {
        return (
          <Form>
            <InputField error={!!errors.email} touched={!!touched.email} />
          </Form>
        )
      }}
    </Formik>
  ),
]

export const InputFieldDark = Template.bind({})

InputFieldDark.args = {
  name: 'inputfield',
  placeholder: 'Input field',
}

InputFieldDark.decorators = [
  InputField => (
    <body style={{ backgroundColor: '#ffffff' }} className="dark-theme">
      <Formik initialValues={{ inputfield: '' }}>
        {({ errors, touched }) => {
          return (
            <Form>
              <InputField error={!!errors.email} touched={!!touched.email} />
            </Form>
          )
        }}
      </Formik>
    </body>
  ),
]
