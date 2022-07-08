import 'regenerator-runtime/runtime'
import { configure, shallow, render, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import '@testing-library/jest-dom'

configure({ adapter: new Adapter() })

global.shallow = shallow
global.render = render
global.mount = mount

global.console = {
  ...console,
  // uncomment to ignore a specific log level
  //   log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
}

// Fail tests on any warning
// console.error = message => {
//   throw new Error(message)
// }
