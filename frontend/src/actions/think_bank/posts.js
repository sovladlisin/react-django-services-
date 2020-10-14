import axios from 'axios';
import { GET_USER, DELETE_COMMENT, ADD_COMMENT, GET_POST_COMMENTS, ADD_POST, ADD_USER_PERMISSION, GET_POSTS, GET_USERS, REMOVE_POST, REMOVE_USER_PERMISSION, GET_PERMISSIONS, GET_POST, GET_USER_BY_VK_ID, URL, PURGE_POSTS, GET_USER_BANK } from '../types';
import querystring from 'querystring';
import { func } from 'prop-types';
import $ from "jquery"


export const getPosts = (user_id) => dispatch => {
    if (user_id === undefined)
        dispatch({
            type: GET_POSTS,
            payload: []
        })
    axios.get(URL + `api/userPosts?` + querystring.stringify({ 'user_id': user_id })).then(res => {
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    }).catch((err) => {
        console.log(err)
    });
}

export const getUserBank = (user_id) => dispatch => {
    if (user_id === undefined)
        dispatch({
            type: GET_USER_BANK,
            payload: []
        })
    axios.get(URL + `api/userPosts?` + querystring.stringify({ 'user_id': user_id })).then(res => {
        dispatch({
            type: GET_USER_BANK,
            payload: res.data
        })
    }).catch((err) => {
        console.log(err)
    });
}

export const getUsers = () => dispatch => {
    axios.get(URL + `api/vkUsers`).then(res => {
        dispatch({
            type: GET_USERS,
            payload: res.data
        })
    }).catch((err) => {
        console.log(err)
    })
}

export const getUser = (id) => dispatch => {
    axios.get(URL + `api/vkUsers/${id}`).then(res => {
        dispatch({
            type: GET_USER,
            payload: res.data
        })
    })
}

export const getUserByVkId = (id) => dispatch => {
    const data = { id: id }
    axios.get(URL + `api/getUserByVkId`, { headers: data }).then(res => {
        dispatch({
            type: GET_USER_BY_VK_ID,
            payload: res.data
        })
    })
}

export const getPostById = (post_id) => dispatch => {
    const data = { id: post_id }
    axios.get(URL + `api/getPostById`, { headers: data }).then(res => {
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    })
}

export const getPostComments = (post_id) => dispatch => {
    const data = { id: post_id }
    axios.get(URL + `api/getPostComments`, { headers: data }).then(res => {
        dispatch({
            type: GET_POST_COMMENTS,
            payload: res.data
        })
    })
}

export const purge = () => dispatch => {
    dispatch({
        type: PURGE_POSTS
    })
}

export const addComment = (date, comment, post_id, user) => dispatch => {
    const body = { post: post_id, user: user.id, comment: comment, date: date }
    axios.post(URL + `api/comments/`, body).then(res => {
        dispatch({
            type: ADD_COMMENT,
            payload: { id: res.data.id, post: post_id, user: user.id, user_img: user.user_img, user_name: user.user_name, comment: comment, date: res.data.date }
        })
    })
}

export const deleteComment = (id, post_id) => dispatch => {
    axios.delete(URL + `api/comments/${id}/`).then(res => {
        dispatch({
            type: DELETE_COMMENT,
            payload: { id: id, post: post_id }
        })
    })
}

export const addUserPermission = (owner_id, viewer_id, user) => dispatch => {
    const body = { owner: owner_id, viewer: viewer_id }
    axios.post(URL + `api/vkPermissions/`, body).then(res => {
        const new_user = { 'id': res.data.id, 'user_name': user.user_name, 'user_id': user.id, 'user_img': user.user_img }
        dispatch({
            type: ADD_USER_PERMISSION,
            payload: new_user
        })
    }).catch((err) => {
        console.log(err)
    })
}

export const removeUserPermission = (id) => dispatch => {
    axios.delete(URL + `api/vkPermissions/${id}/`).then(res => {
        dispatch({
            type: REMOVE_USER_PERMISSION,
            payload: id
        })
    })
}

export const getPermissions = (user_id) => dispatch => {
    var body = { id: user_id }
    axios.get(URL + `api/vkUserPermissions`, { headers: body }).then(res => {
        dispatch({
            type: GET_PERMISSIONS,
            payload: res.data
        })
    })
}

export const renderPost = (post_link, user_id) => dispatch => {
    const body = { user_id: user_id, post_link: post_link }
    axios.post(URL + `api/addPost`, JSON.stringify(body)).then(res => {
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
    })
}

export const deletePost = (id) => dispatch => {
    axios.delete(URL + `api/posts/${id}/`).then(res => {
        dispatch({
            type: REMOVE_POST,
            payload: id
        })
    }).catch((err) => {
        console.log(err)
    });
}


function VK_request_url(name, access_token, params) {
    params.access_token = access_token
    params.v = '5.122'

    const qs = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');

    return `https://api.vk.com/method/` + name + `/?${qs}`
}