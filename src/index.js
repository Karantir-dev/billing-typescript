import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import appReducer from "./redux/appReducer.js";
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { Routers } from './config/Routers.js';


let reducers = combineReducers({
  auth: appReducer,
});
const store = createStore(reducers, compose(applyMiddleware(thunkMiddleware),
              window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routers/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

