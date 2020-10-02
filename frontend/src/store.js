import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['router'],
    stateReconciler: autoMergeLevel2
}

const middleware = [thunk];
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = () => {
    const store = createStore(
        persistedReducer,
        composeWithDevTools(applyMiddleware(...middleware))
    );
    const persistor = persistStore(store);
    return { persistor, store };
};
