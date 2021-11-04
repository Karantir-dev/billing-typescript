import React from 'react';
import App from '../App';
import { Route, Switch, BrowserRouter as Router,  } from 'react-router-dom';
import Signup from '../componets/Pages/Auntification/Signup.jsx';
import Login from '../componets/Pages/Auntification/Login.jsx';
import PasswordReset from '../componets/Pages/Auntification/PasswordReset';


export const Routers = ()=> {
    return (
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={Signup}/>
            <Route exact path="/reset" component={PasswordReset}/>
        </Switch>
    </Router>)
}