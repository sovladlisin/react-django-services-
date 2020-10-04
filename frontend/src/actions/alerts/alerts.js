import { CLEAR_ALERTS, CREATE_ALERT } from "../types"


export const createAlert = (message) => dispatch => {
    dispatch({
        type: CREATE_ALERT,
        payload: message
    })
}

export const clearAlerts = () => dispatch => {
    dispatch({
        type: CLEAR_ALERTS
    })
}