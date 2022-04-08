import React from 'react'
import App from '../App'


describe('App', () => {
  it('Render without crashing', () => {
    const component = shallow(<App />)
    // expect(component).toMatchSnapshot();
  })
})

