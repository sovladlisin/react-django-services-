import { ADD_COMMENT, ADD_POST, ADD_USER_PERMISSION, DELETE_COMMENT, GET_PERMISSIONS, GET_POST, GET_POSTS, GET_POST_COMMENTS, GET_USERS, GET_USER_BANK, GET_USER_BY_VK_ID, PURGE_POSTS, REMOVE_POST, REMOVE_USER_PERMISSION } from "../../actions/types";

const initialState = {
    all: [],
    permissions: [],
    users: [],

    viewed_post: {},

    user_by_vk_id: {},
    comments: {},

    user_bank: []
}

export default function (state = initialState, action) {
    switch (action.type) {

        case ADD_COMMENT:
            var new_comments = { ...state.comments }
            if (Object.keys(new_comments).includes(action.payload.post + ''))
                new_comments[action.payload.post] = [...new_comments[action.payload.post], action.payload]
            else {
                new_comments[action.payload.post] = []
                new_comments[action.payload.post] = [...new_comments[action.payload.post], action.payload]
            }

            return {
                ...state,
                comments: new_comments
            }

        case DELETE_COMMENT:
            var new_comments = { ...state.comments }
            new_comments[action.payload.post] = new_comments[action.payload.post].filter(item => item.id != action.payload.id)
            return {
                ...state,
                comments: new_comments
            }

        case PURGE_POSTS:
            return {
                ...state,
                all: [],
                comments: {}

            }

        case GET_POST_COMMENTS:
            if (action.payload.length != 0) {
                var id = action.payload[0].post
                var new_comments = state.comments
                if (Object.keys(new_comments).includes(id))
                    new_comments[id] = new_comments[id].concat(action.payload)
                else {
                    new_comments[id] = []
                    new_comments[id] = new_comments[id].concat(action.payload)
                }
                return {
                    ...state,
                    comments: new_comments
                }
            }
            return { ...state }


        case GET_POSTS:
            return {
                ...state,
                all: action.payload
            };

        case GET_USER_BANK:
            return {
                ...state,
                user_bank: action.payload
            }

        case ADD_POST:
            return {
                ...state,
                all: [...state.all, action.payload]
            };

        case REMOVE_POST:
            var new_comments = { ...state.comments }
            new_comments[action.payload] = []
            return {
                ...state,
                all: state.all.filter(item => item.id != action.payload),
                comments: new_comments
            }

        case GET_USERS:
            return {
                ...state,
                users: action.payload
            }

        case GET_USER_BY_VK_ID:
            return {
                ...state,
                user_by_vk_id: action.payload
            }

        case GET_POST:
            return {
                ...state,
                viewed_post: action.payload
            }

        case GET_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload
            }

        case ADD_USER_PERMISSION:
            var added_viewers = state.permissions.viewers
            added_viewers.push(action.payload)
            return {
                ...state,
                permissions: { owners: state.permissions.owners, viewers: added_viewers }
            }

        case REMOVE_USER_PERMISSION:
            const removed_viewers = state.permissions.viewers.filter(item => item.id != action.payload)
            return {
                ...state,
                permissions: { owners: state.permissions.owners, viewers: removed_viewers }
            }
        default:
            return state;
    }
}