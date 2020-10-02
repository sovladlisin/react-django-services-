import { ADD_POST, GET_POSTS, REMOVE_POST } from "../../actions/types";

const initialState = {
    all: [],
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

        default:
            return state;
    }
}