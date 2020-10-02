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
            window.location.replace(URL + '#/service-list/');
            return { ...state, isFetching: false, user: action.payload }

        case LOGIN_FAIL:
            window.location.replace(URL + '#/');
            return { ...state, isFetching: false, error: action.payload.message }

        case LOGOUT:
            window.location.replace(URL + '#/');
            return { ...state, user: {}, error: '' }

        default:
            return state
    }
}