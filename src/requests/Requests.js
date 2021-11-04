import  axios from 'axios';
import qs from 'qs';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Url } from '../config/config';

export const instance = axios.create ({
    baseURL: `https://test.hardsoft.cf`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
   
  });

export const LoginUser =(email, password,lang)=>{
    const data = {  'func': 'auth',
                    'username': email,
                    'password': password,
                    'sok': 'ok',
                    'out': 'json',
                    'lang': lang}
    
    return instance({ method: 'post', url: Url, data: qs.stringify(data)})
};  

