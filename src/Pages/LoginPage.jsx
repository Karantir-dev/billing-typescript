import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { authSelectors } from '../Redux/auth/authSelectors'

// import './index.css'
import authOperations from '../Redux/auth/authOperations'

export function LoginPage(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const isLoading = useSelector(authSelectors.getIsLoadding)

  const handleSubmit = event => {
    event.preventDefault()

    dispatch(authOperations.login(email, password))
  }

  return (
    <>
      {isLoading ? <div className="loader">Загружаем...</div> : ''}

      <div>
        <form>
          <input
            className="input"
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="text"
            name="email"
            placeholder="Enter email"
          />
          <input
            className="input"
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            name="password"
            placeholder="Enter passowrd"
          />

          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>

        {/* <select className="select" onChange={e => setLang(e.target.value)} value={lang}>
            <option selected value="ru">
              Русский
            </option>
            <option value="en">English</option>
          </select> */}

        <div>
          <Link className="login_link" to="/signup">
            Signup
          </Link>
          <Link to="/reset">Password reset</Link>
        </div>
      </div>
    </>
  )
}
