import { combineReducers } from 'redux';
import posts from './think_bank/posts'
import login from './auth/login'
import alerts from './alerts/alerts'

export default combineReducers({
    posts,
    login,
    alerts
});