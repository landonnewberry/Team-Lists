import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { documents } from './reducers/documents';


export const configureStore = () => {
    const reducer = combineReducers({
        documents
    });

    const middlewares = [];
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(logger);
    }

    const store = createStore(
        reducer,
        applyMiddleware(...middlewares)
    );

    return store;
};