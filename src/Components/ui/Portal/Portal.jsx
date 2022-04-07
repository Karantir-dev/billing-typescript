import ReactDOM from 'react-dom'

export default function Component(props) {
  return ReactDOM.createPortal(props.children, document.getElementById('portal'))
}
