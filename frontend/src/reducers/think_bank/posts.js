import { ADD_POST, ADD_USER_PERMISSION, GET_PERMISSIONS, GET_POSTS, GET_USERS, REMOVE_POST, REMOVE_USER_PERMISSION } from "../../actions/types";

const initialState = {
    all: [],
    permissions: [],
    users: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                all: action.payload
            };

        case ADD_POST:
            return {
                ...state,
                all: [...state.all, action.payload]
            };

        case REMOVE_POST:
            return {
                ...state,
                all: state.all.filter(item => item.id != action.payload)
            }

        case GET_USERS:
            return {
                ...state,
                users: action.payload
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