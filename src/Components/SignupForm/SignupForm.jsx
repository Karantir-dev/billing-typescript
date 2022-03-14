import React from 'react'
// import { reactLocalStorage } from 'reactjs-localstorage'
import { Link } from 'react-router-dom'
// import './index.css'
// import { connect, useSelector } from 'react-redux'
// import { loginHandler } from '../../redux/actions'
// import Loading from '../Loading/Loading'
import * as route from '../../routes'
import { ThemeBtn } from '../ThemeBtn/ThemeBtn'

export function SignupForm() {
  //   const [email, setEmail] = useState(
  //     reactLocalStorage.get('email') !== null ? reactLocalStorage.get('email') : '',
  //   )
  //   const [password, setPassword] = useState(
  //     reactLocalStorage.get('password') !== null ? reactLocalStorage.get('password') : '',
  //   )
  //   const [lang, setLang] = useState('')
  //   const loading = useSelector(state => state.auth.loading)

  //   const handleSubmit = (event, email, password, lang) => {
  //     event.preventDefault()
  //   }
  return (
    <div>
      {/* <form>
        <input className="input" type="text" name="field" placeholder="Contact name" />
        <input
          className="input"
          onChange={e => setEmail(e.target.value)}
          value={email}
          type="text"
          name="field"
          placeholder="Enter email"
        />
        <input
          className="input"
          onChange={e => setPassword(e.target.value)}
          value={password}
          type="password"
          name="field"
          placeholder="Enter passowrd"
        />
        <input
          className="input"
          onChange={e => setPassword(e.target.value)}
          value={password}
          type="password"
          name="field"
          placeholder="Repeat passowrd"
        />
      </form>
      <div>
        <button
          type="submit"
          onClick={event => handleSubmit(event, email, password, lang)}
        >
          Submit
        </button>
      </div>
      <div>
        <Link className="login_link" to="/login">
          Login
        </Link>
      </div>

      <pre>{JSON.stringify(null, null, 2)}</pre> */}
      <ThemeBtn></ThemeBtn>
      <Link to={route.LOGIN}>LOGIN</Link>
      <div>SIGNUP PAGE</div>
    </div>
  )
}
