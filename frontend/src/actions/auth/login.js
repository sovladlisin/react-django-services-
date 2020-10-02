import axios from 'axios';
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, URL } from '../types';
import $ from "jquery"
import store from '../../store'


export const login = () => dispatch => {
    dispatch({
        type: LOGIN_REQUEST
    })
    var redirect_uri = "https://oauth.vk.com/authorize?client_id=7613764&display=page&redirect_uri=" + URL + "service-list&scope=notify,ads,offline&response_type=token&v=5.122"
    window.location.replace(redirect_uri);
}

export const extractToken = () => dispatch => {
    var href = window.location.href
    var data = href.split("#access_token=")[1].split('&expires_in=')
    var data2 = data[1].split('&user_id=')[1]

    const access_token = data[0]
    const user_id = data2

    $.ajax({
        url: 'https://api.vk.com/method/users.get?user_ids=' + user_id + '&fields=photo_200' + '&access_token=' + access_token + "&v=5.122",
        type: 'GET',
        dataType: 'jsonp',
    }).done(function (r) {
        const data = r.response[0]
        const name = data.first_name + data.last_name
        const user = { access_token: access_token, name: name, id: data.id, img: data.photo_200 }
        dispatch({
            type: LOGIN_SUCCESS,
            payload: user
        })
    })
}

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
}

export const checkLogin = (user) => dispatch => {
    if (user === undefined) {
        window.location.replace(URL);
    }
}
