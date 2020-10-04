import axios from 'axios';
import { DELETE_COMMENT, ADD_COMMENT, GET_POST_COMMENTS, ADD_POST, ADD_USER_PERMISSION, GET_POSTS, GET_USERS, REMOVE_POST, REMOVE_USER_PERMISSION, GET_PERMISSIONS, GET_POST, GET_USER_BY_VK_ID, URL, PURGE_POSTS, GET_USER_BANK } from '../types';
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

export const addComment = (comment, post_id, user) => dispatch => {
    const body = { post_id: post_id, user_id: user.id, user_img: user.img, user_name: user.name, comment: comment }
    axios.post(URL + `api/comments/`, body).then(res => {
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
    })
}

export const deleteComment = (id, post_id) => dispatch => {
    axios.delete(URL + `api/comments/${id}/`).then(res => {
        dispatch({
            type: DELETE_COMMENT,
            payload: { id: id, post_id: post_id }
        })
    })
}

export const addUserPermission = (owner_id, viewer_id, user) => dispatch => {
    const body = { owner_id: owner_id, viewer_id: viewer_id }
    axios.post(URL + `api/vkPermissions/`, body).then(res => {
        const new_user = { 'id': res.data.id, 'user_name': user.user_name, 'user_id': user.user_id, 'user_img': user.user_img }
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
        console.log(res.data)
        dispatch({
            type: GET_PERMISSIONS,
            payload: res.data
        })
    })
}

export const renderPost = (id, user_id, access_token) => dispatch => {

    const post = (name, img, wall_data) => {
        console.log(name, img, wall_data)
        const obj = {
            user_id: user_id,
            post_id: wall_data.id,
            owner_id: wall_data.owner_id,
            owner_name: name,
            owner_img_link: img,
            from_id: wall_data.from_id,
            date: wall_data.date,
            text: wall_data.text,
            comments_count: wall_data.comments.count,
            likes_count: wall_data.likes.count,
            reposts_count: wall_data.reposts.count,
            views_count: wall_data.views === undefined ? 0 : wall_data.views.count,
            attachments: JSON.stringify(wall_data.attachments)
        }

        axios.post(URL + `api/posts/`, obj).then(res => {
            dispatch({
                type: ADD_POST,
                payload: res.data
            })
        }).catch((err) => {
            console.log(err)
        });
    }



    $.ajax({
        url: VK_request_url('wall.getById', access_token, { posts: id }),
        type: 'GET',
        dataType: 'jsonp',
        success: function (wall_data) {
            wall_data = wall_data.response[0]
            var name = ''
            var img = ''
            if (wall_data.owner_id < 0) {
                $.ajax({
                    url: VK_request_url('groups.getById', access_token, { group_ids: wall_data.owner_id * -1 }),
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function (group_data) {
                        group_data = group_data.response[0]
                        name = group_data.name
                        img = group_data.photo_50
                        post(name, img, wall_data)
                    }
                })
            }
            else {
                $.ajax({
                    url: VK_request_url('users.get', access_token, { user_ids: wall_data.owner_id, fields: 'photo_50' }),
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function (user_data) {
                        user_data = user_data.response[0]
                        name = user_data.first_name + ' ' + user_data.last_name
                        img = user_data.photo_50
                        post(name, img, wall_data)

                    }
                })
            }

        }
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