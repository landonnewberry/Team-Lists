const redux = require('redux');
const thunk = require('redux-thunk');
// const logger = require('redux-logger');
const database = require('./database');
const documentActions = require('./actions/documents');
const documents = require('./reducers/documents');


const configureStore = () => {
    const reducer = redux.combineReducers({
        documents
    });

    const middlewares = [ thunk.default ];

    const store = redux.createStore(
        reducer,
        redux.applyMiddleware(...middlewares)
    );

    if (process.env.NODE_ENV !== 'production') {
        store.subscribe(() => console.log(store.getState()));
    }

    database.loadInitialState().then(data => {
        store.dispatch(documentActions.initialize(data));
    });

    return store;
};

module.exports = configureStore;