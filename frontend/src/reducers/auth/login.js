import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, URL } from '../../actions/types'

const initialState = {
    user: {},
    error: '', // добавили для сохранения текста ошибки
    isFetching: false // добавили для реакции на статус "загружаю" или нет
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, isFetching: true, error: '' }

        case LOGIN_SUCCESS:
            return { ...state, isFetching: false, user: action.payload }

        case LOGOUT:
            window.location.replace(URL);
            return { ...state, user: {}, error: '' }

        default:
            return state
    }
}