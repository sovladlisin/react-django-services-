import axios from 'axios';
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from '../types';

export const login = () => dispatch => {
    dispatch({
        type: LOGIN_REQUEST
    })

    //eslint-disable-next-line no-undef
    VK.Auth.login(r => {
        console.log(r)
        if (r.session) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: r.session
            })
        } else {
            dispatch({
                type: LOGIN_FAIL,
                error: true,
                payload: new Error('Ошибка авторизации')
            })
        }
    }, 4) // запрос прав на доступ к photo
}

export const logout = () => dispatch => {

    //eslint-disable-next-line no-undef
    VK.Auth.logout(r => {
        dispatch({
            type: LOGOUT,
        })
    })
}

export const checkLogin = () => dispatch => {

    //eslint-disable-next-line no-undef
    VK.Auth.getLoginStatus(r => {
        if (r.session) {
        }
        else {
            dispatch({
                type: LOGIN_FAIL,
                error: true,
                payload: new Error('Ошибка авторизации')
            })
        }
    })
}
