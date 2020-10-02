import axios from 'axios';
import { ADD_POST, GET_POSTS, REMOVE_POST } from '../types';
import querystring from 'querystring';

export const getPosts = (user_id) => dispatch => {
    axios.get(`/api/userPosts?` + querystring.stringify({ 'user_id': user_id })).then(res => {
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    }).catch((err) => {
        console.log(err)
    });
}

export const renderPost = (id, user_id) => dispatch => {
    //eslint-disable-next-line no-undef
    VK.Api.call('wall.getById', { posts: id, v: '5.80' }, r => {

        const data = r.response[0]
        var name = ''
        var img = ''

        if (data.owner_id < 0) {
            VK.Api.call('groups.getById', { group_ids: data.owner_id * -1, v: '5.80' }, r => {
                name = r.response[0].name
                img = r.response[0].photo_50

                const obj = {
                    user_id: user_id,
                    post_id: data.id,
                    owner_id: data.owner_id,
                    owner_name: name,
                    owner_img_link: img,
                    from_id: data.from_id,
                    date: data.date,
                    text: data.text,
                    comments_count: data.comments.count,
                    likes_count: data.likes.count,
                    reposts_count: data.reposts.count,
                    views_count: data.views === undefined ? 0 : data.views.count,
                    attachments: JSON.stringify(data.attachments)
                }

                axios.post(`/api/posts/`, obj).then(res => {
                    dispatch({
                        type: ADD_POST,
                        payload: res.data
                    })
                }).catch((err) => {
                    console.log(err)
                });
            })
        }
        else {
            VK.Api.call('users.get', { user_ids: data.owner_id, v: '5.80', fields: 'photo_50' }, r => {
                name = r.response[0].first_name + ' ' + r.response[0].last_name
                img = r.response[0].photo_50

                const obj = {
                    user_id: user_id,
                    post_id: data.id,
                    owner_id: data.owner_id,
                    owner_name: name,
                    owner_img_link: img,
                    from_id: data.from_id,
                    date: data.date,
                    text: data.text,
                    comments_count: data.comments.count,
                    likes_count: data.likes.count,
                    reposts_count: data.reposts.count,
                    views_count: data.views === undefined ? 0 : data.views.count,
                    attachments: JSON.stringify(data.attachments)
                }

                axios.post(`/api/posts/`, obj).then(res => {
                    dispatch({
                        type: ADD_POST,
                        payload: res.data
                    })
                }).catch((err) => {
                    console.log(err)
                });
            })
        }
    })
}

export const deletePost = (id) => dispatch => {
    axios.delete(`/api/posts/${id}/`).then(res => {
        dispatch({
            type: REMOVE_POST,
            payload: id
        })
    }).catch((err) => {
        console.log(err)
    });
}