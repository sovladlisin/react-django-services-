import { combineReducers } from 'redux';
import posts from './think_bank/posts'
import login from './auth/login'

export default combineReducers({
    posts,
    login
});