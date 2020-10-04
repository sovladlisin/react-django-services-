import { CLEAR_ALERTS, CREATE_ALERT } from '../../actions/types'

const initialState = {
    alerts: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_ALERT:
            return { ...state, alerts: [...state.alerts, action.payload] }

        case CLEAR_ALERTS:
            return { ...state, alerts: [] }

        default:
            return state
    }
}