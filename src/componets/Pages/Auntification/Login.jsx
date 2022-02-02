import React, {useState} from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import './index.css'
import {connect, useSelector} from 'react-redux';
import {loginHandler} from '../../../redux/actions'
import Loading from '../../Loading/Loading';




//G0g1X0y8
//test@zm.com

const Login =(props)=>{
    
    const [email, setEmail] = useState(reactLocalStorage.get('email') !== null ? reactLocalStorage.get('email') : '');
    const [password, setPassword] = useState(reactLocalStorage.get('password') !== null ? reactLocalStorage.get('password') : '');
    const [lang, setLang] = useState('')
    const loading = useSelector(state => state.auth.loading)
    const token = useSelector(state => state.auth.token)
    const data = useSelector(state => state.auth.loginData)
    const error = useSelector(state => state.auth.loginError);
    
    const handleSubmit = (event, email, password,lang) => {
        event.preventDefault()
        if(!email){
          return
        } else {
          props.loginHandler(email, password,lang)
        }
      }
    
    if (loading){
      return(
        <div className="loader">
          <Loading/>
        </div>
      )
    } else {
       return(
       
        <div>
            <form >
                  <input className="input" onChange={e => setEmail(e.target.value)}   value={email} type="text" name="field" placeholder="Enter email"/>
                  <input className="input" onChange={e => setPassword(e.target.value)}   value={password} type="password" name="field" placeholder="Enter passowrd"/>
            </form>
            <div>
              <select className="select" onChange={e => setLang(e.target.value)} value={lang}> 
                <option selected value="ru">Русский</option>
                <option value="en">English</option>
              </select>
                <button type="submit" onClick={(event) => handleSubmit(event, email, password,lang)} >Submit</button>
              </div>
              <div>
                <Link className="login_link" to="/signup">Signup</Link>
                <Link to="/reset">Password reset</Link>
              </div>
           
        <pre>{JSON.stringify(data,null,2)}</pre>
        </div>
    )
}
}



 
export default connect(null,{loginHandler})(Login);
